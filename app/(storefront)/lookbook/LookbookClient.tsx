"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FileDown,
  BookOpen,
  ExternalLink,
  Sparkles,
  ChevronDown,
  Eye,
  Maximize2,
  Download,
} from "lucide-react";

type LookbookClientProps = {
  catalogPdfUrl: string;
};

/* ─────────────────────────────────────────────────────────────────────────────
   Hook: scroll progress (0 → 1) for the whole page
───────────────────────────────────────────────────────────────────────────── */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);
  return progress;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Hook: IntersectionObserver-based reveal
───────────────────────────────────────────────────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Hook: parallax offset based on scroll position
───────────────────────────────────────────────────────────────────────────── */
function useParallax(speed = 0.3) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const handler = () => setOffset(window.scrollY * speed);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [speed]);
  return offset;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Helper: tiny animated firefly dots (client-only to avoid hydration error)
───────────────────────────────────────────────────────────────────────────── */
function Fireflies() {
  const [mounted, setMounted] = useState(false);
  const [flies, setFlies] = useState<Array<{
    left: string;
    top: string;
    animationDelay: string;
    animationDuration: string;
    width: string;
    height: string;
  }>>([]);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setFlies(
        Array.from({ length: 22 }, () => ({
          left: `${(Math.random() * 100).toFixed(3)}%`,
          top: `${(Math.random() * 100).toFixed(3)}%`,
          animationDelay: `${(Math.random() * 8).toFixed(2)}s`,
          animationDuration: `${(5 + Math.random() * 7).toFixed(2)}s`,
          width: `${(2 + Math.random() * 3).toFixed(3)}px`,
          height: `${(2 + Math.random() * 3).toFixed(3)}px`,
        }))
      );
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  if (!mounted) return null;

  return (
    <div className="wwj-firefly-layer" aria-hidden="true">
      {flies.map((style, i) => (
        <span key={i} className="wwj-firefly" style={style} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Professional Wildlife Background
───────────────────────────────────────────────────────────────────────────── */
function WildlifeBackground({ offset }: { offset: number }) {
  return (
    <div className="wwj-wildlife-bg" aria-hidden="true">
      <div
        className="wwj-wildlife-img"
        style={{ transform: `translateY(${offset * 0.15}px) scale(1.08)` }}
      />
      <div className="wwj-wildlife-vignette" />
      <div className="wwj-wildlife-center-fade" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Helper: botanical SVG panel (large illustrated leaf cluster)
───────────────────────────────────────────────────────────────────────────── */
function BotanicalPanel({
  side,
  className = "",
  style,
}: {
  side: "left" | "right";
  className?: string;
  style?: React.CSSProperties;
}) {
  const flip = side === "right" ? "scale(-1,1)" : undefined;
  return (
    <svg
      viewBox="0 0 180 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: flip ? `scaleX(-1)` : undefined, ...style }}
      aria-hidden="true"
    >
      <path
        d="M90 330 C88 280 80 220 70 160 C60 100 50 60 40 20"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M70 160 Q20 140 5 100 Q40 115 70 160Z" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="0.5" />
      <path d="M70 160 Q15 170 10 210 Q45 185 70 160Z" fill="currentColor" opacity="0.06" stroke="currentColor" strokeWidth="0.4" />
      <path d="M80 220 Q25 200 15 240 Q50 220 80 220Z" fill="currentColor" opacity="0.07" stroke="currentColor" strokeWidth="0.4" />
      <path d="M60 100 Q110 80 130 40 Q95 70 60 100Z" fill="currentColor" opacity="0.07" stroke="currentColor" strokeWidth="0.5" />
      <path d="M55 130 Q115 120 140 90 Q100 105 55 130Z" fill="currentColor" opacity="0.06" stroke="currentColor" strokeWidth="0.4" />
      <path d="M70 160 Q42 145 22 120" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
      <path d="M70 160 Q35 155 18 165" stroke="currentColor" strokeWidth="0.3" opacity="0.3" />
      <circle cx="40" cy="20" r="3" fill="currentColor" opacity="0.15" />
      <circle cx="40" cy="20" r="1.2" fill="currentColor" opacity="0.35" />
      <path
        d="M90 280 Q110 265 120 275 Q130 285 115 295 Q105 302 100 295"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.4"
        fill="none"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Scroll Progress Bar
───────────────────────────────────────────────────────────────────────────── */
function ScrollProgressBar({ progress }: { progress: number }) {
  return (
    <div className="wwj-scroll-bar" aria-hidden="true">
      <div className="wwj-scroll-bar-fill" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Floating action pill (appears as you scroll past hero)
───────────────────────────────────────────────────────────────────────────── */
function FloatingPill({
  visible,
  catalogPdfUrl,
  onScrollToViewer,
}: {
  visible: boolean;
  catalogPdfUrl: string;
  onScrollToViewer: () => void;
}) {
  return (
    <div className={`wwj-float-pill${visible ? " active" : ""}`}>
      <button onClick={onScrollToViewer} className="wwj-float-pill-btn" aria-label="Jump to catalog">
        <Eye size={14} />
        <span>View</span>
      </button>
      <div className="wwj-float-pill-sep" />
      <a href={catalogPdfUrl} download className="wwj-float-pill-btn" aria-label="Download catalog">
        <Download size={14} />
        <span>Save</span>
      </a>
      <div className="wwj-float-pill-sep" />
      <a href={catalogPdfUrl} target="_blank" rel="noopener noreferrer" className="wwj-float-pill-btn" aria-label="Fullscreen catalog">
        <Maximize2 size={14} />
        <span>Full</span>
      </a>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────────────────────── */
export default function LookbookClient({ catalogPdfUrl }: LookbookClientProps) {
  const [showPill, setShowPill] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress();
  const parallaxOffset = useParallax(0.35);

  // Reveal hooks for sections
  const { ref: heroRevealRef, visible: heroRevealVisible } = useReveal(0.1);
  const { ref: statsRevealRef, visible: statsRevealVisible } = useReveal(0.2);
  const { ref: viewerRevealRef, visible: viewerRevealVisible } = useReveal(0.1);
  const { ref: footerRevealRef, visible: footerRevealVisible } = useReveal(0.3);

  useEffect(() => {
    const handleScroll = () => {
      setShowPill(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToViewer = useCallback(() => {
    viewerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="wwj-lb-root">
      {/* ── Inline Styles ─────────────────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Root ── */
        .wwj-lb-root {
          min-height: 100vh;
          background: #071D16;
          color: #F7F1E5;
          font-family: "Segoe UI","Helvetica Neue",Arial,sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* ── Noise grain overlay ── */
        .wwj-lb-root::before {
          content: "";
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.35;
        }

        /* ── Scroll progress bar ── */
        .wwj-scroll-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          z-index: 100;
          background: rgba(214,184,122,0.1);
          overflow: hidden;
        }
        .wwj-scroll-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #B89A56, #E8D4A0, #D6B87A);
          transform-origin: left;
          transition: transform 0.1s linear;
          box-shadow: 0 0 12px rgba(214,184,122,0.6);
        }

        /* ── Ambient radial blobs ── */
        .wwj-blob {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
          filter: blur(90px);
        }
        .wwj-blob-1 {
          width: 500px; height: 500px;
          top: -100px; left: -120px;
          background: radial-gradient(circle, rgba(214,184,122,0.08) 0%, transparent 70%);
          animation: wwj-blob-drift 18s ease-in-out infinite alternate;
        }
        .wwj-blob-2 {
          width: 400px; height: 400px;
          bottom: 0; right: -80px;
          background: radial-gradient(circle, rgba(16,44,34,0.5) 0%, transparent 70%);
          animation: wwj-blob-drift 22s ease-in-out infinite alternate-reverse;
        }
        .wwj-blob-3 {
          width: 300px; height: 300px;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(214,184,122,0.05) 0%, transparent 70%);
          animation: wwj-blob-pulse 10s ease-in-out infinite;
        }
        @keyframes wwj-blob-drift {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(40px, 30px) scale(1.1); }
        }
        @keyframes wwj-blob-pulse {
          0%,100% { opacity: 0.4; transform: translate(-50%,-50%) scale(1); }
          50%      { opacity: 1;   transform: translate(-50%,-50%) scale(1.3); }
        }

        /* ── Fireflies ── */
        .wwj-firefly-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }
        .wwj-firefly {
          position: absolute;
          border-radius: 50%;
          background: #D6B87A;
          animation: wwj-firefly-float linear infinite;
          box-shadow: 0 0 8px 3px rgba(214,184,122,0.5);
        }
        @keyframes wwj-firefly-float {
          0%   { opacity: 0;   transform: translateY(0) translateX(0) scale(0.8); }
          15%  { opacity: 0.8; transform: translateY(-8px) translateX(4px) scale(1);   }
          30%  { opacity: 0.5; transform: translateY(-20px) translateX(-6px) scale(1.1); }
          50%  { opacity: 0.9; transform: translateY(-30px) translateX(8px) scale(0.95); }
          70%  { opacity: 0.4; transform: translateY(-18px) translateX(-4px) scale(1.05); }
          85%  { opacity: 0.7; transform: translateY(-35px) translateX(3px) scale(0.9); }
          100% { opacity: 0;   transform: translateY(-45px) translateX(0) scale(0.7); }
        }

        /* ── Hero ── */
        .wwj-hero {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px 40px;
          text-align: center;
          overflow: hidden;
          min-height: 60vh;
        }
        /* Reveal animation classes */
        .wwj-reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }
        .wwj-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .wwj-reveal-delay-1 { transition-delay: 0.12s; }
        .wwj-reveal-delay-2 { transition-delay: 0.24s; }
        .wwj-reveal-delay-3 { transition-delay: 0.36s; }
        .wwj-reveal-delay-4 { transition-delay: 0.48s; }
        .wwj-reveal-delay-5 { transition-delay: 0.60s; }
        .wwj-reveal-delay-6 { transition-delay: 0.72s; }
        .wwj-reveal-delay-7 { transition-delay: 0.84s; }

        /* Scale-in reveal variant */
        .wwj-reveal-scale {
          opacity: 0;
          transform: scale(0.9) translateY(30px);
          transition: opacity 1s cubic-bezier(0.16,1,0.3,1), transform 1s cubic-bezier(0.16,1,0.3,1);
        }
        .wwj-reveal-scale.visible {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        .wwj-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 18px;
          border: 1px solid rgba(214,184,122,0.3);
          border-radius: 100px;
          background: rgba(214,184,122,0.06);
          backdrop-filter: blur(8px);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #D6B87A;
          margin-bottom: 28px;
          animation: wwj-badge-glow 4s ease-in-out infinite;
        }
        @keyframes wwj-badge-glow {
          0%,100% { box-shadow: 0 0 0 0 rgba(214,184,122,0); border-color: rgba(214,184,122,0.3); }
          50%     { box-shadow: 0 0 20px 4px rgba(214,184,122,0.12); border-color: rgba(214,184,122,0.5); }
        }

        .wwj-hero-title {
          font-family: "Palatino Linotype","Book Antiqua",Palatino,Georgia,serif;
          font-size: clamp(2.6rem, 7vw, 5.5rem);
          font-weight: 400;
          line-height: 1.08;
          letter-spacing: -0.02em;
          color: #F7F1E5;
          margin: 0 0 8px;
          text-shadow: 0 2px 40px rgba(0,0,0,0.5);
        }
        .wwj-hero-title em {
          font-style: italic;
          background: linear-gradient(135deg, #E8D4A0 0%, #D6B87A 50%, #B89A56 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 200% 200%;
          animation: wwj-title-shimmer 6s ease-in-out infinite;
        }
        @keyframes wwj-title-shimmer {
          0%,100% { background-position: 0% 50%; }
          50%     { background-position: 100% 50%; }
        }
        .wwj-hero-subtitle {
          font-size: 13px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(247,241,229,0.45);
          margin: 12px 0 0;
          font-weight: 400;
        }
        .wwj-hero-divider {
          width: 80px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #D6B87A 50%, transparent);
          margin: 28px auto;
          position: relative;
        }
        .wwj-hero-divider::after {
          content: "";
          position: absolute;
          top: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #D6B87A;
          box-shadow: 0 0 10px 2px rgba(214,184,122,0.5);
        }
        .wwj-hero-desc {
          max-width: 520px;
          font-size: 14.5px;
          line-height: 1.85;
          color: rgba(247,241,229,0.6);
          margin: 0 auto 40px;
        }

        /* ── CTA Buttons ── */
        .wwj-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 32px;
          border-radius: 100px;
          background: linear-gradient(135deg, #E8D4A0 0%, #D6B87A 60%, #B89A56 100%);
          color: #071D16;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          text-decoration: none;
          box-shadow: 0 4px 30px rgba(214,184,122,0.25), 0 0 0 0 rgba(214,184,122,0);
          transition: transform 0.25s, box-shadow 0.25s;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          border: none;
        }
        .wwj-cta-primary::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          border-radius: inherit;
        }
        /* Shimmer sweep on hover */
        .wwj-cta-primary::after {
          content: "";
          position: absolute;
          top: 0; left: -100%; bottom: 0;
          width: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.6s ease;
        }
        .wwj-cta-primary:hover::after { left: 100%; }
        .wwj-cta-primary:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 40px rgba(214,184,122,0.4), 0 0 0 4px rgba(214,184,122,0.1);
        }
        .wwj-cta-primary:active { transform: scale(0.97); }

        .wwj-cta-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 28px;
          border-radius: 100px;
          border: 1.5px solid rgba(214,184,122,0.35);
          color: #D6B87A;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-decoration: none;
          background: rgba(214,184,122,0.04);
          backdrop-filter: blur(8px);
          transition: background 0.25s, border-color 0.25s, transform 0.25s, box-shadow 0.25s;
          cursor: pointer;
        }
        .wwj-cta-ghost:hover {
          background: rgba(214,184,122,0.1);
          border-color: rgba(214,184,122,0.6);
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(214,184,122,0.15);
        }

        .wwj-scroll-hint {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: rgba(214,184,122,0.45);
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 48px;
          animation: wwj-bounce 2.5s ease-in-out infinite;
          transition: color 0.2s;
          border: none;
          background: none;
        }
        .wwj-scroll-hint:hover { color: rgba(214,184,122,0.8); }
        @keyframes wwj-bounce {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(8px); }
        }

        /* ── Botanical decorators ── */
        .wwj-botanical {
          position: absolute;
          pointer-events: none;
          color: #D6B87A;
          opacity: 0.18;
          z-index: 1;
        }
        .wwj-botanical-left {
          left: -20px;
          top: 0;
          bottom: 0;
          width: 160px;
          animation: wwj-sway-left 20s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .wwj-botanical-right {
          right: -20px;
          top: 0;
          bottom: 0;
          width: 160px;
          animation: wwj-sway-right 24s ease-in-out infinite;
          transform-origin: bottom center;
        }
        @keyframes wwj-sway-left {
          0%,100% { transform: rotate(-2deg) scaleX(1); }
          50%      { transform: rotate(2deg)  scaleX(1); }
        }
        @keyframes wwj-sway-right {
          0%,100% { transform: rotate(2deg); }
          50%      { transform: rotate(-3deg); }
        }

        /* ── Gold rule separators ── */
        .wwj-rule {
          display: flex;
          align-items: center;
          gap: 16px;
          max-width: 600px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .wwj-rule-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(214,184,122,0.3) 80%);
        }
        .wwj-rule-line:last-child {
          background: linear-gradient(90deg, rgba(214,184,122,0.3) 20%, transparent);
        }
        .wwj-rule-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(214,184,122,0.6);
          box-shadow: 0 0 6px rgba(214,184,122,0.4);
        }

        /* ── Stats strip (enhanced) ── */
        .wwj-stats {
          display: flex;
          align-items: center;
          gap: 0;
          margin: 40px auto 0;
          max-width: 520px;
          border: 1px solid rgba(214,184,122,0.12);
          border-radius: 20px;
          overflow: hidden;
          backdrop-filter: blur(16px);
          background: rgba(16,44,34,0.35);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        .wwj-stat {
          flex: 1;
          padding: 20px 12px;
          text-align: center;
          border-right: 1px solid rgba(214,184,122,0.08);
          transition: background 0.3s;
        }
        .wwj-stat:last-child { border-right: none; }
        .wwj-stat:hover { background: rgba(214,184,122,0.04); }
        .wwj-stat-num {
          font-family: "Palatino Linotype",Georgia,serif;
          font-size: 24px;
          color: #D6B87A;
          display: block;
          line-height: 1;
          transition: transform 0.3s;
        }
        .wwj-stat:hover .wwj-stat-num { transform: scale(1.1); }
        .wwj-stat-label {
          font-size: 8px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(247,241,229,0.4);
          margin-top: 6px;
          display: block;
        }

        /* ── Viewer Section ── */
        .wwj-viewer-section {
          position: relative;
          z-index: 2;
          padding: 60px 20px 80px;
        }
        .wwj-viewer-label {
          text-align: center;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(214,184,122,0.5);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .wwj-viewer-label::before,
        .wwj-viewer-label::after {
          content: "";
          display: block;
          width: 40px;
          height: 1px;
          background: rgba(214,184,122,0.25);
        }

        /* Viewer title */
        .wwj-viewer-title {
          text-align: center;
          font-family: "Palatino Linotype","Book Antiqua",Palatino,Georgia,serif;
          font-size: clamp(1.4rem, 3vw, 2.2rem);
          font-weight: 400;
          color: #F7F1E5;
          margin: 0 0 8px;
          letter-spacing: 0.02em;
        }
        .wwj-viewer-subtitle {
          text-align: center;
          font-size: 12.5px;
          color: rgba(247,241,229,0.4);
          margin: 0 0 40px;
          letter-spacing: 0.05em;
        }

        /* ── The PDF frame (enhanced) ── */
        .wwj-frame-outer {
          max-width: 580px;
          margin: 0 auto;
          position: relative;
        }
        /* Ornamental corner marks — animated on hover */
        .wwj-corner {
          position: absolute;
          width: 28px;
          height: 28px;
          pointer-events: none;
          z-index: 5;
          transition: width 0.4s, height 0.4s, opacity 0.4s;
        }
        .wwj-frame-outer:hover .wwj-corner {
          width: 36px;
          height: 36px;
        }
        .wwj-corner-tl { top: -2px; left: -2px;  border-top: 2px solid rgba(214,184,122,0.6); border-left:  2px solid rgba(214,184,122,0.6); border-radius: 4px 0 0 0; }
        .wwj-corner-tr { top: -2px; right: -2px; border-top: 2px solid rgba(214,184,122,0.6); border-right: 2px solid rgba(214,184,122,0.6); border-radius: 0 4px 0 0; }
        .wwj-corner-bl { bottom: -2px; left: -2px;  border-bottom: 2px solid rgba(214,184,122,0.6); border-left:  2px solid rgba(214,184,122,0.6); border-radius: 0 0 0 4px; }
        .wwj-corner-br { bottom: -2px; right: -2px; border-bottom: 2px solid rgba(214,184,122,0.6); border-right: 2px solid rgba(214,184,122,0.6); border-radius: 0 0 4px 0; }

        /* Glow ring animation behind the frame */
        .wwj-frame-glow {
          position: absolute;
          inset: -24px;
          border-radius: 30px;
          z-index: -1;
          pointer-events: none;
          background: conic-gradient(from 0deg, rgba(214,184,122,0.1), transparent 30%, rgba(214,184,122,0.08), transparent 60%, rgba(214,184,122,0.12), transparent 90%);
          animation: wwj-glow-spin 12s linear infinite;
          opacity: 0.7;
          filter: blur(16px);
        }
        @keyframes wwj-glow-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .wwj-frame-shadow {
          padding: 3px;
          border-radius: 22px;
          background: linear-gradient(135deg, rgba(214,184,122,0.25), rgba(214,184,122,0.05) 50%, rgba(214,184,122,0.15));
          box-shadow:
            0 0 0 1px rgba(214,184,122,0.08),
            0 24px 80px rgba(0,0,0,0.6),
            0 0 60px rgba(214,184,122,0.05) inset;
          transition: box-shadow 0.5s, transform 0.5s;
        }
        .wwj-frame-shadow:hover {
          box-shadow:
            0 0 0 1px rgba(214,184,122,0.2),
            0 30px 100px rgba(0,0,0,0.7),
            0 0 80px rgba(214,184,122,0.1) inset;
          transform: translateY(-4px);
        }
        .wwj-frame-inner {
          border-radius: 20px;
          overflow: hidden;
          background: #071D16;
          position: relative;
        }
        /* 9:16 portrait aspect */
        .wwj-pdf-ratio {
          position: relative;
          width: 100%;
          padding-bottom: 177.78%; /* 9:16 */
        }
        .wwj-pdf-ratio iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
          background: #071D16;
        }

        /* Subtle scanline effect over PDF */
        .wwj-frame-inner::after {
          content: "";
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(7,29,22,0.03) 3px,
            rgba(7,29,22,0.03) 4px
          );
          pointer-events: none;
          z-index: 3;
          border-radius: 20px;
        }

        /* ── PDF toolbar overlay ── */
        .wwj-pdf-toolbar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
          flex-wrap: wrap;
        }
        .wwj-pdf-toolbar-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          border-radius: 100px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.25s;
          cursor: pointer;
          border: none;
        }
        .wwj-pdf-toolbar-btn.primary {
          background: linear-gradient(135deg, #E8D4A0, #D6B87A, #B89A56);
          color: #071D16;
          box-shadow: 0 2px 16px rgba(214,184,122,0.2);
        }
        .wwj-pdf-toolbar-btn.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 24px rgba(214,184,122,0.35);
        }
        .wwj-pdf-toolbar-btn.ghost {
          background: rgba(214,184,122,0.06);
          color: #D6B87A;
          border: 1px solid rgba(214,184,122,0.25);
          backdrop-filter: blur(8px);
        }
        .wwj-pdf-toolbar-btn.ghost:hover {
          background: rgba(214,184,122,0.12);
          border-color: rgba(214,184,122,0.5);
          transform: translateY(-1px);
        }

        /* Frame caption */
        .wwj-frame-caption {
          text-align: center;
          font-size: 11px;
          color: rgba(214,184,122,0.45);
          margin-top: 24px;
          letter-spacing: 0.1em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .wwj-frame-caption .dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(214,184,122,0.4);
          display: inline-block;
        }

        /* ── Floating pill ── */
        .wwj-float-pill {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%) translateY(80px);
          z-index: 90;
          display: flex;
          align-items: center;
          gap: 0;
          background: rgba(7,29,22,0.92);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(214,184,122,0.2);
          border-radius: 100px;
          padding: 6px 8px;
          box-shadow: 0 12px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(214,184,122,0.08) inset;
          opacity: 0;
          pointer-events: none;
          transition: transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.5s;
        }
        .wwj-float-pill.active {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
          pointer-events: auto;
        }
        .wwj-float-pill-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          color: #D6B87A;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 100px;
          transition: background 0.2s, color 0.2s;
          cursor: pointer;
          border: none;
          background: none;
          white-space: nowrap;
        }
        .wwj-float-pill-btn:hover {
          background: rgba(214,184,122,0.12);
          color: #F7F1E5;
        }
        .wwj-float-pill-sep {
          width: 1px;
          height: 20px;
          background: rgba(214,184,122,0.15);
          flex-shrink: 0;
        }

        /* ── Footer bar ── */
        .wwj-footer-bar {
          position: relative;
          z-index: 2;
          border-top: 1px solid rgba(214,184,122,0.1);
          padding: 36px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          background: linear-gradient(0deg, rgba(7,29,22,0.9), transparent);
        }
        .wwj-footer-text {
          font-size: 10px;
          letter-spacing: 0.15em;
          color: rgba(247,241,229,0.3);
          text-transform: uppercase;
        }

        /* ── Mobile card ── */
        .wwj-mobile-card {
          max-width: 340px;
          margin: 0 auto;
          background: linear-gradient(145deg, rgba(16,44,34,0.85), rgba(7,29,22,0.95));
          border: 1px solid rgba(214,184,122,0.2);
          border-radius: 24px;
          padding: 40px 28px;
          text-align: center;
          backdrop-filter: blur(20px);
          box-shadow: 0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(214,184,122,0.05) inset;
          position: relative;
          overflow: hidden;
        }
        .wwj-mobile-card::before {
          content: "";
          position: absolute;
          top: -60px; left: 50%;
          transform: translateX(-50%);
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(214,184,122,0.08), transparent 70%);
          pointer-events: none;
        }
        .wwj-mobile-icon {
          width: 72px; height: 72px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(214,184,122,0.12), rgba(214,184,122,0.04));
          border: 1px solid rgba(214,184,122,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          box-shadow: 0 0 30px rgba(214,184,122,0.1) inset;
        }

        /* ── Back button ── */
        .wwj-back-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 1.5px solid rgba(214,184,122,0.25);
          color: #D6B87A;
          background: rgba(214,184,122,0.05);
          backdrop-filter: blur(8px);
          transition: all 0.25s;
          text-decoration: none;
        }
        .wwj-back-btn:hover {
          background: rgba(214,184,122,0.15);
          border-color: rgba(214,184,122,0.5);
          transform: translateX(-2px);
        }

        /* ── Professional wildlife background image ── */
        .wwj-wildlife-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .wwj-wildlife-img {
          position: absolute;
          inset: -40px;
          background-image: url('/wildlife-bg.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.13;
          will-change: transform;
        }
        .wwj-wildlife-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at 50% 50%,
            transparent 25%,
            rgba(7,29,22,0.55) 60%,
            rgba(7,29,22,0.88) 100%
          );
        }
        .wwj-wildlife-center-fade {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(7,29,22,0.45) 0%,
            transparent 20%,
            transparent 75%,
            rgba(7,29,22,0.6) 100%
          );
        }

        /* ── Feature cards between hero and viewer ── */
        .wwj-features {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 700px;
          margin: 0 auto;
          padding: 60px 20px;
        }
        @media (max-width: 640px) {
          .wwj-features { grid-template-columns: 1fr; max-width: 340px; }
        }
        .wwj-feature-card {
          padding: 28px 20px;
          border: 1px solid rgba(214,184,122,0.1);
          border-radius: 20px;
          background: rgba(16,44,34,0.3);
          backdrop-filter: blur(12px);
          text-align: center;
          transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s;
        }
        .wwj-feature-card:hover {
          border-color: rgba(214,184,122,0.3);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }
        .wwj-feature-icon {
          width: 48px; height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(214,184,122,0.1), rgba(214,184,122,0.04));
          border: 1px solid rgba(214,184,122,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px;
          color: #D6B87A;
          transition: transform 0.3s;
        }
        .wwj-feature-card:hover .wwj-feature-icon {
          transform: scale(1.1) rotate(5deg);
        }
        .wwj-feature-title {
          font-family: "Palatino Linotype",Georgia,serif;
          font-size: 15px;
          color: #F7F1E5;
          margin: 0 0 6px;
          font-weight: 400;
        }
        .wwj-feature-desc {
          font-size: 11px;
          color: rgba(247,241,229,0.4);
          line-height: 1.6;
          margin: 0;
        }

        /* ── Responsive fixes ── */
        @media (max-width: 768px) {
          .wwj-hero { min-height: 70vh; padding: 60px 20px 40px; }
          .wwj-stats { max-width: 100%; margin: 28px 8px 0; border-radius: 16px; }
          .wwj-stat { padding: 14px 6px; }
          .wwj-stat-num { font-size: 18px; }
          .wwj-float-pill { bottom: 16px; }
          .wwj-float-pill-btn { padding: 8px 12px; font-size: 9px; }
        }
      `}} />

      {/* ── Scroll Progress Bar ────────────────────────────────────────────── */}
      <ScrollProgressBar progress={progress} />

      {/* ── Ambient Blobs ─────────────────────────────────────────────────── */}
      <div className="wwj-blob wwj-blob-1" aria-hidden="true" />
      <div className="wwj-blob wwj-blob-2" aria-hidden="true" />
      <div className="wwj-blob wwj-blob-3" aria-hidden="true" />

      {/* ── Professional Wildlife Background Image with parallax ───────── */}
      <WildlifeBackground offset={parallaxOffset} />

      {/* ── Fireflies ─────────────────────────────────────────────────────── */}
      <Fireflies />

      {/* ── Floating Action Pill ───────────────────────────────────────────── */}
      <FloatingPill visible={showPill} catalogPdfUrl={catalogPdfUrl} onScrollToViewer={scrollToViewer} />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="wwj-hero" ref={heroRef}>
        {/* Botanical side panels — desktop only */}
        <div className="wwj-botanical wwj-botanical-left hidden xl:block">
          <BotanicalPanel side="left" style={{ width: "100%", height: "100%" }} />
        </div>
        <div className="wwj-botanical wwj-botanical-right hidden xl:block">
          <BotanicalPanel side="right" style={{ width: "100%", height: "100%" }} />
        </div>

        <div ref={heroRevealRef} className="w-full flex flex-col items-center z-10">
          {/* Badge */}
          <div className={`wwj-hero-badge wwj-reveal${heroRevealVisible ? " visible" : ""}`}>
            <Sparkles size={10} />
            Exclusive Edition · 2026
            <Sparkles size={10} />
          </div>

          {/* Title */}
          <h2
            className={`wwj-hero-title wwj-reveal wwj-reveal-delay-1${heroRevealVisible ? " visible" : ""}`}
            style={{ transform: `translateY(${heroRevealVisible ? 0 : 40}px)` }}
          >
            The <em>Wildlife</em><br />Wonder<br />Lookbook
          </h2>
          <p className={`wwj-hero-subtitle wwj-reveal wwj-reveal-delay-2${heroRevealVisible ? " visible" : ""}`}>
            Handcrafted Nature-Inspired Jewellery
          </p>

          {/* Ornamental divider */}
          <div className={`wwj-hero-divider wwj-reveal wwj-reveal-delay-3${heroRevealVisible ? " visible" : ""}`} />

          {/* Description */}
          <p className={`wwj-hero-desc wwj-reveal wwj-reveal-delay-4${heroRevealVisible ? " visible" : ""}`}>
            Explore our curated collection of ethically crafted pieces — each one a
            story carved in silver and stone. Leaf through our full catalog below,
            or download it to keep forever.
          </p>

          {/* CTAs */}
          <div
            className={`wwj-reveal wwj-reveal-delay-5${heroRevealVisible ? " visible" : ""}`}
            style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}
          >
            <button onClick={scrollToViewer} className="wwj-cta-primary">
              <BookOpen size={14} />
              Browse the Catalog
            </button>
            <a href={catalogPdfUrl} download className="wwj-cta-ghost">
              <FileDown size={14} />
              Save PDF
            </a>
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRevealRef}>
          <div className={`wwj-stats wwj-reveal-scale wwj-reveal-delay-6${statsRevealVisible ? " visible" : ""}`}>
            {[
              { num: "100+", label: "Designs" },
              { num: "Sterling", label: "Silver" },
              { num: "Ethically", label: "Sourced" },
              { num: "2026", label: "Edition" },
            ].map((s) => (
              <div key={s.label} className="wwj-stat">
                <span className="wwj-stat-num">{s.num}</span>
                <span className="wwj-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <button
          className={`wwj-scroll-hint wwj-reveal wwj-reveal-delay-7${heroRevealVisible ? " visible" : ""}`}
          onClick={scrollToViewer}
          aria-label="Scroll to viewer"
        >
          <span>View Catalog</span>
          <ChevronDown size={16} />
        </button>
      </section>

      {/* ── Rule ─────────────────────────────────────────────────────────── */}
      <div className="wwj-rule" style={{ marginBottom: 0 }}>
        <div className="wwj-rule-line" />
        <div className="wwj-rule-dot" />
        <div className="wwj-rule-line" />
      </div>

      {/* ── Feature cards ─────────────────────────────────────────────────── */}
      <div className="wwj-features">
        {[
          {
            icon: <BookOpen size={20} />,
            title: "Full Catalog",
            desc: "Browse every page of our 2026 collection in gorgeous detail",
          },
          {
            icon: <Download size={20} />,
            title: "Offline Access",
            desc: "Download the PDF to enjoy on any device, anytime, anywhere",
          },
          {
            icon: <Maximize2 size={20} />,
            title: "Crisp Viewing",
            desc: "Pinch, zoom, and scroll through high-resolution imagery",
          },
        ].map((f, i) => (
          <div
            key={f.title}
            className={`wwj-feature-card wwj-reveal wwj-reveal-delay-${i + 1}${statsRevealVisible ? " visible" : ""}`}
          >
            <div className="wwj-feature-icon">{f.icon}</div>
            <h3 className="wwj-feature-title">{f.title}</h3>
            <p className="wwj-feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Rule ─────────────────────────────────────────────────────────── */}
      <div className="wwj-rule" style={{ marginBottom: 0 }}>
        <div className="wwj-rule-line" />
        <div className="wwj-rule-dot" />
        <div className="wwj-rule-line" />
      </div>

      {/* ── PDF VIEWER SECTION ───────────────────────────────────────────── */}
      <section className="wwj-viewer-section" ref={viewerRef}>
        <div ref={viewerRevealRef}>
          <div className={`wwj-viewer-label wwj-reveal${viewerRevealVisible ? " visible" : ""}`}>
            <span>Catalog Viewer</span>
          </div>
          <h3 className={`wwj-viewer-title wwj-reveal wwj-reveal-delay-1${viewerRevealVisible ? " visible" : ""}`}>
            Explore the Collection
          </h3>
          <p className={`wwj-viewer-subtitle wwj-reveal wwj-reveal-delay-2${viewerRevealVisible ? " visible" : ""}`}>
            Scroll inside the frame to browse every page
          </p>
        </div>

        {/* ── Desktop / Tablet: framed PDF ─── */}
        <div className="hidden md:block">
          <div className={`wwj-frame-outer wwj-reveal-scale wwj-reveal-delay-3${viewerRevealVisible ? " visible" : ""}`}>
            {/* Rotating glow behind frame */}
            <div className="wwj-frame-glow" />

            {/* Ornamental corners */}
            <div className="wwj-corner wwj-corner-tl" />
            <div className="wwj-corner wwj-corner-tr" />
            <div className="wwj-corner wwj-corner-bl" />
            <div className="wwj-corner wwj-corner-br" />

            <div className="wwj-frame-shadow">
              <div className="wwj-frame-inner">
                <div className="wwj-pdf-ratio">
                  <iframe
                    src={`${catalogPdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                    title="WWJ Lookbook — Wildlife Wonder Jewellery Catalog 2026"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Caption */}
          <div className="wwj-frame-caption">
            <span className="dot" />
            <span>Scroll inside the frame to explore every page</span>
            <span className="dot" />
          </div>

          {/* Toolbar row */}
          <div className="wwj-pdf-toolbar">
            <a
              href={catalogPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="wwj-pdf-toolbar-btn ghost"
            >
              <ExternalLink size={13} />
              Open in New Tab
            </a>
            <a
              href={catalogPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="wwj-pdf-toolbar-btn ghost"
            >
              <Maximize2 size={13} />
              Fullscreen
            </a>
            <a
              href={catalogPdfUrl}
              download
              className="wwj-pdf-toolbar-btn primary"
            >
              <FileDown size={13} />
              Download Lookbook
            </a>
          </div>
        </div>

        {/* ── Mobile: card + action buttons ─── */}
        <div className="md:hidden">
          <div className="wwj-mobile-card">
            <div className="wwj-mobile-icon">
              <BookOpen size={28} style={{ color: "#D6B87A" }} />
            </div>
            <h2 style={{
              fontFamily: '"Palatino Linotype",Georgia,serif',
              fontSize: 22,
              fontWeight: 400,
              color: "#F7F1E5",
              marginBottom: 12,
            }}>
              Our 2026 Lookbook
            </h2>
            <p style={{ fontSize: 13, color: "rgba(247,241,229,0.6)", lineHeight: 1.75, marginBottom: 28 }}>
              For the best experience — full vertical scroll, pinch-to-zoom, and crisp
              page details — open or download the catalog directly.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a
                href={catalogPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="wwj-cta-primary"
                style={{ justifyContent: "center" }}
              >
                Open Lookbook <ExternalLink size={14} />
              </a>
              <a
                href={catalogPdfUrl}
                download
                className="wwj-cta-ghost"
                style={{ justifyContent: "center" }}
              >
                Download PDF <FileDown size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer Bar ───────────────────────────────────────────────────── */}
      <footer className="wwj-footer-bar" ref={footerRevealRef}>
        <div className={`wwj-rule wwj-reveal${footerRevealVisible ? " visible" : ""}`} style={{ width: "100%" }}>
          <div className="wwj-rule-line" />
          <div className="wwj-rule-dot" />
          <div className="wwj-rule-line" />
        </div>
        <p className={`wwj-footer-text wwj-reveal wwj-reveal-delay-1${footerRevealVisible ? " visible" : ""}`}>
          © 2026 Wildlife Wonder Jewellery — All designs are original & ethically made
        </p>
        <Link
          href="/shop"
          className={`wwj-reveal wwj-reveal-delay-2${footerRevealVisible ? " visible" : ""}`}
          style={{ fontSize: 10, color: "rgba(214,184,122,0.4)", textDecoration: "none", letterSpacing: "0.15em" }}
        >
          ← Return to Shop
        </Link>
      </footer>
    </div>
  );
}
