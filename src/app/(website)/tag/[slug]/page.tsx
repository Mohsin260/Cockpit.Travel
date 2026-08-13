import type { Metadata } from "next";
import CategoryTemplate from "@/components/CategoryTemplate";
import { fetchArticles, fetchCategories } from "@/lib/api";
import tags from "@/data/tags.json";
import { translate } from "@/lib/translate";

const siteName = translate("common.siteName");

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
    return (tags as string[]).map((t) => ({ slug: t }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `#${slug}`,
        description: `Articles tagged with #${slug} on ${siteName}`,
        openGraph: {
            title: `#${slug} — ${siteName}`,
            description: `Articles tagged with #${slug} on ${siteName}`,
            type: "website",
        },
        alternates: {
            canonical: `https://cockpit.travel/tag/${slug}`,
        },
    };
}

export default async function TagPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { page } = await searchParams;
    const currentPage = parseInt(page || '1');
    
    const [categories, tagData, allArticlesData] = await Promise.all([
        fetchCategories(),
        fetchArticles({ 
            tag: slug, 
            page: currentPage, 
            limit: 12 
        }),
        fetchArticles({ limit: 1000 }), // Get all articles for sidebar
    ]);

    // Handle both old and new API response formats
    const tagArticles = Array.isArray(tagData) ? tagData : tagData.articles;
    const pagination = Array.isArray(tagData) ? undefined : tagData.pagination;
    const allArticles = Array.isArray(allArticlesData) ? allArticlesData : allArticlesData.articles;

    return (
        <CategoryTemplate
            heading={`#${slug}`}
            articles={tagArticles}
            categories={categories}
            allArticles={allArticles}
            description={`Articles tagged with #${slug} — ${pagination?.totalCount || tagArticles.length} stories`}
            pagination={pagination}
            categorySlug={`tag/${slug}`} // Use tag/ prefix for URL
        />
    );
}
