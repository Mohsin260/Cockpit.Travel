"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { translate } from "@/lib/translate";

const ADVERTISEMENT = translate("common.advertisement");

const isVideoUrl = (url?: string) => {
  if (!url) return false;
  const cleanUrl = url.split("?")[0].toLowerCase();
  return cleanUrl.endsWith(".mp4") || cleanUrl.endsWith(".webm") || cleanUrl.endsWith(".mov") || cleanUrl.endsWith(".m4v");
};

const loadScript = (src: string): Promise<void> =>
  new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.head.appendChild(s);
  });

interface FeaturedImageProps {
  src: string;
  poster?: string;
  alt: string;
  vastTagUrl?: string;
}

export default function FeaturedImage({ src, poster, alt, vastTagUrl }: FeaturedImageProps) {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [vastReady, setVastReady] = useState(false);

  if (!src) return null;

  if (!isVideoUrl(src)) {
    return (
      <div className="mb-[24px] rounded-[6px] overflow-hidden">
        <img src={src} alt={alt} className="w-full h-150 object-cover" />
      </div>
    );
  }

  const hasVast = !!vastTagUrl && vastTagUrl.trim() !== "";

  if (!hasVast) {
    return (
      <div className="mb-[24px] rounded-[6px] overflow-hidden">
        <video src={src} poster={poster} controls className="w-full h-auto max-h-[500px] object-cover" />
      </div>
    );
  }

  return (
    <div className="mb-[24px] rounded-[6px] overflow-hidden">
      <VastVideoPlayer src={src} poster={poster} vastTagUrl={vastTagUrl!} />
    </div>
  );
}

