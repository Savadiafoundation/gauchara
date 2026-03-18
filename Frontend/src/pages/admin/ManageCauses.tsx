import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '@/lib/utils';
import { causeApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Loader2, Eye, Heart, Target } from 'lucide-react';
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

const ManageCauses = () => {
    const [causes, setCauses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCause, setSelectedCause] = useState<any | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    useEffect(() => {
        fetchCauses();
    }, []);

    const fetchCauses = async () => {
        try {
            const response = await causeApi.getAll();
            setCauses(response.data);
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to fetch causes');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string | number) => {
        try {
            await causeApi.delete(String(id));
            setCauses(causes.filter(cause => (cause.id || cause._id) !== id));
            toast.success('Cause deleted successfully');
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to delete cause');
        }
    };

    const openViewModal = (cause: any) => {
        setSelectedCause(cause);
        setIsViewOpen(true);
    };

    return (
        <AdminLayout title="Manage Causes">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Philanthropic Goals</h1>
                    <p className="text-muted-foreground text-sm font-medium">Coordinate and track your foundation's impact missions.</p>
                </div>
                <Button asChild className="rounded-2xl h-12 shadow-xl shadow-rose-500/20 hover:shadow-rose-500/30 group bg-rose-500 hover:bg-rose-600 border-none">
                    <Link to="/admin/causes/new">
                        <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Create Mission
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
                                <TableHead className="pl-10 font-black uppercase text-[10px] tracking-widest h-16">Cause / Mission</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest h-16">Domain</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest h-16">Financial Goal</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest h-16">Priority</TableHead>
                                <TableHead className="text-right pr-10 font-black uppercase text-[10px] tracking-widest h-16">Governance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {causes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-24 text-muted-foreground italic font-medium">
                                        No active missions at this time.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                causes.map((cause) => (
                                    <TableRow key={cause.id || cause._id} className="cursor-pointer hover:bg-muted/10 transition-colors group px-6 border-b border-border/30" onClick={() => openViewModal(cause)}>
                                        <TableCell className="pl-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 rounded-2xl overflow-hidden bg-muted group-hover:scale-105 transition-transform duration-500 shadow-sm border border-border/50 shrink-0">
                                                    <img
                                                        src={getImageUrl(cause.image_file || cause.image || cause.image_url)}
                                                        alt={cause.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.currentTarget.onerror = null;
                                                            e.currentTarget.src = '/placeholder.svg';
                                                        }}
                                                    />
                                                </div>
                                                <span className="font-black text-sm tracking-tight text-foreground truncate max-w-[200px]">{cause.title}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-widest border-border/60">{cause.category}</Badge>
                                        </TableCell>
                                        <TableCell className="font-bold text-foreground">
                                            <div className="flex items-center gap-2">
                                                <Target className="w-3.5 h-3.5 text-rose-500/40" />
                                                <span>₹{Number(cause.goal_amount).toLocaleString()}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {cause.featured ? (
                                                <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-widest">High Priority</Badge>
                                            ) : (
                                                <span className="text-muted-foreground text-[10px] font-black uppercase tracking-widest pl-3">Standard</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right pr-10">
                                            <div className="flex justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-rose-50 group/btn" onClick={() => openViewModal(cause)}>
                                                    <Eye className="w-4 h-4 text-muted-foreground group-hover/btn:text-rose-500 transition-colors" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50 group/btn" asChild>
                                                    <Link to={`/admin/causes/edit/${cause.id || cause._id}`}>
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
                                                            <AlertDialogTitle className="text-2xl font-black tracking-tight">Decommission Mission?</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-muted-foreground font-medium pt-2">
                                                                This cause will be permanently archived and removed from public accessibility.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter className="pt-6">
                                                            <AlertDialogCancel className="rounded-2xl h-12 font-bold px-8 border-2">Keep Mission</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(cause.id || cause._id)} className="bg-red-500 hover:bg-red-600 rounded-2xl h-12 font-bold px-8 shadow-xl shadow-red-500/20 border-none">
                                                                Decommission
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
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[40px] border-none shadow-2xl p-0">
                    {selectedCause && (
                        <div className="space-y-0">
                            <div className="relative aspect-video w-full">
                                <img
                                    src={getImageUrl(selectedCause.image_file || selectedCause.image || selectedCause.image_url) || '/placeholder.svg'}
                                    alt={selectedCause.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-12">
                                    <div className="space-y-4">
                                        <Badge className="bg-rose-500 hover:bg-rose-500 text-white border-none px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/30">Active Mission</Badge>
                                        <h3 className="text-3xl font-black text-white italic tracking-tight">{selectedCause.title}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="p-12 space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-border/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                                            <Target className="w-6 h-6 text-rose-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">Financial Goal</p>
                                            <p className="font-bold text-foreground text-xl">₹{Number(selectedCause.goal_amount).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                                            <Plus className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">Domain</p>
                                            <p className="font-bold text-foreground">{selectedCause.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <Button variant="outline" className="rounded-2xl h-12 px-8 border-2 font-black text-xs uppercase tracking-widest" asChild>
                                            <Link to={`/admin/causes/edit/${selectedCause.id || selectedCause._id}`}>Edit Goal</Link>
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div className="p-8 bg-muted/40 rounded-[32px] border border-border/50 italic text-muted-foreground font-medium text-lg leading-relaxed relative quote-mask">
                                        "{selectedCause.short_description || "No mission brief provided."}"
                                    </div>
                                    <div className="prose prose-stone max-w-none text-foreground font-medium leading-relaxed">
                                        <div className="whitespace-pre-wrap">{selectedCause.full_content || "No detailed implementation plan recorded."}</div>
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

export default ManageCauses;
