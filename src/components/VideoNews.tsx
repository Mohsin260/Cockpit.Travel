"use client";

import Link from "next/link";
import { useEffect, useState, useRef, type ReactNode } from "react";
import InFeedNativeAd from "@/components/ads/InFeedNativeAd";
import SectionAudioButton from "@/components/ui/SectionAudioButton";
import { useTranslations } from "@/hooks/useTranslations";
import { translate } from "@/lib/translate";

interface Article {
  slug: string;
  title: string;
  category: string;
  categoryLabel: string;
  image?: string;
  author: string;
  authorName: string;
  views: number;
  date: string;
  videoUrl?: string;
  articleMedia?: {
    heroCoverMedia?: {
      url?: string;
      vastTagUrl?: string;
      poster?: string;
    };
  };
}

interface VideoNewsProps {
  articles: Article[];
}

const categoryColors: Record<string, string> = {
  hotels: "#e033e0",
  flights: "#0073ff",
  destinations: "#54bd05",
  traveling: "#f27100",
  "travel-intelligence": "#f27100",
};

function getHref(article: Article) {
  return `/posts/${article.slug}`;
}

function CategoryPill({ label, color }: { label: string; color: string }) {
  return (
    <span className="video-cat-pill" style={{ backgroundColor: color }}>
      {label}
    </span>
  );
}

const isVideoUrl = (url?: string) => {
  if (!url) return false;
  const cleanUrl = url.split("?")[0].toLowerCase();
  return cleanUrl.endsWith(".mp4") || cleanUrl.endsWith(".webm") || cleanUrl.endsWith(".mov") || cleanUrl.endsWith(".m4v");
};

function SideVideoRow({ post, color, isActive, onSelect }: { post: Article; color: string; isActive: boolean; onSelect: () => void }) {
  return (
    <div
      className={`flex items-center gap-[15px] cursor-pointer rounded-lg p-1 transition-all duration-200 ${isActive ? "bg-[var(--primaryColor)]/10 ring-1 ring-[var(--primaryColor)]/30" : "hover:bg-white/5"}`}
      onClick={onSelect}
    >
      <div className="block flex-shrink-0 w-[112px] min-w-[112px] h-[112px] rounded-lg overflow-hidden relative group">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <span className="fpg-play-btn">
          <i className="ri-play-fill" />
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <CategoryPill label={post.categoryLabel} color={color} />
        <h6 className="mt-1 text-[14px] font-semibold text-white leading-[1.4] line-clamp-2">
          <span className="text-white">{post.title}</span>
        </h6>
        <ul className="flex items-center gap-2 mt-1 text-[11px] text-white/60">
          <li>{post.authorName}</li>
          <li>{post.views} {translate("common.views")}</li>
        </ul>
      </div>
    </div>
  );
}

function useRandomAdIndex(count: number) {
  const [index, setIndex] = useState(() => count);
  useEffect(() => {
    if (count === 0) return;
    setIndex(Math.floor(Math.random() * (count + 1)));
  }, [count]);
  return index;
}

function VideoColumn({ posts, color, adPosition, adIndex, activeSlug, onSelect }: { posts: Article[]; color: string; adPosition: string; adIndex: number; activeSlug: string; onSelect: (article: Article) => void }) {
  const nodes: ReactNode[] = [];
  for (let i = 0; i < posts.length; i++) {
    if (i === adIndex) {
      nodes.push(<InFeedNativeAd key="travel-intel-ad" position={adPosition} cardStyle="travel-intel" />);
    }
    nodes.push(
      <SideVideoRow
        key={posts[i].slug}
        post={posts[i]}
        color={color}
        isActive={posts[i].slug === activeSlug}
        onSelect={() => onSelect(posts[i])}
      />
    );
  }
  if (posts.length === adIndex) {
    nodes.push(<InFeedNativeAd key="travel-intel-ad" position={adPosition} cardStyle="travel-intel" />);
  }
  return <>{nodes}</>;
}

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

