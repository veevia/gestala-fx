import React, { forwardRef } from "react";

interface HeroSectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  children?: React.ReactNode;
  className?: string;
}

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  ({ videoRef, children, className }, ref) => {
    return (
      <section
        ref={ref}
        className={`relative h-screen flex items-center justify-center overflow-hidden ${className || ""}`}
      >
        <video ref={videoRef} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50">
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        {children}
      </section>
    );
  }
);

HeroSection.displayName = "HeroSection";