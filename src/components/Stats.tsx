"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/motion";

const STATS = [
  { value: 10, suffix: "+", label: "competitions" },
  { value: 3, suffix: "×", label: "1st place / overall winner" },
  { value: 3, label: "global stages · MIT · Dubai · China" },
  { value: 173, label: "teams outranked at GLO Innovation" },
];

export function Stats() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>("[data-count]").forEach(el => {
      const to = Number(el.dataset.count);
      if (prefersReducedMotion()) { el.textContent = String(to); return; }
      ScrollTrigger.create({
        trigger: el, start: "top 85%", once: true,
        onEnter: () => {
          const o = { v: 0 };
          gsap.to(o, { v: to, duration: 1.8, ease: "expo.out", onUpdate: () => { el.textContent = String(Math.round(o.v)); } });
        },
      });
    });
  }, { scope: root });

  return (
    <section className="stats" ref={root}>
      {STATS.map(s => (
        <div className="stat" key={s.label}>
          <span className="stat__num" data-count={s.value}>0</span>
          {s.suffix && <span className="stat__plus">{s.suffix}</span>}
          <p className="mono">{s.label}</p>
        </div>
      ))}
    </section>
  );
}
