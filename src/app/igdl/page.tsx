"use client";

import { useState, useCallback } from "react";
import {
  Camera,
  Loader2,
  Download,
  Video,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Layers,
} from "lucide-react";

// Direct image download with custom filename
async function downloadImage(url: string, platform: string, index: number) {
  const shortId = Math.random().toString(36).slice(2, 7);
  const filename = `taosite_${platform}_photo_${index}_${shortId}.jpg`;

  try {
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
      window.open(url, "_blank");
    }
  }
}

interface IgMedia {
  video?: { video: string; thumbnail: string }[];
  image?: string[];
}

function extractMedia(result: IgMedia): {
  type: "video" | "image";
  url: string;
  thumbnail?: string;
  index: number;
}[] {
  const items: {
    type: "video" | "image";
    url: string;
    thumbnail?: string;
    index: number;
  }[] = [];
  let idx = 1;

  if (result.video) {
    for (const v of result.video) {
      items.push({
        type: "video",
        url: v.video,
        thumbnail: v.thumbnail,
        index: idx++,
      });
    }
  }

  if (result.image) {
    for (const imgUrl of result.image) {
      items.push({ type: "image", url: imgUrl, index: idx++ });
    }
  }

  return items;
}

export default function IgdlPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaItems, setMediaItems] = useState<
    {
      type: "video" | "image";
      url: string;
      thumbnail?: string;
      index: number;
    }[]
  >([]);
  const [isSingle, setIsSingle] = useState(false);
  const [singleVideo, setSingleVideo] = useState<{
    video: string;
    thumbnail: string;
  } | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!url.trim()) return;

      setLoading(true);
      setError(null);
      setMediaItems([]);
      setIsSingle(false);
      setSingleVideo(null);

      try {
        const res = await fetch(
          `/api/igdl?url=${encodeURIComponent(url.trim())}`
        );
        const json = await res.json();

        if (json.status && json.result) {
          const videos = json.result.video || [];
          const images = json.result.image || [];
          const totalCount = videos.length + images.length;

          if (totalCount === 0) {
            throw new Error("Media tidak ditemukan.");
          }

          // Single video (reel)
          if (videos.length === 1 && images.length === 0) {
            setIsSingle(true);
            setSingleVideo(videos[0]);
          } else {
            // Carousel
            const items = extractMedia(json.result);
            setMediaItems(items);
          }
        } else {
          throw new Error(json.message || "Gagal mengambil data Instagram.");
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

  const hasResult = isSingle || mediaItems.length > 0;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-start justify-center py-8 sm:py-16 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center neo-border rounded-xl p-3 bg-rose-50 dark:bg-rose-950 mb-4">
            <Camera className="size-8 text-rose-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold mb-1">
            Instagram Downloader
          </h1>
          <p className="text-sm text-gray-600 font-mono">
            Unduh Reels, Post Video, Foto, atau Carousel Instagram
          </p>
        </div>

        {/* Input Card */}
        <div className="neo-card p-3 sm:p-4 mb-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Camera className="size-4" />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.instagram.com/reel/..."
                required
                className="neo-border rounded-lg w-full pl-10 pr-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
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

        {/* Single Video Result */}
        {isSingle && singleVideo && (
          <div className="neo-card p-5 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b-2 border-gray-200 mb-4">
              <div className="flex items-center gap-2">
                <Camera className="size-5 text-rose-600" />
                <span className="font-mono font-bold text-sm">
                  Hasil Pencarian
                </span>
              </div>
              <span className="text-xs px-3 py-1 rounded-full font-mono font-bold neo-border bg-gray-50">
                Video / Reel
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-48 flex-shrink-0">
                <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-gray-100 neo-border group">
                  <img
                    src={singleVideo.thumbnail || singleVideo.video}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Video className="size-10 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center space-y-3">
                <h4 className="font-mono font-bold text-base">
                  Video Instagram / Reel
                </h4>
                <p className="text-xs font-mono text-gray-500">
                  Klik tombol di bawah ini untuk mengunduh video .mp4.
                </p>
                <a
                  href={singleVideo.video}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-btn bg-[#18181b] text-white py-3 px-4 font-mono font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800"
                >
                  <Download className="size-4" />
                  Download MP4 Video
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Carousel Result */}
        {mediaItems.length > 0 && (
          <div className="neo-card p-5 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b-2 border-gray-200 mb-4">
              <div className="flex items-center gap-2">
                <Camera className="size-5 text-rose-600" />
                <span className="font-mono font-bold text-sm">
                  Hasil Pencarian
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full font-mono font-bold neo-border bg-gray-50">
                  {mediaItems.length} Media
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h4 className="font-mono font-bold text-sm flex items-center gap-2">
                  <Layers className="size-4" /> Daftar Media (Carousel)
                </h4>
                <span className="text-xs font-mono text-gray-500">
                  Total: {mediaItems.length} File
                </span>
              </div>
              <div className="relative group">
                <button
                  onClick={() =>
                    document
                      .getElementById("ig-carousel")
                      ?.scrollBy({ left: -240, behavior: "smooth" })
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center neo-btn border-black"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <div
                  id="ig-carousel"
                  className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth py-2"
                  style={{ scrollbarWidth: "none" }}
                >
                  {mediaItems.map((item) => (
                    <div
                      key={item.index}
                      className="flex-none w-[200px] snap-start neo-card overflow-hidden flex flex-col"
                    >
                      <div className="relative aspect-[3/4] bg-black">
                        <img
                          src={item.thumbnail || item.url}
                          alt={`Media ${item.index}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                          #{item.index} {item.type === "video" ? "VIDEO" : "FOTO"}
                        </span>
                        {item.type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Video className="size-8 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="p-2 mt-auto">
                        {item.type === "image" ? (
                          <button
                            onClick={() => downloadImage(item.url, "igdl", item.index)}
                            className="neo-btn bg-[#18181b] text-white py-2 w-full font-mono font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-gray-800"
                          >
                            <ImageIcon className="size-3" /> Download Foto
                          </button>
                        ) : (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="neo-btn bg-[#18181b] text-white py-2 font-mono font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-gray-800"
                          >
                            <Video className="size-3" /> Download MP4
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() =>
                    document
                      .getElementById("ig-carousel")
                      ?.scrollBy({ left: 240, behavior: "smooth" })
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/80 text-white flex items-center justify-center neo-btn border-black"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
