import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Loader2 } from 'lucide-react';
import { testimonialApi } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';
import { toast } from 'sonner';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await testimonialApi.getAll();
        setTestimonials(response.data);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        // Don't show error toast for network failures on public pages
        // Just gracefully show empty state
        setTestimonials([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const nextSlide = () => {
    if (isAnimating || testimonials.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    if (isAnimating || testimonials.length === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    if (testimonials.length > 0) {
      const autoPlay = setInterval(nextSlide, 5000);
      return () => clearInterval(autoPlay);
    }
  }, [testimonials.length, isAnimating]); // Added isAnimating to dependency to pause on manual interaction if needed, but simple interval is fine.

  if (isLoading || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full 
                         text-sm font-semibold mb-4">
            Devotee Voices
          </span>
          <h2 className="section-title">Words of Devotion</h2>
          <p className="section-subtitle">
            Heartfelt messages from those who support our sacred mission.
          </p>
        </div>

        {/* Testimonial Slider */}
        <div className="max-w-4xl mx-auto relative">
          {/* Main Content */}
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 w-16 h-16 bg-primary/10 rounded-full 
                          flex items-center justify-center">
              <Quote className="w-8 h-8 text-primary" />
            </div>

            {/* Testimonial */}
            <div
              className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={getImageUrl(testimonials[currentIndex].image || testimonials[currentIndex].image_file || testimonials[currentIndex].image_url)}
                    alt={testimonials[currentIndex].name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover 
                             border-4 border-primary shadow-lg"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + testimonials[currentIndex].name;
                    }}
                  />
                </div>

                {/* Content */}
                <div className="text-center md:text-left">
                  {/* Stars */}
                  <div className="flex justify-center md:justify-start gap-1 mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-accent fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>

                  <blockquote className="text-lg md:text-xl text-card-foreground mb-6 
                                       leading-relaxed italic">
                    "{testimonials[currentIndex].content}"
                  </blockquote>

                  <div>
                    <h4 className="font-bold text-foreground text-lg">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-muted-foreground">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border-2 border-primary text-primary 
                         hover:bg-primary hover:text-primary-foreground transition-colors
                         flex items-center justify-center"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full border-2 border-primary text-primary 
                         hover:bg-primary hover:text-primary-foreground transition-colors
                         flex items-center justify-center"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
