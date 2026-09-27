"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/motion";

type Part = { text: string; style?: "key" | "serif" };

const PARTS: Part[] = [
  { text: "I build" },
  { text: "end-to-end", style: "key" },
  { text: "things where" },
  { text: "artificial intelligence", style: "key" },
  { text: "meets" },
  { text: "real hardware", style: "key" },
  { text: "— robots that fight, systems that see, and interfaces that feel" },
  { text: "unreal.", style: "serif" },
];

const WORDS = PARTS.flatMap(p => p.text.split(" ").map(w => ({ w, style: p.style })));

export function Manifesto() {
  const text = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const words = gsap.utils.toArray<HTMLElement>(".w", text.current);
    words.forEach(w => (w.style.opacity = "0.12"));
    ScrollTrigger.create({
      trigger: ".manifesto", start: "top top", end: "bottom bottom", scrub: true,
      onUpdate: self => {
        const lit = self.progress * 1.25 * words.length;
        words.forEach((w, i) => {
          const o = gsap.utils.clamp(0.12, 1, lit - i);
          w.style.opacity = String(o);
          w.classList.toggle("glow", w.dataset.key === "1" && o > 0.9);
        });
      },
    });
  });

  return (
    <section className="manifesto" id="manifesto">
      <div className="manifesto__inner">
        <p className="kicker mono">[ 01 ] — MANIFESTO</p>
        <p className="manifesto__text" ref={text}>
          {WORDS.map(({ w, style }, i) => {
            const word = <span className="w" data-key={style === "key" ? "1" : undefined}>{w}</span>;
            return (
              <span key={i}>
                {style === "key" ? <b>{word}</b> : style === "serif" ? <i>{word}</i> : word}{" "}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
