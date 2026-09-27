"use client";

import { useEffect, useRef } from "react";
import { site } from "@/data/site";
import { gsap, isFinePointer } from "@/lib/motion";
import { AnchorLink } from "./AnchorLink";

export function Footer() {
  const btn = useRef<HTMLAnchorElement>(null);

  // magnetic button
  useEffect(() => {
    const el = btn.current;
    if (!el || !isFinePointer()) return;
    const xT = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, .4)" });
    const yT = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, .4)" });
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xT((e.clientX - r.left - r.width / 2) * 0.35);
      yT((e.clientY - r.top - r.height / 2) * 0.35);
    };
    const onLeave = () => { xT(0); yT(0); };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <footer className="footer">
      <p className="footer__cta">Let&apos;s build something <i>unreal.</i></p>
      <a className="footer__btn mono" ref={btn} href={site.github} target="_blank" rel="noopener noreferrer" data-cursor="OPEN">GITHUB ↗</a>
      <div className="footer__big" aria-hidden="true">
        {[0, 1, 2, 3].map(i => <span key={i}>{site.name}</span>)}
      </div>
      <div className="footer__bar mono">
        <span>© 2026 {site.name}</span>
        <span>DESIGNED & BUILT IN THAILAND</span>
        <AnchorLink href="#top">BACK TO TOP ↑</AnchorLink>
      </div>
    </footer>
  );
}
