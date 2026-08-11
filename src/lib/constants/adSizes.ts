/**
 * IAB Standard Ad Sizes & Container Configuration
 * Reference: https://www.dimensions.com/element/medium-rectangle-ad-300-x-250
 *
 * Container sizes are 20px larger than creatives (10px padding each side)
 * to allow user adjustment within the slot.
 */

export interface AdSizePreset {
  /** Human-readable name */
  name: string;
  /** IAB standard name */
  iabName: string;
  /** Creative width in px */
  width: number;
  /** Creative height in px */
  height: number;
  /** Container width (creative + 20px) */
  containerWidth: number;
  /** Container height (creative + 20px) */
  containerHeight: number;
  /** Category for grouping (banner, rectangle, skyscraper, mobile, billboard) */
  category: "banner" | "rectangle" | "skyscraper" | "mobile" | "billboard" | "native";
  /** Aspect ratio string */
  aspectRatio: string;
  /** Whether this size is recommended for mobile viewports */
  mobileCompatible: boolean;
  /** Whether this size is recommended for tablet viewports */
  tabletCompatible: boolean;
  /** Description / common use case */
  description: string;
}

export const AD_SIZE_PRESETS: AdSizePreset[] = [
  // ─── Rectangles ─────────────────────────────────────
  {
    name: "Medium Rectangle",
    iabName: "Medium Rectangle",
    width: 300,
    height: 250,
    containerWidth: 320,
    containerHeight: 270,
    category: "rectangle",
    aspectRatio: "6:5",
    mobileCompatible: true,
    tabletCompatible: true,
    description: "Most popular ad unit; works in-content, sidebar, and feeds",
  },
  {
    name: "Large Rectangle",
    iabName: "Large Rectangle",
    width: 336,
    height: 280,
    containerWidth: 356,
    containerHeight: 300,
    category: "rectangle",
    aspectRatio: "6:5",
    mobileCompatible: true,
    tabletCompatible: true,
    description: "Slightly larger format for premium content placements",
  },
  {
    name: "Square",
    iabName: "Square",
    width: 250,
    height: 250,
    containerWidth: 270,
    containerHeight: 270,
    category: "rectangle",
    aspectRatio: "1:1",
    mobileCompatible: true,
    tabletCompatible: true,
    description: "Standard square ad ideal for sidebar and in-feed positions",
  },
  {
    name: "Small Square",
    iabName: "Small Square",
    width: 200,
    height: 200,
    containerWidth: 220,
    containerHeight: 220,
    category: "rectangle",
    aspectRatio: "1:1",
    mobileCompatible: true,
    tabletCompatible: true,
    description: "Compact square unit for tight spaces",
  },

  // ─── Banners ────────────────────────────────────────
  {
    name: "Leaderboard",
    iabName: "Leaderboard",
    width: 728,
    height: 90,
    containerWidth: 748,
    containerHeight: 110,
    category: "banner",
    aspectRatio: "8:1",
    mobileCompatible: false,
    tabletCompatible: true,
    description: "Classic top-of-page banner; highest visibility on desktop",
  },
  {
    name: "Full Banner",
    iabName: "Full Banner",
    width: 468,
    height: 60,
    containerWidth: 488,
    containerHeight: 80,
    category: "banner",
    aspectRatio: "8:1",
    mobileCompatible: false,
    tabletCompatible: true,
    description: "Traditional banner format for mid-page placements",
  },
  {
    name: "Half Banner",
    iabName: "Half Banner",
    width: 234,
    height: 60,
    containerWidth: 254,
    containerHeight: 80,
    category: "banner",
    aspectRatio: "4:1",
    mobileCompatible: true,
    tabletCompatible: true,
    description: "Compact banner for inline use",
  },
  {
    name: "Large Leaderboard",
    iabName: "Large Leaderboard",
    width: 970,
    height: 90,
    containerWidth: 990,
    containerHeight: 110,
    category: "banner",
    aspectRatio: "11:1",
    mobileCompatible: false,
    tabletCompatible: false,
    description: "Extra-wide top-of-page leaderboard for wide desktop layouts",
  },

  // ─── Billboards ─────────────────────────────────────
  {
    name: "Billboard",
    iabName: "Billboard",
    width: 970,
    height: 250,
    containerWidth: 990,
    containerHeight: 270,
    category: "billboard",
    aspectRatio: "4:1",
    mobileCompatible: false,
    tabletCompatible: false,
    description: "High-impact takeover ad for premium campaigns",
  },

  // ─── Skyscrapers ────────────────────────────────────
  {
    name: "Half Page / Large Skyscraper",
    iabName: "Half Page Ad",
    width: 300,
    height: 600,
    containerWidth: 320,
    containerHeight: 620,
    category: "skyscraper",
    aspectRatio: "1:2",
    mobileCompatible: false,
    tabletCompatible: true,
    description: "High-profile sidebar ad; strong viewability metrics",
  },
  {
    name: "Wide Skyscraper",
    iabName: "Wide Skyscraper",
    width: 160,
    height: 600,
    containerWidth: 180,
    containerHeight: 620,
    category: "skyscraper",
    aspectRatio: "4:15",
    mobileCompatible: false,
    tabletCompatible: false,
    description: "Standard sidebar skyscraper",
  },
  {
    name: "Skyscraper",
    iabName: "Skyscraper",
    width: 120,
    height: 600,
    containerWidth: 140,
    containerHeight: 620,
    category: "skyscraper",
    aspectRatio: "1:5",
    mobileCompatible: false,
    tabletCompatible: false,
    description: "Narrow sidebar skyscraper",
  },

  // ─── Mobile ─────────────────────────────────────────
  {
    name: "Mobile Banner",
    iabName: "Mobile Banner",
    width: 320,
    height: 50,
    containerWidth: 340,
    containerHeight: 70,
    category: "mobile",
    aspectRatio: "32:5",
    mobileCompatible: true,
    tabletCompatible: true,
    description: "Standard mobile top/bottom banner",
  },
  {
    name: "Large Mobile Banner",
    iabName: "Large Mobile Banner",
    width: 320,
    height: 100,
    containerWidth: 340,
    containerHeight: 120,
    category: "mobile",
    aspectRatio: "16:5",
    mobileCompatible: true,
    tabletCompatible: true,
    description: "Double-height mobile banner for more creative room",
  },
  {
    name: "Mobile Interstitial",
    iabName: "Mobile Interstitial",
    width: 320,
    height: 480,
    containerWidth: 340,
    containerHeight: 500,
    category: "mobile",
    aspectRatio: "2:3",
    mobileCompatible: true,
    tabletCompatible: true,
    description: "Full-screen mobile interstitial ad",
  },

  // ─── Native ─────────────────────────────────────────
  {
    name: "Native Feed Ad",
    iabName: "Native",
    width: 360,
    height: 400,
    containerWidth: 380,
    containerHeight: 420,
    category: "native",
    aspectRatio: "16:10",
    mobileCompatible: true,
    tabletCompatible: true,
    description: "Responsive native ad that matches the website article card style",
  },
];

