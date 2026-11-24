import React, { useState } from 'react';
import { ChevronDown, MessageSquare, Mail, Compass, ArrowRight, ShieldCheck } from 'lucide-react';

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: "What's included in a TripNest trip?",
      a: "Every TripNest expedition includes hand-selected boutique eco-luxury lodges, private field guides, all private in-country transit, national park permits, curated dining experiences, and our full digital dossier—complete with GPS route synchronization, interactive Leaflet maps, and an offline print/PDF dossier. International airfare and personal alpine gear are arranged separately.",
    },
    {
      q: "How large are the groups?",
      a: "Our private bespoke expeditions are reserved exclusively for you and your chosen party (from solo globetrotters to intimate groups of 2–8 guests). For scheduled group traverses, party sizes are strictly capped at 10 travelers to maintain trail serenity, ensure seamless pace flexibility, and minimize ecological footprint.",
    },
    {
      q: "Can I change or cancel my booking?",
      a: "Yes. We offer fully flexible changes and cancellations up to 30 days prior to your journey date, returning 100% credit or a full cash refund minus nominal non-refundable park permit costs. You can also edit activities, reorder day tabs, or modify packing lists in your planner workspace at any time.",
    },
    {
      q: "Do I need to be very fit?",
      a: "Our routes cater to varying endurance profiles. Each itinerary clearly flags its activity level—from serene heritage walks (1–3 miles daily on stone paths) to rugged alpine traverses (6–10 miles daily with mountain ascents). Our AI planner and field directors can easily adapt any day schedule to your preferred tempo.",
    },
  ];

  return (
    <section id="faq" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* LEFT COLUMN: Sticky Heading & "Still have questions? Contact us" Card */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28 space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 text-[#d8c3a5] text-xs font-bold uppercase tracking-widest">
                <Compass className="w-3.5 h-3.5" />
                <span>Field Guide & FAQs</span>
              </div>
              <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Questions before you pack?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                Everything you need to know about our trail permits, group pacing, cancellation guarantees, and bespoke private itineraries.
              </p>
            </div>

            {/* "Still have questions? Contact us" Card */}
            <div className="bg-[#7C0E44] border border-[#D49A9A]/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2DACE]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#AA5E7A]/30 border border-[#AA5E7A]/50 flex items-center justify-center text-[#F2DACE] shadow-sm">
                  <MessageSquare className="w-5 h-5" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-lg font-bold text-white">
                    Still have questions?
                  </h4>
                  <p className="text-xs text-[#F2DACE]/80 font-light leading-relaxed">
                    Can't find the answer you need? Our dedicated field directors are available around the clock to tailor your journey.
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href="#contact"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#7C0E44] bg-[#F2DACE] hover:bg-white active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact Us</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Smooth Interactive Accordion */}
        <div className="lg:col-span-7 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-neutral-900/90 border-white/25 shadow-2xl ring-1 ring-white/10'
                    : 'bg-neutral-900/40 border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-6 sm:p-7 text-left flex items-center justify-between cursor-pointer space-x-4 transition-colors"
                >
                  <span className="font-playfair text-base sm:text-lg lg:text-xl font-bold text-white leading-snug">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                    isOpen 
                      ? 'bg-[#f5efe6] text-neutral-950 border-transparent rotate-180 shadow' 
                      : 'bg-white/5 text-neutral-400 border-white/10'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-7 pb-6 sm:pb-7 text-xs sm:text-sm text-neutral-300 font-light leading-relaxed border-t border-white/10 pt-4 animate-in fade-in duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
