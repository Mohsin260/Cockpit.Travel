/**
 * Rework Arabic + Spanish locales to a travel-niche site.
 *
 *  - Upserts the 5 travel categories (hotels/flights/destinations/traveling/travel-intelligence)
 *    for `ar` and `es` locales, mirroring the English slugs (for cross-locale routes).
 *  - Deletes ar/es articles that are NOT travel-relevant (business/health/sports/...).
 *  - Re-categorizes the kept travel-relevant articles into the travel categories.
 *  - Inserts new unique Arabic (data/seed-ar.json) + Spanish (data/seed-es.json) travel articles.
 *
 * Run: node scripts/rework-locale-travel.mjs
 */
import "dotenv/config";
import mongoose from "mongoose";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("MONGO_URI not set");
  process.exit(1);
}
if (!MONGO_URI.includes("/cockpittravel-db")) {
  const base = MONGO_URI.split("?")[0].replace(/\/+$/, "");
  const params = MONGO_URI.includes("?") ? "?" + MONGO_URI.split("?")[1] : "";
  MONGO_URI = `${base}/cockpittravel-db${params}`;
}

const TRAVEL_CATEGORIES = [
  { slug: "hotels", colors: { ar: "#e033e0", es: "#e033e0" }, labels: { ar: "فنادق", es: "Hoteles" } },
  { slug: "flights", colors: { ar: "#0073ff", es: "#0073ff" }, labels: { ar: "طيران", es: "Vuelos" } },
  { slug: "destinations", colors: { ar: "#54bd05", es: "#54bd05" }, labels: { ar: "وجهات", es: "Destinos" } },
  { slug: "traveling", colors: { ar: "#54BD05", es: "#54BD05" }, labels: { ar: "رحلات", es: "Viajes" } },
  { slug: "travel-intelligence", colors: { ar: "#f27100", es: "#f27100" }, labels: { ar: "ذكاء السفر", es: "Inteligencia de Viaje" } },
];

// slug -> travel category slug (article is travel-relevant, keep + recategorize)
const AR_KEEPERS = {
  "ar-south-saudi-tourism": "destinations",
  "ar-bahrain-tourism-2025": "destinations",
  "ar-red-sea-project-tourism": "destinations",
  "ar-heritage-sites-alulaa": "destinations",
  "ar-oman-culture-heritage": "destinations",
  "ar-falconry-culture": "destinations",
  "ar-wadi-rum-adventure": "traveling",
  "ar-qatar-world-cup-legacy": "traveling",
};

const ES_KEEPERS = {
  "es-mexico-sustainable-tourism": "destinations",
  "es-chile-wine-tourism": "destinations",
  "es-costa-rica-ecotourism": "destinations",
  "es-colombia-coffee-tourism": "destinations",
  "es-peru-heritage-tourism": "destinations",
  "es-maya-heritage-preservation": "destinations",
  "es-colonial-architecture-latinamerica": "destinations",
  "es-fiesta-culture-traditions": "destinations",
  "es-spain-digital-nomads": "traveling",
  "es-cycling-tourism-colombia": "traveling",
  "es-surfing-culture-latam": "traveling",
};

function loadSeed(file) {
  const p = path.join(__dirname, "..", "data", file);
  if (!fs.existsSync(p)) {
    console.warn(`  ⚠ missing ${file} — skipping`);
    return [];
  }
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

const AR_NEW = loadSeed("seed-ar.json");
const ES_NEW = loadSeed("seed-es.json");

async function main() {
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection;
  console.log(`connected: ${db.name}`);

  // 0) Drop legacy unique slug-only index so the same category slug can exist per-locale
  //    (current model wants the slug+locale unique index only).
  try {
    await db.collection("categories").dropIndex("slug_1");
    console.log("✓ dropped legacy unique index slug_1");
  } catch {
    console.log("  (slug_1 index already absent)");
  }

  // 1) Upsert travel categories per locale
  for (const locale of ["ar", "es"]) {
    for (const cat of TRAVEL_CATEGORIES) {
      await db.collection("categories").updateOne(
        { slug: cat.slug, locale },
        {
          $set: {
            slug: cat.slug,
            label: cat.labels[locale],
            color: cat.colors[locale],
            count: 0,
            locale,
            footerLabel: cat.labels[locale],
          },
        },
        { upsert: true }
      );
    }
  }
  console.log("✓ travel categories upserted for ar + es");

  // 2) Delete unrelated (non-keeper) ar/es articles
  const arKeeperSlugs = Object.keys(AR_KEEPERS);
  const esKeeperSlugs = Object.keys(ES_KEEPERS);
  const arDel = await db.collection("articles").deleteMany({
    locale: "ar",
    slug: { $nin: arKeeperSlugs },
  });
  const esDel = await db.collection("articles").deleteMany({
    locale: "es",
    slug: { $nin: esKeeperSlugs },
  });
  console.log(`✓ deleted unrelated articles — ar: ${arDel.deletedCount}, es: ${esDel.deletedCount}`);

  // 3) Re-categorize keepers
  let kept = 0;
  for (const locale of ["ar", "es"]) {
    const keepers = locale === "ar" ? AR_KEEPERS : ES_KEEPERS;
    for (const [slug, catSlug] of Object.entries(keepers)) {
      const catMeta = TRAVEL_CATEGORIES.find((c) => c.slug === catSlug);
      await db.collection("articles").updateOne(
        { slug, locale },
        {
          $set: {
            category: catSlug,
            categoryLabel: catMeta.labels[locale],
            page_class: catSlug,
          },
        }
      );
      kept++;
    }
  }
  console.log(`✓ re-categorized ${kept} kept articles`);

  // 4) Insert new travel articles
  let created = 0;
  for (const [locale, articles] of [
    ["ar", AR_NEW],
    ["es", ES_NEW],
  ]) {
    for (const article of articles) {
      const exists = await db.collection("articles").findOne({ slug: article.slug });
      const image = article.image;
      const doc = {
        ...article,
        locale,
        status: article.status || "published",
        content_type: article.content_type || "article",
        image,
        articleMedia: article.articleMedia || { heroCoverMedia: { url: image } },
        updatedAt: new Date(),
      };
      if (exists) {
        await db.collection("articles").updateOne({ slug: article.slug }, { $set: doc });
        console.log(`  [${locale}] Updated: ${article.slug}`);
      } else {
        await db.collection("articles").insertOne({ ...doc, createdAt: new Date() });
        console.log(`  [${locale}] Created: ${article.slug}`);
        created++;
      }
    }
  }
  console.log(`✓ new articles processed (${created} newly created)`);

  // 5) Recompute category counts from published articles (keeps DB count field accurate)
  for (const locale of ["ar", "es"]) {
    const counts = await db.collection("articles").aggregate([
      { $match: { locale, status: { $ne: "draft" } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]).toArray();
    for (const c of counts) {
      await db.collection("categories").updateOne(
        { slug: c._id, locale },
        { $set: { count: c.count } }
      );
    }
    console.log(`  [${locale}] category counts: ${JSON.stringify(counts)}`);
  }

  await mongoose.disconnect();
  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});