import { useLang } from "./LanguageContext";
import { t } from "./i18n";

export function HudPreview({ fingers }: { fingers: number }) {
  const { lang } = useLang();
  const isAr = lang === "ar";

  // HUD layout based on finger count
  const getHudLayout = (fingers: number) => {
    const layouts = {
      2: [
        { name: isAr ? "إطلاق" : "Fire", icon: "🔥", x: 85, y: 85 },
        { name: isAr ? "تصويب" : "Aim", icon: "🎯", x: 15, y: 50 },
        { name: isAr ? "قفز" : "Jump", icon: "⬆️", x: 50, y: 15 },
        { name: isAr ? "انحناء" : "Crouch", icon: "⬇️", x: 50, y: 85 },
      ],
      3: [
        { name: isAr ? "إطلاق" : "Fire", icon: "🔥", x: 85, y: 85 },
        { name: isAr ? "تصويب" : "Aim", icon: "🎯", x: 15, y: 50 },
        { name: isAr ? "قفز" : "Jump", icon: "⬆️", x: 50, y: 15 },
        { name: isAr ? "انحناء" : "Crouch", icon: "⬇️", x: 50, y: 85 },
        { name: isAr ? "اختصارات" : "Quick", icon: "⚡", x: 85, y: 15 },
      ],
      4: [
        { name: isAr ? "إطلاق" : "Fire", icon: "🔥", x: 85, y: 85 },
        { name: isAr ? "تصويب" : "Aim", icon: "🎯", x: 15, y: 50 },
        { name: isAr ? "قفز" : "Jump", icon: "⬆️", x: 50, y: 15 },
        { name: isAr ? "انحناء" : "Crouch", icon: "⬇️", x: 50, y: 85 },
        { name: isAr ? "اختصارات" : "Quick", icon: "⚡", x: 85, y: 15 },
        { name: isAr ? "طب" : "Med", icon: "💊", x: 15, y: 15 },
      ],
      5: [
        { name: isAr ? "إطلاق" : "Fire", icon: "🔥", x: 85, y: 85 },
        { name: isAr ? "تصويب" : "Aim", icon: "🎯", x: 15, y: 50 },
        { name: isAr ? "قفز" : "Jump", icon: "⬆️", x: 50, y: 15 },
        { name: isAr ? "انحناء" : "Crouch", icon: "⬇️", x: 50, y: 85 },
        { name: isAr ? "اختصارات" : "Quick", icon: "⚡", x: 85, y: 15 },
        { name: isAr ? "طب" : "Med", icon: "💊", x: 15, y: 15 },
        { name: isAr ? "مفاتيح" : "Keys", icon: "🔑", x: 85, y: 50 },
      ],
      6: [
        { name: isAr ? "إطلاق" : "Fire", icon: "🔥", x: 85, y: 85 },
        { name: isAr ? "تصويب" : "Aim", icon: "🎯", x: 15, y: 50 },
        { name: isAr ? "قفز" : "Jump", icon: "⬆️", x: 50, y: 15 },
        { name: isAr ? "انحناء" : "Crouch", icon: "⬇️", x: 50, y: 85 },
        { name: isAr ? "اختصارات" : "Quick", icon: "⚡", x: 85, y: 15 },
        { name: isAr ? "طب" : "Med", icon: "💊", x: 15, y: 15 },
        { name: isAr ? "مفاتيح" : "Keys", icon: "🔑", x: 85, y: 50 },
        { name: isAr ? "خريطة" : "Map", icon: "🗺️", x: 15, y: 85 },
      ],
    };
    return layouts[fingers as keyof typeof layouts] || layouts[4];
  };

  const buttons = getHudLayout(fingers);

  return (
    <div className="card neon-box rounded-2xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">🎮</span>
        <h3 className="font-display text-lg font-bold text-white">
          {t("hud_title", lang)} ({fingers}F)
        </h3>
      </div>

      {/* HUD Preview Canvas */}
      <div className="relative h-64 w-full overflow-hidden rounded-xl border border-white/8 bg-black/30">
        {/* Mobile frame */}
        <div className="absolute inset-2 rounded-[20px] border-2 border-white/10 bg-black/50" />

        {/* Buttons */}
        {buttons.map((btn, idx) => (
          <div
            key={idx}
            className="absolute rounded-xl border border-white/20 bg-black/50 px-3 py-2 text-xs font-semibold"
            style={{
              left: `${btn.x}%`,
              top: `${btn.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <span className="text-lg">{btn.icon}</span>
            <span className="ml-1">{btn.name}</span>
          </div>
        ))}

        {/* Crosshair */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-0.5 w-8 bg-orange-400" />
          <div className="h-8 w-0.5 bg-orange-400" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1 w-1 rounded-full bg-orange-400" />
        </div>

        {/* Status indicators */}
        <div className="absolute bottom-4 left-4 flex gap-4 text-[10px] text-white/60">
          <span>🟢 {t("hud_alive", lang)}</span>
          <span>💀 {t("hud_kills", lang)}: 5</span>
        </div>
      </div>

      <div className="mt-4 text-xs text-white/40">
        {isAr ? "معاينة توزيع الأصابع على الشاشة. " + fingers + " أصابع" : `HUD preview for ${fingers} finger layout.`}
      </div>
    </div>
  );
}
