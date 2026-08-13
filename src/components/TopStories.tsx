"use client";

import Link from "next/link";
import InFeedNativeAd from "@/components/ads/InFeedNativeAd";
import SectionAudioButton from "@/components/ui/SectionAudioButton";
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
    <section className="top-stories-section py-[40px] bg-white">
      <div className="nerio-container">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <h2 className="text-[32px] font-bold text-[var(--titleColor)]">{t("sections.flights")}</h2>
            <SectionAudioButton
              text={t("sections.flights")}
              articles={articles.map(a => ({ title: a.title, authorName: a.authorName }))}
            />
          </div>
          <Link href="/category/flights" className="group inline-flex items-center gap-2 text-[var(--titleColor)] font-semibold text-base no-underline relative">
            <span>{t("common.viewAll")}</span>
            <span className="inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 12" className="w-[18px] h-3 fill-current">
                <path fillRule="evenodd" clipRule="evenodd" d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z" />
              </svg>
            </span>
            <span className="absolute bottom-[-2px] start-0 w-0 h-[2px] bg-[var(--primaryColor)] transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Link href={getHref(largeCard)} className="block relative rounded-xl overflow-hidden group min-h-[400px]">
            <img src={largeCard.image} alt={largeCard.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <span className="inline-flex items-center px-[10px] py-[1px] rounded-[0_100px_100px_70px] font-medium text-[12px] uppercase leading-[22px] text-white" style={{ backgroundColor: color }}>
                {largeCard.categoryLabel}
              </span>
              <h3 className="mt-3 text-xl md:text-[22px] font-semibold text-white leading-snug">{largeCard.title}</h3>
              <ul className="flex items-center gap-3 mt-3 text-[13px] text-white/70">
                <li>{largeCard.authorName}</li>
                <li>{largeCard.views} {t("common.views")}</li>
                <li>{formatDate(largeCard.date)}</li>
              </ul>
            </div>
          </Link>

          <div className="top-stories-col flex flex-col gap-4">
            {smallCards.map((post, i) => (
              <div key={i} className="flex gap-4 bg-white rounded-xl border border-[var(--borderColor,#e5e7eb)] overflow-hidden p-4 transition-all hover:shadow-md">
                <Link href={getHref(post)} className="block flex-shrink-0 w-[180px] h-[130px] rounded-lg overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                </Link>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <span className="inline-flex items-center px-[10px] py-[1px] rounded-[0_100px_100px_70px] font-medium text-[12px] uppercase leading-[22px] text-white w-fit" style={{ backgroundColor: categoryColors[post.category] || color }}>
                    {post.categoryLabel}
                  </span>
                  <h5 className="mt-2 text-[16px] font-bold text-[var(--titleColor)] leading-[1.4] line-clamp-2">
                    <Link href={getHref(post)} className="hover:text-[var(--primaryColor)] transition-colors">{post.title}</Link>
                  </h5>
                  <ul className="flex items-center gap-3 mt-2 text-[12px] text-[var(--bodyColor)]">
                    <li>{post.authorName}</li>
                    <li>{post.views} {t("common.views")}</li>
                  </ul>
                </div>
              </div>
            ))}
            <InFeedNativeAd position="in-feed-9" cardStyle="top-flights" className="bg-white rounded-xl border border-[var(--borderColor,#e5e7eb)] overflow-hidden p-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
