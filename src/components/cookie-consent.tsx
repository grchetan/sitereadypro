import { useEffect, useState } from "react";
import { X, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "srp_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    // Check if consent was already given
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const timer = window.setTimeout(() => {
        setVisible(true);
      }, 1000);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const closeWithAnimation = (callback: () => void) => {
    setClosing(true);
    window.setTimeout(() => {
      callback();
      setVisible(false);
      setClosing(false);
    }, 300);
  };

  const handleAcceptAll = () => {
    closeWithAnimation(() => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ necessary: true, analytics: true, marketing: true, date: new Date().toISOString() })
      );
    });
  };

  const handleRejectAll = () => {
    closeWithAnimation(() => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ necessary: true, analytics: false, marketing: false, date: new Date().toISOString() })
      );
    });
  };

  const handleSavePreferences = () => {
    closeWithAnimation(() => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...preferences, date: new Date().toISOString() })
      );
    });
  };

  const handleDismiss = () => {
    closeWithAnimation(() => {
      // Dismiss for current session without persistent acceptance
      sessionStorage.setItem("srp_cookie_dismissed", "true");
    });
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className={cn(
        "fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] max-w-[620px] transition-all duration-300 ease-out",
        closing
          ? "translate-y-6 opacity-0 scale-95"
          : "translate-y-0 opacity-100 scale-100 animate-in fade-in slide-in-from-bottom-6 duration-300"
      )}
    >
      {/* Outer Off-White Card */}
      <div className="relative rounded-none border border-neutral-300/80 bg-[#fdfbf7] p-2.5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] dark:border-neutral-700 dark:bg-[#181716] sm:p-3">
        {/* Inner Dotted/Dashed Container */}
        <div className="relative border border-dashed border-neutral-900/90 p-5 sm:p-7 dark:border-neutral-300/90">
          
          {/* Distinctive Red Hand-Drawn Annotation / Loop Effect (Right Edge) */}
          <div className="pointer-events-none absolute -right-3 top-1/2 -translate-y-1/2 sm:-right-4" aria-hidden="true">
            <svg
              viewBox="0 0 110 36"
              fill="none"
              className="h-7 w-20 text-[#d93829] sm:h-9 sm:w-24"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Hand-drawn circular loop */}
              <path
                d="M28 17 C26 11, 14 10, 10 16 C6 22, 12 30, 20 29 C27 28, 30 21, 26 15 C22 10, 14 12, 11 17 C9 21, 15 26, 21 25"
                strokeWidth="1.7"
              />
              {/* Double trailing thread extending out to right edge */}
              <path
                d="M27 18 C45 17, 75 19, 108 20"
                strokeWidth="1.5"
              />
              <path
                d="M26 21 C48 23, 78 21, 108 22"
                strokeWidth="1.3"
                opacity="0.85"
              />
            </svg>
          </div>

          {/* Close button (top-right) */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close cookie consent banner"
            className="absolute right-3.5 top-3.5 grid h-7 w-7 place-items-center text-neutral-800 transition-transform hover:scale-110 hover:text-black dark:text-neutral-200 dark:hover:text-white sm:right-4 sm:top-4"
          >
            <X className="h-4 w-4 stroke-[2]" />
          </button>

          {/* Header */}
          <div className="pr-8">
            <h3 className="font-mono text-sm font-extrabold uppercase tracking-tight text-neutral-900 dark:text-white sm:text-base">
              We use cookies to improve your experience
            </h3>

            {/* Subtext with red accents */}
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-800 dark:text-neutral-200 sm:text-[13px]">
              By continuing, you{" "}
              <span className="font-bold text-[#d93829]">agree</span>
              <br className="hidden sm:inline" />
              <span className="sm:ml-1 font-bold text-[#d93829]">to our</span>{" "}
              <span className="font-black text-neutral-950 dark:text-white">Cookie Policy.</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Accept Button (Brush-Stroke Textured) */}
            <button
              type="button"
              onClick={handleAcceptAll}
              className="group relative inline-flex items-center justify-center px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition-transform active:scale-95"
            >
              {/* Brush ink shape */}
              <svg
                viewBox="0 0 140 38"
                fill="none"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full text-neutral-950 drop-shadow-sm transition-transform group-hover:scale-105 dark:text-neutral-900"
              >
                <path
                  d="M4 12 C1 16, 0 24, 3 30 C7 36, 18 37, 45 38 C75 38, 105 37, 132 35 C138 34, 140 29, 138 23 C136 15, 139 8, 133 4 C124 1, 98 1, 68 2 C36 3, 14 1, 6 4 C2 7, 6 10, 4 12 Z"
                  fill="currentColor"
                />
                <path
                  d="M2 18 C0 22, 4 33, 15 35 C30 38, 110 38, 134 33 C138 31, 137 14, 132 9 C125 2, 95 0, 65 1 C26 2, 7 5, 2 18 Z"
                  fill="currentColor"
                />
              </svg>
              <span className="relative z-10 flex items-center gap-1">
                <span className="text-cyan-400 dark:text-cyan-300">[</span>
                <span>Accept Cookies</span>
                <span className="text-cyan-400 dark:text-cyan-300">]</span>
              </span>
            </button>

            {/* Reject Button (Brush-Stroke Textured) */}
            <button
              type="button"
              onClick={handleRejectAll}
              className="group relative inline-flex items-center justify-center px-4 py-2 text-xs font-black uppercase tracking-wider text-white transition-transform active:scale-95"
            >
              {/* Brush ink shape */}
              <svg
                viewBox="0 0 130 38"
                fill="none"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full text-neutral-950 drop-shadow-sm transition-transform group-hover:scale-105 dark:text-neutral-900"
              >
                <path
                  d="M3 10 C0 15, 1 24, 4 29 C8 35, 20 37, 42 38 C70 38, 98 37, 122 35 C128 34, 130 28, 128 22 C126 15, 128 8, 123 4 C115 1, 90 1, 63 2 C33 3, 13 1, 5 4 C1 7, 5 9, 3 10 Z"
                  fill="currentColor"
                />
                <path
                  d="M2 17 C0 21, 3 32, 14 34 C28 37, 100 37, 124 32 C128 30, 127 13, 122 8 C116 2, 88 0, 60 1 C24 2, 6 5, 2 17 Z"
                  fill="currentColor"
                />
              </svg>
              <span className="relative z-10 flex items-center gap-1">
                <span className="text-cyan-400 dark:text-cyan-300">[</span>
                <span>Reject All</span>
                <span className="text-cyan-400 dark:text-cyan-300">]</span>
              </span>
            </button>

            {/* Cookies Settings Button */}
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className="inline-flex items-center gap-1 font-mono text-xs font-black uppercase tracking-wider text-neutral-900 underline underline-offset-4 transition-colors hover:text-[#d93829] dark:text-neutral-100 dark:hover:text-[#d93829]"
            >
              <span>Cookies Settings</span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform duration-200",
                  showSettings && "rotate-180"
                )}
              />
            </button>
          </div>

          {/* Cookies Settings Expandable Panel */}
          {showSettings && (
            <div className="mt-5 border-t border-dashed border-neutral-400/70 pt-4 dark:border-neutral-600">
              <div className="space-y-3">
                {/* Necessary */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-mono font-bold text-neutral-900 dark:text-white">
                      Strictly Necessary
                    </span>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                      Required for basic site navigation and authentication.
                    </p>
                  </div>
                  <span className="shrink-0 rounded bg-neutral-200 px-2 py-0.5 font-mono text-[10px] font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    Always Active
                  </span>
                </div>

                {/* Analytics */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-mono font-bold text-neutral-900 dark:text-white">
                      Analytics & Performance
                    </span>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                      Helps us understand how visitors interact with the studio.
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={(e) =>
                        setPreferences((p) => ({ ...p, analytics: e.target.checked }))
                      }
                      className="peer sr-only"
                    />
                    <div className="h-5 w-9 rounded-full bg-neutral-300 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#d93829] peer-checked:after:translate-x-full dark:bg-neutral-700" />
                  </label>
                </div>

                {/* Marketing */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-mono font-bold text-neutral-900 dark:text-white">
                      Marketing & Preferences
                    </span>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                      Allows personalized offers and experience tailoring.
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) =>
                        setPreferences((p) => ({ ...p, marketing: e.target.checked }))
                      }
                      className="peer sr-only"
                    />
                    <div className="h-5 w-9 rounded-full bg-neutral-300 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#d93829] peer-checked:after:translate-x-full dark:bg-neutral-700" />
                  </label>
                </div>
              </div>

              {/* Save Preferences */}
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSavePreferences}
                  className="inline-flex items-center gap-1.5 rounded-none bg-neutral-900 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 dark:bg-neutral-100 dark:text-neutral-900"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Save Preferences</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </aside>
  );
}
