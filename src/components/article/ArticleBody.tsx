import InFeedNativeAd from "@/components/ads/InFeedNativeAd";

interface Block {
  type: string;
  text?: string;
  src?: string;
  images?: string[];
  author?: string;
  items?: string[];
}

function parseHtmlToBlocks(html: string): Block[] {
  const blocks: Block[] = [];
  const parts = html.replace(/<\/p>/g, "</p>\n").split("\n").filter((s) => s.trim());
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("<h2") || trimmed.startsWith("<h3") || trimmed.startsWith("<h4")) {
      const text = trimmed.replace(/<[^>]+>/g, "");
      blocks.push({ type: "heading", text });
    } else if (trimmed.startsWith("<ul") || trimmed.startsWith("<ol")) {
      const items: string[] = [];
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let match;
      while ((match = liRegex.exec(trimmed))) {
        items.push(match[1].replace(/<[^>]+>/g, ""));
      }
      blocks.push({ type: "check-list", items });
    } else if (trimmed.startsWith("<blockquote")) {
      const text = trimmed.replace(/<[^>]+>/g, "");
      blocks.push({ type: "blockquote", text });
    } else if (trimmed.startsWith("<p")) {
      const inner = trimmed.replace(/^<p[^>]*>/, "").replace(/<\/p>$/, "");
      blocks.push({ type: "paragraph", text: inner });
    } else {
      blocks.push({ type: "paragraph", text: trimmed });
    }
  }
  return blocks;
}

export default function ArticleBody({
  content,
}: {
  content?: string | Block[];
}) {
  if (!content) return null;

  let blocks: Block[];
  if (typeof content === "string") {
    blocks = parseHtmlToBlocks(content);
  } else if (Array.isArray(content)) {
    blocks = content;
  } else {
    return null;
  }

  if (blocks.length === 0) return null;

  let paragraphCount = 0;

  return (
    <div className="rstb-post-content mb-[30px]">
      {blocks.map((block, i) => {
        if (block.type === "paragraph") {
          paragraphCount++;
          return (
            <>
              <p key={i} className="text-bodyColor text-[16px] leading-[1.75] mb-[20px]" dangerouslySetInnerHTML={{ __html: block.text || "" }} />
              {paragraphCount === 2 && <InFeedNativeAd position="in-content-1" cardStyle="article-inline" pageType="article" />}
              {paragraphCount === 4 && <InFeedNativeAd position="in-content-2" cardStyle="article-inline" pageType="article" />}
            </>
          );
        }

        if (block.type === "heading") {
          return (
            <h3 key={i} className="font-title text-titleColor text-[22px] lg:text-[24px] font-bold mt-[30px] mb-[16px] leading-[1.3]">
              {block.text}
            </h3>
          );
        }

        if (block.type === "check-list") {
          return (
            <ul key={i} className="rs-has-check-icon mb-[20px]">
              {(block.items || block.text?.split("\n") || []).map((item, j) => (
                <li key={j} className="text-bodyColor text-[16px] leading-[1.75] mb-[8px]" dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          );
        }

        if (block.type === "images-side-by-side") {
          return (
            <div key={i} className="wp-block-gallery rs-img-rounded-sm grid grid-cols-1 sm:grid-cols-2 gap-[16px] mb-[24px]">
              {block.images?.map((img, j) => (
                <figure key={j} className="wp-block-image rounded-[6px] overflow-hidden m-0">
                  <img src={img} alt="" className="w-full h-auto object-cover" />
                </figure>
              ))}
            </div>
          );
        }

        if (block.type === "image-full") {
          return (
            <figure key={i} className="wp-block-image rs-img-rounded-sm rounded-[6px] overflow-hidden mb-[24px] m-0">
              <img src={block.src} alt="" className="w-full h-auto object-cover" />
            </figure>
          );
        }

        if (block.type === "blockquote") {
          return (
            <blockquote
              key={i}
              className="rs-post-quote-box"
            >
              <p className="text-titleColor" dangerouslySetInnerHTML={{ __html: block.text || "" }} />
              <cite className="text-titleColor">
                {block.author}
              </cite>
            </blockquote>
          );
        }

        return null;
      })}
    </div>
  );
}
