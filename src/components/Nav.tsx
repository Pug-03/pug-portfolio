"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";
import { TriangleMark } from "./TriangleMark";
import { AnchorLink } from "./AnchorLink";

const LINKS = [
  ["#works", "Works"],
  ["#awards", "Awards"],
  ["#certs", "Certificates"],
  ["#profile", "Profile"],
] as const;

export function Nav() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Bangkok", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="nav">
      <AnchorLink href="#top" className="nav__brand"><TriangleMark /><span>{site.name}</span></AnchorLink>
      <nav className="nav__links mono">
        {LINKS.map(([href, text]) => <AnchorLink key={href} href={href}>{text}</AnchorLink>)}
      </nav>
      <div className="nav__clock mono"><span className="pulse" />BKK <span>{time}</span></div>
    </header>
  );
}
