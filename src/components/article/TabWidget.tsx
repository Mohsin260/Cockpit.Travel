"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

interface Article {
  slug: string;
  title: string;
  image?: string;
  authorName: string;
  views: number;
}

interface TabWidgetProps {
  recentArticles?: Article[];
  popularArticles?: Article[];
  trendyArticles?: Article[];
  adNode?: ReactNode;
}

type TabKey = "recent" | "popular" | "trendy";

export default function TabWidget({ recentArticles = [], popularArticles = [], trendyArticles = [], adNode }: TabWidgetProps) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<TabKey>("recent");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "recent", label: t("article.recent") },
    { key: "popular", label: t("article.popular") },
    { key: "trendy", label: t("home.trendingNow") },
  ];

  const tabData: Record<TabKey, Article[]> = {
    recent: recentArticles,
    popular: popularArticles,
    trendy: trendyArticles,
  };

  const posts = tabData[activeTab];

  return (
    <div className="border border-border rounded-[10px] p-[20px_20px_10px] bg-white">
      <div className="flex gap-[12px] mb-[20px]">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-[12px] px-[16px] text-[16px] font-bold rounded-[8px] transition-all duration-200 ${activeTab === tab.key
              ? "text-white bg-[#007AFF]"
              : "text-titleColor bg-white border border-border hover:text-primary"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {posts.map((post, i) => (
          <div key={i} className="flex items-center gap-[16px] py-[15px] group">
            <Link href={`/${post.slug}`} className="w-[85px] h-[85px] rounded-full overflow-hidden flex-shrink-0">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <h6 className="text-[16px] font-normal text-black leading-[1.35] line-clamp-2 group-hover:text-primary transition-colors">
                <Link href={`/${post.slug}`}>{post.title}</Link>
              </h6>
              <ul className="fpg-post-meta flex flex-wrap items-center gap-[12px] mt-[10px] text-[13px] text-bodyColor">
                <li>
                  <span className="fpg-meta flex items-center flex-wrap gap-[8px]">
                    <span>{t("common.by")} {post.authorName}</span>
                  </span>
                </li>
                <li className="flex items-center gap-[4px]">
                  <span className="w-[3px] h-[3px] rounded-full bg-bodyColor/60"></span>
                </li>
                <li>
                  <span className="fpg-meta flex items-center gap-[5px]">
                    <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                    {post.views} {t("common.views")}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        ))}
        {adNode}
      </div>
    </div>
  );
}
