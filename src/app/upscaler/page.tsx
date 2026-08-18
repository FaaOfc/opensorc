"use client";

import { useState, useRef } from "react";
import { ZoomIn, Loader2, Download, Upload, AlertCircle, Expand } from "lucide-react";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UpscalerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scale, setScale] = useState(2);
  const [result, setResult] = useState<{
    image: string;
    originalWidth: number;
    originalHeight: number;
    newWidth: number;
    newHeight: number;
    scale: number;
    originalSize: number;
    newSize: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [comparing, setComparing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Hanya file gambar yang didukung.");
      return;
    }
    setFile(f);
    setError("");
    setResult(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileSelect(f);
  };

  const handleUpscale = async () => {
    if (!file || loading) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("scale", String(scale));

      const res = await fetch("/api/upscaler", {
        method: "POST",
        body: formData,
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

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.image;
    a.download = `nefu-upscale-${result.scale}x-${Date.now()}.jpg`;
    a.click();
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center neo-border rounded-xl p-4 bg-sky-50 dark:bg-sky-950 mb-4">
          <ZoomIn className="size-8 text-sky-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-mono font-bold mb-2">
          Image Upscaler
        </h1>
        <p className="font-mono text-sm" style={{ color: "var(--neo-muted-text)" }}>
          Perbesar resolusi gambar hingga 4x dengan kualitas tinggi
        </p>
      </div>

      {/* Upload area */}
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`neo-card p-8 text-center cursor-pointer transition-all ${
            dragOver ? "bg-sky-50 dark:bg-sky-950 scale-[1.02]" : ""
          }`}
        >
          <Upload className="size-8 mx-auto mb-3 text-sky-500" />
          <p className="font-mono font-bold text-sm mb-1">Drag & drop gambar di sini</p>
          <p className="font-mono text-xs" style={{ color: "var(--neo-muted-text)" }}>
            atau klik untuk pilih file — PNG, JPG, WebP
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
        </div>
      ) : (
        <>
          {/* Preview original */}
          <div className="neo-card p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <label className="font-mono font-bold text-xs">Gambar Asli</label>
              <button onClick={handleReset} className="font-mono text-xs hover:text-sky-500" style={{ color: "var(--neo-muted-text)" }}>
                Ganti gambar
              </button>
            </div>
            <div className="neo-border rounded-lg overflow-hidden mb-2">
              <img src={preview!} alt="Preview" className="w-full h-auto max-h-56 object-contain bg-[var(--neo-page-bg)]" />
            </div>
            <p className="font-mono text-xs" style={{ color: "var(--neo-muted-text)" }}>
              {file.name} — {formatSize(file.size)}
            </p>
          </div>

          {/* Scale selector */}
          <div className="neo-card p-5 mb-4">
            <h3 className="font-mono font-bold text-xs mb-3 flex items-center gap-2">
              <Expand className="size-3.5" />
              Skala Upscale
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setScale(2)}
                className={`neo-btn px-4 py-3 font-mono text-sm text-center transition-all ${
                  scale === 2
                    ? "bg-sky-600 text-white shadow-none"
                    : "bg-[var(--neo-card-bg)]"
                }`}
              >
                <span className="block font-bold text-lg">2x</span>
                <span className="block text-xs opacity-80">Double resolution</span>
              </button>
              <button
                onClick={() => setScale(4)}
                className={`neo-btn px-4 py-3 font-mono text-sm text-center transition-all ${
                  scale === 4
                    ? "bg-sky-600 text-white shadow-none"
                    : "bg-[var(--neo-card-bg)]"
                }`}
              >
                <span className="block font-bold text-lg">4x</span>
                <span className="block text-xs opacity-80">Quadruple resolution</span>
              </button>
            </div>
          </div>

          {/* Upscale button */}
          <button
            onClick={handleUpscale}
            disabled={loading}
            className={`neo-btn w-full px-4 py-2.5 font-mono font-medium text-sm flex items-center justify-center gap-2 mb-4 ${
              loading
                ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed shadow-none"
                : "bg-sky-600 text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_var(--neo-shadow-color)] transition-all"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Upscaling {scale}x...
              </>
            ) : (
              <>
                <ZoomIn className="size-4" />
                Upscale {scale}x
              </>
            )}
          </button>
        </>
      )}

      {/* Error */}
      {error && (
        <div className="neo-card p-4 mb-4 border-red-500 bg-red-50 dark:bg-red-950">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-mono text-sm">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="neo-card p-5">
          <h3 className="font-mono font-bold text-sm mb-3">Hasil Upscale</h3>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="neo-border rounded-lg p-3 text-center">
              <p className="font-mono text-[10px]" style={{ color: "var(--neo-muted-text)" }}>Asli</p>
              <p className="font-mono font-bold text-sm">{result.originalWidth}×{result.originalHeight}</p>
            </div>
            <div className="neo-border rounded-lg p-3 text-center">
              <p className="font-mono text-[10px]" style={{ color: "var(--neo-muted-text)" }}>Upscaled</p>
              <p className="font-mono font-bold text-sm text-sky-600">{result.newWidth}×{result.newHeight}</p>
            </div>
            <div className="neo-border rounded-lg p-3 text-center">
              <p className="font-mono text-[10px]" style={{ color: "var(--neo-muted-text)" }}>Skala</p>
              <p className="font-mono font-bold text-sm text-sky-600">{result.scale}x</p>
            </div>
            <div className="neo-border rounded-lg p-3 text-center">
              <p className="font-mono text-[10px]" style={{ color: "var(--neo-muted-text)" }}>Ukuran</p>
              <p className="font-mono font-bold text-sm">{formatSize(result.newSize)}</p>
            </div>
          </div>

          {/* Compare toggle */}
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => setComparing(false)}
              className={`font-mono text-xs px-3 py-1.5 rounded-md transition-all ${
                !comparing ? "bg-sky-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              style={!comparing ? {} : { color: "var(--neo-muted-text)" }}
            >
              Hasil
            </button>
            <button
              onClick={() => setComparing(true)}
              className={`font-mono text-xs px-3 py-1.5 rounded-md transition-all ${
                comparing ? "bg-sky-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              style={comparing ? {} : { color: "var(--neo-muted-text)" }}
            >
              Compare
            </button>
          </div>

          {/* Image display */}
          {comparing ? (
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <p className="font-mono text-[10px] mb-1 text-center" style={{ color: "var(--neo-muted-text)" }}>Before</p>
                <div className="neo-border rounded-lg overflow-hidden">
                  <img src={preview!} alt="Original" className="w-full h-auto max-h-64 object-contain bg-[var(--neo-page-bg)]" />
                </div>
              </div>
              <div>
                <p className="font-mono text-[10px] mb-1 text-center" style={{ color: "var(--neo-muted-text)" }}>After ({result.scale}x)</p>
                <div className="neo-border rounded-lg overflow-hidden">
                  <img src={result.image} alt="Upscaled" className="w-full h-auto max-h-64 object-contain bg-[var(--neo-page-bg)]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="neo-border rounded-lg overflow-hidden mb-4">
              <img src={result.image} alt="Upscaled" className="w-full h-auto max-h-72 object-contain bg-[var(--neo-page-bg)]" />
            </div>
          )}

          <button
            onClick={handleDownload}
            className="neo-btn w-full px-4 py-2.5 font-mono font-medium text-sm flex items-center justify-center gap-2 bg-sky-600 text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_var(--neo-shadow-color)] transition-all"
          >
            <Download className="size-4" />
            Download Upscaled Image
          </button>
        </div>
      )}
    </div>
  );
}
