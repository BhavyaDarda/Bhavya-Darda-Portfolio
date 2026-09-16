"use client";

import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Users,
  Code2,
  Bot,
  Briefcase,
  Check,
  type LucideIcon,
} from "lucide-react";

type Milestone = {
  org: string;
  icon: LucideIcon;
  status: "completed" | "current";
  title: string;
  sub: string;
  stat: string;
  tags: [string, string, string];
  mesh: string;
};

const MILESTONES: Milestone[] = [
  {
    org: "Christ University",
    icon: BookOpen,
    status: "completed",
    title: "Bachelor of Computer Applications",
    sub: "Delhi-NCR · Undergraduate degree",
    stat: "Aug 2022 – Jul 2025",
    tags: ["DELHI-NCR", "COMPUTER APPLICATIONS", "DEGREE"],
    mesh:
      "radial-gradient(circle at 12% 14%, #9be8ac 0%, transparent 46%), radial-gradient(circle at 90% 8%, #ffa6d9 0%, transparent 46%), radial-gradient(circle at 86% 90%, #b9a3ff 0%, transparent 52%), radial-gradient(circle at 6% 92%, #fef6e0 0%, transparent 56%)",
  },
  {
    org: "Oppo India Pvt. Ltd.",
    icon: Users,
    status: "completed",
    title: "Student Ambassador",
    sub: "Gurgaon · Student ambassador",
    stat: "Mar 2023 – Apr 2024",
    tags: ["GURGAON", "COMMUNITY", "AMBASSADOR"],
    mesh:
      "radial-gradient(circle at 10% 12%, #8fd6e0 0%, transparent 46%), radial-gradient(circle at 92% 10%, #cba8ff 0%, transparent 46%), radial-gradient(circle at 88% 92%, #ffc27a 0%, transparent 52%), radial-gradient(circle at 6% 90%, #fff7e6 0%, transparent 56%)",
  },
  {
    org: "Durapid Technologies Pvt. Ltd.",
    icon: Code2,
    status: "completed",
    title: "SDE Intern",
    sub: "Jaipur · Internship",
    stat: "May 2024 – Jul 2024",
    tags: ["JAIPUR", "SOFTWARE ENG.", "INTERNSHIP"],
    mesh:
      "radial-gradient(circle at 12% 14%, #ffb199 0%, transparent 46%), radial-gradient(circle at 90% 8%, #ffd699 0%, transparent 46%), radial-gradient(circle at 86% 90%, #ff90ae 0%, transparent 52%), radial-gradient(circle at 6% 92%, #fff4ec 0%, transparent 56%)",
  },
  {
    org: "OLL.co",
    icon: Bot,
    status: "completed",
    title: "AI Agent Development Intern",
    sub: "Mumbai · Internship",
    stat: "Feb 2025 – Apr 2025",
    tags: ["MUMBAI", "AI DEVELOPMENT", "INTERNSHIP"],
    mesh:
      "radial-gradient(circle at 10% 12%, #ff9fe8 0%, transparent 46%), radial-gradient(circle at 92% 10%, #9fe8ff 0%, transparent 46%), radial-gradient(circle at 88% 90%, #c9ff9f 0%, transparent 52%), radial-gradient(circle at 6% 90%, #fbf3ff 0%, transparent 56%)",
  },
  {
    org: "Apple Inc.",
    icon: Briefcase,
    status: "completed",
    title: "Specialist",
    sub: "Noida · Full-time",
    stat: "Nov 2025 – May 2026",
    tags: ["NOIDA", "TECHNICAL SUPPORT", "SPECIALIST"],
    mesh:
      "radial-gradient(circle at 12% 12%, #ffd27a 0%, transparent 46%), radial-gradient(circle at 90% 10%, #c9a6ff 0%, transparent 46%), radial-gradient(circle at 88% 90%, #8fd9c4 0%, transparent 52%), radial-gradient(circle at 6% 92%, #fffaf0 0%, transparent 56%)",
  },
];

const YEARS = ["2022", "2023", "2024", "2025", "2026"];

