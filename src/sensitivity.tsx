import { PRO_PROFILES, PUBG_ROWS } from "./data";
import type { Device, Weapon, ProProfile } from "./data";
import { getWeaponProfile } from "./weaponProfiles";
import type { WeaponProfile } from "./weaponProfiles";

// ═══════════════════════════════════════════════════════════════
// PUBG Mobile Global v4.5 (2026) — Hacker-Level Sensitivity
// ═══════════════════════════════════════════════════════════════
//
// Camera & ADS:  0 – 300%
// Gyroscope:     0 – 400%
// Free Look:     0 – 300%
//
// GOAL: 180° turns + headshot precision + zero recoil
// ═══════════════════════════════════════════════════════════════

const MAX_CAM  = 300;
const MAX_GYRO = 400;
const MAX_FREE = 300;

// ── Types ────────────────────────────────────────────────────
export type GyroMode = "off" | "scope" | "always";
export type PlayStyle =
  | "balanced" | "aggressive" | "competitive" | "headshot"
  | "sniper"   | "spray"      | "rush"        | "defensive"
  | "hybrid"   | "pro";

export type SensitivityParams = {
  device: Device; weapon: Weapon; gyroMode: GyroMode;
  profile: ProProfile; fingers: number; styleId: PlayStyle;
};

export type SensitivityResult = {
  cam: Record<string, number>;
  ads: Record<string, number>;
  gyro: { cam: Record<string, number>; ads: Record<string, number> };
  freeLook: { cam: number; parashoot: number; vehicle: number };
  aiScore: number;
  factors: { deviceFactor: number; weaponFactor: number; fingerFactor: number; styleFactor: number };
};

// ═══════════════════════════════════════════════════════════════
// BASE VALUES — Hacker Level
// Camera = 180° turns (CQC tracking)
// ADS = headshot precision (while firing)
// Gyro = zero recoil (recoil killer)
// ═══════════════════════════════════════════════════════════════

// ── Camera (0-300) — تتبع سريع 180° ─────────────────────────
const CAM_BASE: Record<string, number> = {
  tppNoScope: 175,  // 180° turn speed
  fppNoScope: 155,  // FPP slightly lower
  redDot:      85,  // CQC tracking
  "2x":        65,  // mid tracking
  "3x":        48,  // mid-long tracking
  "4x":        38,  // long tracking
  "6x":        28,  // sniper tracking
  "8x":        22,  // extreme range
};

// ── ADS (0-300) — دقة الهيدشوت ──────────────────────────────
const ADS_BASE: Record<string, number> = {
  tppNoScope: 130,  // hip-fire precision
  fppNoScope: 115,  // FPP hip-fire
  redDot:      32,  // HEADSHOT precision
  "2x":        26,  // mid precision
  "3x":        20,  // mid-long precision
  "4x":        16,  // long precision
  "6x":        12,  // sniper precision
  "8x":         8,  // extreme precision
};

// ── Gyro Camera (0-400) — تتبع بالجايرو ─────────────────────
const GYRO_CAM_BASE: Record<string, number> = {
  tppNoScope: 350,
  fppNoScope: 350,
  redDot:     330,
  "2x":       300,
  "3x":       270,
  "4x":       230,
  "6x":       170,
  "8x":       120,
};

// ── Gyro ADS (0-400) — مقاومة الارتداد (السر الرئيسي) ────────
const GYRO_ADS_BASE: Record<string, number> = {
  tppNoScope: 380,
  fppNoScope: 380,
  redDot:     370,  // ZERO RECOIL secret
  "2x":       350,
  "3x":       320,
  "4x":       270,
  "6x":       200,
  "8x":       140,
};

// ═══════════════════════════════════════════════════════════════
// DEVICE FACTOR (0.75 – 1.30)
// ═══════════════════════════════════════════════════════════════
function deviceFactor(d: Device): number {
  let f = 1.0;

  // FPS — higher FPS = smoother = can push higher
  if (d.fps >= 185) f *= 1.12;      // Red Magic tier
  else if (d.fps >= 165) f *= 1.08;  // ROG Phone tier
  else if (d.fps >= 144) f *= 1.05;  // high-end gaming
  else if (d.fps >= 120) f *= 1.02;  // standard high-end
  else if (d.fps >= 90) f *= 1.00;   // mid-range
  else if (d.fps >= 60) f *= 0.90;   // low-end
  else f *= 0.82;                     // very low

  // Touch rate — higher = more responsive
  if (d.touchRate >= 960) f *= 1.06;  // Red Magic
  else if (d.touchRate >= 720) f *= 1.04;  // ROG
  else if (d.touchRate >= 480) f *= 1.02;  // high-end
  else if (d.touchRate >= 240) f *= 1.00;  // standard
  else if (d.touchRate >= 120) f *= 0.96;  // low-end
  else f *= 0.92;                          // very low

  // Screen size — larger = need lower sens
  if (d.screenSize >= 14) f *= 0.82;  // large tablet
  else if (d.screenSize >= 12) f *= 0.88;  // 11-12" tablet
  else if (d.screenSize >= 10) f *= 0.93;  // 10" tablet
  else if (d.screenSize >= 8) f *= 0.97;   // iPad Mini
  else if (d.screenSize >= 6.7) f *= 1.00; // standard phone
  else if (d.screenSize >= 6.0) f *= 1.04; // compact phone
  else f *= 1.08;                           // small phone

  // Gyro quality
  if (d.gyroQuality === "excellent") f *= 1.00;
  else if (d.gyroQuality === "good") f *= 0.95;
  else f *= 0.88;

  return Math.max(0.75, Math.min(1.30, f));
}

