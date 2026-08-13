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
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/cdn", label: "CDN", icon: UploadCloud },
  { href: "/short", label: "ShortURL", icon: LinkIcon },
  { href: "/ttdl", label: "TikTok DL", icon: Music2 },
  { href: "/igdl", label: "IG DL", icon: Camera },
  { href: "/chat", label: "AI Chat", icon: MessageSquare },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="neo-border bg-[var(--neo-card-bg)] sticky top-0 z-50 rounded-b-lg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-mono font-bold text-lg tracking-tight hover:opacity-80 transition-opacity"
          >
            <Zap className="size-5 text-orange-500" />
            <span>TaoSite</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`neo-btn flex items-center gap-1.5 px-3 py-1.5 text-sm font-mono font-medium ${
                    active
                      ? "bg-[var(--neo-border-color)] text-[var(--neo-card-bg)] shadow-none translate-x-[3px] translate-y-[3px]"
                      : "bg-[var(--neo-card-bg)] hover:opacity-80"
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="neo-btn p-2 bg-[var(--neo-card-bg)] hover:opacity-80"
                title={theme === "dark" ? "Light mode" : "Dark mode"}
              >
                {theme === "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </button>
            )}
          </div>

          {/* Mobile: theme + menu */}
          <div className="flex items-center gap-2 lg:hidden">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="neo-btn p-2 bg-[var(--neo-card-bg)]"
                title={theme === "dark" ? "Light mode" : "Dark mode"}
              >
                {theme === "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </button>
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="neo-btn p-2 bg-[var(--neo-card-bg)]"
            >
              {mobileOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden pb-3 flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`neo-btn flex items-center gap-2 px-3 py-2 text-sm font-mono font-medium w-full ${
                    active
                      ? "bg-[var(--neo-border-color)] text-[var(--neo-card-bg)] shadow-none translate-x-[3px] translate-y-[3px]"
                      : "bg-[var(--neo-card-bg)] hover:opacity-80"
                  }`}
                >
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
