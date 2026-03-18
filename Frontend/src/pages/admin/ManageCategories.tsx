import { useState, useEffect } from 'react';
import { categoryApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Pencil, Trash2, Loader2, Tag, Hash, FileText } from 'lucide-react';
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import AdminLayout from '@/components/layout/AdminLayout';

const ManageCategories = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', slug: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await categoryApi.getAll();
            setCategories(response.data);
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to fetch categories');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!id) {
            console.error("Attempted to delete category with undefined ID");
            toast.error("Error: Generic ID missing");
            return;
        }
        try {
            await categoryApi.delete(id);
            setCategories(categories.filter(cat => (cat.id || cat._id) !== id));
            toast.success('Category deleted successfully');
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to delete category');
        }
    };

    const handleOpenDialog = (category: any = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, slug: category.slug });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', slug: '' });
        }
        setIsDialogOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === 'name' && !editingCategory) {
                newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }
            return newData;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (editingCategory) {
                const response = await categoryApi.update(editingCategory.id || editingCategory._id, formData);
                toast.success('Category updated successfully');
                setCategories(categories.map(cat =>
                    (cat.id || cat._id) === (editingCategory.id || editingCategory._id) ? response.data : cat
                ));
            } else {
                const response = await categoryApi.create(formData);
                toast.success('Category created successfully');
                setCategories([...categories, response.data]);
            }
            setIsDialogOpen(false);
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to save category');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout title="Taxonomy Configurator">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground uppercase italic underline decoration-primary/20 underline-offset-8">Category Matrix</h1>
                    <p className="text-muted-foreground text-sm font-medium mt-2">Architectural classification system for blog and media content.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="rounded-2xl h-12 shadow-xl shadow-primary/20 hover:shadow-primary/30 group px-8">
                    <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                    New Taxonomy
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
                                <TableHead className="pl-10 font-black uppercase text-[10px] tracking-widest h-16">Node Designation</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest h-16">URI Identifier (Slug)</TableHead>
                                <TableHead className="text-right pr-10 font-black uppercase text-[10px] tracking-widest h-16">Matrix Controls</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center py-24 text-muted-foreground italic font-medium uppercase tracking-[0.2em] opacity-40">
                                        The taxonomy matrix is empty.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <TableRow key={category.id || category._id} className="hover:bg-muted/10 transition-colors group px-6 border-b border-border/30">
                                        <TableCell className="pl-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                                                    <Tag className="w-4 h-4 text-primary" />
                                                </div>
                                                <span className="font-black text-sm tracking-tighter text-foreground uppercase">{category.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 group/slug cursor-default">
                                                <Hash className="w-3 h-3 text-muted-foreground/40" />
                                                <span className="text-xs font-mono font-bold text-muted-foreground group-hover/slug:text-primary transition-colors">{category.slug}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-10">
                                            <div className="flex justify-end gap-3">
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-blue-50 group/btn" onClick={() => handleOpenDialog(category)}>
                                                    <Pencil className="w-4 h-4 text-blue-400 group-hover/btn:text-blue-600 transition-colors" />
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-red-50 group/btn">
                                                            <Trash2 className="w-4 h-4 text-red-400 group-hover/btn:text-red-600 transition-colors" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="rounded-[40px] border-none shadow-2xl p-10">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-2xl font-black tracking-tight">Expunge Node?</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-muted-foreground font-medium pt-2 italic">
                                                                Removing this classification node may affect historical record organization. Proceed with extreme caution.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter className="pt-6">
                                                            <AlertDialogCancel className="rounded-2xl h-12 font-bold px-8 border-2 uppercase tracking-widest text-[10px]">Decline</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(category.id || category._id)} className="bg-red-500 hover:bg-red-600 rounded-2xl h-12 font-bold px-8 shadow-xl shadow-red-500/20 border-none uppercase tracking-widest text-[10px]">
                                                                Expunge
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="rounded-[40px] border-none shadow-2xl p-0 overflow-hidden">
                    <DialogHeader className="bg-primary/5 p-12 pb-8 border-b border-primary/10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-primary/10 rounded-2xl">
                                <FileText className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase underline decoration-primary/10">Taxonomy Node</DialogTitle>
                                <DialogDescription className="text-muted-foreground font-medium italic mt-1 pb-6 uppercase tracking-widest text-[10px]">
                                    {editingCategory ? 'Configuration Mode' : 'Creation Mode'}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="p-10 space-y-8">
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 pl-2">Node Designation</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g., PHLANTHROPY"
                                    className="rounded-2xl h-14 border-2 focus:border-primary px-6 font-bold uppercase tracking-widest"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="slug" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 pl-2">Matrix URI Slug</Label>
                                <div className="relative group">
                                    <Hash className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        id="slug"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        placeholder="philanthropy-sector"
                                        className="rounded-2xl h-14 border-2 focus:border-primary pl-14 pr-6 font-mono font-bold text-xs"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="pt-4 gap-4">
                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] px-8">
                                Abort
                            </Button>
                            <Button type="submit" disabled={isSubmitting} className="rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] px-10 shadow-xl shadow-primary/20">
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
                                        Processing...
                                    </>
                                ) : (
                                    'Apply Config'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default ManageCategories;
