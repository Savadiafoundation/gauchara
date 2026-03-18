import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { galleryApi, categoryApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Loader2, Upload, LinkIcon, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GalleryEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(isEditing);

    const [formData, setFormData] = useState({
        caption: '',
        category: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [uploadType, setUploadType] = useState('file');
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;

        try {
            const res = await categoryApi.create({ name: newCategoryName });

            // Log response to debug
            console.log("Category created:", res.data);

            const newCat = res.data;
            // Ensure we have a valid ID. Some backends return _id, some id.
            const catObj = {
                id: newCat.id || newCat._id,
                name: newCat.name || newCategoryName,
                ...newCat
            };

            // Update categories list immediately
            setCategories(prev => [...prev, catObj]);

            // Auto-select the new category
            setFormData(prev => ({ ...prev, category: newCat.name || newCategoryName }));

            setNewCategoryName('');
            toast.success("Category added!");
        } catch (error) {
            console.error("Failed to add category:", error);
            toast.error("Failed to add category");
        }
    };

    useEffect(() => {
        const init = async () => {
            await fetchCategories();
            if (isEditing) {
                await fetchGalleryItem();
            } else {
                setIsFetching(false);
            }
        };
        init();
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await categoryApi.getAll();
            setCategories(response.data);
            if (response.data.length > 0 && !isEditing) {
                // Optionally default to first category
                setFormData(prev => ({ ...prev, category: response.data[0].name }));
            }
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    };

    const fetchGalleryItem = async () => {
        try {
            // Workaround: Fetch all items and filter, as GET /gallery/:id/ is currently broken on backend
            const response = await galleryApi.getAll();
            const data = response.data.find((item: any) => (item.id || item._id) == id);

            if (!data) {
                throw new Error('Gallery item not found');
            }

            setFormData({
                caption: data.caption,
                category: data.category_name || data.category || '',
            });

            setImagePreview(data.image);
            setImageUrl(data.image);
            if (data.image && (data.image.startsWith('http') || data.image.startsWith('/'))) {
                setUploadType('url');
            }
        } catch (error: any) {
            toast.error(error.backendError || 'Failed to fetch gallery details');
            navigate('/admin/gallery');
        } finally {
            setIsFetching(false);
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

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageUrl(e.target.value);
        setImagePreview(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (uploadType === 'file' && !imageFile && !isEditing) {
            toast.error('Please upload an image');
            return;
        }

        if (uploadType === 'url' && !imageUrl) {
            toast.error('Please enter an image URL');
            return;
        }

        setIsLoading(true);
        const data = new FormData();
        data.append('caption', formData.caption);
        data.append('category_name', formData.category);

        if (uploadType === 'file' && imageFile) {
            data.append('image', imageFile);
        } else if (uploadType === 'url' && imageUrl) {
            data.append('image', imageUrl);
        }

        try {
            if (isEditing) {
                await galleryApi.update(id!, data);
                toast.success('Gallery item updated successfully');
            } else {
                await galleryApi.create(data);
                toast.success('Gallery item created successfully');
            }
            navigate('/admin/gallery');
        } catch (error: any) {
            console.error(error);
            toast.error(error.backendError || (isEditing ? 'Failed to update item' : 'Failed to create item'));
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30 p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="outline" size="icon" asChild>
                        <Link to="/admin/gallery">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">{isEditing ? 'Edit Gallery Item' : 'Add New Image'}</h1>
                        <p className="text-muted-foreground">
                            {isEditing ? 'Update image details' : 'Upload a new image to the gallery'}
                        </p>
                    </div>
                </div>

                <div className="bg-background rounded-xl border shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload */}
                        {/* Image Upload */}
                        <div className="space-y-4">
                            <Label>Image</Label>
                            <Tabs value={uploadType} onValueChange={setUploadType} className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="file">Upload File</TabsTrigger>
                                    <TabsTrigger value="url">Image URL</TabsTrigger>
                                </TabsList>
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
                                <TabsContent value="url" className="mt-4">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <LinkIcon className="w-4 h-4 text-muted-foreground" />
                                            <Input
                                                placeholder="https://example.com/image.jpg"
                                                value={imageUrl}
                                                onChange={handleUrlChange}
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
                            </Tabs>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => setFormData({ ...formData, category: value })}
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
                                                    // Stop propagation to prevent Select from reacting to input changes
                                                    e.stopPropagation();
                                                    setNewCategoryName(e.target.value);
                                                }}
                                                className="h-8 text-sm"
                                                onKeyDown={(e) => {
                                                    e.stopPropagation(); // Prevent Select navigation
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddCategory();
                                                    }
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                onFocus={(e) => e.stopPropagation()}
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
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id || category._id}
                                            value={category.name}
                                            className="group pr-8 relative" // Add padding for the absolute button or just flex
                                        >
                                            <div className="flex items-center justify-between w-full min-w-[200px]">
                                                <span>{category.name}</span>
                                                <div
                                                    role="button"
                                                    tabIndex={0}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded-md transition-all z-50 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation(); // CRITICAL: Stop Select from selecting this item

                                                        const catId = category.id || category._id;
                                                        if (window.confirm(`Delete category "${category.name}"?`)) {
                                                            categoryApi.delete(catId).then(() => {
                                                                setCategories(prev => prev.filter(c => (c.id || c._id) !== catId));
                                                                if (formData.category === category.name) {
                                                                    setFormData(prev => ({ ...prev, category: '' }));
                                                                }
                                                                toast.success("Category deleted");
                                                            }).catch(() => toast.error("Failed to delete"));
                                                        }
                                                    }}
                                                    onKeyDown={(e) => e.stopPropagation()}
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

                        {/* Caption */}
                        <div className="space-y-2">
                            <Label htmlFor="caption">Caption</Label>
                            <Textarea
                                id="caption"
                                value={formData.caption}
                                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                                placeholder="Enter image caption..."
                                rows={4}
                                required
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" size="lg" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        {isEditing ? 'Update Item' : 'Create Item'}
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

export default GalleryEditor;
