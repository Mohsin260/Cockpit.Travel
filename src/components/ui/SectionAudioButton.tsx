"use client";

import { useSpeechEngine } from "@/hooks/useSpeechEngine";

interface Article {
  title: string;
  authorName?: string;
}

interface SectionAudioButtonProps {
  text: string;
  articles?: Article[];
  className?: string;
}

export default function SectionAudioButton({ text, articles, className = "" }: SectionAudioButtonProps) {
  const { togglePlayPause, isPlaying, isPaused, hasSupport } = useSpeechEngine();

  if (!hasSupport || !text) return null;

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

  const handleClick = () => {
    togglePlayPause(buildFullText());
  };

  return (
    <button
      onClick={handleClick}
      className={`section-audio-btn ${isPlaying || isPaused ? "section-audio-btn-active" : ""} ${className}`}
      aria-label={isPlaying ? "Pause listening" : isPaused ? "Resume listening" : "Listen to this section"}
      title={isPlaying ? "Pause" : isPaused ? "Resume" : "Listen"}
    >
      {isPlaying ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
        </svg>
      )}
    </button>
  );
}
