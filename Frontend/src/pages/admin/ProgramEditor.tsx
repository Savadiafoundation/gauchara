import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { programApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Save, Upload, LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getImageUrl } from '@/lib/utils';

const ProgramEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        url_image: '',
        file_image: null as File | null,
    });

    // UI states
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(isEditing);
    const [uploadType, setUploadType] = useState<'url' | 'file'>('url');
    const [previewUrl, setPreviewUrl] = useState<string>('');

    useEffect(() => {
        if (isEditing) {
            fetchProgram();
        } else {
            setIsFetching(false);
        }
    }, [id]);

    const fetchProgram = async () => {
        try {
            const response = await programApi.getById(id!);
            const data = response.data;

            setFormData({
                title: data.title,
                description: data.description,
                url_image: data.url_image || '',
                file_image: null,
            });

            // Set initial preview
            const initialImage = data.file_image || data.url_image;
            if (initialImage) {
                setPreviewUrl(getImageUrl(initialImage));
            }

            // Set initial tab based on what kind of image we have
            if (data.file_image) {
                setUploadType('file');
            } else if (data.url_image) {
                setUploadType('url');
            }

        } catch (error: any) {
            toast.error(error.backendError || 'Failed to fetch program details');
            navigate('/admin/programs');
        } finally {
            setIsFetching(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, file_image: file }));
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setFormData(prev => ({ ...prev, url_image: url }));
        setPreviewUrl(url);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);

            // Handle image logic
            if (uploadType === 'file' && formData.file_image) {
                data.append('file_image', formData.file_image);
                // If we are uploading a file, we should probably clear the url_image on backend if possible, 
                // or the backend prioritizes file_image.
            } else if (uploadType === 'url' && formData.url_image) {
                data.append('url_image', formData.url_image);
            } else if (uploadType === 'file' && !formData.file_image && isEditing) {
                // If editing and kept on 'file' tab but didn't upload NEW file, do nothing to image fields
                // This assumes backend doesn't clear image if field is missing
            }

            if (isEditing) {
                await programApi.update(id!, data);
                toast.success('Program updated successfully');
            } else {
                await programApi.create(data);
                toast.success('Program created successfully');
            }
            navigate('/admin/programs');
        } catch (error: any) {
            console.error(error);
            toast.error(error.backendError || 'Failed to save program');
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
                            <Link to="/admin/programs">
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">{isEditing ? 'Edit Program' : 'Create New Program'}</h1>
                        </div>
                    </div>
                </div>

                <div className="bg-background rounded-xl border shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Program Title"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Program Image</label>
                            <Tabs value={uploadType} onValueChange={(val) => setUploadType(val as 'url' | 'file')}>
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="url">Image URL</TabsTrigger>
                                    <TabsTrigger value="file">Upload File</TabsTrigger>
                                </TabsList>
                                <TabsContent value="url" className="mt-2">
                                    <div className="flex gap-2">
                                        <Input
                                            name="url_image"
                                            value={formData.url_image}
                                            onChange={handleUrlChange}
                                            placeholder="https://example.com/program.jpg"
                                        />
                                    </div>
                                </TabsContent>
                                <TabsContent value="file" className="mt-2">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="program-image-upload"
                                            type="file"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => document.getElementById('program-image-upload')?.click()}
                                            className="w-full"
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            Choose Image
                                        </Button>
                                        {formData.file_image && <span className="text-sm text-muted-foreground">{formData.file_image.name}</span>}
                                    </div>
                                </TabsContent>
                            </Tabs>

                            {previewUrl && (
                                <div className="mt-4 rounded-lg overflow-hidden border bg-muted w-full aspect-video md:w-64 md:h-40 relative">
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

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Detailed description of the program..."
                                rows={6}
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => navigate('/admin/programs')}>
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
                                        Save Program
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

export default ProgramEditor;
