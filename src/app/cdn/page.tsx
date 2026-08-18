"use client";

import { useState, useRef, useCallback } from "react";
import {
  UploadCloud,
  FileUp,
  Loader2,
  Copy,
  Check,
  Link,
} from "lucide-react";

export default function CdnPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload gagal");
        return;
      }

      setResult(data.url);
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  }, [file]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [result]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setResult(null);
      setError(null);
    }
  }, []);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-start justify-center py-8 sm:py-16 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center neo-border rounded-xl p-3 bg-orange-50 dark:bg-orange-950 mb-4">
            <UploadCloud className="size-8 text-orange-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold mb-1">
            CDN Hosting
          </h1>
          <p className="text-sm text-gray-600 font-mono">
            Upload file apapun, dapatkan URL instantly
          </p>
        </div>

        {/* Card */}
        <div className="neo-card p-5 sm:p-6">
          <p className="text-sm text-gray-600 mb-4 font-mono">
            Supports all mimetypes, dari gambar hingga executable.
          </p>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors mb-4 ${
              isDragging
                ? "border-orange-500 bg-orange-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setFile(f);
                  setResult(null);
                  setError(null);
                }
              }}
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <FileUp className="size-8 text-orange-500" />
                <span className="font-mono text-sm font-medium truncate max-w-full">
                  {file.name}
                </span>
                <span className="font-mono text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <UploadCloud className="size-8 text-gray-400" />
                <span className="font-mono text-sm text-gray-500">
                  Click or drag file here
                </span>
              </div>
            )}
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className={`neo-btn w-full py-2.5 font-mono font-medium text-sm flex items-center justify-center gap-2 mb-4 ${
              !file || loading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-[#18181b] text-white hover:bg-gray-800"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="size-4" />
                Upload File
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
          <h3 className="font-mono font-bold text-sm mb-2">Cara Kerja CDN</h3>
          <ol className="space-y-1.5 text-xs font-mono text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">1.</span>
              File kamu diupload ke Database
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">2.</span>
              Nama file di-generate secara random (4 karakter)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">3.</span>
              File di-serve melalui domain kamu dengan MIME type yang benar
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
