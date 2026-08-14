#!/usr/bin/env tsx
/**
 * Sync in-feed native ad content across all three locales (en / ar / es).
 *
 * The templates render via /api/ads/resolve which filters by the deployment
 * locale (NEXT_PUBLIC_LOCALE) with a fallback to "en". Currently every
 * AdSnippet is stored with locale "en", and the in-feed native ads were
 * mistakenly filled with ARABIC text on the English deployment.
 *
 * This script fixes the data so each domain shows ads in its own language:
 *   - en : English text
 *   - ar : Arabic text (the content that was accidentally put on the EN ads)
 *   - es : Spanish text
 *
 * Non-textual nativeContent fields (image, sponsorLogo, clickThroughUrl,
 * categoryColor, layout, cardStyle) are carried over from the existing EN
 * AdSnippet so the creative stays identical across locales.
 *
 * Usage: npx tsx scripts/sync-infeed-native-ads.ts
 * Idempotent — safe to run multiple times.
 */
import "dotenv/config";
import mongoose from "mongoose";

const DB_NAME = "cockpittravel-db";
const LOCALES = ["en", "ar", "es"] as const;

const adSnippetSchema = new mongoose.Schema({}, { strict: false, collection: "adsnippets", timestamps: true });
const AdSnippet = mongoose.model("AdSnippet", adSnippetSchema);

interface TextFields {
  title: string;
  excerpt: string;
  sponsorLabel: string;
  sponsorName: string;
  category: string;
  readTime: string;
  author: string;
}

interface LocaleContent {
  en: TextFields;
  ar: TextFields;
  es: TextFields;
}

const SPONSORED = {
  en: "Sponsored",
  ar: "برعاية",
  es: "Patrocinado",
} as const;

/**
 * Every in-feed native ad position, with the correct text for each locale.
 * Arabic text = the content currently stored on the (EN) AdSnippets.
 * English & Spanish = accurate translations of that content.
 */
