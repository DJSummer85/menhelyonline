"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { type Shelter } from "@/data/animals";

// Dynamically import the actual map component (no SSR)
const ShelterMapInner = dynamic(() => import("./ShelterMapInner"), {
  ssr: false,
  loading: () => (
    <div className="aspect-[21/9] bg-gradient-to-br from-sage-50 to-brand-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center card-shadow border border-gray-100 dark:border-gray-700">
      <div className="text-center">
        <div className="text-5xl mb-3 animate-pulse">🗺️</div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Térkép betöltése...
        </p>
      </div>
    </div>
  ),
});

interface ShelterMapProps {
  shelters: Shelter[];
  selectedShelter?: string | null;
  onSelectShelter?: (id: string) => void;
}

export default function ShelterMap({
  shelters,
  selectedShelter,
  onSelectShelter,
}: ShelterMapProps) {
  return (
    <ShelterMapInner
      shelters={shelters}
      selectedShelter={selectedShelter}
      onSelectShelter={onSelectShelter}
    />
  );
}
