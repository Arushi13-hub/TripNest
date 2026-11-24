import React from 'react';
import { Compass, Calendar, Mountain, ArrowUpRight } from 'lucide-react';

export default function ThreeStepProcessSection({ onOpenPlanner }) {
  const steps = [
    {
      number: '01',
      title: 'Pick your wonder',
      tagline: 'Discovery & Curation',
      desc: 'Browse our hand-scouted sanctuaries across 48 countries. Filter by alpine heights, coastal cliff paths, or ancient forest temples with curated GPS route stops.',
      highlights: ['360+ hand-vetted trails', 'Iconic landmarks & hidden gems', 'Verified seasonal climates'],
      icon: Compass,
    },
    {
      number: '02',
      title: 'Book your dates',
      tagline: 'Intelligent Scheduling',
      desc: 'Lock in your travel window, specify your travel party, and tailor your pace. Our intelligent AI planner sequences activities, budgets, and permits seamlessly.',
      highlights: ['Day-by-day timeline builder', 'Live budget utilization ledger', 'Interactive Leaflet route sync'],
      icon: Calendar,
    },
    {
      number: '03',
      title: 'Go and wander',
      tagline: 'Serenity on the Trail',
      desc: 'Step into the wild with total peace of mind. Access offline travel dossiers, GPS trail coordinates, and packing checklists right in your pocket.',
      highlights: ['One-click print/PDF dossier', 'Smart categorized packing list', 'Zero-cloud offline privacy'],
      icon: Mountain,
    },
  ];

  return (
    <section id="process" className="bg-[#FAF3EF] text-[#3A1224] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-b border-[#D49A9A]/30 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#AA5E7A]/15 text-[#AA5E7A] text-xs font-bold uppercase tracking-widest border border-[#AA5E7A]/30">
            <Compass className="w-3.5 h-3.5 text-[#AA5E7A]" />
            <span>The TripNest Blueprint</span>
          </div>

          <h2 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-black text-[#7C0E44] tracking-tight leading-[1.1]">
            Three steps to the summit.
          </h2>

          <p className="text-base sm:text-lg text-[#3A1224]/90 font-light leading-relaxed max-w-2xl">
            From the initial spark of inspiration to standing upon the ridge, our intentional three-stage framework turns complex logistics into effortless adventure.
          </p>
        </div>

        {/* 3 Minimal Numbered Columns Separated by Subtle Hairlines */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#D49A9A]/40 border-t border-b border-[#D49A9A]/40">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`group py-12 md:py-14 flex flex-col justify-between transition-all duration-300 ${
                  idx === 0 ? 'md:pr-10 lg:pr-12' : idx === 1 ? 'md:px-10 lg:px-12' : 'md:pl-10 lg:pl-12'
                }`}
              >
                <div className="space-y-6">
                  {/* Step Number & Kicker */}
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel text-5xl sm:text-6xl font-black text-[#7C0E44]/25 group-hover:text-[#7C0E44] transition-colors tracking-tight">
                      {step.number}
                    </span>
                    <div className="w-11 h-11 rounded-2xl bg-[#AA5E7A]/15 border border-[#AA5E7A]/30 flex items-center justify-center text-[#7C0E44] group-hover:bg-[#7C0E44] group-hover:text-[#F2DACE] transition-all shadow-sm">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                  </div>

                  {/* Step Title (01 — Pick your wonder format) */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#AA5E7A] block">
                      {step.tagline}
                    </span>
                    <h3 className="font-playfair text-2xl sm:text-3xl font-black text-[#7C0E44] tracking-tight leading-tight">
                      {step.number} — {step.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[#3A1224]/85 font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Highlights List */}
                <div className="pt-8 mt-8 border-t border-[#D49A9A]/30 space-y-2.5">
                  {step.highlights.map((h, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs font-medium text-[#3A1224]/90">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#AA5E7A]" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-[#3A1224]/80 font-light">
            Ready to chart your next traverse? Our travel architects are standing by.
          </p>
          <button
            onClick={onOpenPlanner}
            className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-[#F2DACE] bg-[#7C0E44] hover:bg-[#AA5E7A] active:scale-95 transition-all shadow-xl cursor-pointer"
          >
            <span>Start Planning Now</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </section>
  );
}
