"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import InFeedNativeAd from "@/components/ads/InFeedNativeAd";
import { CARD_STYLES, getCssVars } from "@/components/ui/cardStyles";
import SectionAudioButton from "@/components/ui/SectionAudioButton";
import WeatherWidget from "@/components/WeatherWidget";
import SocialFollowWidget from "@/components/SocialFollowWidget";
import TagsWidget from "@/components/article/TagsWidget";
import { useTranslations } from "@/hooks/useTranslations";
import { translate } from "@/lib/translate";
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
  excerpt?: string;
}

interface Category {
  slug: string;
  label: string;
  color: string;
  count: number;
}

interface WeatherData {
  city?: string;
  country?: string;
  temp: number;
  high: number;
  low: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  windDirection: string;
  conditionCode?: number;
  conditionLabel?: string;
  isRain?: boolean;
}

interface SocialLink {
  name: string;
  icon: "facebook" | "twitter" | "instagram" | "youtube" | "linkedin" | "dribbble" | "pinterest";
  url: string;
  followers: string;
}

interface TopOfWeekProps {
  articles: Article[];
  recentArticles: Article[];
  popularArticles: Article[];
  trendyArticles: Article[];
  categories: Category[];
  tags: string[];
  weather?: WeatherData;
  socialLinks?: SocialLink[];
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

function formatDate(dateStr: string) {
  try {
    return formatDateLocale(dateStr, { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return dateStr;
  }
}

type TabKey = "recent" | "popular" | "trendy";

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
    <div className="group md:flex gap-[20px] pb-[20px] mb-[20px] border-b border-[var(--borderColor,#e5e7eb)] last:border-0 last:pb-0 last:mb-0" style={getCssVars(CARD_STYLES["top-destinations"])}>
      <Link href={getHref(post)} className="block flex-shrink-0 w-[320px] h-[200px] rounded-[10px] overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </Link>
      <div className="flex-1 justify-center gap-[20px] md:mt-[30px] ">
        <CategoryPill label={post.categoryLabel} color={color} />
        <h5 className="mt-[8px] text-[16px] font-bold text-[var(--titleColor)] leading-[1.4] line-clamp-2">
          <Link href={getHref(post)} className="hover:text-[var(--primaryColor)] transition-colors">{post.title}</Link>
        </h5>
        <p className="mt-[8px] text-sm font-normal leading-[1.4] line-clamp-2">{post.excerpt}</p>
        <ul className="flex items-center gap-[12px] mt-[8px] text-[12px] text-[var(--bodyColor)]">
          <li className="flex items-center gap-[4px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3 h-3 fill-current opacity-50"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
            <span>{post.authorName}</span>
          </li>
          <li className="flex items-center gap-[4px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3 h-3 fill-current opacity-50"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>
            <span>{post.views} {translate("common.views")}</span>
          </li>
          <li className="flex items-center gap-[4px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3 h-3 fill-current opacity-50"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" /></svg>
            <span>{formatDate(post.date)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function TabItem({ post, isFirst, isLast }: { post: Article; isFirst: boolean; isLast: boolean }) {
  return (
    <div className="flex items-center gap-[10px] xl:gap-[20px] px-0" style={{
      paddingTop: isFirst ? 0 : '10px',
      paddingBottom: isLast ? 0 : '10px',
      borderBottom: isLast ? 'none' : '1px solid var(--borderColor)'
    }}>
      <Link href={getHref(post)} className="block flex-shrink-0 w-[90px] h-[90px] xl:w-[100px] xl:h-[100px] rounded-full overflow-hidden" aria-label={post.title}>
        <img src={post.image} alt="" className="w-full h-full object-cover" loading="lazy" />
      </Link>
      <div className="flex-1 min-w-0">
        <h6 className="text-[16px] xl:text-[17px] font-semibold text-[var(--titleColor)] leading-[1.44] line-clamp-2">
          <Link href={getHref(post)} className="hover:text-[var(--primaryColor)] transition-colors">{post.title}</Link>
        </h6>
        <ul className="flex items-center gap-[8px] mt-[5px] text-[14px] text-[var(--bodyColor)]">
          <li>{translate("common.by")} {post.authorName}</li>
          <li>{post.views} {translate("common.views")}</li>
        </ul>
      </div>
    </div>
  );
}

export default function TopOfWeek({ articles, recentArticles, popularArticles, trendyArticles, tags, weather, socialLinks }: TopOfWeekProps) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<TabKey>("recent");

  const tabLabels: { key: TabKey; label: string }[] = [
    { key: "recent", label: t("article.recent") },
    { key: "popular", label: t("article.popular") },
    { key: "trendy", label: t("home.trendingNow") },
  ];

  const tabData: Record<TabKey, Article[]> = {
    recent: recentArticles,
    popular: popularArticles,
    trendy: trendyArticles,
  };

  return (
    <section className="top-of-week-section py-[40px] bg-white">
      <div className="nerio-container">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <h2 className="text-[32px] font-bold text-[var(--titleColor)]">{t("sections.destinations")}</h2>
            <SectionAudioButton
              text={t("sections.destinations")}
              articles={articles.map(a => ({ title: a.title, authorName: a.authorName }))}
            />
          </div>
          <Link href="/category/destinations" className="group inline-flex items-center gap-2 text-[var(--titleColor)] font-semibold text-base no-underline relative">
            <span>{t("common.viewAll")}</span>
            <span className="inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 12" className="w-[18px] h-3 fill-current">
                <path fillRule="evenodd" clipRule="evenodd" d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z" />
              </svg>
            </span>
            <span className="absolute bottom-[-2px] start-0 w-0 h-[2px] bg-[var(--primaryColor)] transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-[30px]">
          <div className="top-destinations-grid grid grid-cols-1 md:grid-cols-1 gap-[24px]">
            {articles.slice(0, 10).map((post, i) => (
              <Fragment key={i}>
                <ArticleCard post={post} />
                {i === 3 && <InFeedNativeAd position="in-feed-7" cardStyle="top-destinations" />}
              </Fragment>
            ))}
          </div>

          <aside className="flex flex-col gap-[20px] xl:gap-[30px] sticky top-[125px] w-full max-w-[420px]">
            {/* Tabs Widget */}
            <div className="bg-[var(--shadeColor)] border border-[var(--borderColor)] rounded-[10px] p-[20px] xl:p-[30px]">
              <div className="flex gap-[7px] mb-[25px] overflow-x-auto">
                {tabLabels.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`inline-flex items-center justify-center flex-1 min-w-0 px-[12px] py-[10px] text-[14px] xl:text-[16px] font-semibold rounded-[5px] transition-all duration-300 whitespace-nowrap overflow-hidden text-ellipsis ${activeTab === tab.key
                        ? "bg-[var(--primaryColor)] text-white"
                        : "bg-transparent text-[var(--titleColor)] border border-[var(--borderColor)] hover:bg-[var(--primaryColor)] hover:text-white hover:border-[var(--primaryColor)]"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="sidebar-tabs-panel pt-0">
                {tabData[activeTab].map((post, i) => (
                  <TabItem key={i} post={post} isFirst={i === 0} isLast={i === tabData[activeTab].length - 1} />
                ))}
                <InFeedNativeAd position="in-feed-8" cardStyle="sidebar-tabs" className="py-[12px] border-t border-[var(--borderColor)]" />
              </div>
            </div>

            {/* Weather Widget */}
            <div className="bg-[linear-gradient(144deg,var(--primaryColor)_0%,#62A9FF_100%)] rounded-[10px] p-[20px] xl:p-[36px] relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.1] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNNDAgMGg0MHY0MGgtNDB6IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] bg-[size:40px_40px]" />
              <WeatherWidget weather={weather} />
            </div>

            {/* Follow Us Widget */}
            <div className="bg-[var(--shadeColor)] border border-[var(--borderColor)] rounded-[10px] p-[20px] xl:p-[30px]">
              <SocialFollowWidget socialLinks={socialLinks} />
            </div>

            {/* Tags Widget */}
            <div className="bg-[var(--shadeColor)] border border-[var(--borderColor)] rounded-[10px] p-[20px] xl:p-[30px]">
              <TagsWidget tags={tags} />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
