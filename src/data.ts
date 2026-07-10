import type { WeaponProfile } from "./weaponProfiles";

export type Device = {
  name: string;
  fps: number;
  touchRate: number;
  screenSize: number;
  resolution: string;
  gyroQuality: "excellent" | "good" | "average";
};

export type DeviceBrand = {
  id: string;
  name: string;
  icon: string;
  accent: string;
  devices: Device[];
};

const d = (
  name: string,
  fps: number,
  touchRate: number,
  screenSize: number,
  resolution: string,
  gyroQuality: Device["gyroQuality"]
): Device => ({ name, fps, touchRate, screenSize, resolution, gyroQuality });

export const BRANDS: DeviceBrand[] = [
  {
    id: "apple",
    name: "Apple",
    icon: "🍎",
    accent: "from-slate-300 to-slate-500",
    devices: [
      d("iPhone 16 Pro Max", 120, 240, 6.9, "2868×1320", "excellent"),
      d("iPhone 16 Pro", 120, 240, 6.3, "2622×1206", "excellent"),
      d("iPhone 16 Plus", 60, 120, 6.7, "2796×1290", "excellent"),
      d("iPhone 16", 60, 120, 6.1, "2556×1179", "excellent"),
      d("iPhone 15 Pro Max", 120, 240, 6.7, "2796×1290", "excellent"),
      d("iPhone 15 Pro", 120, 240, 6.1, "2556×1179", "excellent"),
      d("iPhone 15 Plus", 60, 120, 6.7, "2796×1290", "excellent"),
      d("iPhone 15", 60, 120, 6.1, "2556×1179", "excellent"),
      d("iPhone 14 Pro Max", 120, 240, 6.7, "2796×1290", "excellent"),
      d("iPhone 14 Pro", 120, 240, 6.1, "2556×1179", "excellent"),
      d("iPhone 14 Plus", 60, 120, 6.7, "2778×1284", "excellent"),
      d("iPhone 13 Pro Max", 120, 240, 6.7, "2778×1284", "excellent"),
      d("iPhone 13 Pro", 120, 240, 6.1, "2532×1170", "excellent"),
      d("iPhone 13", 60, 120, 6.1, "2532×1170", "excellent"),
      d("iPhone 12 Pro", 60, 120, 6.1, "2532×1170", "good"),
      d("iPhone 11 Pro Max", 60, 120, 6.5, "2688×1242", "good"),
      d("iPhone 11", 60, 120, 6.1, "1792×828", "good"),
      d("iPad Pro 13 (M4)", 120, 240, 13.0, "2752×2064", "excellent"),
      d("iPad Pro 12.9 (M2)", 120, 240, 12.9, "2732×2048", "excellent"),
      d("iPad Pro 11 (M4)", 120, 240, 11.0, "2420×1668", "excellent"),
      d("iPad Air M2", 60, 120, 11.0, "2360×1640", "excellent"),
      d("iPad Air 5", 60, 120, 10.9, "2360×1640", "good"),
      d("iPad Mini 6", 60, 120, 8.3, "2266×1488", "good"),
    ],
  },
  {
    id: "samsung",
    name: "Samsung",
    icon: "📱",
    accent: "from-blue-400 to-indigo-600",
    devices: [
      d("Galaxy S25 Ultra", 120, 240, 6.9, "3120×1440", "excellent"),
      d("Galaxy S25+", 120, 240, 6.7, "3120×1440", "excellent"),
      d("Galaxy S25", 120, 240, 6.2, "2340×1080", "excellent"),
      d("Galaxy S24 Ultra", 120, 240, 6.8, "3120×1440", "excellent"),
      d("Galaxy S24+", 120, 240, 6.7, "3120×1440", "excellent"),
      d("Galaxy S24", 120, 240, 6.2, "2340×1080", "excellent"),
      d("Galaxy S23 Ultra", 120, 240, 6.8, "3088×1440", "excellent"),
      d("Galaxy S22 Ultra", 120, 240, 6.8, "3088×1440", "excellent"),
      d("Galaxy S23+", 120, 240, 6.6, "2340×1080", "excellent"),
      d("Galaxy S23", 120, 240, 6.1, "2340×1080", "excellent"),
      d("Galaxy Z Fold 6", 120, 240, 7.6, "2160×1856", "excellent"),
      d("Galaxy Z Flip 6", 120, 240, 6.7, "2640×1080", "good"),
    ],
  },
  {
    id: "xiaomi",
    name: "Xiaomi",
    icon: "🔥",
    accent: "from-orange-400 to-red-500",
    devices: [
      d("Xiaomi 15 Ultra", 120, 240, 6.73, "3200×1440", "excellent"),
      d("Xiaomi 14 Ultra", 120, 240, 6.73, "3200×1440", "excellent"),
      d("Xiaomi 14 Pro", 120, 240, 6.73, "3200×1440", "excellent"),
      d("Xiaomi 14", 120, 240, 6.36, "2670×1200", "excellent"),
      d("Xiaomi 13T Pro", 144, 480, 6.67, "2712×1220", "excellent"),
      d("Redmi K70 Pro", 120, 480, 6.67, "3200×1440", "excellent"),
      d("Redmi K70", 120, 480, 6.67, "2712×1220", "excellent"),
      d("Poco F7 Pro", 120, 480, 6.67, "3200×1440", "excellent"),
      d("Poco F6 Pro", 120, 480, 6.67, "3200×1440", "excellent"),
      d("Poco F6", 120, 240, 6.67, "2712×1220", "good"),
    ],
  },
  {
    id: "rog",
    name: "ASUS ROG",
    icon: "🎮",
    accent: "from-red-500 to-rose-700",
    devices: [
      d("ROG Phone 9 Ultimate", 185, 720, 6.78, "2400×1080", "excellent"),
      d("ROG Phone 9 Pro", 165, 720, 6.78, "2400×1080", "excellent"),
      d("ROG Phone 8 Pro", 165, 720, 6.78, "2400×1080", "excellent"),
      d("ROG Phone 7 Ultimate", 165, 720, 6.78, "2400×1080", "excellent"),
    ],
  },
  {
    id: "oneplus",
    name: "OnePlus",
    icon: "⚡",
    accent: "from-red-400 to-pink-600",
    devices: [
      d("OnePlus 13", 120, 240, 6.82, "3168×1440", "excellent"),
      d("OnePlus 12", 120, 240, 6.82, "3168×1440", "excellent"),
      d("OnePlus 11", 120, 240, 6.7, "3216×1440", "excellent"),
      d("OnePlus 12R", 120, 240, 6.78, "2780×1264", "good"),
    ],
  },
  {
    id: "redmagic",
    name: "Red Magic",
    icon: "👾",
    accent: "from-red-600 to-purple-700",
    devices: [
      d("Red Magic 10 Pro+", 165, 960, 6.85, "2688×1216", "excellent"),
      d("Red Magic 10 Pro", 144, 960, 6.85, "2688×1216", "excellent"),
      d("Red Magic 9 Pro+", 165, 960, 6.8, "2480×1116", "excellent"),
      d("Red Magic 9 Pro", 120, 960, 6.8, "2480×1116", "excellent"),
      d("Red Magic 8 Pro+", 120, 960, 6.8, "2480×1116", "excellent"),
      d("Red Magic 8 Pro", 120, 960, 6.8, "2480×1116", "excellent"),
    ],
  },
  {
    id: "other",
    name: "Other",
    icon: "📲",
    accent: "from-gray-400 to-gray-600",
    devices: [
      d("Generic High-End (120Hz)", 120, 240, 6.5, "2400×1080", "good"),
      d("Generic Mid-Range (90Hz)", 90, 180, 6.5, "2400×1080", "average"),
      d("Generic Budget (60Hz)", 60, 120, 6.5, "2400×1080", "average"),
    ],
  },
];

