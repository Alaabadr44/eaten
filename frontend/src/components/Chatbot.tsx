import { useState, useEffect, useRef } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { customAlphabet } from "nanoid";

import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

// ─── Markdown renderer ────────────────────────────────────────────────────────
marked.setOptions({ gfm: true, breaks: true });

function renderMarkdown(text: string): string {
  const raw = text.replace(/\\n|\/n/g, "\n");
  const html = marked.parse(raw) as string;
  return DOMPurify.sanitize(html);
}

// ─── Session helpers ──────────────────────────────────────────────────────────
const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const KEYS = {
  messages: "chat_messages",
  conversationId: "chat_conversation_id",
  timestamp: "chat_session_timestamp",
  isOpen: "chat_is_open",
};

function isSessionExpired(): boolean {
  const ts = localStorage.getItem(KEYS.timestamp);
  if (!ts) return false;
  return Date.now() - parseInt(ts, 10) > SESSION_EXPIRY_MS;
}

function wipeSession() {
  localStorage.removeItem(KEYS.messages);
  localStorage.removeItem(KEYS.conversationId);
  localStorage.removeItem(KEYS.timestamp);
}

const WELCOME: { text: string; isUser: boolean }[] = [
  { text: "Hi! How can I help you today?", isUser: false },
];

// ─── Component ────────────────────────────────────────────────────────────────
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState<boolean>(() => {
    try {
      return JSON.parse(localStorage.getItem(KEYS.isOpen) ?? "false");
    } catch {
      return false;
    }
  });

  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(() => {
    // On mount: immediately check & wipe expired sessions
    if (isSessionExpired()) {
      wipeSession();
      return WELCOME;
    }
    try {
      const saved = localStorage.getItem(KEYS.messages);
      return saved ? JSON.parse(saved) : WELCOME;
    } catch {
      return WELCOME;
    }
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>(() => {
    if (isSessionExpired()) return "";
    return localStorage.getItem(KEYS.conversationId) ?? "";
  });

  const scrollBottomRef = useRef<HTMLDivElement>(null);

  // ── Persist messages ────────────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(KEYS.messages, JSON.stringify(messages));
    scrollBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ── Persist chat-open state ─────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(KEYS.isOpen, JSON.stringify(isOpen));
  }, [isOpen]);

  // ── Scroll on open ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollBottomRef.current?.scrollIntoView({ behavior: "instant" });
      }, 100);
    }
  }, [isOpen]);

  // ── Background session expiry check (every 60 s) ────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      if (isSessionExpired()) {
        wipeSession();
        setMessages(WELCOME);
        setConversationId("");
      }
    }, 60_000);
    return () => clearInterval(timer);
  }, []);

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  const saveMessageToBackend = async (
    convId: string,
    message: string,
    sender: "USER" | "BOT"
  ) => {
    const API_URL = import.meta.env.VITE_API_URL || "/api";
    try {
      await fetch(`${API_URL}/chats/conversation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: convId, message, sender }),
      });
    } catch (err) {
      console.error("Failed to save message to backend", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    // Create or reuse conversation ID
    let convId = conversationId;
    if (!convId) {
      const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);
      convId = `conv_${nanoid()}`;
      setConversationId(convId);
      localStorage.setItem(KEYS.conversationId, convId);
      localStorage.setItem(KEYS.timestamp, Date.now().toString());
    }

    saveMessageToBackend(convId, userMessage, "USER");

    try {
      const CHAT_AI_URL =
        import.meta.env.VITE_CHAT_AI_URL || "http://192.168.1.78:9010/chat";

      const response = await fetch(CHAT_AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: convId,
          message: userMessage,
          history: [],
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      let botMessage = "I received your message but couldn't parse the response.";
      if (data.response && Array.isArray(data.response.messages)) {
        botMessage = data.response.messages.join("\n");
      } else if (typeof data.response === "string") {
        botMessage = data.response;
      } else if (data.message) {
        botMessage = data.message;
      } else {
        botMessage = JSON.stringify(data);
      }

      setMessages((prev) => [...prev, { text: botMessage, isUser: false }]);
      saveMessageToBackend(convId, botMessage, "BOT");
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I'm having trouble connecting to the AI right now.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Hide on admin routes
  if (window.location.pathname.startsWith("/admin")) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] bg-white rounded-lg shadow-2xl border overflow-hidden flex flex-col"
            style={{ maxHeight: "500px", height: "500px" }}
          >
            {/* Header */}
            <div className="bg-eaten-charcoal text-white p-4 flex justify-between items-center">
              <h3 className="font-bold">Eaten Support</h3>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 bg-gray-50">
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      dir="auto"
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.isUser
                          ? "bg-eaten-charcoal text-white rounded-tr-none"
                          : "bg-white text-gray-800 border rounded-tl-none shadow-sm"
                      }`}
                    >
                      {msg.isUser ? (
                        // User messages: plain text, no markdown
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      ) : (
                        // Bot messages: full markdown rendered as HTML
                        <div
                          className="prose prose-sm max-w-none
                            prose-p:my-1 prose-ul:my-1 prose-ol:my-1
                            prose-li:my-0 prose-headings:my-1
                            prose-a:text-blue-600 prose-a:underline"
                          dangerouslySetInnerHTML={{
                            __html: renderMarkdown(msg.text),
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 border rounded-tl-none shadow-sm p-3 rounded-lg">
                      <span className="animate-pulse text-sm">...</span>
                    </div>
                  </div>
                )}

                <div ref={scrollBottomRef} className="h-2" />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-3 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-eaten-charcoal/50 text-sm"
                  disabled={isLoading}
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="bg-eaten-charcoal hover:bg-eaten-dark"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-14 h-14 bg-eaten-charcoal hover:bg-eaten-dark shadow-xl flex items-center justify-center p-0"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </Button>
    </div>
  );
};

export default Chatbot;
