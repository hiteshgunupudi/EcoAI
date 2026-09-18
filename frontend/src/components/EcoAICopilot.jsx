import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  CheckCircle2,
  Leaf,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";

const API_URL = "https://ecoai-backend-5fgd.onrender.com";

function EcoAICopilot() {
  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text:
        "Hi! I'm EcoAI 🌱 I can help you understand your carbon footprint and suggest practical sustainable actions.",
    },
  ]);

  const [activities, setActivities] = useState([]);

  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  // =========================
  // Load Activities
  // =========================

  async function loadActivities() {
    try {
      const response = await fetch(
        `${API_URL}/activities`
      );

      if (!response.ok) {
        throw new Error("Failed to load activities");
      }

      const data = await response.json();

      setActivities(
        data.activities || []
      );
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadActivities();
  }, []);

  // =========================
  // Activity Context
  // =========================

  const totalCarbon = useMemo(() => {
    return activities.reduce(
      (total, activity) =>
        total +
        Number(activity.carbon_kg || 0),
      0
    );
  }, [activities]);

  const categoryImpacts = useMemo(() => {
    const result = {};

    activities.forEach((activity) => {
      const category =
        activity.category;

      result[category] =
        (result[category] || 0) +
        Number(
          activity.carbon_kg || 0
        );
    });

    return result;
  }, [activities]);

  // =========================
  // Scroll to Latest Message
  // =========================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =========================
  // Send Message
  // =========================

  async function sendMessage(customMessage = null) {
    const text =
      customMessage !== null
        ? customMessage
        : message.trim();

    if (!text || sending) {
      return;
    }

    setMessages((previous) => [
      ...previous,
      {
        id: Date.now(),
        sender: "user",
        text,
      },
    ]);

    setMessage("");

    setSending(true);

    try {
      const response = await fetch(
        `${API_URL}/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: text,
            total_carbon: Number(
              totalCarbon.toFixed(2)
            ),
            category_impacts:
              categoryImpacts,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "AI service unavailable"
        );
      }

      const data =
        await response.json();

      const aiText =
        data.response?.message ||
        "I couldn't generate a response right now.";

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: aiText,
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          sender: "ai",
          text:
            "I'm having trouble connecting to the EcoAI service. Please make sure the backend is running.",
          error: true,
        },
      ]);

      console.error(error);
    } finally {
      setSending(false);
    }
  }

  const quickQuestions = [
    "How can I reduce my carbon footprint?",
    "What should I improve?",
    "Give me a sustainable transport tip",
  ];

  return (
    <>
      {/* =========================================
          Floating Button
      ========================================= */}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400 text-[#062018] shadow-2xl shadow-emerald-400/25 transition hover:scale-105 hover:bg-emerald-300"
          aria-label="Open EcoAI Copilot"
        >
          <MessageCircle size={26} />

          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-[9px] font-black text-[#062018]">
            AI
          </span>
        </button>
      )}

      {/* =========================================
          Chat Window
      ========================================= */}

      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[min(680px,calc(100vh-40px))] w-[min(420px,calc(100vw-40px))] flex-col overflow-hidden rounded-[2rem] border border-emerald-400/15 bg-[#071a15] shadow-2xl shadow-black/50">

          {/* Header */}

          <div className="relative border-b border-white/5 bg-gradient-to-r from-emerald-500/10 to-transparent px-5 py-4">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400 text-[#062018] shadow-lg shadow-emerald-400/20">
                  <Bot size={22} />
                </div>

                <div>

                  <div className="flex items-center gap-2">

                    <h3 className="font-bold">
                      EcoAI Copilot
                    </h3>

                    <span className="flex h-2 w-2 rounded-full bg-emerald-400" />

                  </div>

                  <p className="text-[11px] text-white/35">
                    AI Sustainability Assistant
                  </p>

                </div>

              </div>

              <button
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/40 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>

            </div>

          </div>

          {/* Context */}

          <div className="border-b border-white/5 bg-emerald-400/[0.03] px-5 py-3">

            <div className="flex items-center gap-2 text-[11px] text-emerald-300/70">

              <Sparkles size={13} />

              <span>
                Analyzing your tracked activities
              </span>

            </div>

            <p className="mt-1 text-[10px] text-white/25">

              {activities.length} activities •{" "}
              {totalCarbon.toFixed(2)} kg CO₂e tracked

            </p>

          </div>

          {/* Messages */}

          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">

            {messages.map((item) => (

              <div
                key={item.id}
                className={`flex gap-3 ${
                  item.sender === "user"
                    ? "flex-row-reverse"
                    : ""
                }`}
              >

                {/* Avatar */}

                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                    item.sender === "user"
                      ? "bg-white/10 text-white/60"
                      : "bg-emerald-400/10 text-emerald-300"
                  }`}
                >

                  {item.sender === "user" ? (
                    <User size={15} />
                  ) : (
                    <Leaf size={15} />
                  )}

                </div>

                {/* Bubble */}

                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    item.sender === "user"
                      ? "rounded-tr-md bg-emerald-400 text-[#062018]"
                      : item.error
                        ? "rounded-tl-md border border-red-400/10 bg-red-400/5 text-red-300"
                        : "rounded-tl-md border border-white/5 bg-white/[0.035] text-white/65"
                  }`}
                >

                  {item.text}

                </div>

              </div>

            ))}

            {/* Typing */}

            {sending && (

              <div className="flex gap-3">

                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <Bot size={15} />
                </div>

                <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-white/5 bg-white/[0.035] px-4 py-3">

                  <Loader2
                    size={14}
                    className="animate-spin text-emerald-300"
                  />

                  <span className="text-xs text-white/30">
                    EcoAI is thinking...
                  </span>

                </div>

              </div>

            )}

            <div ref={messagesEndRef} />

          </div>

          {/* Quick Questions */}

          {!sending && messages.length <= 1 && (

            <div className="px-5 pb-3">

              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-white/20">
                Try asking
              </p>

              <div className="flex flex-wrap gap-2">

                {quickQuestions.map(
                  (question) => (

                    <button
                      key={question}
                      onClick={() =>
                        sendMessage(question)
                      }
                      className="rounded-xl border border-white/5 bg-white/[0.025] px-3 py-2 text-left text-[10px] text-white/40 transition hover:border-emerald-400/20 hover:bg-emerald-400/5 hover:text-emerald-300"
                    >
                      {question}
                    </button>

                  )
                )}

              </div>

            </div>

          )}

          {/* Input */}

          <div className="border-t border-white/5 bg-black/10 p-4">

            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.03] p-1.5 focus-within:border-emerald-400/20"
            >

              <input
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder="Ask EcoAI anything..."
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/20"
              />

              <button
                type="submit"
                disabled={
                  !message.trim() || sending
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-[#062018] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <Send size={16} />
              </button>

            </form>

            <div className="mt-2 flex items-center justify-center gap-1.5 text-[9px] text-white/15">

              <CheckCircle2 size={10} />

              AI-generated sustainability guidance

            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default EcoAICopilot;