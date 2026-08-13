"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/article/Breadcrumb";
import { useTranslations } from "@/hooks/useTranslations";

export default function AboutUsPage() {
  const t = useTranslations();
  return (
    <div className="nerio-page-wrapper flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 mb-[50px]">
        <Breadcrumb category={{ label: t("aboutUs.breadcrumbLabel"), color: "#e033e0" }} title={t("aboutUs.title")} />
        <section className="nerio-container py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">{t("aboutUs.title")}</h1>
            <div className="space-y-6 text-[var(--bodyColor)] leading-relaxed">
              <p>{t("aboutUs.intro")}</p>
              <p>{t("aboutUs.founded")}</p>
              <p>{t("aboutUs.team")}</p>
              <h2 className="text-2xl font-bold mt-8 mb-4">{t("aboutUs.missionTitle")}</h2>
              <p>{t("aboutUs.mission")}</p>
              <h2 className="text-2xl font-bold mt-8 mb-4">{t("aboutUs.teamTitle")}</h2>
              <p>{t("aboutUs.teamDesc")}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
