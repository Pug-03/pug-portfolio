"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { site, type Certificate } from "@/data/site";
import { gsap, isFinePointer, pad2, useGSAP } from "@/lib/motion";
import { ScrambleTitle } from "./ScrambleTitle";
import { TriangleMark } from "./TriangleMark";
import { useLenis } from "./SmoothScroll";

function CertFace({ c }: { c: Certificate }) {
  return (
    <div className="cert__inner">
      {c.img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={c.img} alt={c.title} loading="lazy" />
      ) : (
        <>
          <p className="cert__kicker">CERTIFICATE OF ACHIEVEMENT</p>
          <h3 className="cert__title">{c.title}</h3>
          <p className="cert__issuer">{c.issuer}</p>
          <span className="cert__name">{site.name}</span>
          <span className="cert__seal"><TriangleMark /></span>
        </>
      )}
    </div>
  );
}

function tilt(e: ReactPointerEvent<HTMLDivElement>) {
  if (!isFinePointer()) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
  el.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 16}deg) rotateX(${(0.5 - y) * 12}deg) translateZ(20px)`;
  el.style.setProperty("--gx", `${x * 100}%`);
  el.style.setProperty("--gy", `${y * 100}%`);
}

export function Certificates() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<Certificate | null>(null);
  const lenis = useLenis();
  const wasOpen = useRef(false);

  // horizontal scroll while pinned (desktop only)
  useGSAP(() => {
    gsap.matchMedia().add("(min-width: 761px)", () => {
      const dist = () => track.current!.scrollWidth - window.innerWidth;
      gsap.to(track.current, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: root.current, pin: ".certs__pin", start: "top top", end: () => `+=${dist()}`, scrub: 0.6, invalidateOnRefresh: true },
      });
    });
  }, { scope: root });

  useEffect(() => {
    // only react to actual open/close changes, so mount doesn't start scrolling behind the lock screen
    if (!!open !== wasOpen.current) {
      if (open) lenis.stop(); else lenis.start();
      wasOpen.current = !!open;
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // lenis helpers are stable wrappers around a ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <section className="certs" id="certs" ref={root}>
      <div className="certs__pin">
        <div className="certs__head">
          <p className="kicker mono">[ 05 ] — PROOF</p>
          <ScrambleTitle text="CERTIFICATES" />
        </div>
        <div className="certs__track" ref={track}>
          {site.certificates.map((c: Certificate, i) => (
            <div
              key={c.title}
              className="cert"
              onPointerMove={tilt}
              onPointerLeave={e => (e.currentTarget.style.transform = "")}
              onClick={() => setOpen(c)}
            >
              <span className="cert__num mono">{pad2(i + 1)}</span>
              <CertFace c={c} />
              <div className="cert__glare" />
            </div>
          ))}
        </div>
      </div>

      <div className={`lightbox${open ? " on" : ""}`} aria-hidden={!open} onClick={() => setOpen(null)}>
        <div className="lightbox__card">{open && <CertFace c={open} />}</div>
        <p className="mono">click anywhere to close</p>
      </div>
    </section>
  );
}
