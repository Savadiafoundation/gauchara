import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, User, ArrowLeft, Tag, Share2, Facebook, Twitter, Loader2 } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { blogApi } from "@/lib/api";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        // User confirmed individual blog is at /api/blog/<int:pk>/
        if (!id) return;
        const response = await blogApi.getById(id);
        setPost(response.data);
      } catch (error: any) {
        console.error("Failed to fetch blog post:", error);
        toast.error("Failed to load article");
        navigate("/blog");
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!post) return null;

  const displayDate = post.created_at 
    ? new Date(post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : "Recent Post";

  const authorName = post.author 
    ? (typeof post.author === 'object' ? (post.author.username || 'GauChara Admin') : post.author) 
    : 'GauChara Admin';

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                {post.category || 'General'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {displayDate}
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{authorName}</div>
                  <div className="text-sm text-muted-foreground">Author</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl overflow-hidden"
          >
            <img
              src={getImageUrl(post.featured_image || post.featured_image_url || post.image) || '/placeholder.svg'}
              alt={post.title}
              className="w-full h-[400px] md:h-[500px] object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3"
            >
              <div className="prose prose-lg max-w-none">
                {post.content && post.content.split('\n\n').map((paragraph: string, index: number) => {
                  // Handle Headers
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="font-display text-2xl font-bold text-foreground mt-8 mb-4">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  
                  // Handle Lists
                  if (paragraph.startsWith('- ')) {
                    const items = paragraph.split('\n').map(item => item.replace('- ', ''));
                    return (
                      <ul key={index} className="list-disc pl-6 space-y-2 text-muted-foreground my-6">
                        {items.map((item, i) => (
                          <li key={i}>{item.replace(/\*\*/g, '')}</li>
                        ))}
                      </ul>
                    );
                  }

                  // Handle Images: ![alt](url)
                  const imgMatch = paragraph.match(/!\[(.*?)\]\((.*?)\)/);
                  if (imgMatch) {
                    return (
                      <div key={index} className="my-8 rounded-2xl overflow-hidden shadow-lg border border-border/50 bg-muted/30">
                        <img 
                          src={getImageUrl(imgMatch[2])} 
                          alt={imgMatch[1] || 'Blog image'} 
                          className="w-full h-auto object-cover max-h-[600px] hover:scale-[1.01] transition-transform duration-500"
                        />
                        {imgMatch[1] && (
                          <p className="text-center text-sm text-muted-foreground py-3 border-t border-border/30 italic">
                            {imgMatch[1]}
                          </p>
                        )}
                      </div>
                    );
                  }

                  // Default Paragraph
                  return (
                    <p key={index} className="text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Share */}
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-foreground flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share this post:
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Twitter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="card-sacred p-6 sticky top-24">
                <h3 className="font-display text-lg font-bold text-foreground mb-4">
                  Support Our Mission
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Your donation helps us provide care for thousands of sacred cows across India.
                </p>
                <Link to="/donate">
                  <Button variant="sacred" className="w-full">
                    Donate Now
                  </Button>
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
