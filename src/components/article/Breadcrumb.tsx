import Link from "next/link";
import { translate } from "@/lib/translate";

export default function Breadcrumb({
  category,
  title,
}: {
  category: { label: string; color: string };
  title?: string;
}) {
  return (
    <section className="pt-[0px] pb-[60px]">
      <div className="w-full">
        <div className="bg-[#f8f9fa] border-b border-t border-[#e8e8e8] px-[30px] py-[22px]">
          <nav className="rstb-breadcrumb flex items-center justify-start text-left flex-wrap gap-[8px] text-[14px] text-bodyColor">
            <span className="home-icon flex items-center leading-none">
              <svg
                viewBox="0 0 576 512"
                width="14"
                height="14"
                fill="currentColor"
              >
                <path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z" />
              </svg>
            </span>

            <Link
              href="/"
              className="hover:text-primaryColor transition-colors"
              title={translate("article.home")}
            >
              <span>{translate("article.home")}</span>
            </Link>

            <span className="item-separator flex items-center leading-none">
              <svg
                viewBox="0 0 18 12"
                width="10"
                height="7"
                fill="currentColor"
              >
                <path d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z" />
              </svg>
            </span>

            <Link
              href="/blog"
              className="hover:text-primaryColor transition-colors"
              title={translate("blogPage.title")}
            >
              <span>{translate("blogPage.title")}</span>
            </Link>

            <span className="item-separator flex items-center leading-none">
              <svg
                viewBox="0 0 18 12"
                width="10"
                height="7"
                fill="currentColor"
              >
                <path d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z" />
              </svg>
            </span>

            <Link
              href="/blog"
              className="hover:text-primaryColor transition-colors"
              title={`Go to the ${category.label} Category archives.`}
            >
              <span>{category.label}</span>
            </Link>

            {title && (
              <>
                <span className="item-separator flex items-center leading-none">
                  <svg
                    viewBox="0 0 18 12"
                    width="10"
                    height="7"
                    fill="currentColor"
                  >
                    <path d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z" />
                  </svg>
                </span>

                <span className="current-item text-primaryColor truncate max-w-[300px] sm:max-w-none text-left">
                  {title}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>
    </section>
  );
}