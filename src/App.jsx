import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import TriplioNavbar from './components/TriplioNavbar';
import TriplioHero from './components/TriplioHero';
import EditorialStorySection from './components/EditorialStorySection';
import DarkDestinationCarousel from './components/DarkDestinationCarousel';
import ThreeStepProcessSection from './components/ThreeStepProcessSection';
import AtmosphericBanner from './components/AtmosphericBanner';
import CuratedDestinations from './components/CuratedDestinations';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import ContactSection from './components/ContactSection';
import TriplioFooter from './components/TriplioFooter';
import TripCard from './components/TripCard';
import { INITIAL_TRIPS } from './data/initialTrips';
import { formatCurrency } from './utils/dateUtils';

// Lazy-load off-screen modals and heavy interactive map/explorer views for sub-500ms initial load
const TripModal = lazy(() => import('./components/TripModal'));
const TripDetailModal = lazy(() => import('./components/TripDetailModal'));
const DeleteConfirmModal = lazy(() => import('./components/DeleteConfirmModal'));
const DestinationExplorerModal = lazy(() => import('./components/DestinationExplorerModal'));
import { 
  Search, 
  Plus, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  Compass, 
  PlaneTakeoff,
  Globe,
  SlidersHorizontal,
  RotateCcw,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';

const STORAGE_KEY = 'tripnest_trips';

function resolveExplorerKey(str = '') {
  const s = String(str).toLowerCase();
  if (s.includes('kyoto') || s.includes('japan')) return 'kyoto';
  if (s.includes('dolomite') || s.includes('alps') || s.includes('utah')) return 'dolomites';
  if (s.includes('bali') || s.includes('indonesia') || s.includes('halong') || s.includes('vietnam')) return 'bali';
  if (s.includes('zermatt') || s.includes('swiss') || s.includes('switzerland') || s.includes('matterhorn')) return 'zermatt';
  if (s.includes('amalfi') || s.includes('cinque') || s.includes('italy')) return 'amalfi';
  if (s.includes('cappadocia') || s.includes('turkey')) return 'cappadocia';
  return 'kyoto';
}

export default function App() {
  // Load trips from localStorage or seed with initial trips
  const [trips, setTrips] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('wanderplan_trips');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error reading trips from localStorage', e);
    }
    return INITIAL_TRIPS;
  });

  // Sync trips to localStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } catch (e) {
      console.error('Error saving trips to localStorage', e);
    }
  }, [trips]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tripToEdit, setTripToEdit] = useState(null);

  // Detail Modal state
  const [selectedTripForDetail, setSelectedTripForDetail] = useState(null);

  // Delete Confirm Modal state
  const [tripToDeleteId, setTripToDeleteId] = useState(null);

  // Destination Explorer state
  const [explorerDestinationKey, setExplorerDestinationKey] = useState(null);

  const handleOpenExplorer = (destName = 'dolomites') => {
    setExplorerDestinationKey(resolveExplorerKey(destName));
  };

  const handleCloseExplorer = () => {
    setExplorerDestinationKey(null);
  };

  // Seamless handoff from Destination Explorer to Trip Planner
  const handleExplorerHandoff = (handoffData) => {
    const stops = handoffData.stops || [];
    const numDays = Math.max(1, handoffData.durationDays || Math.ceil(stops.length / 2) || 3);

    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + 14);
    const end = new Date(start);
    end.setDate(start.getDate() + (numDays - 1));

    const startDateStr = start.toISOString().split('T')[0];
    const endDateStr = end.toISOString().split('T')[0];

    const itinerary = [];
    for (let dayNum = 1; dayNum <= numDays; dayNum++) {
      itinerary.push({
        day: dayNum,
        title: `Day ${dayNum}: ${handoffData.destination.split(',')[0]} Discovery`,
        activities: [],
      });
    }

    stops.forEach((stop, idx) => {
      const targetDay = (idx % numDays) + 1;
      const dayObj = itinerary.find((d) => d.day === targetDay) || itinerary[0];
      dayObj.activities.push({
        id: `act-exp-${Date.now()}-${idx}`,
        title: stop.title,
        timeSlot: stop.time ? stop.time.split('·')[0].trim() : '10:00 AM',
        location: stop.location || handoffData.destination,
        category: stop.category || 'Sightseeing',
        cost: Number(stop.cost) || 0,
        notes: stop.desc || '',
        completed: false,
        lat: stop.lat,
        lng: stop.lng,
      });
    });

    const newTrip = {
      id: `trip-exp-${Date.now()}`,
      title: handoffData.title || `${handoffData.destination.split(',')[0]} Expedition`,
      destination: handoffData.destination,
      startDate: startDateStr,
      endDate: endDateStr,
      coverImage: handoffData.coverImage || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      budget: handoffData.budget || 2500,
      currency: 'USD',
      notes: handoffData.notes || `Curated journey planned via TripNest Explorer for ${handoffData.destination}.`,
      tags: ['Luxury', 'Curated', handoffData.destination.split(',')[0]],
      itinerary,
      expenses: [],
      packingList: [
        { id: `pk-${Date.now()}-1`, title: 'Valid Passport & Visas', category: 'Documents', packed: true },
        { id: `pk-${Date.now()}-2`, title: 'Lightweight Weatherproof Shell', category: 'Clothes', packed: false },
        { id: `pk-${Date.now()}-3`, title: 'Camera Gear & Universal Adapter', category: 'Electronics', packed: false },
        { id: `pk-${Date.now()}-4`, title: 'Refillable Hydration Flask', category: 'Toiletries', packed: false },
      ],
    };

    setTrips((prev) => [newTrip, ...prev]);
    setSelectedTripForDetail(newTrip);
  };

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'upcoming' | 'past'

  const plannerSectionRef = useRef(null);

  const scrollToPlanner = () => {
    const el = document.getElementById('planner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCarousel = () => {
    const el = document.getElementById('destinations-carousel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handlers for Trip Creation & Editing
  const handleOpenNewTrip = () => {
    setTripToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditTrip = (trip) => {
    setTripToEdit(trip);
    if (selectedTripForDetail) {
      setSelectedTripForDetail(null);
    }
    setIsModalOpen(true);
  };

  const handleSaveTrip = (savedTrip) => {
    setTrips((prevTrips) => {
      const exists = prevTrips.some((t) => t.id === savedTrip.id);
      if (exists) {
        return prevTrips.map((t) => (t.id === savedTrip.id ? savedTrip : t));
      } else {
        return [savedTrip, ...prevTrips];
      }
    });

    if (selectedTripForDetail && selectedTripForDetail.id === savedTrip.id) {
      setSelectedTripForDetail(savedTrip);
    }
  };

  const handleUpdateTripDetails = (updatedTrip) => {
    setTrips((prevTrips) =>
      prevTrips.map((t) => (t.id === updatedTrip.id ? updatedTrip : t))
    );
    setSelectedTripForDetail(updatedTrip);
  };

  // Delete handlers
  const handlePromptDelete = (tripId) => {
    setTripToDeleteId(tripId);
  };

  const handleConfirmDelete = () => {
    if (tripToDeleteId) {
      setTrips((prevTrips) => prevTrips.filter((t) => t.id !== tripToDeleteId));
      if (selectedTripForDetail && selectedTripForDetail.id === tripToDeleteId) {
        setSelectedTripForDetail(null);
      }
      setTripToDeleteId(null);
    }
  };

  const handleResetToSample = () => {
    setTrips(INITIAL_TRIPS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TRIPS));
  };

  // Quick Plan submitted from Hero Search Bar
  const handleQuickPlan = ({ destination, dates, guests }) => {
    // Check if trip already exists
    const existing = trips.find((t) => 
      t.destination.toLowerCase().includes(destination.toLowerCase().split(',')[0])
    );
    if (existing) {
      setSelectedTripForDetail(existing);
    } else {
      // Create new trip with these parameters
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setDate(today.getDate() + 30);
      const nextMonthEnd = new Date(nextMonth);
      nextMonthEnd.setDate(nextMonth.getDate() + 4);

      const newTrip = {
        id: `trip-quick-${Date.now()}`,
        title: `${destination.split(',')[0]} Expedition`,
        destination: destination,
        startDate: nextMonth.toISOString().split('T')[0],
        endDate: nextMonthEnd.toISOString().split('T')[0],
        coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
        budget: 3500,
        currency: 'USD',
        notes: `Quick plan booked for ${guests} · ${dates}`,
        tags: ['Luxury', 'Expedition'],
        itinerary: [],
        expenses: [],
      };

      setTrips((prev) => [newTrip, ...prev]);
      setSelectedTripForDetail(newTrip);
    }
  };

  // Curated Destination clicked
  const handleCurateDestination = (destTitle) => {
    const existing = trips.find((t) => 
      destTitle.toLowerCase().includes(t.destination.toLowerCase().split(',')[0])
    );
    if (existing) {
      setSelectedTripForDetail(existing);
    } else {
      scrollToPlanner();
      handleOpenNewTrip();
    }
  };

  // Launch pre-built itinerary from Dark Mode Destination Carousel
  const handleLaunchCarouselTrip = (destItem) => {
    const norm = destItem.name.toLowerCase();
    const existing = trips.find((t) =>
      t.destination.toLowerCase().includes(norm) ||
      (t.title && t.title.toLowerCase().includes(norm))
    );

    if (existing) {
      setSelectedTripForDetail(existing);
    } else {
      const today = new Date();
      const inTwoWeeks = new Date(today);
      inTwoWeeks.setDate(today.getDate() + 14);
      const inThreeWeeks = new Date(inTwoWeeks);
      inThreeWeeks.setDate(inTwoWeeks.getDate() + 6);

      const priceNum = Number(destItem.price.replace(/[^0-9]/g, '')) || 1650;

      const newTrip = {
        id: `trip-${destItem.id}-${Date.now()}`,
        title: `${destItem.duration} in ${destItem.name}`,
        destination: destItem.fullDestination,
        startDate: inTwoWeeks.toISOString().split('T')[0],
        endDate: inThreeWeeks.toISOString().split('T')[0],
        coverImage: destItem.image,
        budget: priceNum,
        currency: 'USD',
        notes: `${destItem.subtitle}. Highlights: ${destItem.highlights}`,
        tags: ['Luxury', 'Expedition', destItem.name],
        itinerary: [
          {
            day: 1,
            title: `Arrival in ${destItem.name}`,
            activities: [
              {
                id: `act-${Date.now()}-1`,
                title: `${destItem.name} Private Arrival & Orientation`,
                timeSlot: '03:00 PM',
                location: destItem.fullDestination,
                category: 'Hotel',
                cost: Math.round(priceNum * 0.35),
                notes: 'Boutique eco-lodge check-in with welcome local beverage.',
                completed: false,
              },
              {
                id: `act-${Date.now()}-2`,
                title: `Sunset Golden Hour Walk`,
                timeSlot: '06:30 PM',
                location: destItem.fullDestination,
                category: 'Sightseeing',
                cost: 0,
                notes: 'Breathtaking panoramic sunset viewpoints.',
                completed: false,
              },
            ],
          },
        ],
        expenses: [],
        packingList: [
          { id: `pk-${Date.now()}-1`, title: 'Valid Passport & Travel Insurance', category: 'Documents', packed: true },
          { id: `pk-${Date.now()}-2`, title: 'Comfortable Walking / Trail Shoes', category: 'Clothes', packed: false },
          { id: `pk-${Date.now()}-3`, title: 'Universal Adapter & Camera Gear', category: 'Electronics', packed: false },
        ],
      };

      setTrips((prev) => [newTrip, ...prev]);
      setSelectedTripForDetail(newTrip);
    }
  };

  // Filtering & search
  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = 
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trip.title && trip.title.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterCategory === 'upcoming') {
      const today = new Date().toISOString().split('T')[0];
      return trip.startDate >= today;
    }
    if (filterCategory === 'past') {
      const today = new Date().toISOString().split('T')[0];
      return trip.endDate < today;
    }
    return true;
  });

  // Overview metrics
  const totalBudget = trips.reduce((sum, t) => sum + Number(t.budget || 0), 0);
  const totalDestinations = new Set(trips.map((t) => t.destination.split(',')[0].trim())).size;
  const tripToDelete = trips.find((t) => t.id === tripToDeleteId);

  return (
    <div className="min-h-screen bg-[#12040b] text-[#FAF3EF] font-sans selection:bg-[#F2DACE] selection:text-[#7C0E44] flex flex-col">
      {/* 1. Floating Pill Fixed Navbar */}
      <TriplioNavbar 
        onOpenPlanner={scrollToPlanner}
        onOpenBookingModal={handleOpenNewTrip}
      />

      {/* 2. Framed Scenic Hero with 3D Parallax & Depth Layering */}
      <TriplioHero 
        onQuickPlanSubmit={handleQuickPlan}
        onOpenPlanner={scrollToPlanner}
      />

      {/* 3. Scroll-Triggered Text Reveal & Split Feature with Count-Up Stats */}
      <EditorialStorySection 
        onExploreDestinations={() => handleOpenExplorer('dolomites')}
      />

      {/* 4. Dark-Mode Horizontal Destination Carousel (01 / 06) */}
      <DarkDestinationCarousel 
        onLaunchItinerary={(dest) => handleOpenExplorer(dest.name)}
        onSelectDestination={(dest) => handleOpenExplorer(dest.name)}
      />

      {/* 5. 3-Step Process Section ("Three steps to the summit.") */}
      <ThreeStepProcessSection 
        onOpenPlanner={scrollToPlanner}
      />

      {/* 6. Full-Bleed Atmospheric Banner ("Every summit tells a story.") */}
      <AtmosphericBanner 
        onOpenPlanner={scrollToPlanner}
      />

      {/* 7. Curated Luxury Destinations Showcase */}
      <CuratedDestinations 
        onSelectDestination={(destTitle) => handleOpenExplorer(destTitle)}
      />

      {/* 4. Interactive Trip Planner Workspace (#planner) */}
      <section 
        id="planner"
        ref={plannerSectionRef}
        className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-white/10"
      >
        {/* Workspace Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#d8c3a5] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Travel Architect Workspace</span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Your Curated Itineraries
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-xl">
              Organize day-by-day activities, visualize GPS routes on the Leaflet map, track live expenses, and auto-generate schedules with Gemini AI.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-3">
            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl px-4 py-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Saved Trips</span>
              <span className="text-lg font-black text-white">{trips.length}</span>
            </div>
            <div className="bg-neutral-900/80 border border-white/10 rounded-2xl px-4 py-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Budget</span>
              <span className="text-lg font-black text-[#d8c3a5]">{formatCurrency(totalBudget, 'USD')}</span>
            </div>
            <button
              onClick={handleOpenNewTrip}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-neutral-950 bg-[#f5efe6] hover:bg-white active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>+ New Trip</span>
            </button>
          </div>
        </div>

        {/* Workspace Search & Filter Controls */}
        <div className="bg-neutral-900/60 border border-white/10 p-3 sm:p-4 rounded-2xl mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xl">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search trips by destination (e.g. Kyoto, Amalfi, Dolomites)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-white/10 bg-neutral-950/60 text-white placeholder-neutral-500 focus:outline-none focus:border-white/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterCategory === 'all'
                  ? 'bg-[#f5efe6] text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              All Trips ({trips.length})
            </button>
            <button
              onClick={() => setFilterCategory('upcoming')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterCategory === 'upcoming'
                  ? 'bg-[#f5efe6] text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilterCategory('past')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterCategory === 'past'
                  ? 'bg-[#f5efe6] text-neutral-950 shadow'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Past
            </button>

            {trips.length === 0 && (
              <button
                onClick={handleResetToSample}
                title="Restore sample trip"
                className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <div className="bg-neutral-900/40 border border-dashed border-white/15 rounded-3xl p-12 text-center max-w-lg mx-auto my-8 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-white/10 text-[#d8c3a5] flex items-center justify-center mx-auto shadow-sm">
              <Compass className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {searchQuery ? 'No matching journeys found' : 'No trips planned yet'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                {searchQuery
                  ? `No journeys matched "${searchQuery}". Try a different keyword.`
                  : 'Get started by creating your very first custom expedition or loading the sample Kyoto itinerary!'}
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={handleResetToSample}
                className="px-4 py-2.5 text-xs font-semibold text-neutral-300 bg-white/10 hover:bg-white/20 rounded-xl transition-colors cursor-pointer inline-flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Load Sample Kyoto Trip</span>
              </button>
              <button
                onClick={handleOpenNewTrip}
                className="px-5 py-2.5 text-xs font-bold text-neutral-950 bg-[#f5efe6] hover:bg-white rounded-xl shadow transition-all cursor-pointer inline-flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Trip</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onEdit={handleEditTrip}
                onDelete={handlePromptDelete}
                onViewDetails={setSelectedTripForDetail}
              />
            ))}

            {/* Quick "+ Plan Another Journey" Card */}
            <button
              onClick={handleOpenNewTrip}
              className="group min-h-[360px] rounded-3xl border-2 border-dashed border-white/15 hover:border-white/30 bg-neutral-900/30 hover:bg-neutral-900/60 p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-2xl cursor-pointer"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/10 text-[#d8c3a5] group-hover:scale-110 group-hover:bg-white/15 flex items-center justify-center transition-transform duration-300 mb-4 shadow-sm">
                <Plus className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-[#d8c3a5] transition-colors">
                Plan Another Journey
              </h4>
              <p className="text-xs text-neutral-400 max-w-xs mt-1.5 font-light">
                Add travel dates, pick scenic presets, and organize your bespoke daily schedule.
              </p>
            </button>
          </div>
        )}
      </section>


      {/* 6. Testimonials */}
      <TestimonialsSection />

      {/* 7. FAQ */}
      <FAQSection />

      {/* 8. Dedicated Interactive Contact Us Section */}
      <ContactSection />

      {/* 9. Signature Dark Footer */}
      <TriplioFooter 
        onOpenPlanner={scrollToPlanner}
      />

      {/* Lazy-Loaded Modals & Views with Suspense Boundary */}
      <Suspense fallback={null}>
        {/* Create / Edit Trip Modal */}
        {isModalOpen && (
          <TripModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveTrip}
            tripToEdit={tripToEdit}
          />
        )}

        {/* Detail / Itinerary / Map / AI / Packing / PDF Modal */}
        {selectedTripForDetail && (
          <TripDetailModal
            isOpen={Boolean(selectedTripForDetail)}
            trip={selectedTripForDetail}
            onClose={() => setSelectedTripForDetail(null)}
            onUpdateTrip={handleUpdateTripDetails}
            onEditTrip={handleEditTrip}
          />
        )}

        {/* Delete Confirmation Modal */}
        {tripToDeleteId && (
          <DeleteConfirmModal
            isOpen={Boolean(tripToDeleteId)}
            tripTitle={tripToDelete?.title || tripToDelete?.destination || 'this trip'}
            onClose={() => setTripToDeleteId(null)}
            onConfirm={handleConfirmDelete}
          />
        )}

        {/* 3D-Style Destination & Route Explorer Modal */}
        {explorerDestinationKey && (
          <DestinationExplorerModal
            isOpen={Boolean(explorerDestinationKey)}
            destinationKey={explorerDestinationKey}
            onClose={handleCloseExplorer}
            onHandoffToPlanner={handleExplorerHandoff}
          />
        )}
      </Suspense>
    </div>
  );
}