/**
 * Get all size presets for a given category
 */
export function getPresetsByCategory(category: AdSizePreset["category"]): AdSizePreset[] {
  return AD_SIZE_PRESETS.filter((p) => p.category === category);
}

/**
 * Get all mobile-compatible sizes
 */
export function getMobileCompatiblePresets(): AdSizePreset[] {
  return AD_SIZE_PRESETS.filter((p) => p.mobileCompatible);
}

/**
 * Get all tablet-compatible sizes
 */
export function getTabletCompatiblePresets(): AdSizePreset[] {
  return AD_SIZE_PRESETS.filter((p) => p.tabletCompatible);
}

/**
 * Find a preset that matches the given dimensions
 */
export function findMatchingPreset(width: number, height: number): AdSizePreset | undefined {
  return AD_SIZE_PRESETS.find((p) => p.width === width && p.height === height);
}

/**
 * Determine if creative dimensions fit within a given container
 */
export function getCreativeFitStatus(
  creativeWidth: number,
  creativeHeight: number,
  containerWidth: number,
  containerHeight: number
): "within-bounds" | "oversized" | "undersized" {
  if (creativeWidth > containerWidth || creativeHeight > containerHeight) {
    return "oversized";
  }
  // If creative is less than 50% of container in either dimension, it's undersized
  if (creativeWidth < containerWidth * 0.5 || creativeHeight < containerHeight * 0.5) {
    return "undersized";
  }
  return "within-bounds";
}

