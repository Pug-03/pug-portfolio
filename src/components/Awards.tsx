"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { site, type Award, type AwardCategory } from "@/data/site";
import { gsap, isFinePointer, pad2, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/motion";
import { ScrambleTitle } from "./ScrambleTitle";

const CAT: Record<AwardCategory, { label: string; bg: string }> = {
  ai: { label: "AI & SOFTWARE", bg: "linear-gradient(135deg,#3a6bff,#a45bff)" },
  robo: { label: "ROBOTICS", bg: "linear-gradient(135deg,#ff3b3b,#ff9a3c)" },
  web: { label: "WEB & CONTENT", bg: "linear-gradient(135deg,#ff4ecd,#ffd23f)" },
};
const GOLD = "linear-gradient(135deg,#ffe29a,#c8901c 60%,#6b4a00)";

const FILTERS: { id: "all" | AwardCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI & Software" },
  { id: "robo", label: "Robotics" },
  { id: "web", label: "Web" },
];

export function Awards() {
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [hovered, setHovered] = useState<Award | null>(null);
  const firstRender = useRef(true);

  const awards = site.awards;

  // entrance on scroll
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo(".award", { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.06, ease: "power3.out",
      scrollTrigger: { trigger: list.current, start: "top 80%" },
    });
  }, { scope: root });

  // re-animate visible rows when the filter changes
  useGSAP(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    gsap.fromTo(".award", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.04 });
    ScrollTrigger.refresh();
  }, { dependencies: [filter], scope: root });

  // floating preview follows the pointer
  useEffect(() => {
    if (!isFinePointer()) return;
    const px = gsap.quickTo(preview.current, "x", { duration: 0.5, ease: "power3" });
    const py = gsap.quickTo(preview.current, "y", { duration: 0.5, ease: "power3" });
    const onMove = (e: PointerEvent) => { px(e.clientX); py(e.clientY); };
    const el = list.current!;
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  const shown = awards.map((a, i) => ({ a, i })).filter(({ a }) => filter === "all" || a.cat === filter);

  return (
    <section className="awards" id="awards" ref={root}>
      <div className="awards__head">
        <div>
          <p className="kicker mono">[ 04 ] — HALL OF WINS</p>
          <ScrambleTitle text="AWARDS" />
        </div>
        <div className="filters mono">
          {FILTERS.map(f => (
            <button key={f.id} className={filter === f.id ? "is-active" : ""} onClick={() => setFilter(f.id)}>{f.label}</button>
          ))}
        </div>
      </div>

      <ol className="awards__list" ref={list}>
        {shown.map(({ a, i }) => (
          <li
            key={a.title}
            className={`award${a.top ? " top" : ""}`}
            onPointerEnter={() => setHovered(a)}
            onPointerLeave={() => setHovered(null)}
          >
            <span className="award__idx mono">{pad2(i + 1)}</span>
            <span className="award__year mono">{a.year}</span>
            <div><h3 className="award__title">{a.title}</h3><span className="award__org mono">{a.org}</span></div>
            <p className="award__result">{a.result}</p>
            <span className="award__rank">{a.top ? "★ " : ""}{a.rank}</span>
          </li>
        ))}
      </ol>

      <div
        className={`awards__preview${hovered ? " on" : ""}`}
        ref={preview}
        style={hovered ? ({ "--pv": hovered.top ? GOLD : CAT[hovered.cat].bg } as CSSProperties) : undefined}
      >
        <span>{hovered?.rank}</span>
        <small className="mono">{hovered && CAT[hovered.cat].label}</small>
      </div>
    </section>
  );
}
