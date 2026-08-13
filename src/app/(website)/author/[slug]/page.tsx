import type { Metadata } from "next";
import CategoryTemplate from "@/components/CategoryTemplate";
import { fetchArticles, fetchCategories } from "@/lib/api";
import authors from "@/data/authors.json";
import type { Author } from "@/types";
import { translate } from "@/lib/translate";

const siteName = translate("common.siteName");

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return (authors as Author[]).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const author = (authors as Author[]).find((a) => a.slug === slug);
    if (!author) return {};
    return {
        title: author.name,
        description: author.bio,
        openGraph: {
            title: `${author.name} — ${siteName}`,
            description: author.bio,
            type: "profile",
        },
        alternates: {
            canonical: `https://cockpit.travel/author/${slug}`,
        },
    };
}

export default async function AuthorPage({ params }: Props) {
    const { slug } = await params;
    const author = (authors as Author[]).find((a) => a.slug === slug);
    const authorAny = author as any;

    const [categories, authorArticlesData, allArticlesData] = await Promise.all([
        fetchCategories(),
        fetchArticles({ author: slug }),
        fetchArticles(),
    ]);

    const authorArticles = Array.isArray(authorArticlesData) ? authorArticlesData : authorArticlesData.articles;
    const allArticles = Array.isArray(allArticlesData) ? allArticlesData : allArticlesData.articles;

    return (
        <div>
            {/* Author bio banner */}
            {author && (
                <div
                    className="w-full py-12 border-b border-[var(--flex-gray-15)]"
                    style={{ backgroundColor: "var(--flex-gray-7)" }}
                >
                    <div className="rb-container flex items-center gap-6">
                        <div
                            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold shrink-0"
                            style={{ backgroundColor: "var(--g-color)", fontFamily: "var(--font-heading)" }}
                        >
                            {author.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-heading)" }}>{author.name}</h1>
                                {authorAny.credentials?.verified && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Verified Expert
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-[var(--meta-fcolor)] mb-2">{author.role} · {authorArticles.length} articles</p>
                            <p className="text-sm text-[var(--excerpt-color)] max-w-xl mb-3">{author.bio}</p>

                            {/* Credentials section */}
                            {authorAny.credentials && (
                                <div className="flex flex-wrap gap-4 text-xs text-[var(--meta-fcolor)]">
                                    {authorAny.credentials.experience && (
                                        <span className="flex items-center gap-1">
                                            <span className="font-semibold text-[var(--body-fcolor)]">Experience:</span> {authorAny.credentials.experience}
                                        </span>
                                    )}
                                    {authorAny.credentials.education && (
                                        <span className="flex items-center gap-1">
                                            <span className="font-semibold text-[var(--body-fcolor)]">Education:</span> {authorAny.credentials.education}
                                        </span>
                                    )}
                                    {authorAny.credentials.specializations && (
                                        <span className="flex items-center gap-1">
                                            <span className="font-semibold text-[var(--body-fcolor)]">Focus:</span> {authorAny.credentials.specializations.join(", ")}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Previous publications */}
                            {authorAny.credentials?.previousPublications && (
                                <div className="mt-2 text-xs text-[var(--meta-fcolor)]">
                                    <span className="font-semibold text-[var(--body-fcolor)]">Previously at:</span>{" "}
                                    {authorAny.credentials.previousPublications.join(", ")}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <CategoryTemplate
                heading={author ? `Articles by ${author.name}` : "Author"}
                articles={authorArticles}
                categories={categories}
                allArticles={allArticles}
                categorySlug={`author/${slug}`}
            />
        </div>
    );
}