const CONTENT: Record<string, LocaleContent> = {
  // ── HOMEPAGE ─────────────────────────────────────────────────────────
  "homepage:in-feed-1": {
    en: {
      title: "The Hidden Beaches of Portugal Nobody Talks About",
      excerpt: "Beyond the Algarve lies a coastline of untouched coves and fishing villages.",
      sponsorLabel: SPONSORED.en,
      sponsorName: "Discover Portugal",
      category: "Destinations",
      readTime: "6 min",
      author: "Rafael Costa",
    },
    ar: {
      title: "الشواطئ الخفية في البرتغال التي لا يتحدث عنها أحد",
      excerpt: "خلف منطقة الغارف يمتد ساحل من الخلجان البكر وقرى الصيد.",
      sponsorLabel: SPONSORED.ar,
      sponsorName: "اكتشف البرتغال",
      category: "الوجهات",
      readTime: "6 دقائق",
      author: "رافائيل كوستا",
    },
    es: {
      title: "Las playas escondidas de Portugal de las que nadie habla",
      excerpt: "Más allá del Algarve se extiende una costa de calas vírgenes y pueblos de pescadores.",
      sponsorLabel: SPONSORED.es,
      sponsorName: "Descubre Portugal",
      category: "Destinos",
      readTime: "6 min",
      author: "Rafael Costa",
    },
  },
  "homepage:in-feed-2": {
    en: {
      title: "Why Business Class Is Cheaper Than You Think in 2026",
      excerpt: "Airlines are slashing premium cabin fares — here's how to find them.",
      sponsorLabel: SPONSORED.en,
      sponsorName: "FlightDeals",
      category: "Flights",
      readTime: "5 min",
      author: "Sarah Chen",
    },
    ar: {
      title: "لماذا ستكون درجة الأعمال أرخص مما تعتقد في عام 2026",
      excerpt: "شركات الطيران تخفض أسعار تذاكر الدرجة الممتازة - إليك كيفية العثور عليها.",
      sponsorLabel: SPONSORED.ar,
      sponsorName: "عروض الطيران",
      category: "الرحلات الجوية",
      readTime: "5 دقائق",
      author: "سارة تشين",
    },
    es: {
      title: "Por qué la clase business es más barata de lo que crees en 2026",
      excerpt: "Las aerolíneas están recortando las tarifas de cabina premium — así puedes encontrarlas.",
      sponsorLabel: SPONSORED.es,
      sponsorName: "Ofertas de Vuelos",
      category: "Vuelos",
      readTime: "5 min",
      author: "Sarah Chen",
    },
  },
  "homepage:in-feed-3": {
    en: {
      title: "A Digital Nomad's Guide to Chiang Mai, Thailand",
      excerpt: "Cafes, coworking spaces, and $3 street food — why remote workers keep coming back.",
      sponsorLabel: SPONSORED.en,
      sponsorName: "NomadList",
      category: "Traveling",
      readTime: "7 min",
      author: "James Liu",
    },
    ar: {
      title: "دليل الرحالة الرقمي إلى شيانغ ماي، تايلاند",
      excerpt: "المقاهي، ومساحات العمل المشتركة، وأطعمة الشوارع التي لا تتجاوز 3 دولارات - لماذا يستمر العاملون عن بعد في العودة؟",
      sponsorLabel: SPONSORED.ar,
      sponsorName: "قائمة البدو",
      category: "السفر",
      readTime: "7 دقائق",
      author: "جيمس ليو",
    },
    es: {
      title: "La guía del nómada digital a Chiang Mai, Tailandia",
      excerpt: "Cafés, espacios de coworking y comida callejera de 3 dólares: por qué los trabajadores remotos siguen volviendo.",
      sponsorLabel: SPONSORED.es,
      sponsorName: "Lista Nómada",
      category: "Viajes",
      readTime: "7 min",
      author: "James Liu",
    },
  },
  "homepage:in-feed-4": {
    en: {
      title: "The Carry-On Suitcase That Survived 50 Flights",
      excerpt: "Our editors tested 12 hardshell bags — this one won by a landslide.",
      sponsorLabel: SPONSORED.en,
      sponsorName: "TravelGear",
      category: "Traveling",
      readTime: "4 min",
      author: "Emily Park",
    },
    ar: {
      title: "حقيبة سفر محمولة نجت من 50 رحلة جوية",
      excerpt: "قام محررو الموقع باختبار 12 حقيبة صلبة - وقد فازت هذه الحقيبة بفارق كبير.",
      sponsorLabel: SPONSORED.ar,
      sponsorName: "معدات السفر",
      category: "السفر",
      readTime: "4 دقائق",
      author: "إميلي بارك",
    },
    es: {
      title: "La maleta de cabina que sobrevivió a 50 vuelos",
      excerpt: "Nuestros editores probaron 12 maletas rígidas — esta ganó por goleada.",
      sponsorLabel: SPONSORED.es,
      sponsorName: "Equipo de Viaje",
      category: "Viajes",
      readTime: "4 min",
      author: "Emily Park",
    },
  },
  "homepage:in-feed-5": {
    en: {
      title: "AI Travel Assistants: The Future of Trip Planning",
      excerpt: "How machine learning is personalizing your next vacation.",
      sponsorLabel: SPONSORED.en,
      sponsorName: "TravelTech Weekly",
      category: "Travel Intelligence",
      readTime: "6 min",
      author: "Lisa Wang",
    },
    ar: {
      title: "مساعدو السفر المدعومون بالذكاء الاصطناعي: مستقبل تخطيط الرحلات",
      excerpt: "كيف تُضفي تقنيات التعلم الآلي طابعًا شخصيًا على عطلتك القادمة.",
      sponsorLabel: SPONSORED.ar,
      sponsorName: "السفر التقنية الأسبوعية",
      category: "ذكاء السفر",
      readTime: "6 دقائق",
      author: "ليزا وانغ",
    },
    es: {
      title: "Asistentes de viaje con IA: el futuro de la planificación de viajes",
      excerpt: "Cómo el aprendizaje automático está personalizando tus próximas vacaciones.",
      sponsorLabel: SPONSORED.es,
      sponsorName: "TravelTech Semanal",
      category: "Inteligencia de Viajes",
      readTime: "6 min",
      author: "Lisa Wang",
    },
  },
  "homepage:in-feed-6": {
    en: {
      title: "Best Travel Credit Cards: Earn Miles on Every Purchase",
      excerpt: "Our editors compared 20 cards — these 5 earn the most travel rewards.",
      sponsorLabel: SPONSORED.en,
      sponsorName: "NerdWallet",
      category: "Travel Intelligence",
      readTime: "8 min",
      author: "Tom Bradley",
    },
    ar: {
      title: "أفضل بطاقات ائتمان السفر: اكسب أميالاً مع كل عملية شراء",
      excerpt: "قام محررو الموقع بمقارنة 20 بطاقة - هذه الخمس بطاقات تمنح أكبر عدد من مكافآت السفر.",
      sponsorLabel: SPONSORED.ar,
      sponsorName: "نيردواليت",
      category: "ذكاء السفر",
      readTime: "8 دقائق",
      author: "توم برادلي",
    },
    es: {
      title: "Las mejores tarjetas de crédito de viaje: gana millas en cada compra",
      excerpt: "Nuestros editores compararon 20 tarjetas — estas 5 ganan la mayoría de recompensas de viaje.",
      sponsorLabel: SPONSORED.es,
      sponsorName: "NerdWallet",
      category: "Inteligencia de Viajes",
      readTime: "8 min",
      author: "Tom Bradley",
    },
  },
  "homepage:in-feed-7": {
    en: {
      title: "A Digital Nomad's Guide to Chiang Mai, Thailand",
      excerpt: "Cafes, coworking spaces, and $3 street food — why remote workers keep coming back.",
      sponsorLabel: SPONSORED.en,
      sponsorName: "NomadList",
      category: "Traveling",
      readTime: "7 min",
      author: "James Liu",
    },
    ar: {
      title: "دليل الرحالة الرقمي إلى شيانغ ماي، تايلاند",
      excerpt: "المقاهي، ومساحات العمل المشتركة، وأطعمة الشوارع التي لا تتجاوز 3 دولارات - لماذا يستمر العاملون عن بعد في العودة؟",
      sponsorLabel: SPONSORED.ar,
      sponsorName: "قائمة البدو",
      category: "السفر",
      readTime: "7 دقائق",
      author: "جيمس ليو",
    },
    es: {
      title: "La guía del nómada digital a Chiang Mai, Tailandia",
      excerpt: "Cafés, espacios de coworking y comida callejera de 3 dólares: por qué los trabajadores remotos siguen volviendo.",
      sponsorLabel: SPONSORED.es,
      sponsorName: "Lista Nómada",
      category: "Viajes",
      readTime: "7 min",
      author: "James Liu",
    },
  },
  "homepage:in-feed-8": {
    en: {
      title: "Europe's Best-Kept Secret Destinations",
      excerpt: "Skip the crowds at these underrated European gems.",
      sponsorLabel: SPONSORED.en,
      sponsorName: "EuroTravel",
      category: "Destinations",
      readTime: "5 min",
      author: "Anna Schmidt",
    },
    ar: {
      title: "أفضل الوجهات السياحية السرية في أوروبا",
      excerpt: "تجنب الزحام في هذه الجواهر الأوروبية التي لا تحظى بالتقدير الكافي.",
      sponsorLabel: SPONSORED.ar,
      sponsorName: "السفر اليورو",
      category: "الوجهات",
      readTime: "5 دقائق",
      author: "آنا شميدت",
    },
    es: {
      title: "Los destinos secretos mejor guardados de Europa",
      excerpt: "Evita las multitudes en estas joyas europeas infravaloradas.",
      sponsorLabel: SPONSORED.es,
      sponsorName: "EuroViaje",
      category: "Destinos",
      readTime: "5 min",
      author: "Anna Schmidt",
    },
  },
  "homepage:in-feed-9": {
    en: {
      title: "The Carry-On Suitcase That Survived 50 Flights",
      excerpt: "Our editors tested 12 hardshell bags — this one won by a landslide.",
      sponsorLabel: SPONSORED.en,
      sponsorName: "TravelGear",
      category: "Traveling",
      readTime: "4 min",
      author: "Emily Park",
    },
    ar: {
      title: "حقيبة سفر محمولة نجت من 50 رحلة جوية",
      excerpt: "قام محررو الموقع باختبار 12 حقيبة صلبة - وقد فازت هذه الحقيبة بفارق كبير.",
      sponsorLabel: SPONSORED.ar,
      sponsorName: "ترافيلجير",
      category: "السفر",
      readTime: "4 دقائق",
      author: "إميلي بارك",
    },
    es: {
      title: "La maleta de cabina que sobrevivió a 50 vuelos",
      excerpt: "Nuestros editores probaron 12 maletas rígidas — esta ganó por goleada.",
      sponsorLabel: SPONSORED.es,
      sponsorName: "Equipo de Viaje",
      category: "Viajes",
      readTime: "4 min",
      author: "Emily Park",
    },
  },

  // ── ARTICLE PAGE ─────────────────────────────────────────────────────
  "article:atf-rectangle": {
    en: {
      title: "Get Instant Hotel Price Alerts — Hopper",
      excerpt: "Hopper predicts price drops with up to 95% accuracy. Save up to 40% on your next hotel stay.",
      sponsorLabel: SPONSORED.en,
      sponsorName: "Hopper",
      category: "Hotels",
      readTime: "5 min",
      author: "Robenio",
    },
    ar: {
      title: "احصل على تنبيهات فورية بأسعار الفنادق — هوبر",
      excerpt: "يتوقع تطبيق هوبر انخفاض الأسعار بدقة تصل إلى 95%. وفّر حتى 40% على إقامتك الفندقية القادمة.",
      sponsorLabel: SPONSORED.ar,
      sponsorName: "هوبر",
      category: "الفنادق",
      readTime: "5 دقائق",
      author: "رو بينيو",
    },
    es: {
      title: "Recibe alertas instantáneas de precios de hoteles — Hopper",
      excerpt: "Hopper predice las bajadas de precios con hasta un 95% de precisión. Ahorra hasta un 40% en tu próxima estancia hotelera.",
      sponsorLabel: SPONSORED.es,
      sponsorName: "Hopper",
      category: "Hoteles",
      readTime: "5 min",
      author: "Robenio",
    },
  },
  "article:follow-native": {
    en: {
      title: "Cockpit Deals",
      excerpt: "Follow for daily flight & hotel deals",
      sponsorLabel: SPONSORED.en,
      sponsorName: "Cockpit Deals",
      category: "",
      readTime: "",
      author: "",
    },
    ar: {
      title: "عروض كوكت بيت",
      excerpt: "تابع للحصول على عروض يومية للطيران والفنادق",
      sponsorLabel: SPONSORED.ar,
      sponsorName: "كوكت بيت",
      category: "",
      readTime: "",
      author: "",
    },
    es: {
      title: "Ofertas Cockpit",
      excerpt: "Síguenos para recibir ofertas diarias de vuelos y hoteles",
      sponsorLabel: SPONSORED.es,
      sponsorName: "Ofertas Cockpit",
      category: "",
      readTime: "",
      author: "",
    },
  },
  "article:in-content-1": {
    en: {
      title: "Travel Insurance From $9/Week — World Nomads",
      excerpt: "Cover for 200+ activities. Cancel anytime. Instant claims online.",
      sponsorLabel: SPONSORED.en,
      sponsorName: "World Nomads",
      category: "Travel Intelligence",
      readTime: "5 min",
      author: "Zizo",
    },
    ar: {
      title: "تأمين السفر ابتداءً من 9 دولارات في الأسبوع - وورلد نومادز",
      excerpt: "تغطية لأكثر من 200 نشاط. إمكانية الإلغاء في أي وقت. تقديم المطالبات فورياً عبر الإنترنت.",
      sponsorLabel: SPONSORED.ar,
      sponsorName: "البدو العالم",
      category: "ذكاء السفر",
      readTime: "5 دقائق",
      author: "زيزو",
    },
    es: {
      title: "Seguro de viaje desde 9 USD/semana — World Nomads",
      excerpt: "Cobertura para más de 200 actividades. Cancelación en cualquier momento. Reclamaciones instantáneas en línea.",
      sponsorLabel: SPONSORED.es,
      sponsorName: "World Nomads",
      category: "Inteligencia de Viajes",
      readTime: "5 min",
      author: "Zizo",
    },
  },
  "article:in-content-2": {
    en: {
      title: "The Best Travel Credit Cards of 2026 — NerdWallet",
      excerpt: "Earn up to 5x points on travel. No foreign transaction fees. Annual fee waived first year.",
      sponsorLabel: SPONSORED.en,
      sponsorName: "NerdWallet",
      category: "Travel Intelligence",
      readTime: "",
      author: "",
    },
    ar: {
      title: "أفضل بطاقات ائتمان السفر لعام 2026 — نيردواليت",
      excerpt: "اكسب ما يصل إلى 5 أضعاف النقاط عند السفر. بدون رسوم معاملات أجنبية. إعفاء من الرسوم السنوية في السنة الأولى.",
      sponsorLabel: SPONSORED.ar,
      sponsorName: "نيردواليت",
      category: "ذكاء السفر",
      readTime: "",
      author: "",
    },
    es: {
      title: "Las mejores tarjetas de crédito de viaje 2026 — NerdWallet",
      excerpt: "Gana hasta 5x puntos en viajes. Sin comisiones por transacciones en el extranjero. Primera anualidad gratis.",
      sponsorLabel: SPONSORED.es,
      sponsorName: "NerdWallet",
      category: "Inteligencia de Viajes",
      readTime: "",
      author: "",
    },
  },
  "article:in-feed-related": {
    en: {
      title: "Why Every Traveler Needs a Portable Charger in 2026",
      excerpt: "We tested 8 power banks — these 2 lasted through a 2-week trip.",
      sponsorLabel: SPONSORED.en,
      sponsorName: "TechTravel",
      category: "Traveling",
      readTime: "3 min",
      author: "Chris Anderson",
    },
    ar: {
      title: "لماذا يحتاج كل مسافر إلى شاحن محمول في عام 2026",
      excerpt: "لقد اختبرنا 8 بنوك طاقة - هذان البنكان استمرا طوال رحلة استمرت أسبوعين.",
      sponsorLabel: SPONSORED.ar,
      sponsorName: "السفر الفني",
      category: "السفر",
      readTime: "3 دقائق",
      author: "كريس أندرسون",
    },
    es: {
      title: "Por qué todo viajero necesita un cargador portátil en 2026",
      excerpt: "Probamos 8 baterías externas — estas 2 aguantaron un viaje de 2 semanas.",
      sponsorLabel: SPONSORED.es,
      sponsorName: "TechViaje",
      category: "Viajes",
      readTime: "3 min",
      author: "Chris Anderson",
    },
  },
  "article:sidebar-sticky": {
    en: {
      title: "Rent a Car Anywhere — Kayak",
      excerpt: "Compare prices from 70,000+ locations. Free cancellation up to 48 hours before pickup.",
      sponsorLabel: SPONSORED.en,
      sponsorName: "Kayak",
      category: "Hotels",
      readTime: "",
      author: "",
    },
    ar: {
      title: "استأجر سيارة في أي مكان — كاياك",
      excerpt: "قارن الأسعار من أكثر من 70,000 موقع. الإلغاء مجاني حتى 48 ساعة قبل الاستلام.",
      sponsorLabel: SPONSORED.ar,
      sponsorName: "كاياك",
      category: "الفنادق",
      readTime: "",
      author: "",
    },
    es: {
      title: "Alquila un coche en cualquier lugar — Kayak",
      excerpt: "Compara precios en más de 70 000 ubicaciones. Cancelación gratuita hasta 48 horas antes de la recogida.",
      sponsorLabel: SPONSORED.es,
      sponsorName: "Kayak",
      category: "Hoteles",
      readTime: "",
      author: "",
    },
  },
};

