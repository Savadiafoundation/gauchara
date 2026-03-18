import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogApi, causeApi, testimonialApi, donationApi } from '@/lib/api';
import {
    FileText,
    Heart,
    MessageSquare,
    Plus,
    Users,
    Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/layout/AdminLayout';

const AdminDashboard = () => {
    const [counts, setCounts] = useState({
        blogs: 0,
        causes: 0,
        testimonials: 0,
        donations: 0
    });

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [blogsRes, causesRes, testimonialsRes, donationsRes] = await Promise.all([
                    blogApi.getAll(),
                    causeApi.getAll(),
                    testimonialApi.getAll(),
                    donationApi.getAll()
                ]);
                setCounts({
                    blogs: blogsRes.data.length || 0,
                    causes: causesRes.data.length || 0,
                    testimonials: testimonialsRes.data.length || 0,
                    donations: donationsRes.data.length || 0
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };

        fetchCounts();
    }, []);

    const stats = [
        { label: 'Total Blogs', value: counts.blogs.toString(), icon: FileText, color: 'bg-blue-500' },
        { label: 'Total Causes', value: counts.causes.toString(), icon: Heart, color: 'bg-rose-500' },
        { label: 'Testimonials', value: counts.testimonials.toString(), icon: MessageSquare, color: 'bg-amber-500' },
        { label: 'Total Donors', value: counts.donations.toString(), icon: Users, color: 'bg-emerald-500' },
    ];

    return (
        <AdminLayout title="Dashboard Overview">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-display tracking-tight text-foreground">Dashboard Overview</h1>
                    <p className="text-muted-foreground text-sm font-medium">Manage GauChara Foundation's digital core.</p>
                </div>
                <div className="flex gap-4">
                    <Button asChild className="rounded-2xl shadow-xl shadow-primary/20 h-12 px-6">
                        <Link to="/admin/blogs/new">
                            <Plus className="w-4 h-4 mr-2" />
                            New Blog Post
                        </Link>
                    </Button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-background p-8 rounded-[32px] border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                            <stat.icon className="w-32 h-32" />
                        </div>
                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <div className={`p-4 rounded-2xl ${stat.color} text-white shadow-2xl`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <span className="text-4xl font-black tracking-tighter text-foreground">{stat.value}</span>
                        </div>
                        <p className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.2em] relative z-10">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Activity / Quick Links */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-background p-10 rounded-[40px] border border-border/50 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        <Settings className="w-48 h-48" />
                    </div>
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-3 italic">
                        <Plus className="w-5 h-5 text-primary" />
                        Quick Management
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Button variant="outline" className="h-32 flex flex-col gap-3 rounded-3xl border-2 border-dashed border-rose-500/20 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all group/btn" asChild>
                            <Link to="/admin/causes/new">
                                <Heart className="w-10 h-10 text-rose-500 group-hover/btn:scale-110 transition-transform" />
                                <span className="font-bold text-sm tracking-tight">Add New Cause</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-32 flex flex-col gap-3 rounded-3xl border-2 border-dashed border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group/btn" asChild>
                            <Link to="/admin/donations">
                                <Users className="w-10 h-10 text-emerald-500 group-hover/btn:scale-110 transition-transform" />
                                <span className="font-bold text-sm tracking-tight">Audit Donations</span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="h-32 flex flex-col gap-3 rounded-3xl border-2 border-dashed border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all group/btn" asChild>
                            <Link to="/admin/testimonials/new">
                                <MessageSquare className="w-10 h-10 text-amber-500 group-hover/btn:scale-110 transition-transform" />
                                <span className="font-bold text-sm tracking-tight">Write Testimonial</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="bg-background p-10 rounded-[40px] border border-border/50 shadow-sm">
                    <h3 className="text-xl font-bold mb-8 italic">System Intelligence</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-6 bg-muted/30 rounded-[28px] border border-border/30">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Database</p>
                                <p className="text-sm font-bold">SQL Engine</p>
                            </div>
                            <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-black tracking-widest rounded-full uppercase border border-emerald-500/20">Live</span>
                        </div>
                        <div className="flex items-center justify-between p-6 bg-muted/30 rounded-[28px] border border-border/30">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Server</p>
                                <p className="text-sm font-bold">API Gateway</p>
                            </div>
                            <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-black tracking-widest rounded-full uppercase border border-emerald-500/20">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