export type Weapon = {
  name: string;
  recoil: number;
  range: number;
  type: string;
};

export type WeaponCategory = {
  id: string;
  name: string;
  icon: string;
  weapons: Weapon[];
};

const w = (name: string, recoil: number, range: number, type: string): Weapon => ({ name, recoil, range, type });

export const WEAPONS: WeaponCategory[] = [
  {
    id: "ar",
    name: "Assault Rifles",
    icon: "🔫",
    weapons: [
      w("M416", 52, 80, "ar"),
      w("AKM", 78, 75, "ar"),
      w("SCAR-L", 48, 80, "ar"),
      w("M762", 72, 78, "ar"),
      w("AUG", 45, 82, "ar"),
      w("M16A4", 58, 95, "ar"),
      w("G36C", 50, 80, "ar"),
      w("QBZ", 46, 82, "ar"),
      w("ACE32", 54, 78, "ar"),
      w("FAMAS", 55, 85, "ar"),
      w("Groza", 68, 80, "ar"),
      w("Mk47 Mutant", 70, 90, "ar"),
    ],
  },
  {
    id: "smg",
    name: "SMG",
    icon: "💥",
    weapons: [
      w("UMP45", 32, 45, "smg"),
      w("Micro UZI", 36, 35, "smg"),
      w("Vector", 28, 35, "smg"),
      w("Tommy Gun", 40, 45, "smg"),
      w("MP5K", 30, 45, "smg"),
      w("PP-19 Bizon", 26, 48, "smg"),
      w("P90", 34, 50, "smg"),
    ],
  },
  {
    id: "dmr",
    name: "DMR",
    icon: "🎯",
    weapons: [
      w("Mini14", 38, 350, "dmr"),
      w("SKS", 48, 300, "dmr"),
      w("SLR", 62, 320, "dmr"),
      w("Mk14", 72, 380, "dmr"),
      w("VSS", 22, 200, "dmr"),
      w("QBU", 42, 320, "dmr"),
    ],
  },
  {
    id: "sniper",
    name: "Sniper Rifles",
    icon: "🔭",
    weapons: [
      w("AWM", 92, 1000, "sniper"),
      w("Kar98k", 80, 800, "sniper"),
      w("M24", 78, 850, "sniper"),
      w("Win94", 55, 400, "sniper"),
    ],
  },
  {
    id: "shotgun",
    name: "Shotguns",
    icon: "🧨",
    weapons: [
      w("S12K", 65, 25, "shotgun"),
      w("S1897", 85, 30, "shotgun"),
      w("S686", 90, 25, "shotgun"),
      w("DBS", 78, 28, "shotgun"),
    ],
  },
  {
    id: "pistol",
    name: "Pistols",
    icon: "🔫",
    weapons: [
      w("P92", 25, 30, "pistol"),
      w("P1911", 22, 35, "pistol"),
      w("R1895", 40, 40, "pistol"),
      w("Desert Eagle", 55, 45, "pistol"),
      w("P18C", 32, 25, "pistol"),
    ],
  },
];

