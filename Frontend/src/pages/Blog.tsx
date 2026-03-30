import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Tag, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import PageHero from "@/components/layout/PageHero";
import { blogApi } from "@/lib/api";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(7); // Show 1 featured + 6 more initially

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching blogs from API...");
        const response = await blogApi.getAll();
        console.log("Blog API Response received:", response.status, response.data);

        // Ensure data is an array
        const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
        
        if (!Array.isArray(data)) {
          console.error("API did not return an array:", response.data);
          setBlogPosts([]);
          setIsLoading(false);
          return;
        }

        // Map backend data to frontend structure if needed
        const formattedPosts = data.map((post: any) => {
          // Robust date parsing
          let displayDate = "Pending";
          const rawDate = post.created_at || post.createdAt || post.date;
          if (rawDate) {
            const dateObj = new Date(rawDate);
            if (!isNaN(dateObj.getTime())) {
              displayDate = dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
            }
          }

          return {
            ...post,
            id: post.id || post._id,
            // Use getImageUrl utility for robust URL construction
            image: getImageUrl(post.featured_image || post.featured_image_url) || '/placeholder.svg',
            title: post.title || "Untitled Post",
            excerpt: post.excerpt || "No excerpt available",
            date: displayDate,
            category: post.category || 'General',
            // Handle Author: it can be an object or a string or null
            author: post.author ? (typeof post.author === 'object' ? (post.author.username || 'Admin') : post.author) : 'Admin'
          };
        });
        setBlogPosts(formattedPosts);
      } catch (error: any) {
        console.error("Failed to fetch blogs:", error);
        toast.error(error.backendError || "Failed to load blog posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <Layout>
      <PageHero
        title="Stories &"
        accentText="Updates"
        subtitle="Our Blog"
        description="Stay connected with our mission through stories, updates, and insights about cow welfare and our sacred work."
      />

      {/* Blog Posts */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No blog posts found.</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {blogPosts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-16"
                >
                  <div className="grid lg:grid-cols-2 gap-8 items-center bg-card rounded-2xl overflow-hidden border border-border shadow-lg">
                    <div className="relative h-64 lg:h-full min-h-[300px]">
                      <img
                        src={blogPosts[0].image}
                        alt={blogPosts[0].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-accent text-accent-foreground text-sm font-medium rounded-full">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {blogPosts[0].date}
                        </span>
                      </div>
                      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                        {blogPosts[0].title}
                      </h2>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {blogPosts[0].excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <span className="font-medium text-foreground">{blogPosts[0].author}</span>
                        </div>
                        <Link to={`/blog/${blogPosts[0].id}`}>
                          <Button variant="sacred">
                            Know More
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Post Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.slice(1, visibleCount).map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="card-sacred overflow-hidden group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </span>
                      </div>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <span className="text-sm text-muted-foreground">{post.author}</span>
                        </div>
                        <Link
                          to={`/blog/${post.id}`}
                          className="text-primary font-medium text-sm hover:text-primary/80 flex items-center gap-1"
                        >
                          View
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Load More */}
              {visibleCount < blogPosts.length && (
                <div className="text-center mt-12">
                  <Button 
                    variant="outline-sacred" 
                    size="lg" 
                    onClick={() => setVisibleCount(prev => prev + 6)}
                  >
                    Load More Articles
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
