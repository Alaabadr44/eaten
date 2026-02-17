import { useState, useEffect, useRef } from "react";
import { customAlphabet } from "nanoid";

import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

interface Faq {
  id: string;
  question: string;
  answer: string;
}

interface ChatResponse {
  response: {
    messages: string[];
  };
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem("chat_is_open");
    return saved ? JSON.parse(saved) : false;
  });
  const [faqs] = useState<Faq[]>([]);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(() => {
    const saved = localStorage.getItem("chat_messages");
    return saved ? JSON.parse(saved) : [{ text: "Hi! How can I help you today?", isUser: false }];
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("chat_conversation_id");
    if (storedId) {
      setConversationId(storedId);
    }
  }, []);

  useEffect(() => {
    const storedId = localStorage.getItem("chat_conversation_id");
    if (storedId) {
      setConversationId(storedId);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chat_is_open", JSON.stringify(isOpen));
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);



  const saveMessageToBackend = async (conversationId: string, message: string, sender: "USER" | "BOT") => {
    const API_URL = import.meta.env.VITE_API_URL || "/api";
    try {
      await fetch(`${API_URL}/chats/conversation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message, sender }),
      });
    } catch (error) {
      console.error("Failed to save message to backend", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    let currentConversationId = conversationId;
    if (!currentConversationId) {
       const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 10);
       currentConversationId = `conv_${nanoid()}`;
       setConversationId(currentConversationId);
       localStorage.setItem("chat_conversation_id", currentConversationId);
    }

    // Save User message to backend
    saveMessageToBackend(currentConversationId, userMessage, "USER");

    try {
      const response = await fetch("http://192.168.1.78:9010/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: currentConversationId,
          message: userMessage, 
          history: [], 
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      // Parse response based on provided format: { response: { messages: ["..."] } }
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
      
      // Save AI message to backend
      saveMessageToBackend(currentConversationId, botMessage, "BOT");
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Sorry, I'm having trouble connecting to the AI right now.", isUser: false },
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

  const handleQuestionClick = (question: string, answer: string) => {
    // Optionally initiate flow with this question
    setMessages((prev) => [
      ...prev,
      { text: question, isUser: true },
      { text: answer, isUser: false },
    ]);
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
            <ScrollArea className="flex-1 p-4 bg-gray-50" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.isUser
                          ? "bg-eaten-charcoal text-white rounded-tr-none"
                          : "bg-white text-gray-800 border rounded-tl-none shadow-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 border rounded-tl-none shadow-sm p-3 rounded-lg">
                      <span className="animate-pulse">...</span>
                    </div>
                  </div>
                )}

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

            {/* FAQ Options */}
            <div className="p-4 bg-white border-t">
              <p className="text-xs text-gray-500 mb-2 font-medium">
                Common Questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {faqs.map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => handleQuestionClick(faq.question, faq.answer)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full transition-colors text-left"
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full w-14 h-14 bg-eaten-charcoal hover:bg-eaten-dark shadow-xl flex items-center justify-center p-0"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </Button>
    </div>
  );
};

export default Chatbot;
