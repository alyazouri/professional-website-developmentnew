import { useState, useEffect, useCallback } from "react";
import { useLang } from "./LanguageContext";

export function TouchTest() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{ cps: number; rating: string; color: string } | null>(null);

  const startTest = useCallback(() => {
    setCount(0);
    setTimeLeft(10);
    setIsRunning(true);
    setResult(null);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer!);
            setIsRunning(false);
            const cps = Math.round((count / 10) * 10) / 10;
            let rating, color;
            if (cps >= 8) { rating = isAr ? "أسطوري" : "Legendary"; color = "text-orange-400"; }
            else if (cps >= 6) { rating = isAr ? "محترف" : "Pro"; color = "text-emerald-400"; }
            else if (cps >= 4) { rating = isAr ? "جيد" : "Good"; color = "text-amber-400"; }
            else { rating = isAr ? "مبتدئ" : "Keep practicing"; color = "text-white/60"; }
            setResult({ cps, rating, color });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, count, isAr]);

  const handleClick = () => {
    if (isRunning) {
      setCount((prev) => prev + 1);
    }
  };

  if (result) {
    return (
      <div className="card neon-box rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-2xl">👆</span>
          <h3 className="font-display text-lg font-bold text-white">
            {isAr ? "اختبار سرعة اللمس" : "Touch Speed Test"}
          </h3>
        </div>

        <div className="text-center">
          <div className="font-display text-6xl font-black text-orange-300">
            {result.cps.toFixed(1)}
          </div>
          <div className="text-xl text-white/60">
            {isAr ? "نقرات في الثانية" : "CPS"}
          </div>
          <div className={`mt-4 font-display text-2xl font-bold ${result.color}`}>
            {result.rating}
          </div>
          <button onClick={startTest} className="btn-primary mt-6 rounded-xl px-6 py-3">
            {isAr ? "إعادة الاختبار" : "Test Again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card neon-box rounded-2xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">👆</span>
        <h3 className="font-display text-lg font-bold text-white">
          {isAr ? "اختبار سرعة اللمس" : "Touch Speed Test"}
        </h3>
      </div>
      <p className="mb-4 text-center text-sm text-white/60">
        {isAr ? "انقر بأسرع ما يمكن لمدة 10 ثوان" : "Tap as fast as you can for 10 seconds"}
      </p>

      <div
        onClick={handleClick}
        className={`cursor-pointer rounded-2xl border-2 border-orange-500/30 bg-orange-500/10 p-8 text-center transition-colors hover:bg-orange-500/20 ${
          isRunning ? "animate-pulse" : ""
        }`}
      >
        <div className="font-display text-5xl font-black text-orange-300">
          {count}
        </div>
        <div className="mt-2 text-xl text-white/60">
          {isAr ? "نقرات" : "Taps"}
        </div>
        <div className="mt-4 text-3xl font-bold text-white">
          {timeLeft}s
        </div>
      </div>

      {!isRunning && count === 0 && (
        <button onClick={startTest} className="btn-primary mt-6 w-full rounded-xl py-3">
          {isAr ? "ابدأ الاختبار" : "Start Test"}
        </button>
      )}
    </div>
  );
}