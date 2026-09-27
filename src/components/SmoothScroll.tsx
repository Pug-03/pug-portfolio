"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, type ReactNode, type RefObject } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

/** Access the Lenis instance (null when reduced motion is on). */
export function useLenis() {
  const ref = useContext(LenisContext);
  return {
    stop: () => ref?.current?.stop(),
    start: () => ref?.current?.start(),
    scrollTo: (target: string | number) => {
      if (ref?.current) ref.current.scrollTo(target, { duration: 1.6 });
      else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
      else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    },
  };
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.09 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    if (document.body.classList.contains("is-locked")) lenis.stop();
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}
