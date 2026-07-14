"use client";
import { useEffect, useRef } from "react";

/**
 * GoldDustField — stigande guldpartiklar med shimmer över Atilli Bergs hero.
 * Samma motor som Coal is Kings EmberField men i guld-palett (matchar --gold).
 * - Respekterar prefers-reduced-motion (renderar ingenting).
 * - Pausar när fliken är dold eller hero är utanför vyn.
 * - Capped devicePixelRatio + få partiklar → billig på mobil.
 *
 * Användning i Hero.tsx:
 *   import GoldDustField from "./GoldDustField";
 *   ...läggs direkt efter overlay-diven, före content:
 *   <GoldDustField />
 *
 * Kräver att hero-sektionen har position: relative (har den redan)
 * och att content/logga ligger på högre z-index än 2.
 */
export default function GoldDustField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 18 : 36;

    type P = {
      x: number; y: number; r: number;
      vy: number; vx: number;
      life: number; max: number;
      hue: number;      // 42–52 → guld
      twinkle: number;  // fasförskjutning för shimmer
    };
    const parts: P[] = [];
    const spawn = (init = false): P => ({
      x: Math.random() * w,
      y: init ? Math.random() * h : h + 8,
      r: 0.6 + Math.random() * 1.8,          // finare korn än embers
      vy: 0.15 + Math.random() * 0.45,        // långsammare, elegantare
      vx: (Math.random() - 0.5) * 0.22,
      life: 0,
      max: 300 + Math.random() * 300,
      hue: 42 + Math.random() * 10,
      twinkle: Math.random() * Math.PI * 2,
    });
    for (let i = 0; i < COUNT; i++) parts.push(spawn(true));

    let raf = 0;
    let running = true;
    let t = 0;

    const tick = () => {
      if (!running) return;
      t++;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.life++;
        p.y -= p.vy;
        p.x += p.vx + Math.sin((t + i * 41) * 0.008) * 0.14;
        if (p.life >= p.max || p.y < -10) { parts[i] = spawn(); continue; }

        const fade = Math.sin(Math.min(p.life / p.max, 1) * Math.PI);      // in → ut
        const shimmer = 0.6 + 0.4 * Math.sin(t * 0.06 + p.twinkle);        // glitter
        const a = fade * shimmer * 0.7;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        g.addColorStop(0, `hsla(${p.hue}, 85%, 70%, ${a})`);
        g.addColorStop(0.5, `hsla(${p.hue}, 75%, 55%, ${a * 0.3})`);
        g.addColorStop(1, "hsla(45, 80%, 45%, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fill();

        // liten skarp kärna → känsla av metalliskt korn
        ctx.fillStyle = `hsla(${p.hue}, 90%, 82%, ${a * 0.9})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(tick); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  );
}
