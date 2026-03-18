import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { blogApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Save, Upload, LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BlogEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        excerpt: '',
        featured_image: '',
        author: 'Admin',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(isEditing);

    // File upload state
    const [uploadType, setUploadType] = useState('url');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            if (isEditing) {
                await fetchBlog();
            } else {
                setIsFetching(false);
            }
        };
        init();
    }, [id]);

    const fetchBlog = async () => {
        try {
            if (!id) return;
            const response = await blogApi.getById(id);
            const blog = response.data;
            if (blog) {
                setFormData({
                    title: blog.title,
                    slug: blog.slug,
                    content: blog.content,
                    excerpt: blog.excerpt,
                    featured_image: blog.featured_image_url || blog.featured_image,
                    author: typeof blog.author === 'object' ? blog.author.username : (blog.author || 'Admin'),
                });

                if (blog.featured_image_url || blog.featured_image) {
                    setUploadType('url');
                    setImagePreview(blog.featured_image_url || blog.featured_image);
                }
            } else {
                toast.error('Blog not found');
                navigate('/admin/blogs');
            }
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to fetch blog details');
        } finally {
            setIsFetching(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from title if creating new
        if (name === 'title' && !isEditing) {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        let payload: any;

        if (uploadType === 'file' && imageFile) {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('slug', formData.slug);
            data.append('content', formData.content);
            data.append('excerpt', formData.excerpt);
            data.append('author', formData.author);
            data.append('image', imageFile);
            payload = data;
        } else {
            payload = {
                ...formData,
                featured_image_url: formData.featured_image,
            };
        }

        try {
            if (isEditing) {
                await blogApi.update(id!, payload);
                toast.success('Blog updated successfully');
            } else {
                await blogApi.create(payload);
                toast.success('Blog created successfully');
            }
            navigate('/admin/blogs');
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to save blog');
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
                            <Link to="/admin/blogs">
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">{isEditing ? 'Edit Blog' : 'Create New Blog'}</h1>
                        </div>
                    </div>
                </div>

                <div className="bg-background rounded-xl border shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter blog title"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Slug</label>
                                <Input
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    placeholder="url-friendly-slug"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Featured Image</label>
                            <Tabs value={uploadType} onValueChange={setUploadType} className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="url">Image URL</TabsTrigger>
                                    <TabsTrigger value="file">Upload File</TabsTrigger>
                                </TabsList>
                                <TabsContent value="url" className="mt-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <LinkIcon className="w-4 h-4 text-muted-foreground" />
                                            <Input
                                                name="featured_image"
                                                value={formData.featured_image}
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    setImagePreview(e.target.value);
                                                }}
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>
                                        {imagePreview && uploadType === 'url' && (
                                            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted border">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                                <TabsContent value="file" className="mt-4">
                                    <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors">
                                        {imagePreview && uploadType === 'file' ? (
                                            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-muted-foreground py-8">
                                                <Upload className="w-12 h-12 mb-2" />
                                                <span>Click to upload image</span>
                                            </div>
                                        )}
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="cursor-pointer"
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Excerpt</label>
                            <Textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                placeholder="Brief summary of the blog post"
                                rows={3}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Content (Markdown supported)</label>
                            <Textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Write your blog content here..."
                                className="min-h-[300px] font-mono"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => navigate('/admin/blogs')}>
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
                                        Save Blog
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
};

export default BlogEditor;
