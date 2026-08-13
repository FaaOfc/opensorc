"use client";

import { useState, useCallback } from "react";
import {
  Music2,
  Loader2,
  Download,
  Video,
  Film,
  Music,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Images,
  CheckCircle,
} from "lucide-react";

interface TtResult {
  author: {
    avatar: string;
    nickname: string;
    unique_id: string;
  };
  title: string;
  play_count: number;
  digg_count: number;
  comment_count: number;
  share_count: number;
  images?: string[];
  cover?: string;
  origin_cover?: string;
  hdplay?: string;
  play?: string;
  wmplay?: string;
  music?: string;
  music_info?: { play: string };
}

// Direct image download with custom filename
async function downloadImage(url: string, platform: string, index: number) {
  const shortId = Math.random().toString(36).slice(2, 7);
  const filename = `taositw${platform}_photo_${index + 1}_${shortId}.jpg`;

  try {
    // Try fetch → blob (works for CORS-friendly CDN URLs)
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    try {
      // Fallback: canvas trick (bypass some CORS restrictions)
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      canvas.toBlob(
        (b) => {
          if (!b) return;
          const blobUrl = URL.createObjectURL(b);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(blobUrl);
        },
        "image/jpeg",
        0.95
      );
    } catch {
      // Final fallback: open in new tab
      window.open(url, "_blank");
    }
  }
}

function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(num);
}

export default function TtdlPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TtResult | null>(null);
  const carouselRef = useCallback((node: HTMLDivElement | null) => {
    if (node) node.scrollLeft = 0;
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!url.trim()) return;

      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const res = await fetch(
          `/api/ttdl?url=${encodeURIComponent(url.trim())}`
        );
        const json = await res.json();

        if (json.status && json.result?.data) {
          setResult(json.result.data);
        } else {
          throw new Error(json.message || "Gagal mengambil data TikTok.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Terjadi kesalahan."
        );
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  const mp3Url = result
    ? result.music || result.music_info?.play || "#"
    : "#";
  const isImageMode = result && result.images && result.images.length > 0;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-start justify-center py-8 sm:py-16 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center neo-border rounded-xl p-3 bg-teal-50 dark:bg-teal-950 mb-4">
            <Music2 className="size-8 text-teal-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold mb-1">
            TikTok Downloader
          </h1>
          <p className="text-sm text-gray-600 font-mono">
            Unduh Video tanpa Watermark atau Slide Foto beserta MP3
          </p>
        </div>

        {/* Input Card */}
        <div className="neo-card p-3 sm:p-4 mb-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Music2 className="size-4" />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://vt.tiktok.com/..."
                required
                className="neo-border rounded-lg w-full pl-10 pr-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="neo-btn bg-[#18181b] text-white px-5 py-2.5 font-mono font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-800 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="size-4" />
                  Process
                </>
              )}
            </button>
          </form>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-3 my-8">
            <div className="w-9 h-9 border-4 border-gray-200 border-t-[#18181b] rounded-full animate-spin" />
            <p className="text-sm font-mono text-gray-500 animate-pulse">
              Mengambil data dari server...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl text-center font-mono text-sm text-red-700 mb-6">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="neo-card p-5 sm:p-6 overflow-hidden">
            {/* Author Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-gray-200 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={result.author?.avatar || ""}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover neo-border"
                />
                <div className="overflow-hidden">
                  <h3 className="font-mono font-bold text-base truncate">
                    {result.author?.nickname || "User"}
                  </h3>
                  <p className="font-mono text-xs text-gray-500 truncate">
                    @{result.author?.unique_id || "user"}
                  </p>
                </div>
              </div>
              <span className="self-start sm:self-auto text-xs px-3 py-1 rounded-full font-mono font-bold neo-border bg-gray-50">
                {isImageMode
                  ? `Slide (${result.images!.length} Foto)`
                  : "Video MP4"}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 mb-4">
              {result.title || "Tanpa deskripsi"}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-gray-50 p-3 rounded-xl text-center neo-border mb-4">
              <div>
                <p className="text-[10px] uppercase font-mono text-gray-500 flex items-center justify-center gap-1">
                  <Eye className="size-3" /> Views
                </p>
                <p className="text-sm font-mono font-bold mt-0.5">
                  {formatNumber(result.play_count)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono text-gray-500 flex items-center justify-center gap-1">
                  <Heart className="size-3" /> Likes
                </p>
                <p className="text-sm font-mono font-bold mt-0.5">
                  {formatNumber(result.digg_count)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono text-gray-500 flex items-center justify-center gap-1">
                  <MessageCircle className="size-3" /> Comments
                </p>
                <p className="text-sm font-mono font-bold mt-0.5">
                  {formatNumber(result.comment_count)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-mono text-gray-500 flex items-center justify-center gap-1">
                  <Share2 className="size-3" /> Shares
                </p>
                <p className="text-sm font-mono font-bold mt-0.5">
                  {formatNumber(result.share_count)}
                </p>
              </div>
            </div>

            {/* Video Mode */}
            {!isImageMode && (
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-48 flex-shrink-0">
                  <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-gray-100 neo-border group">
                    <img
                      src={result.cover || result.origin_cover || ""}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Video className="size-10 text-white" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center space-y-2.5">
                  <a
                    href={result.hdplay || result.play || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neo-btn bg-[#18181b] text-white py-3 px-4 font-mono font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800"
                  >
                    <Video className="size-4" />
                    Download MP4 (No WM)
                  </a>
                  <a
                    href={result.wmplay || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neo-btn bg-white py-2.5 px-4 font-mono font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-50"
                  >
                    <Film className="size-4" />
                    Download MP4 (With WM)
                  </a>
                  <a
                    href={mp3Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neo-btn bg-white py-2.5 px-4 font-mono font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-50"
                  >
                    <Music className="size-4" />
                    Download Audio (MP3)
                  </a>
                </div>
              </div>
            )}

            {/* Image Slide Mode */}
            {isImageMode && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono font-bold text-sm flex items-center gap-2">
                    <Images className="size-4" /> Gallery Slide
                  </h4>
                  <a
                    href={mp3Url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neo-btn bg-[#18181b] text-white py-1.5 px-3 font-mono font-bold text-xs flex items-center gap-2 hover:bg-gray-800"
                  >
                    <Music className="size-3" /> Download MP3
                  </a>
                </div>
                <div className="relative group">
                  <button
                    onClick={() =>
                      document
                        .getElementById("tt-carousel")
                        ?.scrollBy({ left: -240, behavior: "smooth" })
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center neo-btn border-black"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <div
                    id="tt-carousel"
                    ref={carouselRef}
                    className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {result.images!.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="flex-none w-[200px] snap-start neo-card overflow-hidden flex flex-col"
                      >
                        <div className="relative aspect-[3/4] bg-black">
                          <img
                            src={imgUrl}
                            alt={`Slide ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                            #{idx + 1}
                          </span>
                        </div>
                        <div className="p-2 mt-auto">
                          <button
                            onClick={() => downloadImage(imgUrl, "ttdl", idx)}
                            className="neo-btn bg-[#18181b] text-white py-2 w-full font-mono font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-gray-800"
                          >
                            <Download className="size-3" /> Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      document
                        .getElementById("tt-carousel")
                        ?.scrollBy({ left: 240, behavior: "smooth" })
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center neo-btn border-black"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
