"use client";
import { useEffect, useState } from "react";
import ArticleCard from "@/components/ui/ArticleCard";
import { useBookmarkStore } from "@/hooks/useBookmarkStore";
import type { Article, Category } from "@/types";
import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

export default function BookmarksPage() {
    const t = useTranslations();
    const { bookmarks } = useBookmarkStore();
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const categoriesRes = await fetch("/api/categories");
                const categoriesData = await categoriesRes.json();
                setCategories(categoriesData);

                if (bookmarks.length > 0) {
                    const idsParam = bookmarks.join(",");
                    const articlesRes = await fetch(`/api/articles?ids=${encodeURIComponent(idsParam)}`);
                    const articlesData = await articlesRes.json();
                    const articlesArray = Array.isArray(articlesData)
                        ? articlesData
                        : articlesData.articles || articlesData.items || [];
                    setArticles(articlesArray);
                } else {
                    setArticles([]);
                }
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [bookmarks]);

    if (loading) {
        return (
            <main className="rb-container py-12">
                <div className="text-center py-20">
                    <p className="text-[var(--meta-fcolor)]">{t("common.loading")}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="rb-container py-12">
            <div className="mb-8">
                <h1 className="mb-2" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 800 }}>
                    {t("bookmarks.title")}
                </h1>
                <p className="text-[var(--meta-fcolor)] text-sm">
                    {articles.length} {articles.length !== 1 ? t("common.savedArticles") : t("common.savedArticle")}
                </p>
            </div>

            {articles.length === 0 ? (
                <div className="py-20 text-center text-[var(--meta-fcolor)]">
                    <p className="text-5xl mb-4">🔖</p>
                    <p className="text-lg font-semibold mb-2">{t("bookmarks.noBookmarks")}</p>
                    <p className="text-sm mb-6">{t("bookmarks.saveToReadLater")}</p>
                    <Link href="/" className="is-btn">
                        {t("bookmarks.browseArticles")}
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((a) => (
                        <ArticleCard key={a.slug} article={a} variant="grid" categories={categories} />
                    ))}
                </div>
            )}
        </main>
    );
}
