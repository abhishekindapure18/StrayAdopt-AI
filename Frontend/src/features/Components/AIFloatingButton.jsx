import { useNavigate, useLocation } from "react-router-dom";

export default function AIFloatingButton() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/ai-assistant") return null;

  return (
    <button
      onClick={() => navigate("/ai-assistant")}
      aria-label="Open StrayAdopt AI"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-bark-dark text-cream flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_0_8px_rgba(192,87,42,0.15)] active:scale-95"
    >
      <span className="absolute inset-0 rounded-full bg-rust/30 animate-ping" />
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10"
      >
        <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4Z" />
        <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        <circle cx="9" cy="7" r="0.5" fill="currentColor" />
        <circle cx="15" cy="7" r="0.5" fill="currentColor" />
      </svg>
    </button>
  );
}