import { useEffect, useRef, useState } from "react";

interface MagicCursorProps {
  heroRef: React.RefObject<HTMLElement>;
}

export const MagicCursor: React.FC<MagicCursorProps> = ({ heroRef }) => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorFollowerRef = useRef<HTMLDivElement>(null);
  const [isCursorInHero, setIsCursorInHero] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    const cursorDot = cursorDotRef.current;
    const cursorFollower = cursorFollowerRef.current;
    if (!hero || !cursorDot || !cursorFollower) return;

    const mousePos = { x: 0, y: 0 };
    const followerPos = { x: 0, y: 0 };
    const speed = 0.1;
    let cursorAnimationId: number;

    const updateCursor = () => {
      const dx = mousePos.x - followerPos.x;
      const dy = mousePos.y - followerPos.y;
      followerPos.x += dx * speed;
      followerPos.y += dy * speed;
      cursorFollower.style.transform = `translate(${followerPos.x}px, ${followerPos.y}px)`;
      cursorAnimationId = requestAnimationFrame(updateCursor);
    };
    updateCursor();

    const setCursorPosition = (e: MouseEvent) => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    const handleMouseEnterHero = () => setIsCursorInHero(true);
    const handleMouseLeaveHero = () => setIsCursorInHero(false);

    hero.addEventListener("mouseenter", handleMouseEnterHero);
    hero.addEventListener("mouseleave", handleMouseLeaveHero);
    window.addEventListener("mousemove", setCursorPosition);

    return () => {
      cancelAnimationFrame(cursorAnimationId);
      window.removeEventListener("mousemove", setCursorPosition);
      hero.removeEventListener("mouseenter", handleMouseEnterHero);
      hero.removeEventListener("mouseleave", handleMouseLeaveHero);
    };
  }, [heroRef]);

  return (
    <>
      <div ref={cursorDotRef} className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white pointer-events-none transition-opacity duration-300 z-[999] ${isCursorInHero ? "w-2 h-2 opacity-100" : "w-0 h-0 opacity-0"}`}></div>
      <div ref={cursorFollowerRef} className={`fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/50 pointer-events-none transition-opacity duration-300 z-[999] ${isCursorInHero ? "w-10 h-10 opacity-100" : "w-0 h-0 opacity-0"}`}></div>
      <style>{`.hide-cursor { cursor: none; }`}</style>
    </>
  );
};