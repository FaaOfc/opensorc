"use client";

import { useState, useCallback } from "react";
import { Link, Loader2, Copy, Check } from "lucide-react";

export default function ShorturlPage() {
  const [longUrl, setLongUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShorten = useCallback(async () => {
    if (!longUrl.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          longUrl: longUrl.trim(),
          customCode: customCode.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Shorten gagal");
        return;
      }

      setResult(data.url);
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  }, [longUrl, customCode]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [result]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-start justify-center py-8 sm:py-16 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center neo-border rounded-xl p-3 bg-emerald-50 dark:bg-emerald-950 mb-4">
            <Link className="size-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold mb-1">
            URL Shortener
          </h1>
          <p className="text-sm text-gray-600 font-mono">
            Pendekkan URL panjang jadi link singkat
          </p>
        </div>

        {/* Card */}
        <div className="neo-card p-5 sm:p-6">
          <p className="text-sm text-gray-600 mb-4 font-mono">
            Enter a long URL to make it short. Custom code is optional.
          </p>

          {/* Long URL Input */}
          <div className="mb-3">
            <label className="font-mono text-xs font-bold text-gray-700 mb-1 block">
              Long URL
            </label>
            <input
              type="url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="https://example.com/very/long/url..."
              className="neo-border rounded-md w-full px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          {/* Custom Code Input */}
          <div className="mb-4">
            <label className="font-mono text-xs font-bold text-gray-700 mb-1 block">
              Custom Code{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="my-custom-code"
              className="neo-border rounded-md w-full px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          {/* Shorten Button */}
          <button
            onClick={handleShorten}
            disabled={!longUrl.trim() || loading}
            className={`neo-btn w-full py-2.5 font-mono font-medium text-sm flex items-center justify-center gap-2 mb-4 ${
              !longUrl.trim() || loading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-[#18181b] text-white hover:bg-gray-800"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Shortening...
              </>
            ) : (
              <>
                <Link className="size-4" />
                Shorten URL
              </>
            )}
          </button>

          {/* Result */}
          {result && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border-2 border-green-200 rounded-lg animate-slide-up">
              <Link className="size-4 text-green-600 shrink-0" />
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-green-700 underline truncate flex-1 min-w-0"
              >
                {result}
              </a>
              <button
                onClick={handleCopy}
                className="neo-btn p-1.5 bg-white shrink-0"
                title="Copy URL"
              >
                {copied ? (
                  <Check className="size-3.5 text-green-600" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg animate-slide-up">
              <p className="font-mono text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 neo-card p-4">
          <h3 className="font-mono font-bold text-sm mb-2">
            Cara Kerja ShortURL
          </h3>
          <ol className="space-y-1.5 text-xs font-mono text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">1.</span>
              URL mapping disimpan di GitHub Gist sebagai JSON
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">2.</span>
              Kode random 4 karakter di-generate (atau pakai custom code)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">3.</span>
              Saat diakses, server me-redirect (302) ke URL asli
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
