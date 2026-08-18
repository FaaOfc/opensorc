"use client";

import { useState, useRef } from "react";
import { AudioLines, Loader2, Play, Pause, Download, Volume2 } from "lucide-react";

const voices = [
  { id: "tongtong", label: "Tongtong", desc: "Default" },
  { id: "xiaoyi", label: "Xiaoyi", desc: "Chinese" },
  { id: "echo", label: "Echo", desc: "English" },
  { id: "shimmer", label: "Shimmer", desc: "English" },
  { id: "alloy", label: "Alloy", desc: "English" },
  { id: "fable", label: "Fable", desc: "English" },
  { id: "onyx", label: "Onyx", desc: "English" },
  { id: "nova", label: "Nova", desc: "English" },
];

export default function TTSPage() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("tongtong");
  const [speed, setSpeed] = useState(1.0);
  const [audioFormat, setAudioFormat] = useState("mp3");
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerate = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError("");
    setAudioSrc(null);
    setPlaying(false);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          voice,
          speed,
          format: audioFormat,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else if (data.audio) {
        setAudioSrc(data.audio);
      }
    } catch {
      setError("Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleDownload = () => {
    if (!audioSrc) return;
    const a = document.createElement("a");
    a.href = audioSrc;
    a.download = `nefu-tts-${Date.now()}.${audioFormat}`;
    a.click();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center neo-border rounded-xl p-4 bg-purple-50 dark:bg-purple-950 mb-4">
          <AudioLines className="size-8 text-purple-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-mono font-bold mb-2">
          AI Text-to-Speech
        </h1>
        <p className="font-mono text-sm" style={{ color: "var(--neo-muted-text)" }}>
          Ubah teks menjadi suara AI yang natural
        </p>
      </div>

      {/* Input */}
      <div className="neo-card p-5 mb-4">
        <label className="font-mono font-bold text-xs block mb-2">
          Teks yang ingin diubah ke suara
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Contoh: Selamat datang di NefuSite, platform tools gratis untuk semua!"
          disabled={loading}
          maxLength={5000}
          className="neo-border rounded-lg w-full px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-[var(--neo-card-bg)] resize-none h-28"
        />
        <div className="flex items-center justify-between mt-1">
          <span className="font-mono text-xs" style={{ color: "var(--neo-muted-text)" }}>
            {text.length} / 5000
          </span>
        </div>
      </div>

      {/* Settings */}
      <div className="neo-card p-5 mb-4">
        <h3 className="font-mono font-bold text-xs mb-3 flex items-center gap-2">
          <Volume2 className="size-3.5" />
          Pengaturan Suara
        </h3>

        {/* Voice selection */}
        <div className="mb-4">
          <label className="font-mono text-xs block mb-2">Suara</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {voices.map((v) => (
              <button
                key={v.id}
                onClick={() => setVoice(v.id)}
                className={`neo-btn px-2 py-2 font-mono text-xs text-center transition-all ${
                  voice === v.id
                    ? "bg-purple-600 text-white shadow-none"
                    : "bg-[var(--neo-card-bg)]"
                }`}
              >
                <span className="block font-bold">{v.label}</span>
                <span className="block text-[10px] opacity-70">{v.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Speed */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <label className="font-mono text-xs">Kecepatan</label>
            <span className="font-mono text-xs font-bold">{speed.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={2.0}
            step={0.1}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>

        {/* Format */}
        <div>
          <label className="font-mono text-xs block mb-1">Format Audio</label>
          <select
            value={audioFormat}
            onChange={(e) => setAudioFormat(e.target.value)}
            className="neo-border rounded-lg w-full px-3 py-2 font-mono text-sm bg-[var(--neo-card-bg)] focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <option value="mp3">MP3 (ukuran kecil)</option>
            <option value="wav">WAV (kualitas tinggi)</option>
          </select>
        </div>
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!text.trim() || loading}
        className={`neo-btn w-full px-4 py-2.5 font-mono font-medium text-sm flex items-center justify-center gap-2 mb-4 ${
          !text.trim() || loading
            ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed shadow-none"
            : "bg-purple-600 text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_var(--neo-shadow-color)] transition-all"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Membuat audio...
          </>
        ) : (
          <>
            <AudioLines className="size-4" />
            Buat Audio
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="neo-card p-4 mb-4 border-red-500 bg-red-50 dark:bg-red-950">
          <p className="text-red-600 dark:text-red-400 font-mono text-sm">{error}</p>
        </div>
      )}

      {/* Audio result */}
      {audioSrc && (
        <div className="neo-card p-5">
          <h3 className="font-mono font-bold text-sm mb-3">Hasil Audio</h3>

          <audio
            ref={audioRef}
            src={audioSrc}
            onEnded={() => setPlaying(false)}
            className="hidden"
          />

          {/* Play/Pause */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={togglePlay}
              className="neo-btn p-3 bg-purple-50 dark:bg-purple-950 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_var(--neo-shadow-color)] transition-all"
            >
              {playing ? (
                <Pause className="size-5 text-purple-600" />
              ) : (
                <Play className="size-5 text-purple-600" />
              )}
            </button>
            <div className="flex-1">
              <div className="neo-border rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{ width: playing ? "100%" : "0%" }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="neo-btn w-full px-4 py-2.5 font-mono font-medium text-sm flex items-center justify-center gap-2 bg-purple-600 text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_var(--neo-shadow-color)] transition-all"
          >
            <Download className="size-4" />
            Download Audio
          </button>
        </div>
      )}
    </div>
  );
}
