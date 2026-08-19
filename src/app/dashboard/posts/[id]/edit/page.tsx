import { connectDB } from "@/lib/db";
import { Article } from "@/lib/models/Article";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    await connectDB();
    const article = await Article.findById(id).lean();

    if (!article) {
      return <div className="p-8 text-center"><p>Post not found</p></div>;
    }

    const { PostEditor } = await import("@/components/admin/post-editor");

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
            categoryLabel: (article as any).categoryLabel || "",
            author: article.author || "admin",
            authorName: (article as any).authorName || "Admin",
            author_photo: (article as any).author_photo || "",
            date: article.date || new Date().toISOString(),
            readTime: (article as any).readTime || 5,
            featured: article.featured || false,
            tags: article.tags || [],
            views: article.views || 0,
            status: article.status || "draft",
            articleMedia: (article as any).articleMedia || {},
            bodyContent: (article as any).bodyContent || "",
            keyTakeawaysContent: (article as any).keyTakeawaysContent || "",
            finalThoughtsContent: (article as any).finalThoughtsContent || "",
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
