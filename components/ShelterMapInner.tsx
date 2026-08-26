"use client";

import { useEffect, useRef } from "react";
import { type Shelter } from "@/data/animals";

interface ShelterMapInnerProps {
  shelters: Shelter[];
  selectedShelter?: string | null;
  onSelectShelter?: (id: string) => void;
}

export default function ShelterMapInner({
  shelters,
  selectedShelter,
  onSelectShelter,
}: ShelterMapInnerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      // Load Leaflet CSS via link tag (avoids type declaration issues)
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const L = (await import("leaflet")).default;

      const map = L.map(mapRef.current!, {
        center: [47.1625, 19.5033],
        zoom: 7,
        scrollWheelZoom: true,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      // Fix default marker icon in Next.js
      const defaultIcon = L.icon({
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      // Add markers for each shelter
      shelters.forEach((shelter) => {
        const marker = L.marker([shelter.lat, shelter.lng], {
          icon: defaultIcon,
        }).addTo(map);

        const popupContent = `
          <div style="min-width: 220px; padding: 4px; font-family: system-ui, sans-serif;">
            <div style="font-weight: 700; font-size: 14px; color: #1f2937; margin-bottom: 4px;">
              ${shelter.name}
            </div>
            <p style="font-size: 12px; color: #6b7280; margin: 0 0 8px 0;">
              📍 ${shelter.location} (${shelter.county} megye)
            </p>
            <p style="font-size: 12px; color: #4b5563; margin: 0 0 8px 0; line-height: 1.5;">
              ${shelter.description}
            </p>
            <div style="font-size: 12px; color: #F97316; font-weight: 700; margin-bottom: 8px;">
              🐾 ${shelter.animalCount} állat vár örökbefogadásra
            </div>
            <div style="font-size: 11px; color: #6b7280; border-top: 1px solid #f3f4f6; padding-top: 8px; display: flex; flex-direction: column; gap: 2px;">
              <span>📞 ${shelter.phone}</span>
              <span>✉️ ${shelter.email}</span>
              ${
                shelter.website
                  ? `<a href="${shelter.website}" target="_blank" rel="noreferrer" style="color: #F97316; text-decoration: none;">🌐 Weboldal</a>`
                  : ""
              }
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on("click", () => {
          onSelectShelter?.(shelter.id);
        });

        markersRef.current.set(shelter.id, marker);
      });

      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current.clear();
      }
    };
  }, []); // Only run once on mount

  // Fly to selected shelter
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedShelter) return;

    const shelter = shelters.find((s) => s.id === selectedShelter);
    if (shelter) {
      map.flyTo([shelter.lat, shelter.lng], 12, {
        duration: 1.5,
      });

      const marker = markersRef.current.get(shelter.id);
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedShelter, shelters]);

  return (
    <div className="relative rounded-2xl overflow-hidden card-shadow border border-gray-100 dark:border-gray-700">
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "450px",
          background: "#e5e7eb",
        }}
      />

      {/* Map legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-lg px-3 py-2 text-xs text-gray-600 dark:text-gray-300 shadow-md">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-brand-500 border border-white shadow" />
          <span>Menhely</span>
        </div>
      </div>
    </div>
  );
}
