"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Link from "next/link";
import InFeedNativeAd from "@/components/ads/InFeedNativeAd";
import { CARD_STYLES, getCssVars } from "@/components/ui/cardStyles";
import "swiper/css";
import "swiper/css/navigation";

interface RelatedArticle {
  slug: string;
  title: string;
  category: { label: string; color: string };
  author: string | { name: string; avatar: string; bio: string };
  views: string;
  date: string;
  featuredImage: string;
}

export default function RelatedPosts({ articles }: { articles: RelatedArticle[] }) {
  return (
    <div className="mb-[30px]">
      <div className="flex items-center justify-between mb-[20px]">
        <div className="flex items-center gap-[15px] flex-1 mr-[20px]">
          <h3 className="font-title text-black text-[22px] font-normal whitespace-nowrap hover:text-[#007AFF] transition-colors cursor-pointer">
            Related Post
          </h3>
          <div className="hidden sm:flex items-center flex-1 gap-[10px]">
            <span className="w-[8px] h-[8px] rotate-45 bg-[#007AFF] flex-shrink-0"></span>
            <div className="flex-1 flex flex-col gap-[4px]">
              <div className="h-[2px] bg-[#E5E7EB]"></div>
              <div className="h-[2px] bg-[#E5E7EB]"></div>
            </div>
            <span className="w-[8px] h-[8px] rotate-45 bg-[#007AFF] flex-shrink-0"></span>
          </div>
        </div>
        <div className="flex items-center gap-[10px]">
          <div className="related-prev w-[36px] h-[36px] rounded-[6px] border border-[#007AFF] bg-white flex items-center justify-center text-[#007AFF] cursor-pointer transition-all duration-300 hover:bg-[#007AFF] hover:text-white hover:border-[#007AFF]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </div>
          <div className="related-next w-[36px] h-[36px] rounded-[6px] border border-[#007AFF] bg-white flex items-center justify-center text-[#007AFF] cursor-pointer transition-all duration-300 hover:bg-[#007AFF] hover:text-white hover:border-[#007AFF]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <div className="rs-divider dot-enable">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation={{
            prevEl: ".related-prev",
            nextEl: ".related-next",
          }}
          loop
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="fpg-post-slider"
        >
          {articles.map((article) => {
            const authorName = typeof article.author === "string" ? article.author : article.author.name;
            return (
              <SwiperSlide key={article.slug} className="h-auto">
                <div className="fpg-card-style style-one flex flex-col bg-white p-[12px_12px_25px] border border-border rounded-[10px] gap-0 h-full group" style={getCssVars(CARD_STYLES["related-articles"])}>
                  <Link href={`/${article.slug}`} className="fpg-post-thumb w-full overflow-hidden block">
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </Link>
                  <div className="fpg-post-content flex-1 flex flex-col justify-between min-w-0 px-[15px]">
                    <div className="fpg-post-content-inner">
                      <div className="fpg-post-cat mt-[12px] mb-[7px]">
                        <span
                          className="post-cat inline-flex px-[10px] text-white font-medium text-[12px] uppercase leading-[22px] rounded-tl-none rounded-tr-[100px] rounded-br-[100px] rounded-bl-[70px]"
                          style={{ backgroundColor: article.category.color }}
                        >
                          {article.category.label}
                        </span>
                      </div>
                      <h6 className="fpg-post-title mt-[9px] mb-[7px]">
                        <Link href={`/${article.slug}`} className="text-[16px] font-semibold text-black leading-[1.4] line-clamp-2 bg-[length:0_1px] bg-left-bottom bg-no-repeat hover:text-primary hover:bg-[length:100%_1px] transition-all duration-300">
                          {article.title}
                        </Link>
                      </h6>
                    </div>
                    <ul className="fpg-post-meta flex items-center gap-[10px] text-[14px] text-body">
                      <li>
                        <span className="fpg-meta">
                          By <Link href="#" className="text-gray-600 hover:text-[#007AFF] transition-colors duration-300">{authorName}</Link>
                        </span>
                      </li>
                      <li>
                        <span className="fpg-meta">{article.views} Views</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
          <SwiperSlide className="h-auto">
            <InFeedNativeAd position="in-feed-related" cardStyle="related-articles" pageType="article" />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}