import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Article } from "@/lib/models/Article";
import { Category } from "@/lib/models/Category";
import { requirePermission } from "@/lib/auth/server";
import { notifySubscribersOfNewArticle } from "@/lib/email/notify";
import articlesJson from "@/data/articles.json";
import { DEPLOYMENT_LOCALE } from "@/lib/i18n";
import { PostCreateSchema } from "@/lib/validations/post";

export const dynamic = "force-dynamic";

const useDb = process.env.USE_DATABASE !== "false";

function getArticlesFromJSON(filters: {
  status?: string | null;
  category?: string | null;
  author?: string | null;
  tag?: string | null;
  featured?: string | null;
  search?: string | null;
  sort?: string | null;
  limit: number;
  page: number;
  ids?: string[];
}) {
  let articles = articlesJson as any[];

  if (filters.ids) {
    articles = articles.filter((a: any) => filters.ids!.includes(a.slug));
    return { articles, total: articles.length, totalPages: 1 };
  }

  if (filters.status) articles = articles.filter((a: any) => a.status === filters.status);
  if (filters.category) articles = articles.filter((a: any) => a.category === filters.category);
  if (filters.author) articles = articles.filter((a: any) => a.author === filters.author);
  if (filters.tag) articles = articles.filter((a: any) => a.tags?.includes(filters.tag!));
  if (filters.featured === "true") articles = articles.filter((a: any) => a.featured);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    articles = articles.filter((a: any) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
  }

  if (filters.sort === "views") {
    articles.sort((a: any, b: any) => (b.views || 0) - (a.views || 0));
  } else {
    articles.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  const total = articles.length;
  const totalPages = Math.ceil(total / filters.limit);
  const skip = (filters.page - 1) * filters.limit;
  articles = articles.slice(skip, skip + filters.limit);

  const transformed = articles.map((a: any) => ({
    _id: a.slug,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    categoryLabel: a.categoryLabel,
    author: a.author,
    authorName: a.authorName,
    author_photo: (a as any).author_photo || "",
    date: a.date,
    readTime: a.readTime,
    image: a.image || "",
    featured: a.featured,
    tags: a.tags,
    views: a.views,
    status: a.status,
    articleMedia: a.articleMedia || {},
    bodyContent: a.bodyContent,
    keyTakeawaysContent: a.keyTakeawaysContent,
    finalThoughtsContent: a.finalThoughtsContent,
    adOverrides: a.adOverrides || [],
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
    id: a.slug,
  }));

  return { articles: transformed, total, totalPages };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const author = searchParams.get("author");
    const tag = searchParams.get("tag");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "12");
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const ids = searchParams.get("ids");
    const locale = searchParams.get("locale") || DEPLOYMENT_LOCALE;

    if (!useDb) {
      const filters = { status, category, author, tag, featured, search, sort, limit, page, ids: ids ? ids.split(",").map(s => s.trim()).filter(Boolean) : undefined };
      const result = getArticlesFromJSON(filters);
      return NextResponse.json({
        items: result.articles,
        articles: result.articles,
        total: result.total,
        page,
        limit,
        pagination: {
          currentPage: page,
          totalPages: result.totalPages,
          totalCount: result.total,
          hasNextPage: page < result.totalPages,
          hasPrevPage: page > 1,
        }
      });
    }

    await connectDB();

    if (ids) {
      const idList = ids.split(",").map(id => id.trim()).filter(Boolean);
      if (idList.length === 0) {
        return NextResponse.json({ items: [], articles: [], total: 0 });
      }

      const articles = await Article.find({ _id: { $in: idList } }).lean();

      const transformedArticles = articles.map((a: any) => ({
        _id: a._id.toString(),
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        category: a.category,
        categoryLabel: a.categoryLabel,
        author: a.author,
        authorName: a.authorName,
        date: a.date,
        readTime: a.readTime,
        image: a.articleMedia?.heroCoverMedia?.url || "",
        featured: a.featured,
        tags: a.tags,
        views: a.views,
        status: a.status,
        articleMedia: a.articleMedia || {},
        bodyContent: a.bodyContent,
        keyTakeawaysContent: a.keyTakeawaysContent,
        finalThoughtsContent: a.finalThoughtsContent,
        adOverrides: a.adOverrides || [],
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
        id: a._id.toString(),
      }));

      return NextResponse.json({
        items: transformedArticles,
        articles: transformedArticles,
        total: transformedArticles.length,
      });
    }

    let query: any = {};

    query.$and = [
      { locale: locale }
    ];
    if (status) query.status = status;
    if (category) query.category = category;
    if (author) query.author = author;
    if (tag) query.tags = tag;
    if (featured === "true") query.featured = true;
    if (search) query.$text = { $search: search };

    const skip = (page - 1) * limit;
    const totalCount = await Article.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    let sortOptions: any = { date: -1 };
    if (sort === 'views') {
      sortOptions = { views: -1 };
    } else if (sort === 'ads') {
      sortOptions = { "adOverrides.0": -1, date: -1 };
    }

    let articles;
    if (sort === 'ads') {
      articles = await Article.aggregate([
        { $match: query },
        {
          $addFields: {
            adCount: { $size: { $ifNull: ["$adOverrides", []] } }
          }
        },
        { $sort: { adCount: -1, date: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]);
    } else {
      articles = await Article.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean();
    }

    const transformedArticles = articles.map((a: any) => ({
      _id: a._id.toString(),
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category,
      categoryLabel: a.categoryLabel,
      author: a.author,
      authorName: a.authorName,
      date: a.date,
      readTime: a.readTime,
      image: a.articleMedia?.heroCoverMedia?.url || "",
      featured: a.featured,
      tags: a.tags,
      views: a.views,
      status: a.status,
      articleMedia: a.articleMedia || {},
      bodyContent: a.bodyContent,
      keyTakeawaysContent: a.keyTakeawaysContent,
      finalThoughtsContent: a.finalThoughtsContent,
      adOverrides: a.adOverrides || [],
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
      id: a._id.toString(),
    }));

    return NextResponse.json({
      items: transformedArticles,
      articles: transformedArticles,
      total: totalCount,
      page,
      limit,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    });
    
  } catch (error: any) {
    console.error("Error in articles API:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requirePermission("articles.create");
    await connectDB();
    const rawBody = await request.json();

    // Validate with Zod — strips unknown fields, applies defaults
    let parsed;
    try {
      parsed = PostCreateSchema.parse(rawBody);
    } catch (err: any) {
      return NextResponse.json(
        { error: "Validation error", details: err.errors?.map((e: any) => `${e.path.join(".")}: ${e.message}`).join("; ") ?? err.message },
        { status: 400 }
      );
    }

    // Verify category exists and is not uncategorized
    if (!parsed.category || parsed.category === "uncategorized") {
      return NextResponse.json(
        { error: "Validation error", details: "A valid category must be selected." },
        { status: 400 }
      );
    }

    const validCategory = await Category.findOne({ slug: parsed.category });
    if (!validCategory) {
      return NextResponse.json(
        { error: "Validation error", details: `The category '${parsed.category}' does not exist.` },
        { status: 400 }
      );
    }

    const articleData = {
      slug: parsed.slug,
      title: parsed.title,
      excerpt: parsed.excerpt,
      category: parsed.category,
      categoryLabel: parsed.categoryLabel || validCategory.name,
      author: parsed.author,
      authorName: parsed.authorName,
      author_photo: parsed.author_photo,
      date: parsed.date || new Date().toISOString(),
      readTime: parsed.readTime,
      featured: parsed.featured,
      tags: parsed.tags,
      views: parsed.views,
      status: parsed.status,
      locale: parsed.locale || DEPLOYMENT_LOCALE,
      articleMedia: parsed.articleMedia,
      bodyContent: parsed.bodyContent,
      keyTakeawaysContent: parsed.keyTakeawaysContent,
      finalThoughtsContent: parsed.finalThoughtsContent,
      adOverrides: parsed.adOverrides,
      // v2.0 fields
      content_type: parsed.content_type,
      entity_A: parsed.entity_A,
      entity_B: parsed.entity_B,
      verdict_winner: parsed.verdict_winner,
      spec_comparison_matrix: parsed.spec_comparison_matrix,
      pros_cons_A: parsed.pros_cons_A,
      pros_cons_B: parsed.pros_cons_B,
      when_loser_wins: parsed.when_loser_wins,
      page_class: parsed.page_class,
      structural_blocks: parsed.structural_blocks,
      reviewer: parsed.reviewer,
      methodology_ref: parsed.methodology_ref,
      affiliate_offer_ids: parsed.affiliate_offer_ids,
      seo_metadata: parsed.seo_metadata,
      hreflang_group_id: parsed.hreflang_group_id,
      videoAsset: parsed.videoAsset,
      is_product: parsed.is_product,
      product_name: parsed.product_name,
      product_brand: parsed.product_brand,
      product_price: parsed.product_price,
    };

    const article = await Article.create(articleData);

    if (article.status === "published") {
      // Run in background
      notifySubscribersOfNewArticle(article).catch(console.error);
    }

    // Return in EXACT same order as GET
    return NextResponse.json({
      _id: article._id.toString(),
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      categoryLabel: article.categoryLabel,
      author: article.author,
      authorName: article.authorName,
      date: article.date,
      readTime: article.readTime,
      featured: article.featured,
      tags: article.tags,
      views: article.views,
      status: article.status,
      articleMedia: article.articleMedia,
      bodyContent: article.bodyContent,
      keyTakeawaysContent: article.keyTakeawaysContent,
      finalThoughtsContent: article.finalThoughtsContent,
      adOverrides: article.adOverrides,
      createdAt: (article as any).createdAt,
      updatedAt: (article as any).updatedAt,
      id: article._id.toString()
    });
  } catch (error: any) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article", details: error.message },
      { status: 500 }
    );
  }
}
