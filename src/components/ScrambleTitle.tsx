"use client";

import { useEffect, useRef } from "react";
import { scramble } from "@/lib/motion";

/** Big section title that decodes itself when scrolled into view. */
export function ScrambleTitle({ text, className = "title" }: { text: string; className?: string }) {
  const el = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && el.current) {
        scramble(el.current, text);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el.current!);
    return () => io.disconnect();
  }, [text]);

  return <h2 className={className} ref={el}>{text}</h2>;
}
