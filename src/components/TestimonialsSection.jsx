import React from 'react';
import { Star, Quote, Compass } from 'lucide-react';

export default function TestimonialsSection() {
  const reviews = [
    {
      author: 'Lady Genevieve Vance',
      role: 'Alpine Collector',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      text: 'TripNest curated our 7-day Dolomite traverse with sublime grace. The offline dossier saved us when ridge reception vanished, and the private rifugio stays were unforgettable.',
      trip: 'Dolomites Alpine Spires',
      rating: 5,
    },
    {
      author: 'Marcus Lindqvist',
      role: 'Expedition Photographer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      text: 'The GPS route sequencing and numbered Leaflet pins made scouting sunrise shoots effortless. Mapping daily gear against trail coordinates transformed my Kyoto expedition.',
      trip: 'Kyoto Sacred Sanctuaries',
      rating: 5,
    },
    {
      author: 'Elena & Julian Rostova',
      role: 'Architects & Epicures',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      text: 'From coastal Capri speedboats to lantern-lit cliffside dinners, the live budget tracker and day tabs gave us total calm without hindering the romance of discovery.',
      trip: 'Amalfi Cliffside Coastline',
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 text-[#d8c3a5] text-xs font-bold uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5" />
            <span>Endorsements from the Wild</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Stories from the trail.
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-md">
          Reflections from world travelers, photographers, and architects who trust TripNest to design journeys of rare and lasting wonder.
        </p>
      </div>

      {/* Clean Horizontal Row of Traveler Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="group bg-neutral-900/60 border border-white/10 rounded-3xl p-7 sm:p-8 shadow-xl hover:border-white/25 hover:bg-neutral-900/80 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-5">
              {/* Rating & Quote Icon */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-1 text-amber-400">
                  {[...Array(r.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-white/20 group-hover:text-[#d8c3a5]/50 transition-colors" />
              </div>

              {/* Review Text */}
              <p className="font-playfair text-sm sm:text-base text-neutral-200 font-normal leading-relaxed italic">
                "{r.text}"
              </p>
            </div>

            {/* Author Footer */}
            <div className="flex items-center space-x-3.5 pt-6 border-t border-white/10 mt-6">
              <img
                src={r.avatar}
                alt={r.author}
                className="w-11 h-11 rounded-full object-cover border border-white/20 shadow-md shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{r.author}</h4>
                <p className="text-[11px] text-neutral-400 truncate">{r.role} · <span className="text-[#d8c3a5]">{r.trip}</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
