"use client";

import { useState, type ReactElement } from "react";
import Link from "next/link";
import InFeedNativeAd from "@/components/ads/InFeedNativeAd";

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
  excerpt?: string;
}

interface Category {
  slug: string;
  label: string;
  color: string;
  count: number;
}

interface TopOfWeekProps {
  articles: Article[];
  recentArticles: Article[];
  popularArticles: Article[];
  trendyArticles: Article[];
  categories: Category[];
  tags: string[];
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
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return dateStr;
  }
}

type TabKey = "recent" | "popular" | "trendy";
const tabLabels: { key: TabKey; label: string }[] = [
  { key: "recent", label: "Recent" },
  { key: "popular", label: "Popular" },
  { key: "trendy", label: "Trendy" },
];

function CategoryPill({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center px-[10px] py-[1px] rounded-[0_100px_100px_70px] font-medium text-[12px] uppercase leading-[22px] text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}

function ArticleCard({ post }: { post: Article }) {
  const color = categoryColors[post.category] || "#54bd05";
  return (
    <div className="group flex gap-[20px] pb-[20px] mb-[20px] border-b border-[var(--borderColor,#e5e7eb)] last:border-0 last:pb-0 last:mb-0">
      <Link href={getHref(post)} className="block flex-shrink-0 w-[200px] h-[130px] rounded-[10px] overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <CategoryPill label={post.categoryLabel} color={color} />
        <h5 className="mt-[8px] text-[16px] font-bold text-[var(--titleColor)] leading-[1.4] line-clamp-2">
          <Link href={getHref(post)} className="hover:text-[var(--primaryColor)] transition-colors">{post.title}</Link>
        </h5>
        <ul className="flex items-center gap-[12px] mt-[8px] text-[12px] text-[var(--bodyColor)]">
          <li className="flex items-center gap-[4px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3 h-3 fill-current opacity-50"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            <span>{post.authorName}</span>
          </li>
          <li className="flex items-center gap-[4px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3 h-3 fill-current opacity-50"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            <span>{post.views} Views</span>
          </li>
          <li className="flex items-center gap-[4px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3 h-3 fill-current opacity-50"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>
            <span>{formatDate(post.date)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function TabItem({ post }: { post: Article }) {
  return (
    <div className="flex items-center gap-[12px] py-[12px] border-b border-[var(--borderColor,#e5e7eb)] last:border-0">
      <Link href={getHref(post)} className="block flex-shrink-0 w-[65px] h-[65px] rounded-[8px] overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
      </Link>
      <div className="flex-1 min-w-0">
        <h6 className="text-[13px] font-semibold text-[var(--titleColor)] leading-[1.4] line-clamp-2">
          <Link href={getHref(post)} className="hover:text-[var(--primaryColor)] transition-colors">{post.title}</Link>
        </h6>
        <ul className="flex items-center gap-[8px] mt-[4px] text-[11px] text-[var(--bodyColor)]">
          <li>{post.authorName}</li>
          <li>{post.views} Views</li>
        </ul>
      </div>
    </div>
  );
}

export default function TopOfWeek({ articles, recentArticles, popularArticles, trendyArticles, categories, tags }: TopOfWeekProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("recent");

  const tabData: Record<TabKey, Article[]> = {
    recent: recentArticles,
    popular: popularArticles,
    trendy: trendyArticles,
  };

  return (
    <section className="top-of-week-section py-[60px] bg-white">
      <div className="nerio-container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[28px] font-bold text-[var(--titleColor)]">Destinations</h2>
          <Link href="/category/destinations" className="group inline-flex items-center gap-2 text-[var(--titleColor)] font-semibold text-base no-underline relative">
            <span>View All</span>
            <span className="inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 12" className="w-[18px] h-3 fill-current">
                <path fillRule="evenodd" clipRule="evenodd" d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z" />
              </svg>
            </span>
            <span className="absolute bottom-[-2px] left-0 w-0 h-[2px] bg-[var(--primaryColor)] transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-[30px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
            {articles.slice(0, 10).map((post, i) => (
              <>
                <ArticleCard key={i} post={post} />
                {i === 3 && <InFeedNativeAd position="in-feed-7" cardStyle="top-destinations" />}
              </>
            ))}
          </div>

          <div className="flex flex-col gap-[30px]">
            <div className="bg-[var(--cardBg,#f9fafb)] rounded-[12px] p-[24px]">
              <div className="flex gap-[20px] border-b border-[var(--borderColor,#e5e7eb)] mb-[16px]">
                {tabLabels.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`pb-[12px] text-[14px] font-semibold transition-colors relative ${
                      activeTab === tab.key
                        ? "text-[var(--primaryColor)]"
                        : "text-[var(--bodyColor)] hover:text-[var(--titleColor)]"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.key && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--primaryColor)]" />
                    )}
                  </button>
                ))}
              </div>
              <div>
                {tabData[activeTab].map((post, i) => (
                  <TabItem key={i} post={post} />
                ))}
                <InFeedNativeAd position="in-feed-8" cardStyle="sidebar-tabs" className="py-[12px] border-b border-[var(--borderColor,#e5e7eb)]" />
              </div>
            </div>

            <div className="bg-[var(--cardBg,#f9fafb)] rounded-[12px] p-[24px]">
              <h4 className="text-[16px] font-bold text-[var(--titleColor)] mb-[16px]">Tags</h4>
              <div className="flex flex-wrap gap-[8px]">
                {tags.map((tag, i) => (
                  <Link
                    key={i}
                    href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                    className="px-[12px] py-[6px] bg-white border border-[var(--borderColor,#e5e7eb)] rounded-[6px] text-[12px] font-medium text-[var(--bodyColor)] hover:border-[var(--primaryColor)] hover:text-[var(--primaryColor)] transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
