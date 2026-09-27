/* ------------------------------------------------------------------
   All site content lives here. Edit this file to update the portfolio.
   ------------------------------------------------------------------ */

export type AwardCategory = "ai" | "robo" | "web";

export interface Award {
  year: string;
  title: string;
  org: string;
  result: string;
  cat: AwardCategory;
  /** short badge text */
  rank: string;
  /** gold highlight for 1st place / overall winner */
  top?: boolean;
}

export interface Project {
  name: string;
  kind: string;
  stack: string[];
  desc: string;
  /** optional external link (repo / demo) */
  link?: string;
  /** two colors for the generated cover art */
  hue: [string, string];
  /** optional cover image, e.g. "/works/duriansense.jpg" (put file in public/works) */
  img?: string;
}

export interface Certificate {
  title: string;
  issuer: string;
  /** optional scan, e.g. "/certs/glo.jpg" (put file in public/certs) */
  img?: string;
}

export interface StackGroup {
  group: string;
  /** skillicons.dev ids. Append "@light" to use the light variant (for dark logos). */
  icons: string[];
}

export const site = {
  name: "PUG",
  role: "Student Developer & Robotics Innovator",
  location: "Thailand",
  github: "https://github.com/Pug-03",

  bio: "A high school student and developer driven by the intersection of Artificial Intelligence, Computer Vision and Robotics. I build end-to-end innovations that bridge smart software with physical hardware — turning complex engineering ideas into functional, beautiful products.",

  now: [
    "Developing autonomous systems, full-stack web apps and embedded IoT solutions.",
    "Expanding into advanced machine learning and next-gen web frameworks.",
    "Always up for talking AI models, robotics or slick UI design.",
    "Fun fact: huge fan of Apple-style minimalist layouts and dark developer setups.",
  ],

  awards: [
    { year: "2026", title: "GLO Innovation", org: "GLO Innovation 2026", result: "1st Place Winner — selected from 173 teams", cat: "ai", rank: "1ST", top: true },
    { year: "2026", title: "Thailand Metaverse Hackathon & Exhibition", org: "Chulalongkorn University", result: "Top 1st Place Winner", cat: "web", rank: "1ST", top: true },
    { year: "—", title: "Junior Webmaster Camp 14", org: "JWC", result: "Overall Winner · Best Idea · Best Content", cat: "web", rank: "WINNER", top: true },
    { year: "2025", title: "AI & Robotics Hackathon", org: "MIT Media Lab", result: "Top 3 Global Finalist", cat: "ai", rank: "TOP 3" },
    { year: "2026", title: "World Robot Championship", org: "3kg RC Sumo", result: "Top 2 Finalists & Dubai Global Finals Qualifier", cat: "robo", rank: "TOP 2" },
    { year: "2026", title: "Maker Robotics Challenge", org: "1.5kg Sumo", result: "Top 3 Finalists & China Finals Qualifier", cat: "robo", rank: "TOP 3" },
    { year: "2026", title: "Play to Build AI Hackathon SEABW", org: "AWS", result: "Top 4 Finalists — the youngest and only student developer among professionals", cat: "ai", rank: "TOP 4" },
    { year: "2026", title: "AI for Thai Service Onboarding", org: "NECTEC · NSTDA", result: "AI for Thai Service Standard Award for RooMue (รู้มือ) · Top 15 of 150 teams", cat: "ai", rank: "AWARD" },
    { year: "2026", title: "NCPD 2026", org: "KMUTT · National Conference on Persons with Disabilities", result: "Innovation showcase — RooMue (รู้มือ)", cat: "ai", rank: "SHOWCASE" },
    { year: "—", title: "KMITL ToBeIT'69", org: "KMITL", result: "Top Best App Design for Elderly & Alzheimer's Patients", cat: "ai", rank: "BEST" },
    { year: "2026", title: "CEDT Innovation Summit", org: "CEDT", result: "Semifinal Round", cat: "ai", rank: "SEMI" },
  ] as Award[],

  projects: [
    { name: "DurianSense", kind: "AI × IoT", stack: ["TypeScript"], desc: "Sensing and intelligence for durian — software meets hardware.", hue: ["#7cff6b", "#0a7c4a"] },
    { name: "VibeTrip", kind: "AWS Play to Build · SEABW 2026", stack: ["TypeScript", "AWS"], desc: "Built under pressure at the AWS hackathon — Top 4 Finalists.", hue: ["#ff9a3c", "#ff2e6e"] },
    { name: "Sumo Bot 3KG", kind: "Robotics · World Robot Championship", stack: ["C++", "Arduino"], desc: "RC sumo machine that took us to the Dubai Global Finals.", hue: ["#ff3b3b", "#3a0ca3"] },
    { name: "RooMue", kind: "AI for Thai · NCPD 2026", stack: ["AI for Thai"], desc: "AI for Thai Service Standard Award, showcased at the national disabilities conference.", hue: ["#ff4d6d", "#7b2cbf"] },
    { name: "Hrada_", kind: "Web Application", stack: ["TypeScript"], desc: "Full-stack web product, designed and shipped end-to-end.", hue: ["#4cc9f0", "#4361ee"] },
    { name: "SUNRED Studio", kind: "Web · Brand", stack: ["HTML", "CSS"], desc: "A studio site with a strong visual identity.", hue: ["#ffd23f", "#ee4266"] },
    { name: "Care App", kind: "KMITL ToBeIT'69", stack: ["Figma", "UI/UX"], desc: "App design for elderly & Alzheimer's patients — Top Best App Design.", hue: ["#b388ff", "#00bfa5"] },
  ] as Project[],

  certificates: [
    { title: "GLO Innovation 2026", issuer: "1st Place Winner" },
    { title: "Thailand Metaverse Hackathon 2026", issuer: "Chulalongkorn University — 1st Place" },
    { title: "Junior Webmaster Camp 14", issuer: "Overall Winner" },
    { title: "AI & Robotics Hackathon 2025", issuer: "MIT Media Lab — Top 3 Global" },
    { title: "World Robot Championship 2026", issuer: "Top 2 · Dubai Qualifier" },
    { title: "Maker Robotics Challenge 2026", issuer: "Top 3 · China Qualifier" },
    { title: "Play to Build AI Hackathon", issuer: "AWS SEABW 2026 — Top 4" },
    { title: "AI for Thai Service Onboarding 2026", issuer: "NECTEC — Service Standard Award · RooMue", img: "/certs/aiforthai-2026.jpg" },
    { title: "NCPD 2026", issuer: "KMUTT — Innovation showcase · RooMue", img: "/certs/ncpd-2026.jpg" },
    { title: "KMITL ToBeIT'69", issuer: "Top Best App Design" },
  ] as Certificate[],

  stack: [
    { group: "AI & Software", icons: ["py", "cpp", "cs", "opencv", "ts", "js"] },
    { group: "Web", icons: ["html", "css", "react", "nextjs", "nodejs", "postgres"] },
    { group: "Robotics & IoT", icons: ["arduino", "raspberrypi"] },
    { group: "3D · Game · Design", icons: ["blender", "unity@light", "unreal@light", "figma"] },
    { group: "Tools & DevOps", icons: ["vscode", "visualstudio", "aws", "androidstudio", "git", "gitlab", "notion", "bash@light", "vercel@light"] },
  ] as StackGroup[],

  marquee: ["MIT MEDIA LAB", "DUBAI GLOBAL FINALS", "CHINA FINALS", "AWS SEABW", "CHULALONGKORN", "GLO INNOVATION", "KMITL"],
};
