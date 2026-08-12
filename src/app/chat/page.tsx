"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare,
  Send,
  Loader2,
  Plus,
  Trash2,
  ChevronDown,
  Sparkles,
  History,
  X,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// ===================== TYPES =====================
interface Msg {
  role: "user" | "assistant";
  content: string;
}

interface LocalChat {
  id: string;
  title: string;
  model: string;
  messages: Msg[];
  createdAt: number;
}

interface ModelInfo {
  id: string;
  name: string;
}

const STORAGE_KEY = "nefu_chats";
const MODEL_KEY = "nefu_model";

// ===================== MAIN =====================
export default function ChatPage() {
  const [chats, setChats] = useState<LocalChat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState("openai/gpt-5.5");
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showMobileRiwayat, setShowMobileRiwayat] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find((c) => c.id === activeId) || null;

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setChats(JSON.parse(stored));
      const savedModel = localStorage.getItem(MODEL_KEY);
      if (savedModel) setSelectedModel(savedModel);
    } catch {}
    setLoaded(true);
  }, []);

  // Fetch models
  useEffect(() => {
    fetch("/api/chat")
      .then((r) => r.json())
      .then((d) => {
        if (d.models) setModels(d.models);
      })
      .catch(() => {});
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    } catch {}
  }, [chats, loaded]);

  // Scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages?.length]);

  const modelName = models.find((m) => m.id === selectedModel)?.name || selectedModel.split("/").pop() || "AI";

  const handleSend = useCallback(async () => {
    if (!input.trim() || sending) return;
    const msg = input.trim();
    setInput("");
    setSending(true);

    let chatId = activeId;
    let updatedChats = [...chats];

    if (!chatId) {
      const newChat: LocalChat = {
        id: Date.now().toString(),
        title: msg.slice(0, 40),
        model: selectedModel,
        messages: [{ role: "user", content: msg }],
        createdAt: Date.now(),
      };
      chatId = newChat.id;
      updatedChats = [newChat, ...updatedChats];
    } else {
      updatedChats = updatedChats.map((c) =>
        c.id === chatId
          ? { ...c, messages: [...c.messages, { role: "user", content: msg }] }
          : c
      );
    }

    setChats(updatedChats);
    setActiveId(chatId);

    const chatForApi = updatedChats.find((c) => c.id === chatId);
    const apiMessages = (chatForApi?.messages || []).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, model: selectedModel }),
      });

      const data = await res.json();

      if (data.error) {
        setChats((prev) =>
          prev.map((c) =>
            c.id === chatId
              ? { ...c, messages: [...c.messages, { role: "assistant" as const, content: `⚠️ ${data.error}` }] }
              : c
          )
        );
      } else if (data.content) {
        setChats((prev) =>
          prev.map((c) =>
            c.id === chatId
              ? { ...c, messages: [...c.messages, { role: "assistant" as const, content: data.content }] }
              : c
          )
        );
      }
    } catch {
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? { ...c, messages: [...c.messages, { role: "assistant" as const, content: "❌ Gagal menghubungi server." }] }
            : c
        )
      );
    } finally {
      setSending(false);
    }
  }, [input, sending, activeId, chats, selectedModel]);

  const handleNewChat = () => setActiveId(null);

  const handleDeleteChat = (id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const handleSelectModel = (id: string) => {
    setSelectedModel(id);
    localStorage.setItem(MODEL_KEY, id);
    setShowModelPicker(false);
  };

  // Shared riwayat content
  const riwayatContent = (
    <div className="flex flex-col h-full">
      <div
        className="p-3 flex items-center justify-between border-b-2"
        style={{ borderColor: "var(--neo-border-color)" }}
      >
        <span className="font-mono font-bold text-sm flex items-center gap-1.5">
          <Sparkles className="size-4 text-orange-500" /> Riwayat
        </span>
        <div className="flex gap-1.5">
          <button
            onClick={() => { handleNewChat(); setShowMobileRiwayat(false); }}
            className="neo-btn p-1.5 bg-[var(--neo-card-bg)]"
            title="New chat"
          >
            <Plus className="size-4" />
          </button>
          {/* Mobile close button */}
          <button
            onClick={() => setShowMobileRiwayat(false)}
            className="sm:hidden neo-btn p-1.5 bg-[var(--neo-card-bg)]"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {chats.length === 0 ? (
          <p className="text-xs font-mono text-center py-4" style={{ color: "var(--neo-muted-text)" }}>
            Belum ada chat
          </p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center gap-2 p-2 rounded-md cursor-pointer group ${
                activeId === chat.id
                  ? "bg-[var(--neo-border-color)] text-[var(--neo-card-bg)]"
                  : "hover:opacity-80"
              }`}
              onClick={() => {
                setActiveId(chat.id);
                if (chat.model) {
                  setSelectedModel(chat.model);
                  localStorage.setItem(MODEL_KEY, chat.model);
                }
                setShowMobileRiwayat(false);
              }}
            >
              <MessageSquare className="size-3.5 shrink-0" />
              <span className="text-xs font-mono font-medium truncate flex-1">{chat.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteChat(chat.id); }}
                className="opacity-0 group-hover:opacity-100 shrink-0"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // ===================== RENDER =====================
  return (
    <div className="h-screen flex">
      {/* Desktop sidebar — riwayat */}
      <div
        className="hidden sm:flex flex-col shrink-0 w-56 border-r-2 bg-[var(--neo-card-bg)]"
        style={{ borderColor: "var(--neo-border-color)" }}
      >
        {riwayatContent}
      </div>

      {/* Mobile right sidebar — riwayat */}
      {showMobileRiwayat && (
        <>
          <div
            className="sm:hidden fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowMobileRiwayat(false)}
          />
          <div
            className="sm:hidden fixed top-0 right-0 bottom-0 w-72 z-50 border-l-2 bg-[var(--neo-card-bg)] animate-slide-left"
            style={{ borderColor: "var(--neo-border-color)" }}
          >
            {riwayatContent}
          </div>
        </>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {activeChat ? (
          <>
            {/* Mobile: riwayat toggle + model info */}
            <div
              className="sm:hidden flex items-center justify-between p-2 border-b-2"
              style={{ borderColor: "var(--neo-border-color)" }}
            >
              <span className="font-mono text-xs flex items-center gap-1.5" style={{ color: "var(--neo-muted-text)" }}>
                <Sparkles className="size-3 text-orange-500" /> {modelName}
              </span>
              <button
                onClick={() => setShowMobileRiwayat(true)}
                className="neo-btn px-3 py-1.5 font-mono text-xs flex items-center gap-1.5 bg-[var(--neo-card-bg)]"
              >
                <History className="size-3.5" /> Riwayat ({chats.length})
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll"
              style={{ maxHeight: "calc(100vh - 10rem)" }}
            >
              {activeChat.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[var(--neo-border-color)] text-[var(--neo-card-bg)] font-mono"
                        : "neo-card p-3"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Model Picker above input */}
            <div
              className="px-3 pt-2 pb-0"
            >
              <div className="relative">
                <button
                  onClick={() => setShowModelPicker(!showModelPicker)}
                  className="neo-btn w-full px-3 py-1.5 font-mono text-xs flex items-center justify-between gap-1 bg-[var(--neo-card-bg)]"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="size-3 text-orange-500" />
                    <span className="truncate">{modelName}</span>
                  </span>
                  <ChevronDown className="size-3 shrink-0" />
                </button>
                {showModelPicker && (
                  <div
                    className="absolute bottom-full left-0 right-0 z-10 mb-1 neo-border rounded-md bg-[var(--neo-card-bg)] overflow-hidden max-h-60 overflow-y-auto"
                    style={{ boxShadow: "3px 3px 0px var(--neo-shadow-color)" }}
                  >
                    {models.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleSelectModel(m.id)}
                        className={`w-full px-3 py-2 font-mono text-xs text-left hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors ${
                          m.id === selectedModel
                            ? "bg-orange-50 dark:bg-orange-950 font-bold text-orange-600 dark:text-orange-400"
                            : ""
                        }`}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Input */}
            <div
              className="p-3 border-t-2"
              style={{ borderColor: "var(--neo-border-color)" }}
            >
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pesan..."
                  disabled={sending}
                  className="neo-border rounded-lg flex-1 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-[var(--neo-card-bg)]"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  className={`neo-btn px-4 py-2 font-mono font-medium text-sm flex items-center gap-2 shrink-0 ${
                    !input.trim() || sending
                      ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed shadow-none"
                      : "bg-[var(--neo-border-color)] text-[var(--neo-card-bg)]"
                  }`}
                >
                  {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Welcome — with input */
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center max-w-sm">
                <div className="inline-flex items-center justify-center neo-border rounded-xl p-4 bg-orange-50 dark:bg-orange-950 mb-4">
                  <Sparkles className="size-10 text-orange-500" />
                </div>
                <h2 className="text-xl sm:text-2xl font-mono font-bold mb-2">AI Chat</h2>
                <p className="font-mono text-sm mb-4" style={{ color: "var(--neo-muted-text)" }}>
                  Chat gratis tanpa login. Ketik pesan di bawah untuk mulai.
                </p>
                <div className="neo-card p-4 text-left">
                  <h3 className="font-mono font-bold text-xs mb-2 flex items-center gap-1.5">
                    <Sparkles className="size-3 text-orange-500" /> Model: {modelName}
                  </h3>
                  <ul className="space-y-1 text-xs font-mono" style={{ color: "var(--neo-muted-text)" }}>
                    <li className="flex items-center gap-1.5"><span className="text-orange-500">•</span> 24 model AI premium</li>
                    <li className="flex items-center gap-1.5"><span className="text-orange-500">•</span> Tanpa login</li>
                    <li className="flex items-center gap-1.5"><span className="text-orange-500">•</span> Gratis via ChatDay</li>
                  </ul>
                </div>
                {/* Mobile riwayat button on welcome */}
                <button
                  onClick={() => setShowMobileRiwayat(true)}
                  className="sm:hidden neo-btn mt-4 px-4 py-2 font-mono text-xs flex items-center gap-1.5 mx-auto bg-[var(--neo-card-bg)]"
                >
                  <History className="size-3.5" /> Lihat Riwayat ({chats.length})
                </button>
              </div>
            </div>

            {/* Model Picker above input */}
            <div className="px-3 pt-2 pb-0">
              <div className="relative">
                <button
                  onClick={() => setShowModelPicker(!showModelPicker)}
                  className="neo-btn w-full px-3 py-1.5 font-mono text-xs flex items-center justify-between gap-1 bg-[var(--neo-card-bg)]"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="size-3 text-orange-500" />
                    <span className="truncate">{modelName}</span>
                  </span>
                  <ChevronDown className="size-3 shrink-0" />
                </button>
                {showModelPicker && (
                  <div
                    className="absolute bottom-full left-0 right-0 z-10 mb-1 neo-border rounded-md bg-[var(--neo-card-bg)] overflow-hidden max-h-60 overflow-y-auto"
                    style={{ boxShadow: "3px 3px 0px var(--neo-shadow-color)" }}
                  >
                    {models.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleSelectModel(m.id)}
                        className={`w-full px-3 py-2 font-mono text-xs text-left hover:bg-orange-50 dark:hover:bg-orange-950 transition-colors ${
                          m.id === selectedModel
                            ? "bg-orange-50 dark:bg-orange-950 font-bold text-orange-600 dark:text-orange-400"
                            : ""
                        }`}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Input at bottom */}
            <div className="p-3 border-t-2" style={{ borderColor: "var(--neo-border-color)" }}>
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pesan untuk mulai chat..."
                  disabled={sending}
                  autoFocus
                  className="neo-border rounded-lg flex-1 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-[var(--neo-card-bg)]"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  className={`neo-btn px-4 py-2 font-mono font-medium text-sm flex items-center gap-2 shrink-0 ${
                    !input.trim() || sending
                      ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed shadow-none"
                      : "bg-[var(--neo-border-color)] text-[var(--neo-card-bg)]"
                  }`}
                >
                  {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
