import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Heart, Users, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Send, Loader2 } from 'lucide-react';
import PageHero from '@/components/layout/PageHero';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { contactApi } from '@/lib/api';
import { toast } from 'sonner';
import { z } from "zod";

const contactSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
    phone: z.string().trim().regex(/^[0-9]{10,15}$/, "Phone number must be 10-15 digits"),
    subject: z.string().trim().min(1, "Subject is required").max(200, "Subject must be less than 200 characters"),
    message: z.string().trim().min(1, "Message is required").max(2000, "Message must be less than 2000 characters"),
});

const Services = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const result = contactSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
                if (err.path[0]) {
                    fieldErrors[err.path[0] as string] = err.message;
                }
            });
            setErrors(fieldErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            await contactApi.create(result.data);
            toast.success("Message Sent Successfully! We'll get back to you soon.");
            setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
        } catch (error: any) {
            toast.error(error.backendError || "Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <Layout>
            <PageHero
                title="Support the Well-Being of"
                accentText="Gaumatas Today!"
                subtitle="Our Services"
                description="At GauChara, we offer a range of services dedicated to the health and well-being of Bos Indicus cows. Our focus is on providing high-quality nutrition and sustainable cattle care practices that align with Indian traditions."
            />

            {/* Process Section */}
            <section className="section-padding bg-background">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Initiate',
                                desc: 'Establishing a strong foundation for cattle care',
                                detail: 'In this initial step, we assess the needs of our cattle and set up a tailored nutrition plan that aligns with their health requirements.'
                            },
                            {
                                step: '02',
                                title: 'Review',
                                desc: 'Effective feeding and monitoring of cattle health',
                                detail: 'During this phase, we implement the nutrition plan, providing high-quality silage and closely monitoring the cattle’s health to ensure they are thriving.'
                            },
                            {
                                step: '03',
                                title: 'Process',
                                desc: 'Healthy cattle and sustainability',
                                detail: 'This step focuses on ensuring that the cattle receive the best possible nutrition.'
                            },
                            {
                                step: '04',
                                title: 'Completion',
                                desc: 'Commitment to quality and care',
                                detail: 'The final step guarantees that our cattle thrive, reflecting our commitment to quality and care.'
                            }
                        ].map((item, index) => (
                            <div key={index} className="relative p-8 rounded-2xl bg-muted/30 border border-border hover:border-primary/30 transition-all duration-300 group">
                                <span className="text-5xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors absolute top-4 right-4">
                                    {item.step}
                                </span>
                                <h3 className="text-2xl font-bold mb-2 font-serif">{item.title}</h3>
                                <p className="font-semibold text-primary mb-4">{item.desc}</p>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {item.detail}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Services Section */}
            <section className="section-padding bg-muted/20">
                <div className="container-custom">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="section-title">Our Services</h2>
                        <p className="section-subtitle">
                            At GauChara, we offer a range of services dedicated to the health and well-being of Bos Indicus cows. Our focus is on providing high-quality nutrition and sustainable cattle care practices that align with Indian traditions.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'High-Quality Silage',
                                desc: 'Our silage is made from premium corn crops, ensuring optimal energy and nutrition for our cows, promoting their overall health and happiness.'
                            },
                            {
                                title: 'Sustainable Practices',
                                desc: 'We implement eco-friendly farming techniques that not only benefit our cattle but also contribute to the preservation of the environment and local ecosystems.'
                            },
                            {
                                title: 'Cultural Significance',
                                desc: 'Our initiative honors the spiritual and cultural importance of Gaumatas in Indian society, fostering a deeper connection between people and these sacred animals.'
                            }
                        ].map((service, index) => (
                            <div key={index} className="bg-card p-10 rounded-3xl shadow-lg border border-border hover:shadow-xl transition-all duration-300">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 font-serif">{service.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {service.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Commitment to Welfare Section */}
            <section className="section-padding bg-background">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Veterinary care for cows"
                                className="w-full h-[500px] object-cover"
                            />
                            <div className="absolute inset-0 bg-primary/10" />
                        </div>

                        <div>
                            <h2 className="section-title mb-6">Commitment to Welfare</h2>
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Heart className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2 font-serif">Animal Health Monitoring</h3>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        We regularly monitor the health of our cows, ensuring they receive the best care possible, which includes veterinary check-ups and nutritional assessments.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="section-padding bg-primary/5">
                <div className="container-custom">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="section-title">Why Choose Us?</h2>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            GauChara is committed to excellence in cattle care, providing high-quality feed and sustainable practices that ensure the well-being of our Gaumatas. Join us in our mission to promote animal welfare and cultural heritage.
                        </p>
                    </div>
                </div>
            </section>

            {/* Join Our Community Section */}
            <section className="section-padding bg-background">
                <div className="container-custom">
                    <div className="grid md:grid-cols-2 gap-12 items-center bg-card border border-border p-12 rounded-[40px] shadow-sm">
                        <div>
                            <h2 className="text-3xl font-bold mb-4 font-serif">Support Our Mission</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                By supporting GauChara, you contribute to the welfare of Bos Indicus cows and the promotion of sustainable agriculture practices in India.
                            </p>
                        </div>
                        <div className="md:text-right">
                            <h2 className="text-3xl font-bold mb-4 font-serif">Get Involved</h2>
                            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                                We welcome volunteers and supporters who share our passion for animal welfare and sustainable practices. Together, we can make a difference.
                            </p>
                            <Button asChild className="btn-primary px-10 py-6 rounded-full text-lg">
                                <Link to="/volunteer">
                                    Join as Volunteer
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Us Section */}
            <section className="section-padding bg-muted/10">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-16">
                        <div>
                            <h2 className="section-title mb-6">Contact Us</h2>
                            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                                For more information about our services and how you can help, please reach out to us through our website or social media channels.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Mail className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email Us</p>
                                        <p className="font-bold">savadiafoundation@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Phone className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Call Us</p>
                                        <p className="font-bold">+91 9052590515</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <MapPin className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Visit Us</p>
                                        <p className="font-bold">4-1-2/2 Ramkoti Hyderabad- 500001</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card p-10 rounded-3xl shadow-xl border border-border">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Name *</label>
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your Name"
                                            className={errors.name ? "border-destructive rounded-xl h-12" : "rounded-xl h-12"}
                                        />
                                        {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Email *</label>
                                        <Input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Your Email"
                                            className={errors.email ? "border-destructive rounded-xl h-12" : "rounded-xl h-12"}
                                        />
                                        {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Phone *</label>
                                        <Input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Phone Number"
                                            className={errors.phone ? "border-destructive rounded-xl h-12" : "rounded-xl h-12"}
                                        />
                                        {errors.phone && <p className="text-destructive text-xs">{errors.phone}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Subject *</label>
                                        <Input
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="How can we help?"
                                            className={errors.subject ? "border-destructive rounded-xl h-12" : "rounded-xl h-12"}
                                        />
                                        {errors.subject && <p className="text-destructive text-xs">{errors.subject}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Message *</label>
                                    <Textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className={errors.message ? "border-destructive rounded-xl resize-none" : "rounded-xl resize-none"}
                                        placeholder="How can we help you?"
                                    />
                                    {errors.message && <p className="text-destructive text-xs">{errors.message}</p>}
                                </div>
                                <Button type="submit" disabled={isSubmitting} className="w-full btn-primary py-6 rounded-xl text-lg h-14">
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            Submit Message
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stay Connected Section */}
            <section className="py-20 bg-primary text-white">
                <div className="container-custom text-center">
                    <h2 className="text-4xl font-bold mb-4 font-serif">Stay Connected</h2>
                    <p className="text-xl mb-10 opacity-90">Follow Us on Social Media</p>

                    <div className="flex justify-center gap-6">
                        <a href="#" className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:-translate-y-1">
                            <Facebook className="w-6 h-6" />
                        </a>
                        <a href="#" className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:-translate-y-1">
                            <Instagram className="w-6 h-6" />
                        </a>
                        <a href="#" className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:-translate-y-1">
                            <Twitter className="w-6 h-6" />
                        </a>
                        <a href="#" className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:-translate-y-1">
                            <Youtube className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default Services;
