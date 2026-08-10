import type { Metadata } from "next";
import CategoryTemplate from "@/components/CategoryTemplate";
import { fetchArticles, fetchCategories } from "@/lib/api";
import { DEPLOYMENT_LOCALE } from "@/lib/i18n";
import messages from "@/messages/en.json";

export const metadata: Metadata = {
    title: "Blog",
    description: "All articles on Cockpit.Travel — travel news, destination guides, and in-depth coverage.",
};

interface Props {
    searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
    const { page } = await searchParams;
    const currentPage = parseInt(page || '1');
    
    const [blogData, categories] = await Promise.all([
        fetchArticles({ 
            page: currentPage, 
            limit: 12 
        }),
        fetchCategories(),
    ]);

    const articles = Array.isArray(blogData) ? blogData : blogData.articles;
    const pagination = Array.isArray(blogData) ? undefined : blogData.pagination;

    const heading = DEPLOYMENT_LOCALE === "es" ? "Todos los Artículos" 
        : DEPLOYMENT_LOCALE === "ar" ? "جميع المقالات"
        : "All Articles";

    return (
        <CategoryTemplate
            heading={heading}
            articles={articles}
            categories={categories}
            allArticles={articles}
            description={`The latest and most viral stories from Cockpit.Travel — ${pagination?.totalCount || articles.length} stories`}
            pagination={pagination}
            categorySlug="blog"
        />
    );
}
