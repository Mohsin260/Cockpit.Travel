import WebsiteLayoutWrapper from "@/components/layout/WebsiteLayoutWrapper";
import StickySidebar from "@/components/StickySidebar";
import ScrollToTop from "@/components/ScrollToTop";
import ReadingProgress from "@/components/ReadingProgress";
import SubscribePopup from "@/components/SubscribePopup";
import { QueryProvider } from "@/components/providers/query-provider";
import Script from "next/script";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Google IMA SDK for VAST Video Ads */}
      <Script 
        src="https://imasdk.googleapis.com/js/sdkloader/ima3.js" 
        strategy="beforeInteractive"
      />
      <QueryProvider>
        <WebsiteLayoutWrapper>{children}</WebsiteLayoutWrapper>
      </QueryProvider>
      <StickySidebar />
      <ScrollToTop />
      <ReadingProgress />
      <SubscribePopup />
    </>
  );
}
