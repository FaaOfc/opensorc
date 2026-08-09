"use client";

import Link from "next/link";
import {
  UploadCloud,
  Link as LinkIcon,
  Github,
  Palette,
  ArrowRight,
  ChevronRight,
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
} from "lucide-react";
import { siteConfig } from "@/lib/config";

const iconMap = {
  "upload-cloud": UploadCloud,
  link: LinkIcon,
  github: Github,
  palette: Palette,
  message: MessageSquare,
};

const features = [
  {
    id: "cdn",
    title: "CDN Hosting - Maintenance",
    subtitle: "Host any file, any mimetype",
    description:
      "Upload images, videos, documents, executables — anything. Your files are stored on Database and served through your own domain with proper MIME types.",
    icon: "upload-cloud" as const,
    color: "#f97316",
    details: [
      "Supports all MIME types",
      "Drag & drop file upload",
      "Random 4-char filenames",
      "24/7 Access to database",
      "Proxied through your domain",
    ],
  },
  {
    id: "shorturl",
    title: "URL Shortener - Maintenance",
    subtitle: "Shorten any URL instantly",
    description:
      "Transform long URLs into short, shareable links. Optionally customize your short codes. All mappings stored in a Private Database.",
    icon: "link" as const,
    color: "#10b981",
    details: [
      "Custom short codes (optional)",
      "Random code generation",
      "Self Hosted Database",
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
    id: "chat",
    title: "AI Chat - Maintenance",
    subtitle: "Chat dengan AI assistant",
    description:
      "Chat dengan AI menggunakan Gemini atau OpenRouter. Butuh login untuk menyimpan riwayat chat. Mendukung multiple sessions.",
    icon: "message" as const,
    color: "#7c3aed",
    details: [
      "Gemini / OpenRouter models",
      "Chat history tersimpan",
      "Multiple sessions",
      "Markdown formatting",
      "Login dengan akun",
    ],
  },
];

const routeMap: Record<string, string> = {
  cdn: "/cdn",
  shorturl: "/short",
  ttdl: "/ttdl",
  igdl: "/igdl",
  chat: "/chat",
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 bg-dots opacity-[0.03]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 neo-btn px-4 py-1.5 bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400 text-sm font-mono mb-6">
              <Zap className="size-4" />
              Open Source &middot; Free Forever
            </div>
            <h1 className="text-4xl sm:text-6xl font-mono font-bold tracking-tight mb-4">
              {siteConfig.siteName}
            </h1>
            <p className="text-lg sm:text-xl font-mono max-w-2xl mx-auto mb-8" style={{ color: "var(--neo-muted-text)" }}>
              {siteConfig.tagline}. Host files, shorten URLs, download social
              media, chat with AI — all in one place.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/cdn" className="neo-btn bg-[var(--neo-border-color)] text-[var(--neo-card-bg)] px-5 py-2.5 font-mono font-medium text-sm flex items-center gap-2">
                <UploadCloud className="size-4" /> CDN
              </Link>
              <Link href="/short" className="neo-btn bg-[var(--neo-card-bg)] px-5 py-2.5 font-mono font-medium text-sm flex items-center gap-2">
                <LinkIcon className="size-4" /> ShortURL
              </Link>
              <Link href="/ttdl" className="neo-btn bg-[var(--neo-card-bg)] px-5 py-2.5 font-mono font-medium text-sm flex items-center gap-2" style={{ color: "#0d9488" }}>
                <Music2 className="size-4" /> TikTok
              </Link>
              <Link href="/igdl" className="neo-btn bg-[var(--neo-card-bg)] px-5 py-2.5 font-mono font-medium text-sm flex items-center gap-2" style={{ color: "#be123c" }}>
                <Camera className="size-4" /> Instagram
              </Link>
              <Link href="/chat" className="neo-btn bg-[var(--neo-card-bg)] px-5 py-2.5 font-mono font-medium text-sm flex items-center gap-2" style={{ color: "#7c3aed" }}>
                <MessageSquare className="size-4" /> AI Chat
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: <Cloud className="size-5" />, label: "Free CDN", desc: "No cost hosting" },
              { icon: <Zap className="size-5" />, label: "Instant", desc: "Sub-second uploads" },
              { icon: <Shield className="size-5" />, label: "Secure", desc: "GitHub-backed" },
              { icon: <Globe className="size-5" />, label: "5 Tools", desc: "All in one app" },
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

      {/* Features Section */}
      <section className="py-12 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-mono font-bold mb-2">Fitur Lengkap</h2>
            <p className="font-mono text-sm sm:text-base" style={{ color: "var(--neo-muted-text)" }}>
              Semua yang kamu butuhkan, tanpa biaya
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((feature, i) => {
              const Icon = iconMap[feature.icon];
              return (
                <div
                  key={feature.id}
                  className={`neo-card p-5 sm:p-6 animate-slide-up-delay-${Math.min(i, 3)}`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="neo-border rounded-lg p-2.5 shrink-0" style={{ backgroundColor: `${feature.color}15` }}>
                      <Icon className="size-5" style={{ color: feature.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-mono font-bold text-base mb-0.5">{feature.title}</h3>
                      <p className="font-mono text-xs" style={{ color: "var(--neo-muted-text)" }}>{feature.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm mb-3 leading-relaxed" style={{ color: "var(--neo-muted-text)" }}>{feature.description}</p>
                  <ul className="space-y-1.5 mb-5">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-center gap-2 text-xs font-mono" style={{ color: "var(--neo-muted-text)" }}>
                        <ChevronRight className="size-3 shrink-0" style={{ color: feature.color }} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={routeMap[feature.id] || "/"}
                    className="neo-btn w-full text-center px-4 py-2 font-mono font-medium text-sm flex items-center justify-center gap-2 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_var(--neo-shadow-color)] transition-all duration-200"
                    style={{ backgroundColor: `${feature.color}15`, color: feature.color, borderColor: feature.color }}
                  >
                    Buka {feature.title}
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-20" style={{ backgroundColor: "var(--neo-card-bg)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-mono font-bold mb-2">Cara Kerja</h2>
            <p className="font-mono text-sm sm:text-base" style={{ color: "var(--neo-muted-text)" }}>Sederhana, cepat, dan gratis</p>
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
