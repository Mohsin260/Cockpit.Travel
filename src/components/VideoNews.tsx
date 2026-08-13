"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
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
  return `/${article.slug}`;
}

function CategoryPill({ label, color }: { label: string; color: string }) {
  return (
    <span className="video-cat-pill" style={{ backgroundColor: color }}>
      {label}
    </span>
  );
}

function SideVideoRow({ post, color }: { post: Article; color: string }) {
  return (
    <div className="flex items-center gap-[15px]">
      <Link href={getHref(post)} className="block flex-shrink-0 w-[112px] min-w-[112px] h-[112px] rounded-lg overflow-hidden relative group">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <span className="fpg-play-btn">
          <i className="ri-play-fill" />
        </span>
      </Link>
      <div className="flex-1 min-w-0">
        <CategoryPill label={post.categoryLabel} color={color} />
        <h6 className="mt-1 text-[14px] font-semibold text-[var(--titleColor)] leading-[1.4] line-clamp-2">
          <Link href={getHref(post)} className="hover:text-[var(--primaryColor)] transition-colors">{post.title}</Link>
        </h6>
        <ul className="flex items-center gap-2 mt-1 text-[11px] text-[var(--bodyColor)]">
          <li>{post.authorName}</li>
          <li>{post.views} {translate("common.views")}</li>
        </ul>
      </div>
    </div>
  );
}

/* Intersperses the column cards with the in-feed ad at a random index so the ad
   blends into the article cards instead of always sitting at the end. */
function useRandomAdIndex(count: number) {
  const [index, setIndex] = useState(() => count);
  useEffect(() => {
    if (count === 0) return;
    setIndex(Math.floor(Math.random() * (count + 1)));
  }, [count]);
  return index;
}

function VideoColumn({ posts, color, adPosition, adIndex }: { posts: Article[]; color: string; adPosition: string; adIndex: number }) {
  const nodes: ReactNode[] = [];
  for (let i = 0; i < posts.length; i++) {
    if (i === adIndex) {
      nodes.push(<InFeedNativeAd key="travel-intel-ad" position={adPosition} cardStyle="travel-intel" />);
    }
    nodes.push(<SideVideoRow key={posts[i].slug} post={posts[i]} color={color} />);
  }
  if (posts.length === adIndex) {
    nodes.push(<InFeedNativeAd key="travel-intel-ad" position={adPosition} cardStyle="travel-intel" />);
  }
  return <>{nodes}</>;
}

export default function VideoNews({ articles }: VideoNewsProps) {
  const t = useTranslations();

  const featured = articles[0];
  const leftCards = articles.slice(1, 4);
  const rightCards = articles.slice(4, 7);
  const color = categoryColors[featured?.category || ""] || "#f27100";

  const leftAdIndex = useRandomAdIndex(leftCards.length);
  const rightAdIndex = useRandomAdIndex(rightCards.length);

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
            <VideoColumn posts={leftCards} color={color} adPosition="in-feed-5" adIndex={leftAdIndex} />
          </div>

          <Link href={getHref(featured)} className="block relative rounded-xl overflow-hidden group min-h-[400px]">
            <img src={featured.image} alt={featured.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <CategoryPill label={featured.categoryLabel} color={color} />
              <h3 className="mt-3 text-xl md:text-[22px] font-semibold text-white leading-snug">{featured.title}</h3>
              <ul className="flex items-center gap-3 mt-3 text-[13px] text-white/70">
                <li>{featured.authorName}</li>
                <li>{featured.views} {translate("common.views")}</li>
              </ul>
            </div>
            <span className="fpg-play-btn fpg-play-btn--large">
              <i className="ri-play-fill" />
            </span>
          </Link>

          <div className="travel-videos-right flex flex-col gap-4">
            <VideoColumn posts={rightCards} color={color} adPosition="in-feed-6" adIndex={rightAdIndex} />
          </div>
        </div>
      </div>
    </section>
  );
}
