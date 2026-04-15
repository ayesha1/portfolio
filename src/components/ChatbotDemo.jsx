import { useState, useEffect, useRef, useCallback } from "react";

const PURPLE = "#4B286D";
const GREEN = "#248700";
const GRAY_BG = "#f2eff4";

/* ── Smiley avatar with optional bouncing eyes ── */
function Avatar({ size = 40, className = "", bounceEyes = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
    >
      {/* Rounded TL, TR, BL — sharp BR corner */}
      <path
        d="M6 0h28a6 6 0 0 1 6 6v34H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6z"
        fill={PURPLE}
      />
      {/* Eyes — simple round dots */}
      <circle cx="14" cy="16" r="2.5" fill="white">
        {bounceEyes && (
          <animate attributeName="cy" values="16;13;16" dur="1.2s" repeatCount="indefinite" />
        )}
      </circle>
      <circle cx="26" cy="16" r="2.5" fill="white">
        {bounceEyes && (
          <animate attributeName="cy" values="16;13;16" dur="1.2s" begin="0.15s" repeatCount="indefinite" />
        )}
      </circle>
      {/* Smile — gentle curve */}
      <path
        d="M13 24c3 4 11 4 14 0"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/* ── Typing dots ── */
function TypingIndicator() {
  return (
    <div
      className="flex items-end mb-3"
      style={{ animation: "chatbotFadeUp 300ms ease-out both" }}
    >
      <div
        className="rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1"
        style={{ backgroundColor: GRAY_BG }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-2 h-2 rounded-full"
            style={{
              backgroundColor: "#9b8fb0",
              animation: `chatbotPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Messages (no avatar icons) ── */
function BotMessage({ children, animate = true }) {
  return (
    <div
      className="mb-3"
      style={animate ? { animation: "chatbotFadeUp 300ms ease-out both" } : undefined}
    >
      <div
        className="rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed max-w-[85%]"
        style={{ backgroundColor: GRAY_BG, color: "#333" }}
      >
        {children}
      </div>
    </div>
  );
}

function UserMessage({ text, time }) {
  return (
    <div
      className="flex flex-col items-end mb-3"
      style={{ animation: "chatbotFadeUp 300ms ease-out both" }}
    >
      <div
        className="rounded-2xl rounded-br-sm px-4 py-2.5 text-sm text-white max-w-[85%]"
        style={{ backgroundColor: PURPLE }}
      >
        {text}
      </div>
      <span className="text-[11px] text-gray-400 mt-1">You {time}</span>
    </div>
  );
}

function QuickReplyButtons({ options, onSelect, showTapHint }) {
  const [hintVisible, setHintVisible] = useState(false)

  useEffect(() => {
    if (!showTapHint) return
    const timer = setTimeout(() => setHintVisible(true), 3000)
    return () => clearTimeout(timer)
  }, [showTapHint])

  return (
    <div
      className="flex flex-wrap gap-2 mb-3"
      style={{ animation: "chatbotFadeUp 300ms ease-out both" }}
    >
      {options.map((opt, i) => (
        <div key={opt} className="relative">
          <button
            onClick={() => onSelect(opt)}
            className="rounded-full px-4 py-2 text-sm font-medium border-2 bg-white cursor-pointer transition-colors duration-150 hover:bg-green-50"
            style={{ borderColor: GREEN, color: GREEN }}
          >
            {opt}
          </button>
          {/* Tap hint — pulsing ring ripple */}
          {i === 0 && hintVisible && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-[-4px] rounded-full border-2 border-gray-400/40" style={{ animation: 'hintRing 2s ease-out infinite' }} />
              <div className="absolute inset-[-4px] rounded-full border-2 border-gray-400/40" style={{ animation: 'hintRing 2s ease-out 0.6s infinite' }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function OfferCard() {
  return (
    <div
      className="mb-3"
      style={{ animation: "chatbotFadeUp 300ms ease-out both" }}
    >
      <div
        className="rounded-2xl rounded-bl-sm overflow-hidden max-w-[85%]"
        style={{ backgroundColor: GRAY_BG }}
      >
        <div
          className="h-28 flex items-center justify-center text-white text-xs font-medium"
          style={{
            background: `linear-gradient(135deg, ${PURPLE}, #7c5ea6, #a78bca)`,
          }}
        >
          <div className="text-center">
            <div className="text-lg font-bold mb-1">TV + Streaming</div>
            <div className="flex gap-3 justify-center opacity-80 text-[10px]">
              <span className="bg-white/20 rounded px-2 py-0.5">Crave</span>
              <span className="bg-white/20 rounded px-2 py-0.5">HBO</span>
              <span className="bg-white/20 rounded px-2 py-0.5">Movies</span>
            </div>
          </div>
        </div>
        <div className="px-4 py-2.5 text-sm leading-relaxed" style={{ color: "#333" }}>
          As you already have a TELUS internet plan, for a limited time you can
          also get Crave + Movies + HBO on us for 6 months, plus a{" "}
          <strong>$200 bill credit</strong>.
        </div>
      </div>
    </div>
  );
}

/* ── Loading state from Figma ── */
function ConnectingScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8">
      <Avatar size={80} bounceEyes className="mb-4" />
      <p className="text-center text-sm font-bold leading-relaxed" style={{ color: "#2c2e30" }}>
        One moment ☝️
        <br />
        Connecting you with TELUS Assist
      </p>
    </div>
  );
}

/* ── Main component ── */
const INITIAL_OPTIONS = [
  "Add, manage or upgrade",
  "TV programming",
  "TV bundles",
  "I need technical support",
  "Bundle Builder",
  "Best deals",
];

export default function ChatbotDemo({ isVisible = false }) {
  // -1 = loading/connecting, 0 = greeting shown, 1+ = conversation steps
  const [step, setStep] = useState(-1);
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef(null);

  // When card scrolls into view, start the connecting → chat transition
  useEffect(() => {
    if (isVisible && step === -1) {
      const timer = setTimeout(() => setStep(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, step]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTo({
        top: bodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [step, typing]);

  const handleFirstChoice = useCallback(() => {
    setStep(1);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setStep(2);
    }, 1500);
  }, []);

  const handleSecondChoice = useCallback(() => {
    setStep(3);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setStep(4);
    }, 1500);
  }, []);

  function handleRestart() {
    setStep(-1);
    setTyping(false);
    // Re-trigger connecting → chat after restart
    setTimeout(() => setStep(0), 2000);
  }

  return (
    <>
      <style>{`
        @keyframes chatbotFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes chatbotPulse {
          0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
        @keyframes hintRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>

      <div
        className="w-[280px] max-w-full rounded-2xl overflow-hidden shadow-xl flex flex-col"
        style={{ height: 520, fontFamily: "system-ui, sans-serif" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-3 py-2.5 shrink-0"
          style={{ backgroundColor: PURPLE, borderRadius: "16px 16px 0 0" }}
        >
          <div className="flex items-center gap-2">
            <Avatar size={28} />
            <span className="text-white text-xs font-semibold">TELUS Assist</span>
          </div>
          <div className="flex items-center gap-0.5">
            <span className="text-white/50 w-6 h-6 flex items-center justify-center text-sm">&mdash;</span>
            <span className="text-white/50 w-6 h-6 flex items-center justify-center text-sm">&times;</span>
          </div>
        </div>

        {/* Body — loading or chat */}
        {step === -1 ? (
          <ConnectingScreen />
        ) : (
          <div
            ref={bodyRef}
            className="flex-1 overflow-y-auto px-3 py-4 bg-white"
          >
            {/* Intro */}
            <div
              className="flex flex-col items-center mb-4"
              style={{ animation: "chatbotFadeUp 400ms ease-out both" }}
            >
              <Avatar size={48} className="mb-2" />
              <span className="text-xs font-semibold" style={{ color: "#2c2e30" }}>
                Connected with TELUS Assist
              </span>
              <span className="text-[10px] text-gray-400">
                Tuesday, 20 July, 10:00
              </span>
            </div>

            <BotMessage>
              👋 Hi Joe, I&apos;m TELUS Assist for TV Bundles &amp; Deals.
            </BotMessage>
            <BotMessage>
              To get started, select one of the options below.
            </BotMessage>

            {step === 0 && (
              <QuickReplyButtons
                options={INITIAL_OPTIONS}
                onSelect={handleFirstChoice}
                showTapHint
              />
            )}

            {step >= 1 && (
              <UserMessage text="Add, manage or upgrade" time="10:01" />
            )}
            {step === 1 && typing && <TypingIndicator />}

            {step >= 2 && (
              <>
                <OfferCard />
                <BotMessage>Would you like to explore this bundle offer?</BotMessage>
              </>
            )}
            {step === 2 && (
              <QuickReplyButtons
                options={["Yes please", "No thank you"]}
                onSelect={handleSecondChoice}
              />
            )}

            {step >= 3 && <UserMessage text="Yes please" time="10:02" />}
            {step === 3 && typing && <TypingIndicator />}

            {step >= 4 && (
              <>
                <BotMessage>
                  Great choice! Let me pull up the details for you...
                </BotMessage>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleRestart}
                    className="rounded-full px-4 py-1.5 text-xs font-medium border-2 bg-white cursor-pointer transition-colors duration-150 hover:bg-purple-50"
                    style={{ borderColor: PURPLE, color: PURPLE }}
                  >
                    Restart demo
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Input bar */}
        <div className="shrink-0 bg-white border-t border-gray-100 px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-full border border-gray-200 px-3 py-2 text-xs text-gray-400">
              Type your message
            </div>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: PURPLE }}
              aria-label="Send"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
