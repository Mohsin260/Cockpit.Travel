/**
 * Shared card styles and CSS-var helper
 *
 * Exported items:
 * - `CARD_STYLES`: named card layout presets used by article cards and native ads.
 * - `CardStyleKey`: union type of available style names.
 * - `CardStyle`: type for a single style entry.
 * - `getCssVars(style)`: returns inline CSS vars for image sizing used by wrappers.
 *
 * CSS variable contract (simple):
 * - --ad-thumb-w: image width
 * - --ad-thumb-h: image height
 * - --ad-thumb-radius: image border radius
 * - --ad-thumb-aspect: image aspect ratio (e.g. 16/10)
 *
 * Optional presentation vars (future):
 * - --ad-thumb-hover-scale, --ad-thumb-overlay, --ad-thumb-overlay-opacity,
 *   --ad-thumb-filter, --ad-thumb-transition
 */

import type { CSSProperties } from "react";

export const CARD_STYLES = {
    /** News Grid: compact image + title + date (matches hero-recent-grid cards 114x88) */
    "news-grid": {
        imageHeight: "88px",
        imageWidth: "114px",
        imageMb: "mb-2",
        imageRounded: true,
        imageRoundedValue: "8px",
        titleSize: "15px",
        titleLineHeight: "18px",
        showCategory: true,
        showExcerpt: false,
        showAuthor: false,
        showDate: false,
        showReadTime: false,
    },
    /** Hero Featured: medium thumbnail for carousel (approx 220x110) */
    "hero-featured": {
        imageHeight: "110px",
        imageWidth: "220px",
        imageMb: "mb-0",
        imageRounded: true,
        imageRoundedValue: "8px",
        cardRoundedValue: "10px",
        titleSize: "14px",
        titleLineHeight: "18px",
        showCategory: true,
        showExcerpt: false,
        showAuthor: false,
        showDate: false,
        showReadTime: false,
    },
    /** Hero Recent: horizontal card with 114x88 thumbnail (matches hero-recent-grid cards) */
    "hero-recent": {
        imageHeight: "100px",
        imageWidth: "124px",
        imageMb: "mb-0",
        imageRounded: true,
        imageRoundedValue: "8px",
        titleSize: "14px",
        titleLineHeight: "18px",
        showCategory: true,
        showExcerpt: false,
        showAuthor: false,
        showDate: false,
        showReadTime: false,
    },
    /** Sidebar text list: no image, title + category + excerpt (matches TopStories) */
    "sidebar-list": {
        imageHeight: "0",
        imageMb: "mb-0",
        imageRounded: false,
        titleSize: "18px",
        titleLineHeight: "24px",
        showCategory: true,
        showExcerpt: true,
        showAuthor: false,
        showDate: false,
        showReadTime: false,
    },
    /** Sidebar featured: 180px image + title + excerpt (matches Tech & Innovation / Editor's Picks) */
    "sidebar-featured": {
        imageHeight: "180px",
        imageMb: "mb-3",
        imageRounded: false,
        titleSize: "15px",
        titleLineHeight: "20px",
        showCategory: false,
        showExcerpt: true,
        showAuthor: false,
        showDate: false,
        showReadTime: false,
    },
    /** Latest Articles: horizontal card with 100x85 thumbnail (matches BreakingNews side posts) */
    "latest-articles": {
        imageHeight: "85px",
        imageWidth: "100px",
        imageMb: "mb-0",
        imageRounded: true,
        imageRoundedValue: "8px",
        cardRoundedValue: "8px",
        titleSize: "14px",
        titleLineHeight: "20px",
        showCategory: true,
        showExcerpt: false,
        showAuthor: true,
        showDate: false,
        showReadTime: false,
    },
    /** Hero side card: full-bleed image, no rounded, no margin (matches HeroSliderBlock) */
    "hero-side": {
        imageHeight: "100%",
        imageMb: "mb-0",
        imageRounded: false,
        titleSize: "17px",
        titleLineHeight: "24px",
        showCategory: true,
        showExcerpt: true,
        showAuthor: true,
        showDate: false,
        showReadTime: false,
    },
    /** Review list: 80x60 thumb + title + stars (matches Latest Reviews sidebar) */
    "review-list": {
        imageHeight: "60px",
        imageWidth: "80px",
        imageMb: "mb-0",
        imageRounded: false,
        titleSize: "15px",
        titleLineHeight: "20px",
        showCategory: false,
        showExcerpt: false,
        showAuthor: false,
        showDate: false,
        showReadTime: false,
    },
    /** Carousel: 80x60 thumb in table layout (matches FeaturedCarousel) */
    "carousel": {
        imageHeight: "60px",
        imageWidth: "80px",
        imageMb: "mb-0",
        imageRounded: false,
        titleSize: "15px",
        titleLineHeight: "20px",
        showCategory: true,
        showExcerpt: false,
        showAuthor: true,
        showDate: false,
        showReadTime: false,
    },
    /** Most Viewed: number + title (matches Most Viewed sidebar list) */
    "most-viewed": {
        imageHeight: "0",
        imageMb: "mb-0",
        imageRounded: false,
        titleSize: "16px",
        titleLineHeight: "22px",
        showCategory: false,
        showExcerpt: false,
        showAuthor: false,
        showDate: false,
        showReadTime: false,
    },
    /** Social Card: colored bg + icon + name + followers (matches FollowWidget social cards) */
    "social-card": {
        imageHeight: "0",
        imageMb: "mb-0",
        imageRounded: false,
        titleSize: "16px",
        titleLineHeight: "20px",
        showCategory: false,
        showExcerpt: false,
        showAuthor: false,
        showDate: false,
        showReadTime: false,
    },
    /** Popular Articles: vertical card with 16:10 aspect ratio (matches BreakingNews carousel) */
    "popular-articles": {
        imageHeight: "0",
        imageAspect: "16/10",
        imageMb: "mb-2",
        imageRounded: true,
        imageRoundedValue: "8px",
        cardRoundedValue: "12px",
        titleSize: "16px",
        titleLineHeight: "22px",
        showCategory: true,
        showExcerpt: false,
        showAuthor: true,
        showDate: true,
        showReadTime: false,
    },
    /** Travel Intel: compact horizontal card (matches VideoNews side cards 112x112) */
    "travel-intel": {
        imageHeight: "112px",
        imageWidth: "112px",
        imageMb: "mb-0",
        imageRounded: true,
        imageRoundedValue: "8px",
        titleSize: "14px",
        titleLineHeight: "20px",
        showCategory: true,
        showExcerpt: false,
        showAuthor: true,
        showDate: false,
        showReadTime: false,
    },
    /** Top Destinations: 2-col grid card (matches TopOfWeek ArticleCard 200x130) */
    "top-destinations": {
        imageHeight: "130px",
        imageWidth: "200px",
        imageMb: "mb-2",
        imageRounded: true,
        imageRoundedValue: "10px",
        titleSize: "16px",
        titleLineHeight: "22px",
        showCategory: true,
        showExcerpt: true,
        showAuthor: true,
        showDate: true,
        showReadTime: false,
    },
    /** Sidebar Tabs: horizontal card with small thumbnail (matches TopOfWeek TabItem 65x65) */
    "sidebar-tabs": {
        imageHeight: "90px",
        imageWidth: "90px",
        imageMb: "mb-0",
        imageRounded: true,
        imageRoundedValue: "100%",
        titleSize: "13px",
        titleLineHeight: "18px",
        showCategory: false,
        showExcerpt: false,
        showAuthor: true,
        showDate: false,
        showReadTime: false,
    },
    /** Top Flights: horizontal card (matches TopStories smallCards 180x130) */
    "top-flights": {
        imageHeight: "130px",
        imageWidth: "180px",
        imageMb: "mb-0",
        imageRounded: true,
        imageRoundedValue: "8px",
        cardRoundedValue: "12px",
        titleSize: "16px",
        titleLineHeight: "22px",
        showCategory: true,
        showExcerpt: false,
        showAuthor: true,
        showDate: false,
        showReadTime: false,
    },
    /** Article Inline: full-width inline card between paragraphs */
    "article-inline": {
        imageHeight: "clamp(150px, 25vw, 200px)",
        imageMb: "mb-2",
        imageRounded: true,
        titleSize: "16px",
        titleLineHeight: "22px",
        showCategory: true,
        showExcerpt: true,
        showAuthor: true,
        showDate: false,
        showReadTime: false,
    },
    /** Article list: list variant thumbnails (130px × ~98px) */
    "article-list": {
        imageWidth: "130px",
        imageHeight: "98px",
        imageMb: "mb-0",
        imageRounded: true,
        imageRoundedValue: "8px",
        titleSize: "15px",
        titleLineHeight: "20px",
        showCategory: true,
        showExcerpt: false,
        showAuthor: true,
        showDate: false,
        showReadTime: false,
    },
    /** Article small: small thumb used in compact lists (80px × 80px) */
    "article-small": {
        imageWidth: "80px",
        imageHeight: "80px",
        imageMb: "mb-0",
        imageRounded: true,
        imageRoundedValue: "8px",
        titleSize: "14px",
        titleLineHeight: "18px",
        showCategory: false,
        showExcerpt: false,
        showAuthor: false,
        showDate: false,
        showReadTime: false,
    },
    /** Article hero: full-bleed hero cards use aspect ratio instead of explicit height */
    "article-hero": {
        imageAspect: "16/9",
        imageMb: "mb-0",
        imageRounded: false,
        titleSize: "24px",
        titleLineHeight: "32px",
        showCategory: true,
        showExcerpt: true,
        showAuthor: true,
        showDate: false,
        showReadTime: false,
    },
    /** Related Articles: carousel card (matches RelatedPosts) */
    "related-articles": {
        imageHeight: "200px",
        imageMb: "mb-0",
        imageRounded: true,
        titleSize: "16px",
        titleLineHeight: "22px",
        showCategory: true,
        showExcerpt: false,
        showAuthor: true,
        showDate: false,
        showReadTime: false,
    },
    /** Sidebar Ad: compact sidebar card */
    "sidebar-ad": {
        imageHeight: "clamp(100px, 20vw, 150px)",
        imageMb: "mb-2",
        imageRounded: true,
        titleSize: "14px",
        titleLineHeight: "20px",
        showCategory: true,
        showExcerpt: false,
        showAuthor: false,
        showDate: false,
        showReadTime: false,
    },
} as const;

export type CardStyleKey = keyof typeof CARD_STYLES;
export type CardStyle = (typeof CARD_STYLES)[CardStyleKey];

export function getCssVars(s: CardStyle): CSSProperties {
    const vars: CSSProperties = {};

    // Only emit width/height/radius when they are provided and not a literal "0".
    // Some styles intentionally use an aspect ratio instead of an explicit height/width.
    const w = (s as any).imageWidth;
    const h = (s as any).imageHeight;
    const r = (s as any).imageRoundedValue;

    if (w && String(w) !== "0") (vars as any)['--ad-thumb-w'] = w;
    if (h && String(h) !== "0") (vars as any)['--ad-thumb-h'] = h;
    if (r && String(r) !== "0") (vars as any)['--ad-thumb-radius'] = r;

    if ((s as any).imageAspect) {
        (vars as any)['--ad-thumb-aspect'] = (s as any).imageAspect;
    }

    return vars;
}
