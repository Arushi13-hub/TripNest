import React from 'react';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

export default function AtmosphericBanner({ onOpenPlanner }) {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Framed, Rounded-3xl Full-Width Banner */}
      <div className="relative rounded-3xl sm:rounded-[2.5rem] overflow-hidden min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] flex items-center justify-center text-center p-8 sm:p-14 lg:p-20 border border-white/15 shadow-2xl bg-neutral-950 group">
        
        {/* Twilight Mountain Ridge Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1400&q=80"
            alt="Twilight mountain ridge beneath star-filled twilight sky"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out brightness-[0.82] contrast-[1.1]"
          />
          {/* Subtle multi-layer cinematic vignette & twilight blue gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-neutral-950/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-neutral-950/30 to-neutral-950/80 pointer-events-none" />
        </div>

        {/* Centered White Display Content */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-[#d8c3a5] text-xs font-bold uppercase tracking-widest shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#d8c3a5]" />
            <span>The High Country Anthology</span>
          </div>

          {/* Centered White Display Text: "Every summit tells a story." */}
          <h2 className="font-playfair text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)]">
            Every summit tells a story.
          </h2>

          {/* Subtle Subtitle Underneath */}
          <p className="font-playfair italic text-base sm:text-xl lg:text-2xl text-neutral-200/90 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            "From morning mist lifting over alpine pinnacles to quiet starlit passes, the memories you gather become part of who you are."
          </p>

          {/* Action Button */}
          <div className="pt-4 flex items-center justify-center">
            <button
              onClick={onOpenPlanner}
              className="inline-flex items-center space-x-2.5 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-wider text-neutral-950 bg-[#f5efe6] hover:bg-white active:scale-95 transition-all shadow-2xl cursor-pointer hover:shadow-white/20"
            >
              <span>Begin Your Journey</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
