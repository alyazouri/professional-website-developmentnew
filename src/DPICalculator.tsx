import { useState } from "react";
import { useLang } from "./LanguageContext";

export function DPICalculator() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  
  const [dpi, setDpi] = useState(400);
  const [inGameSens, setInGameSens] = useState(100);
  const [fov, setFov] = useState(90);

  // Calculate eDPI
  const eDPI = (dpi * inGameSens) / 100;

  // Calculate cm/360
  const cmPer360 = (dpi * 2.54 * Math.PI) / (inGameSens * (Math.PI / 180) * fov);

  // Pro player comparison
  const proPlayers = [
    { name: "Jonathan", eDPI: 480, cm360: 45 },
    { name: "ScoutOP", eDPI: 360, cm360: 60 },
    { name: "Mortal", eDPI: 520, cm360: 42 },
    { name: "Levinho", eDPI: 440, cm360: 50 },
  ];

  const closestPro = proPlayers.reduce((a, b) => {
    const diffA = Math.abs(eDPI - a.eDPI);
    const diffB = Math.abs(eDPI - b.eDPI);
    return diffA < diffB ? a : b;
  });

  const speedCategory = eDPI < 300 
    ? isAr ? "بطيء" : "Slow"
    : eDPI < 400 
      ? isAr ? "متوسط" : "Medium"
      : eDPI < 500 
        ? isAr ? "سريع" : "Fast"
        : isAr ? "سريع جدًا" : "Very Fast";

  return (
    <div className="card neon-box rounded-2xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">🧮</span>
        <h3 className="font-display text-lg font-bold text-white">
          {isAr ? "حاسبة DPI" : "DPI Calculator"}
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/8 bg-black/20 p-4">
          <label className="text-[10px] uppercase tracking-widest text-white/40">
            {isAr ? "DPI" : "DPI"}
          </label>
          <input
            type="number"
            value={dpi}
            onChange={(e) => setDpi(Number(e.target.value))}
            min={100}
            max={5000}
            className="mt-2 w-full bg-transparent text-2xl font-bold text-orange-300 outline-none"
          />
          <input
            type="range"
            value={dpi}
            onChange={(e) => setDpi(Number(e.target.value))}
            min={100}
            max={5000}
            className="mt-2 w-full"
          />
        </div>

        <div className="rounded-xl border border-white/8 bg-black/20 p-4">
          <label className="text-[10px] uppercase tracking-widest text-white/40">
            {isAr ? "حساسية اللعبة" : "In-Game Sens"}
          </label>
          <input
            type="number"
            value={inGameSens}
            onChange={(e) => setInGameSens(Number(e.target.value))}
            min={1}
            max={300}
            className="mt-2 w-full bg-transparent text-2xl font-bold text-orange-300 outline-none"
          />
          <input
            type="range"
            value={inGameSens}
            onChange={(e) => setInGameSens(Number(e.target.value))}
            min={1}
            max={300}
            className="mt-2 w-full"
          />
        </div>

        <div className="rounded-xl border border-white/8 bg-black/20 p-4">
          <label className="text-[10px] uppercase tracking-widest text-white/40">
            {isAr ? "FOV" : "FOV"}
          </label>
          <input
            type="number"
            value={fov}
            onChange={(e) => setFov(Number(e.target.value))}
            min={60}
            max={120}
            className="mt-2 w-full bg-transparent text-2xl font-bold text-orange-300 outline-none"
          />
          <input
            type="range"
            value={fov}
            onChange={(e) => setFov(Number(e.target.value))}
            min={60}
            max={120}
            className="mt-2 w-full"
          />
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/8 bg-black/20 p-4">
          <div className="text-[10px] uppercase tracking-widest text-white/40">
            {isAr ? "eDPI" : "eDPI"}
          </div>
          <div className="font-display text-4xl font-black text-orange-300">
            {Math.round(eDPI)}
          </div>
          <div className="mt-1 text-xs text-white/60">
            {isAr ? "الحساسية الفعالة" : "Effective DPI"}
          </div>
        </div>

        <div className="rounded-xl border border-white/8 bg-black/20 p-4">
          <div className="text-[10px] uppercase tracking-widest text-white/40">
            {isAr ? "سم/360°" : "cm/360°"}
          </div>
          <div className="font-display text-4xl font-black text-orange-300">
            {cmPer360.toFixed(1)}
          </div>
          <div className="mt-1 text-xs text-white/60">
            {isAr ? "المسافة لدورة كاملة" : "Distance for 360°"}
          </div>
        </div>

        <div className="rounded-xl border border-white/8 bg-black/20 p-4">
          <div className="text-[10px] uppercase tracking-widest text-white/40">
            {isAr ? "الفئة" : "Category"}
          </div>
          <div className="font-display text-2xl font-black text-orange-300">
            {speedCategory}
          </div>
          <div className="mt-1 text-xs text-white/60">
            {isAr ? "سرعات الحركة" : "Movement Speed"}
          </div>
        </div>

        <div className="rounded-xl border border-white/8 bg-black/20 p-4">
          <div className="text-[10px] uppercase tracking-widest text-white/40">
            {isAr ? "أقرب لاعب" : "Closest Pro"}
          </div>
          <div className="font-display text-xl font-bold text-white">
            {closestPro.name}
          </div>
          <div className="text-xs text-white/60">
            {isAr ? "eDPI: " : "eDPI: "}{closestPro.eDPI} · {isAr ? "سم/360: " : "cm/360: "}{closestPro.cm360}
          </div>
        </div>
      </div>

      {/* Additional calculations */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-white/8 bg-black/20 p-3 text-center">
          <div className="text-[10px] uppercase tracking-widest text-white/40">
            {isAr ? "سم/180°" : "cm/180°"}
          </div>
          <div className="font-display text-lg font-black text-orange-300">
            {(cmPer360 / 2).toFixed(1)}
          </div>
        </div>
        <div className="rounded-xl border border-white/8 bg-black/20 p-3 text-center">
          <div className="text-[10px] uppercase tracking-widest text-white/40">
            {isAr ? "سم/90°" : "cm/90°"}
          </div>
          <div className="font-display text-lg font-black text-orange-300">
            {(cmPer360 / 4).toFixed(1)}
          </div>
        </div>
        <div className="rounded-xl border border-white/8 bg-black/20 p-3 text-center">
          <div className="text-[10px] uppercase tracking-widest text-white/40">
            {isAr ? "نسبة" : "Ratio"}
          </div>
          <div className="font-display text-lg font-black text-orange-300">
            {((inGameSens / 100) * dpi).toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
}