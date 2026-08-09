#!/usr/bin/env tsx
/**
 * Seed all ad positions with travel-specific native content for cockpit.travel.
 *
 * Usage:
 *   npx tsx scripts/seed-infeed-ads.ts
 *
 * Connects to cockpittravel-db → adsnippets collection.
 * Only inserts ads for positions that don't already exist (idempotent).
 * Also updates cardStyle for existing native_feed ads if mismatched.
 * Safe to run multiple times.
 */
import "dotenv/config";
import mongoose from "mongoose";

const DB_NAME = "cockpittravel-db";

const adSnippetSchema = new mongoose.Schema({}, { strict: false, collection: "adsnippets", timestamps: true });
const AdSnippet = mongoose.model("AdSnippet", adSnippetSchema);

interface NativeContent {
  title: string;
  excerpt: string;
  image: string;
  sponsorLabel: string;
  sponsorName: string;
  sponsorLogo: string;
  clickThroughUrl: string;
  category: string;
  categoryColor: string;
  readTime: string;
  author: string;
  cardStyle?: string;
}

interface AdDefinition {
  position: string;
  pageType: string;
  name: string;
  templateType: "native_feed" | "html_banner";
  nativeContent?: NativeContent;
}

const img = (id: number, w = 800, h = 500) => `https://picsum.photos/id/${id}/${w}/${h}`;

