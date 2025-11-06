import { useEffect, useRef } from "react";
import { useVideoScrub } from "@/hooks/useVideoScrub";

const Ori = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  // Use the custom hook to handle video scrubbing logic
  useVideoScrub(videoRef, heroRef);

  return <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">GESTALA (Ori)</div>
          <div className="hidden md:flex gap-8 text-sm">
            <a href="/" className="hover:text-blue-400 transition">Home</a>
            <a href="/ori" className="text-blue-400 transition">Ori</a>
            <a href="/poly" className="hover:text-blue-400 transition">Poly</a>
            <a href="/wob" className="hover:text-blue-400 transition">Wob</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <video ref={videoRef} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/10">
        <div className="container mx-auto px-6">
          <h2 className="text-[120px] font-bold leading-none text-center md:text-9xl">Gestala</h2>
        </div>
      </footer>
    </div>;
};
export default Ori;