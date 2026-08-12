"use client";

import { useState } from "react";
import { Monitor, Download, Loader2, AlertCircle } from "lucide-react";

export default function FbDlPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ video_sd: string | null; video_hd: string | null } | null>(null);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const res = await fetch("/api/fbdl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch {
      setError("Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center neo-border rounded-xl p-4 bg-blue-50 dark:bg-blue-950 mb-4">
          <Monitor className="size-8 text-blue-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-mono font-bold mb-2">
          Facebook Downloader
        </h1>
        <p className="font-mono text-sm" style={{ color: "var(--neo-muted-text)" }}>
          Download video Facebook dalam kualitas SD atau HD
        </p>
      </div>

      {/* Input */}
      <div className="neo-card p-5 mb-6">
        <label className="font-mono font-bold text-xs block mb-2">
          URL Video Facebook
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.facebook.com/share/v/..."
            disabled={loading}
            className="neo-border rounded-lg flex-1 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-[var(--neo-card-bg)]"
          />
          <button
            onClick={handleDownload}
            disabled={!url.trim() || loading}
            className={`neo-btn px-4 py-2 font-mono font-medium text-sm flex items-center gap-2 shrink-0 ${
              !url.trim() || loading
                ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed shadow-none"
                : "bg-blue-600 text-white"
            }`}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Download className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="neo-card p-4 mb-6 border-red-500 bg-red-50 dark:bg-red-950">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-mono text-sm">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="neo-card p-5">
          <h3 className="font-mono font-bold text-sm mb-4">Hasil Download</h3>
          <div className="grid grid-cols-2 gap-3">
            {/* SD Button */}
            <a
              href={result.video_sd || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className={`neo-btn px-4 py-3 font-mono font-medium text-sm flex items-center justify-center gap-2 ${
                result.video_sd
                  ? "bg-blue-600 text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_var(--neo-shadow-color)] transition-all"
                  : "bg-gray-100 dark:bg-gray-800 cursor-not-allowed shadow-none text-gray-400"
              }`}
            >
              <Download className="size-4" />
              SD Quality
            </a>

            {/* HD Button */}
            <a
              href={result.video_hd || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className={`neo-btn px-4 py-3 font-mono font-medium text-sm flex items-center justify-center gap-2 ${
                result.video_hd
                  ? "bg-[var(--neo-border-color)] text-[var(--neo-card-bg)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_var(--neo-shadow-color)] transition-all"
                  : "bg-gray-100 dark:bg-gray-800 cursor-not-allowed shadow-none text-gray-400"
              }`}
            >
              <Download className="size-4" />
              HD Quality
            </a>
          </div>
          {!result.video_sd && !result.video_hd && (
            <p className="font-mono text-xs text-center mt-3" style={{ color: "var(--neo-muted-text)" }}>
              Tidak ada video tersedia untuk URL ini.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
