import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { blogApi } from '@/lib/api';
import { getImageUrl } from '@/lib/utils';

const BlogPreview = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await blogApi.getAll();
        // Sort by date and take latest 3
        const latestBlogs = response.data
          .sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
          .slice(0, 3);
        setBlogs(latestBlogs);
      } catch (error) {
        console.error("Failed to fetch blog previews", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full 
                         text-sm font-semibold mb-4">
            GauChara Updates
          </span>
          <h2 className="section-title">Chronicles of Care</h2>
          <p className="section-subtitle">
            Read about our recent activities, rescue stories, and the impact of your support.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-lg h-[400px] animate-pulse" />
            ))
          ) : blogs.length === 0 ? (
            <div className="col-span-full text-center py-20 text-muted-foreground italic font-medium">
              No recent updates detected in the archives.
            </div>
          ) : blogs.map((blog) => (
            <article
              key={blog.id}
              className="bg-card rounded-2xl overflow-hidden shadow-lg card-hover group"
            >
              {/* Image */}
              <Link to={`/blog/${blog.id || blog._id}`} className="block relative h-52 overflow-hidden">
                <img
                  src={getImageUrl(blog.featured_image || blog.featured_image_url || blog.image_file || blog.image)}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 
                           group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </Link>

              {/* Content */}
              <div className="p-6">
                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(blog.created_at || blog.createdAt || blog.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {typeof blog.author === 'object' ? (blog.author?.username || 'GauChara Admin') : (blog.author || 'GauChara Admin')}
                  </span>
                </div>

                <Link to={`/blog/${blog.id || blog._id}`}>
                  <h3 className="text-xl font-bold text-card-foreground mb-2 
                               group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                </Link>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {blog.short_description || blog.excerpt}
                </p>

                <Link
                  to={`/blog/${blog.id || blog._id}`}
                  className="inline-flex items-center gap-2 text-primary font-semibold 
                           text-sm hover:gap-3 transition-all"
                >
                  Know More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link to="/blog">
            <Button variant="outline" className="btn-outline">
              View All Articles
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
