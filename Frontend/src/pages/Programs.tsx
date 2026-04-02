import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Star, Quote, Heart, Users, Leaf, ShieldCheck, Utensils, Globe, Loader2, Sparkles, LayoutGrid } from 'lucide-react';
import { programApi, Program } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import { toast } from 'sonner';

import PageHero from '@/components/layout/PageHero';

const Programs = () => {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await programApi.getAll();
                setPrograms(response.data);
            } catch (error: any) {
                console.error('Failed to fetch programs:', error);
                toast.error(error.backendError || 'Unable to load programs at this time.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrograms();
    }, []);

    return (
        <Layout>
            <PageHero
                title="Support Our Mission to Nourish and Protect"
                accentText="Bos Indicus Cows"
                subtitle="Get Involved Today"
                description="Become a part of our community and help us in our efforts to nourish and protect these sacred animals. Together, we can make a difference in the lives of Gaumatas."
            />

            {/* Dynamic Programs Section */}
            <section className="section-padding bg-background relative">
                <div className="container-custom">
                    <div className="flex flex-col items-center text-center mb-16 px-4">
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/5 text-primary text-sm font-black uppercase tracking-[0.2em] mb-6 animate-fade-in-up">
                            <Sparkles className="w-4 h-4" />
                            Active Initiatives
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-foreground mb-6 font-serif max-w-4xl leading-[1.1] animate-fade-in-up delay-100">
                            Our <span className="text-primary italic">Specialized</span> Programs
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed animate-fade-in-up delay-200">
                            Explore our ongoing efforts to safeguard, nurture, and propagate the heritage of Bos Indicus.
                        </p>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 space-y-4">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Synchronizing Registry...</p>
                        </div>
                    ) : programs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                            {programs.map((program, index) => (
                                <div 
                                    key={program.id} 
                                    className="group relative bg-card rounded-[40px] border border-border/50 overflow-hidden hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col h-full animate-fade-in-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="aspect-[4/3] overflow-hidden relative">
                                        <img
                                            src={getImageUrl(program.file_image || program.url_image)}
                                            alt={program.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = '/placeholder.svg';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                             <div className="w-full h-[1px] bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                                        </div>
                                    </div>
                                    <div className="p-8 md:p-10 flex flex-col flex-grow">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                                <LayoutGrid className="w-5 h-5" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Operational Unit</span>
                                        </div>
                                        <h3 className="text-2xl font-black tracking-tight mb-4 font-serif group-hover:text-primary transition-colors">{program.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed mb-8 italic flex-grow">
                                            "{program.description}"
                                        </p>
                                        <Button asChild variant="outline" className="w-full rounded-2xl py-6 border-primary/20 hover:bg-primary hover:text-white font-bold tracking-tight transition-all">
                                            <Link to="/volunteer">Participate Now</Link>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-muted/20 rounded-[40px] border-2 border-dashed border-border">
                            <LayoutGrid className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-muted-foreground">Registry Clear</h3>
                            <p className="text-muted-foreground italic">New initiatives are currently being drafted for the next phase.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Testimonial Section */}
            <section className="section-padding bg-muted/10 relative overflow-hidden">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto relative">
                        <div className="absolute -top-10 -left-10 text-primary/5">
                            <Quote size={160} />
                        </div>

                        <div className="bg-card p-10 md:p-16 rounded-[40px] shadow-2xl border border-border relative z-10 text-center">
                            <div className="flex justify-center gap-1 mb-8">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            <p className="text-xl md:text-2xl lg:text-3xl italic leading-relaxed mb-10 text-foreground/90 font-serif">
                                "GauChara has transformed our approach to cattle care. The high-quality silage provided has not only improved the health of our Gaumatas but also deepened our connection to Indian traditions. We are grateful for this initiative that prioritizes both animal welfare and sustainable practices."
                            </p>

                            <div>
                                <h4 className="text-xl font-bold">Scarlett O’Connor</h4>
                                <p className="text-muted-foreground">Savadia Foundation</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 translate-y-1/2" />
            </section>

            {/* Impact / Values Section */}
            <section className="section-padding bg-background">
                <div className="container-custom">
                    <div className="flex flex-col items-center text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">Core Principles</h2>
                        <div className="w-20 h-1 bg-primary rounded-full" />
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                num: '01',
                                title: 'Community Support',
                                desc: 'Join us in our mission to support local farmers and promote sustainable agriculture practices in India.',
                                icon: <Users className="w-6 h-6" />
                            },
                            {
                                num: '02',
                                title: 'Cultural Significance',
                                desc: 'Gaumata holds a special place in Indian culture, symbolizing spirituality and reverence for nature.',
                                icon: <Globe className="w-6 h-6" />
                            },
                            {
                                num: '03',
                                title: 'Join Us',
                                desc: 'Become a part of our community and help us in our efforts to nourish and protect these sacred animals.',
                                icon: <Heart className="w-6 h-6" />
                            },
                            {
                                num: '04',
                                title: 'Cattle Care',
                                desc: 'Our initiative focuses on providing the best care for Bos Indicus cows, ensuring their health and happiness.',
                                icon: <ShieldCheck className="w-6 h-6" />
                            },
                            {
                                num: '05',
                                title: 'Nourishment and Health',
                                desc: 'We prioritize high-quality silage made from corn, ensuring optimal nutrition for our cows.',
                                icon: <Utensils className="w-6 h-6" />
                            },
                            {
                                num: '06',
                                title: 'Sustainable Practices',
                                desc: 'We implement eco-friendly methods to promote the well-being of our cattle and the environment.',
                                icon: <Leaf className="w-6 h-6" />
                            }
                        ].map((item, index) => (
                            <div key={index} className="bg-card p-8 rounded-3xl border border-border hover:border-primary/30 transition-all duration-300 group hover:shadow-lg">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        {item.icon}
                                    </div>
                                    <span className="text-4xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                                        {item.num}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold mb-4 font-serif">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final Call-to-Action Section */}
            <section className="py-24 bg-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-10" />
                <div className="container-custom relative z-10 text-center text-white">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">Join Our Sacred Mission</h2>
                    <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
                        Your support helps us provide a safe haven and proper nutrition for every Gaumata in our care.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Button asChild className="bg-white text-primary hover:bg-white/90 px-10 py-7 rounded-full text-lg font-bold shadow-xl transition-all hover:-translate-y-1">
                            <Link to="/donate">
                                Donate Now
                            </Link>
                        </Button>
                        <Button asChild className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary px-10 py-7 rounded-full text-lg font-bold transition-all hover:-translate-y-1">
                            <Link to="/volunteer">
                                Join as Volunteer
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Programs;

