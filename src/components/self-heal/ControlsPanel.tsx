import { Battery, Scan } from "lucide-react";
import { useState } from "react";

interface ControlsPanelProps {
  onScanStart: () => void;
  onScanEnd: () => void;
  onQuickFixApplied?: (fixName: "joints" | "sensors" | "memory", enabled: boolean) => void;
}

export const ControlsPanel = ({
  onScanStart,
  onScanEnd,
  onQuickFixApplied,
}: ControlsPanelProps) => {
  const [healingBattery, setHealingBattery] = useState(false);
  const [quickFixes, setQuickFixes] = useState({
    joints: false,
    sensors: false,
    memory: false,
  });
  const [schedule, setSchedule] = useState<"daily" | "weekly" | "custom">("weekly");

  const handleBatteryHeal = () => {
    setHealingBattery(true);
    setTimeout(() => setHealingBattery(false), 3000);
  };

  const handleFullScan = () => {
    onScanStart();
    setTimeout(() => {
      onScanEnd();
    }, 4000);
  };

  const toggleFix = (key: "joints" | "sensors" | "memory") => {
    setQuickFixes((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      if (onQuickFixApplied) onQuickFixApplied(key, updated[key]);
      return updated;
    });
  };

  return (
    <div className="glass rounded-2xl p-8 space-y-4">
      <h3 className="text-lg font-light mb-6">Healing Controls</h3>

      {/* Battery Heal */}
      <button
        onClick={handleBatteryHeal}
        disabled={healingBattery}
        className="w-full glass-strong rounded-xl p-4 transition-smooth hover:bg-foreground/8 disabled:opacity-50 flex items-center gap-3"
      >
        <Battery className="w-5 h-5 opacity-60" />
        <div className="flex-1 text-left">
          <p className="text-sm font-normal">Optimize Battery</p>
          {healingBattery && (
            <div className="w-full h-1 bg-foreground/10 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-foreground/40 animate-progress" />
            </div>
          )}
        </div>
      </button>

      {/* Full Body Scan */}
      <button
        onClick={handleFullScan}
        className="w-full glass-strong rounded-xl p-4 transition-smooth hover:bg-foreground/8 flex items-center gap-3"
      >
        <Scan className="w-5 h-5 opacity-60" />
        <span className="text-sm font-normal">Run Diagnostics</span>
      </button>

      {/* Quick Fixes */}
      <div className="glass-strong rounded-xl p-4 space-y-3">
        <h4 className="text-xs font-light opacity-60 tracking-wide mb-3">QUICK FIXES</h4>

        {(
          [
            ["joints", "Recalibrate joints"],
            ["sensors", "Clear sensor cache"],
            ["memory", "Optimize memory"],
          ] as const
        ).map(([key, label]) => {
          const active = quickFixes[key];
          const glowStyle: React.CSSProperties = active
            ? { boxShadow: "0 0 14px rgba(99,102,241,0.28)", transition: "box-shadow 240ms ease" }
            : {};
          return (
            <label key={key} className="flex items-center justify-between">
              <span className="text-sm font-light">{label}</span>

              <button
                type="button"
                aria-pressed={active}
                onClick={() => toggleFix(key)}
                className={`w-11 h-6 rounded-full relative transition-smooth focus:outline-none ${
                  active ? "bg-foreground/20" : "bg-foreground/10"
                }`}
                style={glowStyle}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-foreground/60 transition-all ${
                    active ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </label>
          );
        })}
      </div>

      {/* Schedule */}
      <div className="glass-strong rounded-xl p-4">
        <h4 className="text-xs font-light opacity-60 tracking-wide mb-3">AUTO SCHEDULE</h4>
        <div className="relative glass rounded-full p-1 flex">
          <button
            onClick={() => setSchedule("daily")}
            className={`flex-1 py-2 rounded-full text-xs font-light transition-smooth ${
              schedule === "daily" ? "bg-foreground/10" : ""
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setSchedule("weekly")}
            className={`flex-1 py-2 rounded-full text-xs font-light transition-smooth ${
              schedule === "weekly" ? "bg-foreground/10" : ""
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setSchedule("custom")}
            className={`flex-1 py-2 rounded-full text-xs font-light transition-smooth ${
              schedule === "custom" ? "bg-foreground/10" : ""
            }`}
          >
            Custom
          </button>
        </div>
      </div>

      <style>{`
        @keyframes progress { 0% { width: 0%; } 100% { width: 100%; } }
        .animate-progress { animation: progress 3s ease-out forwards; }
      `}</style>
    </div>
  );
};
