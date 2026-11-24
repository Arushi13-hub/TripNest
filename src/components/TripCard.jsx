import React from 'react';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin, 
  Edit3, 
  Trash2, 
  ChevronRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { calculateDuration, formatDateRange, formatCurrency, getTripStatus } from '../utils/dateUtils';

export default function TripCard({ trip, onEdit, onDelete, onViewDetails }) {
  const duration = calculateDuration(trip.startDate, trip.endDate);
  const dateFormatted = formatDateRange(trip.startDate, trip.endDate);
  const status = getTripStatus(trip.startDate, trip.endDate);

  // Total expenses and activity costs calculation
  const totalActivityCosts = (trip.itinerary || [])
    .flatMap((d) => d.activities || [])
    .reduce((sum, act) => sum + Number(act.cost || 0), 0);
  const totalExpenses = (trip.expenses || []).reduce((sum, item) => sum + Number(item.amount || 0), 0) + totalActivityCosts;
  const budgetLimit = Number(trip.budget || 0);
  const budgetPercent = budgetLimit > 0 ? Math.min(100, Math.round((totalExpenses / budgetLimit) * 100)) : 0;

  // Itinerary items count
  const allActivities = (trip.itinerary || []).flatMap((day) => day.activities || []);
  const completedCount = allActivities.filter((a) => a.completed).length;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
      {/* Top Cover Image Area */}
      <div 
        onClick={() => onViewDetails(trip)} 
        className="relative h-56 sm:h-60 w-full overflow-hidden cursor-pointer"
      >
        <img
          src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
          alt={trip.destination}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-black/40 text-white border border-white/20 shadow-sm">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-300" />
            {duration}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md bg-white/90 text-slate-800 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
            {status}
          </span>
        </div>

        {/* Floating Quick Action Buttons on Image */}
        <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1.5">
          {/* Covered in card controls */}
        </div>

        {/* Bottom Destination overlay */}
        <div className="absolute bottom-3.5 left-4 right-4 text-white">
          <div className="flex items-center space-x-1.5 text-xs text-rose-300 font-semibold uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{trip.destination}</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-sm line-clamp-1">
            {trip.title || trip.destination}
          </h3>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Dates & Timeline */}
        <div className="space-y-3">
          <div className="flex items-center text-slate-600 text-sm">
            <Calendar className="w-4 h-4 mr-2 text-rose-500 shrink-0" />
            <span className="font-medium text-slate-700">{dateFormatted}</span>
          </div>

          {/* Budget Info */}
          <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 mr-0.5" />
                Budget Limit
              </span>
              <span className="font-bold text-slate-800 text-sm">
                {formatCurrency(budgetLimit, trip.currency)}
              </span>
            </div>

            {totalExpenses > 0 && (
              <div>
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Spent: <strong className="text-slate-700">{formatCurrency(totalExpenses, trip.currency)}</strong></span>
                  <span>{budgetPercent}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      budgetPercent > 90 ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, budgetPercent)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Itinerary Progress Preview if items exist */}
          {allActivities.length > 0 && (
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Activities: {completedCount}/{allActivities.length} completed</span>
              </span>
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit(trip)}
              title="Edit trip details"
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(trip.id)}
              title="Delete trip"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => onViewDetails(trip)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <span>View Itinerary</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
