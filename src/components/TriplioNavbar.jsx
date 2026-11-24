import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Menu, X, ArrowUpRight, Calendar, MapPin } from 'lucide-react';

export default function TriplioNavbar({ onOpenPlanner, onOpenBookingModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Destinations', href: '#destinations' },
    { label: 'Trip Planner', href: '#planner' },
    { label: 'About', href: '#about' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Floating Pill Navbar */}
      <header className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className={`pointer-events-auto transition-all duration-300 w-full max-w-5xl rounded-full px-5 sm:px-6 py-2.5 flex items-center justify-between shadow-2xl ${
          isScrolled 
            ? 'bg-[#7C0E44]/95 backdrop-blur-xl border border-[#D49A9A]/40 shadow-black/60' 
            : 'bg-[rgba(124,14,68,0.85)] backdrop-blur-md border border-[#D49A9A]/30 shadow-black/40'
        }`}>
          {/* Brand Logo */}
          <a 
            href="#home"
            className="flex items-center space-x-2.5 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#AA5E7A] to-[#F2DACE] flex items-center justify-center text-[#7C0E44] shadow-md group-hover:rotate-45 transition-transform duration-500">
              <Compass className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-lg font-black tracking-widest text-[#F2DACE] uppercase">
                TripNest
              </span>
            </div>
          </a>

          {/* Centered Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-[#F2DACE]/90 hover:text-white hover:bg-white/10 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Action: Warm Champagne Cream Pill CTA (#F2DACE) */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenBookingModal || onOpenPlanner}
              className="inline-flex items-center space-x-1.5 px-4 sm:px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider text-[#7C0E44] bg-[#F2DACE] hover:bg-white active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <span>Book a schedule</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-[#F2DACE] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#7C0E44]/95 backdrop-blur-2xl p-6 pt-24 flex flex-col justify-between animate-in fade-in duration-200 md:hidden">
          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#D49A9A]">
              Navigation
            </span>
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-2xl font-bold text-[#F2DACE] hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-[#D49A9A]/30 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenBookingModal) onOpenBookingModal();
                else onOpenPlanner();
              }}
              className="w-full py-3.5 rounded-2xl font-bold text-sm uppercase tracking-wider text-[#7C0E44] bg-[#F2DACE] hover:bg-white text-center shadow-lg transition-colors cursor-pointer"
            >
              Book a schedule
            </button>
            <p className="text-center text-xs text-neutral-500">
              TripNest · Luxury Curated Journeys
            </p>
          </div>
        </div>
      )}
    </>
  );
}
