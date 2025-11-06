import { useEffect, useRef } from "react";
import VhsShaderOverlay from "@/components/VhsShaderOverlay";
import { Layout } from "@/components/Layout";
import { useVideoScrub } from "@/hooks/useVideoScrub";
import { HeroSection } from "@/components/HeroSection";

const Poly = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useVideoScrub(videoRef, heroRef);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    // --- Spotlight Cursor Logic ---
    const handleSpotlight = (e: MouseEvent) => {
      const rect = heroEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      heroEl.style.setProperty("--x", `${x}px`);
      heroEl.style.setProperty("--y", `${y}px`);
    };

    heroEl.addEventListener("mousemove", handleSpotlight);

    return () => {
      heroEl.removeEventListener("mousemove", handleSpotlight);
    };
  }, []); // Spotlight logic is separate and only needs the heroRef

  return (
    <Layout pageTitle="Poly">
      <HeroSection ref={heroRef} videoRef={videoRef}>
        <div
          ref={spotlightRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at var(--x) var(--y), rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 25%)",
          }}
        ></div>
        <VhsShaderOverlay />
      </HeroSection>

      {/* Blank Body Section */}
      <section className="h-[600px]"></section>
    </Layout>
  );
};
export default Poly;