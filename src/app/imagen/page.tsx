"use client";

import { useState, useEffect } from "react";
import { ImageIcon, Loader2, Download, AlertCircle, Sparkles, Timer } from "lucide-react";

const COOLDOWN_SECONDS = 10;

export default function ImagenPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleGenerate = async () => {
    if (!prompt.trim() || cooldown > 0) return;
    setLoading(true);
    setImage(null);
    setError("");
    let success = false;

    try {
      const res = await fetch("/api/imagen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else if (data.image) {
        setImage(data.image);
        success = true;
      }
    } catch {
      setError("Gagal menghubungi server.");
    } finally {
      setLoading(false);
      if (success) setCooldown(COOLDOWN_SECONDS);
    }
  };

  const handleDownload = () => {
    if (!image) return;
    const a = document.createElement("a");
    a.href = image;
    a.download = `nefu-imagen-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center neo-border rounded-xl p-4 bg-rose-50 dark:bg-rose-950 mb-4">
          <ImageIcon className="size-8 text-rose-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-mono font-bold mb-2">
          AI Image Generator
        </h1>
        <p className="font-mono text-sm" style={{ color: "var(--neo-muted-text)" }}>
          Buat gambar dari deskripsi teks menggunakan AI
        </p>
      </div>

      {/* Input */}
      <div className="neo-card p-5 mb-6">
        <label className="font-mono font-bold text-xs block mb-2">
          Deskripsi Gambar (Prompt)
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Contoh: hutao from genshin impact, anime style, cherry blossoms background"
          disabled={loading}
          className="neo-border rounded-lg w-full px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-[var(--neo-card-bg)] resize-none h-24"
        />
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || loading || cooldown > 0}
          className={`neo-btn w-full mt-3 px-4 py-2.5 font-mono font-medium text-sm flex items-center justify-center gap-2 ${
            !prompt.trim() || loading || cooldown > 0
              ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed shadow-none"
              : "bg-rose-600 text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_var(--neo-shadow-color)] transition-all"
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generating...
            </>
          ) : cooldown > 0 ? (
            <>
              <Timer className="size-4" />
              Tunggu {cooldown} detik...
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Generate Image
            </>
          )}
        </button>
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
      {image && (
        <div className="neo-card p-5">
          <h3 className="font-mono font-bold text-sm mb-3">Hasil</h3>
          <div className="neo-border rounded-lg overflow-hidden mb-4">
            <img
              src={image}
              alt={prompt}
              className="w-full h-auto"
            />
          </div>
          <button
            onClick={handleDownload}
            className="neo-btn w-full px-4 py-2.5 font-mono font-medium text-sm flex items-center justify-center gap-2 bg-[var(--neo-border-color)] text-[var(--neo-card-bg)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_var(--neo-shadow-color)] transition-all"
          >
            <Download className="size-4" />
            Download Gambar
          </button>
        </div>
      )}
    </div>
  );
}
