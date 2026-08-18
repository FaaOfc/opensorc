"use client";

import { useState, useCallback, useRef } from "react";
import {
  AudioWaveform,
  Loader2,
  Play,
  Pause,
  Download,
  Volume2,
  AlertCircle,
} from "lucide-react";

interface Voice {
  model: string;
  voiceName: string;
  url: string;
}

export default function TtsPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [playingModel, setPlayingModel] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) return;
    setLoading(true);
    setVoices([]);
    setError(null);

    // Stop any playing audio
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    setPlayingModel(null);

    try {
      const res = await fetch(`/api/tts?text=${encodeURIComponent(text.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal generate suara");
        return;
      }

      if (!data.voices || data.voices.length === 0) {
        setError("Tidak ada suara yang berhasil di-generate");
        return;
      }

      setVoices(data.voices);
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  }, [text]);

  const handlePlay = useCallback(
    (voice: Voice) => {
      // If same voice is playing, pause it
      if (playingModel === voice.model) {
        const audio = audioRefs.current[voice.model];
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        setPlayingModel(null);
        return;
      }

      // Stop any currently playing audio
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });

      // Play the new one
      let audio = audioRefs.current[voice.model];
      if (!audio) {
        audio = new Audio(voice.url);
        audio.onended = () => setPlayingModel(null);
        audio.onerror = () => {
          setError("Gagal memutar audio");
          setPlayingModel(null);
        };
        audioRefs.current[voice.model] = audio;
      }

      audio.play().catch(() => {
        setError("Gagal memutar audio");
      });
      setPlayingModel(voice.model);
    },
    [playingModel]
  );

  const handleDownload = useCallback((voice: Voice) => {
    const a = document.createElement("a");
    a.href = voice.url;
    a.download = `${voice.model}-${Date.now()}.wav`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  // Voice emoji/icon map
  const voiceEmoji: Record<string, string> = {
    nahida: "🌿",
    nami: "🌊",
    ana: "👩",
    optimus_prime: "🤖",
    goku: "🟠",
    elon_musk: "🚀",
    mickey_mouse: "🐭",
    kendrick_lamar: "🎤",
    eminem: "🎧",
    miku: "💠",
    taylor_swift: "🎵",
    angela_adkinsh: "📰",
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-start justify-center py-8 sm:py-16 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center neo-border rounded-xl p-3 bg-violet-50 dark:bg-violet-950 mb-4">
            <AudioWaveform className="size-8 text-violet-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold mb-1">
            Text to Speech
          </h1>
          <p className="text-sm text-gray-600 font-mono">
            Ubah teks jadi suara dengan berbagai karakter
          </p>
        </div>

        {/* Card */}
        <div className="neo-card p-5 sm:p-6">
          <p className="text-sm text-gray-600 mb-4 font-mono">
            Ketik teks yang ingin diubah ke suara, lalu generate untuk mendapatkan audio dari berbagai karakter.
          </p>

          {/* Text Input */}
          <div className="mb-4">
            <label className="font-mono text-xs font-bold text-gray-700 mb-1 block">
              Teks
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Contoh: Halo, selamat datang di TaoSite!"
              rows={3}
              maxLength={500}
              className="neo-border rounded-md w-full px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
            />
            <div className="text-right mt-1">
              <span className="font-mono text-xs text-gray-400">
                {text.length}/500
              </span>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!text.trim() || loading}
            className={`neo-btn w-full py-2.5 font-mono font-medium text-sm flex items-center justify-center gap-2 mb-4 ${
              !text.trim() || loading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                : "bg-[#18181b] text-white hover:bg-gray-800"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Volume2 className="size-4" />
                Generate Suara
              </>
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg animate-slide-up mb-4">
              <p className="font-mono text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Voice Results */}
          {voices.length > 0 && (
            <div className="space-y-2 animate-slide-up">
              <div className="flex items-center gap-2 mb-3">
                <AudioWaveform className="size-4 text-violet-500" />
                <span className="font-mono text-xs font-bold text-gray-700">
                  {voices.length} Suara Tersedia
                </span>
              </div>

              {voices.map((voice) => (
                <div
                  key={voice.model}
                  className="flex items-center gap-3 p-3 neo-border rounded-lg bg-[var(--neo-card-bg)] hover:opacity-90 transition-opacity"
                >
                  {/* Emoji */}
                  <div className="text-lg shrink-0 w-7 text-center">
                    {voiceEmoji[voice.model] || "🗣️"}
                  </div>

                  {/* Voice Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm font-medium truncate">
                      {voice.voiceName}
                    </p>
                    <p className="font-mono text-xs text-gray-400">
                      {voice.model}
                    </p>
                  </div>

                  {/* Play/Pause Button */}
                  <button
                    onClick={() => handlePlay(voice)}
                    className="neo-btn p-2 bg-violet-50 dark:bg-violet-950 text-violet-600 shrink-0"
                    title={playingModel === voice.model ? "Pause" : "Play"}
                  >
                    {playingModel === voice.model ? (
                      <Pause className="size-4" />
                    ) : (
                      <Play className="size-4" />
                    )}
                  </button>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(voice)}
                    className="neo-btn p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 shrink-0"
                    title="Download"
                  >
                    <Download className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 neo-card p-4">
          <h3 className="font-mono font-bold text-sm mb-2">
            Cara Kerja TTS
          </h3>
          <ol className="space-y-1.5 text-xs font-mono text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-violet-500 font-bold">1.</span>
              Ketik teks yang ingin diubah ke suara
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-500 font-bold">2.</span>
              API akan generate suara dari berbagai karakter (anime, seleb, dll)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-500 font-bold">3.</span>
              Pilih suara yang kamu suka, play langsung atau download
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
      }
              
