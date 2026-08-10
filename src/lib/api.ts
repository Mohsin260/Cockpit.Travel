import type { Article, Category } from "@/types";
import { connectDB } from "@/lib/db";
import { Article as ArticleModel } from "@/lib/models/Article";
import { SimpleCategory } from "@/lib/models/SimpleCategory";
import articlesJson from "@/data/articles.json";
import categoriesJson from "@/data/categories.json";
import { DEPLOYMENT_LOCALE, DEFAULT_LOCALE } from "@/lib/i18n";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXTAUTH_URL?.replace(/\/$/, "") || "http://localhost:3000";

const useDb = process.env.USE_DATABASE !== "false";

function stripMongoId(obj: any): any {
  if (Array.isArray(obj)) return obj.map(stripMongoId);
  if (obj && typeof obj === "object" && obj._id && obj.buffer && obj._bsontype === "ObjectId") {
    return obj.toString();
  }
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    const cleaned: any = {};
    for (const key of Object.keys(obj)) {
      if (key === "_id") continue;
      cleaned[key] = stripMongoId(obj[key]);
    }
    return cleaned;
  }
  return obj;
}

function isVideoUrl(url?: string): boolean {
  if (!url) return false;
  const cleanUrl = url.split('?')[0].toLowerCase();
  return cleanUrl.endsWith('.mp4') || cleanUrl.endsWith('.webm') || cleanUrl.endsWith('.mov') || cleanUrl.endsWith('.m4v');
}

function mapArticle(article: any): Article {
  const rawUrl = article.articleMedia?.heroCoverMedia?.url || "";
  const poster = article.articleMedia?.heroCoverMedia?.poster || "";
  // For <img> tags on cards: use poster when URL is a video
  const imageForCards = isVideoUrl(rawUrl) && poster
    ? poster
    : rawUrl || poster || article.image || article.entity_A?.image || "";

  const articleMedia = { ...(article.articleMedia || {}) };
  if (!articleMedia.heroCoverMedia) {
    articleMedia.heroCoverMedia = {};
  }
  // Keep heroCoverMedia.url as the original URL so article pages can play the video

  return {
    id: article._id?.toString?.() || article.id || "",
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    categoryLabel: article.categoryLabel,
    author: article.author,
    authorName: article.authorName,
    date: article.date,
    readTime: article.readTime,
    image: imageForCards,
    featured: article.featured,
    tags: article.tags,
    views: article.views,
    status: article.status,
    articleMedia,
    bodyContent: article.bodyContent,
    keyTakeawaysContent: article.keyTakeawaysContent,
    finalThoughtsContent: article.finalThoughtsContent,
    adOverrides: stripMongoId(article.adOverrides) || [],
    is_product: article.is_product,
    product_name: article.product_name,
    product_brand: article.product_brand,
    product_price: article.product_price,
    content_type: article.content_type,
    entity_A: stripMongoId(article.entity_A),
    entity_B: stripMongoId(article.entity_B),
    verdict_winner: article.verdict_winner,
    spec_comparison_matrix: stripMongoId(article.spec_comparison_matrix) || [],
    pros_cons_A: stripMongoId(article.pros_cons_A) || [],
    pros_cons_B: stripMongoId(article.pros_cons_B) || [],
    when_loser_wins: stripMongoId(article.when_loser_wins) || [],
    page_class: article.page_class,
    structural_blocks: stripMongoId(article.structural_blocks),
    last_verified_date: article.last_verified_date
      ? new Date(article.last_verified_date).toISOString()
      : null,
    refresh_due_date: article.refresh_due_date
      ? new Date(article.refresh_due_date).toISOString()
      : null,
    reviewer: article.reviewer,
    methodology_ref: article.methodology_ref,
    affiliate_offer_ids: article.affiliate_offer_ids || [],
    seo_metadata: stripMongoId(article.seo_metadata),
    locale: article.locale,
    hreflang_group_id: article.hreflang_group_id,
    videoAsset: article.videoAsset,
    createdAt: article.createdAt?.toISOString?.(),
    updatedAt: article.updatedAt?.toISOString?.(),
  };
}

