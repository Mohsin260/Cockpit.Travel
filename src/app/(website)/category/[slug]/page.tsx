import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CategoryTemplate from "@/components/CategoryTemplate";
import { fetchArticles, fetchCategories } from "@/lib/api";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { translate } from "@/lib/translate";

const siteName = translate("common.siteName");

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
    const categories = await fetchCategories();
    return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const categories = await fetchCategories();
    const cat = categories.find((c) => c.slug === slug);
    if (!cat) return {};
    return {
        title: cat.label,
        description: `Browse all ${cat.label} articles on ${siteName}`,
        openGraph: {
            title: `${cat.label} — ${siteName}`,
            description: `Browse all ${cat.label} articles on ${siteName}`,
            type: "website",
        },
        alternates: {
            canonical: `https://cockpit.travel/category/${slug}`,
        },
    };
}

export default async function CategoryPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const { page } = await searchParams;
    const currentPage = parseInt(page || '1');

    const [categories, categoryData, allArticlesData] = await Promise.all([
        fetchCategories(),
        fetchArticles({
            category: slug,
            page: currentPage,
            limit: 12
        }),
        fetchArticles({ limit: 1000 }),
    ]);

    const cat = categories.find((c) => c.slug === slug);
    if (!cat) notFound();

    const catArticles = Array.isArray(categoryData) ? categoryData : categoryData.articles;
    const pagination = Array.isArray(categoryData) ? undefined : categoryData.pagination;
    const allArticles = Array.isArray(allArticlesData) ? allArticlesData : allArticlesData.articles;

    const baseUrl = "https://cockpit.travel";

    return (
        <>
            <BreadcrumbJsonLd
                items={[
                    { name: "Home", url: baseUrl },
                    { name: cat.label, url: `${baseUrl}/category/${slug}` },
                ]}
            />
            <CategoryTemplate
                heading={cat.label}
                articles={catArticles}
                categories={categories}
                allArticles={allArticles}
                description={`Browse all ${cat.label} articles — ${pagination?.totalCount || catArticles.length} stories`}
                pagination={pagination}
                categorySlug={slug}
            />
        </>
    );
}
