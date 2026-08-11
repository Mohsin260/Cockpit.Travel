"use client";

import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BreakingNews from "@/components/BreakingNews";
import VideoNews from "@/components/VideoNews";
import TopOfWeek from "@/components/TopOfWeek";
import TopStories from "@/components/TopStories";
import Subscribe from "@/components/Subscribe";
import Footer from "@/components/Footer";
import AdSlot from "@/components/ui/AdSlot";
import { DEPLOYMENT_LOCALE } from "@/lib/i18n";
import { useAudioStore } from "@/hooks/useAudioStore";
import { prepareTextForSpeech } from "@/lib/utils/textPreparation";

const tagsByLocale: Record<string, string[]> = {
  en: ["Hotels", "Flights", "Destinations", "Traveling", "Travel Intelligence", "Budget", "Luxury", "Adventure", "Culture", "Food"],
  es: ["Hoteles", "Vuelos", "Destinos", "Viajes", "Inteligencia de Viajes", "Presupuesto", "Lujo", "Aventura", "Cultura", "Gastronomía"],
  ar: ["الفنادق", "الرحلات", "الوجهات", "السفر", "معلومات السفر", "الميزانية", "الفخامة", "المغامرة", "الثقافة", "الطعام"],
};

// Maps each locale's categories to homepage section names
const categoryToSection: Record<string, Record<string, string>> = {
  en: {
    hotels: "hotels",
    flights: "flights",
    destinations: "destinations",
    "travel-intelligence": "travel-intelligence",
  },
  es: {
    business: "hotels",
    travel: "flights",
    destinations: "destinations",
    heritage: "destinations",
    technology: "travel-intelligence",
    health: "hotels",
    sports: "flights",
    education: "travel-intelligence",
  },
  ar: {
    business: "hotels",
    travel: "flights",
    destinations: "destinations",
    heritage: "destinations",
    technology: "travel-intelligence",
    health: "hotels",
    sports: "flights",
    education: "travel-intelligence",
  },
};

function getSection(category: string): string {
  const map = categoryToSection[DEPLOYMENT_LOCALE] || categoryToSection.en;
  return map[category] || category;
}

export default function HomeTemplate({ articles, categories }: { articles: any[]; categories: any[]; [key: string]: any }) {
  const hotelArticles = articles.filter((a: any) => getSection(a.category) === "hotels");
  const flightArticles = articles.filter((a: any) => getSection(a.category) === "flights");
  const destinationArticles = articles.filter((a: any) => getSection(a.category) === "destinations");
  const intelligenceArticles = articles.filter((a: any) => getSection(a.category) === "travel-intelligence");

  const featured = articles.find((a: any) => a.featured) || articles[0];
  const featuredCards = articles.filter((a: any) => a.slug !== featured?.slug).slice(0, 5);
  const recentNewsPosts = articles.slice(0, 5);

  const setAudioContent = useAudioStore((s) => s.setAudioContent);

  useEffect(() => {
    if (!articles || articles.length === 0) return;

    const sections: { title: string; articles: { title: string; authorName?: string }[] }[] = [
      { title: "Hotels", articles: hotelArticles.map((a: any) => ({ title: a.title, authorName: a.authorName })) },
      { title: "Flights", articles: flightArticles.map((a: any) => ({ title: a.title, authorName: a.authorName })) },
      { title: "Destinations", articles: destinationArticles.map((a: any) => ({ title: a.title, authorName: a.authorName })) },
      { title: "Travel Intelligence", articles: intelligenceArticles.map((a: any) => ({ title: a.title, authorName: a.authorName })) },
    ];

    let fullText = "";
    sections.forEach((section) => {
      if (section.articles.length === 0) return;
      fullText += section.title + ". ";
      section.articles.forEach((article, i) => {
        fullText += `Article ${i + 1}: ${article.title}. `;
        if (article.authorName) fullText += `By ${article.authorName}. `;
      });
    });

    if (fullText) {
      setAudioContent(prepareTextForSpeech(fullText));
    }
  }, [articles]);

  return (
    <div className="nerio-page-wrapper flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <AdSlot pageType="homepage" position="top-leaderboard" />

        {featured && (
          <Hero
            featured={featured}
            featuredCards={featuredCards}
            recentNews={recentNewsPosts}
          />
        )}

        <AdSlot pageType="homepage" position="mid-leaderboard-1" />

        <BreakingNews articles={hotelArticles} />

        <AdSlot pageType="homepage" position="mid-leaderboard-2" />

        <VideoNews articles={intelligenceArticles} />

        <AdSlot pageType="homepage" position="mid-leaderboard-3" />

        <TopOfWeek
          articles={destinationArticles}
          recentArticles={articles.slice(0, 4)}
          popularArticles={[...articles].sort((a: any, b: any) => (b.views || 0) - (a.views || 0)).slice(0, 4)}
          trendyArticles={[...articles].sort((a: any, b: any) => {
            const aDate = new Date(a.date || 0).getTime();
            const bDate = new Date(b.date || 0).getTime();
            const now = Date.now();
            const dayMs = 86400000;
            const aRecency = Math.max(1, 30 - (now - aDate) / dayMs);
            const bRecency = Math.max(1, 30 - (now - bDate) / dayMs);
            return ((b.views || 0) * bRecency) - ((a.views || 0) * aRecency);
          }).slice(0, 4)}
          categories={categories}
          tags={tagsByLocale[DEPLOYMENT_LOCALE] || tagsByLocale.en}
        />

        <AdSlot pageType="homepage" position="mid-leaderboard-4" />

        <TopStories articles={flightArticles} />

        <AdSlot pageType="homepage" position="bottom-leaderboard" />

        <Subscribe />
      </main>
      <Footer />
      <AdSlot pageType="homepage" position="sticky-footer" />
    </div>
  );
}
