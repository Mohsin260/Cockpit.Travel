import { PostEditor } from "@/components/admin/post-editor";
import { connectDB } from "@/lib/db";
import { Article } from "@/lib/models/Article";
import { ObjectId } from "mongodb";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  try {
    // Connect directly to database instead of API call
    await connectDB();
    
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid post ID format");
    }

    const article = await Article.findById(id).lean();

    if (!article) {
      throw new Error("Post not found");
    }

    return (
      <div className="px-4 py-4 lg:px-6 lg:py-6">
        <PostEditor
          mode="edit"
          postId={id}
          initial={{
            title: article.title || "",
            slug: article.slug || "",
            excerpt: article.excerpt || "",
            category: article.category || "",
            categoryLabel: article.categoryLabel || "",
            author: article.author || "admin",
            authorName: article.authorName || "Admin",
            author_photo: (article as any).author_photo || "",
            date: article.date || new Date().toISOString(),
            readTime: article.readTime || 5,
            featured: article.featured || false,
            tags: article.tags || [],
            views: article.views || 0,
            status: article.status || "draft",
            articleMedia: {
              heroCoverMedia: {
                url: (article as any).articleMedia?.heroCoverMedia?.url || (article as any).articleImages?.heroCoverImage || (article as any).heroCoverImage || "",
                vastTagUrl: (article as any).articleMedia?.heroCoverMedia?.vastTagUrl || "",
                poster: (article as any).articleMedia?.heroCoverMedia?.poster || ""
              },
              postBodyMedia: {
                url: (article as any).articleMedia?.postBodyMedia?.url || (article as any).articleImages?.postBodyImage || (article as any).postBodyImage || "",
                vastTagUrl: (article as any).articleMedia?.postBodyMedia?.vastTagUrl || "",
                poster: (article as any).articleMedia?.postBodyMedia?.poster || ""
              },
              keyTakeawaysMedia: {
                url: (article as any).articleMedia?.keyTakeawaysMedia?.url || (article as any).articleImages?.keyTakeawaysImage || (article as any).keyTakeawaysImage || "",
                vastTagUrl: (article as any).articleMedia?.keyTakeawaysMedia?.vastTagUrl || "",
                poster: (article as any).articleMedia?.keyTakeawaysMedia?.poster || ""
              },
              finalThoughtsMedia: {
                url: (article as any).articleMedia?.finalThoughtsMedia?.url || (article as any).articleImages?.finalThoughtsImage || (article as any).finalThoughtsImage || "",
                vastTagUrl: (article as any).articleMedia?.finalThoughtsMedia?.vastTagUrl || "",
                poster: (article as any).articleMedia?.finalThoughtsMedia?.poster || ""
              }
            },
            bodyContent: article.bodyContent || "",
            keyTakeawaysContent: article.keyTakeawaysContent || "",
            finalThoughtsContent: article.finalThoughtsContent || "",
          }}
        />
      </div>
    );
  } catch (error: any) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  }
}
