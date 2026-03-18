import { useState, useEffect } from 'react';
import { contactApi, ContactMessage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2, Eye, Mail, Phone, MessageCircle, Download } from 'lucide-react';
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
import AdminLayout from '@/components/layout/AdminLayout';
import { exportToCSV } from '@/lib/exportUtils';

const ManageContacts = () => {
    const [contacts, setContacts] = useState<ContactMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await contactApi.getAll();
            setContacts(response.data);
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to fetch contacts');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number | string) => {
        try {
            await contactApi.delete(id);
            setContacts(contacts.filter(contact => String(contact.id) !== String(id)));
            toast.success('Contact message deleted successfully');
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to delete contact message');
        }
    };

    const openViewModal = (contact: ContactMessage) => {
        setSelectedContact(contact);
        setIsViewOpen(true);
    };

    const handleExport = () => {
        const exportData = contacts.map(c => ({
            'Name': c.name,
            'Email': c.email,
            'Phone': c.phone,
            'Subject': c.subject,
            'Message': c.message,
            'Date': new Date(c.created_at).toLocaleString()
        }));
        exportToCSV(exportData, 'GauChara_Contact_Messages');
    };

    return (
        <AdminLayout title="Communications Hub">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Inquiry Registry</h1>
                    <p className="text-muted-foreground text-sm font-medium">Manage incoming communications and stakeholder engagement.</p>
                </div>
                <Button 
                    variant="outline" 
                    className="rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] h-12 gap-2 hover:bg-primary/5 group"
                    onClick={handleExport}
                >
                    <Download className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    Export to Excel
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
                                <TableHead className="pl-10 font-black uppercase text-[10px] tracking-widest h-16">Stakeholder</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest h-16">Digital Address</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest h-16">Intelligence Topic</TableHead>
                                <TableHead className="text-right pr-10 font-black uppercase text-[10px] tracking-widest h-16">Operations</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contacts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-24 text-muted-foreground italic font-medium">
                                        The communication queue is clear.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                contacts.map((contact) => (
                                    <TableRow key={contact.id} className="cursor-pointer hover:bg-muted/10 transition-colors group px-6 border-b border-border/30" onClick={() => openViewModal(contact)}>
                                        <TableCell className="pl-10 py-6">
                                            <span className="font-black text-sm tracking-tight text-foreground">{contact.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                                                <Mail className="w-3.5 h-3.5 opacity-50" />
                                                <span className="text-xs font-bold">{contact.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-[300px] truncate">
                                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{contact.subject}</span>
                                        </TableCell>
                                        <TableCell className="text-right pr-10">
                                            <div className="flex justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 group/btn" onClick={() => openViewModal(contact)}>
                                                    <Eye className="w-4 h-4 text-muted-foreground group-hover/btn:text-primary transition-colors" />
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-red-50 group/btn">
                                                            <Trash2 className="w-4 h-4 text-red-400 group-hover/btn:text-red-600 transition-colors" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="rounded-[40px] border-none shadow-2xl p-10">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle className="text-2xl font-black tracking-tight">Purge Communication?</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-muted-foreground font-medium pt-2">
                                                                This inquiry record will be permanently erased from the operational database.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter className="pt-6">
                                                            <AlertDialogCancel className="rounded-2xl h-12 font-bold px-8 border-2">Keep Record</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(contact.id)} className="bg-red-500 hover:bg-red-600 rounded-2xl h-12 font-bold px-8 shadow-xl shadow-red-500/20 border-none">
                                                                Erase Record
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
                    <DialogHeader className="bg-primary/5 p-12 pb-8 border-b border-primary/10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-primary/10 rounded-2xl">
                                <MessageCircle className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-3xl font-black italic tracking-tighter">Inquiry Brief</DialogTitle>
                                <DialogDescription className="text-muted-foreground font-medium italic mt-1 pb-6">
                                    Strategic communication analysis.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {selectedContact && (
                        <div className="p-10 space-y-10">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Stakeholder</h4>
                                    <p className="font-black text-foreground tracking-tight text-xl italic">{selectedContact.name}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Subject Core</h4>
                                    <p className="font-bold text-primary uppercase tracking-widest text-[10px] bg-primary/5 px-3 py-1.5 rounded-full inline-block">{selectedContact.subject}</p>
                                </div>
                                <div className="space-y-4 col-span-2 bg-muted/30 p-6 rounded-3xl border border-border/50">
                                    <div className="flex items-center gap-4">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <a href={`mailto:${selectedContact.email}`} className="font-bold text-foreground hover:text-primary transition-colors">{selectedContact.email}</a>
                                    </div>
                                    {selectedContact.phone && (
                                        <div className="flex items-center gap-4">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-bold text-foreground">{selectedContact.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 pl-2">Intelligence Content</h4>
                                <div className="p-8 bg-muted/40 rounded-[32px] border border-border/50 italic text-muted-foreground font-medium text-lg leading-relaxed relative quote-mask">
                                    "{selectedContact.message}"
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default ManageContacts;
