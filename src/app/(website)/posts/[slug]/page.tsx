import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticleTemplate from "@/components/ArticleTemplate";
import { fetchArticles, fetchArticleBySlug, fetchCategories } from "@/lib/api";
import { ItemPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { translate } from "@/lib/translate";

const siteName = translate("common.siteName");

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const articlesData = await fetchArticles();
    const articles = Array.isArray(articlesData) ? articlesData : articlesData.articles;
    return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = await fetchArticleBySlug(slug);
    if (!article) return {};

    const title = article.seo_metadata?.metaTitle || article.title;
    const description = article.seo_metadata?.metaDescription || article.excerpt || "";
    const ogImage = article.seo_metadata?.ogImage || article.articleMedia?.heroCoverMedia?.url || "";

    return {
        title,
        description,
        openGraph: {
            title: `${title} — ${siteName}`,
            description,
            images: ogImage ? [ogImage] : [],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} — ${siteName}`,
            description,
            images: ogImage ? [ogImage] : [],
        },
        alternates: {
            canonical: `https://cockpit.travel/posts/${slug}`,
        },
    };
}

export default async function PostPage({ params }: Props) {
    const { slug } = await params;
    const article = await fetchArticleBySlug(slug);
    if (!article) notFound();

    const [categories, relatedData, trendingData, recentData] = await Promise.all([
        fetchCategories(),
        fetchArticles({ category: article.category, limit: 4 }),
        fetchArticles({ limit: 5, sort: 'views' }),
        fetchArticles({ limit: 6 })
    ]);

    const related = relatedData.articles
        .filter(a => a.slug !== slug)
        .slice(0, 3);

    const baseUrl = "https://cockpit.travel";

    return (
        <>
            {/* JSON-LD: ItemPage */}
            <ItemPageJsonLd
                name={article.title}
                description={article.excerpt || ""}
                image={article.articleMedia?.heroCoverMedia?.url || ""}
                url={`${baseUrl}/posts/${slug}`}
                author={article.authorName || siteName}
                datePublished={article.date || new Date().toISOString()}
                dateModified={article.updatedAt ? new Date(article.updatedAt).toISOString() : new Date().toISOString()}
            />

            {/* JSON-LD: Breadcrumb */}
            <BreadcrumbJsonLd
                items={[
                    { name: "Home", url: baseUrl },
                    { name: article.categoryLabel || "Articles", url: `${baseUrl}/category/${article.category}` },
                    { name: article.title, url: `${baseUrl}/posts/${slug}` },
                ]}
            />

            <ArticleTemplate
                article={article}
                related={related}
                categories={categories}
                trending={trendingData.articles}
                recent={recentData.articles}
            />
        </>
    );
}
