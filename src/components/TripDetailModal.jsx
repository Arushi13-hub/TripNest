import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit3, 
  ChevronUp, 
  ChevronDown, 
  Tag, 
  Camera, 
  Utensils, 
  Navigation, 
  BedDouble, 
  ShoppingBag, 
  CalendarDays,
  Map as MapIcon,
  ListTodo,
  ExternalLink
} from 'lucide-react';
import { calculateDuration, formatDateRange, formatCurrency, getTripStatus, getDaysList } from '../utils/dateUtils';
import { CATEGORIES, CATEGORY_MAP } from '../data/categories';
import ActivityModal from './ActivityModal';
import TripMap from './TripMap';
import AIPlannerModal from './AIPlannerModal';
import PackingListTab from './PackingListTab';
import PrintItineraryView from './PrintItineraryView';
import { Sparkles, Printer, Briefcase, FileDown } from 'lucide-react';

const ICON_MAP = {
  Camera,
  Utensils,
  Navigation,
  BedDouble,
  ShoppingBag,
};

export default function TripDetailModal(props) {
  if (!props.isOpen || !props.trip) return null;
  return <TripDetailModalContent {...props} />;
}

function TripDetailModalContent({ trip, onClose, onUpdateTrip, onEditTrip }) {
  // Generate day list based on start & end dates
  const daysList = useMemo(() => {
    return getDaysList(trip.startDate, trip.endDate);
  }, [trip.startDate, trip.endDate]);

  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [activeMainTab, setActiveMainTab] = useState('itinerary'); // 'itinerary' | 'packing'
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState(null);
  
  // Interactive Map Sync
  const [focusedActivityId, setFocusedActivityId] = useState(null);
  const [mobileTab, setMobileTab] = useState('both'); // 'itinerary' | 'map' (on mobile)

  const duration = calculateDuration(trip.startDate, trip.endDate);
  const dateFormatted = formatDateRange(trip.startDate, trip.endDate);
  const status = getTripStatus(trip.startDate, trip.endDate);
  const budgetLimit = Number(trip.budget || 0);

  // Get current day's itinerary group
  const itinerary = trip.itinerary || [];
  const currentDayGroup = itinerary.find((d) => d.day === selectedDayNumber);
  const currentDayActivities = currentDayGroup ? currentDayGroup.activities || [] : [];

  // When day changes, focus the first activity if available
  useEffect(() => {
    if (currentDayActivities.length > 0) {
      setFocusedActivityId(currentDayActivities[0].id);
    } else {
      setFocusedActivityId(null);
    }
  }, [selectedDayNumber]);

  // Calculate live budget calculations across ALL days and activities
  const { totalSpent, categoryBreakdown } = useMemo(() => {
    let spent = 0;
    const catMap = {
      Sightseeing: 0,
      Food: 0,
      Transit: 0,
      Hotel: 0,
      Shopping: 0,
    };

    itinerary.forEach((dayGroup) => {
      (dayGroup.activities || []).forEach((act) => {
        const cost = Number(act.cost || 0);
        spent += cost;
        const cat = act.category || 'Sightseeing';
        if (catMap[cat] !== undefined) {
          catMap[cat] += cost;
        } else {
          catMap.Sightseeing += cost;
        }
      });
    });

    (trip.expenses || []).forEach((exp) => {
      const amount = Number(exp.amount || 0);
      spent += amount;
      const cat = exp.category || 'Hotel';
      if (catMap[cat] !== undefined) {
        catMap[cat] += amount;
      }
    });

    return {
      totalSpent: spent,
      categoryBreakdown: catMap,
    };
  }, [itinerary, trip.expenses]);

  const remainingBudget = budgetLimit - totalSpent;
  const budgetPercentage = budgetLimit > 0 ? Math.min(100, Math.round((totalSpent / budgetLimit) * 100)) : 0;

  // Open modal to add activity
  const handleOpenAddActivity = () => {
    setActivityToEdit(null);
    setIsActivityModalOpen(true);
  };

  const handleUpdatePackingList = (updatedList) => {
    onUpdateTrip({
      ...trip,
      packingList: updatedList,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Apply AI-generated itinerary (merge or replace)
  const handleApplyAIItinerary = (generatedDays, strategy) => {
    let updatedItinerary;

    if (strategy === 'replace') {
      updatedItinerary = generatedDays;
    } else {
      // Append strategy
      updatedItinerary = [...itinerary];
      generatedDays.forEach((genDay) => {
        const existingIndex = updatedItinerary.findIndex((d) => d.day === genDay.day);
        if (existingIndex >= 0) {
          const existingDay = updatedItinerary[existingIndex];
          updatedItinerary[existingIndex] = {
            ...existingDay,
            activities: [...(existingDay.activities || []), ...(genDay.activities || [])],
          };
        } else {
          updatedItinerary.push(genDay);
        }
      });
      updatedItinerary.sort((a, b) => a.day - b.day);
    }

    onUpdateTrip({
      ...trip,
      itinerary: updatedItinerary,
    });

    // Focus first activity of selected or first day
    const targetDay = updatedItinerary.find((d) => d.day === selectedDayNumber) || updatedItinerary[0];
    if (targetDay && targetDay.activities && targetDay.activities.length > 0) {
      setFocusedActivityId(targetDay.activities[0].id);
    }
  };

  // Open modal to edit activity
  const handleOpenEditActivity = (activity, e) => {
    if (e) e.stopPropagation();
    setActivityToEdit(activity);
    setIsActivityModalOpen(true);
  };

  // Save activity (create or update)
  const handleSaveActivity = (activityData) => {
    let updatedItinerary = [...itinerary];
    const dayIndex = updatedItinerary.findIndex((d) => d.day === selectedDayNumber);

    if (dayIndex >= 0) {
      const dayGroup = updatedItinerary[dayIndex];
      const existingActs = dayGroup.activities || [];
      const actIndex = existingActs.findIndex((a) => a.id === activityData.id);

      let newActs;
      if (actIndex >= 0) {
        newActs = existingActs.map((a) => (a.id === activityData.id ? activityData : a));
      } else {
        newActs = [...existingActs, activityData];
      }

      updatedItinerary[dayIndex] = {
        ...dayGroup,
        activities: newActs,
      };
    } else {
      const selectedDayInfo = daysList.find((d) => d.dayNumber === selectedDayNumber);
      updatedItinerary.push({
        day: selectedDayNumber,
        title: selectedDayInfo ? `Day ${selectedDayNumber} · ${selectedDayInfo.shortDate}` : `Day ${selectedDayNumber}`,
        activities: [activityData],
      });
      updatedItinerary.sort((a, b) => a.day - b.day);
    }

    onUpdateTrip({
      ...trip,
      itinerary: updatedItinerary,
    });

    // Auto focus newly added/edited activity on the map
    setFocusedActivityId(activityData.id);
  };

  // Delete activity
  const handleDeleteActivity = (activityId, e) => {
    if (e) e.stopPropagation();
    const updatedItinerary = itinerary.map((dayGroup) => {
      if (dayGroup.day === selectedDayNumber) {
        return {
          ...dayGroup,
          activities: (dayGroup.activities || []).filter((a) => a.id !== activityId),
        };
      }
      return dayGroup;
    });

    onUpdateTrip({
      ...trip,
      itinerary: updatedItinerary,
    });

    if (focusedActivityId === activityId) {
      setFocusedActivityId(null);
    }
  };

  // Toggle activity completion
  const handleToggleCompleted = (activityId, e) => {
    if (e) e.stopPropagation();
    const updatedItinerary = itinerary.map((dayGroup) => {
      if (dayGroup.day === selectedDayNumber) {
        return {
          ...dayGroup,
          activities: (dayGroup.activities || []).map((a) =>
            a.id === activityId ? { ...a, completed: !a.completed } : a
          ),
        };
      }
      return dayGroup;
    });

    onUpdateTrip({
      ...trip,
      itinerary: updatedItinerary,
    });
  };

  // Reorder activity: Move up
  const handleMoveUp = (index, e) => {
    if (e) e.stopPropagation();
    if (index <= 0) return;
    const newActs = [...currentDayActivities];
    const temp = newActs[index - 1];
    newActs[index - 1] = newActs[index];
    newActs[index] = temp;

    const updatedItinerary = itinerary.map((dayGroup) => {
      if (dayGroup.day === selectedDayNumber) {
        return { ...dayGroup, activities: newActs };
      }
      return dayGroup;
    });

    onUpdateTrip({
      ...trip,
      itinerary: updatedItinerary,
    });
  };

  // Reorder activity: Move down
  const handleMoveDown = (index, e) => {
    if (e) e.stopPropagation();
    if (index >= currentDayActivities.length - 1) return;
    const newActs = [...currentDayActivities];
    const temp = newActs[index + 1];
    newActs[index + 1] = newActs[index];
    newActs[index] = temp;

    const updatedItinerary = itinerary.map((dayGroup) => {
      if (dayGroup.day === selectedDayNumber) {
        return { ...dayGroup, activities: newActs };
      }
      return dayGroup;
    });

    onUpdateTrip({
      ...trip,
      itinerary: updatedItinerary,
    });
  };

  // Click card to pan map
  const handleCardClick = (activityId) => {
    setFocusedActivityId(activityId);
    // On mobile, if user clicks card and wants to see map, they can toggle or we can pan
  };

  const selectedDayInfo = daysList.find((d) => d.dayNumber === selectedDayNumber);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-7xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with Cover Image */}
        <div className="relative h-40 sm:h-48 w-full overflow-hidden shrink-0">
          <img
            src={trip.coverImage || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'}
            alt={trip.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-black/30" />

          {/* Top Actions */}
          <div className="absolute top-4 right-4 flex items-center space-x-2 z-10 no-print">
            <button
              onClick={handlePrint}
              className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors cursor-pointer"
              title="Export Itinerary as PDF / Print"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEditTrip(trip)}
              className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors cursor-pointer"
              title="Edit Trip Settings"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Banner Meta Info */}
          <div className="absolute bottom-3 left-4 sm:left-6 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/90 text-white backdrop-blur-md">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                {trip.destination}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/40 text-amber-200 backdrop-blur-md border border-white/10">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {duration} ({daysList.length} Days)
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/90 text-white">
                {status}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-md">
              {trip.title || trip.destination}
            </h1>
            <p className="text-xs text-slate-200 mt-0.5 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-rose-300" />
              {dateFormatted}
            </p>
          </div>
        </div>

        {/* Live Budget Summary Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Totals */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Budget Limit
                </span>
                <span className="text-sm sm:text-base font-black text-slate-800">
                  {formatCurrency(budgetLimit, trip.currency)}
                </span>
              </div>

              <div className="h-6 w-px bg-slate-200 hidden sm:block" />

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Total Spent
                </span>
                <span className={`text-sm sm:text-base font-black ${remainingBudget < 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {formatCurrency(totalSpent, trip.currency)}
                </span>
              </div>

              <div className="h-6 w-px bg-slate-200 hidden sm:block" />

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Remaining
                </span>
                <span className={`text-sm sm:text-base font-black ${remainingBudget < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {formatCurrency(remainingBudget, trip.currency)}
                </span>
              </div>

              <div className="flex-1 min-w-[130px] max-w-[200px]">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                  <span>Usage</span>
                  <span>{budgetPercentage}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      remainingBudget < 0 
                        ? 'bg-rose-500' 
                        : budgetPercentage > 85 
                        ? 'bg-amber-500' 
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                    }`}
                    style={{ width: `${Math.min(100, budgetPercentage)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Category-Wise Spending Breakdown */}
            <div className="flex items-center flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => {
                const amount = categoryBreakdown[cat.id] || 0;
                const IconComponent = ICON_MAP[cat.iconName] || Tag;
                return (
                  <div
                    key={cat.id}
                    className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg text-xs border ${
                      amount > 0 ? cat.badgeClass : 'bg-white text-slate-400 border-slate-200/80 opacity-70'
                    }`}
                  >
                    <IconComponent className="w-3 h-3" />
                    <span className="font-semibold">{cat.name}:</span>
                    <span className="font-bold">{formatCurrency(amount, trip.currency)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Primary View Switcher: Itinerary & Map vs. Packing Checklist */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between no-print overflow-x-auto">
          <div className="flex space-x-1 sm:space-x-2 py-2">
            <button
              onClick={() => setActiveMainTab('itinerary')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
                activeMainTab === 'itinerary'
                  ? 'bg-white text-slate-900 border border-slate-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ListTodo className="w-4 h-4 text-rose-600" />
              <span>Itinerary & Map</span>
            </button>

            <button
              onClick={() => setActiveMainTab('packing')}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer whitespace-nowrap ${
                activeMainTab === 'packing'
                  ? 'bg-white text-slate-900 border border-slate-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Packing Checklist</span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {(trip.packingList || []).filter(i => i.packed).length}/{(trip.packingList || []).length}
              </span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 shadow-2xs transition-all cursor-pointer whitespace-nowrap ml-2"
            title="Export clean PDF or print"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Export Itinerary</span>
          </button>
        </div>

        {/* Tab View 1: Packing List */}
        {activeMainTab === 'packing' && (
          <div className="flex-1 overflow-y-auto bg-slate-50/70 p-3 sm:p-5 no-print">
            <PackingListTab
              packingList={trip.packingList || []}
              onUpdatePackingList={handleUpdatePackingList}
            />
          </div>
        )}

        {/* Tab View 2: Itinerary & Map */}
        {activeMainTab === 'itinerary' && (
          <>
            {/* Day Tabs & Mobile View Switcher */}
            <div className="bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between overflow-x-auto no-print">
              {/* Day Tabs */}
              <div className="flex space-x-1.5 py-2">
                {daysList.map((dayItem) => {
                  const isActive = selectedDayNumber === dayItem.dayNumber;
                  const dayGroup = itinerary.find((d) => d.day === dayItem.dayNumber);
                  const count = dayGroup ? (dayGroup.activities || []).length : 0;

                  return (
                    <button
                      key={dayItem.dayNumber}
                      onClick={() => setSelectedDayNumber(dayItem.dayNumber)}
                      className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all duration-200 flex items-center space-x-1.5 shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <CalendarDays className={`w-3.5 h-3.5 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
                      <span>Day {dayItem.dayNumber}</span>
                      <span className={`text-[11px] font-medium ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                        · {dayItem.shortDate}
                      </span>
                      {count > 0 && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                          isActive ? 'bg-rose-500 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Right Mobile Switcher & Add Button */}
              <div className="flex items-center space-x-2 shrink-0 ml-3">
                {/* Mobile View Toggle */}
                <div className="flex lg:hidden bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setMobileTab('itinerary')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      mobileTab === 'itinerary' || mobileTab === 'both' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    <ListTodo className="w-3.5 h-3.5 inline mr-1" />
                    Plan
                  </button>
                  <button
                    onClick={() => setMobileTab('map')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      mobileTab === 'map' ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5 inline mr-1" />
                    Map
                  </button>
                </div>

                {/* AI Plan My Trip Button */}
                <button
                  onClick={() => setIsAIModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-500 hover:via-indigo-500 hover:to-rose-500 shadow-md shadow-indigo-500/20 active:scale-98 transition-all cursor-pointer whitespace-nowrap"
                  title="Auto-generate a full day-by-day itinerary with AI"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>✨ AI Plan</span>
                </button>

                <button
                  onClick={handleOpenAddActivity}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 shadow-sm cursor-pointer whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Activity</span>
                </button>
              </div>
            </div>

            {/* SPLIT VIEW BODY (60% Itinerary / 40% Interactive Map on Desktop) */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-50/70 min-h-[460px] no-print">
          {/* LEFT COLUMN: ITINERARY TIMELINE (60% Desktop) */}
          <div className={`w-full lg:w-[60%] overflow-y-auto p-4 sm:p-6 space-y-4 ${
            mobileTab === 'map' ? 'hidden lg:block' : 'block'
          }`}>
            {/* Day Header Info */}
            <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
                  <span>Day {selectedDayNumber} Schedule</span>
                  {selectedDayInfo && (
                    <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      {selectedDayInfo.displayDate}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentDayActivities.length} {currentDayActivities.length === 1 ? 'activity' : 'activities'} scheduled · Click any activity to locate on map
                </p>
              </div>

              <button
                onClick={handleOpenAddActivity}
                className="inline-flex items-center space-x-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add</span>
              </button>
            </div>

            {/* Empty State */}
            {currentDayActivities.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800">
                    No activities planned for Day {selectedDayNumber} yet
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Add landmarks, dining spots, or hotels to visualize your day schedule and see route markers automatically on the map.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  <button
                    onClick={() => setIsAIModalOpen(true)}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 hover:from-purple-500 hover:via-indigo-500 hover:to-rose-500 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>✨ AI Auto-Plan Itinerary</span>
                  </button>

                  <button
                    onClick={handleOpenAddActivity}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add First Activity</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Vertical Timeline */
              <div className="relative pl-6 sm:pl-8 space-y-3.5">
                {/* Vertical Timeline Track Line */}
                <div className="absolute left-2.5 sm:left-3.5 top-3 bottom-3 w-0.5 bg-slate-200" />

                {currentDayActivities.map((act, index) => {
                  const catConfig = CATEGORY_MAP[act.category] || CATEGORY_MAP.Sightseeing;
                  const IconComponent = ICON_MAP[catConfig.iconName] || Tag;
                  const isFocused = focusedActivityId === act.id;
                  const orderNumber = index + 1;

                  return (
                    <div 
                      key={act.id} 
                      onClick={() => handleCardClick(act.id)}
                      className="relative group cursor-pointer"
                    >
                      {/* Timeline Node Numbered Pin */}
                      <div 
                        onClick={(e) => handleToggleCompleted(act.id, e)}
                        className={`absolute -left-6 sm:-left-8 top-4 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center cursor-pointer transition-all z-10 font-black text-[11px] ${
                          act.completed 
                            ? 'border-emerald-500 text-emerald-600 bg-emerald-50' 
                            : isFocused
                            ? 'border-rose-600 text-white bg-rose-600 shadow-md scale-110'
                            : 'border-slate-300 text-slate-600 group-hover:border-rose-500 group-hover:text-rose-600'
                        }`}
                        title={act.completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {act.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-white" />
                        ) : (
                          <span>{orderNumber}</span>
                        )}
                      </div>

                      {/* Activity Card */}
                      <div className={`bg-white rounded-2xl border p-3.5 sm:p-4 transition-all duration-200 ${
                        isFocused 
                          ? 'border-rose-400 ring-2 ring-rose-200/80 shadow-md bg-rose-50/10' 
                          : 'border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs'
                      } ${act.completed ? 'opacity-80 bg-slate-50/50' : ''}`}>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          {/* Content Details */}
                          <div className="space-y-1.5 flex-1">
                            {/* Badges */}
                            <div className="flex items-center flex-wrap gap-1.5">
                              <span className="inline-flex items-center text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/80">
                                <Clock className="w-3 h-3 mr-1 text-slate-500" />
                                {act.timeSlot}
                              </span>

                              <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-md border ${catConfig.badgeClass}`}>
                                <IconComponent className="w-3 h-3 mr-1" />
                                {act.category}
                              </span>

                              {Number(act.cost) > 0 && (
                                <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                  <DollarSign className="w-3 h-3 mr-0.5" />
                                  {formatCurrency(act.cost, trip.currency)}
                                </span>
                              )}

                              {act.lat != null && act.lng != null && (
                                <span className="inline-flex items-center text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
                                  <MapPin className="w-2.5 h-2.5 mr-0.5" />
                                  Pin #{orderNumber}
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <h4 className={`text-sm sm:text-base font-bold text-slate-900 ${act.completed ? 'line-through text-slate-400' : ''}`}>
                              {act.title}
                            </h4>

                            {/* Location */}
                            {act.location && (
                              <p className="text-xs text-slate-600 flex items-center font-medium">
                                <MapPin className="w-3.5 h-3.5 mr-1 text-rose-500 shrink-0" />
                                <span>{act.location}</span>
                              </p>
                            )}

                            {/* Notes */}
                            {act.notes && (
                              <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 mt-1 leading-relaxed">
                                {act.notes}
                              </p>
                            )}
                          </div>

                          {/* Reordering & Actions */}
                          <div className="flex items-center sm:flex-col justify-end gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                            {/* Up/Down buttons */}
                            <div className="flex items-center sm:flex-col bg-slate-50 rounded-xl p-0.5 border border-slate-200/80">
                              <button
                                onClick={(e) => handleMoveUp(index, e)}
                                disabled={index === 0}
                                title="Move up in schedule"
                                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                  index === 0 
                                    ? 'text-slate-300 cursor-not-allowed' 
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                                }`}
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleMoveDown(index, e)}
                                disabled={index === currentDayActivities.length - 1}
                                title="Move down in schedule"
                                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                                  index === currentDayActivities.length - 1 
                                    ? 'text-slate-300 cursor-not-allowed' 
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                                }`}
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Edit / Delete buttons */}
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={(e) => handleOpenEditActivity(act, e)}
                                title="Edit activity"
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => handleDeleteActivity(act.id, e)}
                                title="Delete activity"
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: INTERACTIVE LEAFLET MAP (40% Desktop) */}
          <div className={`w-full lg:w-[40%] flex flex-col p-3 sm:p-4 lg:p-6 bg-slate-100/60 border-t lg:border-t-0 lg:border-l border-slate-200 ${
            mobileTab === 'itinerary' ? 'hidden lg:flex' : 'flex'
          }`}>
            <div className="flex-1 w-full h-[380px] lg:h-full relative">
              <TripMap
                activities={currentDayActivities}
                focusedActivityId={focusedActivityId}
                onSelectActivity={setFocusedActivityId}
                destinationName={trip.destination}
              />
            </div>
          </div>
        </div>
      </>
    )}

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between no-print">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEditTrip(trip)}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Trip Info</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print / PDF</span>
            </button>
          </div>
          
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Done Planning
          </button>
        </div>

        {/* Print Dossier (Visible only when window.print() is invoked) */}
        <PrintItineraryView trip={trip} />
      </div>

      {/* Activity Modal */}
      <ActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSave={handleSaveActivity}
        activityToEdit={activityToEdit}
        dayNumber={selectedDayNumber}
        currency={trip.currency}
        destinationContext={trip.destination}
      />

      {/* AI Planner Modal */}
      <AIPlannerModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        trip={trip}
        daysCount={daysList.length}
        onApplyItinerary={handleApplyAIItinerary}
      />
    </div>
  );
}