// ═══════════════════════════════════════════════════════════════
// WEAPON FACTOR — Detailed per weapon type
// ═══════════════════════════════════════════════════════════════
function weaponCamAdsFactor(wp: WeaponProfile): number {
  // Vertical recoil — THE main factor
  // M416=50→1.0, AKM=76→0.85, UMP45=30→1.12
  const vR = 1.0 - ((wp.verticalRecoil - 50) / 100) * 0.35;

  // Horizontal recoil — affects tracking
  const hR = 1.0 - ((wp.horizontalRecoil - 28) / 100) * 0.15;

  // First shot accuracy — reward low sens for headshots
  const fsa = 1.0 - ((wp.firstShotAccuracy - 85) / 15) * 0.05;

  // Fire rate — faster = need lower sens
  const fr = wp.fireRate <= 60 ? 1.08     // bolt-action (AWM, Kar98k)
    : wp.fireRate <= 100 ? 1.06           // semi-auto sniper
    : wp.fireRate <= 350 ? 1.03           // DMR (Mini14, SKS)
    : wp.fireRate <= 450 ? 1.02           // slow DMR (SLR, Mk14)
    : wp.fireRate <= 600 ? 1.00           // slow AR (AKM)
    : wp.fireRate <= 750 ? 0.98           // standard AR (M416)
    : wp.fireRate <= 900 ? 0.96           // fast AR (Vector, JS9)
    : 0.93;                                // ultra-fast (Uzi, MP9)

  // Recovery — fast recovery = can use slightly higher
  const rec = 1.0 + ((wp.recovery - 70) / 100) * 0.05;

  return Math.max(0.70, Math.min(1.20, vR * hR * fsa * fr * rec));
}

function weaponGyroFactor(wp: WeaponProfile): number {
  // For gyro: high recoil = MORE gyro to fight it
  const vR = 1.0 + ((wp.verticalRecoil - 50) / 100) * 0.15;

  // Bolt-action: much less gyro needed
  const fr = wp.fireRate <= 60 ? 0.75     // bolt-action
    : wp.fireRate <= 100 ? 0.82           // semi-auto
    : wp.fireRate <= 350 ? 0.90           // DMR
    : wp.fireRate <= 450 ? 0.93           // slow DMR
    : wp.fireRate <= 600 ? 1.00           // slow AR
    : wp.fireRate <= 750 ? 1.03           // standard AR
    : wp.fireRate <= 900 ? 1.06           // fast AR
    : 1.10;                                // ultra-fast

  // Horizontal recoil makes gyro harder
  const hR = 1.0 - ((wp.horizontalRecoil - 28) / 100) * 0.08;

  return Math.max(0.65, Math.min(1.35, vR * fr * hR));
}

// ═══════════════════════════════════════════════════════════════
// FINGER FACTOR (0.80 – 1.20)
// ═══════════════════════════════════════════════════════════════
function fingerFactor(n: number): number {
  return ({
    2: 0.80,  // thumbs only — lowest sens
    3: 0.90,  // 3 fingers
    4: 1.00,  // 4 fingers claw — standard
    5: 1.10,  // 5 fingers
    6: 1.20,  // 6 fingers — highest
  })[n] ?? 1.0;
}

// ═══════════════════════════════════════════════════════════════
// STYLE FACTOR (0.75 – 1.30)
// ═══════════════════════════════════════════════════════════════
function styleFactor(s: PlayStyle): number {
  return ({
    sniper:      0.75,  // lowest — pixel-perfect
    defensive:   0.82,  // low — angle holding
    headshot:    0.85,  // low — first-shot accuracy
    competitive: 0.92,  // tournament
    balanced:    1.00,
    hybrid:      1.00,
    spray:       1.06,  // spray transfer
    pro:         1.10,
    aggressive:  1.18,
    rush:        1.30,  // highest — CQC domination
  })[s] ?? 1.0;
}

