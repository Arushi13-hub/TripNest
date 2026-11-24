import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Compass, 
  Utensils, 
  Palmtree, 
  Mountain, 
  Landmark, 
  DollarSign, 
  Layers, 
  RefreshCw, 
  PlusCircle, 
  Check, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { generateItinerary } from '../services/aiPlanner';

const VIBES = [
  {
    id: 'Culture & History',
    title: 'Culture & History',
    desc: 'Ancient shrines, UNESCO heritage, museums & artisan quarters',
    icon: Landmark,
    color: 'from-amber-500 to-rose-600',
    borderActive: 'border-rose-500 ring-2 ring-rose-200',
  },
  {
    id: 'Foodie',
    title: 'Foodie',
    desc: 'Bustling markets, street delicacies, tasting menus & local cafes',
    icon: Utensils,
    color: 'from-orange-500 to-amber-600',
    borderActive: 'border-orange-500 ring-2 ring-orange-200',
  },
  {
    id: 'Adventure',
    title: 'Adventure',
    desc: 'Mountain summit treks, bike routes, rapids & coastal tours',
    icon: Mountain,
    color: 'from-emerald-500 to-teal-600',
    borderActive: 'border-emerald-500 ring-2 ring-emerald-200',
  },
  {
    id: 'Relaxed',
    title: 'Relaxed',
    desc: 'Unhurried morning coffees, botanical gardens & thermal onsen baths',
    icon: Palmtree,
    color: 'from-sky-500 to-indigo-600',
    borderActive: 'border-sky-500 ring-2 ring-sky-200',
  },
];

const BUDGET_TIERS = [
  {
    id: 'Budget',
    label: 'Budget',
    symbol: '$',
    desc: 'Free sights, scenic walks, and local street stalls',
  },
  {
    id: 'Mid-Range',
    label: 'Mid-Range',
    symbol: '$$',
    desc: 'Quality sit-down bistros, admission tickets & comfortable transit',
  },
  {
    id: 'Luxury',
    label: 'Luxury',
    symbol: '$$$',
    desc: 'Private masterclasses, fine dining, private tours & premier comfort',
  },
];

export default function AIPlannerModal(props) {
  if (!props.isOpen || !props.trip) return null;
  return <AIPlannerModalContent {...props} />;
}

function AIPlannerModalContent({ 
  onClose, 
  trip, 
  daysCount, 
  onApplyItinerary 
}) {
  const [selectedVibe, setSelectedVibe] = useState('Culture & History');
  const [selectedBudget, setSelectedBudget] = useState('Mid-Range');
  const [strategy, setStrategy] = useState('replace'); // 'replace' | 'append'
  const [customPreferences, setCustomPreferences] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setGenerationStep('Analyzing destination & vibe preferences...');

    try {
      setTimeout(() => {
        setGenerationStep('Crafting day-by-day timeline & scheduling activities...');
      }, 700);

      const result = await generateItinerary({
        destination: trip.destination,
        daysCount: daysCount || 3,
        vibe: selectedVibe,
        budgetTier: selectedBudget,
        customPreferences,
      });

      setGenerationStep('Geocoding route landmarks & dropping map pins...');
      await new Promise((r) => setTimeout(r, 400));

      onApplyItinerary(result.days, strategy);
      onClose();
    } catch (err) {
      console.error('Failed to generate AI itinerary:', err);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-900/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-rose-500/25">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-300">
                AI Schedule Architect
              </span>
              <h3 className="text-xl font-black text-white">
                Auto-Plan Itinerary
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isGenerating}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleGenerate} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Target Destination & Days badge */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Destination Target
              </span>
              <h4 className="text-sm font-extrabold text-slate-800">
                {trip.destination}
              </h4>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Duration
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-700">
                {daysCount} Days
              </span>
            </div>
          </div>

          {/* 1. Travel Vibe Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. Choose Your Travel Vibe
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {VIBES.map((v) => {
                const isSelected = selectedVibe === v.id;
                const Icon = v.icon;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVibe(v.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start space-x-3 ${
                      isSelected
                        ? `${v.borderActive} bg-slate-50 shadow-xs`
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 truncate">{v.title}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-rose-600 stroke-[3]" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{v.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Budget Tier */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. Budget Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {BUDGET_TIERS.map((tier) => {
                const isSelected = selectedBudget === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedBudget(tier.id)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200 text-indigo-950 font-bold shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div className="text-sm font-extrabold text-slate-900 mb-0.5">
                      {tier.symbol} {tier.label}
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {tier.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Merge or Replace Mode */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              3. Itinerary Application Mode
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setStrategy('replace')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start space-x-2.5 ${
                  strategy === 'replace'
                    ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-200 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <RefreshCw className={`w-4 h-4 mt-0.5 shrink-0 ${strategy === 'replace' ? 'text-rose-600' : 'text-slate-400'}`} />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Replace Itinerary</span>
                  <span className="text-[10px] text-slate-500 font-normal">Overwrites current activities with a fresh clean schedule</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setStrategy('append')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start space-x-2.5 ${
                  strategy === 'append'
                    ? 'border-rose-500 bg-rose-50/30 ring-2 ring-rose-200 font-bold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                <PlusCircle className={`w-4 h-4 mt-0.5 shrink-0 ${strategy === 'append' ? 'text-rose-600' : 'text-slate-400'}`} />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Append to Trip</span>
                  <span className="text-[10px] text-slate-500 font-normal">Preserves existing plans and adds new recommendations</span>
                </div>
              </button>
            </div>
          </div>

          {/* Special Preferences (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Specific Highlights or Interests (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Include tea gardens, avoid early mornings, photography spots..."
              value={customPreferences}
              onChange={(e) => setCustomPreferences(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          {/* Loading status notification */}
          {isGenerating && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3.5 flex items-center space-x-3 text-indigo-900 animate-pulse">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600 shrink-0" />
              <div className="text-xs">
                <span className="font-extrabold block">AI Curator at Work</span>
                <span className="text-indigo-700">{generationStep}</span>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-rose-600 to-indigo-600 hover:from-amber-400 hover:via-rose-500 hover:to-indigo-500 shadow-md shadow-rose-500/25 transition-all cursor-pointer disabled:opacity-75 inline-flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Schedule...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Itinerary</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
