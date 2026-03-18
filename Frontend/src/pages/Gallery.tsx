import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import { galleryApi, categoryApi } from "@/lib/api";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [galleryRes, categoryRes] = await Promise.all([
          galleryApi.getAll(),
          categoryApi.getAll()
        ]);

        // Transform gallery data
        const formattedImages = galleryRes.data.map((item: any) => ({
          src: getImageUrl(item.image) || '/placeholder.svg',
          alt: item.caption || item.description || "Gallery Image",
          caption: item.caption,
          category_name: item.category_name
        }));
        setGalleryImages(formattedImages);

        // Transform category data
        const formattedCategories = ["All", ...categoryRes.data.map((cat: any) => cat.name)];
        setCategories(formattedCategories);
      } catch (error) {
        console.error("Failed to fetch gallery data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredImages = selectedCategory === "All"
    ? galleryImages
    : galleryImages.filter((img) => img.category_name === selectedCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredImages.length : 0));
  const prevImage = () => setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : 0));

  return (
    <Layout>
      <PageHero
        title="Glimpses of Our"
        accentText="Sacred Work"
        subtitle="Our Gallery"
        description="Explore beautiful moments captured from our gaushalas, feeding programs, and the sacred cows we care for every day."
      />

      {/* Gallery Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {categories.map((category_name) => (
                  <button
                    key={category_name}
                    onClick={() => setSelectedCategory(category_name)}
                    className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === category_name
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                  >
                    {category_name}
                  </button>
                ))}
              </div>

              {/* Gallery Grid */}
              <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                <AnimatePresence>
                  {filteredImages.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      No images found.
                    </div>
                  ) : (
                    filteredImages.map((image, index) => (
                      <motion.div
                        key={`${image.src}-${index}`}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
                        onClick={() => openLightbox(index)}
                      >
                        <img
                          src={image.src || "/no-image.png"}
                          alt={image.alt}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-sacred-brown/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <div>
                            <span className="text-xs text-accent font-medium">{image.category_name}</span>
                            <p className="text-cream text-sm font-medium">{image.caption}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-sacred-brown/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 text-cream hover:text-accent transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-6 p-2 text-cream hover:text-accent transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <motion.img
              key={lightboxIndex}
              src={filteredImages[lightboxIndex].src}
              alt={filteredImages[lightboxIndex].alt}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-6 p-2 text-cream hover:text-accent transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            <div className="absolute bottom-6 text-center text-cream">
              {filteredImages[lightboxIndex] && (
                <>
                  <p className="font-medium">{filteredImages[lightboxIndex].alt}</p>
                  <p className="text-sm text-cream/70">
                    {lightboxIndex + 1} / {filteredImages.length}
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Gallery;
