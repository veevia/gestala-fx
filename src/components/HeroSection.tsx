import React, { forwardRef, useEffect, useRef } from "react";

interface HeroSectionProps {
  children?: React.ReactNode;
  className?: string;
  videoClassName?: string;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  ({ children, className, videoClassName, videoRef: externalVideoRef }, ref) => {
    const internalVideoRef = useRef<HTMLVideoElement>(null);
    const videoRef = externalVideoRef || internalVideoRef;

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(error => {
          // Autoplay was prevented by the browser.
          console.error("Video autoplay was prevented:", error);
        });
      }
    }, []);

    return (
      <section
        ref={ref}
        className={`relative h-screen flex items-center justify-center overflow-hidden ${className || ""}`}
      >
        <video ref={videoRef} loop muted playsInline className={`absolute inset-0 w-full h-full object-cover ${videoClassName || ''}`}>
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {children}
      </section>
    );
  }
);

HeroSection.displayName = "HeroSection";