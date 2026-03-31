import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getImageUrl } from '@/lib/utils';
import { causeApi, causeCategoryApi } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";

const CauseEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: '',
        short_description: '',
        full_content: '',
        image: '',
        goal_amount: '',
        category: '',
        featured: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(isEditing);
    const [categories, setCategories] = useState<any[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Image upload state
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadType, setUploadType] = useState<'url' | 'file'>('url');
    const [previewUrl, setPreviewUrl] = useState<string>('');

    useEffect(() => {
        fetchCategories();
        if (isEditing) {
            fetchCause();
        }
    }, [id]);

    const fetchCause = async () => {
        try {
            const response = await causeApi.getById(id!);
            setFormData({
                title: response.data.title,
                short_description: response.data.short_description,
                full_content: response.data.full_content,
                image: response.data.image,
                goal_amount: response.data.goal_amount.toString(),
                category: response.data.category,
                featured: response.data.featured,
            });
            if (response.data.image || response.data.image_file) {
                setPreviewUrl(getImageUrl(response.data.image_file || response.data.image || response.data.image_url));
            }
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to fetch cause details');
            navigate('/admin/causes');
        } finally {
            setIsFetching(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await causeCategoryApi.getAll();
            setCategories(res.data);
        } catch (error) {
            console.error("Failed to fetch categories");
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            const res = await causeCategoryApi.create({ name: newCategoryName });
            // Re-fetch all categories to ensure state is perfectly synced with backend
            const updatedCategories = await causeCategoryApi.getAll();
            setCategories(updatedCategories.data);
            
            // Explicitly set the new category as selected
            setFormData(prev => ({ ...prev, category: res.data.name }));
            setNewCategoryName('');
            toast.success("Category added!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add category");
        }
    };

    const handleDeleteCategory = async (catId: number | string, catName: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm(`Delete category "${catName}"?`)) {
            try {
                await causeCategoryApi.delete(catId);
                setCategories(prev => prev.filter(c => (c.id || c._id) !== catId));
                if (formData.category === catName) {
                    setFormData(prev => ({ ...prev, category: '' }));
                }
                toast.success("Category deleted");
            } catch (error) {
                toast.error("Failed to delete category");
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, featured: checked }));
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
            const data = new FormData();
            data.append('title', formData.title);
            data.append('short_description', formData.short_description);
            data.append('full_content', formData.full_content);
            data.append('goal_amount', formData.goal_amount); 
            data.append('category', formData.category);
            data.append('featured', String(formData.featured));

            if (imageFile) {
                data.append('image', imageFile);
            } else if (formData.image) {
                data.append('image', formData.image);
            }
            
            if (isEditing) {
                await causeApi.update(id!, data);
                toast.success('Cause updated successfully');
            } else {
                await causeApi.create(data);
                toast.success('Cause created successfully');
            }
            navigate('/admin/causes');
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to save cause');
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
        <div className="min-h-screen bg-muted/30 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link to="/admin/causes">
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">{isEditing ? 'Edit Cause' : 'Create New Cause'}</h1>
                        </div>
                    </div>
                </div>

                <div className="bg-background rounded-[40px] border border-border/50 shadow-sm p-4 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter cause title"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <div className="p-2 border-b mb-2">
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="New category..."
                                                    value={newCategoryName}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        setNewCategoryName(e.target.value);
                                                    }}
                                                    className="h-8 text-sm"
                                                    onKeyDown={(e) => {
                                                        e.stopPropagation();
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleAddCategory();
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="h-8 px-2"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleAddCategory();
                                                    }}
                                                    disabled={!newCategoryName.trim()}
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id || cat._id} value={cat.name} className="group pr-8 relative">
                                                <div className="flex items-center justify-between w-full min-w-[200px]">
                                                    <span>{cat.name}</span>
                                                    <div
                                                        role="button"
                                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded-md transition-all z-50 cursor-pointer"
                                                        onClick={(e) => handleDeleteCategory(cat.id || cat._id, cat.name, e)}
                                                        onPointerDown={(e) => e.stopPropagation()}
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Goal Amount ($)</label>
                                <Input
                                    name="goal_amount"
                                    type="number"
                                    value={formData.goal_amount}
                                    onChange={handleChange}
                                    placeholder="5000"
                                    required
                                />
                            </div>
                            <div className="space-y-2 flex items-center justify-between border rounded-md p-3 mt-auto">
                                <label className="text-sm font-medium">Featured Cause</label>
                                <Switch
                                    checked={formData.featured}
                                    onCheckedChange={handleSwitchChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Cause Image</label>
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
                                            placeholder="https://example.com/cause.jpg"
                                        />
                                    </div>
                                </TabsContent>
                                <TabsContent value="file" className="mt-2">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="cause-image-upload"
                                            type="file"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => document.getElementById('cause-image-upload')?.click()}
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
                            <label className="text-sm font-medium">Short Description</label>
                            <Textarea
                                name="short_description"
                                value={formData.short_description}
                                onChange={handleChange}
                                placeholder="Brief description for cards"
                                rows={3}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Full Content</label>
                            <Textarea
                                name="full_content"
                                value={formData.full_content}
                                onChange={handleChange}
                                placeholder="Detailed explanation of the cause..."
                                className="min-h-[200px]"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => navigate('/admin/causes')}>
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
                                        Save Cause
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

export default CauseEditor;
