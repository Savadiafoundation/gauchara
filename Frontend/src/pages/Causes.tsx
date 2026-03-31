import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Target, Heart, ShieldCheck, Leaf, Loader2, Sparkles, LayoutGrid, ArrowRight, Share2 } from 'lucide-react';
import { causeApi, Cause } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import { toast } from 'sonner';
import PageHero from '@/components/layout/PageHero';
import { Progress } from '@/components/ui/progress';

const Causes = () => {
    const [causes, setCauses] = useState<Cause[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCauses = async () => {
            try {
                const response = await causeApi.getAll();
                setCauses(response.data);
            } catch (error: any) {
                console.error('Failed to fetch causes:', error);
                toast.error('Unable to load our impact missions at this time.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCauses();
    }, []);

    const calculateProgress = (raised: any, goal: any) => {
        const r = Number(raised) || 0;
        const g = Number(goal) || 1;
        return Math.min(Math.round((r / g) * 100), 100);
    };

    return (
        <Layout>
            <PageHero
                title="Fueling Change for Every"
                accentText="Sacred Life"
                subtitle="Missions with Impact"
                description="We are committed to specific, measurable improvements in the lives of Gaumatas and the communities that serve them. Join our targeted missions today."
            />

            {/* Dynamic Causes Section */}
            <section className="section-padding bg-background relative overflow-hidden">
                <div className="container-custom">
                    <div className="flex flex-col items-center text-center mb-20 px-4">
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/5 text-primary text-sm font-black uppercase tracking-[0.2em] mb-6 animate-fade-in-up">
                            <Heart className="w-4 h-4" />
                            Priority Missions
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-foreground mb-6 font-serif max-w-4xl leading-[1.1] animate-fade-in-up delay-100">
                            Current <span className="text-primary italic">Impact</span> Initiatives
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed animate-fade-in-up delay-200">
                            Transparent, goal-oriented programs focused on immediate relief and long-term sustainability.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 space-y-4">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Accessing Mission Dossiers...</p>
                        </div>
                    ) : causes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                            {causes.map((cause, index) => {
                                const progress = calculateProgress(cause.raised_amount || 0, cause.goal_amount);
                                return (
                                    <div 
                                        key={cause.id || cause._id} 
                                        className="group relative bg-card rounded-[40px] border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.08)] flex flex-col h-full animate-fade-in-up"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="aspect-[16/10] overflow-hidden relative">
                                            <img
                                                src={getImageUrl(cause.image_file || cause.image)}
                                                alt={cause.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = '/placeholder.svg';
                                                }}
                                            />
                                            <div className="absolute top-6 right-6">
                                                <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-xl border border-primary/20 italic">
                                                    {cause.category}
                                                </div>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </div>
                                        
                                        <div className="p-8 md:p-10 flex flex-col flex-grow">
                                            <h3 className="text-2xl font-black tracking-tight mb-4 font-serif group-hover:text-primary transition-colors line-clamp-2">
                                                {cause.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed mb-8 italic flex-grow">
                                                "{cause.short_description}"
                                            </p>

                                            <div className="space-y-6 mt-auto">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-end">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">Raised Momentum</span>
                                                            <span className="text-lg font-black text-foreground">₹{(Number(cause.raised_amount) || 0).toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex flex-col text-right">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">Target Cap</span>
                                                            <span className="text-lg font-black text-primary">₹{(Number(cause.goal_amount) || 0).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="relative pt-1">
                                                        <Progress value={progress} className="h-2 rounded-full bg-muted border border-border/50" />
                                                        <div 
                                                            className="absolute top-0 right-0 -translate-y-full mb-2 bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                            style={{ right: `${100 - progress}%` }}
                                                        >
                                                            {progress}%
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <Button asChild className="flex-grow rounded-2xl py-6 bg-primary hover:bg-primary/90 text-white font-bold tracking-tight shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                                                        <Link to="/donate">
                                                            Support Now
                                                            <ArrowRight className="w-4 h-4 ml-2" />
                                                        </Link>
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="w-12 h-12 rounded-2xl border-border/60 hover:bg-muted group/share">
                                                        <Share2 className="w-4 h-4 text-muted-foreground group-hover/share:text-primary transition-colors" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-muted/20 rounded-[80px] border-2 border-dashed border-border/50 max-w-4xl mx-auto shadow-inner">
                            <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                                <Sparkles className="w-10 h-10 text-muted-foreground/20" />
                            </div>
                            <h3 className="text-3xl font-black text-foreground italic tracking-tight mb-4">Strategic Realignment</h3>
                            <p className="text-muted-foreground italic max-w-md mx-auto">Our specialized response teams are currently architecting the next generation of impact missions.</p>
                        </div>
                    )}
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-1/2 left-0 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />
            </section>

            {/* Impact Promise Section */}
            <section className="section-padding bg-muted/5 relative overflow-hidden border-y border-border/30">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] font-serif italic text-foreground">
                                Our Dedication to <span className="text-primary">Uncompromising</span> Transparency
                            </h2>
                            <p className="text-xl text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-8 py-2">
                                "Every rupee contributed to a Cause mission is tracked with obsessive precision, ensuring that the intent of the donor directly translates to the health and happiness of our cattle."
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-4">
                                <div className="space-y-2">
                                    <h4 className="text-4xl font-black text-foreground tracking-tighter italic">100%</h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Direct Attribution</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-4xl font-black text-foreground tracking-tighter italic">24/7</h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Operational Vigilance</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-[60px] overflow-hidden shadow-2xl relative z-10 border-8 border-background">
                                <img 
                                    src="https://images.unsplash.com/photo-1545468241-1ef703553896?q=80&w=2670&auto=format&fit=crop" 
                                    alt="Commitment" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
                            <div className="absolute -top-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-2xl -z-10" />
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Causes;
