import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MapPin, Calendar, Users, ArrowRight, Compass, Sparkles, ChevronDown } from 'lucide-react';

export default function TriplioHero({ onQuickPlanSubmit, onOpenPlanner }) {
  const containerRef = useRef(null);

  // Scroll-driven 3D parallax & camera zoom
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);
  const foregroundY = useTransform(scrollYProgress, [0, 1], ['0%', '-4%']);
  const overlayY = useTransform(scrollYProgress, [0, 0.6], ['0%', '18%']);

  // Quick Plan Search Bar state
  const [destination, setDestination] = useState('Kyoto, Japan');
  const [dates, setDates] = useState('Nov 20 - Nov 23');
  const [guests, setGuests] = useState('2 Guests');

  const popularDestinations = [
    'Kyoto, Japan',
    'Dolomites, Italy',
    'Swiss Alps, Switzerland',
    'Amalfi Coast, Italy',
    'Banff, Canada',
    'Patagonia, Chile',
  ];

  const handleBookSchedule = (e) => {
    e.preventDefault();
    if (onQuickPlanSubmit) {
      onQuickPlanSubmit({ destination, dates, guests });
    } else if (onOpenPlanner) {
      onOpenPlanner();
    }
  };

  return (
    <section 
      ref={containerRef}
      id="home"
      className="relative pt-20 pb-4 px-2 sm:px-4 lg:px-6 min-h-screen flex flex-col justify-center"
    >
      {/* Crisp Outer Frame with Rounded Corners (position: relative; overflow: hidden) */}
      <div className="relative w-full mx-auto rounded-[2rem] sm:rounded-[2.75rem] overflow-hidden border border-white/15 bg-neutral-950 shadow-2xl min-h-[88vh] sm:min-h-[94vh] flex flex-col justify-between">
        
        {/* LAYER 1 (z-0 — Background Sky & Distant Landscape): Full-bleed scenic mountain photo */}
        <motion.div 
          style={{ scale: backgroundScale, y: backgroundY }}
          className="absolute inset-0 z-0 origin-center pointer-events-none"
        >
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"
            alt="Majestic Mountain Range"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.08]"
          />
          {/* Subtle sky gradient tint for typography contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/20 to-neutral-950/90" />
        </motion.div>

        {/* LAYER 2 (z-10 — Giant Editorial Title): Centered in upper-middle sky, lower third dips behind mountain ridge line */}
        <motion.div 
          style={{ y: titleY, opacity: titleOpacity }}
          className="absolute inset-x-0 top-[15%] sm:top-[17%] lg:top-[19%] z-10 text-center select-none pointer-events-none px-4 flex flex-col items-center justify-center"
        >
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] sm:text-xs font-bold tracking-widest text-[#F2DACE] uppercase mb-2 sm:mb-3 shadow-md">
            <Sparkles className="w-3 h-3 text-[#AA5E7A]" />
            <span>Curated Expeditions & High-Touch Itineraries</span>
          </div>

          <h1 className="font-cinzel text-[16vw] sm:text-[15vw] lg:text-[13.5vw] font-black tracking-[-0.03em] text-[#F2DACE] leading-[0.80] uppercase drop-shadow-[0_20px_45px_rgba(0,0,0,0.7)]">
            TRIPNEST
          </h1>
        </motion.div>

        {/* LAYER 3 (z-20 — Foreground Mountain Cutout): Jagged peaks cleanly overlapping the bottom third of the TripNest letters */}
        <motion.div 
          style={{ y: foregroundY }}
          className="absolute inset-x-0 bottom-0 z-20 pointer-events-none h-[52%] sm:h-[58%] lg:h-[62%] overflow-hidden"
        >
          {/* Multi-layered Alpine Mountain Ridge Peaks Silhouette with realistic crags and couloirs */}
          <svg
            viewBox="0 0 1440 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full preserve-3d"
            preserveAspectRatio="none"
          >
            {/* Back Distant Spire Ridge Layer (Deep Plum Burgundy) */}
            <path
              d="M0 500L0 280L90 220L180 140L270 210L370 260L460 170L540 100L630 180L720 45L810 160L900 230L1000 130L1090 70L1190 170L1290 110L1370 190L1440 160L1440 500Z"
              fill="url(#mountainBackGrad)"
              opacity="0.88"
            />

            {/* Back Ridge Snowy Crags & Couloirs Highlight */}
            <path
              d="M180 140L210 190L180 230L155 180Z M540 100L575 160L540 210L515 150Z M720 45L760 130L720 190L690 120Z M1090 70L1125 140L1090 195L1065 130Z M1290 110L1320 165L1290 210L1265 150Z"
              fill="url(#ridgeSnowHighlight)"
              opacity="0.25"
            />

            {/* Middle Sharp Alpine Crag Ridge (Dark Charcoal Burgundy) */}
            <path
              d="M0 500L0 320L110 240L220 165L320 230L420 185L530 130L630 200L720 85L820 180L920 245L1020 160L1120 105L1220 190L1330 140L1440 220L1440 500Z"
              fill="url(#mountainMidGrad)"
            />

            {/* Front Rocky Foothill Silhouette merging into #12040b / bottom overlay */}
            <path
              d="M0 500L0 380L140 310L280 340L410 270L560 320L690 250L830 310L970 260L1110 320L1260 275L1380 330L1440 300L1440 500Z"
              fill="url(#mountainFrontGrad)"
            />

            <defs>
              {/* Back Ridge Gradient */}
              <linearGradient id="mountainBackGrad" x1="720" y1="40" x2="720" y2="500" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2c0c1e" stopOpacity="0.95" />
                <stop offset="0.4" stopColor="#1e0714" stopOpacity="0.98" />
                <stop offset="1" stopColor="#12040b" />
              </linearGradient>

              {/* Ridge Highlights */}
              <linearGradient id="ridgeSnowHighlight" x1="720" y1="40" x2="720" y2="300" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F2DACE" stopOpacity="0.6" />
                <stop offset="0.6" stopColor="#AA5E7A" stopOpacity="0.3" />
                <stop offset="1" stopColor="#1e0714" stopOpacity="0" />
              </linearGradient>

              {/* Middle Ridge Gradient */}
              <linearGradient id="mountainMidGrad" x1="720" y1="80" x2="720" y2="500" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1f0715" />
                <stop offset="0.5" stopColor="#16050e" />
                <stop offset="1" stopColor="#12040b" />
              </linearGradient>

              {/* Front Silhouette Gradient */}
              <linearGradient id="mountainFrontGrad" x1="720" y1="240" x2="720" y2="500" gradientUnits="userSpaceOnUse">
                <stop stopColor="#14040d" stopOpacity="0.95" />
                <stop offset="0.6" stopColor="#12040b" stopOpacity="0.99" />
                <stop offset="1" stopColor="#12040b" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* LAYER 4 (z-30 — Foreground UI): 100% sharp and interactive UI above all image & mountain layers */}
        <motion.div 
          style={{ y: overlayY }}
          className="relative z-30 px-5 sm:px-8 lg:px-12 pb-8 sm:pb-12 pt-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8 mt-auto"
        >
          {/* Bottom Left: Headline & Editorial Tagline */}
          <div className="max-w-xl space-y-3">
            <div className="flex items-center space-x-2 text-[#F2DACE] text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#AA5E7A] animate-ping" />
              <span>World Heritage & Alpine Sanctuary</span>
            </div>
            
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] drop-shadow-md">
              Uncover the World's Natural Wonders.
            </h2>
            
            <p className="text-xs sm:text-sm text-[#F2DACE]/90 font-light leading-relaxed max-w-lg">
              Curated luxury expeditions through jagged alpine spires, sacred Zen bamboo sanctuaries, and cliffside Mediterranean coastal havens.
            </p>
          </div>

          {/* Bottom Right: Sleek Glassmorphic Trip Search & Quick-Plan Bar */}
          <div className="w-full lg:w-auto">
            <form 
              onSubmit={handleBookSchedule}
              className="bg-[#7C0E44]/90 backdrop-blur-2xl border border-[#D49A9A]/40 p-2.5 sm:p-3.5 rounded-3xl sm:rounded-full shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 max-w-2xl"
            >
              {/* WHERE Field */}
              <div className="flex-1 px-3 py-1.5 rounded-2xl hover:bg-white/5 transition-colors">
                <label className="block text-[10px] font-extrabold text-[#F2DACE] uppercase tracking-wider mb-0.5 flex items-center">
                  <MapPin className="w-3 h-3 mr-1 text-[#AA5E7A]" />
                  Where
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer appearance-none pr-4"
                >
                  {popularDestinations.map((dest) => (
                    <option key={dest} value={dest} className="bg-[#7C0E44] text-[#F2DACE]">
                      {dest}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vertical divider */}
              <div className="hidden sm:block w-px h-8 bg-[#D49A9A]/30" />

              {/* WHEN Field */}
              <div className="flex-1 px-3 py-1.5 rounded-2xl hover:bg-white/5 transition-colors">
                <label className="block text-[10px] font-extrabold text-[#F2DACE] uppercase tracking-wider mb-0.5 flex items-center">
                  <Calendar className="w-3 h-3 mr-1 text-[#AA5E7A]" />
                  When
                </label>
                <input
                  type="text"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none"
                  placeholder="Select dates"
                />
              </div>

              {/* Vertical divider */}
              <div className="hidden sm:block w-px h-8 bg-[#D49A9A]/30" />

              {/* GUESTS Field */}
              <div className="w-full sm:w-28 px-3 py-1.5 rounded-2xl hover:bg-white/5 transition-colors">
                <label className="block text-[10px] font-extrabold text-[#F2DACE] uppercase tracking-wider mb-0.5 flex items-center">
                  <Users className="w-3 h-3 mr-1 text-[#AA5E7A]" />
                  Guests
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer appearance-none"
                >
                  <option value="1 Guest" className="bg-[#7C0E44] text-[#F2DACE]">1 Guest</option>
                  <option value="2 Guests" className="bg-[#7C0E44] text-[#F2DACE]">2 Guests</option>
                  <option value="3 Guests" className="bg-[#7C0E44] text-[#F2DACE]">3 Guests</option>
                  <option value="4+ Guests" className="bg-[#7C0E44] text-[#F2DACE]">4+ Guests</option>
                </select>
              </div>

              {/* Primary CTA Button (Warm Champagne Cream #F2DACE on #7C0E44) */}
              <button
                type="submit"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl sm:rounded-full font-bold text-xs uppercase tracking-wider text-[#7C0E44] bg-[#F2DACE] hover:bg-white active:scale-95 transition-all shadow-xl cursor-pointer whitespace-nowrap mt-1 sm:mt-0"
              >
                <span>Book schedule</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
