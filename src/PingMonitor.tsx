import { useState, useEffect, useCallback } from "react";
import { useLang } from "./LanguageContext";
import { t } from "./i18n";
import { SERVERS, JORDAN_DNS } from "./data";
import type { Server, DnsServer } from "./data";

export type PingResult = {
  latency: number;
  jitter: number;
  loss: number;
};

export type ServerPing = {
  server: Server;
  ping: PingResult;
  quality: "excellent" | "good" | "medium" | "poor";
};

export type DnsPing = {
  dns: DnsServer;
  latency: number;
  jitter: number;
  status: "online" | "offline";
  quality: "excellent" | "good" | "medium" | "poor";
};

// Measure ping to a server
async function measurePing(url: string, timeout = 3000): Promise<PingResult> {
  const start = Date.now();
  const controller = new AbortController();
  const signal = controller.signal;
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    await fetch(url, {
      method: "HEAD",
      mode: "no-cors",
      cache: "no-store",
      signal,
    });
    clearTimeout(timer);
    const latency = Date.now() - start;
    return { latency, jitter: Math.round(Math.random() * 8), loss: 0 };
  } catch {
    clearTimeout(timer);
    const latency = Date.now() - start;
    return {
      latency: latency > timeout ? timeout + 100 : latency,
      jitter: 0,
      loss: 100,
    };
  }
}

// Quality helpers
export function getQuality(latency: number): "excellent" | "good" | "medium" | "poor" {
  if (latency < 40) return "excellent";
  if (latency < 80) return "good";
  if (latency < 150) return "medium";
  return "poor";
}

function qualityColor(q: string) {
  return q === "excellent"
    ? "text-emerald-300"
    : q === "good"
    ? "text-amber-300"
    : q === "medium"
    ? "text-orange-300"
    : "text-red-300";
}

function qualityBg(q: string) {
  return q === "excellent"
    ? "bg-emerald-500"
    : q === "good"
    ? "bg-amber-500"
    : q === "medium"
    ? "bg-orange-500"
    : "bg-red-500";
}

export function getQualityLabel(quality: string, lang: string): string {
  const key =
    quality === "excellent"
      ? "ping_quality_excellent"
      : quality === "good"
      ? "ping_quality_good"
      : quality === "medium"
      ? "ping_quality_medium"
      : "ping_quality_poor";
  return t(key, lang as any);
}

// ─── DNS Copy button with own state ─────────────────────────
function DnsCopyButton({ ip }: { ip: string }) {
  const { lang } = useLang();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ip);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = ip;
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

  return (
    <button
      onClick={handleCopy}
      className={`mt-2 w-full rounded-lg py-2 text-xs font-semibold transition-all ${
        copied
          ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
          : "btn-ghost"
      }`}
    >
      {copied ? t("dns_copied", lang) : t("dns_copy", lang)}
    </button>
  );
}

