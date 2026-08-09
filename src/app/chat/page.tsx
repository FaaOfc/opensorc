"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  MessageSquare,
  Send,
  Loader2,
  Plus,
  Trash2,
  LogIn,
  UserPlus,
  LogOut,
  X,
  KeyRound,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// ===================== AUTH STATE =====================
interface AuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
}

interface ChatInfo {
  id: string;
  title: string;
  messages: { id: string; role: string; content: string; createdAt: string }[];
}

// ===================== MAIN COMPONENT =====================
export default function ChatPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null);
  const [chats, setChats] = useState<ChatInfo[]>([]);
  const [activeChat, setActiveChat] = useState<ChatInfo | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load user from sessionStorage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("nefu_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {}
    }
  }, []);

  // Load chats when user changes
  useEffect(() => {
    if (user) {
      loadChats();
      setShowAuth(null);
    } else {
      setChats([]);
      setActiveChat(null);
    }
  }, [user?.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages?.length]);

  const loadChats = async () => {
    if (!user) return;
    setLoadingChats(true);
    try {
      const res = await fetch(`/api/chats?userId=${user.id}`);
      const data = await res.json();
      if (data.chats) setChats(data.chats);
    } catch {}
    setLoadingChats(false);
  };

  const handleSend = useCallback(async () => {
    if (!input.trim() || !user || sending) return;
    const msg = input.trim();
    setInput("");
    setSending(true);

    // Optimistically add user message
    let currentChat = activeChat;
    if (!currentChat) {
      currentChat = {
        id: "",
        title: msg.slice(0, 50),
        messages: [{ id: "tmp", role: "user", content: msg, createdAt: new Date().toISOString() }],
      };
      setActiveChat(currentChat);
    } else {
      const updated = {
        ...currentChat,
        messages: [
          ...currentChat.messages,
          { id: "tmp2", role: "user", content: msg, createdAt: new Date().toISOString() },
        ],
      };
      setActiveChat(updated);
      currentChat = updated;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          chatId: currentChat.id || undefined,
          message: msg,
        }),
      });

      const data = await res.json();

      if (data.chatId) {
        // Reload chats to get fresh data
        await loadChats();
        const freshChat = chats.find((c) => c.id === data.chatId);
        if (freshChat) {
          setActiveChat({
            ...freshChat,
            messages: [
              ...freshChat.messages,
              { id: "tmp3", role: "user", content: msg, createdAt: new Date().toISOString() },
              { id: "ai", role: "assistant", content: data.content, createdAt: new Date().toISOString() },
            ],
          });
        } else {
          // New chat created, reload
          const chatsRes = await fetch(`/api/chats?userId=${user.id}`);
          const chatsData = await chatsRes.json();
          if (chatsData.chats) {
            setChats(chatsData.chats);
            const newChat = chatsData.chats.find((c: ChatInfo) => c.id === data.chatId);
            if (newChat) setActiveChat(newChat);
          }
        }
      }
    } catch {
      // Add error message
      if (activeChat) {
        setActiveChat({
          ...activeChat,
          messages: [
            ...activeChat.messages,
            { id: "err", role: "assistant", content: "Gagal menghubungi server.", createdAt: new Date().toISOString() },
          ],
        });
      }
    } finally {
      setSending(false);
    }
  }, [input, user, sending, activeChat, chats]);

  const handleDeleteChat = async (chatId: string) => {
    if (!user) return;
    await fetch(`/api/chats?chatId=${chatId}&userId=${user.id}`, { method: "DELETE" });
    if (activeChat?.id === chatId) setActiveChat(null);
    await loadChats();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("nefu_user");
    setUser(null);
    setActiveChat(null);
    setChats([]);
  };

  const handleNewChat = () => {
    setActiveChat(null);
  };

  // ===================== NOT LOGGED IN =====================
  if (!user) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center neo-border rounded-xl p-3 bg-orange-50 dark:bg-orange-950 mb-4">
              <MessageSquare className="size-8 text-orange-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold mb-1">
              AI Chat
            </h1>
            <p className="text-sm font-mono" style={{ color: "var(--neo-muted-text)" }}>
              Login atau buat akun untuk mulai chat
            </p>
          </div>

          <div className="neo-card p-5 flex flex-col gap-3">
            <button
              onClick={() => setShowAuth("login")}
              className="neo-btn bg-[var(--neo-border-color)] text-[var(--neo-card-bg)] py-3 font-mono font-medium text-sm flex items-center justify-center gap-2 shadow-none translate-x-[3px] translate-y-[3px]"
            >
              <LogIn className="size-4" /> Login
            </button>
            <button
              onClick={() => setShowAuth("register")}
              className="neo-btn bg-[var(--neo-card-bg)] py-3 font-mono font-medium text-sm flex items-center justify-center gap-2"
            >
              <UserPlus className="size-4" /> Buat Akun
            </button>
          </div>

          <div className="mt-4 neo-card p-4">
            <h3 className="font-mono font-bold text-sm mb-2 flex items-center gap-2">
              <KeyRound className="size-4 text-orange-500" /> Fitur AI Chat
            </h3>
            <ul className="space-y-1.5 text-xs font-mono" style={{ color: "var(--neo-muted-text)" }}>
              <li>• Chat dengan AI (Gemini / OpenRouter)</li>
              <li>• Riwayat chat tersimpan</li>
              <li>• Multiple chat sessions</li>
              <li>• Markdown formatting</li>
            </ul>
          </div>

          {/* Auth Modals */}
          {showAuth && (
            <AuthModal
              mode={showAuth}
              onClose={() => setShowAuth(null)}
              onAuth={(u) => {
                setUser(u);
                sessionStorage.setItem("nefu_user", JSON.stringify(u));
              }}
            />
          )}
        </div>
      </div>
    );
  }

  // ===================== LOGGED IN =====================
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col sm:flex-row">
      {/* Sidebar */}
      <div className="w-full sm:w-64 border-b-2 sm:border-b-0 sm:border-r-2 flex flex-col" style={{ borderColor: "var(--neo-border-color)" }}>
        <div className="p-3 flex items-center justify-between border-b-2" style={{ borderColor: "var(--neo-border-color)" }}>
          <span className="font-mono font-bold text-sm truncate">
            Halo, {user.name}!
          </span>
          <div className="flex gap-1">
            <button
              onClick={handleNewChat}
              className="neo-btn p-1.5 bg-[var(--neo-card-bg)]"
              title="New chat"
            >
              <Plus className="size-4" />
            </button>
            <button
              onClick={handleLogout}
              className="neo-btn p-1.5 bg-[var(--neo-card-bg)]"
              title="Logout"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1" style={{ maxHeight: "calc(100vh - 8rem)" }}>
          {loadingChats ? (
            <div className="flex justify-center py-4">
              <Loader2 className="size-5 animate-spin" style={{ color: "var(--neo-muted-text)" }} />
            </div>
          ) : chats.length === 0 ? (
            <p className="text-xs font-mono text-center py-4" style={{ color: "var(--neo-muted-text)" }}>
              Belum ada chat
            </p>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer group ${
                  activeChat?.id === chat.id
                    ? "bg-[var(--neo-border-color)] text-[var(--neo-card-bg)]"
                    : "hover:opacity-80"
                }`}
                onClick={() => setActiveChat(chat)}
              >
                <MessageSquare className="size-3.5 shrink-0" />
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

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {activeChat || !chats.length ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scroll" style={{ maxHeight: "calc(100vh - 10rem)" }}>
              {(activeChat?.messages || []).map((msg, i) => (
                <div
                  key={msg.id || i}
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

            {/* Input */}
            <div className="p-3 border-t-2" style={{ borderColor: "var(--neo-border-color)" }}>
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
          /* No active chat */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare
                className="size-12 mx-auto mb-3 opacity-20"
              />
              <p className="font-mono text-sm" style={{ color: "var(--neo-muted-text)" }}>
                Pilih chat atau buat baru
              </p>
              <button
                onClick={handleNewChat}
                className="neo-btn mt-3 px-4 py-2 font-mono font-medium text-sm bg-[var(--neo-card-bg)] flex items-center gap-2 mx-auto"
              >
                <Plus className="size-4" /> Chat Baru
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ===================== AUTH MODAL =====================
function AuthModal({
  mode,
  onClose,
  onAuth,
}: {
  mode: "login" | "register";
  onClose: () => void;
  onAuth: (user: AuthUser) => void;
}) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const body =
        mode === "login"
          ? { username, password }
          : { username, name, email, password };

      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal");
        return;
      }

      onAuth(data);
    } catch {
      setError("Gagal menghubungi server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="neo-card p-5 sm:p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono font-bold text-lg">
            {mode === "login" ? "Login" : "Buat Akun"}
          </h2>
          <button onClick={onClose} className="neo-btn p-1.5 bg-[var(--neo-card-bg)]">
            <X className="size-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="font-mono text-xs font-bold mb-1 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="neo-border rounded-md w-full px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-[var(--neo-card-bg)]"
            />
          </div>

          {mode === "register" && (
            <>
              <div>
                <label className="font-mono text-xs font-bold mb-1 block">Nama</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="neo-border rounded-md w-full px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-[var(--neo-card-bg)]"
                />
              </div>
              <div>
                <label className="font-mono text-xs font-bold mb-1 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="neo-border rounded-md w-full px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-[var(--neo-card-bg)]"
                />
              </div>
            </>
          )}

          <div>
            <label className="font-mono text-xs font-bold mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="neo-border rounded-md w-full px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-[var(--neo-card-bg)]"
            />
            {mode === "register" && (
              <p className="text-xs font-mono mt-1" style={{ color: "var(--neo-muted-text)" }}>
                Minimal 6 karakter
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="neo-btn w-full py-2.5 font-mono font-medium text-sm flex items-center justify-center gap-2 bg-[var(--neo-border-color)] text-[var(--neo-card-bg)]"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : mode === "login" ? (
              <>
                <LogIn className="size-4" /> Login
              </>
            ) : (
              <>
                <UserPlus className="size-4" /> Buat Akun
              </>
            )}
          </button>
        </form>

        {error && (
          <p className="mt-3 font-mono text-xs text-red-500 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
