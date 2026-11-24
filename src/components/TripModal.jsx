import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { SCENIC_PRESETS } from '../data/presets';

export default function TripModal(props) {
  if (!props.isOpen) return null;
  return <TripModalContent {...props} />;
}

function TripModalContent({ onClose, onSave, tripToEdit }) {
  const isEditing = Boolean(tripToEdit);

  const [destination, setDestination] = useState('');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [coverImage, setCoverImage] = useState(SCENIC_PRESETS[0].url);
  const [budget, setBudget] = useState('1500');
  const [currency, setCurrency] = useState('USD');
  const [notes, setNotes] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState(SCENIC_PRESETS[0].id);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (tripToEdit) {
      setDestination(tripToEdit.destination || '');
      setTitle(tripToEdit.title || '');
      setStartDate(tripToEdit.startDate || '');
      setEndDate(tripToEdit.endDate || '');
      setCoverImage(tripToEdit.coverImage || SCENIC_PRESETS[0].url);
      setBudget(String(tripToEdit.budget ?? '1500'));
      setCurrency(tripToEdit.currency || 'USD');
      setNotes(tripToEdit.notes || '');

      const matchedPreset = SCENIC_PRESETS.find((p) => p.url === tripToEdit.coverImage);
      setSelectedPresetId(matchedPreset ? matchedPreset.id : null);
    } else {
      // Default dates for new trip: Today + 14 days
      const today = new Date();
      const inTwoWeeks = new Date(today);
      inTwoWeeks.setDate(today.getDate() + 14);
      const inTwoWeeksPlusThree = new Date(inTwoWeeks);
      inTwoWeeksPlusThree.setDate(inTwoWeeks.getDate() + 4);

      setDestination('');
      setTitle('');
      setStartDate(inTwoWeeks.toISOString().split('T')[0]);
      setEndDate(inTwoWeeksPlusThree.toISOString().split('T')[0]);
      setCoverImage(SCENIC_PRESETS[0].url);
      setSelectedPresetId(SCENIC_PRESETS[0].id);
      setBudget('2000');
      setCurrency('USD');
      setNotes('');
    }
    setErrors({});
  }, [tripToEdit]);

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setCoverImage(preset.url);
    if (!destination || destination.trim() === '') {
      setDestination(preset.name);
      if (!title) setTitle(preset.name);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!destination.trim()) {
      newErrors.destination = 'Destination is required';
    }
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'End date cannot be earlier than start date';
    }
    if (!budget || Number(budget) < 0) {
      newErrors.budget = 'Please enter a valid budget amount';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const tripData = {
      id: tripToEdit ? tripToEdit.id : `trip-${Date.now()}`,
      destination: destination.trim(),
      title: title.trim() || destination.trim(),
      startDate,
      endDate,
      coverImage: coverImage.trim() || SCENIC_PRESETS[0].url,
      budget: Number(budget) || 0,
      currency,
      notes: notes.trim(),
      itinerary: tripToEdit?.itinerary || [],
      expenses: tripToEdit?.expenses || [],
      tags: tripToEdit?.tags || ['Travel'],
    };

    onSave(tripData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-rose-400 flex items-center space-x-1 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Modify Itinerary' : 'Begin an Adventure'}</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {isEditing ? 'Edit Trip Details' : 'Create New Trip'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Destination & Custom Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Destination <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Kyoto, Japan or Amalfi Coast"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.destination 
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200' 
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {errors.destination && (
                <p className="text-xs text-rose-500 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.destination}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Trip Headline / Title
              </label>
              <input
                type="text"
                placeholder="e.g. 3 Days in Kyoto, Fall Roadtrip"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>

          {/* Dates Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.startDate
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {errors.startDate && (
                <p className="text-xs text-rose-500 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.startDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                End Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.endDate
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              {errors.endDate && (
                <p className="text-xs text-rose-500 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* Budget Limit & Currency */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Total Budget Limit <span className="text-rose-500">*</span>
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="0"
                  step="50"
                  placeholder="2000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.budget
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
              </div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:border-indigo-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
            {errors.budget && (
              <p className="text-xs text-rose-500 mt-1 flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                {errors.budget}
              </p>
            )}
          </div>

          {/* Scenic Presets Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Scenic Presets (Pick a cover)
              </label>
              <span className="text-xs text-slate-400">Click to choose image</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SCENIC_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id || coverImage === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`group relative h-20 rounded-2xl overflow-hidden text-left border-2 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-rose-500 ring-2 ring-rose-200 scale-98 shadow-sm'
                        : 'border-transparent hover:border-slate-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset.thumb}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                    
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white shadow">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}

                    <div className="absolute bottom-1.5 left-2 right-2">
                      <p className="text-white text-xs font-bold truncate drop-shadow-sm">{preset.name.split(',')[0]}</p>
                      <p className="text-slate-200 text-[10px] truncate">{preset.tag}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Cover Image URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Or Custom Cover Image URL
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={coverImage}
                onChange={(e) => {
                  setCoverImage(e.target.value);
                  setSelectedPresetId(null);
                }}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Travel Notes & Ideas (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Packing reminders, passport details, recommended restaurants..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 shadow-md shadow-rose-500/25 transition-all cursor-pointer"
            >
              {isEditing ? 'Save Changes' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