/** Non-text nativeContent fields that must be identical across locales */
const SHARED_NATIVE_FIELDS = [
  "image",
  "sponsorLogo",
  "clickThroughUrl",
  "categoryColor",
  "layout",
  "cardStyle",
] as const;

/** Text fields that are translated per locale */
const TEXT_FIELDS = [
  "title",
  "excerpt",
  "sponsorLabel",
  "sponsorName",
  "category",
  "readTime",
  "author",
] as const;

const ARABIC_SCRIPT = /[\u0600-\u06FF]/;

async function connectToDB() {
  const MONGO_URI = process.env.MONGO_URI || "";
  let uri = MONGO_URI;
  if (!uri.includes(`/${DB_NAME}`)) {
    const base = uri.split("?")[0].replace(/\/+$/, "");
    const params = uri.includes("?") ? "?" + uri.split("?")[1] : "";
    uri = `${base}/${DB_NAME}${params}`;
  }
  console.log(`[sync-infeed-ads] connecting to: ${DB_NAME}`);
  await mongoose.connect(uri, { bufferCommands: false });
  console.log(`[sync-infeed-ads] connected to: ${mongoose.connection.db?.databaseName}`);
}

async function main() {
  await connectToDB();

  const keys = Object.keys(CONTENT);
  let created = 0;
  let updated = 0;

  for (const key of keys) {
    const [pageType, position] = key.split(":");
    const localesContent = CONTENT[key];

    // Source EN AdSnippet carries the shared (non-text) creative values.
    const enSource = (await AdSnippet.findOne({ pageType, position, locale: "en" }).lean()) as any;

    if (!enSource) {
      console.log(`  ⚠  ${key} — no EN source found, skipping`);
      continue;
    }

    const sharedNativeFields: Record<string, any> = {};
    for (const field of SHARED_NATIVE_FIELDS) {
      sharedNativeFields[field] = enSource.nativeContent?.[field] ?? "";
    }

    // Does the current EN record hold Arabic text? (i.e. was it the record the
    // user mistakenly filled in Arabic). If so, the AR record must receive that
    // exact Arabic content verbatim.
    const enSourceIsArabic = ARABIC_SCRIPT.test(enSource.nativeContent?.title || "");

    for (const locale of LOCALES) {
      const nativeContent: Record<string, any> = { ...sharedNativeFields };

      if (locale === "ar" && enSourceIsArabic) {
        // Transfer the user's Arabic content verbatim into the AR record.
        for (const field of TEXT_FIELDS) {
          nativeContent[field] = enSource.nativeContent?.[field] ?? "";
        }
      } else {
        const text = localesContent[locale];
        for (const field of TEXT_FIELDS) {
          nativeContent[field] = text[field];
        }
      }

      let doc: any = null;
      try {
        doc = await AdSnippet.findOne({ pageType, position, locale }).lean() as any;
      } catch (err) {
        console.error(`[sync-infeed-ads] lookup error for ${key} ${locale}:`, err);
      }

      if (doc) {
        await AdSnippet.updateOne(
          { _id: doc._id },
          { $set: { nativeContent, templateType: "native_feed", type: "html" } }
        );
        updated++;
        console.log(`  🔧 ${key} [${locale}] — updated text`);
      } else {
        const newDoc = {
          ...enSource,
          _id: undefined,
          name: `${enSource.name}-${locale}`,
          locale,
          templateType: "native_feed",
          type: "html",
          nativeContent,
        } as any;
        delete newDoc.createdAt;
        delete newDoc.updatedAt;
        await (AdSnippet as any).create(newDoc);
        created++;
        console.log(`  ✅ ${key} [${locale}] — created`);
      }
    }
  }

  console.log(`\n[sync-infeed-ads] done: ${created} created, ${updated} updated`);

  const total = await AdSnippet.countDocuments({ templateType: "native_feed" });
  const byLocale = await AdSnippet.aggregate([
    { $match: { templateType: "native_feed" } },
    { $group: { _id: "$locale", count: { $sum: 1 } } },
  ]);
  console.log(`[sync-infeed-ads] native_feed total: ${total} — by locale:`, JSON.stringify(byLocale));

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("[sync-infeed-ads] fatal error:", err);
  process.exit(1);
});