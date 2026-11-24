import React, { useState } from 'react';
import { Compass, ArrowRight, Check, Heart, Mail } from 'lucide-react';

export default function TriplioFooter({ onOpenPlanner }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const navLinks = {
    EXPLORE: [
      { name: 'Dolomites Alpine Traverse', href: '#destinations' },
      { name: 'Kyoto Sacred Sanctuaries', href: '#destinations' },
      { name: 'Swiss Glacier High Pass', href: '#destinations' },
      { name: 'Amalfi Cliffside Coastline', href: '#destinations' },
      { name: 'Bali Cloud Forests', href: '#destinations' },
      { name: 'Interactive Route Planner', href: '#planner' },
    ],
    COMPANY: [
      { name: 'Our Story & Philosophy', href: '#about' },
      { name: 'Field Directors & Guides', href: '#about' },
      { name: 'Conscious Travel Charter', href: '#about' },
      { name: 'Stories from the Trail', href: '#testimonials' },
      { name: 'Press & Media Kit', href: '#' },
      { name: 'Careers & Field Scouts', href: '#' },
    ],
    SUPPORT: [
      { name: 'Concierge Desk & Contact', href: 'mailto:concierge@tripnest.com' },
      { name: 'Questions Before You Pack', href: '#faq' },
      { name: 'Flexible Booking Guarantee', href: '#faq' },
      { name: 'Luggage & Packing Guides', href: '#planner' },
      { name: 'Privacy & Cookie Policy', href: '#' },
      { name: 'Terms of Exploration', href: '#' },
    ],
  };

  return (
    <footer className="relative bg-[#7C0E44] border-t border-[#D49A9A]/30 pt-24 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 text-[#F2DACE]/90 overflow-hidden">
      
      {/* Top Container: Newsletter & 3 Columns */}
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Newsletter Section with Sleek Email Pill Input */}
        <div className="bg-[#AA5E7A]/25 border border-[#D49A9A]/30 rounded-3xl p-8 sm:p-12 mb-16 shadow-2xl backdrop-blur-md flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left space-y-2">
            <span className="text-[#F2DACE] text-xs font-bold uppercase tracking-widest block">
              The Field Notes Journal
            </span>
            <h3 className="font-playfair text-2xl sm:text-3xl font-black text-white tracking-tight">
              Stories, secret trail permits, and seasonal dispatches.
            </h3>
            <p className="text-xs sm:text-sm text-[#F2DACE]/80 font-light leading-relaxed">
              Join over 12,000 discerning globetrotters receiving our monthly private itineraries and lodge releases.
            </p>
          </div>

          {/* Email Pill Input */}
          <div className="w-full lg:w-auto">
            <form onSubmit={handleSubscribe} className="relative flex items-center w-full max-w-md mx-auto lg:mx-0">
              <div className="relative w-full flex items-center bg-[#7C0E44]/90 border border-[#D49A9A]/40 rounded-full p-1.5 shadow-inner focus-within:border-[#F2DACE] transition-colors">
                <Mail className="w-4 h-4 text-[#F2DACE]/60 ml-4 shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-[#D49A9A]/60 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#F2DACE] hover:bg-white text-[#7C0E44] font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
                >
                  {subscribed ? (
                    <span className="flex items-center text-[#7C0E44]">
                      <Check className="w-3.5 h-3.5 mr-1 stroke-[3]" />
                      Subscribed
                    </span>
                  ) : (
                    'Join Journal'
                  )}
                </button>
              </div>
            </form>
            {subscribed && (
              <p className="text-[11px] text-[#F2DACE] mt-2 text-center lg:text-left font-medium">
                ✓ Thank you. You've been welcomed to the TripNest Private Dispatch.
              </p>
            )}
          </div>
        </div>

        {/* 4-Column Layout: Brand Summary + 3 Navigation Columns (EXPLORE, COMPANY, SUPPORT) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-14 pb-16 border-b border-[#D49A9A]/30">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#AA5E7A] to-[#F2DACE] flex items-center justify-center text-[#7C0E44] shadow-md">
                <Compass className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-cinzel text-xl sm:text-2xl font-black tracking-widest text-white uppercase">
                TripNest
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#F2DACE]/80 font-light leading-relaxed max-w-sm">
              Conscious luxury journeys to the planet's most awe-inspiring landscapes. Designed with bespoke care, precision GPS mapping, and private local field directors.
            </p>

            <div>
              <button
                onClick={onOpenPlanner}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#7C0E44] bg-[#F2DACE] hover:bg-white active:scale-95 transition-all shadow-md cursor-pointer"
              >
                <span>Open Trip Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Column 1: EXPLORE */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-cinzel text-xs font-black tracking-widest text-[#F2DACE] uppercase">
              EXPLORE
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {navLinks.EXPLORE.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    className="hover:text-[#F2DACE] transition-colors duration-200 block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: COMPANY */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-cinzel text-xs font-black tracking-widest text-[#F2DACE] uppercase">
              COMPANY
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {navLinks.COMPANY.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    className="hover:text-[#F2DACE] transition-colors duration-200 block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: SUPPORT */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-cinzel text-xs font-black tracking-widest text-[#F2DACE] uppercase">
              SUPPORT
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {navLinks.SUPPORT.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    className="hover:text-[#F2DACE] transition-colors duration-200 block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Legal / Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F2DACE]/60 gap-4">
          <p>© {new Date().getFullYear()} TripNest Inc. All rights reserved. Handcrafted for the conscious explorer.</p>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-[#F2DACE] transition-colors">Privacy Notice</a>
            <a href="#" className="hover:text-[#F2DACE] transition-colors">Terms & Permits</a>
            <a href="#" className="hover:text-[#F2DACE] transition-colors">Security Standards</a>
          </div>
        </div>

      </div>

      {/* Massive Edge-to-Edge White TripNest Brand Watermark Spanning the Bottom */}
      <div className="w-full flex justify-center pointer-events-none select-none overflow-hidden pt-8 sm:pt-12">
        <span className="font-cinzel text-[16vw] sm:text-[17vw] lg:text-[18vw] font-black text-[#F2DACE]/[0.08] leading-none tracking-tight whitespace-nowrap block uppercase text-center transform translate-y-3">
          TRIPNEST
        </span>
      </div>

    </footer>
  );
}
