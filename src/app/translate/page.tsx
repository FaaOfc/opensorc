"use client";

import { useState } from "react";
import { Languages, Loader2, ArrowRightLeft, Copy, Check } from "lucide-react";

const languages = [
  "Indonesian", "English", "Japanese", "Korean", "Chinese (Simplified)",
  "Chinese (Traditional)", "Malay", "Arabic", "Hindi", "Thai",
  "Vietnamese", "Filipino", "Spanish", "French", "German",
  "Italian", "Portuguese", "Russian", "Turkish", "Dutch",
  "Polish", "Swedish", "Norwegian", "Danish", "Finnish",
  "Czech", "Romanian", "Hungarian", "Greek", "Ukrainian",
];

export default function TranslatePage() {
  const [text, setText] = useState("");
  const [fromLang, setFromLang] = useState("Indonesian");
  const [toLang, setToLang] = useState("English");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSwap = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    if (result) {
      setText(result);
      setResult("");
    }
  };

  const handleTranslate = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), from: fromLang, to: toLang }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else if (data.translation) {
        setResult(data.translation);
      }
    } catch {
      setError("Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center neo-border rounded-xl p-4 bg-blue-50 dark:bg-blue-950 mb-4">
          <Languages className="size-8 text-blue-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-mono font-bold mb-2">
          AI Translator
        </h1>
        <p className="font-mono text-sm" style={{ color: "var(--neo-muted-text)" }}>
          Terjemahkan teks ke bahasa apa saja secara instan
        </p>
      </div>

      {/* Language selector */}
      <div className="neo-card p-4 mb-4 flex items-center gap-3">
        <select
          value={fromLang}
          onChange={(e) => setFromLang(e.target.value)}
          className="flex-1 neo-border rounded-lg px-3 py-2 font-mono text-sm bg-[var(--neo-card-bg)] focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="auto">Deteksi Otomatis</option>
          {languages.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <button
          onClick={handleSwap}
          className="neo-btn p-2.5 bg-blue-50 dark:bg-blue-950 shrink-0 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_var(--neo-shadow-color)] transition-all"
          title="Tukar bahasa"
        >
          <ArrowRightLeft className="size-4 text-blue-600" />
        </button>

        <select
          value={toLang}
          onChange={(e) => setToLang(e.target.value)}
          className="flex-1 neo-border rounded-lg px-3 py-2 font-mono text-sm bg-[var(--neo-card-bg)] focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {languages.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Input */}
      <div className="neo-card p-5 mb-4">
        <label className="font-mono font-bold text-xs block mb-2">
          Teks Sumber ({fromLang})
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ketik atau paste teks yang ingin diterjemahkan..."
          disabled={loading}
          className="neo-border rounded-lg w-full px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-[var(--neo-card-bg)] resize-none h-28"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="font-mono text-xs" style={{ color: "var(--neo-muted-text)" }}>
            {text.length} karakter
          </span>
          <button
            onClick={handleTranslate}
            disabled={!text.trim() || loading}
            className={`neo-btn px-5 py-2 font-mono font-medium text-sm flex items-center gap-2 ${
              !text.trim() || loading
                ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed shadow-none"
                : "bg-blue-600 text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_var(--neo-shadow-color)] transition-all"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Menerjemahkan...
              </>
            ) : (
              "Terjemahkan"
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="neo-card p-4 mb-4 border-red-500 bg-red-50 dark:bg-red-950">
          <p className="text-red-600 dark:text-red-400 font-mono text-sm">{error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="neo-card p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="font-mono font-bold text-xs">
              Hasil ({toLang})
            </label>
            <button
              onClick={handleCopy}
              className="neo-btn px-3 py-1 font-mono text-xs flex items-center gap-1.5 bg-[var(--neo-card-bg)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
            >
              {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
              {copied ? "Tersalin!" : "Salin"}
            </button>
          </div>
          <div className="neo-border rounded-lg p-3 bg-blue-50 dark:bg-blue-950">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{result}</p>
          </div>
        </div>
      )}
    </div>
  );
}
