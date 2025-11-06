
import { useRef } from "react";
import WobShaderOverlay from "@/components/WobShaderOverlay";
import { Layout } from "@/components/Layout";
import { MagicCursor } from "@/components/MagicCursor";
import { useVideoScrub } from "@/hooks/useVideoScrub";
import { HeroSection } from "@/components/HeroSection";

const Wob = () => {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Layout>
      <MagicCursor heroRef={heroRef} />
      <HeroSection
        ref={heroRef}
        videoRef={videoRef}
        className="hide-cursor"
        videoClassName="opacity-50"
      >
        <WobShaderOverlay />
      </HeroSection>

      {/* Blank Body Section */}
      <section className="h-[600px]"></section>
    </Layout>
  );
};
export default Wob;