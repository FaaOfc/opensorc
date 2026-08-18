"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
  Zap,
  Home,
  UploadCloud,
  LinkIcon,
  Music2,
  Camera,
  MessageSquare,
  Heart,
  Monitor,
  ImageIcon,
  Languages,
  ImageDown,
  AudioWaveform,
  ZoomIn,
  Sun,
  Moon,
  Menu,
  X,
  Users,
  Sparkles,
  FileText,
} from "lucide-react";

const mainNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/cdn", label: "CDN", icon: UploadCloud },
  { href: "/short", label: "ShortURL", icon: LinkIcon },
  { href: "/ttdl", label: "TikTok DL", icon: Music2 },
  { href: "/igdl", label: "Instagram DL", icon: Camera },
  { href: "/fbdl", label: "Fesnuk DL", icon: Monitor },
  { href: "/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/ai-waifu", label: "AI Waifu", icon: Heart },
  { href: "/imagen", label: "AI Image", icon: ImageIcon },
  { href: "/translate", label: "Translate", icon: Languages },
  { href: "/compress", label: "Compress", icon: ImageDown },
  { href: "/upscaler", label: "Upscaler", icon: ZoomIn },
  { href: "/tts", label: "TTS", icon: AudioWaveform },
];

const infoNav = [
  { href: "/about", label: "About", icon: Users },
  { href: "/thanks", label: "Thanks To", icon: Heart },
  { href: "/tos", label: "ToS", icon: FileText },
  { href: "/credits", label: "Credits", icon: Sparkles },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="p-4 border-b-2 flex items-center gap-2 shrink-0"
        style={{ borderColor: "var(--neo-border-color)" }}
      >
        <Zap className="size-5 text-orange-500 shrink-0" />
        <span className="font-mono font-bold text-base tracking-tight truncate">
          TaoSite
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {/* Main tools */}
        {mainNav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-mono text-sm font-medium transition-all ${
                active
                  ? "bg-[var(--neo-border-color)] text-[var(--neo-card-bg)] shadow-none"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        {/* Separator */}
        <div
          className="my-2 mx-1"
          style={{ borderBottom: "1px dashed var(--neo-border-color)", opacity: 0.5 }}
        />

        {/* Info pages */}
        {infoNav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-mono text-sm font-medium transition-all ${
                active
                  ? "bg-[var(--neo-border-color)] text-[var(--neo-card-bg)] shadow-none"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Theme toggle at bottom */}
      <div
        className="p-3 border-t-2 shrink-0"
        style={{ borderColor: "var(--neo-border-color)" }}
      >
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="neo-btn w-full flex items-center gap-2 px-3 py-2 font-mono text-sm bg-[var(--neo-card-bg)] hover:opacity-80"
          >
            {theme === "dark" ? (
              <Sun className="size-4 shrink-0" />
            ) : (
              <Moon className="size-4 shrink-0" />
            )}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside
        className="hidden sm:flex w-52 shrink-0 border-r-2 flex-col sticky top-0 h-screen bg-[var(--neo-card-bg)] z-40"
        style={{ borderColor: "var(--neo-border-color)" }}
      >
        {navContent}
      </aside>

      {/* Mobile: top bar + overlay sidebar */}
      {/* Top bar */}
      <div
        className="sm:hidden fixed top-0 left-0 right-0 z-50 neo-border bg-[var(--neo-card-bg)] flex items-center justify-between px-3 h-12"
      >
        <div className="flex items-center gap-2 font-mono font-bold text-base">
          <Zap className="size-4 text-orange-500" />
          TaoSite
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="neo-btn p-1.5 bg-[var(--neo-card-bg)]"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="sm:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="sm:hidden fixed top-0 left-0 bottom-0 w-56 z-50 border-r-2 bg-[var(--neo-card-bg)] animate-slide-left"
            style={{ borderColor: "var(--neo-border-color)" }}
          >
            {navContent}
          </aside>
        </>
      )}
    </>
  );
}
