import { useEffect, RefObject } from 'react';

export const useVideoScrub = (videoRef: RefObject<HTMLVideoElement>, containerRef: RefObject<HTMLElement>) => {
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
      const heroEl = containerRef.current;
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
      if (!video.paused) {
        video.pause();
      }
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

    const heroEl = containerRef.current;
    heroEl?.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      heroEl?.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(inactivityTimeout);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [videoRef, containerRef]);
}