export type Server = {
  id: string;
  name: string;
  pubgRegion: string;
  flag: string;
  city: string;
  base: number;
  probe: string;
};

export const SERVERS: Server[] = [
  { id: "me", name: "Middle East", pubgRegion: "ME", flag: "🇦🇪", city: "Abu Dhabi", base: 50, probe: "https://www.google.ae/favicon.ico" },
  { id: "eu", name: "Europe", pubgRegion: "EU", flag: "🇪🇺", city: "Frankfurt", base: 128, probe: "https://speed.hetzner.de/1GB.bin" },
  { id: "in", name: "India", pubgRegion: "IN", flag: "🇮🇳", city: "Mumbai", base: 108, probe: "https://www.google.co.in/favicon.ico" },
  { id: "as", name: "Asia", pubgRegion: "AS", flag: "🇸🇬", city: "Singapore", base: 142, probe: "https://www.google.com.sg/favicon.ico" },
  { id: "krjp", name: "Korea/Japan", pubgRegion: "KRJP", flag: "🇰🇷", city: "Seoul", base: 158, probe: "https://www.google.co.kr/favicon.ico" },
  { id: "na", name: "North America", pubgRegion: "NA", flag: "🇺🇸", city: "Virginia", base: 176, probe: "https://www.google.com/favicon.ico" },
  { id: "sa", name: "South America", pubgRegion: "SA", flag: "🇧🇷", city: "São Paulo", base: 206, probe: "https://www.google.com.br/favicon.ico" },
];

