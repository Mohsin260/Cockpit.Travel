import { useTranslations } from "@/hooks/useTranslations";

const fallbackImages: Record<string, string> = {
  Hotels: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
  Flights: "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=400&h=300&fit=crop",
  Destinations: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop",
  Traveling: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
  "Travel Intelligence": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
};

export default function CategoriesWidget({
  categories,
}: {
  categories: { name: string; count: number; href: string; image?: string }[];
}) {
  const t = useTranslations();
  return (
    <div>
      <div className="flex items-center gap-[10px] mb-[20px]">
        <h3 className="font-title text-black text-[18px] font-bold whitespace-nowrap">
          {t("sidebar.exploreCategories")}
        </h3>
        <span className="w-[8px] h-[8px] rotate-45 bg-[#0073FF] flex-shrink-0"></span>
        <div className="flex-1 flex flex-col gap-[4px]">
          <div className="h-[2px] bg-[#E5E5E5]"></div>
          <div className="h-[2px] bg-[#E5E5E5]"></div>
        </div>
      </div>
      <div className="fpg-post-categories fpg-post-categories-two flex flex-col gap-[8px]">
        {categories.map((cat) => {
          const bgImage = cat.image || fallbackImages[cat.name] || "/assets/images/top-week/tabs/tab-1.jpg";
          return (
            <a
              key={cat.name}
              href={cat.href}
              className="fpg-cat-item relative rounded-[6px] overflow-hidden block group"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundPosition: "50%",
                backgroundSize: "cover",
              }}
            >
              <div className="absolute inset-0 bg-black/50 transition-all duration-300 group-hover:bg-[#0073FF]/80" />
              <div className="fpg-cat-content relative z-[1] flex items-center justify-between p-[14px_16px] text-white">
                <div className="fpg-cat-text-wrapper flex items-center gap-[6px]">
                  <h6 className="fpg-cat-title text-[15px] font-semibold text-white m-0 leading-none">
                    {cat.name}
                  </h6>
                  <span className="fpg-cat-count text-[13px] text-white/80">({cat.count})</span>
                </div>
                <div className="fpg-cat-btn flex items-center justify-center w-[30px] h-[30px] rounded-[2px] bg-white/20 text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                  <span className="relative inline-flex items-center justify-center overflow-hidden">
                    <i className="ri-arrow-right-line transition-all duration-300 group-hover:translate-x-[150%]"></i>
                    <i className="ri-arrow-right-line absolute transition-all duration-300 -translate-x-[150%] group-hover:translate-x-0"></i>
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
