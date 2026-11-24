import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  DollarSign, 
  FileText, 
  Tag, 
  AlertCircle,
  Camera,
  Utensils,
  Navigation,
  BedDouble,
  ShoppingBag,
  Loader2,
  Check
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { geocodeLocation } from '../services/geocoding';

const ICON_MAP = {
  Camera,
  Utensils,
  Navigation,
  BedDouble,
  ShoppingBag,
};

export default function ActivityModal(props) {
  if (!props.isOpen) return null;
  return <ActivityModalContent {...props} />;
}

function ActivityModalContent({ 
  onClose, 
  onSave, 
  activityToEdit, 
  dayNumber, 
  currency = 'USD',
  destinationContext = ''
}) {
  const isEditing = Boolean(activityToEdit);

  const [title, setTitle] = useState('');
  const [timeSlot, setTimeSlot] = useState('09:00 AM');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Sightseeing');
  const [cost, setCost] = useState('0');
  const [notes, setNotes] = useState('');
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeStatus, setGeocodeStatus] = useState(null); // 'found' | 'not_found' | null
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (activityToEdit) {
      setTitle(activityToEdit.title || '');
      setTimeSlot(activityToEdit.timeSlot || '09:00 AM');
      setLocation(activityToEdit.location || '');
      setCategory(activityToEdit.category || 'Sightseeing');
      setCost(String(activityToEdit.cost ?? '0'));
      setNotes(activityToEdit.notes || '');
      setLat(activityToEdit.lat ?? null);
      setLng(activityToEdit.lng ?? null);
      setGeocodeStatus(activityToEdit.lat != null ? 'found' : null);
    } else {
      setTitle('');
      setTimeSlot('10:00 AM');
      setLocation('');
      setCategory('Sightseeing');
      setCost('0');
      setNotes('');
      setLat(null);
      setLng(null);
      setGeocodeStatus(null);
    }
    setErrors({});
  }, [activityToEdit, isOpen]);

  // Handle location blur to auto-geocode early
  const handleLocationBlur = async () => {
    if (!location.trim()) return;
    setIsGeocoding(true);
    try {
      const geo = await geocodeLocation(location.trim(), destinationContext);
      if (geo && geo.lat != null && geo.lng != null) {
        setLat(geo.lat);
        setLng(geo.lng);
        setGeocodeStatus('found');
      } else {
        setGeocodeStatus('not_found');
      }
    } catch (e) {
      setGeocodeStatus('not_found');
    } finally {
      setIsGeocoding(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Activity title is required';
    }
    if (!timeSlot.trim()) {
      errs.timeSlot = 'Time slot is required';
    }
    if (!location.trim()) {
      errs.location = 'Location name is required';
    }
    if (cost === '' || Number(cost) < 0) {
      errs.cost = 'Please enter a valid cost (0 or higher)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    let finalLat = lat;
    let finalLng = lng;

    // If coordinates not yet determined, geocode now
    if (finalLat == null || finalLng == null) {
      setIsGeocoding(true);
      try {
        const geo = await geocodeLocation(location.trim(), destinationContext);
        if (geo) {
          finalLat = geo.lat;
          finalLng = geo.lng;
        }
      } catch (e) {
        console.warn('Geocoding error on submit:', e);
      } finally {
        setIsGeocoding(false);
      }
    }

    const activityData = {
      id: activityToEdit ? activityToEdit.id : `act-${Date.now()}`,
      title: title.trim(),
      timeSlot: timeSlot.trim(),
      location: location.trim(),
      category,
      cost: Number(cost) || 0,
      notes: notes.trim(),
      completed: activityToEdit ? activityToEdit.completed : false,
      lat: finalLat,
      lng: finalLng,
    };

    onSave(activityData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-rose-400">
              Day {dayNumber} Schedule
            </span>
            <h3 className="text-lg font-bold text-white">
              {isEditing ? 'Edit Activity' : 'Add New Activity'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Activity Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Visit Kinkaku-ji or Seafood Dinner"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.title 
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200' 
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-500 mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Time Slot & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Time Slot <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. 09:30 AM"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.timeSlot
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {errors.timeSlot && (
                <p className="text-xs text-rose-500 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.timeSlot}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Location Name <span className="text-rose-500">*</span>
                </label>
                {isGeocoding && (
                  <span className="text-[11px] text-indigo-600 flex items-center">
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    Geocoding...
                  </span>
                )}
                {!isGeocoding && geocodeStatus === 'found' && (
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center bg-emerald-50 px-1.5 py-0.2 rounded">
                    <Check className="w-2.5 h-2.5 mr-0.5 stroke-[3]" />
                    Map Pin Ready
                  </span>
                )}
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Fushimi Inari Shrine, Kyoto"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setGeocodeStatus(null);
                  }}
                  onBlur={handleLocationBlur}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.location
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {errors.location && (
                <p className="text-xs text-rose-500 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.location}
                </p>
              )}
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.id;
                const IconComponent = ICON_MAP[cat.iconName] || Tag;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? `${cat.badgeClass} ring-2 ring-indigo-200 border-indigo-400 shadow-xs font-bold`
                        : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5 shrink-0" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Estimated Cost */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Estimated Cost ({currency})
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="0"
                step="5"
                placeholder="0"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.cost
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                }`}
              />
            </div>
            {errors.cost && (
              <p className="text-xs text-rose-500 mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.cost}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Notes & Helpful Tips
            </label>
            <div className="relative">
              <textarea
                rows={2}
                placeholder="Booking references, opening hours, reservations, or tips..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
              />
            </div>
          </div>

          {/* Modal Buttons */}
          <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGeocoding}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 shadow-md shadow-rose-500/25 transition-all cursor-pointer disabled:opacity-75"
            >
              {isGeocoding ? 'Locating...' : (isEditing ? 'Save Activity' : 'Add Activity')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
