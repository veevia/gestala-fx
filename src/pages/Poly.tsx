import { useEffect, useRef } from "react";
import VhsShaderOverlay from "@/components/VhsShaderOverlay";

const Poly = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let targetProgress = 0;
    let currentProgress = 0;
    let playbackMode: 'scrubbing' | 'coasting' = 'scrubbing';
    let coastingStartTime: number | null = null;
    const coastDuration = 800;
    const easingFactor = 0.1;
    let inactivityTimeout: NodeJS.Timeout;
    let animationFrameId: number;

    const handleScroll = () => {
      if (video.duration) {
        const scrollDistanceForVideo = window.innerHeight;
        const scrollProgress = Math.min(1, window.scrollY / scrollDistanceForVideo);
        handleInteraction(scrollProgress);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const heroEl = heroRef.current;
      if (!heroEl) return;

      const rect = heroEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xProgress = Math.max(0, Math.min(1, x / rect.width));
      const yProgress = Math.max(0, Math.min(1, y / rect.height));
      const progress = (xProgress + yProgress) / 2;

      if (window.scrollY === 0) {
        handleInteraction(progress);
      }
    };

    const handleInteraction = (newTargetProgress: number) => {
      playbackMode = 'scrubbing';
      coastingStartTime = null;
      if (!video.paused) video.pause();
      clearTimeout(inactivityTimeout);
      targetProgress = newTargetProgress;
      inactivityTimeout = setTimeout(() => {
        playbackMode = 'coasting';
        coastingStartTime = performance.now();
      }, 500);
    };

    const smoothScrub = () => {
      if (video.duration) {
        if (playbackMode === 'coasting' && coastingStartTime) {
          const elapsed = performance.now() - coastingStartTime;
          if (elapsed < coastDuration) {
            const coastProgress = 1 - Math.pow(1 - (elapsed / coastDuration), 3);
            const additionalProgress = (coastDuration / 1000 / video.duration) * coastProgress;
            targetProgress = currentProgress + additionalProgress;
          } else {
            video.play();
            coastingStartTime = null;
          }
        }

        const delta = targetProgress - currentProgress;
        if (Math.abs(delta) > 0.0001) {
          currentProgress += delta * easingFactor;
        } else if (playbackMode === 'scrubbing') {
          currentProgress = targetProgress;
        }

        video.currentTime = video.duration * currentProgress;
      }
      animationFrameId = requestAnimationFrame(smoothScrub);
    };

    smoothScrub();
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(inactivityTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">GESTALA (Poly)</div>
          <div className="hidden md:flex gap-8 text-sm">
            <a href="/" className="hover:text-blue-400 transition">Home</a>
            <a href="/ori" className="hover:text-blue-400 transition">Ori</a>
            <a href="/poly" className="text-blue-400 transition">Poly</a>
            <a href="/wob" className="hover:text-blue-400 transition">Wob</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <video ref={videoRef} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <VhsShaderOverlay />
      </section>

      {/* Blank Body Section */}
      <section className="h-[600px]"></section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6">
          <h2 className="text-[120px] font-bold leading-none text-center md:text-9xl">Gestala</h2>
        </div>
      </footer>
    </div>;
};
export default Poly;