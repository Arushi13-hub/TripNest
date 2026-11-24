import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Sparkles, Compass, MapPin, Star, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import TiltCard from './TiltCard';

const REVEAL_TEXT = "We design journeys to the planet's most breathtaking places — from Himalayan ridgelines to quiet Balinese temples — so you spend less time planning and more time standing in awe.";

function ScrollWord({ word, progress, range }) {
  const opacity = useTransform(progress, range, [0.22, 1]);
  const color = useTransform(progress, range, ['#D49A9A', '#7C0E44']);

  return (
    <motion.span 
      style={{ opacity, color }} 
      className="inline-block transition-colors mr-[0.28em] font-playfair font-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.25] tracking-tight"
    >
      {word}
    </motion.span>
  );
}

function StatCounter({ target, suffix = '', decimals = 0, isVisible }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 1800; // ms
    const frameRate = 30;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * ease;
      setCount(current);

      if (frame >= totalFrames) {
        clearInterval(timer);
        setCount(target);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [isVisible, target]);

  return (
    <span>
      {decimals > 0 ? count.toFixed(decimals) : Math.round(count)}
      {suffix}
    </span>
  );
}

export default function EditorialStorySection({ onExploreDestinations }) {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: '-60px' });

  // Scroll tracking for text reveal
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ['start 0.85', 'end 0.35'],
  });

  const words = REVEAL_TEXT.split(' ');

  return (
    <section 
      ref={sectionRef} 
      id="about" 
      className="bg-[#FAF3EF] text-[#3A1224] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 transition-colors border-t border-b border-[#D49A9A]/30"
    >
      <div className="max-w-6xl mx-auto space-y-24 sm:space-y-32">
        {/* PART 1: Scroll-Triggered Text Reveal */}
        <div ref={textRef} className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#AA5E7A]/15 text-[#AA5E7A] text-xs font-bold uppercase tracking-widest mb-8 border border-[#AA5E7A]/30 shadow-sm">
            <Compass className="w-3.5 h-3.5 text-[#AA5E7A]" />
            <span>About TripNest</span>
          </div>

          {/* Reveal Typography */}
          <div className="flex flex-wrap select-none leading-relaxed">
            {words.map((word, i) => {
              const start = i / words.length;
              const end = start + (1 / words.length) * 1.5;
              return (
                <ScrollWord 
                  key={i} 
                  word={word} 
                  progress={scrollYProgress} 
                  range={[start, Math.min(1, end)]} 
                />
              );
            })}
          </div>
        </div>

        {/* PART 2: Split Feature & Count-Up Stats */}
        <div ref={statsRef} className="pt-10 border-t border-[#D49A9A]/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Rounded Vertical Photo Card of Luxury A-Frame Cabin with Floating Badge wrapped in TiltCard */}
            <div className="lg:col-span-5 relative group">
              <TiltCard 
                maxTilt={14} 
                scale={1.03} 
                className="rounded-[2.25rem] overflow-hidden shadow-2xl border border-[#D49A9A]/50 aspect-[4/5] bg-neutral-200"
              >
                <img
                  src="https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80"
                  alt="Luxury A-frame Forest Cabin in Alpine Wilderness"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent pointer-events-none" />

                {/* Floating Glass Badge (Top Right) */}
                <div className="absolute top-5 right-5 z-10" style={{ transform: 'translateZ(20px)' }}>
                  <div className="bg-[#7C0E44]/90 backdrop-blur-xl border border-[#D49A9A]/40 px-3.5 py-2 rounded-2xl shadow-xl flex items-center space-x-2 text-[#F2DACE] text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#F2DACE]" />
                    <span>Hand-picked by local guides</span>
                  </div>
                </div>

                {/* Bottom Photo Caption */}
                <div className="absolute bottom-5 left-5 right-5 z-10 text-white" style={{ transform: 'translateZ(25px)' }}>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#F2DACE] mb-0.5">
                    Alpine Sanctuary
                  </p>
                  <h4 className="font-playfair text-xl font-bold text-white drop-shadow">
                    The Glasshouse Lodge · Dolomites
                  </h4>
                </div>
              </TiltCard>
            </div>

            {/* Right Column: Heading, Description, 2x2 Count-Up Grid & Button */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#AA5E7A] block">
                  Conscious Luxury Architecture
                </span>
                
                <h3 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-black text-[#7C0E44] tracking-tight leading-[1.12]">
                  Nature, planned with care.
                </h3>
                
                <p className="text-sm sm:text-base text-[#3A1224] font-normal leading-relaxed max-w-xl">
                  We believe journeys should be restorative, seamless, and mindful. Every private trail permit, secluded forest lodge, and local culinary artisan is hand-vetted by our in-house field directors so you step into wild landscapes with total serenity.
                </p>
              </div>

              {/* Animated 2x2 Count-Up Stats Grid */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-2">
                {/* Stat 1 */}
                <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-[#D49A9A]/40 shadow-sm hover:shadow-md transition-shadow">
                  <div className="font-cinzel text-3xl sm:text-4xl font-black text-[#7C0E44] mb-1">
                    <StatCounter target={360} suffix="+" isVisible={isStatsInView} />
                  </div>
                  <p className="text-xs font-bold text-[#AA5E7A] uppercase tracking-wider">
                    Curated routes
                  </p>
                </div>

                {/* Stat 2 */}
                <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-[#D49A9A]/40 shadow-sm hover:shadow-md transition-shadow">
                  <div className="font-cinzel text-3xl sm:text-4xl font-black text-[#7C0E44] mb-1">
                    <StatCounter target={48} suffix="" isVisible={isStatsInView} />
                  </div>
                  <p className="text-xs font-bold text-[#AA5E7A] uppercase tracking-wider">
                    Countries
                  </p>
                </div>

                {/* Stat 3 */}
                <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-[#D49A9A]/40 shadow-sm hover:shadow-md transition-shadow">
                  <div className="font-cinzel text-3xl sm:text-4xl font-black text-[#7C0E44] mb-1">
                    <StatCounter target={12} suffix="K+" isVisible={isStatsInView} />
                  </div>
                  <p className="text-xs font-bold text-[#AA5E7A] uppercase tracking-wider">
                    Happy travelers
                  </p>
                </div>

                {/* Stat 4 */}
                <div className="bg-white/95 rounded-3xl p-5 sm:p-6 border border-[#D49A9A]/40 shadow-sm hover:shadow-md transition-shadow">
                  <div className="font-cinzel text-3xl sm:text-4xl font-black text-[#7C0E44] mb-1 flex items-center">
                    <StatCounter target={4.9} decimals={1} isVisible={isStatsInView} />
                    <Star className="w-5 h-5 ml-1.5 fill-[#AA5E7A] text-[#AA5E7A]" />
                  </div>
                  <p className="text-xs font-bold text-[#AA5E7A] uppercase tracking-wider">
                    Average rating
                  </p>
                </div>
              </div>

              {/* Dark Pill Button: Explore Destinations */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (onExploreDestinations) {
                      onExploreDestinations();
                    } else {
                      const el = document.getElementById('destinations-carousel');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="inline-flex items-center space-x-2.5 px-7 py-4 rounded-full font-bold text-xs uppercase tracking-wider text-[#F2DACE] bg-[#7C0E44] hover:bg-[#AA5E7A] active:scale-95 transition-all shadow-xl cursor-pointer"
                >
                  <span>Explore destinations</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
