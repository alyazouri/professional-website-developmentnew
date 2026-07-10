import { useState, useEffect } from "react";
import { useLang } from "./LanguageContext";

export function PWABanner() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if banner was dismissed before
    try {
      const dismissed = localStorage.getItem("pwa_banner_dismissed");
      if (dismissed) return;
    } catch { /* ignore */ }

    // Check if app is already installed
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches;
    if (isInstalled) return;

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Also show banner after a delay if no prompt appeared
    const timer = setTimeout(() => {
      if (!showBanner) {
        setShowBanner(true);
      }
    }, 10000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, [showBanner]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback for browsers that don't support beforeinstallprompt
      setShowBanner(false);
      try {
        localStorage.setItem("pwa_banner_dismissed", "true");
      } catch { /* ignore */ }
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    try {
      localStorage.setItem("pwa_banner_dismissed", "true");
    } catch { /* ignore */ }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="card neon-box rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📱</span>
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold text-white">
              {isAr ? "تثبيت التطبيق" : "Install App"}
            </h3>
            <p className="text-sm text-white/60">
              {isAr ? "تثبت هذا التطبيق على جهازك للوصول السريع" : "Install this app on your device for quick access"}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleInstall} className="btn-primary rounded-lg px-4 py-2 text-sm">
              {isAr ? "تثبيت" : "Install"}
            </button>
            <button onClick={handleDismiss} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 hover:bg-white/5">
              {isAr ? "إغلاق" : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}