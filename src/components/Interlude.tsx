"use client";

import { useRef } from "react";
import { site } from "@/data/site";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/motion";

/** White inverted break with Thai type, followed by the venue marquee. */
export function Interlude() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from(".invert__text span", {
      yPercent: 110, duration: 1.1, stagger: 0.12, ease: "power4.out",
      scrollTrigger: { trigger: root.current, start: "top 60%" },
    });
  }, { scope: root });

  const items = [...site.marquee, ...site.marquee];

  return (
    <>
      <section className="invert" ref={root}>
        <div className="invert__holo" />
        <div className="invert__text">
          <p><span>สร้างสิ่งที่</span></p>
          <p><span>ยังไม่มีใครเคยเห็น</span></p>
          <p className="invert__en mono"><span>BUILDING WHAT HASN&apos;T BEEN SEEN YET.</span></p>
        </div>
        <p className="invert__corner mono">[ 03 ] — {site.name} ©2026</p>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {items.map((m, i) => (
            <span key={i} className="marquee__item"><span className={i % 3 === 0 ? "outline" : ""}>{m}</span><i>✦</i></span>
          ))}
        </div>
      </div>
    </>
  );
}
