"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, Clock, Film, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const tabs = [
  { href: "/anime/home", label: "Home", icon: Home },
  { href: "/anime/latest", label: "Latest", icon: Clock },
  { href: "/anime/movie", label: "Movie", icon: Film },
];

export default function AnimeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const isActive = (href: string) => {
    if (href === "/anime/home") return pathname === "/anime/home";
    return pathname.startsWith(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/anime/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* Anime Sub-Navigation */}
      <div
        className="sticky top-0 z-30 border-b-2 bg-[var(--neo-page-bg)]"
        style={{ borderColor: "var(--neo-border-color)" }}
      >
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 flex-wrap">
          {/* Tabs */}
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`neo-btn flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-medium transition-all ${
                  active
                    ? "bg-[var(--neo-border-color)] text-[var(--neo-card-bg)] shadow-none"
                    : "bg-[var(--neo-card-bg)] hover:opacity-80"
                }`}
              >
                <Icon className="size-3.5" />
                {tab.label}
              </Link>
            );
          })}

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex items-center ml-auto gap-0"
          >
            <div className="relative flex items-center">
              <Search className="size-3.5 absolute left-2.5 pointer-events-none" style={{ color: "var(--neo-muted-text)" }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari anime..."
                className="font-mono text-xs pl-8 pr-3 py-1.5 w-40 sm:w-52 border-2 border-[var(--neo-border-color)] bg-[var(--neo-card-bg)] text-[var(--neo-page-bg)] placeholder:text-[var(--neo-muted-text)] rounded-l-md outline-none focus:shadow-[3px_3px_0px_var(--neo-shadow-color)] transition-shadow"
                style={{ color: "var(--neo-foreground, var(--neo-border-color))" }}
              />
            </div>
            <button
              type="submit"
              className="neo-btn px-3 py-1.5 bg-orange-500 text-white border-orange-600 rounded-l-none rounded-r-md font-mono text-xs font-bold"
              style={{ boxShadow: "3px 3px 0px var(--neo-shadow-color)" }}
            >
              Cari
            </button>
          </form>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
