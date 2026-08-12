"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  UploadCloud,
  Link as LinkIcon,
  Github,
  Palette,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Cloud,
  Zap,
  Shield,
  Globe,
  Music2,
  Camera,
  MessageSquare,
  ExternalLink,
  MousePointerClick,
  Server,
  Heart,
  Monitor,
  ImageIcon,
} from "lucide-react";
import { siteConfig } from "@/lib/config";

const iconMap = {
  "upload-cloud": UploadCloud,
  link: LinkIcon,
  github: Github,
  palette: Palette,
  message: MessageSquare,
  heart: Heart,
  monitor: Monitor,
  image: ImageIcon,
};

const features = [
  {
    id: "cdn",
    title: "CDN Hosting",
    subtitle: "Host any file, any mimetype",
    description:
      "Upload images, videos, documents, executables — anything. Your files are stored on GitHub and served through your own domain with proper MIME types.",
    icon: "upload-cloud" as const,
    color: "#f97316",
    details: [
      "Supports all MIME types",
      "Drag & drop file upload",
      "Random 4-char filenames",
      "GitHub as free storage",
      "Proxied through your domain",
    ],
  },
  {
    id: "shorturl",
    title: "URL Shortener",
    subtitle: "Shorten any URL instantly",
    description:
      "Transform long URLs into short, shareable links. Optionally customize your short codes. All mappings stored in a GitHub Gist — zero cost.",
    icon: "link" as const,
    color: "#10b981",
    details: [
      "Custom short codes (optional)",
      "Random code generation",
      "GitHub Gist as database",
      "Instant 302 redirects",
      "Collision-safe codes",
    ],
  },
  {
    id: "ttdl",
    title: "TikTok Downloader",
    subtitle: "Download video tanpa watermark",
    description:
      "Unduh video TikTok tanpa watermark dalam kualitas HD. Juga mendukung download audio MP3 dan photo slide carousel.",
    icon: "upload-cloud" as const,
    color: "#0d9488",
    details: [
      "Video HD tanpa watermark",
      "Download audio MP3",
      "Photo slide carousel",
      "Video dengan watermark",
      "Info statistik lengkap",
    ],
  },
  {
    id: "igdl",
    title: "Instagram Downloader",
    subtitle: "Download Reels & Post",
    description:
      "Unduh Reels, video post, foto single & multiple carousel dari Instagram. Cukup paste URL dan langsung download.",
    icon: "upload-cloud" as const,
    color: "#be123c",
    details: [
      "Download Reels video",
      "Download video post",
      "Foto single & carousel",
      "Thumbnail preview",
      "Per-item download",
    ],
  },
  {
    id: "fbdl",
    title: "Facebook Downloader",
    subtitle: "Download Video SD & HD",
    description:
      "Unduh video Facebook dengan pilihan kualitas SD atau HD. Cukup paste URL video Facebook dan langsung download.",
    icon: "monitor" as const,
    color: "#2563eb",
    details: [
      "Video SD download",
      "Video HD download",
      "Gratis tanpa login",
      "Paste & download",
      "Fast processing",
    ],
  },
  {
    id: "chat",
    title: "AI Chat",
    subtitle: "Chat gratis tanpa login",
    description:
      "Chat dengan AI gratis tanpa perlu akun. 24 model premium — GPT-5.5, Claude Opus 4.8, Gemini 3.1 Pro, Grok 4.1, dan lainnya.",
    icon: "message" as const,
    color: "#7c3aed",
    details: [
      "24 model AI premium",
      "Tanpa login, langsung pakai",
      "Chat history di browser",
      "Multiple sessions",
      "Markdown formatting",
    ],
  },
  {
    id: "waifu",
    title: "AI Waifu",
    subtitle: "Chat dengan karakter waifu",
    description:
      "Roleplay dengan karakter anime favoritmu! Pilih dari preset Hu Tao, Nahida, Ai Hoshino, Zero Two, Marin, Shinobu — atau buat custom.",
    icon: "heart" as const,
    color: "#14b8a6",
    details: [
      "6 preset karakter anime",
      "Custom character support",
      "Gratis tanpa login",
      "Chat history di browser",
      "Markdown formatting",
    ],
  },
  {
    id: "imagen",
    title: "AI Image Generator",
    subtitle: "Generate gambar dari teks",
    description:
      "Buat gambar dari deskripsi teks menggunakan AI. Cukup ketik prompt dan dapatkan gambar instan. Gratis tanpa login.",
    icon: "image" as const,
    color: "#e11d48",
    details: [
      "Text to image AI",
      "Instant generation",
      "Gratis tanpa login",
      "Download hasil",
      "Unlimited requests",
    ],
  },
];

const routeMap: Record<string, string> = {
  cdn: "/cdn",
  shorturl: "/short",
  ttdl: "/ttdl",
  igdl: "/igdl",
  fbdl: "/fbdl",
  chat: "/chat",
  waifu: "/ai-waifu",
  imagen: "/imagen",
};

