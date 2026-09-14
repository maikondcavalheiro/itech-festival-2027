"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AncestralAura.module.css";

export default function AncestralAura() {
  const orbRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on desktop/devices with fine pointer
    if (typeof window === "undefined" || !window.matchMedia("(hover: hover)").matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let orbX = -100;
    let orbY = -100;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest("a, button, [role='button'], input, select, summary");
        setIsHovered(!!interactive);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const render = () => {
      // Smooth interpolation for floating artifact feel
      orbX += (mouseX - orbX) * 0.18;
      orbY += (mouseY - orbY) * 0.18;

      if (orbRef.current) {
        orbRef.current.style.transform = `translate3d(${orbX}px, ${orbY}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={styles.auraContainer} aria-hidden="true">
      <div
        ref={orbRef}
        className={`${styles.auraOrb} ${isHovered ? styles.auraHover : ""}`}
      />
    </div>
  );
}
