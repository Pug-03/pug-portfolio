"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { gsap, ScrollTrigger, scramble } from "@/lib/motion";
import { createHeroRenderer, type HeroRenderer } from "./renderer";

export function Hero({ revealed }: { revealed: boolean }) {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const tagline = useRef<HTMLSpanElement>(null);
  const renderer = useRef<HeroRenderer | null>(null);
  const [noGL, setNoGL] = useState(false);

  useEffect(() => {
    const r = createHeroRenderer(canvas.current!, section.current!, site.name);
    if (!r) {
      setNoGL(true);
      return;
    }
    renderer.current = r;
    const st = ScrollTrigger.create({
      trigger: section.current, start: "top top", end: "bottom top",
      onEnterBack: () => r.glitch(),
    });
    return () => {
      st.kill();
      r.destroy();
      renderer.current = null;
    };
  }, []);

  useEffect(() => {
    if (!revealed) return;
    renderer.current?.reveal();
    const ctx = gsap.context(() => {
      gsap.from(".hud", { opacity: 0, y: 14, duration: 1, stagger: 0.08, delay: 0.3, ease: "power3.out" });
      gsap.from(".hero__tag", { opacity: 0, y: 30, filter: "blur(8px)", duration: 1.4, delay: 0.7, ease: "power3.out" });
    }, section);
    const id = setTimeout(() => tagline.current && scramble(tagline.current, "AI × COMPUTER VISION × ROBOTICS"), 600);
    return () => { ctx.revert(); clearTimeout(id); };
  }, [revealed]);

  return (
    <section className={`hero${noGL ? " no-gl" : ""}`} id="hero" ref={section}>
      <canvas className="hero__gl" ref={canvas} />
      <h1 className="hero__fallback">{site.name}</h1>
      <div className="hud hud--tl mono"><span>[ 00 ]</span> STUDENT DEVELOPER<br />ROBOTICS INNOVATOR</div>
      <div className="hud hud--tr mono">13.75°N / 100.50°E<br />BASED IN {site.location.toUpperCase()}</div>
      <div className="hud hud--bl mono"><span ref={tagline}>AI × COMPUTER VISION × ROBOTICS</span></div>
      <div className="hud hud--br mono">SCROLL <span className="hud__arrow">↓</span></div>
      <p className="hero__tag"><em>Smart software,</em> physical hardware, <em>beautiful</em> products.</p>
    </section>
  );
}
