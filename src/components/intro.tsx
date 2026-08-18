"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { siteConfig } from "@/lib/config";

export default function IntroScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState(0); // 0=logo, 1=name, 2=tagline, 3=fadeout

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => setPhase(3), 1600);
    const t4 = setTimeout(() => onComplete(), 2100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[var(--neo-page-bg)] transition-opacity duration-500 ${
        phase === 3 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Logo icon */}
        <div
          className={`neo-border rounded-2xl p-5 bg-orange-50 dark:bg-orange-950 transition-all duration-500 ${
            phase >= 0
              ? "opacity-100 scale-100"
              : "opacity-0 scale-75"
          }`}
          style={{
            animation: phase >= 0 ? "introBounce 0.6s ease-out" : "none",
          }}
        >
          <Zap className="size-10 text-orange-500" />
        </div>

        {/* Site name */}
        <h1
          className={`text-3xl sm:text-4xl font-mono font-bold tracking-tight transition-all duration-500 ${
            phase >= 1
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          {siteConfig.siteName}
        </h1>

        {/* Tagline */}
        <p
          className={`font-mono text-sm text-center max-w-xs transition-all duration-500 ${
            phase >= 2
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3"
          }`}
          style={{ color: "var(--neo-muted-text)" }}
        >
          {siteConfig.tagline}
        </p>

        {/* Loading dots */}
        <div
          className={`flex gap-1.5 mt-2 transition-all duration-300 ${
            phase >= 2 ? "opacity-100" : "opacity-0"
          }`}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-orange-500"
              style={{
                animation: phase >= 2 ? `introDot 1s ease-in-out ${i * 0.2}s infinite` : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
