"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";

import Link from "next/link";
import { generateSlug } from "@/lib/slug";
import InFeedNativeAd from "@/components/ads/InFeedNativeAd";
import { CARD_STYLES, getCssVars } from "@/components/ui/cardStyles";
import { useTranslations } from "@/hooks/useTranslations";
import { formatDate as formatDateLocale } from "@/lib/dateFormat";
import { DEPLOYMENT_LOCALE } from "@/lib/i18n";

const HERO_BG_IMAGES: Record<string, string> = {
  en: "https://images.unsplash.com/photo-1501761095094-94d36f57edbb?w=1400&auto=format&fit=crop&q=80",
  es: "https://images.unsplash.com/photo-1497470888337-ded683b67494?w=1400&auto=format&fit=crop&q=80",
  ar: "https://images.unsplash.com/photo-1497470888337-ded683b67494?w=1400&auto=format&fit=crop&q=80",
};

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

interface HeroProps {
  featured: Article;
  featuredCards: Article[];
  recentNews: Article[];
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

export default function Hero({ featured, featuredCards, recentNews }: HeroProps) {
  const t = useTranslations();
  const featuredColor = categoryColors[featured.category] || "#f27100";
  const heroBgImage = HERO_BG_IMAGES[DEPLOYMENT_LOCALE] || HERO_BG_IMAGES.en;

  return (
    <section className="hero-section" style={{ backgroundImage: `url('${heroBgImage}')` }}>
      <div className="hero-inner">
        <div className="hero-featured" style={{ backgroundImage: `url('${heroBgImage}')` }}>
          <div className="hero-featured-content">
            <div className="hero-post-cat">
              <Link
                href={getHref(featured)}
                className="post-cat"
                style={{
                  "--catCurrentBgColor": featuredColor,
                  "--catCurrentColor": "#ffffff",
                } as React.CSSProperties}
              >
                {featured.categoryLabel}
              </Link>
            </div>
            <h1 className="hero-post-title">
              <Link href={getHref(featured)}>{featured.title}</Link>
            </h1>
            <ul className="hero-post-meta">
              <li>
                <span className="fpg-meta">
                  <span>
                    {t("common.by")}{" "}
                    <span className="fpg-author-link">
                      {featured.authorName}
                    </span>
                  </span>
                </span>
              </li>
              <li>
                <span className="fpg-meta">
                  <i className="ri-pulse-fill" /> {featured.views} {t("common.views")}
                </span>
              </li>
              <li>
                <span className="fpg-meta">
                  <i className="ri-calendar-line" /> {formatDate(featured.date)}
                </span>
              </li>
            </ul>
            <div className="fpg-btn-wrapper">
              <Link href={getHref(featured)}>{t("hero.readArticle")}</Link>
            </div>
          </div>

          <div className="hero-featured-cards">
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: false }}
              loop
              spaceBetween={20}
              slidesPerView={1}
              slidesPerGroup={1}
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 3 },
              }}
            >
              {featuredCards.map((post, i) => (
                <SwiperSlide key={i} className="h-auto">
                  <div className="hero-featured-card" style={getCssVars(CARD_STYLES["hero-featured"])}>
                    <div className="fpg-post-thumb">
                      <Link href={getHref(post)} className="image-link">
                        <img src={post.image} alt="" width={220} height={110} />
                      </Link>
                    </div>
                    <div className="fpg-post-content">
                      <div className="fpg-post-content-inner">
                        <div className="fpg-post-cat">
                          <Link
                            href={getHref(post)}
                            className="post-cat"
                            style={{
                              "--catCurrentBgColor": categoryColors[post.category] || "#f27100",
                              "--catCurrentColor": "#ffffff",
                              fontSize: "10px",
                              lineHeight: "18px",
                              padding: "1px 7px 0",
                              letterSpacing: "-0.3px",
                            } as React.CSSProperties}
                          >
                            {post.categoryLabel}
                          </Link>
                        </div>
                        <h6 className="fpg-post-title">
                          <Link href={getHref(post)} className="text-white hover:text-primary transition-colors">
                            {post.title}
                          </Link>
                        </h6>
                      </div>
                      <ul className="fpg-post-meta">
                        <li>
                          <span className="fpg-meta">
                            <span>
                              {t("common.by")}{" "}
                              <span className="fpg-author-link">
                                {post.authorName}
                              </span>
                            </span>
                          </span>
                        </li>
                        <li>
                          <span className="fpg-meta">
                            <i className="ri-pulse-fill" /> {post.views} {t("common.views")}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
              <SwiperSlide className="h-auto">
                <InFeedNativeAd position="in-feed-2" cardStyle="hero-featured" className="hero-featured-card" />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>

        <div className="hero-recent">
          <div className="hero-recent-header">
            <h4>{t("hero.recentNews")}</h4>
            <Link href="/blog" className="hero-view-all-btn">
              <span className="button-text" data-text={t("hero.viewAll")}>
                {t("hero.viewAll")}
              </span>
              <span className="button-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 12">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z"
                  />
                </svg>
              </span>
            </Link>
          </div>
          <div className="hero-recent-grid">
              {recentNews.map((post, i) => (
              <div className="fpg-card-style style-two" key={i} style={getCssVars(CARD_STYLES["hero-recent"])}>
                <div className="fpg-post-thumb">
                  <Link href={getHref(post)} className="image-link">
                    <img src={post.image} alt="" width={124} height={100} />
                  </Link>
                </div>
                <div className="fpg-post-content">
                  <div className="fpg-post-content-inner">
                    <div className="fpg-post-cat">
                      <Link
                        href={getHref(post)}
                        className="post-cat"
                        style={{
                          "--catCurrentBgColor": categoryColors[post.category] || "#f27100",
                          "--catCurrentColor": "#ffffff",
                        } as React.CSSProperties}
                      >
                        {post.categoryLabel}
                      </Link>
                    </div>
                    <h6 className="fpg-post-title">
                      <Link href={getHref(post)}>{post.title}</Link>
                    </h6>
                  </div>
                  <ul className="fpg-post-meta">
                    <li>
                      <span className="fpg-meta">
                        <span>
                          {t("common.by")}{" "}
                          <span className="fpg-author-link">
                            {post.authorName}
                          </span>
                        </span>
                      </span>
                    </li>
                    <li>
                      <span className="fpg-meta">
                        <i className="ri-pulse-fill" /> {post.views} {t("common.views")}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            ))}
            <InFeedNativeAd position="in-feed-1" cardStyle="hero-recent" />
          </div>
        </div>
      </div>
    </section>
  );
}
