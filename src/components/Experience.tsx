"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/motion";
import { SmoothScroll, useLenis } from "./SmoothScroll";
import { LockScreen } from "./LockScreen";
import { Cursor } from "./Cursor";
import { Nav } from "./Nav";
import { Hero } from "./hero/Hero";
import { Manifesto } from "./Manifesto";
import { Stats } from "./Stats";
import { Works } from "./Works";
import { Interlude } from "./Interlude";
import { Awards } from "./Awards";
import { Certificates } from "./Certificates";
import { Profile } from "./Profile";
import { Footer } from "./Footer";

function Page() {
  const [unlocked, setUnlocked] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!unlocked) return;
    document.body.classList.remove("is-locked");
    lenis.start();
    ScrollTrigger.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked]);

  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <>
      <LockScreen onUnlock={() => setUnlocked(true)} />
      <Cursor />
      <Nav />
      <main id="top">
        <Hero revealed={unlocked} />
        <Manifesto />
        <Stats />
        <Works />
        <Interlude />
        <Awards />
        <Certificates />
        <Profile />
      </main>
      <Footer />
    </>
  );
}

export function Experience() {
  return (
    <SmoothScroll>
      <Page />
    </SmoothScroll>
  );
}
