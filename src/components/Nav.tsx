"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { site } from "@/data/site";
import { TriangleMark } from "./TriangleMark";
import { AnchorLink } from "./AnchorLink";
import { useLenis } from "./SmoothScroll";

const LINKS = [
  ["#works", "Works"],
  ["#awards", "Awards"],
  ["#certs", "Certificates"],
  ["#profile", "Profile"],
] as const;

export function Nav() {
  const [time, setTime] = useState("--:--:--");
  const [menuOpen, setMenuOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    lenis.stop();
    document.body.classList.add("menu-open");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis.start();
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
    };
    // lenis helpers are stable wrappers around a ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  // restart Lenis before AnchorLink scrolls, since a stopped Lenis ignores scrollTo
  const closeMenu = () => {
    lenis.start();
    setMenuOpen(false);
  };

  return (
    <>
      <header className="nav">
        <AnchorLink href="#top" className="nav__brand"><TriangleMark /><span>{site.name}</span></AnchorLink>
        <nav className="nav__links mono">
          {LINKS.map(([href, text]) => <AnchorLink key={href} href={href}>{text}</AnchorLink>)}
        </nav>
        <div className="nav__clock mono"><span className="pulse" />BKK <span>{time}</span></div>
        <button
          type="button" className="nav__toggle mono" aria-expanded={menuOpen} aria-controls="mobile-menu"
          onClick={() => setMenuOpen(o => !o)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </header>
      <nav id="mobile-menu" className={`menu${menuOpen ? " is-open" : ""}`} aria-hidden={!menuOpen} inert={!menuOpen}>
        {LINKS.map(([href, text], i) => (
          <AnchorLink key={href} href={href} onClick={closeMenu} style={{ "--i": i } as CSSProperties}>
            <span className="mono">0{i + 1}</span>{text}
          </AnchorLink>
        ))}
      </nav>
    </>
  );
}