const ADS: AdDefinition[] = [
  // ════════════════════════════════════════════════════════════════════
  // HOMEPAGE ADS
  // ════════════════════════════════════════════════════════════════════

  // ── Banners ────────────────────────────────────────────────────────
  {
    position: "top-leaderboard",
    pageType: "homepage",
    name: "Top Leaderboard — Homepage ATF",
    templateType: "html_banner",
  },
  {
    position: "mid-leaderboard-1",
    pageType: "homepage",
    name: "Mid Leaderboard 1 — Hero ↔ Hotels",
    templateType: "html_banner",
  },
  {
    position: "mid-leaderboard-2",
    pageType: "homepage",
    name: "Mid Leaderboard 2 — Hotels ↔ Travel Intel",
    templateType: "html_banner",
  },
  {
    position: "mid-leaderboard-3",
    pageType: "homepage",
    name: "Mid Leaderboard 3 — Travel Intel ↔ Destinations",
    templateType: "html_banner",
  },
  {
    position: "mid-leaderboard-4",
    pageType: "homepage",
    name: "Mid Leaderboard 4 — Destinations ↔ Flights",
    templateType: "html_banner",
  },
  {
    position: "bottom-leaderboard",
    pageType: "homepage",
    name: "Bottom Leaderboard — Homepage Footer",
    templateType: "html_banner",
  },
  {
    position: "sticky-footer",
    pageType: "homepage",
    name: "Sticky Footer — Homepage",
    templateType: "html_banner",
  },

  // ── In-Feed Native (Hero) ──────────────────────────────────────────
  {
    position: "in-feed-1",
    pageType: "homepage",
    name: "In-Feed: Hero Recent News",
    templateType: "native_feed",
    nativeContent: {
      title: "The Hidden Beaches of Portugal Nobody Talks About",
      excerpt: "Beyond the Algarve lies a coastline of untouched coves and fishing villages.",
      image: img(1045),
      sponsorLabel: "Sponsored",
      sponsorName: "Discover Portugal",
      sponsorLogo: "",
      clickThroughUrl: "https://example.com/portugal-beaches",
      category: "Destinations",
      categoryColor: "#54bd05",
      readTime: "6 min",
      author: "Rafael Costa",
      cardStyle: "hero-recent",
    },
  },
  {
    position: "in-feed-2",
    pageType: "homepage",
    name: "In-Feed: Hero Slider",
    templateType: "native_feed",
    nativeContent: {
      title: "Why Business Class Is Cheaper Than You Think in 2026",
      excerpt: "Airlines are slashing premium cabin fares — here's how to find them.",
      image: img(1071),
      sponsorLabel: "Sponsored",
      sponsorName: "FlightDeals",
      sponsorLogo: "",
      clickThroughUrl: "https://example.com/business-class",
      category: "Flights",
      categoryColor: "#0073ff",
      readTime: "5 min",
      author: "Sarah Chen",
      cardStyle: "hero-featured",
    },
  },

  // ── In-Feed Native (BreakingNews / Hotels) ─────────────────────────
  {
    position: "in-feed-3",
    pageType: "homepage",
    name: "In-Feed: Hotels Side Cards",
    templateType: "native_feed",
    nativeContent: {
      title: "Boutique Hotels Under $100 in Southeast Asia",
      excerpt: "Stylish stays that won't break the bank — from Bali to Bangkok.",
      image: img(256),
      sponsorLabel: "Sponsored",
      sponsorName: "HotelGeek",
      sponsorLogo: "",
      clickThroughUrl: "https://example.com/boutique-hotels",
      category: "Hotels",
      categoryColor: "#e033e0",
      readTime: "4 min",
      author: "Maya Torres",
      cardStyle: "latest-articles",
    },
  },
  {
    position: "in-feed-4",
    pageType: "homepage",
    name: "In-Feed: Hotels Carousel",
    templateType: "native_feed",
    nativeContent: {
      title: "All-Inclusive Resorts That Are Actually Worth It",
      excerpt: "We tested 15 all-inclusive resorts — these 3 delivered real value.",
      image: img(322),
      sponsorLabel: "Sponsored",
      sponsorName: "ResortRankings",
      sponsorLogo: "",
      clickThroughUrl: "https://example.com/all-inclusive",
      category: "Hotels",
      categoryColor: "#e033e0",
      readTime: "7 min",
      author: "David Kim",
      cardStyle: "popular-articles",
    },
  },

  // ── In-Feed Native (VideoNews / Travel Intelligence) ───────────────
  {
    position: "in-feed-5",
    pageType: "homepage",
    name: "In-Feed: Travel Intel Left",
    templateType: "native_feed",
    nativeContent: {
      title: "AI Travel Assistants: The Future of Trip Planning",
      excerpt: "How machine learning is personalizing your next vacation.",
      image: img(60),
      sponsorLabel: "Sponsored",
      sponsorName: "TravelTech Weekly",
      sponsorLogo: "",
      clickThroughUrl: "https://example.com/ai-travel",
      category: "Travel Intelligence",
      categoryColor: "#f27100",
      readTime: "6 min",
      author: "Lisa Wang",
      cardStyle: "travel-intel",
    },
  },
  {
    position: "in-feed-6",
    pageType: "homepage",
    name: "In-Feed: Travel Intel Right",
    templateType: "native_feed",
    nativeContent: {
      title: "Best Travel Credit Cards: Earn Miles on Every Purchase",
      excerpt: "Our editors compared 20 cards — these 5 earn the most travel rewards.",
      image: img(180),
      sponsorLabel: "Sponsored",
      sponsorName: "NerdWallet",
      sponsorLogo: "",
      clickThroughUrl: "https://www.nerdwallet.com",
      category: "Travel Intelligence",
      categoryColor: "#f27100",
      readTime: "8 min",
      author: "Tom Bradley",
      cardStyle: "travel-intel",
    },
  },

  // ── In-Feed Native (TopOfWeek / Destinations) ──────────────────────
  {
    position: "in-feed-7",
    pageType: "homepage",
    name: "In-Feed: Destinations Grid",
    templateType: "native_feed",
    nativeContent: {
      title: "A Digital Nomad's Guide to Chiang Mai, Thailand",
      excerpt: "Cafes, coworking spaces, and $3 street food — why remote workers keep coming back.",
      image: img(164),
      sponsorLabel: "Sponsored",
      sponsorName: "NomadList",
      sponsorLogo: "",
      clickThroughUrl: "https://example.com/chiang-mai",
      category: "Traveling",
      categoryColor: "#f27100",
      readTime: "7 min",
      author: "James Liu",
      cardStyle: "top-destinations",
    },
  },
  {
    position: "in-feed-8",
    pageType: "homepage",
    name: "In-Feed: Destinations Tabs",
    templateType: "native_feed",
    nativeContent: {
      title: "Europe's Best-Kept Secret Destinations",
      excerpt: "Skip the crowds at these underrated European gems.",
      image: img(177),
      sponsorLabel: "Sponsored",
      sponsorName: "EuroTravel",
      sponsorLogo: "",
      clickThroughUrl: "https://example.com/europe-secrets",
      category: "Destinations",
      categoryColor: "#54bd05",
      readTime: "5 min",
      author: "Anna Schmidt",
      cardStyle: "sidebar-tabs",
    },
  },

  // ── In-Feed Native (TopStories / Flights) ──────────────────────────
  {
    position: "in-feed-9",
    pageType: "homepage",
    name: "In-Feed: Flights Small Cards",
    templateType: "native_feed",
    nativeContent: {
      title: "The Carry-On Suitcase That Survived 50 Flights",
      excerpt: "Our editors tested 12 hardshell bags — this one won by a landslide.",
      image: img(325),
      sponsorLabel: "Sponsored",
      sponsorName: "TravelGear",
      sponsorLogo: "",
      clickThroughUrl: "https://example.com/suitcase",
      category: "Traveling",
      categoryColor: "#f27100",
      readTime: "4 min",
      author: "Emily Park",
      cardStyle: "top-flights",
    },
  },

  // ════════════════════════════════════════════════════════════════════
  // ARTICLE PAGE ADS
  // ════════════════════════════════════════════════════════════════════

  // ── Banners ────────────────────────────────────────────────────────
  {
    position: "top-leaderboard",
    pageType: "article",
    name: "Top Leaderboard — Article ATF",
    templateType: "html_banner",
  },
  {
    position: "atf-rectangle",
    pageType: "article",
    name: "Below Featured Image — Article Banner",
    templateType: "html_banner",
  },
  {
    position: "bottom-leaderboard",
    pageType: "article",
    name: "Bottom Leaderboard — Article Footer",
    templateType: "html_banner",
  },
  {
    position: "sticky-footer",
    pageType: "article",
    name: "Sticky Footer — Article",
    templateType: "html_banner",
  },

  // ── In-Feed Native (Article Content) ───────────────────────────────
  {
    position: "in-content-1",
    pageType: "article",
    name: "In-Content: After Para 2",
    templateType: "native_feed",
    nativeContent: {
      title: "Travel Insurance From $9/Week — World Nomads",
      excerpt: "Cover for 200+ activities. Cancel anytime. Instant claims online.",
      image: img(142),
      sponsorLabel: "Sponsored",
      sponsorName: "World Nomads",
      sponsorLogo: "",
      clickThroughUrl: "https://www.worldnomads.com",
      category: "Travel Intelligence",
      categoryColor: "#6366F1",
      readTime: "",
      author: "",
      cardStyle: "article-inline",
    },
  },
  {
    position: "in-content-2",
    pageType: "article",
    name: "In-Content: After Para 4",
    templateType: "native_feed",
    nativeContent: {
      title: "The Best Travel Credit Cards of 2026 — NerdWallet",
      excerpt: "Earn up to 5x points on travel. No foreign transaction fees. Annual fee waived first year.",
      image: img(180),
      sponsorLabel: "Sponsored",
      sponsorName: "NerdWallet",
      sponsorLogo: "",
      clickThroughUrl: "https://www.nerdwallet.com",
      category: "Travel Intelligence",
      categoryColor: "#6366F1",
      readTime: "",
      author: "",
      cardStyle: "article-inline",
    },
  },
  {
    position: "in-feed-related",
    pageType: "article",
    name: "Related Posts Carousel",
    templateType: "native_feed",
    nativeContent: {
      title: "Why Every Traveler Needs a Portable Charger in 2026",
      excerpt: "We tested 8 power banks — these 2 lasted through a 2-week trip.",
      image: img(449),
      sponsorLabel: "Sponsored",
      sponsorName: "TechTravel",
      sponsorLogo: "",
      clickThroughUrl: "https://example.com/portable-charger",
      category: "Traveling",
      categoryColor: "#f27100",
      readTime: "3 min",
      author: "Chris Anderson",
      cardStyle: "related-articles",
    },
  },

  // ── Sidebar Native ─────────────────────────────────────────────────
  {
    position: "sidebar-sticky",
    pageType: "article",
    name: "Sidebar Sticky",
    templateType: "native_feed",
    nativeContent: {
      title: "Rent a Car Anywhere — Kayak",
      excerpt: "Compare prices from 70,000+ locations worldwide.",
      image: img(440),
      sponsorLabel: "Sponsored",
      sponsorName: "Kayak",
      sponsorLogo: "",
      clickThroughUrl: "https://www.kayak.com",
      category: "Hotels",
      categoryColor: "#10B981",
      readTime: "",
      author: "",
      cardStyle: "sidebar-ad",
    },
  },
  {
    position: "follow-native",
    pageType: "article",
    name: "Follow Widget",
    templateType: "native_feed",
    nativeContent: {
      title: "Cockpit Deals",
      excerpt: "Follow for daily flight & hotel deals",
      image: "",
      sponsorLabel: "Sponsored",
      sponsorName: "Cockpit Deals",
      sponsorLogo: "",
      clickThroughUrl: "https://example.com/deals",
      category: "",
      categoryColor: "#1DA1F2",
      readTime: "",
      author: "",
      cardStyle: "social-card",
    },
  },
];

