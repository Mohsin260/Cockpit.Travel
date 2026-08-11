"use client";

import FeaturedImage from "@/components/article/FeaturedImage";
import ArticleTitle from "@/components/article/ArticleTitle";
import PostMeta from "@/components/article/PostMeta";
import ArticleBody from "@/components/article/ArticleBody";
import TagsAndShare from "@/components/article/TagsAndShare";
import AuthorBox from "@/components/article/AuthorBox";
import PostNavigation from "@/components/article/PostNavigation";
import CommentForm from "@/components/article/CommentForm";
import RelatedPosts from "@/components/article/RelatedPosts";
import TabWidget from "@/components/article/TabWidget";
import CategoriesWidget from "@/components/article/CategoriesWidget";
import FollowWidget from "@/components/article/FollowWidget";
import TagsWidget from "@/components/article/TagsWidget";
import SearchWidget from "@/components/article/SearchWidget";
import AdSlot from "@/components/ui/AdSlot";
import InFeedNativeAd from "@/components/ads/InFeedNativeAd";
import SectionAudioButton from "@/components/ui/SectionAudioButton";
import { useTranslations } from "@/hooks/useTranslations";

interface ArticleTemplateProps {
  article: any;
  related: any[];
  categories: any[];
  trending: any[];
  recent: any[];
}

export default function ArticleTemplate({ article, related, categories, trending, recent }: ArticleTemplateProps) {
  const t = useTranslations();
  if (!article) return null;

  const sidebarCategories = (categories || []).map((c: any) => ({
    name: c.name || c.label || "",
    count: c.count || 0,
    href: `/category/${c.slug || c.name?.toLowerCase().replace(/\s+/g, "-")}`,
    image: c.image || "",
  }));

  const plainTextContent = (article.bodyContent || article.content || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div className="nerio-container has-sidebar py-[80px]">
      <AdSlot pageType="article" position="top-leaderboard" articleSlug={article.slug} />
      <div className="flex flex-col lg:flex-row gap-[30px] items-start">
        <div className="w-full lg:w-[67%] min-w-0">
          <FeaturedImage src={article.articleMedia?.heroCoverMedia?.url || article.featuredImage} poster={article.articleMedia?.heroCoverMedia?.poster} vastTagUrl={article.articleMedia?.heroCoverMedia?.vastTagUrl} alt={article.title} />
          <ArticleTitle title={article.title} />
          <PostMeta
            author={{ name: article.authorName || "Admin", avatar: article.authorAvatar || "https://media.licdn.com/dms/image/v2/D4E03AQEZDHRQ7O0C2w/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1714234759381?e=1787788800&v=beta&t=BQdZSVLBXmNimnQbwknQXQh5QEpHnPOzNRMsbOIK4Uo" }}
            date={article.date || article.createdAt}
            category={{ label: article.categoryLabel || article.category, color: article.categoryColor || "#004df2" }}
            comments={String(article.comments?.length || 0)}
          />
          <div className="flex items-center gap-3 mb-4">
            <SectionAudioButton text={plainTextContent} className="article-listen-btn" />
            <span className="text-sm text-[var(--bodyColor)]">Listen to this article</span>
          </div>
          <AdSlot pageType="article" position="atf-rectangle" articleSlug={article.slug} />
          <ArticleBody content={article.bodyContent || article.content} />
          <TagsAndShare tags={article.tags || []} />
          <AuthorBox author={{ name: article.authorName || "Admin", avatar: article.authorAvatar || "", bio: article.authorBio || "" }} />
          <PostNavigation
            prevPost={article.prevPost || { slug: "", title: "", image: "" }}
            nextPost={article.nextPost || { slug: "", title: "", image: "" }}
          />
          <CommentForm />
          <RelatedPosts articles={related || []} />
          <AdSlot pageType="article" position="bottom-leaderboard" articleSlug={article.slug} />
        </div>
        <aside className="w-full lg:w-[33%] sticky top-[100px] space-y-[30px]">
          <SearchWidget />
          <TabWidget
            recentArticles={recent || []}
            popularArticles={trending || []}
            trendyArticles={trending || []}
          />
          <CategoriesWidget categories={sidebarCategories} />
          <InFeedNativeAd position="sidebar-in-feed" cardStyle="sidebar-ad" />
          <FollowWidget socialCards={[
            { name: "Facebook", followers: t("sidebar.followUs"), color: "#0073FF", icon: "facebook" },
            { name: "Twitter", followers: t("sidebar.followUs"), color: "#121213", icon: "twitter" },
            { name: "Instagram", followers: t("sidebar.followUs"), color: "linear-gradient(29deg, #BE08AF 0%, #F10811 100%)", icon: "instagram" },
            { name: "LinkedIn", followers: t("sidebar.followUs"), color: "#0077B5", icon: "linkedin" },
          ]} />
          <TagsWidget tags={article.tags || []} />
        </aside>
      </div>
      <AdSlot pageType="article" position="sticky-footer" articleSlug={article.slug} />
    </div>
  );
}
