import Link from "next/link";
import InFeedNativeAd from "@/components/ads/InFeedNativeAd";
import { useTranslations } from "@/hooks/useTranslations";

const socialIcons: Record<string, { path: string; viewBox: string }> = {
  facebook: {
    path: "M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z",
    viewBox: "0 0 320 512",
  },
  twitter: {
    path: "M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z",
    viewBox: "0 0 512 512",
  },
  dribbble: {
    path: "M256 8C119.252 8 8 119.252 8 256s111.252 248 248 248 248-111.252 248-248S392.748 8 256 8zm163.97 114.366c29.503 36.046 47.369 81.957 47.835 131.955-6.984-1.477-77.018-15.682-147.502-6.818-5.752-14.041-11.181-26.393-18.617-41.614 78.321-31.977 113.818-77.482 118.284-83.523zM396.421 97.87c-3.81 5.427-35.697 48.286-111.021 76.519-34.712-63.776-73.185-116.168-79.04-124.008 67.176-16.193 137.966 1.27 190.061 47.489zm-230.48-33.25c5.585 7.659 43.438 60.116 78.537 122.509-99.087 26.313-186.36 25.934-195.834 25.809C62.38 147.205 106.678 92.573 165.941 64.62zM44.17 256.323c0-2.166.043-4.322.108-6.473 9.268.19 111.92 1.513 217.706-30.146 6.064 11.868 11.857 23.915 17.174 35.949-76.599 21.575-146.194 83.527-180.531 142.306C64.794 360.405 44.17 310.73 44.17 256.323zm81.807 167.113c22.127-45.233 82.178-103.622 167.579-132.756 29.74 77.283 42.039 142.053 45.189 160.638-68.112 29.013-150.015 21.053-212.768-27.882zm248.38 8.489c-2.171-12.886-13.446-74.897-41.152-151.033 66.38-10.626 124.7 6.768 131.947 9.055-9.442 58.941-43.273 109.844-90.795 141.978z",
    viewBox: "0 0 512 512",
  },
  pinterest: {
    path: "M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z",
    viewBox: "0 0 384 512",
  },
  linkedin: {
    path: "M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z",
    viewBox: "0 0 448 512",
  },
  instagram: {
    path: "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z",
    viewBox: "0 0 448 512",
  },
};

const cardColors: Record<string, string> = {
  facebook: "#0073FF",
  twitter: "#121213",
  dribbble: "#F53E82",
  pinterest: "#AF091C",
  linkedin: "#0077B5",
  instagram: "linear-gradient(29deg, #BE08AF 0%, #F10811 100%)",
};

export default function FollowWidget({
  socialCards,
}: {
  socialCards: { name: string; followers: string; color: string; icon: string }[];
}) {
  const t = useTranslations();
  return (
    <div>
      <div className="flex items-center gap-[10px] mb-[20px]">
        <h4 className="elementor-heading-title text-[18px] font-bold text-black whitespace-nowrap">
          {t("sidebar.followUs")}
        </h4>
        <span className="w-[8px] h-[8px] rotate-45 bg-[#0073FF] flex-shrink-0"></span>
        <div className="flex-1 flex flex-col gap-[4px]">
          <div className="h-[2px] bg-[#E5E5E5]"></div>
          <div className="h-[2px] bg-[#E5E5E5]"></div>
        </div>
      </div>
      <div className="rs-social-menu style1">
        <div className="social-wrapper grid grid-cols-1 md:grid-cols-2 gap-[12px]">
          {socialCards.map((card) => {
            const icon = socialIcons[card.icon];
            const isInstagram = card.icon === "instagram";
            const cardStyle = isInstagram
              ? { background: cardColors[card.icon] }
              : { backgroundColor: cardColors[card.icon] || card.color };

            return (
              <a
                key={card.name}
                href="#"
                className="flex items-center relative p-[12px_15px] rounded-[6px] transition-opacity duration-300 hover:opacity-70"
                style={cardStyle}
              >
                <div dir="ltr" className="icon-wrapper flex items-center justify-center w-[30px] h-auto flex-shrink-0 me-[15px]">
                  {icon && (
                    <svg
                      aria-hidden="true"
                      viewBox={icon.viewBox}
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-[20px] h-[20px]"
                    >
                      <path fill="#FFFFFF" d={icon.path} />
                    </svg>
                  )}
                </div>
                <div className="content-wrapper flex flex-col">
                  <span className="text-wrapper text-[16px] font-bold text-white leading-tight">
                    {card.name}
                  </span>
                  <span className="sub-text text-[13px] font-medium text-white/90 mt-[2px]">
                    {card.followers}
                  </span>
                </div>
              </a>
            );
          })}
          {/* <InFeedNativeAd position="follow-native" cardStyle="social-card" pageType="article" /> */}
        </div>
      </div>
    </div>
  );
}