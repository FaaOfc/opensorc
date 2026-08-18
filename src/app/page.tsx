"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
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

  MousePointerClick,
  Server,
  Heart,
  Monitor,
  ImageIcon,
  Languages,
  ImageDown,
  ZoomIn,
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
  languages: Languages,
  imagedown: ImageDown,
  zoomin: ZoomIn,
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
  },
  {
    id: "shorturl",
    title: "URL Shortener",
    subtitle: "Shorten any URL instantly",
    description:
      "Transform long URLs into short, shareable links. Optionally customize your short codes. All mappings stored in a GitHub Gist — zero cost.",
    icon: "link" as const,
    color: "#10b981",
  },
  {
    id: "ttdl",
    title: "TikTok Downloader",
    subtitle: "Download video tanpa watermark",
    description:
      "Unduh video TikTok tanpa watermark dalam kualitas HD. Juga mendukung download audio MP3 dan photo slide carousel.",
    icon: "upload-cloud" as const,
    color: "#0d9488",
  },
  {
    id: "igdl",
    title: "Instagram Downloader",
    subtitle: "Download Reels & Post",
    description:
      "Unduh Reels, video post, foto single & multiple carousel dari Instagram. Cukup paste URL dan langsung download.",
    icon: "upload-cloud" as const,
    color: "#be123c",
  },
  {
    id: "fbdl",
    title: "Facebook Downloader",
    subtitle: "Download Video SD & HD",
    description:
      "Unduh video Facebook dengan pilihan kualitas SD atau HD. Cukup paste URL video Facebook dan langsung download.",
    icon: "monitor" as const,
    color: "#2563eb",
  },
  {
    id: "chat",
    title: "AI Chat",
    subtitle: "Chat gratis tanpa login",
    description:
      "Chat dengan AI gratis tanpa perlu akun. 24 model premium — GPT-5.5, Claude Opus 4.8, Gemini 3.1 Pro, Grok 4.1, dan lainnya.",
    icon: "message" as const,
    color: "#7c3aed",
  },
  {
    id: "waifu",
    title: "AI Waifu",
    subtitle: "Chat dengan karakter waifu",
    description:
      "Roleplay dengan karakter anime favoritmu! Pilih dari preset Hu Tao, Nahida, Ai Hoshino, Zero Two, Marin, Shinobu — atau buat custom.",
    icon: "heart" as const,
    color: "#14b8a6",
  },
  {
    id: "imagen",
    title: "AI Image Generator",
    subtitle: "Generate gambar dari teks",
    description:
      "Buat gambar dari deskripsi teks menggunakan AI. Cukup ketik prompt dan dapatkan gambar instan. Gratis tanpa login.",
    icon: "image" as const,
    color: "#e11d48",
  },
  {
    id: "translate",
    title: "AI Translator",
    subtitle: "Terjemahkan teks instan",
    description:
      "Terjemahkan teks ke 30+ bahasa secara instan menggunakan AI. Support deteksi bahasa otomatis dan swap bahasa satu klik.",
    icon: "languages" as const,
    color: "#2563eb",
  },
  {
    id: "compress",
    title: "Image Compressor",
    subtitle: "Kompres & resize gambar",
    description:
      "Kurangi ukuran file gambar tanpa hilang kualitas. Atur kualitas, dimensi, dan format output — PNG, JPG, atau WebP.",
    icon: "imagedown" as const,
    color: "#059669",
  },
  {
    id: "upscaler",
    title: "Image Upscaler",
    subtitle: "Perbesar resolusi gambar",
    description:
      "Upscale gambar hingga 4x resolusi dengan kualitas tinggi. Pilih 2x atau 4x, compare before/after, dan download hasilnya.",
    icon: "zoomin" as const,
    color: "#0284c7",
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
  translate: "/translate",
  compress: "/compress",
  upscaler: "/upscaler",
};

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = features.length;

  // Smooth fade transition when changing slides
  const goToSlide = useCallback(
    (index: number) => {
      if (index === displayIndex || isTransitioning) return;
      setIsTransitioning(true);
      // Fade out, then swap content, then fade in
      setTimeout(() => {
        setDisplayIndex(index);
        setActiveIndex(index);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300);
    },
    [displayIndex, isTransitioning]
  );

  const goNext = useCallback(() => {
    goToSlide((displayIndex + 1) % total);
  }, [displayIndex, total, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide((displayIndex - 1 + total) % total);
  }, [displayIndex, total, goToSlide]);

  // Auto-play every 10 seconds
  useEffect(() => {
    if (isPaused) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }
    autoPlayRef.current = setInterval(() => {
      goNext();
    }, 10000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, goNext]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    const threshold = 50;
    if (touchDeltaX.current < -threshold) {
      goNext();
    } else if (touchDeltaX.current > threshold) {
      goPrev();
    }
    // Resume auto-play after 5s of no interaction
    setTimeout(() => setIsPaused(false), 5000);
  };

  // Pause auto-play on button click, resume after 5s
  const handleManualNav = (fn: () => void) => {
    setIsPaused(true);
    fn();
    setTimeout(() => setIsPaused(false), 5000);
  };

  const currentFeature = features[displayIndex];
  const CurrentIcon = iconMap[currentFeature.icon];

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

      {/* Features Carousel */}
      <section className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-mono font-bold mb-1">Fitur Lengkap</h2>
              <p className="font-mono text-xs sm:text-sm" style={{ color: "var(--neo-muted-text)" }}>
                {displayIndex + 1} / {total} — Geser atau klik untuk pindah
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleManualNav(goPrev)}
                className="neo-btn p-2 bg-[var(--neo-card-bg)] hover:opacity-80"
                aria-label="Previous"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={() => handleManualNav(goNext)}
                className="neo-btn p-2 bg-[var(--neo-card-bg)] hover:opacity-80"
                aria-label="Next"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Carousel Card — centered, with fade transition */}
          <div
            className="relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="transition-opacity duration-300 ease-in-out"
              style={{ opacity: isTransitioning ? 0 : 1 }}
            >
              <div className="neo-card p-6 sm:p-8 max-w-md mx-auto text-center">
                {/* Icon */}
                <div
                  className="neo-border rounded-xl p-3 mx-auto mb-4 w-fit"
                  style={{ backgroundColor: `${currentFeature.color}15` }}
                >
                  <CurrentIcon className="size-6" style={{ color: currentFeature.color }} />
                </div>
                {/* Title */}
                <h3 className="font-mono font-bold text-lg mb-1">{currentFeature.title}</h3>
                <p className="font-mono text-xs mb-3" style={{ color: "var(--neo-muted-text)" }}>
                  {currentFeature.subtitle}
                </p>
                {/* Description */}
                <p className="text-sm mb-5 leading-relaxed" style={{ color: "var(--neo-muted-text)" }}>
                  {currentFeature.description}
                </p>
                {/* CTA Button — centered */}
                <Link
                  href={routeMap[currentFeature.id] || "/"}
                  className="neo-btn inline-flex items-center justify-center gap-2 px-5 py-2.5 font-mono font-medium text-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_var(--neo-shadow-color)] transition-all duration-200"
                  style={{
                    backgroundColor: `${currentFeature.color}15`,
                    color: currentFeature.color,
                    borderColor: currentFeature.color,
                  }}
                >
                  Buka {currentFeature.title}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-5">
            {features.map((f, i) => (
              <button
                key={f.id}
                onClick={() => handleManualNav(() => goToSlide(i))}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === activeIndex ? 24 : 8,
                  height: 8,
                  backgroundColor: i === activeIndex ? f.color : "var(--neo-border-color)",
                  opacity: i === activeIndex ? 1 : 0.3,
                }}
                aria-label={`Go to ${f.title}`}
              />
            ))}
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
              { icon: <Globe className="size-5" />, label: "11 Tools", desc: "All in one app" },
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

    </div>
  );
}
