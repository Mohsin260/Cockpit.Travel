"use client";

import { useState, Fragment, type ReactElement } from "react";
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
    return formatDateLocale(dateStr, { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return dateStr;
  }
}

type TabKey = "recent" | "popular" | "trendy";

function CategoryPill({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center px-[10px] py-[2px] rounded-[0_100px_100px_70px] font-medium text-[12px] uppercase leading-[22px] text-white"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}

function ArticleCard({ post }: { post: Article }) {
  const color = categoryColors[post.category] || "#54bd05";
  return (
    <div className="group flex flex-col md:flex-row gap-[12px] md:gap-[25px] py-[15px] border-b border-[var(--borderColor,#e5e7eb)] last:border-0">
      <Link href={getHref(post)} className="block flex-shrink-0 w-full md:w-[280px] h-auto md:h-[200px] aspect-[16/10] md:aspect-auto rounded-[10px] overflow-hidden">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="flex-1 min-w-0 flex flex-col justify-between py-[8px] gap-[10px]">
        <div>
          <CategoryPill label={post.categoryLabel} color={color} />
          <h4 className="mt-[10px] text-[19px] font-bold text-[var(--titleColor)] leading-[1.4] line-clamp-2 hover:text-[var(--primaryColor)] transition-colors cursor-pointer">
            <Link href={getHref(post)}>{post.title}</Link>
          </h4>
          {post.excerpt && (
            <p className="mt-[8px] text-[15px] text-[var(--bodyColor)] leading-[1.65] line-clamp-2">{post.excerpt}</p>
          )}
        </div>
        <ul className="flex items-center gap-[14px] text-[13px] text-[var(--bodyColor)]">
          <li className="flex items-center gap-[5px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-current opacity-50"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
            <span className="hover:text-[var(--primaryColor)] transition-colors cursor-pointer">{post.authorName}</span>
          </li>
          <li className="flex items-center gap-[5px]">
            <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            <span>{post.views} Views</span>
          </li>
          <li className="flex items-center gap-[5px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-current opacity-50"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" /></svg>
            <span>{formatDate(post.date)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function TabItem({ post }: { post: Article }) {
  return (
    <div className="flex items-center gap-[16px] py-[15px] group">
      <Link href={getHref(post)} className="w-[85px] h-[85px] rounded-full overflow-hidden flex-shrink-0">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="flex-1 min-w-0">
        <h6 className="text-[16px] font-normal text-[var(--titleColor)] leading-[1.35] line-clamp-2 group-hover:text-[var(--primaryColor)] transition-colors">
          <Link href={getHref(post)}>{post.title}</Link>
        </h6>
        <ul className="flex items-center gap-[12px] mt-[10px] text-[13px] text-[var(--bodyColor)]">
          <li>
            <span className="flex items-center flex-wrap gap-[8px]">
              <span>By {post.authorName}</span>
            </span>
          </li>
          <li className="flex items-center gap-[4px]">
            <span className="w-[3px] h-[3px] rounded-full bg-[var(--bodyColor)]/60"></span>
          </li>
          <li>
            <span className="flex items-center gap-[5px]">
              <svg className="w-[14px] h-[14px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              {post.views} Views
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function WeatherWidget() {
  return (
    <div className="rounded-[10px] overflow-hidden" style={{ background: "linear-gradient(144deg, #0073FF 0%, #62A9FF 100%)" }}>
      <div className="p-[20px]">
        <div className="flex items-center justify-between mb-[4px]">
          <span className="text-[14px] font-semibold text-white">Weather</span>
          <span className="text-[13px] font-normal text-white/80">25 Jul, 2026</span>
        </div>
        <div className="flex items-center justify-between pb-[20px] mb-[20px]">
          <span className="text-[18px] font-bold text-white">Current Weather</span>
          <span className="text-[13px] font-normal text-white/80">02:30 PM</span>
        </div>
        <div className="weather-header flex items-center gap-[10px] pb-[20px] mb-[20px] border-b border-white/25">
          <div className="weather_icon flex-shrink-0 h-[60px] flex items-center justify-center">
            <svg className="w-[60px] h-[60px] text-white" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="12" fill="#FFD700" />
              <g className="weather-sun-rays" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round">
                <line x1="32" y1="6" x2="32" y2="14" />
                <line x1="32" y1="50" x2="32" y2="58" />
                <line x1="6" y1="32" x2="14" y2="32" />
                <line x1="50" y1="32" x2="58" y2="32" />
                <line x1="13.6" y1="13.6" x2="19.2" y2="19.2" />
                <line x1="44.8" y1="44.8" x2="50.4" y2="50.4" />
                <line x1="13.6" y1="50.4" x2="19.2" y2="44.8" />
                <line x1="44.8" y1="19.2" x2="50.4" y2="13.6" />
              </g>
            </svg>
          </div>
          <div className="temperature text-[40px] font-semibold text-white leading-none">28.3<sup className="text-[20px] ml-[3px]">°C</sup></div>
        </div>
        <ul className="info_list grid grid-cols-2 gap-[10px]">
          <li className="flex items-start gap-[10px]">
            <svg className="w-[24px] h-[24px] flex-shrink-0 mt-[2px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" /></svg>
            <div className="info_text_wrapper flex flex-col-reverse gap-[10px]">
              <div className="rs-w-label text-[14px] font-normal text-white leading-[1.2em]">Feels Like</div>
              <div className="value-wrapper text-[14px] font-medium text-white">30.6°C</div>
            </div>
          </li>
          <li className="flex items-start gap-[10px]">
            <svg className="w-[24px] h-[24px] flex-shrink-0 mt-[2px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>
            <div className="info_text_wrapper flex flex-col-reverse gap-[10px]">
              <div className="rs-w-label text-[14px] font-normal text-white leading-[1.2em]">Humidity</div>
              <div className="value-wrapper text-[14px] font-medium text-white">48%</div>
            </div>
          </li>
          <li className="flex items-start gap-[10px]">
            <svg className="w-[24px] h-[24px] flex-shrink-0 mt-[2px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            <div className="info_text_wrapper flex flex-col-reverse gap-[10px]">
              <div className="rs-w-label text-[14px] font-normal text-white leading-[1.2em]">Condition</div>
              <div className="value-wrapper text-[14px] font-medium text-white">Haze</div>
            </div>
          </li>
          <li className="flex items-start gap-[10px]">
            <svg className="w-[24px] h-[24px] flex-shrink-0 mt-[2px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
            <div className="info_text_wrapper flex flex-col-reverse gap-[10px]">
              <div className="rs-w-label text-[14px] font-normal text-white leading-[1.2em]">Current City</div>
              <div className="value-wrapper text-[14px] font-medium text-white">New York</div>
            </div>
          </li>
          <li className="flex items-start gap-[10px]">
            <svg className="w-[24px] h-[24px] flex-shrink-0 mt-[2px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7a7.5 7.5 0 1 0-10.1 10.8" /><path d="M18 12h.01" /><path d="M12 2v2" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="M12 20v2" /></svg>
            <div className="info_text_wrapper flex flex-col-reverse gap-[10px]">
              <div className="rs-w-label text-[14px] font-normal text-white leading-[1.2em]">Wind Info</div>
              <div className="value-wrapper text-[14px] font-medium text-white">5.5 km/h WSW</div>
            </div>
          </li>
          <li className="flex items-start gap-[10px]">
            <svg className="w-[24px] h-[24px] flex-shrink-0 mt-[2px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>
            <div className="info_text_wrapper flex flex-col-reverse gap-[10px]">
              <div className="rs-w-label text-[14px] font-normal text-white leading-[1.2em]">Country</div>
              <div className="value-wrapper text-[14px] font-medium text-white">US</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

const socialLinks = [
  { name: "Facebook", followers: "88.2k Followers", color: "#2264CB", icon: <svg viewBox="0 0 320 512" className="w-[18px] h-[18px] fill-white"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" /></svg> },
  { name: "Twitter - X", followers: "48.6k Followers", color: "#121213", icon: <svg viewBox="0 0 512 512" className="w-[18px] h-[18px] fill-white"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" /></svg> },
  { name: "Dribbble", followers: "39.5k Followers", color: "#F53E82", icon: <svg viewBox="0 0 512 512" className="w-[18px] h-[18px] fill-white"><path d="M256 8C119.252 8 8 119.252 8 256s111.252 248 248 248 248-111.252 248-248S392.748 8 256 8zm163.97 114.366c29.503 36.046 47.369 81.957 47.835 131.955-6.984-1.477-77.018-15.682-147.502-6.818-5.752-14.041-11.181-26.393-18.617-41.614 78.321-31.977 113.818-77.482 118.284-83.523zM396.421 97.87c-3.81 5.427-35.697 48.286-111.021 76.519-34.712-63.776-73.185-116.168-79.04-124.008 67.176-16.193 137.966 1.27 190.061 47.489zm-230.48-33.25c5.585 7.659 43.438 60.116 78.537 122.509-99.087 26.313-186.36 25.934-195.834 25.809C62.38 147.205 106.678 92.573 165.941 64.62zM44.17 256.323c0-2.166.043-4.322.108-6.473 9.268.19 111.92 1.513 217.706-30.146 6.064 11.868 11.857 23.915 17.174 35.949-76.599 21.575-146.194 83.527-180.531 142.306C64.794 360.405 44.17 310.73 44.17 256.323zm81.807 167.113c22.127-45.233 82.178-103.622 167.579-132.756 29.74 77.283 42.039 142.053 45.189 160.638-68.112 29.013-150.015 21.053-212.768-27.882zm248.38 8.489c-2.171-12.886-13.446-74.897-41.152-151.033 66.38-10.626 124.7 6.768 131.947 9.055-9.442 58.941-43.273 109.844-90.795 141.978z" /></svg> },
  { name: "Pinterest", followers: "28.2k Followers", color: "#AF091C", icon: <svg viewBox="0 0 384 512" className="w-[18px] h-[18px] fill-white"><path d="M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z" /></svg> },
  { name: "Linkedin", followers: "30.3k Followers", color: "#0077B5", icon: <svg viewBox="0 0 448 512" className="w-[18px] h-[18px] fill-white"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" /></svg> },
  { name: "Instagram", followers: "24.5k Followers", color: "linear-gradient(29deg, #BE08AF, #F10811)", icon: <svg viewBox="0 0 448 512" className="w-[18px] h-[18px] fill-white"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" /></svg> },
];

function FollowersWidget() {
  return (
    <div className="border border-[var(--borderColor,#e5e5e5)] rounded-[10px] p-[20px] bg-[var(--shadeColor)]">
      <h4 className="text-[18px] font-bold text-[var(--titleColor)] mb-[16px]">Follow Us</h4>
      <div className="flex flex-col gap-[12px]">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href="#"
            className="flex items-center gap-[12px] p-[10px_15px] rounded-[6px] text-white transition-opacity hover:opacity-80 relative"
            style={{ background: social.color }}
          >
            <div className="flex-shrink-0 flex items-center justify-center">
              {social.icon}
            </div>
            <span className="text-[15px] font-medium text-white">{social.name}</span>
            <span className="absolute top-[9px] right-[15px] text-[13px] font-medium text-white/90">{social.followers}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function TopOfWeek({ articles, recentArticles, popularArticles, trendyArticles, categories, tags }: TopOfWeekProps) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<TabKey>("recent");

  const tabLabels: { key: TabKey; label: string }[] = [
    { key: "recent", label: t("article.recent") },
    { key: "popular", label: t("article.popular") },
    { key: "trendy", label: "Trendy" },
  ];

  const tabData: Record<TabKey, Article[]> = {
    recent: recentArticles,
    popular: popularArticles,
    trendy: trendyArticles,
  };

  return (
    <section className="top-of-week-section py-[60px] bg-white">
      <style>{`
        @media (max-width: 1029.32px) {
          .destinations-main-grid {
            grid-template-columns: 1fr !important;
          }
          .destinations-main-grid > *:last-child {
            position: static !important;
          }
        }
      `}</style>
      <div className="nerio-container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-[28px] font-bold text-[var(--titleColor)]">{t("sections.destinations")}</h2>
          <Link href="/category/destinations" className="group inline-flex items-center gap-2 text-[var(--titleColor)] font-semibold text-base no-underline relative">
            <span>{t("common.viewAll")}</span>
            <span className="inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 12" className="w-[18px] h-3 fill-current">
                <path fillRule="evenodd" clipRule="evenodd" d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z" />
              </svg>
            </span>
            <span className="absolute bottom-[-2px] left-0 w-0 h-[2px] bg-[var(--primaryColor)] transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        <div className="destinations-main-grid grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-[30px] items-start">
          <div className="top-destinations-grid flex flex-col">
            {articles.slice(0, 10).map((post, i) => (
              <Fragment key={i}>
                <ArticleCard post={post} />
                {i === 3 && <InFeedNativeAd position="in-feed-7" cardStyle="top-destinations" />}
              </Fragment>
            ))}
          </div>

          <div className="flex flex-col gap-[30px] lg:sticky lg:top-[100px]">
            <div className="border border-[var(--borderColor,#e5e5e5)] rounded-[10px] p-[20px_20px_10px] bg-[var(--shadeColor)]">
              <div className="flex gap-[12px] mb-[20px]">
                {tabLabels.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-[12px] px-[16px] text-[16px] font-bold rounded-[8px] transition-all duration-200 ${activeTab === tab.key
                      ? "text-white bg-[#007AFF]"
                      : "text-[var(--titleColor)] bg-white border border-[var(--borderColor,#e5e5e5)] hover:text-[var(--primaryColor)]"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="sidebar-tabs-panel">
                {tabData[activeTab].map((post, i) => (
                  <TabItem key={i} post={post} />
                ))}
                <InFeedNativeAd position="in-feed-8" cardStyle="sidebar-tabs" className="flex items-center gap-[16px] py-[15px]" />
              </div>
            </div>

            <WeatherWidget />

            <FollowersWidget />

            <div className="border border-[var(--borderColor,#e5e5e5)] rounded-[10px] p-[20px] bg-[var(--shadeColor)]">
              <h4 className="text-[18px] font-bold text-[var(--titleColor)] mb-[16px]">Tags</h4>
              <div className="flex flex-wrap gap-[9px]">
                {tags.map((tag, i) => (
                  <Link
                    key={i}
                    href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                    className="px-[15px] py-[5px] bg-[var(--shadeColor)] border border-[#e5e5e5] rounded-[6px] text-[16px] font-medium transition-colors hover:bg-[var(--primaryColor)] hover:border-[var(--primaryColor)]"
                    style={{ color: "#000" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#000"; }}
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
