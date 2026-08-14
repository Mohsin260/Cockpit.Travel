"use client";

import Link from "next/link";

import { useTranslations } from "@/hooks/useTranslations";

const ArrowIcon = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 12"
    className={`subscribe-arrow absolute left-0 top-0 h-[18px] w-[18px] transition-transform duration-300 group-hover:fill-[#0073FF] ${className}`}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z"
    />
  </svg>
);

function SubscribeArrows() {
  return (
    <span className="subscribe-arrows pointer-events-none absolute right-[14px] top-1/2 flex h-[18px] w-[18px] -translate-y-1/2 items-center justify-center overflow-hidden">
      <ArrowIcon className="fill-white group-hover:translate-x-[150%]" />
      <ArrowIcon className="-translate-x-[150%] fill-white group-hover:translate-x-0" />
    </span>
  );
}

export default function Subscribe() {
  const t = useTranslations();

  return (
    <section className="bg-white pb-[80px]">
      <div className="nerio-container">
        <div
          className="relative overflow-hidden rounded-[8px]"
          style={{
            backgroundColor: "#171A1E",
            backgroundImage: "url(/assets/images/subscribe/bg.jpg)",
            backgroundPosition: "top center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div className="relative z-[2] ps-[10px] pe-[10px] py-[25px] md:ps-[20px] md:pe-0 md:py-[40px] lg:ps-[65px] lg:pe-[65px]">
            <h3 className="mb-[24px] text-white text-[20px] font-semibold leading-[1.3] tracking-[0.3px] md:text-[24px] lg:text-[28px]">
              {t("newsletter.title")}
            </h3>

            <form
              className="relative w-full md:w-[90%]"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="subscribe-form-row relative flex h-[52px] w-full items-stretch overflow-hidden rounded-[6px] border border-[#E5E5E5] bg-white sm:w-[520px]">
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={t("newsletter.emailPlaceholder")}
                  className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent ps-[20px] pe-[20px] text-[15px] text-[#616C74] outline-none placeholder:text-[#616C74]"
                />
                <button
                  type="submit"
                  className="group relative z-10 inline-flex shrink-0 items-center justify-center rounded-none bg-[#0073FF] px-[50px] text-[16px] font-semibold text-white transition-colors duration-300 cursor-pointer hover:bg-[#005FCC] focus:outline-none focus:ring-2 focus:ring-[#005FCC]"
                >
                  {t("newsletter.subscribe")}
                  <SubscribeArrows />
                </button>
              </div>

              <label className="mt-[20px] flex cursor-pointer select-none items-center gap-[8px] text-white">
                <input
                  type="checkbox"
                  required
                  className="h-[15px] w-[15px] shrink-0 rounded-[3px] border border-solid border-white/50 bg-transparent accent-[#B93C3C]"
                />
                <span className="text-[15px] font-normal">
                  {t("newsletter.consent")}{" "}
                  <Link
                    href="/terms-of-service"
                    className="underline transition-opacity hover:opacity-70"
                  >
                    {t("footer.termsAgreements")}
                  </Link>
                </span>
              </label>
            </form>
          </div>

          <img
            src="/assets/images/skiing-removebg-preview2.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute z-[5] end-[83px] -top-3 max-lg:top-[200px]"
          />
          <img
            src="/assets/images/subscribe/newsletter-dot.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute z-[5] right-[950px] top-[44px] max-lg:right-[300px] max-lg:top-5"
          />
        </div>
      </div>
    </section>
  );
}