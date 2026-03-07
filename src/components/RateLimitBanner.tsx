"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

export default function RateLimitBanner() {
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("rate-limit-banner-dismissed");
    if (status === "unauthenticated" && !isDismissed) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [status]);

  const handleDismiss = () => {
    sessionStorage.setItem("rate-limit-banner-dismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl z-50 animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-gray-900 border border-amber-500/20 shadow-2xl shadow-amber-500/10 p-4 rounded-md flex flex-col md:flex-row items-center gap-4">
        <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <p className="text-white text-sm font-medium">You&apos;re using shared rate limits.</p>
          <p className="text-gray-500 text-xs">Log in with GitHub for 5,000 requests/hr and faster analysis.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => signIn("github")}
            className="bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs font-bold px-4 py-2 rounded transition-colors"
          >
            Log in
          </button>
          <button
            onClick={handleDismiss}
            className="text-gray-500 hover:text-white p-2 transition-colors"
            aria-label="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
