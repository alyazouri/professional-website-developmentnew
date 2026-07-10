import { useState, useMemo } from "react";
import { useLang } from "./LanguageContext";
import { BRANDS, WEAPONS } from "./data";
import type { DeviceBrand, WeaponCategory } from "./data";

export function QuickSearch({
  onSelectDevice,
  onSelectWeapon,
}: {
  onSelectDevice: (brand: DeviceBrand, deviceIndex: number) => void;
  onSelectWeapon: (category: WeaponCategory, weaponIndex: number) => void;
}) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"devices" | "weapons">("devices");

  const allDevices = useMemo(() => {
    return BRANDS.flatMap((brand) =>
      brand.devices.map((device) => ({
        ...device,
        brand: brand.name,
        brandIcon: brand.icon,
        type: "device" as const,
      }))
    );
  }, []);

  const allWeapons = useMemo(() => {
    return WEAPONS.flatMap((category) =>
      category.weapons.map((weapon) => ({
        ...weapon,
        category: category.name,
        categoryIcon: category.icon,
        type: "weapon" as const,
      }))
    );
  }, []);

  const filteredDevices = useMemo(() => {
    const q = query.toLowerCase();
    return allDevices.filter(
      (d) => d.name.toLowerCase().includes(q) || d.brand.toLowerCase().includes(q)
    );
  }, [query, allDevices]);

  const filteredWeapons = useMemo(() => {
    const q = query.toLowerCase();
    return allWeapons.filter(
      (w) => w.name.toLowerCase().includes(q) || w.category.toLowerCase().includes(q)
    );
  }, [query, allWeapons]);

  const handleSelect = (item: any) => {
    if (item.type === "device") {
      const brand = BRANDS.find((b) => b.name === item.brand);
      const deviceIndex = brand?.devices.findIndex((d) => d.name === item.name) || 0;
      if (brand && deviceIndex >= 0) {
        onSelectDevice(brand, deviceIndex);
      }
    } else if (item.type === "weapon") {
      const category = WEAPONS.find((c) => c.name === item.category);
      const weaponIndex = category?.weapons.findIndex((w) => w.name === item.name) || 0;
      if (category && weaponIndex >= 0) {
        onSelectWeapon(category, weaponIndex);
      }
    }
    setQuery("");
  };

  const results = activeTab === "devices" ? filteredDevices : filteredWeapons;

  return (
    <div className="card rounded-2xl p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">🔍</span>
        <h3 className="font-display text-lg font-bold text-white">
          {isAr ? "بحث سريع" : "Quick Search"}
        </h3>
      </div>

      <div className="rounded-xl border border-white/8 bg-black/20 p-1">
        <div className="flex gap-1">
          {(["devices", "weapons"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors ${
                activeTab === tab
                  ? "bg-orange-500/15 text-orange-300"
                  : "text-white/60 hover:bg-white/5"
              }`}
            >
              {tab === "devices" && (isAr ? "الأجهزة" : "Devices")}
              {tab === "weapons" && (isAr ? "الأسلحة" : "Weapons")}
            </button>
          ))}
        </div>
      </div>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={isAr ? "ابحث عن جهاز أو سلاح..." : "Search for devices or weapons..."}
        className="mt-3 w-full rounded-xl border border-white/8 bg-black/20 p-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
      />

      {query && results.length > 0 && (
        <div className="mt-3 max-h-64 overflow-y-auto rounded-xl border border-white/8 bg-black/20 p-2">
          {results.slice(0, 10).map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(item)}
              className="flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm transition-colors hover:bg-white/5"
            >
              <span className="text-xl">
                {item.type === "device" ? item.brandIcon : item.categoryIcon}
              </span>
              <div className="flex-1">
                <div className="font-semibold text-white">{item.name}</div>
                <div className="text-[10px] text-white/40">
                  {item.type === "device" ? item.brand : item.category}
                </div>
              </div>
              {item.type === "device" && (
                <div className="text-[10px] text-white/40">
                  {item.fps}FPS · {item.screenSize}"
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {query && results.length === 0 && (
        <div className="mt-3 rounded-xl border border-white/8 bg-black/20 p-4 text-center text-sm text-white/60">
          {isAr ? "لا نتائج" : "No results found"}
        </div>
      )}
    </div>
  );
}