export type DnsServer = {
  id: string;
  ip: string;
  label: string;
  isp: string;
  base: number;
};

export const JORDAN_DNS: DnsServer[] = [
  { id: "dns01", ip: "94.142.37.179", label: "JO-DNS 01", isp: "Damamax", base: 6 },
  { id: "dns02", ip: "94.142.53.34", label: "JO-DNS 02", isp: "Damamax", base: 7 },
  { id: "dns03", ip: "92.253.13.100", label: "JO-DNS 03", isp: "Zain", base: 5 },
  { id: "dns04", ip: "92.253.101.217", label: "JO-DNS 04", isp: "Zain", base: 6 },
  { id: "dns05", ip: "46.185.162.241", label: "JO-DNS 05", isp: "Orange", base: 8 },
  { id: "dns06", ip: "46.185.129.77", label: "JO-DNS 06", isp: "Orange", base: 7 },
  { id: "dns07", ip: "109.237.205.149", label: "JO-DNS 07", isp: "Jordan Telecom", base: 9 },
  { id: "dns08", ip: "109.237.205.167", label: "JO-DNS 08", isp: "Jordan Telecom", base: 9 },
  { id: "dns09", ip: "213.186.174.202", label: "JO-DNS 09", isp: "Data Vault", base: 10 },
  { id: "dns10", ip: "82.212.72.18", label: "JO-DNS 10", isp: "Damamax", base: 7 },
];

export const FINGERS = [2, 3, 4, 5, 6];

export type ProProfileId = "balanced" | "aggressive" | "competitive" | "headshot" | "sniper" | "spray" | "rush" | "defensive" | "hybrid" | "pro";

export type ProProfile = {
  id: ProProfileId;
  name: string;
  nameAr: string;
  icon: string;
  recoilControl: number;
  tracking: number;
  flicking: number;
  longRange: number;
  cqcPower: number;
  sensMultiplier: number;
  description: string;
  descriptionAr: string;
};

