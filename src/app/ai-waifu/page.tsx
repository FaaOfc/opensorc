"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Heart,
  Send,
  Loader2,
  Plus,
  Trash2,
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
  character: string;
  messages: Msg[];
  createdAt: number;
}

const STORAGE_KEY = "nefu_waifu_chats";
const CHARACTER_KEY = "nefu_waifu_character";

// ===================== PRESET CHARACTERS =====================
const PRESET_CHARACTERS = [
  {
    id: "hutao",
    name: "Hu Tao",
    emoji: "🔥",
    prompt:
      "Kamu adalah Hu Tao, Director ke-77 dari Wangsheng Funeral Parlor di Liyue. Kamu ceria, suka bercanda, dan punya humor gelap yang unik. Kamu bicara dengan gaya cheerful dan kadang sedikit creepy tapi tetap menggemaskan. Gunakan bahasa Indonesia yang kasual dan friendly.",
  },
  {
    id: "nahida",
    name: "Nahida",
    emoji: "🌿",
    prompt:
      "Kamu adalah Nahida, Dendro Archon yang dikenal sebagai Lesser Lord Kusanali dari Sumeru. Kamu bijaksana, lembut, dan penuh rasa ingin tahu tentang dunia. Kamu bicara dengan nada yang tenang dan penuh kasih sayang. Gunakan bahasa Indonesia yang lembut dan penuh hikmah.",
  },
  {
    id: "rai",
    name: "Ai Hoshino",
    emoji: "⭐",
    prompt:
      "Kamu adalah Ai Hoshino, seorang idol terkenal dari grup B-Komachi. Kamu penuh karisma, ekspresif, dan selalu menyebarkan cinta. Kamu punya sisi rentan di balik senyummu yang sempurna. Kamu suka mengatakan 'I love you!' dengan tulus. Gunakan bahasa Indonesia yang energetik.",
  },
  {
    id: "zero-two",
    name: "Zero Two",
    emoji: "🦕",
    prompt:
      "Kamu adalah Zero Two, seorang parasite dengan daruh Klaxosaurus dari Darling in the Franxx. Kamu berani, dominan, suka memanggil orang 'darling', dan punya sisi tsundere. Kamu bicara dengan gaya yang confident dan sedikit provokatif. Gunakan bahasa Indonesia yang tegas tapi playful.",
  },
  {
    id: "marin",
    name: "Marin Kitagawa",
    emoji: "🎀",
    prompt:
      "Kamu adalah Marin Kitagawa, seorang gyaru yang passionate tentang cosplay dari My Dress-Up Darling. Kamu energetik, friendly, dan sangat excited tentang hobi cosplay-mu. Kamu bicara dengan gaya kasual gen Z dan penuh semangat. Gunakan bahasa Indonesia yang kasual dan fun.",
  },
  {
    id: "shinobu",
    name: "Shinobu Kocho",
    emoji: "🦋",
    prompt:
      "Kamu adalah Shinobu Kocho, Hashira Serangga dari Demon Slayer. Kamu selalu tersenyum manis tapi sebenarnya sangat marah di dalam. Kamu bicara dengan nada yang sopan dan lembut, tapi dengan sarkasme halus. Gunakan bahasa Indonesia yang elegan dan sedikit menyiratkan ironi.",
  },
  {
    id: "custom",
    name: "Custom Character",
    emoji: "✨",
    prompt: "",
  },
];

