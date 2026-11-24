import React from 'react';
import { Sparkles, Compass, MapPin, Receipt, Luggage, Printer, ShieldCheck } from 'lucide-react';

export default function EditorialStory() {
  const pillars = [
    {
      icon: Sparkles,
      title: 'AI Travel Curator',
      desc: 'Harnessing generative intelligence to assemble day-by-day itineraries mapped to your exact travel vibe, pacing, and budget tier.',
      badge: 'Gemini 2.5 Intelligence',
    },
    {
      icon: MapPin,
      title: 'GPS Route Mapping',
      desc: 'Interactive Leaflet split-screen route visualization with auto-geocoded coordinates and numbered chronological pins for every day.',
      badge: 'OpenStreetMap Powered',
    },
    {
      icon: Receipt,
      title: 'Live Budget Oversight',
      desc: 'Dynamic expense tracking across Food, Lodging, Transit, and Sightseeing with live utilization progress forecasting.',
      badge: 'Financial Precision',
    },
    {
      icon: Printer,
      title: 'Printable Travel Dossier',
      desc: 'Transform your complete itinerary into an elegant, distraction-free PDF dossier ready for offline airport & cabin travel.',
      badge: 'One-Click Export',
    },
  ];

  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Editorial Manifesto */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center space-x-2 text-[#d8c3a5] text-xs font-bold uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5" />
            <span>The TripNest Philosophy</span>
          </div>

          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
            Where High-Touch Luxury Meets Effortless Precision.
          </h2>

          <p className="text-sm text-neutral-300 font-light leading-relaxed">
            True luxury is not merely five-star lodging; it is the freedom of effortless discovery. We founded TripNest to dissolve the friction between spontaneous wanderlust and meticulous scheduling.
          </p>

          <p className="text-sm text-neutral-400 font-light leading-relaxed">
            Whether charting sunrise climbs in the Dolomites, booking private tea ceremonies in Kyoto, or sailing the cliffside grottos of Amalfi, TripNest orchestrates every minute with surgical accuracy and aesthetic grace.
          </p>

          <div className="pt-2 flex items-center space-x-6 border-t border-white/10">
            <div>
              <span className="text-2xl font-black text-white font-cinzel">100%</span>
              <p className="text-[11px] text-neutral-400 uppercase tracking-wider">Offline PDF Ready</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <span className="text-2xl font-black text-white font-cinzel">0ms</span>
              <p className="text-[11px] text-neutral-400 uppercase tracking-wider">Local Persistence</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <span className="text-2xl font-black text-[#d8c3a5] font-cinzel">24/7</span>
              <p className="text-[11px] text-neutral-400 uppercase tracking-wider">AI Itinerary Access</p>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Feature Pillars Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-neutral-900/60 border border-white/10 rounded-3xl p-6 space-y-3.5 hover:border-white/20 transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-[#d8c3a5] mb-4 shadow-sm">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-[#d8c3a5] border border-white/10 mb-2">
                    {pillar.badge}
                  </span>
                  <h3 className="font-playfair text-lg font-bold text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed font-light mt-1.5">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
