import { useState, useEffect } from 'react';
import { donationApi, DonationRecord } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Loader2, Eye, ExternalLink, HeartHandshake, Calendar, CreditCard, MapPin, Download } from 'lucide-react';
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
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getImageUrl } from '@/lib/utils';
import AdminLayout from '@/components/layout/AdminLayout';
import { exportToCSV } from '@/lib/exportUtils';

const ManageDonations = () => {
    const [donations, setDonations] = useState<DonationRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDonation, setSelectedDonation] = useState<DonationRecord | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await donationApi.getAll();
            setDonations(response.data);
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to fetch donations');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            await donationApi.updateStatus(id, { payment_status: newStatus });
            setDonations(donations.map(donation => 
                donation.id === id ? { ...donation, payment_status: newStatus as any } : donation
            ));
            toast.success(`Status updated to ${newStatus}`);
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to update status');
        }
    };

    const openViewModal = (donation: DonationRecord) => {
        setSelectedDonation(donation);
        setIsViewOpen(true);
    };

    const handleExport = () => {
        const exportData = donations.map(d => ({
            'Donor Name': d.full_name,
            'Email': d.email,
            'WhatsApp': d.whatsapp_number,
            'Region': d.region,
            'Amount (₹)': d.final_amount,
            'Type': d.selected_amount ? 'Tiered' : 'Custom',
            'PAN': d.pan_number,
            'Status': d.payment_status,
            'Date': new Date(d.created_at).toLocaleString()
        }));
        exportToCSV(exportData, 'GauChara_Donations');
    };

    const getStatusStyles = (status: string) => {
        switch(status) {
            case 'success': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'failed': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
            default: return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
        }
    };

    return (
        <AdminLayout title="Donation Intelligence">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">Financial Registry</h1>
                    <p className="text-muted-foreground text-sm font-medium">Verified donation intents and completed transactions.</p>
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
                            <TableRow className="border-b border-border/50 hover:bg-transparent px-6">
                                <TableHead className="pl-10 font-black uppercase text-[10px] tracking-widest h-16">Donor Integrity</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest h-16">Contribution</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest h-16">Geographic</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest h-16">Proof of Seva</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest h-16">Verification</TableHead>
                                <TableHead className="text-right pr-10 font-black uppercase text-[10px] tracking-widest h-16">Portal</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {donations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-24 text-muted-foreground italic font-medium">
                                        No financial records detected in the ledger.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                donations.map((donation) => (
                                    <TableRow key={donation.id} className="cursor-pointer hover:bg-muted/10 transition-colors group px-6 border-b border-border/30" onClick={() => openViewModal(donation)}>
                                        <TableCell className="pl-10 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-black text-sm text-foreground tracking-tight">{donation.full_name}</span>
                                                <span className="text-[10px] font-bold text-muted-foreground tracking-tight">{donation.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black text-primary tracking-tighter">₹{donation.final_amount}</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{donation.selected_amount ? 'Tiered' : 'Custom'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-widest border-border/60">
                                                <MapPin className="w-3 h-3 mr-1.5 opacity-50" />
                                                {donation.region}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {donation.uploaded_receipt ? (
                                                <button 
                                                    className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors group/link bg-blue-500/5 px-2 py-1 rounded-lg border border-blue-500/10"
                                                    onClick={(e) => { e.stopPropagation(); window.open(getImageUrl(donation.uploaded_receipt || ''), '_blank'); }}
                                                >
                                                    Visual Proof <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                                                </button>
                                            ) : <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30 italic">Not Uploaded</span>}
                                        </TableCell>
                                        <TableCell>
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <Select
                                                    value={donation.payment_status}
                                                    onValueChange={(value) => handleStatusChange(donation.id, value)}
                                                >
                                                    <SelectTrigger className={`w-[130px] h-9 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] shadow-sm ${getStatusStyles(donation.payment_status)}`}>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                                                        <SelectItem value="pending" className="rounded-xl font-bold text-[10px] uppercase tracking-widest">Pending</SelectItem>
                                                        <SelectItem value="success" className="rounded-xl font-bold text-[10px] uppercase tracking-widest text-emerald-600">Complete</SelectItem>
                                                        <SelectItem value="failed" className="rounded-xl font-bold text-[10px] uppercase tracking-widest text-rose-600">Invalid</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-10">
                                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 group/btn" onClick={(e) => { e.stopPropagation(); openViewModal(donation); }}>
                                                <Eye className="w-4 h-4 text-muted-foreground group-hover/btn:text-primary transition-colors" />
                                            </Button>
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
                                <HeartHandshake className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-3xl font-black italic tracking-tighter">Contribution Brief</DialogTitle>
                                <DialogDescription className="text-muted-foreground font-medium italic mt-1 pb-6">
                                    Official transaction verification record.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {selectedDonation && (
                        <div className="p-10 space-y-10">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Entity Name</h4>
                                    <p className="font-black text-foreground tracking-tight">{selectedDonation.full_name}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Digital Address</h4>
                                    <p className="font-bold text-primary truncate hover:underline cursor-pointer">{selectedDonation.email}</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Telecom</h4>
                                    <p className="font-black text-foreground tracking-tight">{selectedDonation.whatsapp_number || "Unregistered"}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Region</h4>
                                    <p className="font-bold text-foreground tracking-widest">{selectedDonation.region}</p>
                                </div>
                            </div>

                            <div className="p-8 bg-muted/40 rounded-[32px] border border-border/50 space-y-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <CreditCard className="w-24 h-24" />
                                </div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Financial Ledger Audit</h4>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex justify-between items-center bg-background/50 p-4 rounded-2xl border border-border/30">
                                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Settlement Status</span>
                                        <Badge className={`rounded-xl px-4 py-1.5 font-black text-[10px] uppercase tracking-[0.15em] border-none shadow-lg ${getStatusStyles(selectedDonation.payment_status)}`}>
                                            {selectedDonation.payment_status}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center p-2">
                                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Certified Amount</span>
                                        <span className="font-black text-3xl text-foreground tracking-tighter italic">₹{selectedDonation.final_amount}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-t border-border/50 pt-6">
                                        <span className="text-muted-foreground/60 flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" />
                                            Timestamp
                                        </span>
                                        <span className="text-foreground">{new Date(selectedDonation.created_at).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            </div>

                            {selectedDonation.uploaded_receipt && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Forensic Evidence</h4>
                                        <Button asChild variant="ghost" size="sm" className="h-8 rounded-xl font-black text-[10px] uppercase tracking-widest text-blue-500 px-4">
                                            <a href={getImageUrl(selectedDonation.uploaded_receipt)} target="_blank" rel="noopener noreferrer">
                                                Enlarge View <ExternalLink className="w-3 h-3 ml-2" />
                                            </a>
                                        </Button>
                                    </div>
                                    <div className="w-full bg-muted/20 border border-border/50 rounded-[28px] overflow-hidden shadow-inner group/img relative cursor-zoom-in">
                                        <img 
                                            src={getImageUrl(selectedDonation.uploaded_receipt)} 
                                            alt="Forensic Evidence" 
                                            className="w-full h-auto object-contain max-h-[350px] transition-transform duration-700 group-hover/img:scale-105"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default ManageDonations;
