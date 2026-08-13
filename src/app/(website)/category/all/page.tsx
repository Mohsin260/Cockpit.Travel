import type { Metadata } from "next";
import AllCategoriesTemplate from "@/components/AllCategoriesTemplate";
import { translate } from "@/lib/translate";

export const dynamic = "force-dynamic";

const siteName = translate("common.siteName");

export const metadata: Metadata = {
  title: "All Categories",
  description: `Browse all content categories on ${siteName}`,
  openGraph: {
    title: `All Categories — ${siteName}`,
    description: `Browse all content categories on ${siteName}`,
    type: "website",
  },
  alternates: {
    canonical: "https://cockpit.travel/category/all",
  },
};

async function fetchCategoriesWithLatest() {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXTAUTH_URL?.replace(/\/$/, "") || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/categories/with-latest`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load categories");
  return res.json();
}

export default async function AllCategoriesPage() {
  const categories = await fetchCategoriesWithLatest();

  return <AllCategoriesTemplate categories={categories} />;
}