function VastVideoPlayer({ src, poster, vastTagUrl, onReady }: { src: string; poster?: string; vastTagUrl: string; onReady?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

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
      const targetId = `video-news-player-${Date.now()}`;

      const wrapper = document.createElement("div");
      wrapper.innerHTML = `
        <div id="video-news-wrapper-${targetId}" style="width:100%; height:100%; position:absolute; top:0; left:0; overflow:hidden; background:#000; border-radius:6px;">
          <video id="${targetId}" class="video-js vjs-big-play-centered" style="width:100%; height:100%; display:block;" playsinline webkit-playsinline="true" poster="${poster || ""}"></video>
        </div>`;
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
        preload: "auto",
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
            adLabel: translate("common.advertisement"),
            adsRenderingSettings: {
              restoreCustomPlaybackStateOnAdBreakComplete: true,
              enablePreloading: true,
              useStyledLinearAds: true,
              useStyledNonLinearAds: true,
            },
          });

          const adContainer = player.el()?.querySelector(".ima-ad-container");
          if (adContainer) {
            adContainer.addEventListener("click", (e: Event) => {
              e.stopPropagation();
            }, true);
          }

          player.on("ima-ad-start", () => {
            const ac = player.el()?.querySelector(".ima-ad-container");
            if (ac && !ac.getAttribute("data-click-fixed")) {
              ac.setAttribute("data-click-fixed", "1");
              ac.addEventListener("click", (e: Event) => {
                e.stopPropagation();
              }, true);
            }
          });

          player.on("adend", () => {
            if (cancelledRef.current) return;
            const resume = () => {
              if (cancelledRef.current || !playerRef.current) return;
              try {
                const p = playerRef.current;
                if (p.ima && p.ima.isAdPlaying()) return;
                if (p.paused()) {
                  p.currentTime = p.currentTime;
                  p.play().catch(() => {});
                }
              } catch (e) {}
            };
            for (const delay of [0, 100, 300, 600]) {
              setTimeout(resume, delay);
            }
          });

          player.on("contentresumeended", () => {
            if (cancelledRef.current || !playerRef.current) return;
            try {
              const p = playerRef.current;
              if (p.paused()) {
                p.play().catch(() => {});
              }
            } catch (e) {}
          });

          player.on("ads-ad-ended", () => {
            if (cancelledRef.current || !playerRef.current) return;
            const resume = () => {
              try {
                const p = playerRef.current;
                if (p && p.paused()) {
                  p.play().catch(() => {});
                }
              } catch (e) {}
            };
            setTimeout(resume, 0);
            setTimeout(resume, 200);
          });

          player.on("adskip", () => {
            if (cancelledRef.current || !playerRef.current) return;
            const resume = () => {
              if (cancelledRef.current || !playerRef.current) return;
              try {
                const p = playerRef.current;
                if (p.paused()) {
                  p.play().catch(() => {});
                }
              } catch (e) {}
            };
            setTimeout(resume, 0);
            setTimeout(resume, 200);
            setTimeout(resume, 500);
          });

          const mimeMap: Record<string, string> = { mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime", m4v: "video/mp4" };
          const ext = src.split("?")[0].split(".").pop()?.toLowerCase() || "";
          player.src({ src, type: mimeMap[ext] || "video/mp4" });
          player.load();

          player.ready(() => {
            if (cancelledRef.current) return;
            onReady?.();
            setTimeout(() => {
              if (cancelledRef.current) return;
              try {
                const playPromise = player.play();
                if (playPromise !== undefined) {
                  playPromise.catch(() => {});
                }
              } catch (e) {}
            }, 0);
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
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [src, poster, vastTagUrl]);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" />;
}

export default function VideoNews({ articles }: VideoNewsProps) {
  const t = useTranslations();

  const featured = articles[0];
  const leftCards = articles.slice(1, 4);
  const rightCards = articles.slice(4, 7);
  const color = categoryColors[featured?.category || ""] || "#f27100";

  const [activeArticle, setActiveArticle] = useState<Article>(featured);
  const [playerStarted, setPlayerStarted] = useState(false);
  const leftAdIndex = useRandomAdIndex(leftCards.length);
  const rightAdIndex = useRandomAdIndex(rightCards.length);

  const handleSelect = (article: Article) => {
    setActiveArticle(article);
    setPlayerStarted(false);
  };

  const heroUrl = activeArticle.articleMedia?.heroCoverMedia?.url || "";
  const videoSrc = (activeArticle.videoUrl && isVideoUrl(activeArticle.videoUrl))
    ? activeArticle.videoUrl
    : (isVideoUrl(heroUrl) ? heroUrl : "");
  const hasVideoUrl = !!videoSrc;
  const vastTagUrl = activeArticle.articleMedia?.heroCoverMedia?.vastTagUrl || "";
  const posterImage = activeArticle.articleMedia?.heroCoverMedia?.poster || activeArticle.image;
  const hasVast = !!vastTagUrl && vastTagUrl.trim() !== "";

  if (articles.length === 0) return null;

  return (
    <section className="video-news-section py-[40px]">
      <div className="nerio-container">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <h2 className="text-[32px] font-bold text-[var(--titleColor)]">{t("sections.travelIntelligence")}</h2>
            <SectionAudioButton
              text={t("sections.travelIntelligence")}
              articles={articles.map(a => ({ title: a.title, authorName: a.authorName }))}
            />
          </div>
          <Link href="/category/travel-intelligence" className="group inline-flex items-center gap-2 text-[var(--titleColor)] font-semibold text-base no-underline relative">
            <span>{t("sections.viewChannel")}</span>
            <span className="inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 12" className="w-[18px] h-3 fill-current">
                <path fillRule="evenodd" clipRule="evenodd" d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z" />
              </svg>
            </span>
            <span className="absolute bottom-[-2px] start-0 w-0 h-[2px] bg-[var(--primaryColor)] transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_1fr] gap-6">
          <div className="travel-videos-left flex flex-col gap-4">
            <VideoColumn posts={leftCards} color={color} adPosition="in-feed-5" adIndex={leftAdIndex} activeSlug={activeArticle.slug} onSelect={handleSelect} />
          </div>

          <div>
            <div className="relative rounded-t-xl overflow-hidden group bg-black aspect-[3/2.3]">
              {hasVideoUrl && hasVast && playerStarted ? (
                <VastVideoPlayer
                  key={activeArticle.slug}
                  src={videoSrc}
                  poster={posterImage}
                  vastTagUrl={vastTagUrl}
                />
              ) : hasVideoUrl && playerStarted ? (
                <video
                  key={activeArticle.slug}
                  src={videoSrc}
                  poster={posterImage}
                  controls
                  autoPlay
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : hasVideoUrl ? (
                <div
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => setPlayerStarted(true)}
                >
                  <img src={posterImage || activeArticle.image} alt={activeArticle.title} className="w-full h-full object-cover" />
                  <span className="fpg-play-btn fpg-play-btn--large">
                    <i className="ri-play-fill" />
                  </span>
                </div>
              ) : (
                <>
                  <img src={activeArticle.image} alt={activeArticle.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="fpg-play-btn fpg-play-btn--large">
                    <i className="ri-play-fill" />
                  </span>
                </>
              )}
            </div>
            <div className="bg-black rounded-b-xl px-4 py-3">
              <CategoryPill label={activeArticle.categoryLabel} color={color} />
              <h3 className="mt-2 text-lg md:text-xl font-semibold text-white leading-snug">
                <Link href={getHref(activeArticle)} className="hover:underline decoration-white/50 underline-offset-4 transition-all">
                  {activeArticle.title}
                </Link>
              </h3>
              <ul className="flex items-center gap-3 mt-2 text-[12px] text-white/60">
                <li>{activeArticle.authorName}</li>
                <li>{activeArticle.views} {translate("common.views")}</li>
              </ul>
            </div>
          </div>

          <div className="travel-videos-right flex flex-col gap-4">
            <VideoColumn posts={rightCards} color={color} adPosition="in-feed-6" adIndex={rightAdIndex} activeSlug={activeArticle.slug} onSelect={handleSelect} />
          </div>
        </div>
      </div>
    </section>
  );
}
