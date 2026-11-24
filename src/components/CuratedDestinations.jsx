import React from 'react';
import { Star, Clock, MapPin, ArrowRight, Sparkles, Compass } from 'lucide-react';

export const CURATED_DESTINATIONS = [
  {
    id: 'dest-dolomites',
    title: 'Dolomites Alpine Spires',
    country: 'Italy',
    duration: '6 Days',
    season: 'June – October',
    rating: '4.98',
    reviews: 142,
    startingPrice: '$3,800',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    tag: 'Alpine Luxury',
    highlights: ['Tre Cime di Lavaredo', 'Seceda Ridgeline', 'Rifugio Haute Cuisine'],
  },
  {
    id: 'dest-kyoto',
    title: 'Kyoto Sacred Sanctuaries',
    country: 'Japan',
    duration: '4 Days',
    season: 'Year-round',
    rating: '4.99',
    reviews: 320,
    startingPrice: '$1,850',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    tag: 'Cultural Heritage',
    highlights: ['Arashiyama Bamboo Grove', 'Fushimi Inari Torii', 'Private Tea Masters'],
  },
  {
    id: 'dest-swiss',
    title: 'Swiss Alpine Glacier Crossing',
    country: 'Switzerland',
    duration: '5 Days',
    season: 'December – April',
    rating: '4.97',
    reviews: 189,
    startingPrice: '$4,200',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
    tag: 'Winter Sanctuary',
    highlights: ['Matterhorn Vistas', 'Glacier Express', 'Zermatt Chalets'],
  },
  {
    id: 'dest-amalfi',
    title: 'Amalfi Cliffside Coastline',
    country: 'Italy',
    duration: '7 Days',
    season: 'May – September',
    rating: '4.96',
    reviews: 215,
    startingPrice: '$3,400',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    tag: 'Mediterranean Coast',
    highlights: ['Positano Spiaggia Grande', 'Path of the Gods Hike', 'Capri Private Speedboat'],
  },
  {
    id: 'dest-banff',
    title: 'Banff & Lake Louise Wilderness',
    country: 'Canada',
    duration: '5 Days',
    season: 'July – September',
    rating: '4.95',
    reviews: 168,
    startingPrice: '$2,750',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80',
    tag: 'Glacial Wilderness',
    highlights: ['Moraine Lake Sunrise', 'Icefields Parkway', 'Canoeing Glacier Waters'],
  },
  {
    id: 'dest-bali',
    title: 'Bali Sacred Terraces & Ocean Villas',
    country: 'Indonesia',
    duration: '6 Days',
    season: 'April – October',
    rating: '4.94',
    reviews: 240,
    startingPrice: '$2,200',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    tag: 'Tropical Retreat',
    highlights: ['Ubud Rice Terraces', 'Cliffside Uluwatu Sunsets', 'Private Waterfall Hikes'],
  },
];

export default function CuratedDestinations({ onSelectDestination }) {
  return (
    <section id="destinations" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
        <div>
          <div className="flex items-center space-x-2 text-[#d8c3a5] text-xs font-bold uppercase tracking-widest mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Sanctuaries</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Handcrafted Escapes for the Connoisseur
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-md font-light leading-relaxed">
          Every destination is personally scouted, mapped with precision GPS coordinates, and enriched with bespoke dining and cultural experiences.
        </p>
      </div>

      {/* Grid of Destination Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {CURATED_DESTINATIONS.map((dest) => (
          <div
            key={dest.id}
            onClick={() => onSelectDestination(dest.title)}
            className="group relative bg-neutral-900/70 border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:border-white/25 transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between cursor-pointer"
          >
            {/* Card Image Area */}
            <div className="relative h-64 w-full overflow-hidden">
              <img
                src={dest.image}
                alt={dest.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

              {/* Top Badges */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-neutral-950/70 backdrop-blur-md text-[#f5efe6] border border-white/15 shadow">
                  {dest.tag}
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-[#f5efe6] text-neutral-950 shadow">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-1" />
                  {dest.rating}
                </span>
              </div>

              {/* Bottom Destination Title on Image */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-bold text-[#d8c3a5] uppercase tracking-wider mb-0.5">
                  {dest.country}
                </p>
                <h3 className="font-playfair text-xl font-bold tracking-tight text-white drop-shadow">
                  {dest.title}
                </h3>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400 pb-2 border-b border-white/10">
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-[#d8c3a5]" />
                    {dest.duration}
                  </span>
                  <span>Ideal: <strong className="text-neutral-200">{dest.season}</strong></span>
                </div>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-1.5">
                  {dest.highlights.map((h, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-white/5 text-neutral-300 border border-white/10">
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Est. Budget</span>
                  <span className="text-base font-extrabold text-white">{dest.startingPrice}</span>
                </div>

                <button
                  onClick={() => onSelectDestination(dest.title)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold text-neutral-950 bg-[#f5efe6] hover:bg-white active:scale-95 transition-all shadow-md cursor-pointer"
                >
                  <span>Plan Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
