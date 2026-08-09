import { notFound } from "next/navigation";
import { fetchArticleBySlug, fetchArticles, fetchCategories } from "@/lib/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticlePage from "@/components/ArticleTemplate";
import Breadcrumb from "@/components/article/Breadcrumb";
import type { Article, Category } from "@/types";

export async function generateStaticParams() {
  const { articles } = await fetchArticles({ limit: 1000 });
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticleSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const [allArticles, categories] = await Promise.all([
    fetchArticles({ limit: 50 }),
    fetchCategories(),
  ]);

  const relatedArticles = allArticles.articles.filter((a) => a.slug !== slug).slice(0, 6);

  const categoryMap = new Map(categories.map((c) => [c.slug, c]));
  const categoryObj = categoryMap.get(article.category) || {
    slug: article.category,
    label: article.categoryLabel || article.category,
    color: "#E53E3E",
    count: 0,
  };

  const tabArticles = allArticles.articles.slice(0, 20).map((a) => ({
    slug: a.slug,
    title: a.title,
    image: a.image || "",
    authorName: a.authorName,
    views: a.views || 0,
  }));

  const recentTab = [...tabArticles].sort((a, b) => {
    const aDate = new Date(allArticles.articles.find(x => x.slug === a.slug)?.date || 0).getTime();
    const bDate = new Date(allArticles.articles.find(x => x.slug === b.slug)?.date || 0).getTime();
    return bDate - aDate;
  }).slice(0, 5);

  const popularTab = [...tabArticles].sort((a, b) => b.views - a.views).slice(0, 5);

  const trendyTab = [...tabArticles].sort((a, b) => {
    const aArticle = allArticles.articles.find(x => x.slug === a.slug);
    const bArticle = allArticles.articles.find(x => x.slug === b.slug);
    const aDate = new Date(aArticle?.date || 0).getTime();
    const bDate = new Date(bArticle?.date || 0).getTime();
    const now = Date.now();
    const dayMs = 86400000;
    const aRecency = Math.max(1, 30 - (now - aDate) / dayMs);
    const bRecency = Math.max(1, 30 - (now - bDate) / dayMs);
    return (b.views * bRecency) - (a.views * aRecency);
  }).slice(0, 5);

  function bodyContentToBlocks(body?: string, fallbackExcerpt?: string): { type: string; text: string }[] {
    if (!body) return [{ type: "paragraph", text: fallbackExcerpt || "" }];
    return body
      .split(/\n\n+/)
      .filter((p) => p.trim())
      .map((paragraph) => {
        const trimmed = paragraph.trim();
        if (trimmed.startsWith("### ")) {
          return { type: "heading", text: trimmed.replace(/^###\s+/, "") };
        }
        return { type: "paragraph", text: trimmed };
      });
  }

  const sidebarData = {
    categories: categories.map((c) => ({
      name: c.label,
      count: c.count,
      href: `/category/${c.slug}`,
      image: (c as any).latestImage || "",
    })),
    socialCards: [
      { name: "Facebook", followers: "125K", color: "#3b5998", icon: "facebook" },
      { name: "Instagram", followers: "98K", color: "#E1306C", icon: "instagram" },
      { name: "Twitter", followers: "72K", color: "#1DA1F2", icon: "twitter" },
    ],
    tags: article.tags || [],
    recentArticles: recentTab,
    popularArticles: popularTab,
    trendyArticles: trendyTab,
  };

  return (
    <>
      <div className="nerio-page-wrapper flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 mb-[50px]">
          <Breadcrumb
            category={{ label: categoryObj.label, color: categoryObj.color }}
            title={article.title}
          />
          <ArticlePage
            article={{
              ...article,
              category: { label: categoryObj.label, color: categoryObj.color },
              author: {
                name: article.authorName,
                avatar: article.author_avatar || "",
                bio: "",
              },
              views: String(article.views || 0),
              comments: "0",
              featuredImage: article.image || "",
              content: bodyContentToBlocks(article.bodyContent, article.excerpt),
              prevPost: null as any,
              nextPost: null as any,
            }}
            related={relatedArticles.map((a) => ({
              ...a,
              category: {
                label: categoryMap.get(a.category)?.label || a.categoryLabel || a.category,
                color: categoryMap.get(a.category)?.color || "#E53E3E",
              },
              author: {
                name: a.authorName,
                avatar: a.author_avatar || "",
                bio: "",
              },
              views: String(a.views || 0),
              comments: "0",
              featuredImage: a.image || "",
              prevPost: null as any,
              nextPost: null as any,
            }))}
            categories={categories}
            trending={popularTab}
            recent={recentTab}
          />
        </main>
        <Footer />
      </div>
    </>
  );
}
