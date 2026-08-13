import Preloader from "@/components/Preloader";
import HomeTemplate from "@/components/HomeTemplate";
import { fetchArticles, fetchCategories, fetchComparisons, fetchHomepageSettings, resolveFeaturedComparisons } from "@/lib/api";
import type { ComparisonArticle } from "@/types";
import type { Metadata } from 'next';
import { translate } from "@/lib/translate";

export const revalidate = 60;

const siteName = translate("common.siteName");

export const metadata: Metadata = {
  title: `${siteName} – Travel News & Updates`,
  description: "Your daily source for travel news, destination guides, hotel reviews, and flight updates.",
};

export default async function HomePage() {
  const [{ articles }, categories, { articles: comparisons }, homepageSettings] = await Promise.all([
    fetchArticles({ limit: 100 }),
    fetchCategories(),
    fetchComparisons({ limit: 50 }),
    fetchHomepageSettings(),
  ]);

  const featuredComparisons = resolveFeaturedComparisons(
    comparisons as ComparisonArticle[],
    homepageSettings.featuredComparisonIds,
    homepageSettings.maxCount
  );

  return (
    <>
      <Preloader />
      <HomeTemplate
        articles={articles}
        comparisons={comparisons as ComparisonArticle[]}
        featuredComparisons={featuredComparisons}
        categories={categories}
        featuredComparisonsMaxCount={homepageSettings.maxCount}
      />
    </>
  );
}