function VastVideoPlayer({ src, poster, vastTagUrl }: { src: string; poster?: string; vastTagUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    // Prevent duplicate players from React Strict Mode double-mount
    if (containerRef.current && containerRef.current.querySelector('.video-js')) {
      return;
    }

    const ensurePlugins = async () => {
      const vjsExists = !!(window as any).videojs;
      const imaExists = vjsExists && !!(
        (window as any).videojs.prototype?.ima ||
        (window as any).videojs.ima ||
        (window as any).videojs.getPlugin?.("ima")
      );

      if (!imaExists) {
        const baseScripts: Promise<void>[] = [];
        if (!vjsExists) {
          if (!document.querySelector('link[href*="video-js.css"]')) {
            const l = document.createElement("link");
            l.rel = "stylesheet";
            l.href = "https://vjs.zencdn.net/8.10.0/video-js.css";
            document.head.appendChild(l);
          }
          baseScripts.push(loadScript("https://vjs.zencdn.net/8.10.0/video.min.js"));
        }
        baseScripts.push(loadScript("https://imasdk.googleapis.com/js/sdkloader/ima3.js"));
        await Promise.all(baseScripts);
        await Promise.all([
          loadScript("https://unpkg.com/videojs-contrib-ads@6/dist/videojs.ads.min.js"),
          loadScript("https://unpkg.com/videojs-ima@1/dist/videojs.ima.min.js"),
        ]);
      }

      if (cancelledRef.current) return;

      let checkCount = 0;
      const waitForPlugins = (): Promise<boolean> =>
        new Promise((resolve) => {
          const check = () => {
            if (cancelledRef.current) { resolve(false); return; }
            const vjs = (window as any).videojs;
            checkCount++;
            if (checkCount > 100) { resolve(!!vjs); return; }
            if (vjs) {
              const hasIma = vjs.prototype?.ima || vjs.ima || vjs.getPlugin?.("ima");
              if (!hasIma) { setTimeout(check, 50); return; }
              resolve(true);
            } else {
              setTimeout(check, 50);
            }
          };
          check();
        });

      return waitForPlugins();
    };

    const initPlayer = async () => {
      const ready = await ensurePlugins();
      if (cancelledRef.current || !ready || !containerRef.current) return;

      const videojs = (window as any).videojs;
      const targetId = `hero-vast-player-${Date.now()}`;

      const wrapper = document.createElement("div");
      wrapper.innerHTML = `
        <div id="hero-vast-wrapper-${targetId}" style="width:100%; position:relative; overflow:hidden; background:#000; border-radius:6px; aspect-ratio:16/9;">
          <video id="${targetId}" class="video-js vjs-big-play-centered" style="width:100%; height:100%; display:block;" playsinline webkit-playsinline="true" poster="${poster || ""}"></video>
        </div>
        <style>
          /* Hero VAST player — force fixed aspect ratio, no fluid expansion */
          #hero-vast-wrapper-${targetId} .video-js {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }
          #hero-vast-wrapper-${targetId} .video-js .vjs-tech {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }
          /* IMA Ad Container — fill the entire player area */
          #hero-vast-wrapper-${targetId} .ima-ad-container,
          #hero-vast-wrapper-${targetId} [class*="ima-ad-container"] {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            z-index: 10000 !important;
            pointer-events: auto !important;
            display: block !important;
          }
          /* IMA ad video element — cover mode */
          #hero-vast-wrapper-${targetId} .ima-ad-container video,
          #hero-vast-wrapper-${targetId} [class*="ima-ad-container"] video {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-width: 100% !important;
            max-height: 100% !important;
            object-fit: cover !important;
            pointer-events: none !important;
          }
          /* IMA skip button */
          #hero-vast-wrapper-${targetId} .ima-skip-button,
          #hero-vast-wrapper-${targetId} [class*="ima"] [class*="skip"] {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            z-index: 10002 !important;
            pointer-events: auto !important;
          }
          /* IMA controls */
          #hero-vast-wrapper-${targetId} [class*="ima"] [class*="controls"],
          #hero-vast-wrapper-${targetId} [class*="ima"] [class*="ui"] {
            pointer-events: auto !important;
            z-index: 10001 !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          /* IMA countdown and ad label */
          #hero-vast-wrapper-${targetId} [class*="ima"] [class*="countdown"],
          #hero-vast-wrapper-${targetId} [class*="ima"] [class*="ad-label"] {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            z-index: 10002 !important;
          }
          /* Video.js controls bar */
          #hero-vast-wrapper-${targetId} .vjs-control-bar {
            display: flex !important;
            opacity: 1 !important;
            visibility: visible !important;
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            z-index: 10001 !important;
          }
          #hero-vast-wrapper-${targetId} .vjs-fullscreen-control {
            display: none !important;
          }
          #hero-vast-wrapper-${targetId} video {
            pointer-events: none !important;
          }
        </style>`;
      containerRef.current.appendChild(wrapper);

      try {
        const existing = videojs.getPlayer?.(targetId);
        if (existing && typeof existing.dispose === "function") existing.dispose();
      } catch (e) {}

      await new Promise((r) => setTimeout(r, 100));
      if (cancelledRef.current) return;

      const el = document.getElementById(targetId);
      if (!el) return;

      const player = videojs(targetId, {
        autoplay: "muted",
        muted: true,
        controls: true,
        preload: "none",
        fluid: false,
        responsive: false,
        nativeControlsForTouch: false,
        fill: true,
      });
      playerRef.current = player;

      if (poster) {
        player.poster(poster);
      }

      if (typeof player.ima === "function") {
        try {
          let resolvedUrl = vastTagUrl;
          try {
            const ipRes = await fetch("/api/visitor-ip", { cache: "no-store" });
            const ipData = await ipRes.json();
            const ip = ipData?.ip || "";
            if (ip) {
              const { buildVisitorData, buildSspRequestUrl } = await import("@/lib/ads/buildVastUrl");
              const vw = containerRef.current?.clientWidth || 1280;
              const vh = Math.round(vw * 9 / 16);
              const visitorData = buildVisitorData(ip, vw, vh);
              const resolved = buildSspRequestUrl(vastTagUrl, visitorData);
              if (resolved) {
                resolvedUrl = resolved;
                if (!resolvedUrl.includes("cb=") && !resolvedUrl.includes("cachebuster=")) {
                  resolvedUrl += (resolvedUrl.includes("?") ? "&" : "?") + "cb=" + Date.now();
                }
              }
            }
          } catch (e) {}

          player.ima({
            id: targetId,
            adTagUrl: resolvedUrl,
            vpaidMode: (window as any).google?.ima?.ImaSdkSettings?.VpaidMode?.INSECURE || 2,
            debug: false,
            disableCustomPlaybackForIOS10Plus: false,
            nativeControlsForTouch: false,
            autoComputeAdSize: true,
            showCountdown: true,
            showControlsForJSAds: true,
            adLabel: ADVERTISEMENT,
            adsRenderingSettings: {
              restoreCustomPlaybackStateOnAdBreakComplete: true,
              enablePreloading: true,
              useStyledLinearAds: true,
              useStyledNonLinearAds: true,
            },
          });

          player.src({ src, type: getVideoMime(src) });
          player.load();

          player.ready(() => {
            if (cancelledRef.current) return;
            setTimeout(() => {
              if (cancelledRef.current) return;
              try {
                const playPromise = player.play();
                if (playPromise !== undefined) {
                  playPromise.catch(() => {});
                }
              } catch (e) {}
            }, 50);
          });
        } catch (e) {}
      }
    };

    initPlayer();

    return () => {
      cancelledRef.current = true;
      if (playerRef.current) {
        try { playerRef.current.dispose(); } catch (e) {}
        playerRef.current = null;
      }
      // Clear all child nodes to prevent duplicate players on re-mount (React Strict Mode)
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [src, poster, vastTagUrl]);

  return <div ref={containerRef} className="w-full" />;
}

function getVideoMime(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() || "";
  const mimes: Record<string, string> = {
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    m4v: "video/mp4",
  };
  return mimes[ext] || "video/mp4";
}
