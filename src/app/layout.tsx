import type { Metadata } from "next";
import { Inter_Tight, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import StickySidebar from "@/components/StickySidebar";
import { QueryProvider } from "@/components/providers/query-provider";
import { DEPLOYMENT_LOCALE, LOCALE_HTML_LANG, isRtl } from "@/lib/i18n";
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const metadataByLocale: Record<string, { title: string; description: string }> = {
  en: { title: "Cockpit.Travel – Travel News", description: "Your trusted source for travel news, destination guides, hotel reviews, and flight updates." },
  es: { title: "Cockpit.Travel – Noticias de Viajes", description: "Tu fuente confiable de noticias de viajes, guías de destinos, reseñas de hoteles y actualizaciones de vuelos." },
  ar: { title: "Cockpit.Travel – أخبار السفر", description: "مصدرك الموثوق لأخبار السفر وأدلة الوجهات ومراجعات الفنادق وتحديثات الرحلات الجوية." },
};

export const metadata: Metadata = {
  title: metadataByLocale[DEPLOYMENT_LOCALE]?.title || metadataByLocale.en.title,
  description: metadataByLocale[DEPLOYMENT_LOCALE]?.description || metadataByLocale.en.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const htmlLang = LOCALE_HTML_LANG[DEPLOYMENT_LOCALE];
  const htmlDir = isRtl(DEPLOYMENT_LOCALE) ? "rtl" : "ltr";
  const fontVariable = DEPLOYMENT_LOCALE === "ar" ? notoSansArabic.variable : interTight.variable;

  return (
    <html lang={htmlLang} dir={htmlDir} className={fontVariable}>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css" />
      </head>
      <body className="min-h-screen flex flex-col font-body antialiased">
        <QueryProvider>
          {children}
        </QueryProvider>
        <StickySidebar />
      </body>
    </html>
  );
}
