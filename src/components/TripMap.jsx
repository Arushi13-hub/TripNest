import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CATEGORY_MAP } from '../data/categories';
import { MapPin, Navigation, Compass } from 'lucide-react';

export default function TripMap({ 
  activities = [], 
  focusedActivityId = null, 
  onSelectActivity = null,
  destinationName = '' 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default center (Kyoto or fallback)
    const initialCenter = [35.0116, 135.7681];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    mapInstanceRef.current = map;

    // Resize observer to ensure tiles render seamlessly in flex/split containers
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when activities change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const validActivities = activities.filter(
      (act) => act.lat != null && act.lng != null && !isNaN(act.lat) && !isNaN(act.lng)
    );

    if (validActivities.length === 0) return;

    const bounds = L.latLngBounds();

    validActivities.forEach((act, idx) => {
      const orderNumber = idx + 1;
      const catConfig = CATEGORY_MAP[act.category] || CATEGORY_MAP.Sightseeing;
      const markerBg = catConfig.barColor || '#e11d48';

      // Custom numbered HTML Pin
      const customIcon = L.divIcon({
        className: 'custom-trip-marker',
        html: `
          <div style="
            background: ${markerBg};
            color: #ffffff;
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.35);
            border: 2px solid #ffffff;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            <span style="
              transform: rotate(45deg);
              font-size: 13px;
              font-weight: 800;
              font-family: system-ui, sans-serif;
            ">${orderNumber}</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([act.lat, act.lng], { icon: customIcon }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; min-width: 170px; padding: 2px;">
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
            <span style="
              background: ${markerBg};
              color: white;
              font-size: 10px;
              font-weight: bold;
              padding: 2px 6px;
              border-radius: 6px;
            ">#${orderNumber} ${act.category || 'Spot'}</span>
            <span style="font-size: 11px; color: #64748b; font-weight: 600;">${act.timeSlot || ''}</span>
          </div>
          <h4 style="font-size: 13px; font-weight: bold; color: #0f172a; margin: 0 0 3px 0; line-height: 1.25;">
            ${act.title}
          </h4>
          <p style="font-size: 11px; color: #475569; margin: 0 0 4px 0;">
            📍 ${act.location || ''}
          </p>
          ${act.cost > 0 ? `<p style="font-size: 11px; font-weight: bold; color: #059669; margin: 0;">Cost: $${act.cost}</p>` : ''}
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: false,
        className: 'trip-leaflet-popup',
      });

      marker.on('click', () => {
        if (onSelectActivity) {
          onSelectActivity(act.id);
        }
      });

      markersRef.current[act.id] = marker;
      bounds.extend([act.lat, act.lng]);
    });

    // Auto-fit bounds if we have coordinates
    if (validActivities.length > 0 && !focusedActivityId) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [activities, onSelectActivity]);

  // Sync and pan smoothly when focusedActivityId changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !focusedActivityId) return;

    const targetActivity = activities.find((a) => a.id === focusedActivityId);
    const marker = markersRef.current[focusedActivityId];

    if (targetActivity && targetActivity.lat != null && targetActivity.lng != null) {
      map.flyTo([targetActivity.lat, targetActivity.lng], 15, {
        animate: true,
        duration: 1.0,
      });

      if (marker) {
        marker.openPopup();
      }
    }
  }, [focusedActivityId, activities]);

  const validPinsCount = activities.filter((a) => a.lat != null && a.lng != null).length;

  return (
    <div className="relative w-full h-full min-h-[350px] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/90 shadow-inner">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Floating Top Badge */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-xs font-bold text-slate-800 flex items-center space-x-1.5">
          <Navigation className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
          <span>Interactive Route Map</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-600 font-extrabold ml-1">
            {validPinsCount} {validPinsCount === 1 ? 'Pin' : 'Pins'}
          </span>
        </div>
      </div>

      {/* Floating Instructions if no pins */}
      {validPinsCount === 0 && (
        <div className="absolute bottom-4 inset-x-4 z-10 pointer-events-none">
          <div className="bg-slate-900/80 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl text-xs text-center shadow-lg mx-auto max-w-xs">
            Add locations to your schedule to see numbered route pins plotted automatically.
          </div>
        </div>
      )}
    </div>
  );
}
