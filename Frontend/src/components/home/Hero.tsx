import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/hero-9.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/10" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 pt-32">
        <div className="max-w-3xl glass-dark/20 p-8 md:p-12 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Subtle Green Glow */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
          
          <span className="inline-block px-4 py-2 bg-primary text-white rounded-full 
                         text-sm font-semibold mb-6 animate-fade-in shadow-lg relative z-10">
            An Initiative of Savadia Foundation
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 
                       leading-tight animate-slide-up font-serif relative z-10">
            <span className="text-white drop-shadow-md">GauChara:</span>
            <span className="block mt-2 text-primary brightness-125 drop-shadow-[0_2px_10px_rgba(34,197,94,0.3)]">
              Nourishing Bos Indicus Cows
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed 
                      animate-slide-up relative z-10" style={{ animationDelay: '0.1s' }}>
            Dedicated to the nourishment of <span className="text-primary brightness-125 font-bold">Gaumata</span>, the spiritual cornerstone of our tradition.
            We provide <span className="text-primary brightness-125 font-bold">high-quality silage</span> made from <span className="text-primary brightness-125 font-bold">corn crops</span> to ensure their health and well-being.
          </p>

          <div className="flex flex-wrap gap-4 animate-slide-up relative z-10" style={{ animationDelay: '0.2s' }}>
            <Button asChild className="btn-primary text-lg px-8 py-6 shadow-lg hover:shadow-primary/20">
              <Link to="/donate">
                Donate Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 animate-fade-in relative z-10" style={{ animationDelay: '0.3s' }}>
            <div className="group">
              <span className="text-3xl md:text-4xl font-bold text-primary brightness-125 group-hover:scale-110 transition-transform inline-block">5K+</span>
              <p className="text-white/70 text-sm mt-1 font-semibold uppercase tracking-wider">Lives Impacted</p>
            </div>
            <div className="group">
              <span className="text-3xl md:text-4xl font-bold text-primary brightness-125 group-hover:scale-110 transition-transform inline-block">50+</span>
              <p className="text-white/70 text-sm mt-1 font-semibold uppercase tracking-wider">Active Projects</p>
            </div>
            <div className="group">
              <span className="text-3xl md:text-4xl font-bold text-primary brightness-125 group-hover:scale-110 transition-transform inline-block">100+</span>
              <p className="text-white/70 text-sm mt-1 font-semibold uppercase tracking-wider">Volunteers</p>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
};

export default Hero;
