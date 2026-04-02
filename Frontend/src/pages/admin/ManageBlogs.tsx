import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogApi } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, Users } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';

const ManageBlogs = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBlog, setSelectedBlog] = useState<any | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await blogApi.getAll();
            const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setBlogs(Array.isArray(data) ? data : []);
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to fetch blogs');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await blogApi.delete(id);
            setBlogs(blogs.filter(blog => (blog.id || blog._id) !== id));
            toast.success('Blog deleted successfully');
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to delete blog');
        }
    };

    const openViewModal = (blog: any) => {
        setSelectedBlog(blog);
        setIsViewOpen(true);
    };

    return (
        <AdminLayout title="Manage Blogs">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Content Strategy</h1>
                    <p className="text-muted-foreground text-sm font-medium">Create and refine your foundation's stories.</p>
                </div>
                <Button asChild className="rounded-2xl h-12 shadow-xl shadow-primary/20 hover:shadow-primary/30 group">
                    <Link to="/admin/blogs/new">
                        <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        New Story
                    </Link>
                </Button>
            </div>

            <div className="bg-background rounded-[40px] border border-border/50 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center p-24">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="overflow-x-auto thin-scroll">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-border/50 hover:bg-transparent px-6">
                                    <TableHead className="pl-10 font-black uppercase text-[10px] tracking-widest h-16 text-foreground">Visual</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest h-16 text-foreground">Headline</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest h-16 text-foreground">Curator</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest h-16 text-foreground">Publication</TableHead>
                                    <TableHead className="text-right pr-10 font-black uppercase text-[10px] tracking-widest h-16 text-foreground">Management</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {blogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-24 text-muted-foreground italic font-medium">
                                            The archive is currently empty.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    blogs.map((blog) => {
                                        const imageDisplayUrl = getImageUrl(blog.featured_image || blog.featured_image_url || blog.image_file || blog.image) || '/placeholder.svg';

                                        let displayDate = "N/A";
                                        const rawDate = blog.created_at || blog.createdAt || blog.pub_date || blog.updated_at || blog.date || blog.timestamp;

                                        if (rawDate) {
                                            const d = new Date(rawDate);
                                            if (!isNaN(d.getTime())) {
                                                displayDate = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                                            }
                                        }

                                        return (
                                            <TableRow key={blog.id || blog._id} className="cursor-pointer hover:bg-muted/10 transition-colors group px-6 border-b border-border/30" onClick={() => openViewModal(blog)}>
                                                <TableCell className="pl-10 py-6">
                                                    <div className="w-20 h-14 rounded-2xl overflow-hidden bg-muted group-hover:scale-105 transition-transform duration-500 shadow-sm border border-border/50">
                                                        <img
                                                            src={imageDisplayUrl}
                                                            alt={blog.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.onerror = null;
                                                                e.currentTarget.src = '/placeholder.svg';
                                                            }}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-black text-sm max-w-[300px] truncate tracking-tight text-foreground pr-4">
                                                    {blog.title}
                                                </TableCell>
                                                <TableCell className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                                    {typeof blog.author === 'object' ? (blog.author.username || 'Admin') : blog.author || 'Foundation'}
                                                </TableCell>
                                                <TableCell className="text-xs font-bold text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-3.5 h-3.5 text-primary/40" />
                                                        {displayDate}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right pr-10">
                                                    <div className="flex justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 group/btn" asChild>
                                                            <Link to={`/blog/${blog.slug || blog.id}`} target="_blank">
                                                                <Eye className="w-4 h-4 text-muted-foreground group-hover/btn:text-primary transition-colors" />
                                                            </Link>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50 group/btn" asChild>
                                                            <Link to={`/admin/blogs/edit/${blog.id || blog._id}`}>
                                                                <Pencil className="w-4 h-4 text-blue-400 group-hover/btn:text-blue-600 transition-colors" />
                                                            </Link>
                                                        </Button>

                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-red-50 group/btn">
                                                                    <Trash2 className="w-4 h-4 text-red-400 group-hover/btn:text-red-600 transition-colors" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="rounded-[40px] border-none shadow-2xl p-10">
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle className="text-2xl font-black tracking-tight">Erase Entry?</AlertDialogTitle>
                                                                    <AlertDialogDescription className="text-muted-foreground font-medium pt-2">
                                                                        This digital story will be permanently removed from the GauChara archives.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter className="pt-6">
                                                                    <AlertDialogCancel className="rounded-2xl h-12 font-bold px-8 border-2">Keep Entry</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(blog.id || blog._id)} className="bg-red-500 hover:bg-red-600 rounded-2xl h-12 font-bold px-8 shadow-xl shadow-red-500/20">
                                                                        Erase Forever
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto thin-scroll rounded-[40px] border-none shadow-2xl p-0">
                    {selectedBlog && (
                        <div className="space-y-0">
                            <div className="bg-primary/5 p-8 border-b border-primary/10">
                                <div className="max-w-md mx-auto bg-black/5 border border-border/50 rounded-[40px] overflow-hidden shadow-2xl group/prev relative aspect-video flex items-center justify-center">
                                    <img
                                        src={getImageUrl(selectedBlog.featured_image || selectedBlog.featured_image_url || selectedBlog.image_file || selectedBlog.image) || '/placeholder.svg'}
                                        alt={selectedBlog.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover/prev:scale-[1.05]"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <Badge className="bg-primary hover:bg-primary text-white border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30">Official Release</Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 space-y-8">
                                <div className="flex flex-col gap-2 mb-4">
                                    <h3 className="text-3xl font-black text-foreground italic tracking-tight">{selectedBlog.title}</h3>
                                    <p className="text-muted-foreground font-medium italic">Story Transcript & Narrative Blueprint</p>
                                </div>
                                <div className="flex flex-wrap gap-8 items-center justify-between pb-8 border-b border-border/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                                            <Calendar className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">Release Date</p>
                                            <p className="font-bold text-foreground">
                                                {(() => {
                                                    const d = new Date(selectedBlog.created_at || selectedBlog.pub_date || selectedBlog.date);
                                                    return isNaN(d.getTime()) ? "Date Pending" : d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
                                                })()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                                            <Users className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">Author</p>
                                            <p className="font-bold text-foreground">{typeof selectedBlog.author === 'object' ? (selectedBlog.author.username || 'Admin') : selectedBlog.author || 'Foundation'}</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="rounded-2xl h-12 px-6 border-2 font-black text-xs uppercase tracking-widest" asChild>
                                        <Link to={`/admin/blogs/edit/${selectedBlog.id || selectedBlog._id}`}>Edit Post</Link>
                                    </Button>
                                </div>

                                <div className="space-y-10">
                                    <div className="p-8 bg-muted/40 rounded-[32px] border border-border/50 italic text-muted-foreground font-medium text-lg leading-relaxed relative quote-mask">
                                        "{selectedBlog.excerpt || "No summary provided for this entry."}"
                                    </div>
                                    <div className="prose prose-stone max-w-none text-foreground font-medium leading-relaxed">
                                        <div className="whitespace-pre-wrap">{selectedBlog.content}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default ManageBlogs;

