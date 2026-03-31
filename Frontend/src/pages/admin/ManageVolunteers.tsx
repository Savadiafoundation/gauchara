import { useState, useEffect } from 'react';
import { volunteerApi, VolunteerApplication } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2, Eye, UserCheck, Mail, Phone, MapPin, Briefcase, Clock, Sparkles, Download } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/layout/AdminLayout';
import { exportToCSV } from '@/lib/exportUtils';

const ManageVolunteers = () => {
    const [volunteers, setVolunteers] = useState<VolunteerApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerApplication | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const fetchVolunteers = async () => {
        try {
            const response = await volunteerApi.getAll();
            setVolunteers(response.data);
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to fetch volunteers');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number | undefined) => {
        if (!id) return;
        try {
            await volunteerApi.delete(id);
            setVolunteers(volunteers.filter(vol => vol.id !== id));
            toast.success('Volunteer application deleted successfully');
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to delete volunteer application');
        }
    };

    const openViewModal = (volunteer: VolunteerApplication) => {
        setSelectedVolunteer(volunteer);
        setIsViewOpen(true);
    };

    const handleExport = () => {
        const exportData = volunteers.map(v => ({
            'Full Name': v.full_name,
            'Email': v.email,
            'Phone': v.phone,
            'Age': v.age,
            'Occupation': v.occupation,
            'Availability': v.availability,
            'Skills': v.skills,
            'Reason': v.reason,
            'Status': v.status,
            'Address': v.address,
            'Date': new Date(v.created_at || '').toLocaleString()
        }));
        exportToCSV(exportData, 'GauChara_Volunteers');
    };

    const getStatusStyles = (status?: string) => {
        switch(status) {
            case 'approved': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'rejected': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
            default: return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
        }
    };

    return (
        <AdminLayout title="Volunteer Management">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Volunteer Applications</h1>
                    <p className="text-muted-foreground text-sm font-medium">Review and manage volunteer applications for GauChara.</p>
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
                    <div className="overflow-x-auto thin-scroll">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-b border-border/50 hover:bg-transparent px-6 text-foreground">
                                    <TableHead className="pl-10 font-black uppercase text-[10px] tracking-widest h-16 text-foreground">Volunteer Name</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest h-16 text-foreground">Contact Info</TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest h-16 text-foreground">Application Status</TableHead>
                                    <TableHead className="text-right pr-10 font-black uppercase text-[10px] tracking-widest h-16 text-foreground">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                        <TableBody>
                            {volunteers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-24 text-muted-foreground italic font-medium">
                                        No volunteer applications found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                volunteers.map((volunteer) => (
                                    <TableRow key={volunteer.id} className="cursor-pointer hover:bg-muted/10 transition-colors group px-6 border-b border-border/30" onClick={() => openViewModal(volunteer)}>
                                        <TableCell className="pl-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-black text-primary text-xs shadow-inner uppercase tracking-tighter">
                                                    {volunteer.full_name?.substring(0, 2)}
                                                </div>
                                                <span className="font-black text-sm tracking-tight text-foreground">{volunteer.full_name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-foreground truncate max-w-[180px]">{volunteer.email}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{volunteer.phone}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`rounded-full px-4 py-1 font-black text-[10px] uppercase tracking-[0.15em] border-none shadow-sm ${getStatusStyles(volunteer.status)}`}>
                                                {volunteer.status || 'Evaluation'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-10">
                                            <div className="flex justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 group/btn" onClick={() => openViewModal(volunteer)}>
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
                                                            <AlertDialogTitle className="text-2xl font-black tracking-tight">Delete Application?</AlertDialogTitle>
                                                            <AlertDialogDescription className="text-muted-foreground font-medium pt-2">
                                                                Are you sure you want to delete this volunteer application? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter className="pt-6">
                                                            <AlertDialogCancel className="rounded-2xl h-12 font-bold px-8 border-2">Cancel</AlertDialogCancel>
                                                            <AlertDialogAction 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(volunteer.id);
                                                                }} 
                                                                className="bg-red-500 hover:bg-red-600 rounded-2xl h-12 font-bold px-8 shadow-xl shadow-red-500/20 border-none"
                                                            >
                                                                Delete
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
                    </div>
                )}
            </div>

            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto thin-scroll rounded-[40px] border-none shadow-2xl p-0">
                    <DialogHeader className="bg-primary/5 p-6 pb-2 border-b border-primary/10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-primary/10 rounded-2xl">
                                <UserCheck className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-3xl font-black italic tracking-tighter text-primary">Volunteer Profile</DialogTitle>
                                <DialogDescription className="text-muted-foreground font-medium italic mt-1 pb-4">
                                    Details of the volunteer application.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {selectedVolunteer && (
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Full Name</h4>
                                    <p className="font-black text-foreground tracking-tight text-xl truncate max-w-full">{selectedVolunteer.full_name}</p>
                                </div>
                                <div className="space-y-1 md:text-right lg:text-left">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Status</h4>
                                    <Badge className={`rounded-xl px-3 py-1 font-black text-[10px] uppercase tracking-widest border-none shadow-sm ${getStatusStyles(selectedVolunteer.status)}`}>
                                        {selectedVolunteer.status || 'Pending'}
                                    </Badge>
                                </div>
                                <div className="space-y-1 text-right">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Age</h4>
                                    <p className="font-black text-foreground tracking-tight">{selectedVolunteer.age || "N/A"}</p>
                                </div>
                                <div className="space-y-4 col-span-1 md:col-span-2 bg-muted/30 p-6 rounded-3xl border border-border/50">
                                    <div className="flex items-start gap-4 overflow-hidden">
                                        <Mail className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                                        <a href={`mailto:${selectedVolunteer.email}`} className="font-bold text-foreground hover:text-primary transition-colors break-all whitespace-normal">{selectedVolunteer.email}</a>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Phone className="w-4 h-4 text-muted-foreground" />
                                        <span className="font-bold text-foreground">{selectedVolunteer.phone}</span>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                                        <span className="text-xs font-semibold text-muted-foreground leading-relaxed">{selectedVolunteer.address || "No address provided."}</span>
                                    </div>
                                </div>
                                <div className="space-y-4 bg-primary/5 p-6 rounded-3xl border border-primary/10">
                                    <div className="flex items-center gap-3">
                                        <Briefcase className="w-4 h-4 text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest italic">{selectedVolunteer.occupation || "Independent"}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest italic">{selectedVolunteer.availability || "On-Call"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 pl-2">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Skills & Experience</h4>
                                    </div>
                                    <div className="p-6 bg-muted/40 rounded-[32px] border border-border/50 italic text-muted-foreground font-medium text-sm leading-relaxed">
                                        {selectedVolunteer.skills || "No skills listed."}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 pl-2">Reason for Volunteering</h4>
                                    <div className="p-6 bg-muted/40 rounded-[32px] border border-border/50 italic text-muted-foreground font-medium text-sm leading-relaxed relative quote-mask">
                                        "{selectedVolunteer.reason || "Not specified."}"
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

export default ManageVolunteers;