/**
 * Check responsive fit: does the creative fit on each viewport?
 * Returns errors/warnings for viewports where it doesn't fit.
 */
export interface ResponsiveFitResult {
  desktop: { fits: boolean; message: string };
  tablet: { fits: boolean; message: string };
  mobile: { fits: boolean; message: string };
}

export function checkResponsiveFit(
  creativeWidth: number,
  creativeHeight: number,
  selectedPreset?: AdSizePreset
): ResponsiveFitResult {
  const DESKTOP_MAX_WIDTH = 1200;
  const TABLET_MAX_WIDTH = 768;
  const MOBILE_MAX_WIDTH = 480;

  const fitsDesktop = creativeWidth <= DESKTOP_MAX_WIDTH;
  const fitsTablet = creativeWidth <= TABLET_MAX_WIDTH;
  const fitsMobile = creativeWidth <= MOBILE_MAX_WIDTH;

  return {
    desktop: {
      fits: fitsDesktop,
      message: fitsDesktop
        ? "Creative fits desktop viewport"
        : `Creative is ${creativeWidth - DESKTOP_MAX_WIDTH}px wider than maximum desktop width`,
    },
    tablet: {
      fits: fitsTablet,
      message: fitsTablet
        ? "Creative fits tablet viewport"
        : selectedPreset?.tabletCompatible === false
        ? "This ad size is not recommended for tablets. Consider a mobile-compatible size."
        : `Creative (${creativeWidth}px) exceeds tablet viewport (${TABLET_MAX_WIDTH}px). It will be auto-scaled or you should choose a smaller size.`,
    },
    mobile: {
      fits: fitsMobile,
      message: fitsMobile
        ? "Creative fits mobile viewport"
        : selectedPreset?.mobileCompatible === false
        ? "This ad size is not recommended for mobile. Use a mobile-specific size (320×50 or 320×100)."
        : `Creative (${creativeWidth}px) exceeds mobile viewport (${MOBILE_MAX_WIDTH}px). Auto-scaling will be applied.`,
    },
  };
}

/**
 * Position-specific size configuration with expanded real-world presets
 * Each position has recommended sizes and container dimensions set 20px larger
 */
export const POSITION_SIZE_CONFIG: Record<
  string,
  {
    desktop: { width: number; height: number };
    tablet: { width: number; height: number };
    mobile: { width: number; height: number };
    containerDesktop: { width: number; height: number };
    containerTablet: { width: number; height: number };
    containerMobile: { width: number; height: number };
    label: string;
    recommendedPresets: string[]; // names from AD_SIZE_PRESETS
  }
