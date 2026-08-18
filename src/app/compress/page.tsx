"use client";

import { useState, useRef } from "react";
import { ImageDown, Loader2, Download, Upload, AlertCircle } from "lucide-react";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState("");
  const [maxHeight, setMaxHeight] = useState("");
  const [format, setFormat] = useState("original");
  const [result, setResult] = useState<{ image: string; originalSize: number; compressedSize: number; savings: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
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

  const handleCompress = async () => {
    if (!file || loading) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("quality", String(quality));
      formData.append("format", format);
      if (maxWidth) formData.append("width", maxWidth);
      if (maxHeight) formData.append("height", maxHeight);

      const res = await fetch("/api/compress", {
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
    const ext = format === "original" ? "jpg" : format;
    const a = document.createElement("a");
    a.href = result.image;
    a.download = `nefu-compress-${Date.now()}.${ext}`;
    a.click();
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError("");
    setQuality(80);
    setMaxWidth("");
    setMaxHeight("");
    setFormat("original");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center neo-border rounded-xl p-4 bg-emerald-50 dark:bg-emerald-950 mb-4">
          <ImageDown className="size-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-mono font-bold mb-2">
          Image Compressor
        </h1>
        <p className="font-mono text-sm" style={{ color: "var(--neo-muted-text)" }}>
          Kompres & resize gambar — kurangi ukuran file tanpa hilang kualitas
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
            dragOver ? "bg-emerald-50 dark:bg-emerald-950 scale-[1.02]" : ""
          }`}
        >
          <Upload className="size-8 mx-auto mb-3 text-emerald-500" />
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
              <button onClick={handleReset} className="font-mono text-xs hover:text-emerald-500" style={{ color: "var(--neo-muted-text)" }}>
                Ganti gambar
              </button>
            </div>
            <div className="neo-border rounded-lg overflow-hidden mb-2">
              <img src={preview!} alt="Preview" className="w-full h-auto max-h-48 object-contain bg-[var(--neo-page-bg)]" />
            </div>
            <p className="font-mono text-xs" style={{ color: "var(--neo-muted-text)" }}>
              {file.name} — {formatSize(file.size)}
            </p>
          </div>

          {/* Settings */}
          <div className="neo-card p-5 mb-4">
            <h3 className="font-mono font-bold text-xs mb-3">Pengaturan</h3>

            {/* Quality */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="font-mono text-xs">Kualitas</label>
                <span className="font-mono text-xs font-bold">{quality}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="font-mono text-xs block mb-1">Max Lebar (px)</label>
                <input
                  type="number"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(e.target.value)}
                  placeholder="Otomatis"
                  className="neo-border rounded-lg w-full px-3 py-2 font-mono text-sm bg-[var(--neo-card-bg)] focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
              <div>
                <label className="font-mono text-xs block mb-1">Max Tinggi (px)</label>
                <input
                  type="number"
                  value={maxHeight}
                  onChange={(e) => setMaxHeight(e.target.value)}
                  placeholder="Otomatis"
                  className="neo-border rounded-lg w-full px-3 py-2 font-mono text-sm bg-[var(--neo-card-bg)] focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="font-mono text-xs block mb-1">Format Output</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="neo-border rounded-lg w-full px-3 py-2 font-mono text-sm bg-[var(--neo-card-bg)] focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                <option value="original">Sama seperti asli</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </select>
            </div>
          </div>

          {/* Compress button */}
          <button
            onClick={handleCompress}
            disabled={loading}
            className={`neo-btn w-full px-4 py-2.5 font-mono font-medium text-sm flex items-center justify-center gap-2 mb-4 ${
              loading
                ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed shadow-none"
                : "bg-emerald-600 text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_var(--neo-shadow-color)] transition-all"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Mengkompres...
              </>
            ) : (
              <>
                <ImageDown className="size-4" />
                Kompres Gambar
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
          <h3 className="font-mono font-bold text-sm mb-3">Hasil Kompresi</h3>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="neo-border rounded-lg p-3 text-center">
              <p className="font-mono text-xs" style={{ color: "var(--neo-muted-text)" }}>Asli</p>
              <p className="font-mono font-bold text-sm">{formatSize(result.originalSize)}</p>
            </div>
            <div className="neo-border rounded-lg p-3 text-center">
              <p className="font-mono text-xs" style={{ color: "var(--neo-muted-text)" }}>Kompres</p>
              <p className="font-mono font-bold text-sm text-emerald-600">{formatSize(result.compressedSize)}</p>
            </div>
            <div className="neo-border rounded-lg p-3 text-center">
              <p className="font-mono text-xs" style={{ color: "var(--neo-muted-text)" }}>Hemat</p>
              <p className="font-mono font-bold text-sm text-emerald-600">{result.savings}%</p>
            </div>
          </div>

          {/* Compressed preview */}
          <div className="neo-border rounded-lg overflow-hidden mb-4">
            <img src={result.image} alt="Compressed" className="w-full h-auto max-h-64 object-contain bg-[var(--neo-page-bg)]" />
          </div>

          <button
            onClick={handleDownload}
            className="neo-btn w-full px-4 py-2.5 font-mono font-medium text-sm flex items-center justify-center gap-2 bg-emerald-600 text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_var(--neo-shadow-color)] transition-all"
          >
            <Download className="size-4" />
            Download Gambar
          </button>
        </div>
      )}
    </div>
  );
}
