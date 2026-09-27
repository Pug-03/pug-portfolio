"use client";

import { useRef, useState } from "react";
import { site, type Project } from "@/data/site";
import { gsap, isFinePointer, pad2, scramble, ScrollTrigger, useGSAP } from "@/lib/motion";
import { ScrambleTitle } from "./ScrambleTitle";

const STEP = 29; // degrees between cards on the curved wall

function coverStyle(p: Project) {
  return p.img
    ? { backgroundImage: `url('${p.img}')` }
    : { background: `radial-gradient(120% 90% at 15% 0%, ${p.hue[0]}, transparent 60%),radial-gradient(100% 90% at 100% 100%, ${p.hue[1]}, transparent 65%),linear-gradient(135deg,#0b0b14,#1a1a2e)` };
}

export function Works() {
  const root = useRef<HTMLElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const kind = useRef<HTMLParagraphElement>(null);
  const [active, setActive] = useState(0);
  const projects = site.projects;

  useGSAP(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".card", ring.current);
    let progress = 0;
    let tilt = 0;
    let current = -1;

    const layout = () => {
      const radius = cards[0].offsetWidth * 2.2;
      cards.forEach((c, i) => {
        const a = -(i - progress) * STEP;
        const abs = Math.abs(a);
        c.style.transform = `translateZ(${radius}px) rotateY(${a}deg) translateZ(${-radius}px)`;
        c.style.opacity = String(abs > 75 ? 0 : 1 - gsap.utils.clamp(0, 1, (abs - 35) / 40));
        c.style.visibility = abs > 75 ? "hidden" : "visible";
        c.style.pointerEvents = abs < 14 ? "auto" : "none";
      });
      ring.current!.style.transform = `rotateX(${tilt}deg)`;
      bar.current!.style.width = `${(progress / (cards.length - 1)) * 100}%`;
      const idx = gsap.utils.clamp(0, cards.length - 1, Math.round(progress));
      if (idx !== current) {
        current = idx;
        setActive(idx);
      }
    };

    layout();
    ScrollTrigger.create({
      trigger: root.current, start: "top top", end: "bottom bottom", scrub: true,
      onUpdate: self => { progress = self.progress * (cards.length - 1); layout(); },
    });

    const onMove = (e: PointerEvent) => { tilt = (e.clientY / window.innerHeight - 0.5) * -6; layout(); };
    if (isFinePointer()) root.current!.addEventListener("pointermove", onMove);
    window.addEventListener("resize", layout);
    return () => {
      root.current?.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", layout);
    };
  }, { scope: root });

  // animate the info panel whenever the centred card changes
  useGSAP(() => {
    if (kind.current) scramble(kind.current, projects[active].kind.toUpperCase(), 500);
    gsap.fromTo(".works__name, .works__desc", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, overwrite: true });
  }, { dependencies: [active], scope: root });

  const p = projects[active];

  return (
    <section className="works" id="works" ref={root}>
      <div className="works__pin">
        <div className="works__head">
          <p className="kicker mono">[ 02 ] — SELECTED WORKS</p>
          <ScrambleTitle text="WORKS" />
        </div>
        <div className="works__stage">
          <div className="works__ring" ref={ring}>
            {projects.map((pr, i) => {
              const inner = (
                <>
                  <div className="card__art" style={coverStyle(pr)} />
                  <div className="card__tag mono"><span>{pad2(i + 1)}</span><span>{pr.stack.join(" / ")}</span></div>
                  <div className="card__big">{pr.name}</div>
                  <div className="card__sheen" />
                </>
              );
              return pr.link
                ? <a key={pr.name} className="card" href={pr.link} target="_blank" rel="noopener noreferrer">{inner}</a>
                : <div key={pr.name} className="card">{inner}</div>;
            })}
          </div>
        </div>
        <div className="works__info">
          <div className="works__count mono"><span>{pad2(active + 1)}</span> / <span>{pad2(projects.length)}</span></div>
          <div className="works__meta">
            <p className="works__kind mono" ref={kind}>{p.kind}</p>
            <h3 className="works__name">{p.name}</h3>
            <p className="works__desc">{p.desc}</p>
          </div>
          <div className="works__bar"><i ref={bar} /></div>
        </div>
      </div>
    </section>
  );
}
