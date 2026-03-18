import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getImageUrl } from '@/lib/utils';
import { testimonialApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";

const TestimonialEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        content: '',
        image: '',
        rating: '5',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadType, setUploadType] = useState<'url' | 'file'>('url');
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(isEditing);

    useEffect(() => {
        if (isEditing) {
            fetchTestimonial();
        }
    }, [id]);

    const fetchTestimonial = async () => {
        if (!id) return;

        try {
            // First try to get by ID directly
            const response = await testimonialApi.getById(id);
            const testimonial = response.data;
            if (testimonial) {
                setFormData({
                    name: testimonial.name,
                    role: testimonial.role,
                    content: testimonial.content,
                    image: testimonial.image,
                    rating: testimonial.rating ? testimonial.rating.toString() : '5',
                });
                if (testimonial.image) {
                    setPreviewUrl(getImageUrl(testimonial.image));
                }
                setIsFetching(false); // Stop loading here
                return;
            }
        } catch (error) {
            console.log("Direct fetch failed, falling back to finding in list");
        }

        // Fallback: fetch all and find
        try {
            const response = await testimonialApi.getAll();
            // Check if response.data is an array, if not it might be nested
            const data = Array.isArray(response.data) ? response.data : [];

            const testimonial = data.find((t: any) =>
                String(t._id) === String(id) || String(t.id) === String(id)
            );

            if (testimonial) {
                setFormData({
                    name: testimonial.name,
                    role: testimonial.role,
                    content: testimonial.content,
                    image: testimonial.image,
                    rating: testimonial.rating ? testimonial.rating.toString() : '5',
                });
                if (testimonial.image) {
                    setPreviewUrl(getImageUrl(testimonial.image));
                }
            } else {
                toast.error('Testimonial not found');
                navigate('/admin/testimonials');
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.backendError || 'Failed to fetch testimonial details');
        } finally {
            setIsFetching(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (value: string) => {
        setFormData(prev => ({ ...prev, rating: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let payload: any;

            if (imageFile) {
                const data = new FormData();
                data.append('name', formData.name);
                data.append('role', formData.role);
                data.append('content', formData.content);
                data.append('rating', formData.rating);
                data.append('image', imageFile);
                payload = data;
            } else {
                const { image, ...rest } = formData;
                payload = {
                    ...rest,
                    image_url: image || '',
                    rating: Number(formData.rating),
                };
            }

            if (isEditing) {
                await testimonialApi.update(id!, payload);
                toast.success('Testimonial updated successfully');
            } else {
                await testimonialApi.create(payload);
                toast.success('Testimonial created successfully');
            }
            navigate('/admin/testimonials');
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to save testimonial');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link to="/admin/testimonials">
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">{isEditing ? 'Edit Testimonial' : 'Create New Testimonial'}</h1>
                        </div>
                    </div>
                </div>

                <div className="bg-background rounded-xl border shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <Input
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    placeholder="Donor / Volunteer"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Rating</label>
                                <Select value={formData.rating} onValueChange={handleRatingChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select rating" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">1 Star</SelectItem>
                                        <SelectItem value="2">2 Stars</SelectItem>
                                        <SelectItem value="3">3 Stars</SelectItem>
                                        <SelectItem value="4">4 Stars</SelectItem>
                                        <SelectItem value="5">5 Stars</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Image</label>
                                <Tabs value={uploadType} onValueChange={(val) => setUploadType(val as 'url' | 'file')}>
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="url">Image URL</TabsTrigger>
                                        <TabsTrigger value="file">Upload File</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="url" className="mt-2">
                                        <div className="flex gap-2">
                                            <Input
                                                name="image"
                                                value={formData.image}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    setPreviewUrl(e.target.value);
                                                }}
                                                placeholder="https://example.com/photo.jpg"
                                            />
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="file" className="mt-2">
                                        <div className="flex items-center gap-2">
                                            <Input
                                                id="image-upload"
                                                type="file"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => document.getElementById('image-upload')?.click()}
                                                className="w-full"
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                Choose Image
                                            </Button>
                                            {imageFile && <span className="text-sm text-muted-foreground">{imageFile.name}</span>}
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                {previewUrl && (
                                    <div className="mt-4 rounded-lg overflow-hidden border bg-muted w-24 h-24">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = '/placeholder.svg';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Testimonial Content</label>
                            <Textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="What did they say?"
                                rows={4}
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => navigate('/admin/testimonials')}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Testimonial
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TestimonialEditor;
