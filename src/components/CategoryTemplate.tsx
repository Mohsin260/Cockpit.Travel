import Link from "next/link"
export default function CategoryTemplate({ heading, articles, categories, categorySlug }: { heading: string; articles: any[]; categories: any[]; allArticles?: any[]; description?: string; pagination?: any; categorySlug: string }) {
  return <div className="nerio-container py-10"><h1>{heading}</h1><div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">{articles?.map((a: any) => <Link key={a.slug || a.id} href={`/posts/${a.slug}`} className="border rounded-lg overflow-hidden hover:shadow transition">{a.image && <img src={a.image} alt={a.title} className="w-full h-48 object-cover" />}<div className="p-4"><h3 className="font-bold">{a.title}</h3><p className="text-sm text-muted-foreground mt-1">{a.excerpt?.slice(0, 100)}</p></div></Link>)}</div></div>
}
