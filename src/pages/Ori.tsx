import { useRef } from "react";
import { Layout } from "@/components/Layout";
import { useVideoScrub } from "@/hooks/useVideoScrub";
import { MagicCursor } from "@/components/MagicCursor";
import { HeroSection } from "@/components/HeroSection";

const Ori = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useVideoScrub(videoRef, heroRef);

  return (
    <Layout pageTitle="Ori">
      <MagicCursor heroRef={heroRef} />
      <HeroSection ref={heroRef} videoRef={videoRef} className="hide-cursor" />

      {/* Blank Body Section */}
      <section className="h-[600px]"></section>
    </Layout>
  );
};
export default Ori;