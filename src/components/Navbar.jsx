import React from 'react';
import { Compass, Plus, Plane, MapPin } from 'lucide-react';

export default function Navbar({ onOpenNewTrip, tripCount }) {
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3.5 group cursor-pointer">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform duration-300">
              <Compass className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
                  Trip<span className="text-rose-600">Nest</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Curate, budget & live your unforgettable journeys
              </p>
            </div>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center space-x-3">
            {tripCount !== undefined && (
              <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-medium">
                <Plane className="w-3.5 h-3.5 text-slate-500" />
                <span>{tripCount} {tripCount === 1 ? 'Trip' : 'Trips'} Saved</span>
              </div>
            )}
            
            <button
              onClick={onOpenNewTrip}
              className="inline-flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 active:scale-98 shadow-md shadow-rose-500/25 hover:shadow-lg hover:shadow-rose-500/35 transition-all duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ New Trip</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
