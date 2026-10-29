"use client";

import React, { useEffect, useRef } from "react";
import { VerifiedPlace, NeighborhoodScore } from "@/types";

interface MapViewProps {
  centerLat: number;
  centerLng: number;
  places: VerifiedPlace[];
  neighborhoods?: NeighborhoodScore[];
  selectedPlaceId?: string;
  onSelectPlace?: (place: VerifiedPlace) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  centerLat,
  centerLng,
  places,
  neighborhoods = [],
  selectedPlaceId,
  onSelectPlace
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Dynamically import Leaflet in browser only
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        // Initialize map
        const map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom: 13,
          attributionControl: true
        });

        // OpenStreetMap Tile Layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);

        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear old markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Custom marker icon helper
      const createCustomIcon = (color: string, label: string) => {
        return L.divIcon({
          className: "custom-map-pin",
          html: `
            <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
              ${label}
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
      };

      // Add Campus Anchor Pin
      const campusMarker = L.marker([centerLat, centerLng], {
        icon: createCustomIcon("#6366f1", "TU")
      }).addTo(map);
      campusMarker.bindPopup(`
        <div style="color: #1e293b; font-family: sans-serif; font-size: 12px;">
          <strong style="color: #4f46e5;">TU Berlin Main Campus</strong><br/>
          Your academic anchor & base coordinates
        </div>
      `);
      markersRef.current.push(campusMarker);

      // Add Places Pins
      places.forEach((place) => {
        const marker = L.marker([place.lat, place.lng], {
          icon: createCustomIcon(
            place.category === "cafe" ? "#f59e0b" : place.category === "restaurant" ? "#ef4444" : place.category === "grocery" ? "#10b981" : "#8b5cf6",
            place.category[0].toUpperCase()
          )
        }).addTo(map);

        marker.bindPopup(`
          <div style="color: #1e293b; font-family: sans-serif; max-width: 220px; font-size: 12px;">
            <strong style="font-size: 13px;">${place.name}</strong><br/>
            <span style="color: #64748b;">${place.address || ""}</span><br/>
            <div style="margin-top: 4px; padding: 2px 6px; background: #e0e7ff; border-radius: 4px; color: #4338ca; font-weight: bold; font-size: 10px;">
              ${place.qloo_affinity_score}% Qloo Affinity • ${place.walking_time_mins} min walk
            </div>
          </div>
        `);

        if (onSelectPlace) {
          marker.on("click", () => onSelectPlace(place));
        }

        markersRef.current.push(marker);
      });
    });

    return () => {
      isMounted = false;
    };
  }, [centerLat, centerLng, places, onSelectPlace]);

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute top-3 right-3 z-10 glass-panel rounded-xl px-3 py-2 text-[11px] text-slate-300 border border-slate-700/80 shadow-lg flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Campus
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Cafe
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Restaurant
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Grocery
        </div>
      </div>
    </div>
  );
};
