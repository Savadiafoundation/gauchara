import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Building2, Shield, Check, Smartphone, User, Mail, Phone, CreditCard as PanIcon, ArrowRight, ArrowLeft, Upload, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import { donationApi } from "@/lib/api";
import { useRef } from "react";

const donationAmounts = [500, 1000, 2500, 5000, 10000, 25000];

const Donate = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [step, setStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState<number | null>(1000);
    const [customAmount, setCustomAmount] = useState("");

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        pan: "",
    });

    const [paymentRegion, setPaymentRegion] = useState<"indian" | "international" | null>(null);

    // Ensure scroll to top of form on step change
    useEffect(() => {
        if (step > 1) {
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }
    }, [step]);

    const handleNextStep = () => {
        if (step === 1) {
            if (!formData.full_name || !formData.email || !formData.phone) {
                toast({
                    title: "Missing Information",
                    description: "Please fill in all required fields.",
                    variant: "destructive",
                });
                return;
            }
            const amount = customAmount ? parseInt(customAmount) : selectedAmount;
            if (!amount || amount < 100) {
                toast({
                    title: "Invalid Amount",
                    description: "Please enter a valid donation amount (minimum ₹100).",
                    variant: "destructive",
                });
                return;
            }
        }
        setStep(step + 1);
    };

    const handlePrevStep = () => {
        setStep(step - 1);
    };

    const handleFinalSubmit = () => {
        setIsProcessing(true);

        // Immediate transition with a small visual delay
        setTimeout(() => {
            setIsProcessing(false);
            setStep(3);
            toast({
                title: "Processing Complete",
                description: "Your official QR code is ready.",
            });
        }, 800);
    };

    const handleWhatsAppClick = () => {
        const amount = customAmount ? parseInt(customAmount) : selectedAmount;
        const message = `Hello Savadia Foundation, I've just donated ₹${amount?.toLocaleString()} for Gau Seva. My name is ${formData.full_name}. I'm attaching the screenshot below.`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/919052590515?text=${encodedMessage}`, '_blank');
        
        // Also log the intent
        handlePaymentDone(false);
    };

    const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);
        const amount = customAmount ? parseInt(customAmount) : selectedAmount;

        const uploadData = new FormData();
        uploadData.append('full_name', formData.full_name);
        uploadData.append('email', formData.email);
        uploadData.append('whatsapp_number', formData.phone);
        uploadData.append('pan_number', formData.pan);
        uploadData.append('final_amount', (amount || 0).toString());
        uploadData.append('selected_amount', (customAmount ? null : selectedAmount)?.toString() || '');
        uploadData.append('custom_amount', (customAmount ? parseInt(customAmount) : null)?.toString() || '');
        uploadData.append('region', paymentRegion === 'indian' ? 'India' : 'International');
        uploadData.append('payment_status', 'pending');
        uploadData.append('uploaded_receipt', file);

        try {
            await donationApi.create(uploadData);
            toast({
                title: "Screenshot Uploaded",
                description: "Thank you! Our team will verify the payment and send your receipt within 24 hours.",
            });
            navigate('/');
        } catch (err: any) {
            console.error("Upload failed:", err);
            toast({
                title: "Upload Failed",
                description: "We couldn't upload the screenshot. Please try again or send it via WhatsApp.",
                variant: 'destructive',
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaymentDone = (redirect = true) => {
        setIsProcessing(true);
        const amount = customAmount ? parseInt(customAmount) : selectedAmount;

        donationApi.create({
            final_amount: (amount || 0).toString(),
            selected_amount: customAmount ? null : selectedAmount,
            custom_amount: customAmount ? parseInt(customAmount) : null,
            currency: "INR",
            full_name: formData.full_name,
            email: formData.email,
            whatsapp_number: formData.phone,
            pan_number: formData.pan,
            payment_method: paymentRegion === 'indian' ? 'upi' : 'swift',
            region: paymentRegion === 'indian' ? 'India' : 'International',
            payment_status: 'pending',
        })
            .then(() => {
                if (redirect) {
                    toast({
                        title: "Donation Recorded",
                        description: "Thank you for your support! Our team will verify the payment.",
                    });
                    navigate('/');
                }
            })
            .catch(err => {
                console.error("Donation record failed:", err);
            })
            .finally(() => {
                setIsProcessing(false);
            });
    };

    const finalAmount = customAmount ? parseInt(customAmount) || 0 : selectedAmount || 0;

    return (
        <Layout>
            <PageHero
                title="Make a"
                accentText="Donation"
                subtitle="Support Our Cause"
                description="Your generous contribution helps us provide nutritious feed, veterinary care, and loving shelter to thousands of sacred Bos Indicus cows across India."
            />

            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    {/* Premium Progress Stepper */}
                    <div className="max-w-4xl mx-auto mb-16 px-4">
                        <div className="relative flex items-center justify-between">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0" />
                            <motion.div
                                className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0"
                                initial={{ width: "0%" }}
                                animate={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
                                transition={{ duration: 0.5 }}
                            />

                            {[
                                { label: 'Details', icon: User },
                                { label: 'Method', icon: Smartphone },
                                { label: 'Payment', icon: Heart }
                            ].map((item, idx) => (
                                <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${step > idx + 1 ? 'bg-primary text-white' : step === idx + 1 ? 'bg-primary text-white ring-8 ring-primary/10 scale-110' : 'bg-background border-2 border-muted text-muted-foreground'}`}>
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${step === idx + 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-12 max-w-7xl mx-auto">
                        <div className="lg:col-span-3">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="card-sacred p-8 sm:p-12 space-y-10"
                                    >
                                        <header>
                                            <h2 className="font-display text-3xl font-black text-foreground mb-2 tracking-tight">Step 1: Basic Information</h2>
                                            <p className="text-muted-foreground text-sm font-medium">This information ensures your donation receipt is generated correctly.</p>
                                        </header>

                                        <div className="space-y-8">
                                            <div className="grid md:grid-cols-2 gap-8 text-left">
                                                <div className="space-y-3">
                                                    <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground/80">Full Name *</Label>
                                                    <div className="relative group">
                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                        <Input
                                                            placeholder="John Doe"
                                                            className="h-14 pl-12 rounded-2xl border-2 focus:border-primary transition-all bg-muted/20 hover:bg-muted/40"
                                                            value={formData.full_name}
                                                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground/80">Email Address *</Label>
                                                    <div className="relative group">
                                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                        <Input
                                                            type="email"
                                                            placeholder="john@example.com"
                                                            className="h-14 pl-12 rounded-2xl border-2 focus:border-primary transition-all bg-muted/20 hover:bg-muted/40"
                                                            value={formData.email}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-8 text-left">
                                                <div className="space-y-3">
                                                    <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground/80">WhatsApp Number *</Label>
                                                    <div className="relative group">
                                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                        <Input
                                                            placeholder="+91 9876543210"
                                                            className="h-14 pl-12 rounded-2xl border-2 focus:border-primary transition-all bg-muted/20 hover:bg-muted/40"
                                                            value={formData.phone}
                                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <Label className="text-xs font-black uppercase tracking-wider text-muted-foreground/80">PAN Number (Optional)</Label>
                                                    <div className="relative group">
                                                        <PanIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                        <Input
                                                            placeholder="ABCDE1234F"
                                                            className="h-14 pl-12 rounded-2xl border-2 focus:border-primary transition-all bg-muted/20 hover:bg-muted/40"
                                                            value={formData.pan}
                                                            onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-10 border-t border-border/40">
                                                <h3 className="font-display text-xl font-black mb-6 text-foreground flex items-center gap-3">
                                                    <Heart className="w-5 h-5 text-primary" />
                                                    Donation Amount
                                                </h3>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                                                    {donationAmounts.map((amount) => (
                                                        <button
                                                            type="button"
                                                            key={amount}
                                                            onClick={() => {
                                                                setSelectedAmount(amount);
                                                                setCustomAmount("");
                                                            }}
                                                            className={`p-5 rounded-2xl border-2 transition-all text-center relative overflow-hidden group ${selectedAmount === amount && !customAmount
                                                                ? "border-primary bg-primary/5 text-primary shadow-lg shadow-primary/5"
                                                                : "border-border hover:border-primary/30"
                                                                }`}
                                                        >
                                                            <span className="text-2xl font-black block mb-1 group-hover:scale-110 transition-transform">₹{amount.toLocaleString()}</span>
                                                            <span className="text-[9px] uppercase font-black tracking-[0.2em] text-muted-foreground/60">Gau Seva</span>
                                                            {selectedAmount === amount && !customAmount && (
                                                                <div className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-tl-xl translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform">
                                                                    <Check className="w-4 h-4" />
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="space-y-4 text-left">
                                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Custom Amount</Label>
                                                    <div className="relative group">
                                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-foreground/40 group-focus-within:text-primary transition-colors">₹</span>
                                                        <Input
                                                            type="number"
                                                            value={customAmount}
                                                            onChange={(e) => {
                                                                setCustomAmount(e.target.value);
                                                                setSelectedAmount(null);
                                                            }}
                                                            placeholder="Enter any amount"
                                                            className="h-16 pl-12 text-2xl font-black rounded-2xl border-2 bg-muted/10 focus:bg-background"
                                                            min="100"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                type="button"
                                                onClick={handleNextStep}
                                                variant="sacred"
                                                size="lg"
                                                className="w-full h-16 text-xl font-black rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 group"
                                            >
                                                Next: Payment Method
                                                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="card-sacred p-8 sm:p-12"
                                    >
                                        <header className="mb-10 text-left">
                                            <h2 className="font-display text-3xl font-black text-foreground mb-2">Step 2: Region</h2>
                                            <p className="text-muted-foreground text-sm font-medium">Choose based on your citizen status for tax compliance.</p>
                                        </header>

                                        <div className="grid sm:grid-cols-2 gap-8 mb-12">
                                            <button
                                                type="button"
                                                onClick={() => setPaymentRegion('indian')}
                                                className={`group p-8 rounded-[32px] border-2 transition-all text-left flex flex-col gap-6 relative overflow-hidden ${paymentRegion === 'indian' ? 'border-primary bg-primary/5 ring-8 ring-primary/5' : 'border-border hover:border-primary/20 shadow-sm'}`}
                                            >
                                                <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center transition-all ${paymentRegion === 'indian' ? 'bg-primary text-white shadow-xl scale-110' : 'bg-muted text-muted-foreground'}`}>
                                                    <Smartphone className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-2xl mb-2 tracking-tight">Indian Citizen</h3>
                                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">Pay using UPI (GPay, PhonePe, Paytm), Indian Bank Accounts, or Cards.</p>
                                                </div>
                                                {paymentRegion === 'indian' && (
                                                    <div className="absolute top-6 right-6 bg-primary text-white p-2 rounded-xl shadow-lg">
                                                        <Check className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setPaymentRegion('international')}
                                                className={`group p-8 rounded-[32px] border-2 transition-all text-left flex flex-col gap-6 relative overflow-hidden ${paymentRegion === 'international' ? 'border-primary bg-primary/5 ring-8 ring-primary/5' : 'border-border hover:border-primary/20 shadow-sm'}`}
                                            >
                                                <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center transition-all ${paymentRegion === 'international' ? 'bg-primary text-white shadow-xl scale-110' : 'bg-muted text-muted-foreground'}`}>
                                                    <Building2 className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-2xl mb-2 tracking-tight">International</h3>
                                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">Secure SWIFT transfers or International QR codes. Best for NRIs & Foreigners.</p>
                                                </div>
                                                {paymentRegion === 'international' && (
                                                    <div className="absolute top-6 right-6 bg-primary text-white p-2 rounded-xl shadow-lg">
                                                        <Check className="w-6 h-6" />
                                                    </div>
                                                )}
                                            </button>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-6">
                                            <Button type="button" variant="outline" onClick={handlePrevStep} className="h-16 flex-1 rounded-2xl font-black uppercase tracking-widest text-xs border-2">
                                                <ArrowLeft className="w-4 h-4 mr-2" />
                                                Go Back
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={handleFinalSubmit}
                                                disabled={!paymentRegion || isProcessing}
                                                variant="sacred"
                                                className="h-16 flex-[2] text-lg font-black rounded-2xl shadow-xl shadow-primary/20"
                                            >
                                                {isProcessing ? "Processing..." : "Generate Official QR Code"}
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="card-sacred p-8 sm:p-12 text-center"
                                    >
                                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-green-50 text-green-600 mb-8 border-4 border-white shadow-xl">
                                            <Check className="w-10 h-10" />
                                        </div>
                                        <h2 className="font-display text-4xl font-black text-foreground mb-4 italic">
                                            Scan to Support
                                        </h2>
                                        <p className="text-muted-foreground font-medium text-base max-w-sm mx-auto mb-12">
                                            Please scan the official {paymentRegion === 'indian' ? 'Indian UPI' : 'International'} QR code to donate <span className="font-black text-primary underline decoration-primary/20 underline-offset-4 pointer-events-none">₹{finalAmount.toLocaleString()}</span>.
                                        </p>

                                        {/* High-End Scanning Area */}
                                        <div className="relative max-w-[360px] mx-auto mb-12 group">
                                            <div className="absolute -inset-4 bg-primary/10 rounded-[50px] blur-3xl opacity-0 group-hover:opacity-100 transition duration-700"></div>

                                            <div className="relative p-10 bg-white dark:bg-zinc-950 rounded-[44px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-border/40 overflow-hidden">
                                                {/* Scanning laser line */}
                                                <motion.div
                                                    className="absolute left-10 right-10 h-[2px] bg-primary/40 z-20"
                                                    animate={{ top: ["10%", "90%", "10%"] }}
                                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                                />

                                                {/* Decorative Corner Brackets */}
                                                <div className="absolute top-10 left-10 w-12 h-12 border-t-2 border-l-2 border-primary/40 rounded-tl-3xl"></div>
                                                <div className="absolute top-10 right-10 w-12 h-12 border-t-2 border-r-2 border-primary/40 rounded-tr-3xl"></div>
                                                <div className="absolute bottom-10 left-10 w-12 h-12 border-b-2 border-l-2 border-primary/40 rounded-bl-3xl"></div>
                                                <div className="absolute bottom-10 right-10 w-12 h-12 border-b-2 border-r-2 border-primary/40 rounded-br-3xl"></div>

                                                <div className="p-4 bg-muted/5 rounded-[32px] relative z-10">
                                                    <img
                                                        src={paymentRegion === 'indian' ? "/qr_code.jpeg" : "/qr_code.jpeg"}
                                                        alt="Official Payment QR"
                                                        className="w-full h-auto aspect-square object-contain rounded-2xl shadow-sm"
                                                    />
                                                </div>

                                                <footer className="mt-8 pt-6 border-t border-dashed border-muted/30">
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Official Verification</p>
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="flex items-center gap-2 text-xs font-bold px-5 py-2.5 bg-muted/30 rounded-2xl border border-border/60 font-mono">
                                                            <Smartphone className="w-4 h-4 text-primary" />
                                                            <span>{paymentRegion === 'indian' ? '9052590515@kotak' : 'GAU-REF-' + Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                                                        </div>

                                                        {paymentRegion === 'indian' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText('9052590515@kotak');
                                                                    toast({ title: "UPI ID Copied!", description: "Paste it directly in your payment app." });
                                                                }}
                                                                className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
                                                            >
                                                                <Copy className="w-3 h-3 group-hover:scale-110 transition-transform" />
                                                                Copy UPI ID
                                                            </button>
                                                        )}
                                                    </div>
                                                </footer>
                                            </div>
                                        </div>

                                        {/* Verification Cards */}
                                        <div className="grid sm:grid-cols-2 gap-6 mb-12 text-left">
                                            <button 
                                                type="button"
                                                onClick={handleWhatsAppClick}
                                                className="p-8 rounded-[32px] bg-primary/5 border border-primary/10 hover:shadow-xl hover:shadow-primary/5 transition-all text-left group/wa"
                                            >
                                                <Phone className="w-8 h-8 mb-6 text-primary group-hover/wa:scale-110 transition-transform" />
                                                <h4 className="font-black text-lg mb-3">WhatsApp Receipt</h4>
                                                <p className="text-xs font-medium text-muted-foreground leading-relaxed">Send a screenshot of payment to <span className="font-black text-foreground">+91 9052590515</span>. We will verify and send your receipt.</p>
                                            </button>

                                            <div className="relative">
                                                <input 
                                                    type="file" 
                                                    ref={fileInputRef}
                                                    onChange={handleScreenshotUpload}
                                                    accept="image/*"
                                                    className="hidden" 
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-full h-full p-8 rounded-[32px] bg-accent/5 border border-accent/10 hover:shadow-xl hover:shadow-accent/5 transition-all text-left group/up"
                                                >
                                                    <Upload className="w-8 h-8 mb-6 text-primary group-hover/up:scale-110 transition-transform" />
                                                    <h4 className="font-black text-lg mb-3">Instant Upload</h4>
                                                    <p className="text-xs font-medium text-muted-foreground leading-relaxed">Prefer automated verification? Upload your screenshot here. Our team will process your 80G certificate within 24 hours.</p>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <Button type="button" variant="outline" onClick={() => setStep(1)} className="h-16 flex-1 rounded-[20px] font-black uppercase tracking-widest text-xs border-2">
                                                Another Donation
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="sacred"
                                                className="h-16 flex-[2] rounded-[20px] text-lg font-black shadow-2xl shadow-primary/20"
                                                onClick={handlePaymentDone}
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? "Processing..." : "Payment Done"}
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Impact Sidebar */}
                        <div className="lg:col-span-2 space-y-10">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="card-sacred p-10 overflow-hidden relative shadow-2xl"
                            >
                                <div className="absolute top-0 right-0 p-10 opacity-5 -mr-10 -mt-10">
                                    <Heart className="w-48 h-48 text-primary" />
                                </div>
                                <h3 className="font-display text-2xl font-black text-foreground mb-8">
                                    Your Impact
                                </h3>
                                <div className="space-y-10">
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                        <div className="relative p-8 bg-black dark:bg-white/10 rounded-[28px] text-white shadow-2xl">
                                            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/60 mb-3">Total Contribution</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-5xl font-black tracking-tighter">₹{finalAmount.toLocaleString()}</span>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">INR</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className="space-y-6">
                                        {[
                                            { amount: "₹500", impact: "Feeds 1 cow / week", sub: "Fresh fodder & hydration" },
                                            { amount: "₹1,000", impact: "Veterinary Support", sub: "Expert medical wellness" },
                                            { amount: "₹2,500", impact: "Cow Nutrition", sub: "Month's supply of silage" },
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                                    <Check className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-foreground">{item.amount}</p>
                                                    <p className="text-[11px] font-black text-primary uppercase tracking-widest">{item.impact}</p>
                                                    <p className="text-[10px] text-muted-foreground font-medium">{item.sub}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="card-sacred p-10 bg-muted/20 border-dashed border-2"
                            >
                                <h3 className="font-display text-xl font-black text-foreground mb-8 text-left">
                                    Foundation Trust
                                </h3>
                                <div className="space-y-6">
                                    {[
                                        { title: "80G Verified", desc: "Savadia Foundation is 12A/80G certified", icon: Shield },
                                        { title: "100% Direct", desc: "Zero platform cuts, direct Seva", icon: Check },
                                        { title: "Impact Proof", desc: "Real-time updates via WhatsApp", icon: Smartphone },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex gap-5 p-5 rounded-[24px] bg-white dark:bg-zinc-950 shadow-sm border border-border/50 hover:border-primary/40 transition-all">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0">
                                                <item.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[11px] font-black uppercase tracking-widest text-foreground">{item.title}</p>
                                                <p className="text-[10px] text-muted-foreground font-bold mt-1">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <div className="p-8 rounded-[40px] bg-primary/5 border border-primary/10 text-center">
                                <Shield className="w-10 h-10 text-primary/30 mx-auto mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Sacred Commitment</p>
                                <p className="text-[10px] text-muted-foreground/80 font-medium px-4 leading-relaxed">All donations are secured with industrial SSL encryption and handled directly by Savadia Foundation.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Donate;