function fetchArticlesFromJSON(params?: {
  status?: string;
  category?: string;
  author?: string;
  tag?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
  sort?: string;
  locale?: string;
}): Article[] {
  const locale = params?.locale || DEPLOYMENT_LOCALE;
  let articles = (articlesJson as any[])
    .filter((a) => a.status !== "draft" && (a.locale || "en") === locale)
    .map(mapArticle);

  if (params?.category) articles = articles.filter((a) => a.category === params.category);
  if (params?.author) articles = articles.filter((a) => a.author === params.author);
  if (params?.featured) articles = articles.filter((a) => a.featured);
  if (params?.tag) articles = articles.filter((a) => a.tags?.includes(params.tag!));
  if (params?.search) {
    const q = params.search.toLowerCase();
    articles = articles.filter(
      (a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
    );
  }

  if (params?.sort === "views") {
    articles.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else {
    articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  if (params?.limit) articles = articles.slice(0, params.limit);
  return articles;
}

function fetchArticleBySlugFromJSON(slug: string): Article | null {
  const raw = (articlesJson as any[]).find((a) => a.slug === slug);
  if (!raw) return null;
  return mapArticle(raw);
}

function fetchCategoriesFromJSON(): Category[] {
  return categoriesJson as Category[];
}

async function fetchArticlesFromDB(params?: {
  status?: string;
  category?: string;
  author?: string;
  tag?: string;
  featured?: boolean;
  limit?: number;
  search?: string;
  sort?: string;
  locale?: string;
}): Promise<Article[]> {
  try {
    await connectDB();

    const locale = params?.locale || DEPLOYMENT_LOCALE;
    let query: any = {};
    query.$and = [
      { locale: locale },
    ];
    if (params?.category) query.category = params.category;
    if (params?.author) query.author = params.author;
    if (params?.featured) query.featured = true;
    if (params?.tag) query.tags = { $in: [params.tag] };
    if (params?.search) {
      query.$or = [
        { title: { $regex: params.search, $options: "i" } },
        { excerpt: { $regex: params.search, $options: "i" } },
      ];
    }

    let sortOptions: any = { date: -1 };
    if (params?.sort === 'views') {
      sortOptions = { views: -1 };
    }

    const articles = await ArticleModel.find(query)
      .limit(params?.limit || 1000)
      .sort(sortOptions)
      .lean();

    return articles.map(mapArticle);
  } catch (error) {
    console.error("Error fetching articles from DB:", error);
    return fetchArticlesFromJSON(params);
  }
}

async function fetchArticleBySlugFromDB(slug: string): Promise<Article | null> {
  try {
    await connectDB();
    const article = await ArticleModel.findOne({ slug, locale: DEPLOYMENT_LOCALE }).lean();
    if (!article) return null;
    return mapArticle(article);
  } catch (error) {
    console.error("Error fetching article from DB:", error);
    return fetchArticleBySlugFromJSON(slug);
  }
}

async function fetchCategoriesFromDB(): Promise<Category[]> {
  try {
    await connectDB();

    let categories = await SimpleCategory.find({
      locale: DEPLOYMENT_LOCALE
    }).lean();

    if (categories.length === 0 && DEPLOYMENT_LOCALE !== DEFAULT_LOCALE) {
      categories = await SimpleCategory.find({
        locale: DEFAULT_LOCALE
      }).lean();
    }

    const slugMap = new Map<string, any>();
    for (const cat of categories) {
      const existing = slugMap.get(cat.slug);
      if (!existing || cat.locale === DEPLOYMENT_LOCALE) {
        slugMap.set(cat.slug, cat);
      }
    }
    const uniqueCategories = Array.from(slugMap.values());

    const counts = await ArticleModel.aggregate([
      { $match: { status: { $ne: "draft" }, locale: DEPLOYMENT_LOCALE } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const countMap = new Map<string, number>();
    for (const c of counts) {
      countMap.set(c._id, c.count);
    }

    const slugs = uniqueCategories.map((c: any) => c.slug);

    let latestArticles = await ArticleModel.find({
      category: { $in: slugs },
      status: "published",
      locale: DEPLOYMENT_LOCALE,
    })
      .sort({ date: -1 })
      .select("category image articleMedia")
      .lean();

    if (latestArticles.length === 0 && DEPLOYMENT_LOCALE !== DEFAULT_LOCALE) {
      latestArticles = await ArticleModel.find({
        category: { $in: slugs },
        status: "published",
        locale: DEFAULT_LOCALE,
      })
        .sort({ date: -1 })
        .select("category image articleMedia")
        .lean();
    }

    const latestImageMap = new Map<string, string>();
    for (const a of latestArticles as any[]) {
      if (!latestImageMap.has(a.category)) {
        const url = a.articleMedia?.heroCoverMedia?.url || a.image || "";
        latestImageMap.set(a.category, url);
      }
    }

    const categoriesWithCounts = uniqueCategories.map((cat: any) => ({
      slug: cat.slug,
      label: cat.label,
      color: cat.color || "#E53E3E",
      count: countMap.get(cat.slug) || 0,
      footerLabel: cat.footerLabel || "",
      latestImage: latestImageMap.get(cat.slug) || "",
    }));

    categoriesWithCounts.sort((a, b) => b.count - a.count);
    return categoriesWithCounts;
  } catch (error) {
    console.error("Error fetching categories from DB:", error);
    return fetchCategoriesFromJSON();
  }
}

export async function fetchArticles(params?: {
  status?: string;
  category?: string;
  author?: string;
  tag?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
  search?: string;
  sort?: string;
  locale?: string;
}): Promise<{ articles: Article[]; pagination?: any }> {
  if (!useDb) {
    return { articles: fetchArticlesFromJSON(params) };
  }

  const articles = await fetchArticlesFromDB(params);
  return { articles };
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  if (!useDb) {
    return fetchArticleBySlugFromJSON(slug);
  }

  return fetchArticleBySlugFromDB(slug);
}

export async function fetchCategories(): Promise<Category[]> {
  if (!useDb) {
    return fetchCategoriesFromJSON();
  }

  return fetchCategoriesFromDB();
}

export async function fetchComparisons(params?: {
  limit?: number;
}): Promise<{ articles: Article[] }> {
  return fetchArticles({ ...params, content_type: "comparison" } as any);
}

export async function fetchHomepageSettings(): Promise<{
  featuredComparisonIds: string[];
  maxCount: number;
}> {
  return { featuredComparisonIds: [], maxCount: 6 };
}

export function resolveFeaturedComparisons(
  comparisons: any[],
  ids: string[],
  maxCount: number
): any[] {
  if (ids.length > 0) {
    return comparisons.filter((c) => ids.includes(c.id || c.slug)).slice(0, maxCount);
  }
  return comparisons.slice(0, maxCount);
}
