"use client";

import { useTranslations } from "@/hooks/useTranslations";

export default function Subscribe() {
  const t = useTranslations();

  return (
    <section className="pb-[100px] bg-white dark:bg-[#0a0a0a]">
      <div className="nerio-container">
        <div
          className="relative overflow-hidden rounded-[12px] min-h-[200px]"
          style={{
            background:
              "radial-gradient(circle at left,#2b506f 0%,#14284b 45%,#08111f 100%)",
          }}
        >
          <div
            className="hidden lg:block absolute top-[35px] right-[420px] w-[90px] h-[55px] opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle,#9fa9b5 1.5px,transparent 1.5px)",
              backgroundSize: "12px 12px",
            }}
          />

          <div className="relative z-[2] flex items-center justify-between px-[24px] md:px-[40px] py-[38px]">
            <div className="w-full max-w-[470px] relative z-10">
              <h3 className="text-white text-[22px] md:text-[24px] font-bold leading-none mb-[22px]">
                {t("newsletter.title")}
              </h3>

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="relative flex items-center bg-white rounded-[8px] shadow-lg h-[58px] p-[4px]">
                  <input
                    type="email"
                    required
                    placeholder={t("newsletter.emailPlaceholder")}
                    className="w-full h-full bg-transparent outline-none border-none pl-[18px] pr-[150px] text-[15px] text-[#1f2937] placeholder:text-[#9b9b9b]"
                  />
                  <button
                    type="submit"
                    className="absolute right-[4px] top-[4px] bottom-[4px] px-[26px] rounded-[6px] bg-[#0d6efd] hover:bg-[#0052cc] transition-all duration-300 inline-flex items-center justify-center gap-2 text-white font-medium text-[15px]"
                  >
                    <span>{t("newsletter.subscribe")}</span>
                    <span className="inline-flex items-center overflow-hidden w-[16px] h-[16px] relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 18 12"
                        className="absolute w-[16px] h-[12px] fill-current"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z"
                        />
                      </svg>
                    </span>
                  </button>
                </div>

                <label className="flex items-center gap-[8px] mt-[16px] text-white text-[14px] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    className="w-[15px] h-[15px] rounded-[3px] border border-white/50 bg-transparent accent-[#0d6efd]"
                  />
                  <span>
                    {t("newsletter.subscribe")}{" "}
                    <a
                      href="/terms-of-service"
                      className="underline hover:opacity-70 transition-opacity"
                    >
                      {t("footer.termsAgreements")}
                    </a>
                  </span>
                </label>
              </form>
            </div>

            <div className="hidden md:block absolute inset-y-0 right-0 w-[60%] overflow-hidden pointer-events-none">
              <img
                src="/assets/images/subscribe/cta-thumb-01.png"
                alt=""
                className="absolute right-[-15px] top-1/2 -translate-y-1/2 w-[720px] max-w-none object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
