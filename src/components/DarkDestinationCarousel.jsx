import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight, Clock, Star, Compass } from 'lucide-react';
import TiltCard from './TiltCard';

export const CAROUSEL_DESTINATIONS = [
  {
    id: 'dest-bali',
    name: 'Bali',
    fullDestination: 'Bali, Indonesia',
    subtitle: 'Sacred Terraces & Cliffside Waterfalls',
    duration: '7 days',
    price: 'From $1,450',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    rating: '4.96',
    highlights: 'Ubud Rice Terraces · Tirta Empul Blessings · Uluwatu Sunsets',
  },
  {
    id: 'dest-cappadocia',
    name: 'Cappadocia',
    fullDestination: 'Cappadocia, Turkey',
    subtitle: 'Hot Air Flight & Fairy Chimneys',
    duration: '5 days',
    price: 'From $1,680',
    image: 'https://images.unsplash.com/photo-1570654639102-bdd95efeca7a?auto=format&fit=crop&w=1200&q=80',
    rating: '4.98',
    highlights: 'Sunrise Balloon Flight · Derinkuyu Caves · Rose Valley',
  },
  {
    id: 'dest-halong',
    name: 'Ha Long Bay',
    fullDestination: 'Ha Long Bay, Vietnam',
    subtitle: 'Emerald Karst Waters & Grottos',
    duration: '6 days',
    price: 'From $1,350',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    rating: '4.94',
    highlights: 'Private Junk Boat Sailing · Sung Sot Cave · Kayak Lagoons',
  },
  {
    id: 'dest-zermatt',
    name: 'Zermatt',
    fullDestination: 'Zermatt, Switzerland',
    subtitle: 'Matterhorn Glacier & Alpine Passes',
    duration: '7 days',
    price: 'From $2,400',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    rating: '4.99',
    highlights: 'Gornergrat Railway · Riffelsee Reflections · Glacier Hikes',
  },
  {
    id: 'dest-cinqueterre',
    name: 'Cinque Terre',
    fullDestination: 'Cinque Terre, Italy',
    subtitle: 'Pastel Cliffside Riviera & Vineyards',
    duration: '6 days',
    price: 'From $1,850',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    rating: '4.97',
    highlights: 'Sentiero Azzurro Trail · Manarola Pesto · Sunset Sailing',
  },
  {
    id: 'dest-utah',
    name: 'Utah',
    fullDestination: 'Utah Canyonlands, USA',
    subtitle: 'Red Rock Arches & Dark Sky Basins',
    duration: '7 days',
    price: 'From $1,920',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80',
    rating: '4.95',
    highlights: 'Zion The Narrows Trek · Bryce Canyon Hoodoos · Dark Sky Reserves',
  },
];

