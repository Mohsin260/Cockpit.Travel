import { useTranslations } from "@/hooks/useTranslations";

export default function TagsWidget({ tags }: { tags: string[] }) {
  const t = useTranslations();
  return (
    <div>
      <h4 className="text-[20px] font-semibold text-[var(--titleColor)] mb-[20px] leading-[1.44]">
        {t("sidebar.tags")}
      </h4>
      <div className="ultimate-tag-cloud-container style-default">
        <div className="ultimate-tag-cloud-words default flex flex-wrap justify-start gap-[8px]">
          {tags.map((tag) => (
            <div key={tag} className="tag-word-wrap">
              <a
                href="#"
                className="ultimate-tag-cloud-word inline-block px-[15px] py-[5px] text-[14px] font-medium text-[var(--titleColor)] bg-transparent border border-[var(--borderColor)] rounded-[6px] hover:bg-[var(--primaryColor)] hover:text-white hover:border-[var(--primaryColor)] transition-all duration-300"
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