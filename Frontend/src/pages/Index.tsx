import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import ImpactCounters from '@/components/home/ImpactCounters';
import Causes from '@/components/home/Causes';
import BlogPreview from '@/components/home/BlogPreview';
import Testimonials from '@/components/home/Testimonials';
// import Sponsors from '@/components/home/Sponsors';
import CTABanner from '@/components/home/CTABanner';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <About />
      <ImpactCounters />
      {/* Temporarily disabled to debug */}
      {/* <Causes /> */}
      <Testimonials />
      <BlogPreview />
      <CTABanner />
      {/* <Sponsors /> */}
    </Layout>
  );
};

export default Index;
