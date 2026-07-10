import { useState } from "react";
import { useLang } from "./LanguageContext";
import { t } from "./i18n";

export function PacSection() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [copied, setCopied] = useState(false);

  const pacUrl = "https://raw.githubusercontent.com/alyazouri/professional-website-developmentnew/main/pac.js";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pacUrl);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = pacUrl;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = {
    android: [
      { label: t("pac_step_android_1", lang), desc: isAr ? "انسخ الرابط أعلاه" : "Copy the PAC script URL above" },
      { label: t("pac_step_android_2", lang), desc: isAr ? "افتح إعدادات WiFi → اختر الشبكة → Advanced → Proxy" : "Open WiFi settings → select network → Advanced → Proxy" },
      { label: t("pac_step_android_3", lang), desc: isAr ? "اختر Auto Config ثم الصق الرابط" : "Select Auto Config and paste the URL" },
      { label: t("pac_step_android_4", lang), desc: isAr ? "احفظ وأعد تشغيل PUBG Mobile" : "Save and restart PUBG Mobile" },
    ],
    ios: [
      { label: t("pac_step_ios_1", lang), desc: isAr ? "انسخ الرابط أعلاه" : "Copy the PAC script URL above" },
      { label: t("pac_step_ios_2", lang), desc: isAr ? "Settings → WiFi → اختر الشبكة → Configure Proxy" : "Settings → WiFi → select network → Configure Proxy" },
      { label: t("pac_step_ios_3", lang), desc: isAr ? "اختر Automatic ثم الصق الرابط" : "Select Automatic and paste the URL" },
      { label: t("pac_step_ios_4", lang), desc: isAr ? "احفظ وأعد تشغيل اللعبة" : "Save and restart the game" },
    ],
    windows: [
      { label: t("pac_step_windows_1", lang), desc: isAr ? "انسخ الرابط أعلاه" : "Copy the PAC script URL above" },
      { label: t("pac_step_windows_2", lang), desc: isAr ? "Settings → Network & Internet → Proxy" : "Settings → Network & Internet → Proxy" },
      { label: t("pac_step_windows_3", lang), desc: isAr ? "Use setup script → الصق الرابط → Save" : "Use setup script → paste URL → Save" },
    ],
  };

  const [activeTab, setActiveTab] = useState<"android" | "ios" | "windows">("android");

  return (
    <div className="card neon-box rounded-2xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">📜</span>
        <h3 className="font-display text-lg font-bold text-white">
          {t("pac_title", lang)}
        </h3>
      </div>
      <p className="mb-4 text-sm text-white/60">{t("pac_sub", lang)}</p>

      {/* PAC URL Card */}
      <div className="mb-6 rounded-xl border border-white/8 bg-black/20 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-white/40">
              {t("pac_link_label", lang)}
            </div>
            <div className="mt-1 font-mono text-sm text-orange-300 break-all">
              {pacUrl}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                copied
                  ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                  : "btn-ghost"
              }`}
            >
              {copied ? t("pac_copied", lang) : t("pac_copy", lang)}
            </button>
            <a href={pacUrl} target="_blank" className="btn-primary rounded-lg px-3 py-1.5 text-xs">
              {t("pac_open", lang)}
            </a>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
        <span className="text-emerald-300">{t("pac_status", lang)}: </span>
        <span className="font-semibold text-emerald-300">{t("pac_ready", lang)}</span>
      </div>

      {/* Installation Tabs */}
      <div className="rounded-xl border border-white/8 bg-black/20 p-1">
        <div className="flex gap-1">
          {(["android", "ios", "windows"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-orange-500/15 text-orange-300"
                  : "text-white/60 hover:bg-white/5"
              }`}
            >
              {tab === "android" && "🤖 Android"}
              {tab === "ios" && "🍎 iOS"}
              {tab === "windows" && "🪟 Windows"}
            </button>
          ))}
        </div>
      </div>

      {/* Installation Steps */}
      <div className="mt-4 space-y-3">
        {steps[activeTab].map((step, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 rounded-xl border border-white/8 bg-black/20 p-4"
          >
            <div className="flex-shrink-0 rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-1 text-[10px] font-bold text-orange-300">
              {idx + 1}
            </div>
            <div>
              <div className="font-semibold text-white">{step.label}</div>
              <div className="text-sm text-white/60">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Restart Notice */}
      <div className="mt-4 rounded-xl border border-orange-500/30 bg-orange-500/10 p-3 text-center text-sm text-orange-300">
        {t("pac_restart", lang)} · {t("pac_restart_note", lang)}
      </div>
    </div>
  );
}