> = {
  // ── Banner positions ─────────────────────────────────────
  "top-leaderboard": {
    desktop: { width: 728, height: 90 },
    tablet: { width: 468, height: 60 },
    mobile: { width: 320, height: 50 },
    containerDesktop: { width: 748, height: 110 },
    containerTablet: { width: 488, height: 80 },
    containerMobile: { width: 340, height: 70 },
    label: "Desktop 728×90 / Tablet 468×60 / Mobile 320×50 — Above the fold, highest visibility",
    recommendedPresets: ["Leaderboard", "Full Banner", "Mobile Banner"],
  },
  "mid-leaderboard-1": {
    desktop: { width: 728, height: 90 },
    tablet: { width: 468, height: 60 },
    mobile: { width: 320, height: 50 },
    containerDesktop: { width: 748, height: 110 },
    containerTablet: { width: 488, height: 80 },
    containerMobile: { width: 340, height: 70 },
    label: "Desktop 728×90 / Tablet 468×60 / Mobile 320×50 — Between Hero ↔ Hotels sections",
    recommendedPresets: ["Leaderboard", "Full Banner", "Mobile Banner"],
  },
  "mid-leaderboard-2": {
    desktop: { width: 728, height: 90 },
    tablet: { width: 468, height: 60 },
    mobile: { width: 320, height: 50 },
    containerDesktop: { width: 748, height: 110 },
    containerTablet: { width: 488, height: 80 },
    containerMobile: { width: 340, height: 70 },
    label: "Desktop 728×90 / Tablet 468×60 / Mobile 320×50 — Between Hotels ↔ Travel Intelligence",
    recommendedPresets: ["Leaderboard", "Full Banner", "Mobile Banner"],
  },
  "mid-leaderboard-3": {
    desktop: { width: 728, height: 90 },
    tablet: { width: 468, height: 60 },
    mobile: { width: 320, height: 50 },
    containerDesktop: { width: 748, height: 110 },
    containerTablet: { width: 488, height: 80 },
    containerMobile: { width: 340, height: 70 },
    label: "Desktop 728×90 / Tablet 468×60 / Mobile 320×50 — Between Travel Intelligence ↔ Destinations",
    recommendedPresets: ["Leaderboard", "Full Banner", "Mobile Banner"],
  },
  "mid-leaderboard-4": {
    desktop: { width: 728, height: 90 },
    tablet: { width: 468, height: 60 },
    mobile: { width: 320, height: 50 },
    containerDesktop: { width: 748, height: 110 },
    containerTablet: { width: 488, height: 80 },
    containerMobile: { width: 340, height: 70 },
    label: "Desktop 728×90 / Tablet 468×60 / Mobile 320×50 — Between Destinations ↔ Flights",
    recommendedPresets: ["Leaderboard", "Full Banner", "Mobile Banner"],
  },
  "bottom-leaderboard": {
    desktop: { width: 728, height: 90 },
    tablet: { width: 468, height: 60 },
    mobile: { width: 320, height: 50 },
    containerDesktop: { width: 748, height: 110 },
    containerTablet: { width: 488, height: 80 },
    containerMobile: { width: 340, height: 70 },
    label: "Desktop 728×90 / Tablet 468×60 / Mobile 320×50 — Below last content section",
    recommendedPresets: ["Leaderboard", "Full Banner", "Mobile Banner"],
  },
  "sticky-footer": {
    desktop: { width: 728, height: 90 },
    tablet: { width: 468, height: 60 },
    mobile: { width: 320, height: 50 },
    containerDesktop: { width: 748, height: 110 },
    containerTablet: { width: 488, height: 80 },
    containerMobile: { width: 340, height: 70 },
    label: "Desktop 728×90 / Tablet 468×60 / Mobile 320×50 — Persistent at bottom of viewport",
    recommendedPresets: ["Leaderboard", "Full Banner", "Mobile Banner"],
  },
  "atf-rectangle": {
    desktop: { width: 728, height: 90 },
    tablet: { width: 468, height: 60 },
    mobile: { width: 320, height: 50 },
    containerDesktop: { width: 748, height: 110 },
    containerTablet: { width: 488, height: 80 },
    containerMobile: { width: 340, height: 70 },
    label: "Desktop 728×90 / Tablet 468×60 / Mobile 320×50 — Banner below FeaturedImage, above ArticleTitle",
    recommendedPresets: ["Leaderboard", "Full Banner", "Mobile Banner"],
  },

  // ── Homepage In-Feed Native ──────────────────────────────
  "in-feed-1": {
    desktop: { width: 360, height: 400 },
    tablet: { width: 320, height: 380 },
    mobile: { width: 320, height: 380 },
    containerDesktop: { width: 380, height: 420 },
    containerTablet: { width: 340, height: 400 },
    containerMobile: { width: 340, height: 400 },
    label: "Hero Recent News — .hero-recent-grid — matches recent news cards (300×149 img + pill + title)",
    recommendedPresets: ["Native Feed Ad", "Medium Rectangle", "Large Rectangle"],
  },
  "in-feed-2": {
    desktop: { width: 360, height: 400 },
    tablet: { width: 320, height: 380 },
    mobile: { width: 320, height: 380 },
    containerDesktop: { width: 380, height: 420 },
    containerTablet: { width: 340, height: 400 },
    containerMobile: { width: 340, height: 400 },
    label: "Hero Slider — .hero-featured-cards Swiper — matches slider cards (300×149 img + pill + title)",
    recommendedPresets: ["Native Feed Ad", "Medium Rectangle", "Large Rectangle"],
  },
  "in-feed-3": {
    desktop: { width: 380, height: 100 },
    tablet: { width: 340, height: 95 },
    mobile: { width: 340, height: 95 },
    containerDesktop: { width: 400, height: 120 },
    containerTablet: { width: 360, height: 115 },
    containerMobile: { width: 360, height: 115 },
    label: "Hotels Side Cards — breaking-section right column — matches side posts (100×85 thumb + badge)",
    recommendedPresets: ["Native Feed Ad", "Medium Rectangle"],
  },
  "in-feed-4": {
    desktop: { width: 360, height: 400 },
    tablet: { width: 320, height: 380 },
    mobile: { width: 320, height: 380 },
    containerDesktop: { width: 380, height: 420 },
    containerTablet: { width: 340, height: 400 },
    containerMobile: { width: 340, height: 400 },
    label: "Hotels Carousel — breaking-section .fpg-post-slider Swiper — matches carousel slides (16:10 img)",
    recommendedPresets: ["Native Feed Ad", "Medium Rectangle", "Large Rectangle"],
  },
  "in-feed-5": {
    desktop: { width: 380, height: 130 },
    tablet: { width: 340, height: 125 },
    mobile: { width: 340, height: 125 },
    containerDesktop: { width: 400, height: 150 },
    containerTablet: { width: 360, height: 145 },
    containerMobile: { width: 360, height: 145 },
    label: "Travel Intel Left — video-news-section left column — matches side cards (112×112 thumb + pill)",
    recommendedPresets: ["Native Feed Ad", "Medium Rectangle"],
  },
  "in-feed-6": {
    desktop: { width: 380, height: 130 },
    tablet: { width: 340, height: 125 },
    mobile: { width: 340, height: 125 },
    containerDesktop: { width: 400, height: 150 },
    containerTablet: { width: 360, height: 145 },
    containerMobile: { width: 360, height: 145 },
    label: "Travel Intel Right — video-news-section right column — matches side cards (112×112 thumb + pill)",
    recommendedPresets: ["Native Feed Ad", "Medium Rectangle"],
  },
  "in-feed-7": {
    desktop: { width: 380, height: 160 },
    tablet: { width: 340, height: 155 },
    mobile: { width: 340, height: 155 },
    containerDesktop: { width: 400, height: 180 },
    containerTablet: { width: 360, height: 175 },
    containerMobile: { width: 360, height: 175 },
    label: "Destinations Grid — top-of-week-section 2-col grid — matches ArticleCard (200×130 thumb + pill)",
    recommendedPresets: ["Native Feed Ad", "Medium Rectangle"],
  },
  "in-feed-8": {
    desktop: { width: 340, height: 80 },
    tablet: { width: 300, height: 75 },
    mobile: { width: 300, height: 75 },
    containerDesktop: { width: 360, height: 100 },
    containerTablet: { width: 320, height: 95 },
    containerMobile: { width: 320, height: 95 },
    label: "Destinations Tabs — top-of-week-section sidebar TabWidget — matches tab items (65×65 square-radius)",
    recommendedPresets: ["Native Feed Ad", "Small Square"],
  },
  "in-feed-9": {
    desktop: { width: 380, height: 160 },
    tablet: { width: 340, height: 155 },
    mobile: { width: 340, height: 155 },
    containerDesktop: { width: 400, height: 180 },
    containerTablet: { width: 360, height: 175 },
    containerMobile: { width: 360, height: 175 },
    label: "Flights Small Cards — top-stories-section right column — matches small cards (180×130 thumb + pill)",
    recommendedPresets: ["Native Feed Ad", "Medium Rectangle"],
  },
  "in-feed-x": {
    desktop: { width: 360, height: 400 },
    tablet: { width: 320, height: 380 },
    mobile: { width: 320, height: 380 },
    containerDesktop: { width: 380, height: 420 },
    containerTablet: { width: 340, height: 400 },
    containerMobile: { width: 340, height: 400 },
    label: "Repeating Native — Adaptive card matching surrounding feed",
    recommendedPresets: ["Native Feed Ad", "Medium Rectangle", "Large Rectangle"],
  },

  // ── Article Page In-Feed Native ──────────────────────────
  "in-content-1": {
    desktop: { width: 660, height: 200 },
    tablet: { width: 600, height: 180 },
    mobile: { width: 340, height: 180 },
    containerDesktop: { width: 680, height: 220 },
    containerTablet: { width: 620, height: 200 },
    containerMobile: { width: 360, height: 200 },
    label: "Article body after para 2 — Full-width native matching news-grid",
    recommendedPresets: ["Native Feed Ad", "Large Rectangle"],
  },
  "in-content-2": {
    desktop: { width: 660, height: 200 },
    tablet: { width: 600, height: 180 },
    mobile: { width: 340, height: 180 },
    containerDesktop: { width: 680, height: 220 },
    containerTablet: { width: 620, height: 200 },
    containerMobile: { width: 360, height: 200 },
    label: "Article body after para 4 — Full-width native matching news-grid",
    recommendedPresets: ["Native Feed Ad", "Large Rectangle"],
  },
  "sidebar-sticky": {
    desktop: { width: 340, height: 100 },
    tablet: { width: 300, height: 95 },
    mobile: { width: 300, height: 95 },
    containerDesktop: { width: 360, height: 120 },
    containerTablet: { width: 320, height: 115 },
    containerMobile: { width: 320, height: 115 },
    label: "Sidebar below TabWidget — Native matching circular thumb cards (85×85 circle + title)",
    recommendedPresets: ["Native Feed Ad", "Medium Rectangle"],
  },
  "follow-native": {
    desktop: { width: 260, height: 55 },
    tablet: { width: 240, height: 50 },
    mobile: { width: 240, height: 50 },
    containerDesktop: { width: 280, height: 75 },
    containerTablet: { width: 260, height: 70 },
    containerMobile: { width: 260, height: 70 },
    label: "FollowWidget 4th slot — Native matching social cards (colored bg + icon + name + followers)",
    recommendedPresets: ["Native Feed Ad", "Half Banner"],
  },
  "in-feed-related": {
    desktop: { width: 360, height: 400 },
    tablet: { width: 320, height: 380 },
    mobile: { width: 320, height: 380 },
    containerDesktop: { width: 380, height: 420 },
    containerTablet: { width: 340, height: 400 },
    containerMobile: { width: 340, height: 400 },
    label: "RelatedPosts carousel — Native card matching related slides (200px image + badge + title)",
    recommendedPresets: ["Native Feed Ad", "Medium Rectangle", "Large Rectangle"],
  },

  // ── Sidebar In-Feed Native ────────────────────────────────
  "sidebar-in-feed": {
    desktop: { width: 340, height: 100 },
    tablet: { width: 300, height: 95 },
    mobile: { width: 300, height: 95 },
    containerDesktop: { width: 360, height: 120 },
    containerTablet: { width: 320, height: 115 },
    containerMobile: { width: 320, height: 115 },
    label: "Article sidebar between widgets — Native feed ad",
    recommendedPresets: ["Native Feed Ad", "Medium Rectangle"],
  },

  // ── Header Offcanvas ──────────────────────────────────────
  "header-offcanvas": {
    desktop: { width: 300, height: 250 },
    tablet: { width: 300, height: 250 },
    mobile: { width: 300, height: 250 },
    containerDesktop: { width: 320, height: 270 },
    containerTablet: { width: 320, height: 270 },
    containerMobile: { width: 320, height: 270 },
    label: "Hamburger overlay menu below gallery — Banner/native ad",
    recommendedPresets: ["Medium Rectangle", "Native Feed Ad"],
  },
};
