import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Star, Quote, Heart, Users, Leaf, ShieldCheck, Utensils, Globe } from 'lucide-react';

import PageHero from '@/components/layout/PageHero';

const Programs = () => {
    return (
        <Layout>
            <PageHero
                title="Support Our Mission to Nourish and Protect"
                accentText="Bos Indicus Cows"
                subtitle="Get Involved Today"
                description="Become a part of our community and help us in our efforts to nourish and protect these sacred animals. Together, we can make a difference in the lives of Gaumatas."
            />

            {/* Testimonial Section */}
            <section className="section-padding bg-background relative overflow-hidden">
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
                                "GauChara has transformed our approach to cattle care. The high-quality silage provided has not only improved the health of our Gaumatas but also deepened our connection to Indian traditions. We are grateful for this initiative that prioritizes both animal welfare and sustainable practices. It’s a blessing to witness our cows thriving under such care, reflecting the true essence of our culture."
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
            <section className="section-padding bg-muted/30">
                <div className="container-custom">
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
                        <Button asChild variant="outline" className="border-2 border-white text-green-700 hover:bg-white hover:text-primary px-10 py-7 rounded-full text-lg font-bold transition-all hover:-translate-y-1">
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
