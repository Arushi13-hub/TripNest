import React from 'react';
import { Compass, Calendar, Clock, DollarSign, MapPin, CheckSquare } from 'lucide-react';
import { formatDateRange, formatCurrency, calculateDuration } from '../utils/dateUtils';

export default function PrintItineraryView({ trip }) {
  if (!trip) return null;

  const duration = calculateDuration(trip.startDate, trip.endDate);
  const dateFormatted = formatDateRange(trip.startDate, trip.endDate);
  const itinerary = trip.itinerary || [];
  const packingList = trip.packingList || [];

  const totalCost = itinerary.reduce((sum, d) => 
    sum + (d.activities || []).reduce((s, a) => s + Number(a.cost || 0), 0)
  , 0) + (trip.expenses || []).reduce((s, e) => s + Number(e.amount || 0), 0);

  return (
    <div className="print-dossier">
      {/* Print Document Header */}
      <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2 text-rose-600 font-extrabold text-lg mb-1">
            <span>TripNest Itinerary Dossier</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">
            {trip.title || trip.destination}
          </h1>
          <p className="text-sm text-slate-600 flex items-center gap-4 mt-1 font-medium">
            <span>📍 {trip.destination}</span>
            <span>📅 {dateFormatted}</span>
            <span>⏱️ {duration}</span>
          </p>
        </div>

        <div className="text-right border-l pl-4 border-slate-200">
          <p className="text-xs uppercase font-bold text-slate-500">Budget Plan</p>
          <p className="text-xl font-black text-slate-900">{formatCurrency(trip.budget, trip.currency)}</p>
          <p className="text-xs text-slate-600">Estimated Total: {formatCurrency(totalCost, trip.currency)}</p>
        </div>
      </div>

      {/* Trip Notes if any */}
      {trip.notes && (
        <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl avoid-break">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Trip Notes & Guidance</h3>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{trip.notes}</p>
        </div>
      )}

      {/* Day by Day Schedule */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-slate-900 border-b pb-2">Day-by-Day Schedule</h2>
        
        {itinerary.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No schedule activities recorded.</p>
        ) : (
          itinerary.map((dayGroup) => (
            <div key={dayGroup.day} className="avoid-break mb-6">
              <div className="bg-slate-100 p-2.5 rounded-lg font-bold text-sm text-slate-900 mb-2 flex justify-between items-center">
                <span>Day {dayGroup.day}: {dayGroup.title || 'Itinerary'}</span>
                <span className="text-xs font-semibold text-slate-500">{(dayGroup.activities || []).length} activities</span>
              </div>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold">
                    <th className="py-2 w-20">Time</th>
                    <th className="py-2 w-24">Category</th>
                    <th className="py-2">Activity & Location</th>
                    <th className="py-2 w-20 text-right">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {(dayGroup.activities || []).map((act, idx) => (
                    <tr key={act.id || idx} className="border-b border-slate-100 py-2">
                      <td className="py-2 font-bold text-slate-700 align-top">{act.timeSlot}</td>
                      <td className="py-2 text-slate-600 align-top font-medium">{act.category}</td>
                      <td className="py-2 align-top">
                        <div className="font-bold text-slate-900">{act.title}</div>
                        {act.location && <div className="text-slate-500 text-[11px]">📍 {act.location}</div>}
                        {act.notes && <div className="text-slate-600 text-[11px] italic mt-0.5">{act.notes}</div>}
                      </td>
                      <td className="py-2 text-right font-bold text-slate-800 align-top">
                        {act.cost > 0 ? formatCurrency(act.cost, trip.currency) : 'Free'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>

      {/* Packing Checklist Summary */}
      {packingList.length > 0 && (
        <div className="mt-8 pt-6 border-t avoid-break">
          <h2 className="text-xl font-black text-slate-900 mb-3 flex items-center justify-between">
            <span>Packing Checklist</span>
            <span className="text-xs font-semibold text-slate-500">
              {packingList.filter(i => i.packed).length} / {packingList.length} packed
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {packingList.map((item) => (
              <div key={item.id} className="flex items-center space-x-2 py-1">
                <span className="w-3.5 h-3.5 border border-slate-400 rounded inline-block text-center text-[10px] leading-3 font-bold">
                  {item.packed ? '✓' : ''}
                </span>
                <span className={item.packed ? 'text-slate-400 line-through' : 'text-slate-800'}>
                  {item.title} <span className="text-slate-400 text-[10px]">({item.category})</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-10 pt-4 border-t text-[10px] text-slate-400 flex justify-between">
        <span>Generated by TripNest · Your Journey, Curated</span>
        <span>Printed on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
    </div>
  );
}
