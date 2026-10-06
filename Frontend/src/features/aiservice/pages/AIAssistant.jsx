import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ragSearch } from "../service/aiservice";
import PetCard from "../../Components/PetCard";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-white border border-border-brand rounded-2xl rounded-bl-sm w-fit">
      <span className="w-2 h-2 rounded-full bg-text-light animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2 h-2 rounded-full bg-text-light animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2 h-2 rounded-full bg-text-light animate-bounce" />
    </div>
  );
}

export default function AIAssistant() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending]);

  async function handleSend(e) {
    e?.preventDefault();

    const query = input.trim();

    if (!query || sending) {
      return;
    }

    setError("");
    setInput("");

    // Add user's message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: query,
      },
    ]);

    setSending(true);

    try {
      const data = await ragSearch(query);

      // Debug: check complete backend response
      console.log("FULL RAG RESPONSE:", data);

      const answer =
        data?.data?.answer ||
        "I couldn't find an answer to that.";

      // Get adoption posts from backend
      const posts = data?.data?.sources?.posts || [];

      // Get RAG knowledge sources from backend
      const knowledge = data?.data?.sources?.knowledge || [];

      console.log("RAG POSTS:", posts);
      console.log("RAG KNOWLEDGE SOURCES:", knowledge);

      // Only require _id for rendering
      const pets = posts.filter(
        (post) => post?._id
      );

      console.log("PETS TO RENDER:", pets);

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: answer,
          pets: pets,
          knowledge: knowledge,
        },
      ]);
    } catch (err) {
      console.error("RAG SEARCH ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="min-h-screen bg-cream flex justify-center px-4 py-8">
      <div className="w-full max-w-2xl h-[calc(100vh-4rem)] bg-white border border-border-brand rounded-3xl shadow-sm flex flex-col overflow-hidden">

        {/* ================= HEADER ================= */}

        <div className="flex items-center gap-3 p-5 border-b border-border-brand">

          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-text-mid hover:bg-warm transition-colors"
            aria-label="Go back"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="w-9 h-9 rounded-full bg-rust flex items-center justify-center text-white text-sm font-semibold">
            AI
          </div>

          <h1 className="font-display text-xl font-semibold text-bark-dark">
            StrayAdopt AI
          </h1>

        </div>

        {/* ================= MESSAGES ================= */}

        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-cream/50">

          {messages.length === 0 ? (

            <div className="h-full flex flex-col items-center justify-center text-center px-6">

              <div className="w-14 h-14 rounded-full bg-rust/10 flex items-center justify-center mb-4">

                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C0572A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4Z" />
                  <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                </svg>

              </div>

              <p className="text-bark-dark font-medium mb-1">
                Ask me anything about StrayAdopt
              </p>

              <p className="text-text-light text-sm max-w-xs">
                Pet care tips, adoption guidance, or help finding a stray near you — I'm here to help.
              </p>

            </div>

          ) : (

            messages.map((msg, i) => (

              <div
                key={i}
                className={`flex flex-col ${
                  msg.role === "user"
                    ? "items-end"
                    : "items-start"
                }`}
              >

                {/* ================= MESSAGE ================= */}

                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-rust text-white rounded-br-sm"
                      : "bg-white text-text-main border border-border-brand rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>

                {/* ================= PET CARDS ================= */}

                {msg.role === "ai" &&
                  msg.pets &&
                  msg.pets.length > 0 && (

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[90%] w-full">

                      {msg.pets.map((pet) => (

                        <div
                          key={pet._id}
                          className="scale-[0.85] origin-top-left -mb-8"
                        >
                          <PetCard post={pet} />
                        </div>

                      ))}

                    </div>

                  )}

                {/* ================= RAG SOURCES ================= */}

                {msg.role === "ai" &&
                msg.knowledge &&
                msg.knowledge.length > 0 && (

                  <details className="mt-3 max-w-[90%] w-full">
                    
                    <summary className="cursor-pointer text-sm font-medium text-text-mid hover:text-rust transition-colors">
                      📚 Sources used ({msg.knowledge.length})
                    </summary>

                    <div className="mt-2 space-y-2">

                      {msg.knowledge.map((source, index) => (

                        <div
                          key={index}
                          className="bg-white border border-border-brand rounded-xl px-3 py-2"
                        >

                          <div className="flex items-center justify-between gap-3">

                            <span className="text-sm font-medium text-bark-dark">
                              Pet Care Guide
                            </span>

                            {source.pageNumber && (
                              <span className="text-xs text-text-light">
                                Page {source.pageNumber}
                              </span>
                            )}

                          </div>

                          {source.content && (
                            <p className="mt-1 text-xs text-text-light line-clamp-2">
                              {source.content}
                            </p>
                          )}

                        </div>

                      ))}

                    </div>

                  </details>

                )}

              </div>

            ))

          )}

          {/* ================= TYPING ================= */}

          {sending && <TypingIndicator />}

          {/* ================= ERROR ================= */}

          {error && (

            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 w-fit">
              {error}
            </p>

          )}

          <div ref={endRef} />

        </div>

        {/* ================= INPUT ================= */}

        <form
          onSubmit={handleSend}
          className="p-4 border-t border-border-brand flex gap-3"
        >

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about pet care, adoption, or a stray you found..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-border-brand px-4 py-3 text-[14px] outline-none focus:border-rust focus:ring-2 focus:ring-rust/20 transition-all max-h-32"
          />

          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="rounded-xl bg-rust hover:bg-rust-hover px-5 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>

        </form>

      </div>
    </div>
  );
}