import { useTranslations } from "@/hooks/useTranslations";

export default function TagsWidget({ tags }: { tags: string[] }) {
  const t = useTranslations();
  return (
    <div>
      <div className="flex items-center gap-[10px] mb-[20px]">
        <h3 className="font-title text-black text-[18px] font-bold whitespace-nowrap">
          {t("sidebar.tags")}
        </h3>
        <span className="w-[8px] h-[8px] rotate-45 bg-[#0073FF] flex-shrink-0"></span>
        <div className="flex-1 flex flex-col gap-[4px]">
          <div className="h-[2px] bg-[#E5E5E5]"></div>
          <div className="h-[2px] bg-[#E5E5E5]"></div>
        </div>
      </div>
      <div className="ultimate-tag-cloud-container style-default">
        <div className="ultimate-tag-cloud-words default flex flex-wrap justify-start gap-[8px]">
          {tags.map((tag) => (
            <div key={tag} className="tag-word-wrap">
              <a
                href="#"
                className="ultimate-tag-cloud-word inline-block px-[14px] py-[8px] text-[14px] font-medium text-gray-500 bg-white border border-[#e8e8e8] rounded-[6px] hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-sm"
              >
                {tag}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}