// ═══════════════════════════════════════════════════════════════
// GYRO MODE
// ═══════════════════════════════════════════════════════════════
function gyroActive(mode: GyroMode, key: string): boolean {
  if (mode === "off") return false;
  if (mode === "always") return true;
  return key !== "tppNoScope" && key !== "fppNoScope";
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.round(Math.max(lo, Math.min(hi, v)));
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPUTATION — Hacker Level
// ═══════════════════════════════════════════════════════════════
export function computeSensitivity(params: SensitivityParams): SensitivityResult {
  const { device, weapon, gyroMode, profile, fingers, styleId } = params;

  const wp = getWeaponProfile(weapon.name, weapon.recoil, weapon.range, weapon.type);

  const dF  = deviceFactor(device);
  const wCA = weaponCamAdsFactor(wp);
  const wG  = weaponGyroFactor(wp);
  const fF  = fingerFactor(fingers);
  const sF  = styleFactor(styleId);
  const pM  = profile.sensMultiplier;

  const gQ = device.gyroQuality === "excellent" ? 1.00
    : device.gyroQuality === "good" ? 0.94
    : 0.86;

  const cam: Record<string, number> = {};
  const ads: Record<string, number> = {};
  const gyroCam: Record<string, number> = {};
  const gyroAds: Record<string, number> = {};

  for (const row of PUBG_ROWS) {
    // Camera = 180° tracking (weapon has small effect)
    cam[row.key] = clamp(CAM_BASE[row.key] * dF * fF * sF * pM, 1, MAX_CAM);

    // ADS = headshot precision (weapon has FULL effect)
    ads[row.key] = clamp(ADS_BASE[row.key] * dF * wCA * fF * sF * pM, 1, MAX_CAM);

    // Gyro
    if (!gyroActive(gyroMode, row.key)) {
      gyroCam[row.key] = 0;
      gyroAds[row.key] = 0;
    } else {
      gyroCam[row.key] = clamp(GYRO_CAM_BASE[row.key] * dF * fF * sF * pM * gQ, 1, MAX_GYRO);
      gyroAds[row.key] = clamp(GYRO_ADS_BASE[row.key] * dF * fF * sF * pM * gQ * wG, 1, MAX_GYRO);
    }
  }

  // Free Look
  const flMul = dF * fF * sF * pM;
  const freeLook = {
    cam:       clamp(120 * flMul, 1, MAX_FREE),
    parashoot: clamp(100 * flMul, 1, MAX_FREE),
    vehicle:   clamp(80 * flMul, 1, MAX_FREE),
  };

  // AI Score
  const dScore  = Math.min(25, (dF / 1.30) * 25);
  const wScore  = Math.min(25, (wCA / 1.20) * 25);
  const fScore  = Math.min(20, (fF / 1.20) * 20);
  const sScore  = Math.min(15, (sF / 1.30) * 15);
  const pScore  = Math.min(15, (pM / 1.30) * 15);
  const aiScore = clamp(dScore + wScore + fScore + sScore + pScore, 0, 100);

  return {
    cam, ads,
    gyro: { cam: gyroCam, ads: gyroAds },
    freeLook, aiScore,
    factors: { deviceFactor: dF, weaponFactor: wCA, fingerFactor: fF, styleFactor: sF },
  };
}

export function sensVal(obj: Record<string, number>, key: string): number {
  return obj[key] ?? 0;
}

export type ProPlayerMatch = {
  player: { name: string; flag: string; fingers: number; gyro: string; weapon: string; device: string };
  similarity: number;
};

export function findClosestPros(
  _device: Device, styleId: PlayStyle, _fingers: number
): ProPlayerMatch[] {
  const profile = PRO_PROFILES.find((p) => p.id === styleId);
  if (!profile) return [];
  const pros = [
    { name: "Jonathan Gaming", flag: "🇮🇳", fingers: 4, gyro: "always", weapon: "M416", device: "iPhone 15 Pro Max", similarity: 0.92 },
    { name: "ScoutOP",         flag: "🇮🇳", fingers: 4, gyro: "scope",  weapon: "M416", device: "iPad Pro M2",       similarity: 0.88 },
    { name: "Levinho",         flag: "🇧🇷", fingers: 4, gyro: "always", weapon: "M416", device: "ROG Phone 8 Pro",   similarity: 0.85 },
    { name: "Mortal",          flag: "🇮🇳", fingers: 4, gyro: "always", weapon: "AKM",  device: "iPhone 14 Pro Max", similarity: 0.82 },
    { name: "Athena Gaming",   flag: "🇮🇳", fingers: 4, gyro: "always", weapon: "M416", device: "iPhone 14 Pro Max", similarity: 0.80 },
  ];
  return [...pros].sort((a, b) => b.similarity - a.similarity).slice(0, 3)
    .map((p) => ({ player: p, similarity: p.similarity }));
}
