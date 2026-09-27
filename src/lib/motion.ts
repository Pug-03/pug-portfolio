"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isFinePointer = () =>
  typeof window !== "undefined" && matchMedia("(hover: hover) and (pointer: fine)").matches;

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*<>/";

/** Decode `text` into `el` with random glyphs, left to right. */
export function scramble(el: HTMLElement, text: string, duration = 900) {
  if (prefersReducedMotion()) {
    el.textContent = text;
    return;
  }
  const start = performance.now();
  const step = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    const done = Math.floor(p * text.length);
    el.textContent = text
      .split("")
      .map((c, i) => (i < done || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
      .join("");
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
