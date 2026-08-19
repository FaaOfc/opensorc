"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Globe,
  Loader2,
  Send,
  Trash2,
  ExternalLink,
  Sparkles,
  User,
  Bot,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Sidebar } from "@/components/ui/sidebar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  timestamp: number;
}

const STORAGE_KEY = "tao_realtime_chats";

export default function RealtimePage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [input]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input.trim();
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/realtime?text=${encodeURIComponent(currentInput)}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal menghubungi AI");
        return;
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.result || "Tidak ada jawaban.",
        sources: data.source || [],
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  }, [input, loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const suggestions = [
    "Berita terbaru hari ini",
    "Harga Bitcoin sekarang",
    "Cuaca Jakarta hari ini",
    "Apa yang trending di Indonesia?",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] sm:h-screen">
      {/* Header */}
      <div
        className="border-b-2 px-4 py-3 flex items-center justify-between shrink-0"
        style={{ borderColor: "var(--neo-border-color)" }}
      >
        <div className="flex items-center gap-2">
          <div className="neo-border rounded-lg p-1.5 bg-blue-50 dark:bg-blue-950">
            <Globe className="size-4 text-blue-500" />
          </div>
          <div>
            <h1 className="font-mono font-bold text-sm">AI Realtime</h1>
            <p className="font-mono text-xs" style={{ color: "var(--neo-muted-text)" }}>
              Tanya apa aja, jawab pake data terbaru dari web
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="neo-btn p-2 bg-[var(--neo-card-bg)] hover:opacity-80"
            title="Clear chat"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto chat-scroll px-4 py-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Empty state */}
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="neo-border rounded-2xl p-4 bg-blue-50 dark:bg-blue-950 mb-4 animate-slide-up">
                <Globe className="size-8 text-blue-500" />
              </div>
              <h2 className="font-mono font-bold text-lg mb-2 animate-slide-up">
                AI Realtime Search
              </h2>
              <p
                className="font-mono text-sm max-w-sm mb-6 animate-slide-up"
                style={{ color: "var(--neo-muted-text)" }}
              >
                Tanya apa saja, AI akan cari jawaban terbaru dari internet untuk kamu
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(s)}
                    className="neo-card p-3 text-left hover:opacity-80 transition-opacity animate-slide-up"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <p className="font-mono text-xs">{s}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : ""
              } animate-fade-in-up`}
            >
              {/* Avatar */}
              <div
                className={`neo-border rounded-lg p-2 shrink-0 ${
                  msg.role === "user"
                    ? "bg-orange-50 dark:bg-orange-950"
                    : "bg-blue-50 dark:bg-blue-950"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="size-4 text-orange-500" />
                ) : (
                  <Bot className="size-4 text-blue-500" />
                )}
              </div>

              {/* Message content */}
              <div
                className={`flex-1 min-w-0 ${
                  msg.role === "user" ? "flex justify-end" : ""
                }`}
              >
                <div
                  className={`neo-card p-3 sm:p-4 inline-block max-w-full ${
                    msg.role === "user"
                      ? "bg-orange-50 dark:bg-orange-950"
                      : "bg-[var(--neo-card-bg)]"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-headings:font-mono prose-pre:bg-gray-100 prose-pre:dark:bg-gray-800 prose-pre:rounded-lg prose-code:before:content-none prose-code:after:content-none prose-code:bg-gray-100 prose-code:dark:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="font-mono text-sm whitespace-pre-wrap break-words">
                      {msg.content}
                    </p>
                  )}

                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t-2 border-dashed" style={{ borderColor: "var(--neo-border-color)" }}>
                      <p className="font-mono text-xs font-bold mb-2 flex items-center gap-1.5">
                        <ExternalLink className="size-3" />
                        Sumber:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, i) => {
                          let domain = src;
                          try {
                            domain = new URL(src).hostname;
                          } catch {
                            // ignore
                          }
                          return (
                            <a
                              key={i}
                              href={src}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="neo-btn px-2 py-1 font-mono text-xs bg-[var(--neo-card-bg)] hover:opacity-80 inline-flex items-center gap-1"
                            >
                              <span className="truncate max-w-[150px]">{domain}</span>
                              <ExternalLink className="size-2.5" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading state */}
          {loading && (
            <div className="flex gap-3 animate-fade-in-up">
              <div className="neo-border rounded-lg p-2 shrink-0 bg-blue-50 dark:bg-blue-950">
                <Bot className="size-4 text-blue-500" />
              </div>
              <div className="neo-card p-4 inline-block">
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin text-blue-500" />
                  <span className="font-mono text-sm" style={{ color: "var(--neo-muted-text)" }}>
                    Mencari di web...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg animate-slide-up">
              <p className="font-mono text-sm text-red-700">{error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div
        className="border-t-2 px-4 py-3 shrink-0 bg-[var(--neo-card-bg)]"
        style={{ borderColor: "var(--neo-border-color)" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanya apa saja... (Shift+Enter untuk baris baru)"
                rows={1}
                className="neo-border rounded-lg w-full px-3 py-2.5 pr-10 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                disabled={loading}
              />
              <Sparkles className="size-4 text-blue-400 absolute right-3 top-3 pointer-events-none" />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className={`neo-btn p-2.5 shrink-0 ${
                !input.trim() || loading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {loading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Send className="size-5" />
              )}
            </button>
          </div>
          <p
            className="font-mono text-xs mt-1.5 text-center"
            style={{ color: "var(--neo-muted-text)" }}
          >
            AI bisa akses informasi real-time dari internet
          </p>
        </div>
      </div>
    </div>
  );
        }
                
