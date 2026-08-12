"use client";

import { useEffect, useState } from "react";
import { getSocialSettingsAction } from "@/lib/actions/settings";
import { useLocale } from "@/hooks/useLocale";

export interface SocialLinkData {
  name: string;
  icon: "facebook" | "twitter" | "instagram" | "youtube" | "linkedin" | "dribbble" | "pinterest";
  url: string;
  followers: string;
}

const networkToIcon: Record<string, SocialLinkData["icon"]> = {
  facebook: "facebook",
  twitter: "twitter",
  x: "twitter",
  instagram: "instagram",
  youtube: "youtube",
  linkedin: "linkedin",
  dribbble: "dribbble",
  pinterest: "pinterest",
};

const defaultSocials: SocialLinkData[] = [
  { name: "Facebook", icon: "facebook", url: "https://cockpit.travel", followers: "125K Fans" },
  { name: "Twitter - X", icon: "twitter", url: "https://cockpit.travel", followers: "89K Followers" },
  { name: "Dribbble", icon: "dribbble", url: "https://cockpit.travel", followers: "39.5k Followers" },
  { name: "Pinterest", icon: "pinterest", url: "https://cockpit.travel", followers: "28.2k Followers" },
  { name: "Linkedin", icon: "linkedin", url: "https://cockpit.travel", followers: "30.3k Followers" },
  { name: "Instagram", icon: "instagram", url: "https://cockpit.travel", followers: "24.5k Followers" },
];

export function useSocialLinks() {
  const locale = useLocale();
  const [socialLinks, setSocialLinks] = useState<SocialLinkData[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const result = await getSocialSettingsAction();
      if (cancelled) return;

      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        const mapped = result.data
          .map((item: { name?: string; network?: string; url?: string; count?: string; label?: string }) => ({
            name: item.name || item.label || item.network || "",
            icon: networkToIcon[item.network || ""] || "facebook",
            url: item.url || "https://cockpit.travel",
            followers: item.count ? `${item.count} ${item.label || "Followers"}`.trim() : "",
          }))
          .filter((s: SocialLinkData) => s.name);
        setSocialLinks(mapped);
      } else {
        setSocialLinks(defaultSocials);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return { socialLinks };
}