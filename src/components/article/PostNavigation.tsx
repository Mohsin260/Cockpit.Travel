import Link from "next/link";
import { translate } from "@/lib/translate";

export default function PostNavigation({
  prevPost,
  nextPost,
}: {
  prevPost: { slug: string; title: string; image: string };
  nextPost: { slug: string; title: string; image: string };
}) {
  const hasPrev = prevPost && prevPost.slug;
  const hasNext = nextPost && nextPost.slug;

  if (!hasPrev && !hasNext) return null;

  return (
    <div className="rstb-post-navigation flex justify-between items-center gap-[20px] py-[30px] border-t border-b border-gray-200">
      {/* Previous Post */}
      <div className={`post-nav-item-wrap flex ${hasPrev ? 'w-1/2 justify-start' : 'w-full justify-center'}`}>
        {hasPrev ? (
          <Link
            href={`/${prevPost.slug}`}
            className="post-nav-item prev-post flex items-center gap-[20px] group"
          >
            <div className="post-thumb flex-shrink-0">
              {prevPost.image && (
                <img
                  src={prevPost.image}
                  alt=""
                  className="w-[80px] h-[80px] rounded-full object-cover"
                />
              )}
            </div>
            <div className="post-content flex flex-col">
              <span className="post-custom-label text-[16px] text-bodyColor font-normal mb-[5px]">
                {translate("article.previous")}
              </span>
              <span className="post-title text-[18px] font-semibold text-titleColor leading-[1.25] group-hover:text-blue-600 transition-colors">
                {prevPost.title}
              </span>
            </div>
          </Link>
        ) : (
          <span />
        )}
      </div>

      {/* Next Post */}
      <div className={`post-nav-item-wrap flex ${hasNext ? 'w-1/2 justify-end' : 'w-full justify-center'}`}>
        {hasNext ? (
          <Link
            href={`/${nextPost.slug}`}
            className="post-nav-item next-post flex items-center gap-[20px] flex-row-reverse group text-right"
          >
            <div className="post-thumb flex-shrink-0">
              {nextPost.image && (
                <img
                  src={nextPost.image}
                  alt=""
                  className="w-[80px] h-[80px] rounded-full object-cover"
                />
              )}
            </div>
            <div className="post-content flex flex-col items-end">
              <span className="post-custom-label text-[16px] text-bodyColor font-normal mb-[5px]">
                {translate("article.next")}
              </span>
              <span className="post-title text-[18px] font-semibold text-titleColor leading-[1.25] group-hover:text-blue-600 transition-colors">
                {nextPost.title}
              </span>
            </div>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}