export const PRO_PROFILES: ProProfile[] = [
  {
    id: "balanced",
    name: "Balanced",
    nameAr: "متوازن",
    icon: "⚖️",
    recoilControl: 78,
    tracking: 80,
    flicking: 72,
    longRange: 70,
    cqcPower: 75,
    sensMultiplier: 1.0,
    description: "A stable all-rounder for every situation — equally good at spray and tap fire.",
    descriptionAr: "بروفايل متوازن لكل المواقف — جيد بنفس القدر في الرش والنقر.",
  },
  {
    id: "aggressive",
    name: "Aggressive",
    nameAr: "عدواني",
    icon: "⚡",
    recoilControl: 70,
    tracking: 88,
    flicking: 82,
    longRange: 60,
    cqcPower: 92,
    sensMultiplier: 1.06,
    description: "Fast pushes and high mobility — built for rushers and entry fraggers.",
    descriptionAr: "دفع سريع وحركة عالية — مصمم للمندفعين ودخول المواجهات.",
  },
  {
    id: "competitive",
    name: "Competitive",
    nameAr: "تنافسي",
    icon: "🏆",
    recoilControl: 85,
    tracking: 86,
    flicking: 80,
    longRange: 82,
    cqcPower: 78,
    sensMultiplier: 0.97,
    description: "Tournament-tuned precision with controlled, predictable recoil.",
    descriptionAr: "دقة مضبوطة للبطولات مع ارتداد منضبط ومتوقع.",
  },
  {
    id: "headshot",
    name: "Headshot",
    nameAr: "هيدشوت",
    icon: "🎯",
    recoilControl: 74,
    tracking: 78,
    flicking: 95,
    longRange: 84,
    cqcPower: 80,
    sensMultiplier: 0.93,
    description: "Maximized first-shot accuracy for clean headshots and flicks.",
    descriptionAr: "أقصى دقة للطلقة الأولى لرأس نظيف وفليك سريع.",
  },
  {
    id: "sniper",
    name: "Sniper Elite",
    nameAr: "قنّاص نخبة",
    icon: "🔭",
    recoilControl: 80,
    tracking: 70,
    flicking: 90,
    longRange: 98,
    cqcPower: 50,
    sensMultiplier: 0.88,
    description: "Long-range dominance with ultra-low scope sensitivity for pixel-precision.",
    descriptionAr: "هيمنة بعيدة المدى بحساسية سكوب منخفضة جداً لدقة البكسل.",
  },
  {
    id: "spray",
    name: "Spray Master",
    nameAr: "ملك الرش",
    icon: "💧",
    recoilControl: 96,
    tracking: 90,
    flicking: 68,
    longRange: 72,
    cqcPower: 88,
    sensMultiplier: 1.04,
    description: "Laser-like spray control — perfect for full-auto hold-down fights.",
    descriptionAr: "تحكم رش كالليزر — مثالي لمعارك الرش التلقائي المستمر.",
  },
  {
    id: "rush",
    name: "Rush",
    nameAr: "اندفاع",
    icon: "🚀",
    recoilControl: 65,
    tracking: 92,
    flicking: 78,
    longRange: 55,
    cqcPower: 95,
    sensMultiplier: 1.12,
    description: "Ultra-fast movement and close-range domination — for aggressive pushers.",
    descriptionAr: "حركة فائقة السرعة وهيمنة قريب — للمندفعين العدوانيين.",
  },
  {
    id: "defensive",
    name: "Defensive",
    nameAr: "دفاعي",
    icon: "🛡️",
    recoilControl: 88,
    tracking: 75,
    flicking: 85,
    longRange: 85,
    cqcPower: 65,
    sensMultiplier: 0.92,
    description: "Stable and precise — perfect for holding angles and defensive play.",
    descriptionAr: "ثابت ودقيق — مثالي لحماية الزوايا واللعب الدفاعي.",
  },
  {
    id: "hybrid",
    name: "Hybrid",
    nameAr: "هجين",
    icon: "🔄",
    recoilControl: 82,
    tracking: 82,
    flicking: 82,
    longRange: 82,
    cqcPower: 82,
    sensMultiplier: 1.0,
    description: "Perfect balance between all aspects — the ultimate all-rounder.",
    descriptionAr: "توازن مثالي بين جميع الجوانب — الأسطورة الشاملة.",
  },
  {
    id: "pro",
    name: "Pro Elite",
    nameAr: "احترافي نخبة",
    icon: "💎",
    recoilControl: 94,
    tracking: 92,
    flicking: 90,
    longRange: 90,
    cqcPower: 90,
    sensMultiplier: 1.08,
    description: "Maximum performance — for professional players who demand the best.",
    descriptionAr: "أداء أقصى — للمحترفين الذين يطالبون بالأفضل.",
  },
];

export const gyroModes = [
  { id: "off", label: "Off", icon: "❌" },
  { id: "scope", label: "Scope Only", icon: "🎯" },
  { id: "always", label: "Always On", icon: "🔄" },
];

export const playStyles = [
  { id: "balanced", label: "Balanced", icon: "⚖️" },
  { id: "aggressive", label: "Aggressive", icon: "⚡" },
  { id: "competitive", label: "Competitive", icon: "🏆" },
  { id: "headshot", label: "Headshot", icon: "🎯" },
  { id: "sniper", label: "Sniper", icon: "🔭" },
  { id: "spray", label: "Spray", icon: "💧" },
  { id: "rush", label: "Rush", icon: "🚀" },
  { id: "defensive", label: "Defensive", icon: "🛡️" },
  { id: "hybrid", label: "Hybrid", icon: "🔄" },
  { id: "pro", label: "Pro", icon: "💎" },
];

export const PUBG_ROWS = [
  { key: "tppNoScope", label: "TPP No Scope" },
  { key: "fppNoScope", label: "FPP No Scope" },
  { key: "redDot", label: "Red Dot / Holo / Aim Assist" },
  { key: "2x", label: "2× Scope" },
  { key: "3x", label: "3× Scope" },
  { key: "4x", label: "4× Scope / VSS" },
  { key: "6x", label: "6× Scope" },
  { key: "8x", label: "8× Scope" },
];

// Re-export for convenience
export type { WeaponProfile };