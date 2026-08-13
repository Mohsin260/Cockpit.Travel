"use client";

import Link from "next/link";
import InFeedNativeAd from "@/components/ads/InFeedNativeAd";
import { useTranslations } from "@/hooks/useTranslations";
import { formatDate as formatDateLocale } from "@/lib/dateFormat";

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

interface TopStoriesProps {
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

function formatDate(dateStr: string) {
  try {
    return formatDateLocale(dateStr, { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function TopStories({ articles }: TopStoriesProps) {
  const t = useTranslations();
  if (articles.length === 0) return null;

  const largeCard = articles[0];
  const smallCards = articles.slice(1, 3);
  const color = categoryColors[largeCard.category] || "#0073ff";

  return (
    <section className="top-stories-section py-[60px] bg-white">
      <style>{`
        @media (min-width: 1022px) and (max-width: 1029.33px) {
          .top-stories-section .flight-meta {
            flex-wrap: wrap;
          }
          .top-stories-section .flight-date {
            flex-basis: 100%;
          }
        }
      `}</style>
      <div className="nerio-container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[28px] font-bold text-[var(--titleColor)]">{t("sections.flights")}</h2>
          <Link href="/category/flights" className="group inline-flex items-center gap-2 text-[var(--titleColor)] font-semibold text-base no-underline relative">
            <span>{t("common.viewAll")}</span>
            <span className="inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 12" className="w-[18px] h-3 fill-current">
                <path fillRule="evenodd" clipRule="evenodd" d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z" />
              </svg>
            </span>
            <span className="absolute bottom-[-2px] left-0 w-0 h-[2px] bg-[var(--primaryColor)] transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Link href={getHref(largeCard)} className="block relative rounded-xl overflow-hidden group min-h-[400px]">
            <img src={largeCard.image} alt={largeCard.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <span className="inline-flex items-center px-[10px] py-[1px] rounded-[0_100px_100px_70px] font-medium text-[12px] uppercase leading-[22px] text-white" style={{ backgroundColor: color }}>
                {largeCard.categoryLabel}
              </span>
              <h3 className="mt-3 text-xl md:text-[22px] font-semibold text-white leading-snug">{largeCard.title}</h3>
              <ul className="flight-meta flex items-center gap-3 mt-3 text-[13px] text-white/70">
                <li className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>{largeCard.authorName}</li>
                <li className="flex items-center gap-1"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>{largeCard.views} Views</li>
                <li className="flight-date flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>{formatDate(largeCard.date)}</li>
              </ul>
            </div>
          </Link>

          {smallCards.map((post, i) => (
            <div key={i} className="fpg-card-style flex flex-col bg-white rounded-[10px] border border-[var(--borderColor,#e5e7eb)] overflow-hidden p-[12px_12px_25px] transition-all hover:shadow-md">
              <Link href={getHref(post)} className="block w-full h-[315px] rounded-[10px] overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
              </Link>
              <div className="flex flex-col px-[3px]">
                <div className="mt-[9px] mb-[7px]">
                  <span className="inline-flex items-center px-[10px] py-[1px] rounded-[0_100px_100px_70px] font-medium text-[12px] uppercase leading-[22px] text-white w-fit" style={{ backgroundColor: categoryColors[post.category] || color }}>
                    {post.categoryLabel}
                  </span>
                </div>
                <h4 className="text-[16px] font-semibold text-[var(--titleColor)] leading-[1.4] line-clamp-2 mb-[7px] hover:text-[var(--primaryColor)] transition-colors cursor-pointer">
                  <Link href={getHref(post)}>{post.title}</Link>
                </h4>
                <ul className="flight-meta flex items-center gap-[0_8px] text-[14px] text-[var(--bodyColor)]">
                  <li><span className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>By <span className="hover:text-[var(--primaryColor)] transition-colors cursor-pointer">{post.authorName}</span></span></li>
                  <li><span className="flex items-center gap-2"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>{post.views} Views</span></li>
                  <li className="flight-date"><span className="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>{formatDate(post.date)}</span></li>
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <InFeedNativeAd position="in-feed-9" cardStyle="top-flights" />
        </div>
      </div>
    </section>
  );
}
