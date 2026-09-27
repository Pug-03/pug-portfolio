"use client";

import type { AnchorHTMLAttributes } from "react";
import { useLenis } from "./SmoothScroll";

/** In-page link that scrolls through Lenis. */
export function AnchorLink({ href, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: `#${string}` }) {
  const lenis = useLenis();
  return (
    <a
      href={href}
      data-cursor=""
      onClick={e => {
        onClick?.(e);
        e.preventDefault();
        lenis.scrollTo(href === "#top" ? 0 : href);
      }}
      {...rest}
    />
  );
}
