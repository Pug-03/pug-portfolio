"use client";

import { useRef } from "react";
import { site } from "@/data/site";
import { gsap, pad2, prefersReducedMotion, useGSAP } from "@/lib/motion";

function iconUrl(id: string) {
  const [name, theme] = id.split("@");
  return `https://skillicons.dev/icons?i=${name}${theme ? `&theme=${theme}` : ""}`;
}

export function Profile() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from(".profile__hello", { opacity: 0, y: 60, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: root.current, start: "top 70%" } });
    gsap.from(".stack__group", { opacity: 0, y: 30, duration: 0.8, stagger: 0.08, scrollTrigger: { trigger: ".stack", start: "top 85%" } });
  }, { scope: root });

  return (
    <section className="profile" id="profile" ref={root}>
      <p className="kicker mono">[ 06 ] — PROFILE</p>
      <div className="profile__grid">
        <h2 className="profile__hello">Hey, I&apos;m <i>Pug.</i></h2>
        <div className="profile__body">
          <p className="profile__bio">{site.bio}</p>
          <ul className="profile__now">
            {site.now.map((t, i) => <li key={t}><span>{pad2(i + 1)}</span>{t}</li>)}
          </ul>
        </div>
      </div>
      <div className="stack">
        {site.stack.map(g => (
          <div className="stack__group" key={g.group}>
            <p className="mono">{g.group}</p>
            <div className="stack__icons">
              {g.icons.map(id => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={id} src={iconUrl(id)} alt={id.split("@")[0]} title={id.split("@")[0]} loading="lazy" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