async function connectToDB() {
  const MONGO_URI = process.env.MONGO_URI || "";
  let uri = MONGO_URI;
  if (!uri.includes(`/${DB_NAME}`)) {
    const base = uri.split("?")[0].replace(/\/+$/, "");
    const params = uri.includes("?") ? "?" + uri.split("?")[1] : "";
    uri = `${base}/${DB_NAME}${params}`;
  }
  console.log(`[seed-ads] connecting to: ${DB_NAME}`);
  await mongoose.connect(uri, { bufferCommands: false });
  const dbName = mongoose.connection.db?.databaseName || "unknown";
  console.log(`[seed-ads] connected to: ${dbName}`);
}

async function main() {
  await connectToDB();

  // Find which positions already have ads
  const existing = await AdSnippet.find({}).lean();
  const existingMap = new Map(existing.map((ad: any) => [`${ad.pageType}:${ad.position}`, ad]));
  console.log(`\n[seed-ads] found ${existing.length} existing ad snippets`);
  console.log(`[seed-ads] configured: ${[...existingMap.keys()].join(", ") || "(none)"}`);

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const adDef of ADS) {
    const key = `${adDef.pageType}:${adDef.position}`;
    const existingAd = existingMap.get(key);

    // Build the correct nativeContent
    const correctNativeContent = adDef.templateType === "native_feed" && adDef.nativeContent ? {
      title: adDef.nativeContent.title,
      excerpt: adDef.nativeContent.excerpt,
      image: adDef.nativeContent.image,
      sponsorLabel: adDef.nativeContent.sponsorLabel,
      sponsorName: adDef.nativeContent.sponsorName,
      sponsorLogo: adDef.nativeContent.sponsorLogo || "",
      clickThroughUrl: adDef.nativeContent.clickThroughUrl,
      category: adDef.nativeContent.category,
      categoryColor: adDef.nativeContent.categoryColor,
      readTime: adDef.nativeContent.readTime,
      author: adDef.nativeContent.author,
      layout: ["sidebar-list", "sidebar-featured", "review-list", "social-card", "sidebar-ad"].includes(adDef.nativeContent.cardStyle || "") ? "row" : "column",
      cardStyle: adDef.nativeContent.cardStyle || "news-grid",
    } : null;

    if (existingAd) {
      // Check if cardStyle needs updating
      if (correctNativeContent && existingAd.templateType === "native_feed") {
        const currentCardStyle = existingAd.nativeContent?.cardStyle;
        const correctCardStyle = correctNativeContent.cardStyle;
        if (currentCardStyle !== correctCardStyle) {
          await AdSnippet.updateOne(
            { _id: existingAd._id },
            { $set: { "nativeContent.cardStyle": correctCardStyle } }
          );
          console.log(`  🔧 ${key} — cardStyle: "${currentCardStyle}" → "${correctCardStyle}"`);
          updated++;
          continue;
        }
      }
      console.log(`  ⏭  ${key} — already configured, skipping`);
      skipped++;
      continue;
    }

    const doc: Record<string, any> = {
      name: adDef.name,
      label: "",
      type: adDef.templateType === "html_banner" ? "html" : "image",
      templateType: adDef.templateType,
      creativeType: "image",
      code: "",
      mediaUrl: "",
      url: "",
      vastTagUrl: "",
      clickThroughUrl: adDef.nativeContent?.clickThroughUrl || "",
      fallbackMediaUrl: "",
      trackingPixels: { impression: "", click: "" },
      pageType: adDef.pageType,
      position: adDef.position,
      status: true,
      enabled: true,
      isArticleOverride: false,
      locale: "en",
    };

    if (correctNativeContent) {
      doc.nativeContent = correctNativeContent;
    }

    await (AdSnippet as any).create(doc);

    console.log(`  ✅ ${key} — created "${adDef.name}"`);
    created++;
  }

  console.log(`\n[seed-ads] done: ${created} created, ${updated} updated cardStyle, ${skipped} skipped`);

  // Show final state
  const finalAds = await AdSnippet.find({}).lean();
  const byPageType: Record<string, number> = {};
  for (const ad of finalAds) {
    const pt = (ad as any).pageType || "unknown";
    byPageType[pt] = (byPageType[pt] || 0) + 1;
  }
  console.log(`[seed-ads] total ads by page type:`, byPageType);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[seed-ads] fatal error:", err);
  process.exit(1);
});
