import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Clock, 
  DollarSign, 
  Plus, 
  Check, 
  ArrowRight, 
  Compass, 
  Sparkles, 
  SlidersHorizontal,
  ChevronRight,
  Layers,
  ChevronDown
} from 'lucide-react';
import TiltCard from './TiltCard';
import { getExplorerDestination } from '../data/explorerDestinations';

export default function DestinationExplorerModal({ 
  isOpen, 
  onClose, 
  destinationKey = 'kyoto',
  onHandoffToPlanner 
}) {
  if (!isOpen) return null;
  return (
    <DestinationExplorerContent
      onClose={onClose}
      destinationKey={destinationKey}
      onHandoffToPlanner={onHandoffToPlanner}
    />
  );
}

function DestinationExplorerContent({ 
  onClose, 
  destinationKey, 
  onHandoffToPlanner 
}) {
  const destData = useMemo(() => {
    return getExplorerDestination(destinationKey);
  }, [destinationKey]);

  const [activeTab, setActiveTab] = useState('Intro'); // 'Intro' | 'Highlights' | 'Local Spots' | 'Build Itinerary'
  const [activeFilter, setActiveFilter] = useState('All Stops'); // 'All Stops' | 'Iconic Landmarks' | 'Hidden Gems' | '24h Route'
  const [isSliderOpen, setIsSliderOpen] = useState(true);
  const [selectedStops, setSelectedStops] = useState([]); // stops queued for handoff

  const tabs = ['Intro', 'Highlights', 'Local Spots', 'Build Itinerary'];
  const filterPills = ['All Stops', 'Iconic Landmarks', 'Hidden Gems', '24h Route'];

  // Filtered stops
  const displayedStops = useMemo(() => {
    if (activeFilter === 'All Stops') return destData.stops || [];
    return (destData.stops || []).filter((s) => s.filterType === activeFilter);
  }, [destData, activeFilter]);

  // Current backdrop image based on tab
  const currentBackdrop = destData.stageImages?.[activeTab] || destData.backdrop;

  // Toggle stop selection
  const handleToggleStop = (stop) => {
    if (selectedStops.some((s) => s.id === stop.id)) {
      setSelectedStops(selectedStops.filter((s) => s.id !== stop.id));
    } else {
      setSelectedStops([...selectedStops, stop]);
    }
  };

  // Seamless Handoff to Trip Planner
  const handleLaunchPlanner = () => {
    const stopsToUse = selectedStops.length > 0 ? selectedStops : destData.stops;
    onHandoffToPlanner({
      destination: `${destData.name}, ${destData.country}`,
      title: `${destData.defaultDurationDays} Days in ${destData.name}`,
      budget: destData.defaultBudget,
      stops: stopsToUse,
      durationDays: destData.defaultDurationDays,
      coverImage: destData.backdrop,
      notes: destData.poeticDesc,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-950 text-white flex flex-col justify-between select-none animate-in fade-in duration-300">
      {/* FULL-SCREEN SCENIC BACKDROP with Smooth Zoom/Pan Transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + destData.id}
          initial={{ scale: 1.08, opacity: 0.6 }}
          animate={{ scale: 1.0, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0.4 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <img
            src={currentBackdrop}
            alt={destData.name}
            className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
          />
          {/* Subtle cinematic vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-black/25 to-black/60" />
        </motion.div>
      </AnimatePresence>

      {/* TOP NAVIGATION BAR: Breadcrumb, Stage Tabs, Close Button */}
      <div className="relative z-20 px-4 sm:px-8 py-5 flex items-center justify-between backdrop-blur-md bg-black/20 border-b border-white/10">
        {/* Top Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold tracking-wide text-neutral-300">
          <span className="text-[#d8c3a5] uppercase font-bold tracking-widest">{destData.country}</span>
          <span className="text-white/40">/</span>
          <span className="text-white font-bold">{destData.name}</span>
        </div>

        {/* Section Tabs: Intro, Highlights, Local Spots, Build Itinerary */}
        <div className="hidden md:flex items-center space-x-1.5 p-1 rounded-full bg-neutral-900/70 backdrop-blur-xl border border-white/15 shadow-xl">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  if (tab === 'Build Itinerary') {
                    handleLaunchPlanner();
                  } else {
                    setActiveTab(tab);
                  }
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#f5efe6] text-neutral-950 shadow-md'
                    : 'text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Top Right Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleLaunchPlanner}
            className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-neutral-950 bg-[#f5efe6] hover:bg-white active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
            <span>Build Itinerary</span>
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/15 shadow-md"
            title="Close Explorer"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* CENTER GLASSMORPHIC INFO OVERLAYS: Editorial Title & Quick Filters */}
      <div className="relative z-10 px-4 sm:px-8 text-center my-auto max-w-4xl mx-auto py-8">
        <motion.div
          key={destData.id + activeTab}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          {/* Poetic Tagline Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-[#d8c3a5] text-xs font-bold uppercase tracking-widest shadow-xl">
            <Compass className="w-3.5 h-3.5" />
            <span>{destData.tagline}</span>
          </div>

          {/* Massive Display Title */}
          <h1 className="font-cinzel text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight uppercase drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
            {destData.name}
          </h1>

          {/* Concise 2-line Poetic Description */}
          <p className="font-playfair text-base sm:text-xl lg:text-2xl text-neutral-200 italic font-normal max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            "{destData.poeticDesc}"
          </p>

          {/* Quick-Filter Pill Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            {filterPills.map((pill) => {
              const isSelected = activeFilter === pill;
              return (
                <button
                  key={pill}
                  onClick={() => {
                    setActiveFilter(pill);
                    setIsSliderOpen(true);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white text-neutral-950 shadow-lg scale-105'
                      : 'bg-black/40 backdrop-blur-md text-neutral-300 hover:text-white hover:bg-black/60 border border-white/15'
                  }`}
                >
                  {pill}
                </button>
              );
            })}
          </div>

          {/* Toggle Button: Open / Hide Route Stops */}
          <div className="pt-3">
            <button
              onClick={() => setIsSliderOpen(!isSliderOpen)}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition-all cursor-pointer border border-white/20"
            >
              <Layers className="w-3.5 h-3.5 text-[#d8c3a5]" />
              <span>{isSliderOpen ? 'Hide route stops' : 'Open route stops'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isSliderOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM SLIDE-IN HORIZONTAL ROUTE STOPS SLIDER */}
      <div className="relative z-20 pb-6 px-4 sm:px-8">
        <AnimatePresence>
          {isSliderOpen && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              {/* Slider Header */}
              <div className="flex items-center justify-between text-xs text-neutral-300 px-1">
                <span className="font-bold uppercase tracking-wider text-[#d8c3a5]">
                  {activeFilter} · {displayedStops.length} Recommended Stops
                </span>

                {selectedStops.length > 0 && (
                  <button
                    onClick={handleLaunchPlanner}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-300 hover:text-emerald-200 cursor-pointer"
                  >
                    <span>{selectedStops.length} stops ready · Launch Planner</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Horizontal Scroll Track of Frosted Glass Cards */}
              <div className="flex space-x-4 overflow-x-auto pb-3 pt-1 no-scrollbar snap-x">
                {displayedStops.map((stop, idx) => {
                  const isAdded = selectedStops.some((s) => s.id === stop.id);

                  return (
                    <TiltCard
                      key={stop.id}
                      maxTilt={10}
                      scale={1.03}
                      className={`shrink-0 w-[270px] sm:w-[310px] snap-start rounded-3xl p-4 sm:p-5 backdrop-blur-xl border transition-all duration-300 shadow-2xl flex flex-col justify-between ${
                        isAdded 
                          ? 'bg-neutral-900/90 border-emerald-400/60 ring-2 ring-emerald-400/30' 
                          : 'bg-neutral-900/75 border-white/20 hover:border-white/40'
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Top Badges */}
                        <div className="flex items-center justify-between" style={{ transform: 'translateZ(10px)' }}>
                          <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/10 text-[#d8c3a5] border border-white/15">
                            {stop.category}
                          </span>
                          <span className="text-[11px] font-semibold text-neutral-300 flex items-center">
                            <Clock className="w-3 h-3 mr-1 text-white/50" />
                            {stop.time}
                          </span>
                        </div>

                        {/* Stop Title */}
                        <h4 className="font-playfair text-base sm:text-lg font-bold text-white line-clamp-1" style={{ transform: 'translateZ(15px)' }}>
                          {stop.title}
                        </h4>

                        {/* Location */}
                        <p className="text-[11px] text-neutral-400 flex items-center line-clamp-1">
                          <MapPin className="w-3 h-3 mr-1 text-rose-400 shrink-0" />
                          <span>{stop.location}</span>
                        </p>

                        {/* Description */}
                        <p className="text-xs text-neutral-300 font-light line-clamp-2 leading-relaxed">
                          {stop.desc}
                        </p>
                      </div>

                      {/* Card Footer: Cost & Add to My Trip Button */}
                      <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between" style={{ transform: 'translateZ(15px)' }}>
                        <span className="text-xs font-bold text-white">
                          {stop.cost > 0 ? `$${stop.cost}` : 'Free Access'}
                        </span>

                        <button
                          onClick={() => handleToggleStop(stop)}
                          className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-500 text-neutral-950 shadow'
                              : 'bg-white/15 hover:bg-white text-white hover:text-neutral-950 border border-white/20'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>+ Add to My Trip</span>
                            </>
                          )}
                        </button>
                      </div>
                    </TiltCard>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
