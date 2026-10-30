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
        icon: createCustomIcon("#6366f1", "🎓")
      }).addTo(map);
      campusMarker.bindPopup(`
        <div style="color: #1e293b; font-family: sans-serif; font-size: 12px;">
          <strong style="color: #4f46e5; font-size: 13px;">Campus Hub & Anchor Point</strong><br/>
          <span style="color: #64748b;">Your academic base coordinates</span>
        </div>
      `);
      markersRef.current.push(campusMarker);

      // Category color mapping
      const getMarkerColor = (cat: string) => {
        switch (cat) {
          case "cafe": return "#f59e0b"; // amber
          case "restaurant": return "#ef4444"; // red
          case "library": return "#0ea5e9"; // sky blue
          case "cinema": return "#ec4899"; // pink
          case "venue": return "#a855f7"; // purple
          case "gaming": return "#8b5cf6"; // violet
          case "grocery": return "#10b981"; // emerald
          default: return "#6366f1"; // indigo
        }
      };

      const getMarkerLetter = (cat: string) => {
        switch (cat) {
          case "cafe": return "☕";
          case "restaurant": return "🍽️";
          case "library": return "📚";
          case "cinema": return "🎬";
          case "venue": return "🎵";
          case "gaming": return "🎮";
          case "grocery": return "🛒";
          default: return "📍";
        }
      };

      // Add Places Pins
      places.forEach((place) => {
        const isSelected = selectedPlaceId === place.id;
        const color = getMarkerColor(place.category);
        const marker = L.marker([place.lat, place.lng], {
          icon: createCustomIcon(
            color,
            getMarkerLetter(place.category)
          )
        }).addTo(map);

        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name}, ${place.address || ""}`)}`;

        marker.bindPopup(`
          <div style="color: #1e293b; font-family: sans-serif; max-width: 250px; font-size: 12px; line-height: 1.4;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <strong style="font-size: 13px; color: #0f172a;">${place.name}</strong>
              <span style="background: ${color}; color: white; padding: 1px 6px; border-radius: 9999px; font-size: 9px; font-weight: bold; text-transform: uppercase;">
                ${place.category}
              </span>
            </div>
            <div style="color: #64748b; font-size: 11px; margin-top: 2px;">${place.address || ""}</div>
            <div style="margin-top: 6px; padding: 4px 8px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; color: #166534; font-weight: bold; font-size: 10px;">
              🎯 ${place.qloo_affinity_score}% Qloo Affinity • ${place.walking_time_mins} min walk (${place.distance_meters}m)
            </div>
            <div style="margin-top: 4px; font-size: 11px; color: #475569; font-style: italic;">
              ${place.why_it_fits}
            </div>
            <div style="margin-top: 8px; display: flex; gap: 6px;">
              <a href="${mapsUrl}" target="_blank" rel="noreferrer" style="display: inline-block; padding: 3px 8px; background: #e0e7ff; color: #4338ca; border-radius: 4px; text-decoration: none; font-size: 10px; font-weight: bold;">
                📍 Open in Google Maps ↗
              </a>
              ${place.website ? `<a href="${place.website}" target="_blank" rel="noreferrer" style="display: inline-block; padding: 3px 8px; background: #f1f5f9; color: #334155; border-radius: 4px; text-decoration: none; font-size: 10px; font-weight: bold;">🌐 Web ↗</a>` : ""}
            </div>
          </div>
        `);

        if (onSelectPlace) {
          marker.on("click", () => onSelectPlace(place));
        }

        markersRef.current.push(marker);
      });

      // Draw Path Polyline from campus anchor to selected place
      if (selectedPlaceId) {
        const targetPlace = places.find((p) => p.id === selectedPlaceId);
        if (targetPlace) {
          const latlngs: [number, number][] = [
            [centerLat, centerLng],
            // Midpoint waypoint with slight curve for natural walking trajectory
            [
              (centerLat + targetPlace.lat) / 2 + 0.0006,
              (centerLng + targetPlace.lng) / 2 - 0.0005
            ],
            [targetPlace.lat, targetPlace.lng]
          ];

          const polyline = L.polyline(latlngs, {
            color: "#e11d48", // Crimson vibrant line
            weight: 4,
            opacity: 0.9,
            dashArray: "6, 8",
            lineCap: "round"
          }).addTo(map);

          polyline.bindTooltip(`🚶 ${targetPlace.walking_time_mins} min walk (${targetPlace.distance_meters}m)`, {
            permanent: true,
            direction: "center",
            className: "path-walking-tooltip"
          });

          markersRef.current.push(polyline);

          // Fly smoothly to fit both campus and place
          const bounds = L.latLngBounds([[centerLat, centerLng], [targetPlace.lat, targetPlace.lng]]);
          map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [centerLat, centerLng, places, selectedPlaceId, onSelectPlace]);

  return (
    <div className="relative w-full h-[440px] sm:h-[500px] rounded-3xl overflow-hidden border border-[#2e3e38] shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute top-3 right-3 z-10 glass-panel rounded-2xl px-3.5 py-2 text-[11px] text-[#dedacb] border border-[#2e3e38] shadow-lg flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Campus
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Cafe
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Restro
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> Library
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block" /> Cinema
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" /> Music
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block" /> Game
        </div>
      </div>
    </div>
  );
};
