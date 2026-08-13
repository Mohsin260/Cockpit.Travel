"use client";

import ListenButton from "@/components/ui/ListenButton";

interface Article {
  title: string;
  authorName?: string;
}

interface SectionAudioButtonProps {
  text: string;
  articles?: Article[];
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function SectionAudioButton({ text, articles, className = "", size = "sm" }: SectionAudioButtonProps) {
  if (!text) return null;

  const buildFullText = () => {
    let fullText = text + ". ";
    if (articles && articles.length > 0) {
      articles.forEach((article, i) => {
        fullText += `Article ${i + 1}: ${article.title}. `;
        if (article.authorName) {
          fullText += `By ${article.authorName}. `;
        }
      });
    }
    return fullText;
  };

  return <ListenButton text={buildFullText()} size={size} className={className} />;
}