// ===================== MAIN =====================
export default function AiWaifuPage() {
  const [chats, setChats] = useState<LocalChat[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState("hutao");
  const [customPrompt, setCustomPrompt] = useState("");
  const [showCharPicker, setShowCharPicker] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find((c) => c.id === activeId) || null;
  const currentChar = PRESET_CHARACTERS.find((c) => c.id === selectedCharacter) || PRESET_CHARACTERS[0];
  const characterPrompt = selectedCharacter === "custom" ? customPrompt : currentChar.prompt;

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setChats(JSON.parse(stored));
      const savedChar = localStorage.getItem(CHARACTER_KEY);
      if (savedChar) setSelectedCharacter(savedChar);
    } catch {}
    setLoaded(true);
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

  const handleSend = useCallback(async () => {
    if (!input.trim() || sending) return;
    if (!characterPrompt.trim()) {
      alert("Isi dulu definisi karakternya!");
      return;
    }
    const msg = input.trim();
    setInput("");
    setSending(true);

    let chatId = activeId;
    let updatedChats = [...chats];

    if (!chatId) {
      const newChat: LocalChat = {
        id: Date.now().toString(),
        title: msg.slice(0, 40),
        character: selectedCharacter,
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

    try {
      const res = await fetch("/api/waifu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: characterPrompt, query: msg }),
      });

      const data = await res.json();

      if (data.error) {
        setChats((prev) =>
          prev.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    { role: "assistant" as const, content: `⚠️ ${data.error}` },
                  ],
                }
              : c
          )
        );
      } else if (data.content) {
        setChats((prev) =>
          prev.map((c) =>
            c.id === chatId
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    { role: "assistant" as const, content: data.content },
                  ],
                }
              : c
          )
        );
      }
    } catch {
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { role: "assistant" as const, content: "❌ Gagal menghubungi server." },
                ],
              }
            : c
        )
      );
    } finally {
      setSending(false);
    }
  }, [input, sending, activeId, chats, selectedCharacter, characterPrompt]);

  const handleNewChat = () => setActiveId(null);

  const handleDeleteChat = (id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const handleSelectCharacter = (id: string) => {
    setSelectedCharacter(id);
    localStorage.setItem(CHARACTER_KEY, id);
    setShowCharPicker(false);
  };

  // ===================== RENDER =====================
  return (
    <div className="h-screen flex">
      {/* Sidebar — always on desktop, toggle on mobile */}
      <div
        className={`sm:flex flex-col shrink-0 sm:w-56 w-64 border-r-2 bg-[var(--neo-card-bg)] ${showMobileSidebar ? "flex fixed inset-y left-0 z-50" : "hidden"} sm:relative sm:z-auto`}
        style={{ borderColor: "var(--neo-border-color)" }}
      >
        <div
          className="p-3 flex items-center justify-between border-b-2"
          style={{ borderColor: "var(--neo-border-color)" }}
        >
          <span className="font-mono font-bold text-sm flex items-center gap-1.5">
            <Heart className="size-4 text-teal-500" /> AI Waifu
          </span>
          {/* Mobile close button */}
          <button
            onClick={() => setShowMobileSidebar(false)}
            className="sm:hidden neo-btn p-1.5 bg-[var(--neo-card-bg)]"
          >
            <X className="size-4" />
          </button>
          <button
            onClick={handleNewChat}
            className="neo-btn p-1.5 bg-[var(--neo-card-bg)]"
            title="New chat"
          >
            <Plus className="size-4" />
          </button>
        </div>

        {/* Character Picker */}
        <div
          className="p-2 border-b-2"
          style={{ borderColor: "var(--neo-border-color)" }}
        >
          <button
            onClick={() => setShowCharPicker(!showCharPicker)}
            className="neo-btn w-full px-3 py-1.5 font-mono text-xs flex items-center justify-between gap-1 bg-[var(--neo-card-bg)]"
          >
            <span className="truncate flex items-center gap-1.5">
              <span>{currentChar.emoji}</span> {currentChar.name}
            </span>
          </button>
          {showCharPicker && (
            <div
              className="mt-1 neo-border rounded-md bg-[var(--neo-card-bg)] overflow-hidden"
              style={{ boxShadow: "3px 3px 0px var(--neo-shadow-color)" }}
            >
              {PRESET_CHARACTERS.map((char) => (
                <button
                  key={char.id}
                  onClick={() => handleSelectCharacter(char.id)}
                  className={`w-full px-3 py-2 font-mono text-xs text-left hover:bg-teal-50 dark:hover:bg-teal-950 transition-colors ${
                    char.id === selectedCharacter
                      ? "bg-teal-50 dark:bg-teal-950 font-bold text-teal-600 dark:text-teal-400"
                      : ""
                  }`}
                >
                  {char.emoji} {char.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Custom character prompt */}
        {selectedCharacter === "custom" && (
          <div
            className="p-2 border-b-2"
            style={{ borderColor: "var(--neo-border-color)" }}
          >
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Tulis definisi karakter di sini... Contoh: Kamu adalah Rei Ayanami, seorang pilot EVA yang pendiam dan misterius..."
              className="neo-border rounded-lg w-full px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-teal-300 bg-[var(--neo-card-bg)] resize-none h-24"
            />
          </div>
        )}

        {/* Chat list */}
        <div
          className="flex-1 overflow-y-auto p-2 space-y-1"
          style={{ maxHeight: "calc(100vh - 14rem)" }}
        >
          {chats.length === 0 ? (
            <p
              className="text-xs font-mono text-center py-4"
              style={{ color: "var(--neo-muted-text)" }}
            >
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
                  if (chat.character) {
                    setSelectedCharacter(chat.character);
                    localStorage.setItem(CHARACTER_KEY, chat.character);
                  }
                }}
              >
                <Heart className="size-3.5 shrink-0 text-teal-500" />
                <span className="text-xs font-mono font-medium truncate flex-1">
                  {chat.title}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 shrink-0"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile overlay */}
      {showMobileSidebar && (
        <div className="sm:hidden fixed inset-0 bg-black/30 z-40" onClick={() => setShowMobileSidebar(false)} />
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {activeChat ? (
          <>
            {/* Mobile history toggle */}
            <div className="sm:hidden flex items-center gap-2 p-2 border-b-2" style={{ borderColor: "var(--neo-border-color)" }}>
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="neo-btn px-3 py-1.5 font-mono text-xs flex items-center gap-1.5 bg-[var(--neo-card-bg)]"
              >
                <History className="size-3.5" /> Tampilkan Riwayat
              </button>
              <span className="font-mono text-xs" style={{ color: "var(--neo-muted-text)" }}>{chats.length} chat</span>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll"
              style={{ maxHeight: "calc(100vh - 10rem)" }}
            >
              {activeChat.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  } animate-fade-in-up`}
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

            {/* Input */}
            <div
              className="p-3 border-t-2"
              style={{ borderColor: "var(--neo-border-color)" }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Chat dengan ${currentChar.name}...`}
                  disabled={sending}
                  className="neo-border rounded-lg flex-1 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 bg-[var(--neo-card-bg)]"
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
                  {sending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Welcome screen */
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center max-w-sm">
                <div className="inline-flex items-center justify-center neo-border rounded-xl p-4 bg-teal-50 dark:bg-teal-950 mb-4">
                  <Heart className="size-10 text-teal-500" />
                </div>
                <h2 className="text-xl sm:text-2xl font-mono font-bold mb-2">
                  AI Waifu
                </h2>
                <p
                  className="font-mono text-sm mb-4"
                  style={{ color: "var(--neo-muted-text)" }}
                >
                  Chat dengan karakter waifu favoritmu. Pilih karakter atau buat custom.
                </p>
                <div className="neo-card p-4 text-left">
                  <h3 className="font-mono font-bold text-xs mb-2 flex items-center gap-1.5">
                    <Heart className="size-3 text-teal-500" /> Karakter: {currentChar.emoji} {currentChar.name}
                  </h3>
                  <ul
                    className="space-y-1 text-xs font-mono"
                    style={{ color: "var(--neo-muted-text)" }}
                  >
                    <li className="flex items-center gap-1.5">
                      <span className="text-teal-500">•</span> 6 preset karakter
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-teal-500">•</span> Custom character support
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-teal-500">•</span> Gratis tanpa login
                    </li>
                  </ul>
                </div>

                {/* Character cards grid */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {PRESET_CHARACTERS.filter((c) => c.id !== "custom").map((char) => (
                    <button
                      key={char.id}
                      onClick={() => handleSelectCharacter(char.id)}
                      className={`neo-border rounded-lg p-2 text-center transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] ${
                        char.id === selectedCharacter
                          ? "bg-teal-50 dark:bg-teal-950 border-teal-500"
                          : "bg-[var(--neo-card-bg)]"
                      }`}
                    >
                      <div className="text-lg mb-0.5">{char.emoji}</div>
                      <div className="font-mono text-[10px] font-bold">{char.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input at bottom of welcome screen */}
            {selectedCharacter === "custom" && !customPrompt.trim() ? (
              <div
                className="p-3 border-t-2"
                style={{ borderColor: "var(--neo-border-color)" }}
              >
                <p className="text-xs font-mono text-center" style={{ color: "var(--neo-muted-text)" }}>
                  ✨ Tulis definisi karakter di sidebar dulu, lalu chat di sini
                </p>
              </div>
            ) : (
              <div
                className="p-3 border-t-2"
                style={{ borderColor: "var(--neo-border-color)" }}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ketik pesan untuk ${currentChar.name}...`}
                    disabled={sending}
                    autoFocus
                    className="neo-border rounded-lg flex-1 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-teal-300 bg-[var(--neo-card-bg)]"
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
                    {sending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
