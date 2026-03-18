import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { galleryApi } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Loader2, Eye, Image as ImageIcon, Sparkles, Filter } from 'lucide-react';
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
import AdminLayout from '@/components/layout/AdminLayout';

const ManageGallery = () => {
    const [images, setImages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<any | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const response = await galleryApi.getAll();
            setImages(response.data);
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to fetch gallery images');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await galleryApi.delete(id);
            setImages(images.filter(img => (img.id || img._id) !== id));
            toast.success('Image deleted successfully');
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to delete image');
        }
    };

    const openViewModal = (image: any) => {
        setSelectedImage(image);
        setIsViewOpen(true);
    };

    return (
        <AdminLayout title="Visual Evidence Archive">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Aesthetic Assets</h1>
                    <p className="text-muted-foreground text-sm font-medium">Manage and curate high-resolution visual records of our impact.</p>
                </div>
                <Button asChild className="rounded-2xl h-12 shadow-xl shadow-primary/20 hover:shadow-primary/30 group">
                    <Link to="/admin/gallery/new">
                        <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Add Capture
                    </Link>
                </Button>
            </div>

            <div className="bg-background rounded-[40px] border border-border/50 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center p-24">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-border/50 hover:bg-transparent px-6 text-foreground">
                                <TableHead className="pl-10 font-black uppercase text-[10px] tracking-widest h-16">Visual Artifact</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest h-16">Taxonomy</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest h-16">Narrative Caption</TableHead>
                                <TableHead className="text-right pr-10 font-black uppercase text-[10px] tracking-widest h-16">Curation</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {images.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-24 text-muted-foreground italic font-medium">
                                        The gallery archive is currently vacant.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                images.map((img) => (
                                    <TableRow key={img.id || img._id} className="cursor-pointer hover:bg-muted/10 transition-colors group px-6 border-b border-border/30" onClick={() => openViewModal(img)}>
                                        <TableCell className="pl-10 py-6">
                                            <div className="w-24 h-16 rounded-2xl overflow-hidden bg-muted group-hover:scale-105 transition-transform duration-500 shadow-sm border border-border/50">
                                                <img
                                                    src={getImageUrl(img.image)}
                                                    alt={img.description}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.onerror = null;
                                                        e.currentTarget.src = '/placeholder.svg';
                                                    }}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-widest border-border/60 capitalize">
                                                <Filter className="w-3 h-3 mr-1.5 opacity-50" />
                                                {img.category_name}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-md truncate font-bold text-sm text-foreground tracking-tight">
                                            {img.caption}
                                        </TableCell>
                                        <TableCell className="text-right pr-10">
                                            <div className="flex justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 group/btn" onClick={() => openViewModal(img)}>
                                                    <Eye className="w-4 h-4 text-muted-foreground group-hover/btn:text-primary transition-colors" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50 group/btn" asChild>
                                                    <Link to={`/admin/gallery/edit/${img.id || img._id}`}>
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
                                                            <AlertDialogTitle className="text-2xl font-black tracking-tight">Erase Visual Artifact?</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-muted-foreground font-medium pt-2">
                                                                This high-resolution capture will be permanently deleted from the foundation's public visual archive.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter className="pt-6">
                                                            <AlertDialogCancel className="rounded-2xl h-12 font-bold px-8 border-2">Keep Capture</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(img.id || img._id)} className="bg-red-500 hover:bg-red-600 rounded-2xl h-12 font-bold px-8 shadow-xl shadow-red-500/20 border-none">
                                                                Erase Permanently
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>

            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] border-none shadow-2xl p-0 overflow-hidden">
                    <DialogHeader className="bg-primary/5 p-12 pb-8 border-b border-primary/10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-primary/10 rounded-2xl">
                                <ImageIcon className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-3xl font-black italic tracking-tighter">Capture Blueprint</DialogTitle>
                                <DialogDescription className="text-muted-foreground font-medium italic mt-1 pb-6">
                                    Strategic visual asset inspection.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {selectedImage && (
                        <div className="p-10 space-y-10">
                            <div className="w-full bg-black/5 border border-border/50 rounded-[32px] overflow-hidden shadow-2xl group/prev relative aspect-video flex items-center justify-center">
                                <img
                                    src={getImageUrl(selectedImage.image)}
                                    alt={selectedImage.caption}
                                    className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover/prev:scale-[1.02]"
                                    onError={(e) => {
                                        e.currentTarget.src = '/placeholder.svg';
                                    }}
                                />
                                <div className="absolute top-6 right-6">
                                    <Badge className="bg-white/90 backdrop-blur shadow-xl text-primary border-none rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">Hi-Res Certified</Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-8 bg-muted/40 rounded-[32px] border border-border/50 space-y-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Filter className="w-4 h-4 text-primary" />
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Asset Taxonomy</h4>
                                    </div>
                                    <p className="font-black text-foreground tracking-tight text-xl italic uppercase underline decoration-primary/20 underline-offset-4">{selectedImage.category_name}</p>
                                </div>
                                <div className="p-8 bg-muted/40 rounded-[32px] border border-border/50 space-y-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Asset Identifier</h4>
                                    </div>
                                    <p className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-widest">UID_ARC_{selectedImage.id || selectedImage._id}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 pl-2">Narrative Metadata</h4>
                                <div className="p-8 bg-muted/40 rounded-[32px] border border-border/50 italic text-muted-foreground font-medium text-lg leading-relaxed relative quote-mask">
                                    "{selectedImage.caption || "No narrative attached to this record."}"
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default ManageGallery;
