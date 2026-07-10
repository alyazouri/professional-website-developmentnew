import { useState, useEffect } from "react";
import { useLang } from "./LanguageContext";

// Night Mode Toggle Component
export function NightModeToggle() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [enabled, setEnabled] = useState(() => {
    try {
      return localStorage.getItem("gaming_mode") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.body.classList.toggle("gaming-mode", enabled);
    try {
      localStorage.setItem("gaming_mode", String(enabled));
    } catch { /* ignore */ }
  }, [enabled]);

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-2 py-1.5 text-xs font-semibold transition-colors hover:bg-white/5"
      aria-label={isAr ? "تبديل وضع الليل" : "Toggle Night Mode"}
    >
      <span className="text-lg">{enabled ? "🌙" : "☀️"}</span>
      <span className="hidden sm:inline">{isAr ? (enabled ? "وضع الليل" : "وضع النهار") : (enabled ? "Night Mode" : "Day Mode")}</span>
    </button>
  );
}

// Rating Component
export function RatingSection() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const stars = [1, 2, 3, 4, 5];

  // Load saved rating
  useEffect(() => {
    try {
      const saved = localStorage.getItem("app_rating");
      if (saved) {
        const parsed = JSON.parse(saved);
        setRating(parsed.rating || 0);
        setComment(parsed.comment || "");
        setSubmitted(true);
      }
    } catch { /* ignore */ }
  }, []);

  const handleSubmit = () => {
    if (rating === 0) return;
    try {
      localStorage.setItem("app_rating", JSON.stringify({ rating, comment, date: new Date().toISOString() }));
      setSubmitted(true);
    } catch { /* ignore */ }
  };

  const handleReset = () => {
    setRating(0);
    setComment("");
    setSubmitted(false);
    try {
      localStorage.removeItem("app_rating");
    } catch { /* ignore */ }
  };

  const saved = { rating, comment, date: new Date().toISOString() };

  if (submitted && saved) {
    return (
      <div className="card neon-box rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-2xl">🎉</span>
          <h3 className="font-display text-lg font-bold text-white">
            {isAr ? "شكراً لتقييمك!" : "Thanks for your rating!"}
          </h3>
        </div>
        <div className="py-4 text-center">
          <div className="flex justify-center gap-1">
            {stars.map((s) => (
              <span key={s} className={`text-2xl ${s <= saved.rating ? "text-orange-400" : "text-white/20"}`}>
                ⭐
              </span>
            ))}
          </div>
          {saved.comment && (
            <p className="mt-4 text-sm text-white/60">"{saved.comment}"</p>
          )}
          <button onClick={handleReset} className="btn-ghost mt-4 rounded-lg px-4 py-2 text-xs">
            {isAr ? "تغيير التقييم" : "Change Rating"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card neon-box rounded-2xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">💬</span>
        <h3 className="font-display text-lg font-bold text-white">
          {isAr ? "قيّم تجربتك" : "Rate Your Experience"}
        </h3>
      </div>
      <div className="flex justify-center gap-1">
        {stars.map((s) => (
          <button
            key={s}
            onClick={() => setRating(s)}
            className={`text-3xl transition-transform hover:scale-125 ${s <= rating ? "text-orange-400" : "text-white/20"}`}
            aria-label={isAr ? `تقييم ${s} نجمة` : `Rate ${s} stars`}
          >
            ⭐
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={isAr ? "اضف تعليق (اختياري)" : "Add a comment (optional)"}
        className="mt-4 w-full rounded-lg border border-white/10 bg-black/30 p-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
        rows={2}
      />
      <button
        onClick={handleSubmit}
        disabled={rating === 0}
        className={`mt-4 w-full rounded-lg py-3 text-sm font-semibold transition-colors ${
          rating === 0
            ? "cursor-not-allowed bg-white/5 text-white/40"
            : "btn-primary cursor-pointer"
        }`}
      >
        {isAr ? "إرسال التقييم" : "Submit Rating"}
      </button>
    </div>
  );
}

// Share Button Component
export function ShareButton() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: "ALYAZOURI 2026 — PUBG Mobile Jordan Optimizer",
      text: isAr
        ? "محسّن PUBG Mobile الأردني — مولّد حساسية ذكاء اصطناعي احترافي"
        : "Professional AI-powered sensitivity generator for PUBG Mobile",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShared(true);
      } else {
        throw new Error("no share api");
      }
    } catch {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = window.location.href;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setShared(true);
    }
    setTimeout(() => setShared(false), 2500);
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
        shared
          ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
          : "btn-ghost"
      }`}
    >
      <span className="text-xl">{shared ? "✅" : "📤"}</span>
      <span>{shared ? (isAr ? "تم النسخ!" : "Copied!") : (isAr ? "مشاركة" : "Share")}</span>
    </button>
  );
}

// AI Predictions Component
export function AIPredictions() {
  const { lang } = useLang();
  const isAr = lang === "ar";

  const predictions = [
    { label: isAr ? "دقة الرأس" : "Headshot %", value: "85%", icon: "🎯" },
    { label: isAr ? "تحكم الرش" : "Spray Control", value: "92%", icon: "💧" },
    { label: isAr ? "تتبع الخصم" : "Target Tracking", value: "88%", icon: "👁️" },
    { label: isAr ? "سرعة رد الفعل" : "Reaction Speed", value: "94%", icon: "⚡" },
  ];

  return (
    <div className="card rounded-2xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">🤖</span>
        <h3 className="font-display text-lg font-bold text-white">
          {isAr ? "التنبؤات الذكية" : "AI Predictions"}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {predictions.map((p) => (
          <div key={p.label} className="rounded-xl border border-white/8 bg-black/20 p-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">{p.icon}</span>
              <span className="text-xs text-white/60">{p.label}</span>
            </div>
            <div className="mt-2 font-display text-2xl font-black text-orange-300">{p.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

