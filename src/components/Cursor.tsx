"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, isFinePointer } from "@/lib/motion";

const HOVERABLE = "a, button, [data-cursor], .card, .cert";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!isFinePointer()) return;
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.05 });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.05 });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.35, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.35, ease: "power3" });

    const onMove = (e: PointerEvent) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
    const onOver = (e: PointerEvent) => {
      const t = (e.target as Element).closest<HTMLElement>(HOVERABLE);
      setLabel(t ? t.dataset.cursor || (t.matches(".card, .cert") ? "VIEW" : "") : null);
    };
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
    };
  }, []);

  return (
    <div className={`cursor${label !== null ? " is-hover" : ""}`} aria-hidden="true">
      <div className="cursor__dot" ref={dot} />
      <div className="cursor__ring" ref={ring}><span className="cursor__label">{label}</span></div>
    </div>
  );
}
