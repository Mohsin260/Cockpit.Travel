import Link from "next/link"
import { useTranslations } from "@/hooks/useTranslations"
interface Category { slug: string; label: string; color: string; count: number; latestImage?: string }
export default function AllCategoriesTemplate({ categories }: { categories: Category[] }) {
  const t = useTranslations()
  return <div className="nerio-container py-10"><h1>{t("nav.categories")}</h1><div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">{categories.map(c => <Link key={c.slug} href={`/category/${c.slug}`} className="border rounded-lg p-4 hover:shadow transition"><h3>{c.label}</h3><p className="text-sm text-muted-foreground">{c.count} {t("common.articles")}</p></Link>)}</div></div>
}