export default function DarkDestinationCarousel({ onLaunchItinerary, onSelectDestination }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const total = CAROUSEL_DESTINATIONS.length;

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % total;
    scrollToIndex(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + total) % total;
    scrollToIndex(prevIdx);
  };

  const scrollToIndex = (index) => {
    setCurrentIndex(index);
    if (scrollContainerRef.current) {
      const cardWidth = 340; // approx card width + gap
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = 340;
      const calculatedIndex = Math.min(
        total - 1,
        Math.max(0, Math.round(scrollLeft / cardWidth))
      );
      setCurrentIndex(calculatedIndex);
    }
  };

  return (
    <section 
      id="destinations-carousel" 
      className="py-12 px-2 sm:px-4 lg:px-6"
    >
      {/* Full-width Deep Burgundy Wine (#7C0E44) rounded container */}
      <div className="bg-[#7C0E44] text-white rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-16 border border-[#D49A9A]/30 shadow-2xl relative overflow-hidden">
        {/* Dusty Berry Rose & Champagne ambient glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#AA5E7A]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F2DACE]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar: Title, Dynamic Slide Counter (01 / 06) and Navigation Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#F2DACE] text-xs font-bold uppercase tracking-widest">
              <Compass className="w-3.5 h-3.5 text-[#D49A9A]" />
              <span>World Expedition Showcase</span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Where will the trail take you?
            </h2>
          </div>

          {/* Right Controls: Dynamic Slide Counter & Arrows */}
          <div className="flex items-center space-x-4 self-end sm:self-auto">
            {/* Dynamic Slide Counter */}
            <div className="px-4 py-2 rounded-full bg-[#AA5E7A]/30 backdrop-blur-md border border-[#D49A9A]/30 text-xs font-cinzel font-extrabold text-[#F2DACE] tracking-widest">
              <span>{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="text-white/40 mx-1.5">/</span>
              <span className="text-white/60">{String(total).padStart(2, '0')}</span>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                className="w-11 h-11 rounded-full bg-[#AA5E7A]/40 hover:bg-[#AA5E7A] active:scale-95 border border-[#D49A9A]/30 text-[#F2DACE] flex items-center justify-center transition-all cursor-pointer shadow-md"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button
                onClick={handleNext}
                className="w-11 h-11 rounded-full bg-[#AA5E7A]/40 hover:bg-[#AA5E7A] active:scale-95 border border-[#D49A9A]/30 text-[#F2DACE] flex items-center justify-center transition-all cursor-pointer shadow-md"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Carousel Track */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex space-x-5 sm:space-x-6 overflow-x-auto pb-4 pt-2 no-scrollbar snap-x snap-mandatory scroll-smooth relative z-10"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CAROUSEL_DESTINATIONS.map((dest, idx) => {
            const isCurrent = idx === currentIndex;
            const handleClick = () => {
              if (onSelectDestination) {
                onSelectDestination(dest);
              } else if (onLaunchItinerary) {
                onLaunchItinerary(dest);
              }
            };
            return (
              <TiltCard
                key={dest.id}
                onClick={handleClick}
                maxTilt={12}
                scale={1.03}
                glare={true}
                className={`group shrink-0 w-[280px] sm:w-[320px] lg:w-[350px] snap-start rounded-[2rem] overflow-hidden border transition-all duration-500 relative flex flex-col justify-between aspect-[9/14] cursor-pointer ${
                  isCurrent 
                    ? 'border-[#D49A9A]/60 shadow-2xl ring-1 ring-[#F2DACE]/30' 
                    : 'border-[#D49A9A]/20 opacity-90 hover:opacity-100 hover:border-[#D49A9A]/40'
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Background Destination Photo */}
                <img
                  src={dest.image}
                  alt={dest.name}
                  loading="lazy"
                  decoding="async"
                  style={{ transform: 'translateZ(0px)' }}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                
                {/* Deep gradient overlays for text readability */}
                <div 
                  style={{ transform: 'translateZ(5px)' }}
                  className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/25 to-black/35 pointer-events-none" 
                />

                {/* Top Card Badges: Duration & Rating with translateZ(25px) 3D Parallax */}
                <div 
                  className="relative z-10 p-5 flex items-center justify-between" 
                  style={{ transform: 'translateZ(25px)', transformStyle: 'preserve-3d' }}
                >
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md bg-[#7C0E44]/90 text-[#F2DACE] border border-[#D49A9A]/40 shadow-lg">
                    <Clock className="w-3.5 h-3.5 mr-1 text-[#F2DACE]" />
                    {dest.duration}
                  </span>

                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black backdrop-blur-md bg-[#F2DACE] text-[#7C0E44] shadow-lg">
                    <Star className="w-3 h-3 fill-[#7C0E44] text-[#7C0E44] mr-1" />
                    {dest.rating}
                  </span>
                </div>

                {/* Bottom Card Content: Title, Price, Circular Launch Button with translateZ 3D Parallax */}
                <div 
                  className="relative z-10 p-5 sm:p-6 space-y-3" 
                  style={{ transform: 'translateZ(25px)', transformStyle: 'preserve-3d' }}
                >
                  <p 
                    style={{ transform: 'translateZ(22px)', transformStyle: 'preserve-3d' }}
                    className="text-[11px] font-bold text-[#D49A9A] uppercase tracking-wider"
                  >
                    {dest.subtitle}
                  </p>
                  
                  <h3 
                    style={{ transform: 'translateZ(28px)', transformStyle: 'preserve-3d' }}
                    className="font-playfair text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md"
                  >
                    {dest.name}
                  </h3>

                  <p 
                    style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}
                    className="text-xs text-[#F2DACE]/80 line-clamp-1 font-light"
                  >
                    {dest.highlights}
                  </p>

                  <div 
                    style={{ transform: 'translateZ(25px)', transformStyle: 'preserve-3d' }}
                    className="pt-3 border-t border-[#D49A9A]/30 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#D49A9A] block">
                        Estimated Journey
                      </span>
                      <span className="text-sm sm:text-base font-extrabold text-[#F2DACE]">
                        {dest.price}
                      </span>
                    </div>

                    {/* Circular Arrow Button with translateZ(30px) Elevation */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                      }}
                      style={{ transform: 'translateZ(30px)', transformStyle: 'preserve-3d' }}
                      className="w-11 h-11 rounded-full bg-[#F2DACE] hover:bg-white text-[#7C0E44] flex items-center justify-center transition-all duration-300 group-hover:rotate-45 active:scale-95 shadow-xl cursor-pointer"
                      title={`Explore ${dest.name} Route`}
                    >
                      <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
