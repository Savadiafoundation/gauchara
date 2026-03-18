import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { testimonialApi } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Loader2, Eye, Star, Quote, MessageSquareQuote } from 'lucide-react';
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

const ManageTestimonials = () => {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTestimonial, setSelectedTestimonial] = useState<any | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const response = await testimonialApi.getAll();
            setTestimonials(response.data);
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to fetch testimonials');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await testimonialApi.delete(id);
            setTestimonials(testimonials.filter(t => (t._id || t.id) !== id));
            toast.success('Testimonial deleted successfully');
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to delete testimonial');
        }
    };

    const openViewModal = (testimonial: any) => {
        setSelectedTestimonial(testimonial);
        setIsViewOpen(true);
    };

    return (
        <AdminLayout title="Social Proof Registry">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Ambassador Endorsements</h1>
                    <p className="text-muted-foreground text-sm font-medium">Curate and manage verified feedback from GauChara stakeholders.</p>
                </div>
                <Button asChild className="rounded-2xl h-12 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 group bg-amber-500 hover:bg-amber-600 border-none">
                    <Link to="/admin/testimonials/new">
                        <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        New Endorsement
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
                                <TableHead className="pl-10 font-black uppercase text-[10px] tracking-widest h-16">Endorser</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest h-16">Designation</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest h-16">Sentimental Rating</TableHead>
                                <TableHead className="text-right pr-10 font-black uppercase text-[10px] tracking-widest h-16">Governance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {testimonials.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-24 text-muted-foreground italic font-medium">
                                        No endorsements recorded in the registry.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                testimonials.map((testimonial) => (
                                    <TableRow key={testimonial._id || testimonial.id} className="cursor-pointer hover:bg-muted/10 transition-colors group px-6 border-b border-border/30" onClick={() => openViewModal(testimonial)}>
                                        <TableCell className="pl-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted group-hover:scale-110 transition-transform duration-500 shadow-sm border border-border/50 shrink-0">
                                                    <img
                                                        src={getImageUrl(testimonial.image) || '/placeholder.svg'}
                                                        alt={testimonial.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = '/placeholder.svg';
                                                        }}
                                                    />
                                                </div>
                                                <span className="font-black text-sm tracking-tight text-foreground">{testimonial.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                            {testimonial.role}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full w-fit border border-amber-500/20">
                                                <span className="text-[10px] font-black">{testimonial.rating}</span>
                                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-10">
                                            <div className="flex justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-amber-50 group/btn" onClick={() => openViewModal(testimonial)}>
                                                    <Eye className="w-4 h-4 text-muted-foreground group-hover/btn:text-amber-500 transition-colors" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50 group/btn" asChild>
                                                    <Link to={`/admin/testimonials/edit/${testimonial._id || testimonial.id}`}>
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
                                                            <AlertDialogTitle className="text-2xl font-black tracking-tight">Expunge Endorsement?</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-muted-foreground font-medium pt-2">
                                                                This stakeholder testimonial will be permanently erased from the foundation's public credibility record.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter className="pt-6">
                                                            <AlertDialogCancel className="rounded-2xl h-12 font-bold px-8 border-2">Keep Endorsement</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(testimonial._id || testimonial.id)} className="bg-red-500 hover:bg-red-600 rounded-2xl h-12 font-bold px-8 shadow-xl shadow-red-500/20 border-none">
                                                                Expunge Record
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
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto rounded-[40px] border-none shadow-2xl p-0 overflow-hidden">
                    <DialogHeader className="bg-amber-500/5 p-12 pb-8 border-b border-amber-500/10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600">
                                <MessageSquareQuote className="w-8 h-8" />
                            </div>
                            <div>
                                <DialogTitle className="text-3xl font-black italic tracking-tighter">Endorsement Brief</DialogTitle>
                                <DialogDescription className="text-muted-foreground font-medium italic mt-1 pb-6">
                                    Official stakeholder sentiment verification.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {selectedTestimonial && (
                        <div className="p-10 space-y-12">
                            <div className="flex items-center gap-8">
                                <div className="w-24 h-24 rounded-[32px] overflow-hidden bg-muted shadow-2xl border-4 border-white shrink-0 relative group">
                                    <img
                                        src={getImageUrl(selectedTestimonial.image) || '/placeholder.svg'}
                                        alt={selectedTestimonial.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => {
                                            e.currentTarget.src = '/placeholder.svg';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-foreground italic tracking-tight">{selectedTestimonial.name}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{selectedTestimonial.role}</p>
                                    <div className="flex items-center gap-1.5 pt-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 shadow-sm ${i < selectedTestimonial.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 pl-2 flex items-center gap-2">
                                    <Quote className="w-3 h-3 text-amber-500/40" />
                                    Endorsement Transcript
                                </h4>
                                <div className="p-10 bg-muted/40 rounded-[40px] border border-border/50 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Star className="w-24 h-24 text-amber-500" />
                                    </div>
                                    <p className="relative z-10 font-bold italic text-xl text-foreground leading-relaxed text-center quote-mask">
                                        "{selectedTestimonial.content}"
                                    </p>
                                </div>
                            </div>

                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 text-right pt-4">
                                ARC_LOG_TRANSCRIPT_{selectedTestimonial.id || selectedTestimonial._id}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default ManageTestimonials;
