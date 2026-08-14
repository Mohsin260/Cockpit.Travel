"use client";

import ListenButton from "@/components/ui/ListenButton";
import { translate } from "@/lib/translate";

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
        fullText += `${translate("audio.article")} ${i + 1}: ${article.title}. `;
        if (article.authorName) {
          fullText += `${translate("common.by")} ${article.authorName}. `;
        }
      });
    }
    return fullText;
  };

  return <ListenButton text={buildFullText()} size={size} className={className} />;
}