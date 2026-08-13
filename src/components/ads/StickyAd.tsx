"use client";

import { useEffect, useRef, useState } from "react";
import { translate } from "@/lib/translate";

const ADVERTISEMENT = translate("common.advertisement");

interface StickyAdProps {
  position: "sidebar-sticky" | "sticky-footer";
  className?: string;
}

interface ResolvedAd {
  _id: string;
  name: string;
  code: string;
  templateType?: string;
  mediaUrl?: string;
  clickThroughUrl?: string;
  appearance?: {
    showLabel?: boolean;
    labelText?: string;
    backgroundColor?: string;
    borderRadius?: number;
  };
  [key: string]: any;
}

export default function StickyAd({ position, className = "" }: StickyAdProps) {
  const [ad, setAd] = useState<ResolvedAd | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pageType = position === "sticky-footer" ? "article" : "article";
    const fetchAd = async () => {
      try {
        const res = await fetch(`/api/ads/resolve?pageType=${pageType}&position=${position}`);
        if (res.ok) {
          const data = await res.json();
          if (data.ad) setAd(data.ad);
        }
      } catch {}
    };
    fetchAd();
  }, [position]);

  if (!ad) return null;

  const appearance = ad.appearance || {};

  if (position === "sidebar-sticky") {
    return (
      <div
        ref={containerRef}
        className={`sticky-ad-sidebar ${className}`}
        data-ad-position={position}
        data-ad-id={ad._id}
      >
        {appearance.showLabel !== false && (
          <div className="ad-label text-[11px] text-gray-400 uppercase tracking-wider mb-1 text-center">
            {appearance.labelText || ADVERTISEMENT}
          </div>
        )}
        <div
          className="overflow-hidden mx-auto"
          style={{
            border: appearance.backgroundColor && appearance.backgroundColor !== "transparent"
              ? "none"
              : "1px solid #e5e5e5",
            backgroundColor: appearance.backgroundColor || "transparent",
            borderRadius: appearance.borderRadius || 8,
          }}
        >
          {ad.clickThroughUrl ? (
            <a href={ad.clickThroughUrl} target="_blank" rel="noopener noreferrer sponsored" className="block">
              <StickyContent ad={ad} />
            </a>
          ) : (
            <StickyContent ad={ad} />
          )}
        </div>
      </div>
    );
  }

  // sticky-footer
  return (
    <div
      className={`sticky-ad-footer fixed bottom-0 left-0 right-0 z-[999] bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.08)] ${className}`}
      data-ad-position={position}
      data-ad-id={ad._id}
    >
      <div className="max-w-[728px] mx-auto py-2 px-4 text-center">
        {appearance.showLabel !== false && (
          <div className="ad-label text-[10px] text-gray-400 uppercase tracking-wider mb-1">
            {appearance.labelText || ADVERTISEMENT}
          </div>
        )}
        {ad.clickThroughUrl ? (
          <a href={ad.clickThroughUrl} target="_blank" rel="noopener noreferrer sponsored" className="block">
            <StickyContent ad={ad} />
          </a>
        ) : (
          <StickyContent ad={ad} />
        )}
      </div>
    </div>
  );
}

function StickyContent({ ad }: { ad: ResolvedAd }) {
  if (ad.templateType === "programmatic" && ad.code) {
    return <div dangerouslySetInnerHTML={{ __html: ad.code }} />;
  }

  if (ad.mediaUrl) {
    return (
      <img
        src={ad.mediaUrl}
        alt={ad.name}
        className="max-w-full h-auto mx-auto"
        style={{ maxHeight: 90 }}
        loading="lazy"
      />
    );
  }

  if (ad.code) {
    return <div dangerouslySetInnerHTML={{ __html: ad.code }} />;
  }

  return null;
}
