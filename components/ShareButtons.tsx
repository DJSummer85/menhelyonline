"use client";

import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { Animal } from "@/data/animals";

interface ShareButtonsProps {
  animal: Animal;
  compact?: boolean;
}

export default function ShareButtons({ animal, compact = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/animals/${animal.id}`;
    }
    return `/animals/${animal.id}`;
  };

  const getText = () => {
    return `${animal.name} (${animal.breed || animal.species}) — ${animal.shelter}. Fogadj örökbe! 🐾`;
  };

  const shareFacebook = () => {
    const url = encodeURIComponent(getUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "width=600,height=400");
  };

  const shareMessenger = () => {
    const url = encodeURIComponent(getUrl());
    window.open(`https://www.facebook.com/dialog/send?link=${url}&app_id=0&redirect_uri=${url}`, "_blank", "width=600,height=400");
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${getText()} ${getUrl()}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={shareFacebook}
          className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all duration-200 btn-press"
          title="Megosztás Facebookon"
        >
          <span className="text-sm font-bold">f</span>
        </button>
        <button
          type="button"
          onClick={shareWhatsApp}
          className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-500 flex items-center justify-center hover:bg-green-100 dark:hover:bg-green-500/20 transition-all duration-200 btn-press"
          title="Megosztás WhatsAppon"
        >
          <span className="text-sm">💬</span>
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-500/10 text-gray-500 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-500/20 transition-all duration-200 btn-press"
          title="Link másolása"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400 dark:text-gray-500 font-medium flex items-center gap-1">
        <Share2 size={12} />
        Megosztás:
      </span>
      <button
        type="button"
        onClick={shareFacebook}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all duration-200 btn-press"
      >
        <span className="text-sm">📘</span> Facebook
      </button>
      <button
        type="button"
        onClick={shareMessenger}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-500 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all duration-200 btn-press"
      >
        <span className="text-sm">💬</span> Messenger
      </button>
      <button
        type="button"
        onClick={shareWhatsApp}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold hover:bg-green-100 dark:hover:bg-green-500/20 transition-all duration-200 btn-press"
      >
        <span className="text-sm">📱</span> WhatsApp
      </button>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-500/20 transition-all duration-200 btn-press"
      >
        {copied ? <><Check size={12} className="text-green-500" /> Másolva!</> : <><Copy size={12} /> Link</>}
      </button>
    </div>
  );
}
