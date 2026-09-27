"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, scramble } from "@/lib/motion";
import { TriangleMark } from "./TriangleMark";

const CODE = "2026";
const KEYS = "1234567890".split("");

/** Passcode intro. Auto-types the code, or any click / key skips it. */
export function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLParagraphElement>(null);
  const [typed, setTyped] = useState(0);
  const [hit, setHit] = useState<string | null>(null);
  const [clock, setClock] = useState("--:--");
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);
  const unlocked = useRef(false);

  const unlock = () => {
    if (unlocked.current) return;
    unlocked.current = true;
    setTyped(4);
    setDone(true);
    if (label.current) scramble(label.current, "ACCESS GRANTED", 500);
    gsap
      .timeline({ delay: 0.45 })
      .to(".lock__panel", { scale: 0.85, opacity: 0, filter: "blur(10px)", duration: 0.5, ease: "power3.in" })
      .to(".lock__flash", { opacity: 1, duration: 0.08 })
      .add(onUnlock)
      .to(root.current, { opacity: 0, duration: 0.6, ease: "power2.out" })
      .add(() => setGone(true));
  };

  const press = (n: string) => {
    if (unlocked.current) return;
    setHit(n);
    setTimeout(() => setHit(null), 160);
    setTyped(t => {
      const next = Math.min(4, t + 1);
      if (next === 4) setTimeout(unlock, 0);
      return next;
    });
  };

  useEffect(() => {
    // reduced motion: CSS hides the lock screen, just let the page in
    if (prefersReducedMotion()) {
      unlocked.current = true;
      onUnlock();
      return;
    }
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit", hour12: false });
    const timers = [
      setTimeout(() => setClock(fmt.format(new Date())), 0),
      ...CODE.split("").map((n, i) => setTimeout(() => press(n), 700 + i * 320)),
    ];
    const onKey = () => unlock();
    window.addEventListener("keydown", onKey, { once: true });
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", onKey);
    };
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gone) return null;

  return (
    <div className="lock" ref={root} aria-hidden="true" onClick={unlock}>
      <div className="lock__bg" />
      <div className="lock__top mono"><span>PUG/OS</span><span>{clock}</span></div>
      <div className="lock__panel">
        <div className="lock__logo"><TriangleMark /></div>
        <p className={`lock__label mono${done ? " ok" : ""}`} ref={label}>ENTER PASSCODE</p>
        <div className={`lock__dots${done ? " ok" : ""}`}>
          {[0, 1, 2, 3].map(i => <i key={i} className={i < typed ? "on" : ""} />)}
        </div>
        <div className="lock__pad">
          {KEYS.map(n => (
            <button key={n} className={hit === n ? "hit" : ""} onClick={e => { e.stopPropagation(); press(n); }}>{n}</button>
          ))}
        </div>
        <p className="lock__hint mono">click or press any key to skip</p>
      </div>
      <div className="lock__flash" />
    </div>
  );
}
