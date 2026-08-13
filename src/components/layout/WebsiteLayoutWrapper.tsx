import AudioPlayer from "@/components/ui/AudioPlayer";
import { DEPLOYMENT_LOCALE, isRtl } from "@/lib/i18n";

export default function WebsiteLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div dir={isRtl(DEPLOYMENT_LOCALE) ? "rtl" : "ltr"} className="website-shell flex-1">
      {children}
      <AudioPlayer />
    </div>
  );
}