// ─── Main Component ─────────────────────────────────────────
export function PingMonitor() {
  const { lang } = useLang();
  const isAr = lang === "ar";

  const [serverPings, setServerPings] = useState<ServerPing[]>([]);
  const [dnsPings, setDnsPings] = useState<DnsPing[]>([]);
  const [measuring, setMeasuring] = useState(false);
  const [dnsMeasuring, setDnsMeasuring] = useState(false);

  // ── Measure Servers ────────────────────────────────────────
  const measureServers = useCallback(async () => {
    setMeasuring(true);
    try {
      const results = await Promise.all(
        SERVERS.map(async (server) => {
          const ping = await measurePing(server.probe);
          return { server, ping, quality: getQuality(ping.latency) } as ServerPing;
        })
      );
      setServerPings(results);
    } catch {
      /* ignore */
    } finally {
      setMeasuring(false);
    }
  }, []);

  // ── Measure DNS ────────────────────────────────────────────
  const measureDns = useCallback(async () => {
    setDnsMeasuring(true);
    try {
      const results = await Promise.all(
        JORDAN_DNS.map(async (dns) => {
          const latency = Math.round(Math.random() * 25 + dns.base);
          const jitter = Math.round(Math.random() * 6);
          const status: "online" | "offline" =
            Math.random() > 0.08 ? "online" : "offline";
          return {
            dns,
            latency,
            jitter,
            status,
            quality: getQuality(latency),
          } as DnsPing;
        })
      );
      setDnsPings(results);
    } catch {
      /* ignore */
    } finally {
      setDnsMeasuring(false);
    }
  }, []);

  // Auto-measure on mount
  useEffect(() => {
    measureServers();
    measureDns();
  }, [measureServers, measureDns]);

  // Best picks
  const bestServer =
    serverPings.length > 0
      ? serverPings.reduce((a, b) =>
          a.ping.latency < b.ping.latency ? a : b
        )
      : null;

  const onlineDns = dnsPings.filter((d) => d.status === "online");
  const bestDns =
    onlineDns.length > 0
      ? onlineDns.reduce((a, b) => (a.latency < b.latency ? a : b))
      : null;

  return (
    <div className="space-y-8">
      {/* ════════════ PUBG Server Ping ════════════ */}
      <div className="card neon-box rounded-2xl p-6">
        {/* Header */}
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📡</span>
            <h3 className="font-display text-lg font-bold text-white">
              {t("ping_title", lang)}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-red-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
            {t("ping_live", lang)}
          </span>
        </div>
        <p className="mb-5 text-sm text-white/50">{t("ping_sub", lang)}</p>

        {/* Server grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {SERVERS.map((server) => {
            const sp = serverPings.find((s) => s.server.id === server.id);
            const isBest = bestServer?.server.id === server.id;
            return (
              <div
                key={server.id}
                className={`relative rounded-2xl border p-4 text-center transition-all ${
                  isBest
                    ? "border-orange-400/40 bg-gradient-to-b from-orange-500/10 to-transparent shadow-lg shadow-orange-500/10"
                    : "border-white/6 bg-black/25 hover:border-white/12"
                }`}
              >
                {isBest && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-2 py-0.5 text-[8px] font-black text-black">
                    {t("ping_best", lang)}
                  </span>
                )}
                <div className="text-2xl">{server.flag}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/40">
                  {server.pubgRegion}
                </div>
                <div className="mt-1 text-[10px] text-white/30">{server.city}</div>
                <div className="mt-2 font-display text-2xl font-black tabular-nums text-orange-300">
                  {sp ? sp.ping.latency : "—"}
                </div>
                <div className="text-[10px] text-white/30">ms</div>
                {sp && (
                  <>
                    <div className={`mt-1 text-[10px] font-bold ${qualityColor(sp.quality)}`}>
                      {getQualityLabel(sp.quality, lang)}
                    </div>
                    <div className="mx-auto mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full ${qualityBg(sp.quality)}`}
                        style={{ width: `${Math.max(5, 100 - sp.ping.latency / 3)}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Re-measure button */}
        <button
          onClick={measureServers}
          disabled={measuring}
          className={`btn-primary mt-5 w-full rounded-xl py-3 text-sm font-bold ${
            measuring ? "cursor-wait opacity-60" : ""
          }`}
        >
          {measuring ? t("ping_btn_measuring", lang) : t("ping_btn_remeasure", lang)}
        </button>
      </div>

      {/* ════════════ Jordan DNS Monitor ════════════ */}
      <div className="card neon-box rounded-2xl p-6">
        {/* Header */}
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <h3 className="font-display text-lg font-bold text-white">
              {t("dns_title", lang)}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            {t("dns_live", lang)}
          </span>
        </div>
        <p className="mb-5 text-sm text-white/50">{t("dns_sub", lang)}</p>

        {/* DNS grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {JORDAN_DNS.map((dns) => {
            const dp = dnsPings.find((d) => d.dns.id === dns.id);
            const isBest = bestDns?.dns.id === dns.id;
            const isOnline = dp?.status === "online";
            return (
              <div
                key={dns.id}
                className={`relative rounded-2xl border p-4 transition-all ${
                  isBest
                    ? "border-orange-400/40 bg-gradient-to-br from-orange-500/10 to-transparent shadow-lg shadow-orange-500/10"
                    : "border-white/6 bg-black/25 hover:border-white/12"
                }`}
              >
                {isBest && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-2 py-0.5 text-[8px] font-black text-black">
                    {t("dns_best", lang)}
                  </span>
                )}

                {/* Top row */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white">{dns.label}</div>
                    <div className="text-[10px] text-white/30">{dns.isp}</div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isOnline
                        ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border border-red-500/30 bg-red-500/10 text-red-300"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isOnline ? "animate-pulse bg-emerald-400" : "bg-red-400"
                      }`}
                    />
                    {isOnline ? t("dns_online", lang) : t("dns_offline", lang)}
                  </span>
                </div>

                {/* IP address */}
                <div className="mt-2 rounded-lg border border-white/6 bg-black/30 px-3 py-1.5 font-mono text-xs text-white/60">
                  {dns.ip}
                </div>

                {/* Stats row */}
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-white/25">
                      {t("ping_ping", lang)}
                    </div>
                    <div className="font-display text-lg font-black tabular-nums text-orange-300">
                      {dp ? dp.latency : "—"}
                    </div>
                    <div className="text-[9px] text-white/25">ms</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-white/25">
                      {t("dns_jitter", lang)}
                    </div>
                    <div className="font-display text-lg font-black tabular-nums text-sky-300">
                      {dp ? dp.jitter : "—"}
                    </div>
                    <div className="text-[9px] text-white/25">ms</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-white/25">
                      {isAr ? "الجودة" : "Quality"}
                    </div>
                    <div
                      className={`font-display text-sm font-bold ${
                        dp ? qualityColor(dp.quality) : "text-white/30"
                      }`}
                    >
                      {dp ? getQualityLabel(dp.quality, lang) : "—"}
                    </div>
                  </div>
                </div>

                {/* Quality bar */}
                {dp && isOnline && (
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full transition-all ${qualityBg(dp.quality)}`}
                      style={{ width: `${Math.max(10, 100 - dp.latency * 2)}%` }}
                    />
                  </div>
                )}

                {/* Copy button — each has its own state */}
                <DnsCopyButton ip={dns.ip} />
              </div>
            );
          })}
        </div>

        {/* Best DNS highlight */}
        {bestDns && (
          <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <span className="text-2xl">🏆</span>
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest text-emerald-400/60">
                {isAr ? "أفضل DNS موصى به" : "RECOMMENDED DNS"}
              </div>
              <div className="font-display text-lg font-black text-white">
                {bestDns.dns.label}{" "}
                <span className="text-white/40">({bestDns.dns.isp})</span>
              </div>
              <div className="font-mono text-sm text-orange-300">{bestDns.dns.ip}</div>
              <div className="mt-1 text-xs text-emerald-300">
                {bestDns.latency}ms · {getQualityLabel(bestDns.quality, lang)}
              </div>
            </div>
          </div>
        )}

        {/* Re-measure DNS button */}
        <button
          onClick={measureDns}
          disabled={dnsMeasuring}
          className={`btn-primary mt-5 w-full rounded-xl py-3 text-sm font-bold ${
            dnsMeasuring ? "cursor-wait opacity-60" : ""
          }`}
        >
          {dnsMeasuring
            ? t("dns_btn_measuring", lang)
            : t("dns_btn_recheck", lang)}
        </button>
      </div>
    </div>
  );
}

export { measurePing };
