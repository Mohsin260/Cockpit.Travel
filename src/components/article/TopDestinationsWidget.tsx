"use client";

import Link from "next/link";

interface DestinationArticle {
  slug: string;
  title: string;
  image?: string;
  categoryLabel?: string;
}

export default function TopDestinationsWidget({ destinations }: { destinations: DestinationArticle[] }) {
  if (!destinations || destinations.length === 0) return null;

  return (
    <div className="my-8 p-6 bg-[var(--shadeColor)] border border-[var(--borderColor)] rounded-xl">
      <h3 className="text-xl font-bold text-[var(--titleColor)] mb-4">Top 5 Destinations In The World</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {destinations.map((dest, i) => (
          <Link
            key={dest.slug}
            href={`/posts/${dest.slug}`}
            className="group block rounded-lg overflow-hidden border border-[var(--borderColor)] hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              {dest.image && (
                <img
                  src={dest.image}
                  alt={dest.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              )}
              <span className="absolute top-2 left-2 bg-[var(--primaryColor)] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                {i + 1}
              </span>
            </div>
            <div className="p-3">
              <h4 className="text-sm font-semibold text-[var(--titleColor)] leading-snug line-clamp-2 group-hover:text-[var(--primaryColor)] transition-colors">
                {dest.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
