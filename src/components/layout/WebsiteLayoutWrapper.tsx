import AudioPlayer from "@/components/ui/AudioPlayer";

export default function WebsiteLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AudioPlayer />
    </>
  );
}
