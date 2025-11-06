
import { useRef } from "react";
import WobShaderOverlay from "@/components/WobShaderOverlay";
import { Layout } from "@/components/Layout";
import { MagicCursor } from "@/components/MagicCursor";
import { HeroSection } from "@/components/HeroSection";

const Wob = () => {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Layout pageTitle="Wob">
      <MagicCursor heroRef={heroRef} />
      <HeroSection ref={heroRef} videoRef={videoRef} className="hide-cursor">
        <WobShaderOverlay />
      </HeroSection>

      {/* Blank Body Section */}
      <section className="h-[600px]"></section>
    </Layout>
  );
};
export default Wob;