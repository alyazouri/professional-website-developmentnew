import { useState, useEffect, useCallback } from "react";
import { useLang } from "./LanguageContext";
import { t } from "./i18n";
import { Particles } from "./Particles";
import { StatusBar } from "./StatusBar";
import { Hero } from "./Hero";
import { RatingSection, ShareButton, AIPredictions } from "./Features";

import { PingMonitor } from "./PingMonitor";
import { PacSection } from "./PacSection";

import { TouchTest } from "./TouchTest";
import { QuickSearch } from "./QuickSearch";

import { MusicPlayer } from "./MusicPlayer";
import { PWABanner } from "./PWABanner";
import { BRANDS, WEAPONS, PRO_PROFILES, FINGERS, gyroModes, PUBG_ROWS } from "./data";
import { computeSensitivity, findClosestPros, sensVal } from "./sensitivity";
import type { Device, Weapon, DeviceBrand, WeaponCategory, ProProfile } from "./data";
import type { GyroMode, PlayStyle, SensitivityParams, SensitivityResult } from "./sensitivity";

type SavedProfile = {
  name: string;
  params: SensitivityParams;
  savedAt: string;
};

const MAX_SAVED_PROFILES = 5;

function App() {
  const { lang } = useLang();
  const isAr = lang === "ar";

  // State for device selection
  const [selectedBrand, setSelectedBrand] = useState<DeviceBrand | null>(BRANDS[0]);
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(0);
  const [deviceSearch, setDeviceSearch] = useState("");

  // State for gyro mode
  const [gyroMode, setGyroMode] = useState<GyroMode>("scope");

  // State for pro profile
  const [selectedProfile, setSelectedProfile] = useState<ProProfile | null>(PRO_PROFILES[0]);

  // State for fingers
  const [fingers, setFingers] = useState(4);

  // Play style is now determined by pro profile
  const playStyleId: PlayStyle = selectedProfile?.id as PlayStyle || "balanced";

  // State for weapon
  const [selectedWeaponCategory, setSelectedWeaponCategory] = useState<WeaponCategory | null>(WEAPONS[0]);
  const [selectedWeaponIndex, setSelectedWeaponIndex] = useState(0);
  const [showWeaponDropdown, setShowWeaponDropdown] = useState(false);
  const [showWeaponModelDropdown, setShowWeaponModelDropdown] = useState(false);

  // State for sensitivity results
  const [sens, setSens] = useState<SensitivityResult | null>(null);

  // State for ping
  const [ping, setPing] = useState<number | null>(null);

  // State for saved profiles
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [justSaved, setJustSaved] = useState(false);

  // State for scroll reveal (removed - not needed)

  // Get current device
  const currentDevice: Device | null = selectedBrand
    ? selectedBrand.devices[selectedDeviceIndex]
    : null;

  // Get current weapon
  const currentWeapon: Weapon | null = selectedWeaponCategory
    ? selectedWeaponCategory.weapons[selectedWeaponIndex]
    : null;

  // Get current profile
  const currentProfile: ProProfile | null = selectedProfile;

  // Compute sensitivity whenever params change
  useEffect(() => {
    if (currentDevice && currentWeapon && currentProfile) {
      const params: SensitivityParams = {
        device: currentDevice,
        weapon: currentWeapon,
        gyroMode,
        profile: currentProfile,
        fingers,
        styleId: playStyleId,
      };
      const result = computeSensitivity(params);
      setSens(result);
    }
  }, [currentDevice, currentWeapon, gyroMode, currentProfile, fingers, playStyleId]);

  // Measure ping on mount
  useEffect(() => {
    // Import dynamically to avoid circular dependency
    import("./PingMonitor").then(({ measurePing }) => {
      // Measure ping to a test server
      measurePing("https://www.google.com/favicon.ico", 5000).then((result) => {
        setPing(result.latency);
      });
    });
  }, []);

  // Load saved profiles
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sensitivity_profiles");
      if (saved) {
        setProfiles(JSON.parse(saved));
      }
    } catch { /* ignore */ }
  }, []);

  // Save profiles
  const saveProfile = useCallback(() => {
    if (!currentDevice || !currentWeapon || !currentProfile) return;

    const newProfile: SavedProfile = {
      name: `${currentDevice.name} - ${currentWeapon.name} - ${fingers}F`,
      params: {
        device: currentDevice,
        weapon: currentWeapon,
        gyroMode,
        profile: currentProfile,
        fingers,
        styleId: playStyleId,
      },
      savedAt: new Date().toISOString(),
    };

    setProfiles((prev) => {
      const updated = [newProfile, ...prev].slice(0, MAX_SAVED_PROFILES);
      try {
        localStorage.setItem("sensitivity_profiles", JSON.stringify(updated));
      } catch { /* ignore */ }
      return updated;
    });

    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
  }, [currentDevice, currentWeapon, currentProfile, gyroMode, fingers, playStyleId]);



  // Handle device selection
  const handleBrandSelect = (brand: DeviceBrand) => {
    setSelectedBrand(brand);
    setSelectedDeviceIndex(0);
  };

  const handleDeviceSelect = (index: number) => {
    setSelectedDeviceIndex(index);
  };

  // Handle weapon selection
  const handleWeaponCategorySelect = (category: WeaponCategory) => {
    setSelectedWeaponCategory(category);
    setSelectedWeaponIndex(0);
    setShowWeaponDropdown(false);
    setShowWeaponModelDropdown(false);
  };

  const handleWeaponSelect = (index: number) => {
    setSelectedWeaponIndex(index);
    setShowWeaponModelDropdown(false);
  };

  // Handle profile selection
  const handleProfileSelect = (profile: ProProfile) => {
    setSelectedProfile(profile);
  };



  // Get PPI
  const getPPI = (device: Device): number => {
    const width = parseInt(device.resolution.split("×")[0] || "2400");
    const height = parseInt(device.resolution.split("×")[1] || "1080");
    const diagonal = Math.sqrt(width * width + height * height);
    return Math.round((diagonal * 25.4) / device.screenSize);
  };

  // Get gyro label
  const getGyroLabel = (device: Device): string => {
    return device.gyroQuality === "excellent"
      ? t("device_gyro_excellent", lang)
      : device.gyroQuality === "good"
      ? t("device_gyro_good", lang)
      : t("device_gyro_average", lang);
  };

  if (!currentDevice || !currentWeapon || !currentProfile) {
    return (
      <>
        <Particles />
        <StatusBar ping={ping} />
        <div className="min-h-screen pt-14">
          <div className="container-section py-20">
            <div className="text-center">
              <div className="text-6xl">⚠️</div>
              <h2 className="mt-4 font-display text-2xl font-bold text-white">
                {isAr ? "جاري التحميل..." : "Loading..."}
              </h2>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Particles />
      <StatusBar ping={ping} />
      
      <main className="min-h-screen pt-14">
        {/* Hero Section */}
        <section id="top" className="container-section py-10">
          <Hero ping={ping} />
        </section>

        {/* Generator Section */}
        <section
          id="generator"
          className="container-section py-10"
        >
          <div>
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-1">
                <span className="text-orange-300">🎮</span>
                <span className="text-[10px] font-bold tracking-widest text-orange-300">
                  {t("sec_generator_eyebrow", lang)}
                </span>
              </div>
              <h2 className="font-display mt-4 text-3xl font-black text-white sm:text-4xl">
                {t("sec_generator_title", lang)}
              </h2>
              <p className="mt-2 text-sm text-white/60">
                {t("sec_generator_sub", lang)}
              </p>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Device Selection */}
              <div className="card neon-box rounded-2xl p-5 lg:row-span-2">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📱</span>
                    <span className="font-display text-sm font-bold tracking-wide text-white">{t("device_select", lang)}</span>
                  </div>
                  <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-[10px] font-bold text-orange-300">
                    {selectedBrand?.devices.length ?? 0} {isAr ? "جهاز" : "models"}
                  </span>
                </div>

                {/* Brand Grid */}
                <div className="mb-3">
                  <div className="text-[10px] uppercase tracking-widest text-white/30 mb-2">{isAr ? "العلامة التجارية" : "BRAND"}</div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {BRANDS.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => { handleBrandSelect(brand); setDeviceSearch(""); }}
                        className={`group relative overflow-hidden rounded-xl border-2 p-2.5 text-center transition-all duration-200 ${
                          selectedBrand?.id === brand.id
                            ? "border-orange-400 bg-gradient-to-br from-orange-500/20 to-red-500/10 shadow-lg shadow-orange-500/15 scale-[1.04]"
                            : "border-white/6 bg-black/30 hover:border-white/15 hover:bg-white/5"
                        }`}
                      >
                        <div className="text-xl leading-none">{brand.icon}</div>
                        <div className={`mt-1 text-[9px] font-bold leading-tight ${selectedBrand?.id === brand.id ? "text-orange-300" : "text-white/50 group-hover:text-white/70"}`}>
                          {brand.name}
                        </div>
                        {selectedBrand?.id === brand.id && (
                          <div className="absolute -top-px -right-px rounded-bl-lg rounded-tr-xl bg-orange-500 px-1 py-px text-[7px] font-black text-black">✓</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search */}
                {selectedBrand && (
                  <div className="relative mb-3">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-white/30">🔍</span>
                    <input
                      type="text"
                      value={deviceSearch}
                      onChange={(e) => setDeviceSearch(e.target.value)}
                      placeholder={isAr ? "ابحث عن جهاز..." : `Search ${selectedBrand.name}...`}
                      className="w-full rounded-xl border border-white/8 bg-black/40 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/30 focus:border-orange-500/40 focus:outline-none focus:ring-1 focus:ring-orange-500/30"
                    />
                    {deviceSearch && (
                      <button onClick={() => setDeviceSearch("")} className="absolute inset-y-0 right-3 flex items-center text-white/40 hover:text-white">✕</button>
                    )}
                  </div>
                )}

                {/* Device List */}
                {selectedBrand && (
                  <div className="mb-3 max-h-48 space-y-1 overflow-y-auto rounded-xl border border-white/6 bg-black/30 p-1.5 scrollbar-thin">
                    {selectedBrand.devices
                      .filter((d) => !deviceSearch || d.name.toLowerCase().includes(deviceSearch.toLowerCase()))
                      .map((device) => {
                        const realIdx = selectedBrand.devices.indexOf(device);
                        const isSelected = realIdx === selectedDeviceIndex;
                        return (
                          <button
                            key={realIdx}
                            onClick={() => { handleDeviceSelect(realIdx); setDeviceSearch(""); }}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                              isSelected
                                ? "bg-gradient-to-r from-orange-500/15 to-transparent border border-orange-500/25 shadow-sm shadow-orange-500/10"
                                : "border border-transparent hover:bg-white/5"
                            }`}
                          >
                            {/* Device indicator */}
                            <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sm ${
                              isSelected ? "bg-orange-500/20 text-orange-300" : "bg-white/5 text-white/40"
                            }`}>
                              {device.screenSize >= 10 ? "📟" : "📱"}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className={`truncate text-sm font-semibold ${isSelected ? "text-orange-200" : "text-white/80"}`}>
                                {device.name}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-[10px] ${isSelected ? "text-orange-300/70" : "text-white/30"}`}>
                                  ⚡{device.fps}Hz
                                </span>
                                <span className={`text-[10px] ${isSelected ? "text-orange-300/70" : "text-white/30"}`}>
                                  👆{device.touchRate}Hz
                                </span>
                                <span className={`text-[10px] ${isSelected ? "text-orange-300/70" : "text-white/30"}`}>
                                  📐{device.screenSize}"
                                </span>
                              </div>
                            </div>

                            {/* Gyro badge */}
                            <div className={`flex-shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                              device.gyroQuality === "excellent"
                                ? "bg-emerald-500/15 text-emerald-300"
                                : device.gyroQuality === "good"
                                ? "bg-amber-500/15 text-amber-300"
                                : "bg-white/5 text-white/40"
                            }`}>
                              {device.gyroQuality === "excellent" ? "★★★" : device.gyroQuality === "good" ? "★★" : "★"}
                            </div>
                          </button>
                        );
                      })}
                    {selectedBrand.devices.filter((d) => !deviceSearch || d.name.toLowerCase().includes(deviceSearch.toLowerCase())).length === 0 && (
                      <div className="py-6 text-center text-sm text-white/30">{isAr ? "لا توجد نتائج" : "No results"}</div>
                    )}
                  </div>
                )}

                {/* Selected Device Card */}
                <div className="rounded-xl border border-orange-500/15 bg-gradient-to-br from-orange-500/5 to-transparent p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/25 to-red-500/15 text-xl">
                      {currentDevice.screenSize >= 10 ? "📟" : "📱"}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{currentDevice.name}</div>
                      <div className="text-[10px] text-orange-300/60">{selectedBrand?.name} · {currentDevice.resolution}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {[
                      { icon: "⚡", label: isAr ? "معدل الإطارات" : "FPS", value: `${currentDevice.fps} Hz`, color: currentDevice.fps >= 120 ? "text-emerald-300" : currentDevice.fps >= 90 ? "text-amber-300" : "text-white/60" },
                      { icon: "👆", label: isAr ? "معدل اللمس" : "Touch Rate", value: `${currentDevice.touchRate} Hz`, color: currentDevice.touchRate >= 480 ? "text-emerald-300" : currentDevice.touchRate >= 240 ? "text-amber-300" : "text-white/60" },
                      { icon: "📐", label: isAr ? "حجم الشاشة" : "Screen", value: `${currentDevice.screenSize}"`, color: "text-sky-300" },
                      { icon: "📊", label: "PPI", value: `${getPPI(currentDevice)}`, color: "text-violet-300" },
                    ].map((stat) => (
                      <div key={stat.label} className="flex items-center gap-2">
                        <span className="text-sm">{stat.icon}</span>
                        <div>
                          <div className="text-[9px] uppercase tracking-widest text-white/30">{stat.label}</div>
                          <div className={`text-sm font-bold ${stat.color}`}>{stat.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Gyro bar */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm">🌀</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-widest text-white/30">{isAr ? "جودة الجايرو" : "GYRO QUALITY"}</span>
                        <span className={`text-xs font-bold ${
                          currentDevice.gyroQuality === "excellent" ? "text-emerald-300"
                          : currentDevice.gyroQuality === "good" ? "text-amber-300"
                          : "text-orange-300"
                        }`}>{getGyroLabel(currentDevice)}</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <div className={`h-full rounded-full transition-all duration-500 ${
                          currentDevice.gyroQuality === "excellent" ? "w-full bg-gradient-to-r from-emerald-500 to-emerald-300"
                          : currentDevice.gyroQuality === "good" ? "w-2/3 bg-gradient-to-r from-amber-500 to-amber-300"
                          : "w-1/3 bg-gradient-to-r from-orange-500 to-orange-300"
                        }`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gyro Mode */}
              <div className="card rounded-2xl p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xl">🌀</span>
                  <span className="font-semibold text-white">{t("gyro_title", lang)}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {gyroModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setGyroMode(mode.id as GyroMode)}
                      className={`rounded-xl border-2 p-4 text-center transition-all ${
                        gyroMode === mode.id
                          ? "border-orange-400 bg-orange-500/15 text-orange-300 scale-105 shadow-lg shadow-orange-500/20"
                          : "border-white/8 bg-black/20 text-white/60 hover:border-orange-400/30 hover:bg-black/30"
                      }`}
                    >
                      <div className="text-2xl mb-2">{mode.icon}</div>
                      <div className="text-sm font-bold">
                        {mode.id === "off" ? t("gyro_off", lang)
                         : mode.id === "scope" ? t("gyro_scope", lang)
                         : t("gyro_always", lang)}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-3 text-center text-xs text-white/40">
                  {gyroMode === "off" ? t("gyro_msg_off", lang)
                   : gyroMode === "scope" ? t("gyro_msg_scope", lang)
                   : t("gyro_msg_always", lang)}
                </div>
              </div>

              {/* Pro Profile */}
              <div className="card rounded-2xl p-4 lg:col-span-2">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xl">🏆</span>
                  <span className="font-semibold text-white">
                    {isAr ? "البروفايل الاحترافي" : "Pro Profile"}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {PRO_PROFILES.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => handleProfileSelect(profile)}
                      className={`rounded-xl border-2 p-3 text-center transition-all ${
                        currentProfile?.id === profile.id
                          ? "border-orange-400 bg-orange-500/15 scale-105 shadow-lg shadow-orange-500/20"
                          : "border-white/8 bg-black/20 hover:border-orange-400/30 hover:bg-black/30"
                      }`}
                    >
                      <div className="text-2xl mb-1">{profile.icon}</div>
                      <div className="text-xs font-bold text-white">
                        {isAr ? profile.nameAr : profile.name}
                      </div>
                      <div className="text-[10px] text-white/40 mt-1">
                        {profile.sensMultiplier > 1 && "+"}{(profile.sensMultiplier * 100 - 100).toFixed(0)}%
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-3 text-center text-xs text-white/40">
                  {isAr ? "اختر أسلوب اللعب المناسب لك" : "Choose your preferred play style"}
                </div>
              </div>

              {/* Fingers Selection */}
              <div className="card rounded-2xl p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xl">👆</span>
                  <span className="font-semibold text-white">{t("fingers_title", lang)}</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {FINGERS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFingers(f)}
                      className={`rounded-xl border-2 p-4 text-center transition-all ${
                        fingers === f
                          ? "border-orange-400 bg-orange-500/15 text-orange-300 scale-105"
                          : "border-white/8 bg-black/20 text-white/60 hover:border-orange-400/30 hover:bg-black/30"
                      }`}
                    >
                      <div className="text-2xl font-black">{f}</div>
                      <div className="text-xs text-white/50 mt-1">
                        {isAr ? "أصابع" : "Fingers"}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-3 text-center text-xs text-white/40">
                  {isAr ? "اختر عدد الأصابع التي تستخدمها للعب" : "Select how many fingers you use to play"}
                </div>
              </div>

              {/* Weapon Selection */}
              <div className="card rounded-2xl p-4">
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-xl">🔫</span>
                  <span className="font-semibold text-white">{t("weapon_title", lang)}</span>
                </div>
                
                {/* Weapon Category Selector */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowWeaponDropdown(!showWeaponDropdown);
                      setShowWeaponModelDropdown(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg border border-white/8 bg-black/20 p-3 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{selectedWeaponCategory?.icon}</span>
                      <span className="font-semibold">{selectedWeaponCategory?.name}</span>
                    </div>
                    <span className="text-white/40">▾</span>
                  </button>
                  
                  {showWeaponDropdown && (
                    <div className="absolute top-full mt-2 max-h-64 overflow-y-auto rounded-xl border border-white/8 bg-black/30 p-2 shadow-2xl z-50">
                      <div className="grid grid-cols-3 gap-2">
                        {WEAPONS.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => handleWeaponCategorySelect(category)}
                            className={`rounded-lg p-2 text-center text-sm transition-colors hover:bg-white/5 ${
                              selectedWeaponCategory?.id === category.id ? "bg-orange-500/15 text-orange-300" : ""
                            }`}
                          >
                            <div className="text-xl mb-1">{category.icon}</div>
                            <div className="text-xs">{isAr ? category.name : category.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Weapon Model Selector */}
                {selectedWeaponCategory && (
                  <div className="relative mt-2">
                    <button
                      onClick={() => setShowWeaponModelDropdown(!showWeaponModelDropdown)}
                      className="flex w-full items-center justify-between rounded-lg border border-white/8 bg-black/20 p-3 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🔫</span>
                        <span className="truncate">{currentWeapon.name}</span>
                      </div>
                      <span className="text-white/40">▾</span>
                    </button>
                    
                    {showWeaponModelDropdown && (
                      <div className="absolute top-full mt-2 max-h-64 overflow-y-auto rounded-xl border border-white/8 bg-black/30 p-2 shadow-2xl z-50">
                        {selectedWeaponCategory.weapons.map((weapon, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleWeaponSelect(idx)}
                            className={`w-full rounded-lg p-2 text-left text-sm transition-colors hover:bg-white/5 ${
                              idx === selectedWeaponIndex ? "bg-orange-500/15 text-orange-300" : ""
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-lg">🔫</span>
                              <span>{weapon.name}</span>
                            </div>
                            <div className="text-[10px] text-white/40">
                              {t("weapon_recoil", lang)}: {weapon.recoil} · {t("weapon_range", lang)}: {weapon.range}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={saveProfile}
                className={`rounded-xl px-5 py-3 text-sm font-bold transition-all ${
                  justSaved
                    ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-300 shadow-lg shadow-emerald-500/10"
                    : "btn-primary"
                }`}
              >
                {justSaved
                  ? (isAr ? "✅ تم الحفظ!" : "✅ Saved!")
                  : (isAr ? "💾 حفظ الإعدادات" : "💾 Save Settings")}
              </button>
              <ShareButton />
            </div>

            {/* Output - AI Score */}
            {sens && (
              <div className="mt-8">
                <div className="card neon-box rounded-2xl p-6">
                  <div className="text-center">
                    <div className="text-[10px] uppercase tracking-widest text-white/40">
                      {t("ai_score_label", lang)}
                    </div>
                    <h3 className="mt-2 font-display text-xl font-bold text-white">
                      {t("ai_score_title", lang)}
                    </h3>
                    <p className="text-sm text-white/60">
                      {currentDevice.name} · {currentWeapon.name} · {fingers}{t("ai_suffix", lang)}
                    </p>
                    
                    <div className="my-4">
                      <div className="relative mx-auto h-24 w-24">
                        <svg className="h-full w-full" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            stroke="rgba(255,122,0,0.1)"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            stroke="url(#aiGrad)"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray="282.7"
                            strokeDashoffset={282.7 - (282.7 * sens.aiScore) / 100}
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                          />
                          <defs>
                            <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ff7a00" />
                              <stop offset="100%" stopColor="#ffd166" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-display text-2xl font-black text-orange-300">
                            {sens.aiScore}
                          </span>
                        </div>
                      </div>
                      <div className="font-display text-lg font-bold text-white">
                        AI SCORE
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pro Player Match */}
                {(() => {
                  const pros = findClosestPros(currentDevice, playStyleId, fingers);
                  const top = pros[0];
                  if (!top) return null;
                  return (
                    <div className="card neon-box mt-4 rounded-2xl p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">👑</span>
                        <div>
                          <div className="font-semibold text-white">
                            {isAr ? "أقرب لاعب محترف" : "Closest Pro Player"}
                          </div>
                          <div className="text-sm text-white/60">
                            {Math.round(top.similarity * 100)}% {isAr ? "تطابق" : "match"}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 rounded-xl border border-white/8 bg-black/20 p-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{top.player.flag}</span>
                          <div>
                            <div className="font-semibold text-white">{top.player.name}</div>
                            <div className="text-xs text-white/40">
                              {top.player.fingers}F · {top.player.gyro} · {top.player.weapon} · {top.player.device}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Sensitivity Tables */}
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">

                  {/* Camera Sensitivity 0-300% */}
                  <div className="card rounded-2xl p-4">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📷</span>
                        <span className="font-semibold text-white">{t("sens_camera", lang)}</span>
                      </div>
                      <span className="text-[10px] text-white/30">0 – 300%</span>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      {PUBG_ROWS.map((r) => {
                        const v = sensVal(sens.cam, r.key);
                        const pct = Math.min(100, (v / 300) * 100);
                        return (
                          <div key={r.key} className="flex items-center gap-3 rounded-lg border border-white/6 bg-black/20 px-3 py-2">
                            <span className="w-[130px] truncate text-xs text-white/60">{r.label}</span>
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                              <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-12 text-right font-display text-sm font-bold tabular-nums text-orange-300">{v}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ADS Sensitivity 0-300% */}
                  <div className="card rounded-2xl p-4">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🎯</span>
                        <span className="font-semibold text-white">{t("sens_ads", lang)}</span>
                      </div>
                      <span className="text-[10px] text-white/30">0 – 300%</span>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      {PUBG_ROWS.map((r) => {
                        const v = sensVal(sens.ads, r.key);
                        const pct = Math.min(100, (v / 300) * 100);
                        return (
                          <div key={r.key} className="flex items-center gap-3 rounded-lg border border-white/6 bg-black/20 px-3 py-2">
                            <span className="w-[130px] truncate text-xs text-white/60">{r.label}</span>
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                              <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-400 transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-12 text-right font-display text-sm font-bold tabular-nums text-sky-300">{v}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Gyro Sensitivity (if enabled) 0-400% */}
                  {gyroMode !== "off" && (
                    <>
                      <div className="card rounded-2xl p-4">
                        <div className="mb-1 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{gyroMode === "scope" ? "🎯" : "🔄"}</span>
                            <span className="font-semibold text-white">{t("sens_gyro_cam", lang)}</span>
                          </div>
                          <span className="text-[10px] text-white/30">0 – 400%</span>
                        </div>
                        <div className="mt-3 space-y-1.5">
                          {PUBG_ROWS.map((r) => {
                            const v = sensVal(sens.gyro.cam, r.key);
                            const pct = Math.min(100, (v / 400) * 100);
                            return (
                              <div key={r.key} className="flex items-center gap-3 rounded-lg border border-white/6 bg-black/20 px-3 py-2">
                                <span className="w-[130px] truncate text-xs text-white/60">{r.label}</span>
                                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400 transition-all" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="w-12 text-right font-display text-sm font-bold tabular-nums text-violet-300">{v > 0 ? v + "%" : "—"}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="card rounded-2xl p-4">
                        <div className="mb-1 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🎯</span>
                            <span className="font-semibold text-white">{t("sens_gyro_ads", lang)}</span>
                          </div>
                          <span className="text-[10px] text-white/30">0 – 400%</span>
                        </div>
                        <div className="mt-3 space-y-1.5">
                          {PUBG_ROWS.map((r) => {
                            const v = sensVal(sens.gyro.ads, r.key);
                            const pct = Math.min(100, (v / 400) * 100);
                            return (
                              <div key={r.key} className="flex items-center gap-3 rounded-lg border border-white/6 bg-black/20 px-3 py-2">
                                <span className="w-[130px] truncate text-xs text-white/60">{r.label}</span>
                                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                                  <div className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all" style={{ width: `${pct}%` }} />
                                </div>
                                <span className="w-12 text-right font-display text-sm font-bold tabular-nums text-pink-300">{v > 0 ? v + "%" : "—"}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {gyroMode === "off" && (
                    <div className="card rounded-2xl p-6">
                      <div className="text-center">
                        <div className="text-4xl">⭕</div>
                        <div className="mt-2 font-display text-sm font-bold text-white">{t("gyro_disabled_title", lang)}</div>
                        <div className="mt-1 text-xs text-white/40">{t("gyro_disabled_msg", lang)}</div>
                      </div>
                    </div>
                  )}

                  {/* Free Look 0-300% */}
                  <div className="card rounded-2xl p-4">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">👀</span>
                        <span className="font-semibold text-white">{t("sens_freelook", lang)}</span>
                      </div>
                      <span className="text-[10px] text-white/30">0 – 300%</span>
                    </div>
                    <div className="mt-3 space-y-1.5">
                      {[
                        { label: t("sens_freelook_cam", lang), val: sens.freeLook.cam },
                        { label: t("sens_freelook_para", lang), val: sens.freeLook.parashoot },
                        { label: t("sens_freelook_vehicle", lang), val: sens.freeLook.vehicle },
                      ].map((fl) => {
                        const pct = Math.min(100, (fl.val / 300) * 100);
                        return (
                          <div key={fl.label} className="flex items-center gap-3 rounded-lg border border-white/6 bg-black/20 px-3 py-2">
                            <span className="w-[130px] truncate text-xs text-white/60">{fl.label}</span>
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-12 text-right font-display text-sm font-bold tabular-nums text-emerald-300">{fl.val}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Stability Analysis */}
                <div className="card neon-box mt-6 rounded-2xl p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-xl">📊</span>
                    <h3 className="font-display text-lg font-bold text-white">
                      {t("stability_title", lang)}
                    </h3>
                  </div>
                  <div className="text-center text-sm text-white/60">
                    R = D × W × F × S
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                      { 
                        label: t("stability_device", lang), 
                        val: sens.factors.deviceFactor, 
                        color: "from-orange-500 to-red-500" 
                      },
                      { 
                        label: t("stability_weapon", lang), 
                        val: sens.factors.weaponFactor, 
                        color: "from-amber-500 to-orange-500" 
                      },
                      { 
                        label: t("stability_fingers", lang), 
                        val: sens.factors.fingerFactor, 
                        color: "from-emerald-500 to-teal-500" 
                      },
                      { 
                        label: t("stability_style", lang), 
                        val: sens.factors.styleFactor, 
                        color: "from-sky-500 to-indigo-500" 
                      },
                    ].map((item) => {
                      const pv = Math.round(item.val * 100);
                      return (
                        <div key={item.label} className="rounded-xl border border-white/8 bg-black/20 p-3">
                          <div className="text-[10px] uppercase tracking-widest text-white/40">
                            {item.label}
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="font-display text-xl font-black text-orange-300">
                              {pv}%
                            </span>
                            <div className="h-2 flex-1 rounded-full bg-black/50">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                                style={{ width: `${pv}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 text-center text-xs text-white/40">
                    {t("stability_equation", lang)} · {t("stability_desc", lang)}
                  </div>
                </div>

                {/* Sources */}
                <div className="card mt-6 rounded-2xl p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-xl">📚</span>
                    <span className="font-display text-sm font-bold text-white">{isAr ? "المصادر المعتمدة" : "Sensitivity Sources"}</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {[
                      { name: "PUBG Mobile In-Game", desc: isAr ? "إعدادات اللعبة الرسمية v4.x" : "Official settings v4.x", url: "#" },
                      { name: "Manabuy Guide", desc: isAr ? "دليل الحساسية والارتداد" : "Sensitivity & Recoil Guide", url: "https://manabuy.com/blog/pubg-mobile/pubg-mobile-sensitivity-recoil-guide" },
                      { name: "CocoDp", desc: isAr ? "أفضل حساسية 2025" : "Best Sensitivity 2025", url: "https://www.cocodp.com/news/best-sensitivity-for-pubg-mobile" },
                      { name: "Revibyte 2026", desc: isAr ? "دليل كامل 2026" : "Complete Guide 2026", url: "https://www.revibyte.blog/pubgmobile/best-sensitivity-settings-pubg-mobile-2026/" },
                      { name: "Cashify Pro Players", desc: isAr ? "إعدادات المحترفين" : "Jonathan, ScoutOP, Mortal", url: "https://www.cashify.in/how-to-adjust-sensitivity-to-improve-aim-in-pubg-mobile-and-fortnite" },
                      { name: "AR-Pay 2026", desc: isAr ? "إعدادات حسب أسلوب اللعب" : "Playstyle-based settings", url: "https://ar-pay.com/blog/en/gaming/pubg/pubg-mobile-sensitivity-settings/" },
                      { name: "VCGamers", desc: isAr ? "دليل ضبط الحساسية" : "Sensitivity Setup Guide", url: "https://www.vcgamers.com/news/en/find-out-how-to-easily-set-pubg-mobile-sensitivity/" },
                      { name: "BitTopup", desc: isAr ? "أكواد حساسية 2026" : "Zero Recoil Codes 2026", url: "https://news.bittopup.com/news/pubg-mobile-sensitivity-codes-2025-90-zero-recoil-gyro" },
                      { name: "Esports.net", desc: isAr ? "أفضل حساسية للتصويب" : "Best Sensitivity for Aim", url: "https://www.esports.net/news/mobile-games/best-sensitivity-for-pubg-mobile/" },
                      { name: "BitTopup Guide", desc: isAr ? "دليل الحساسية الشامل" : "Complete Sensitivity Guide", url: "https://bittopup.com/article/PUBG-Mobile-Sensitivity-Settings-Guide-Master-Your-Aim-and-Control-in-2025" },
                    ].map((src) => (
                      <a
                        key={src.name}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg border border-white/5 px-3 py-2 text-xs transition-colors hover:border-orange-500/20 hover:bg-white/3"
                      >
                        <span className="text-orange-400">🔗</span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate font-semibold text-white/70">{src.name}</div>
                          <div className="truncate text-[10px] text-white/30">{src.desc}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="mt-3 text-center text-[10px] text-white/25">
                    {isAr
                      ? "جميع القيم مأخوذة من مصادر موثوقة ومقارنة مع إعدادات اللعبة الرسمية ولاعبين محترفين"
                      : "All values sourced from trusted guides, official game settings, and verified pro player configurations"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Ping Monitor */}
        <section id="ping" className="container-section py-10">
          <PingMonitor />
        </section>

        {/* PAC Script */}
        <section id="pac" className="container-section py-10">
          <PacSection />
        </section>

        {/* Advanced Tools */}
        <section id="advanced" className="container-section py-10">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-1">
              <span className="text-orange-300">🛠️</span>
              <span className="text-[10px] font-bold tracking-widest text-orange-300">
                ADVANCED TOOLS
              </span>
            </div>
            <h2 className="font-display mt-4 text-3xl font-black text-white sm:text-4xl">
              {isAr ? "أدوات متقدمة" : "Advanced Tools"}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <QuickSearch
              onSelectDevice={(brand, index) => {
                setSelectedBrand(brand);
                setSelectedDeviceIndex(index);
              }}
              onSelectWeapon={(category, index) => {
                setSelectedWeaponCategory(category);
                setSelectedWeaponIndex(index);
              }}
            />
            <TouchTest />
            <MusicPlayer />
            <AIPredictions />
          </div>
        </section>

        {/* Saved Profiles */}
        <section id="saved" className="container-section py-10">
          <div className="card neon-box rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl">🗂️</span>
              <h3 className="font-display text-lg font-bold text-white">
                {t("saved_title", lang)}
              </h3>
            </div>
            <p className="mb-4 text-sm text-white/60">{t("saved_sub", lang)}</p>

            {profiles.length === 0 ? (
              <div className="py-8 text-center">
                <div className="text-4xl">🗂️</div>
                <p className="mt-4 text-white/60">{t("saved_empty", lang)}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {profiles.map((profile, idx) => {
                  const s = computeSensitivity(profile.params);
                  return (
                    <div
                      key={idx}
                      className="card rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">{profile.name}</div>
                          <div className="text-[10px] text-white/40">
                            {new Date(profile.savedAt).toLocaleString()}
                          </div>
                        </div>
                        <span className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-2 py-1 text-[10px] font-bold text-orange-300">
                          AI: {s.aiScore}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-white/40">
                        {profile.params.device.name} · {profile.params.weapon.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Rating */}
        <section id="rating" className="container-section py-10">
          <RatingSection />
        </section>

        {/* About/Footer */}
        <footer id="about" className="border-t border-white/8 bg-black/20 py-16">
          <div className="container-section">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-1">
                <span className="text-orange-300">ℹ️</span>
                <span className="text-[10px] font-bold tracking-widest text-orange-300">
                  ABOUT
                </span>
              </div>
              <h2 className="font-display mt-4 text-3xl font-black text-white sm:text-4xl">
                ALYAZOURI 2026{t("footer_about", lang)}
              </h2>
              
              <div className="mt-6 max-w-2xl mx-auto">
                <h3 className="font-semibold text-white">{t("footer_features", lang)}</h3>
                <ul className="mt-3 grid grid-cols-1 gap-2 text-sm text-white/60 md:grid-cols-2">
                  {["footer_f1", "footer_f2", "footer_f3", "footer_f4", "footer_f5"].map((k) => (
                    <li key={k} className="flex items-center gap-2">
                      <span className="text-emerald-300">✅</span>
                      <span>{t(k as any, lang)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-8 border-t border-white/8">
                <p className="text-sm text-white/40">{t("footer_rights", lang)}</p>
                <p className="mt-2 font-display text-xl font-bold text-orange-300">
                  {t("footer_tagline", lang)}
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-white/60">
                  <span>
                    {t("hero_tiktok", lang)} 
                    <span className="font-semibold text-white">@Saeedalyazouri0</span>
                  </span>
                  <span>
                    {t("hero_instagram", lang)} 
                    <span className="font-semibold text-white">@Saeedjor11</span>
                  </span>
                  <span>
                    {t("hero_pubg_id", lang)} 
                    <span className="font-semibold text-white">5744469523</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <PWABanner />
    </>
  );
}

export default App;