function Card({ m, hidden }: { m: Milestone; hidden?: boolean }) {
  const Icon = m.icon;
  return (
    <article
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden || undefined}
      aria-label={`${m.stat} — ${m.title} at ${m.org}`}
      className="tl-card relative flex w-[340px] sm:w-[380px] min-h-[308px] flex-none flex-col overflow-hidden rounded-[22px] p-6 pb-[1.4rem] transition-transform duration-300 ease-out hover:-translate-y-[7px] hover:shadow-[0_22px_44px_-20px_rgba(0,0,0,0.55)] focus-visible:outline-none focus-visible:-translate-y-[7px]"
      style={{
        backgroundColor: "#f4f1e6",
        backgroundImage: m.mesh,
        border: "1px solid rgba(21,19,15,0.14)",
        color: "#15130f",
      }}
    >
      <span className="tl-noise" />

      {/* Top row: org + status badge */}
      <div className="relative mb-[1.1rem] flex items-start justify-between gap-3">
        <div className="flex items-center gap-[.6rem]">
          <span
            className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full"
            style={{ backgroundColor: "#15130f", color: "#f5f1e6" }}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
          </span>
          <span
            className="tl-font-mono text-[.72rem] font-semibold uppercase tracking-[.09em]"
            style={{ opacity: 0.82 }}
          >
            {m.org}
          </span>
        </div>

        <span
          className="tl-font-mono inline-flex items-center gap-[.35rem] whitespace-nowrap rounded-full px-[.65rem] py-[.35rem] text-[.64rem] uppercase tracking-[.06em]"
          style={{ backgroundColor: "#15130f", color: "#f5f1e6" }}
        >
          {m.status === "current" ? (
            <>
              <span className="tl-pulse relative h-[6px] w-[6px] rounded-full" style={{ backgroundColor: "#f5f1e6" }} />
              Current
            </>
          ) : (
            <>
              <Check className="h-[10px] w-[10px]" strokeWidth={2} />
              Completed
            </>
          )}
        </span>
      </div>

      {/* Title + subtitle */}
      <h3 className="tl-font-display relative mb-[.35rem] text-[1.32rem] font-bold leading-[1.22] tracking-[-.01em]">
        {m.title}
      </h3>
      <p className="relative text-[.88rem]" style={{ color: "rgba(21,19,15,0.62)" }}>
        {m.sub}
      </p>

      {/* Divider */}
      <div className="relative my-[1.1rem] h-px" style={{ backgroundColor: "rgba(21,19,15,0.15)" }} />

      {/* Footer: timeframe + tags */}
      <div className="relative mt-auto flex flex-wrap items-end justify-between gap-3">
        <div>
          <span
            className="tl-font-mono mb-[.18rem] block text-[.62rem] uppercase tracking-[.09em]"
            style={{ opacity: 0.55 }}
          >
            Timeframe
          </span>
          <span className="tl-font-display block text-[1.48rem] font-bold tracking-[-.01em]">
            {m.stat}
          </span>
        </div>
        <ul className="flex flex-wrap gap-[.4rem]">
          {m.tags.map((t) => (
            <li
              key={t}
              className="tl-font-mono rounded-full px-[.58rem] py-[.32rem] text-[.6rem] uppercase tracking-[.05em]"
              style={{ backgroundColor: "#15130f", color: "#f5f1e6" }}
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function debounce<T extends (...args: never[]) => void>(fn: T, ms: number) {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export default function FUITimelineCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const setEl = setRef.current;
    if (!track || !setEl || reduceMotion) return;

    function layout() {
      const gap = parseFloat(getComputedStyle(track!).gap) || 0;
      const width = setEl!.getBoundingClientRect().width;
      const dist = width + gap;
      track!.style.setProperty("--dist", `${dist}px`);
      const speed = 52;
      const dur = Math.min(75, Math.max(26, dist / speed));
      track!.style.setProperty("--dur", `${dur}s`);
    }

    layout();
    const onResize = debounce(layout, 150);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [reduceMotion]);

  return (
    <div className="tl-scope w-full">
      <style>{STYLE}</style>

      {/* Year rail */}
      <div
        className="relative mx-auto mb-7 flex max-w-[600px] items-start justify-between px-8"
        aria-hidden="true"
      >
        <span className="tl-rail-line" />
        {YEARS.map((yr, i) => (
          <div key={yr} className="relative z-10 flex flex-col items-center gap-[.55rem]">
            {i === YEARS.length - 1 ? (
              <span
                className="h-[10px] w-[10px] rounded-full bg-cosmic-primary"
                style={{ boxShadow: "0 0 0 5px hsl(var(--cosmic-primary) / 0.22)" }}
              />
            ) : (
              <span className="h-[10px] w-[10px] rounded-full border-2 border-background bg-foreground/25" />
            )}
            <span className="tl-font-mono text-[.72rem] text-foreground/55">{yr}</span>
          </div>
        ))}
      </div>

      {/* Hint */}
      <p className="tl-font-mono mb-7 text-center text-[.72rem] tracking-[.03em] text-foreground/40">
        hover or focus a card to pause · move away to resume
      </p>

      {/* Carousel */}
      <div
        className="tl-viewport relative w-full overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        <div ref={trackRef} className="tl-track flex w-max gap-8 py-3 pb-6">
          <div ref={setRef} className="flex gap-8">
            {MILESTONES.map((m) => (
              <Card key={m.org + m.title} m={m} />
            ))}
          </div>
          {!reduceMotion && (
            <div aria-hidden="true" className="flex gap-8">
              {MILESTONES.map((m) => (
                <Card key={`${m.org}-${m.title}-dup`} m={m} hidden />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  .tl-font-display { font-family: 'Space Grotesk', sans-serif; }
  .tl-font-mono    { font-family: 'JetBrains Mono', monospace; }

  .tl-track {
    animation: tl-scrollx var(--dur, 42s) linear infinite;
    will-change: transform;
  }
  .tl-viewport:hover .tl-track,
  .tl-viewport:focus-within .tl-track {
    animation-play-state: paused;
  }
  @keyframes tl-scrollx {
    to { transform: translateX(calc(-1 * var(--dist, 50%))); }
  }

  .tl-rail-line {
    position: absolute;
    left: 2.4rem; right: 2.4rem; top: 5px;
    height: 1px;
    background: rgba(255,255,255,0.12);
  }

  .tl-card:focus-visible {
    box-shadow: 0 0 0 2px hsl(var(--cosmic-primary)), 0 22px 44px -20px rgba(0,0,0,0.55);
  }

  .tl-noise {
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: .05;
    mix-blend-mode: multiply;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  }

  .tl-pulse::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: rgba(245,241,230,.55);
    animation: tl-pulse 1.8s ease-out infinite;
  }
  @keyframes tl-pulse {
    0%   { transform: scale(.6);  opacity: .9; }
    100% { transform: scale(2.4); opacity: 0;  }
  }

  @media (max-width: 640px) {
    .tl-track { gap: 1.1rem; }
    .tl-card  { width: 78vw !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    .tl-track { animation: none !important; }
    .tl-viewport { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .tl-pulse::after { animation: none; }
  }
`;