export default function HomePage() {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!sliderRef.current) return;
    const amount = 320;
    sliderRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-20">
        <div className="absolute inset-0 bg-dots opacity-[0.03]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 neo-btn px-4 py-1.5 bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 text-sm font-mono mb-6">
              <Zap className="size-4" />
              Open Source &middot; Free Forever
            </div>
            <h1 className="text-4xl sm:text-5xl font-mono font-bold tracking-tight mb-4">
              {siteConfig.siteName}
            </h1>
            <p className="text-base sm:text-lg font-mono max-w-xl mx-auto mb-6" style={{ color: "var(--neo-muted-text)" }}>
              {siteConfig.tagline}. Host files, shorten URLs, download social media, chat with AI — all in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Features Slider */}
      <section className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-mono font-bold mb-1">Fitur Lengkap</h2>
              <p className="font-mono text-xs sm:text-sm" style={{ color: "var(--neo-muted-text)" }}>
                Geser untuk lihat semua fitur
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                className="neo-btn p-2 bg-[var(--neo-card-bg)] hover:opacity-80"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="neo-btn p-2 bg-[var(--neo-card-bg)] hover:opacity-80"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal scrollable slider — constrained to content width */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "thin" }}
        >
          {features.map((feature, i) => {
            const Icon = iconMap[feature.icon];
            return (
              <div
                key={feature.id}
                className="neo-card p-5 sm:p-6 min-w-[280px] sm:min-w-[300px] max-w-[320px] snap-start shrink-0"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="neo-border rounded-lg p-2 shrink-0" style={{ backgroundColor: `${feature.color}15` }}>
                    <Icon className="size-4" style={{ color: feature.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-mono font-bold text-sm mb-0.5">{feature.title}</h3>
                    <p className="font-mono text-[11px]" style={{ color: "var(--neo-muted-text)" }}>{feature.subtitle}</p>
                  </div>
                </div>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: "var(--neo-muted-text)" }}>{feature.description}</p>
                <Link
                  href={routeMap[feature.id] || "/"}
                  className="neo-btn w-full text-center px-3 py-2 font-mono font-medium text-xs flex items-center justify-center gap-2 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_var(--neo-shadow-color)] transition-all duration-200"
                  style={{ backgroundColor: `${feature.color}15`, color: feature.color, borderColor: feature.color }}
                >
                  Buka {feature.title}
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            );
          })}
        </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <Cloud className="size-5" />, label: "Free CDN", desc: "No cost hosting" },
              { icon: <Zap className="size-5" />, label: "Instant", desc: "Sub-second uploads" },
              { icon: <Shield className="size-5" />, label: "Secure", desc: "GitHub-backed" },
              { icon: <Globe className="size-5" />, label: "8 Tools", desc: "All in one app" },
            ].map((stat) => (
              <div key={stat.label} className="neo-card p-4 text-center animate-slide-up">
                <div className="flex justify-center mb-2 text-orange-500">{stat.icon}</div>
                <div className="font-mono font-bold text-sm">{stat.label}</div>
                <div className="font-mono text-xs" style={{ color: "var(--neo-muted-text)" }}>{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-8 sm:py-12" style={{ backgroundColor: "var(--neo-card-bg)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-mono font-bold mb-2">Cara Kerja</h2>
            <p className="font-mono text-xs sm:text-sm" style={{ color: "var(--neo-muted-text)" }}>Sederhana, cepat, dan gratis</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { step: "01", title: "Upload / Input", desc: "Drag file untuk CDN, masukkan URL, atau chat dengan AI", icon: <MousePointerClick className="size-6" /> },
              { step: "02", title: "Proses Otomatis", desc: "File ke GitHub, URL ke Gist, media diproses, AI merespons", icon: <Server className="size-6" /> },
              { step: "03", title: "Hasil Instan!", desc: "Dapatkan URL, download media, atau baca respons AI", icon: <Globe className="size-6" /> },
            ].map((item) => (
              <div key={item.step} className="neo-card p-5 sm:p-6 text-center">
                <div className="text-orange-500 flex justify-center mb-3">{item.icon}</div>
                <div className="font-mono font-bold text-xs text-orange-500 mb-1">STEP {item.step}</div>
                <h3 className="font-mono font-bold text-base mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--neo-muted-text)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8" style={{ borderTop: "2px solid var(--neo-border-color)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-sm" style={{ color: "var(--neo-muted-text)" }}>
            <Zap className="size-4 text-orange-500" />
            <span>{siteConfig.siteName} by {siteConfig.authorName}</span>
          </div>
          <a href={siteConfig.githubUrl} target="_blank" rel="noopener noreferrer" className="neo-btn bg-[var(--neo-card-bg)] px-4 py-1.5 font-mono text-sm flex items-center gap-2">
            <Github className="size-4" /> GitHub <ExternalLink className="size-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}
