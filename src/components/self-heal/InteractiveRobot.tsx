import robotImage from "@/assets/robot.png";
import { BodyPart } from "@/pages/SelfHeal";
import { useState } from "react";

interface InteractiveRobotProps {
  selectedPart: BodyPart;
  onSelectPart: (part: BodyPart) => void;
  isScanning: boolean;
  activeFixes: { joints: boolean; sensors: boolean; memory: boolean };
}

const zones = [
  { id: "head" as const, label: "Head", top: "12%", left: "50%", width: "12%", height: "15%" },
  { id: "torso" as const, label: "Torso", top: "35%", left: "50%", width: "17%", height: "28%" },
  { id: "left-arm" as const, label: "Left Arm", top: "40%", left: "38%", width: "8%", height: "37%" },
  { id: "right-arm" as const, label: "Right Arm", top: "40%", left: "62%", width: "8%", height: "37%" },
  { id: "legs" as const, label: "Legs", top: "70%", left: "50%", width: "20%", height: "37%" },
  { id: "base" as const, label: "Base", top: "91%", left: "50%", width: "35%", height: "8%" },
];

// mapping: which quick-fix should glow which zone(s)
const zoneToFixMap: Record<string, "joints" | "sensors" | "memory" | null> = {
  head: "sensors",
  torso: "memory",
  "left-arm": "joints",
  "right-arm": "joints",
  legs: "joints", // legs glow for joints
  base: null,
};

export const InteractiveRobot = ({
  selectedPart,
  onSelectPart,
  isScanning,
  activeFixes,
}: InteractiveRobotProps) => {
  const [hoveredPart, setHoveredPart] = useState<BodyPart>(null);

  return (
    <div className="glass rounded-2xl p-8 relative">
      <div className="relative h-[48vh] sm:h-[52vh] md:h-[60vh] lg:h-[68vh] flex items-center justify-center">
        {/* Platform */}
        <div className="absolute bottom-8 w-48 sm:w-64 md:w-80 lg:w-96 h-2">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent blur-sm" />
        </div>

        {/* Robot Image */}
        <div className="relative w-full max-w-[420px] sm:max-w-[520px] md:max-w-[640px] lg:max-w-[760px] h-full flex items-center justify-center">
          <img
            src={robotImage}
            alt="Robot"
            className="w-auto h-full max-h-[40vh] sm:max-h-[46vh] md:max-h-[56vh] lg:max-h-[64vh] object-contain filter drop-shadow-2xl"
          />

          {/* Interactive Zones */}
          {zones.map((zone) => {
            const fixForZone = zoneToFixMap[zone.id];
            const fixActive = fixForZone ? activeFixes[fixForZone] : false;

            // determine classes:
            // - arms & sensors: blue
            // - legs: yellow for joints
            // - memory stays cyan-ish (optional)
            const zoneGlowClass = fixActive
              ? fixForZone === "joints"
                ? zone.id === "legs"
                  ? "glow-pulse-yellow"
                  : "glow-pulse-blue"
                : fixForZone === "sensors"
                ? "glow-pulse-blue"
                : "glow-pulse-cyan"
              : "";

            const overlayClasses = `
              absolute inset-0 rounded-lg border-2 transition-smooth
              ${selectedPart === zone.id
                ? "border-foreground/60 bg-foreground/5"
                : hoveredPart === zone.id
                ? "border-foreground/40 bg-foreground/5"
                : "border-transparent"}
              ${zoneGlowClass}
            `;

            return (
              <div
                key={zone.id}
                className="absolute cursor-pointer transition-smooth group"
                style={{
                  top: zone.top,
                  left: zone.left,
                  width: zone.width,
                  height: zone.height,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseEnter={() => setHoveredPart(zone.id)}
                onMouseLeave={() => setHoveredPart(null)}
                onClick={() => onSelectPart(zone.id)}
              >
                {/* Overlay (glow applied via classes) */}
                <div className={overlayClasses}>
                  {/* Ripple (only for joints) */}
                  {fixActive && fixForZone === "joints" && (
                    <>
                      {/* ripple element: blue or yellow depending on zone */}
                      <div
                        className={`absolute inset-0 pointer-events-none ${
                          zone.id === "legs" ? "ripple-yellow" : "ripple-blue"
                        }`}
                      />
                    </>
                  )}
                </div>

                {/* Tooltip */}
                {hoveredPart === zone.id && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 glass px-3 py-1 rounded-lg text-xs whitespace-nowrap animate-fade-in z-10">
                    {zone.label}
                  </div>
                )}
              </div>
            );
          })}

          {/* Scanning Beam */}
          {isScanning && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-foreground/30 to-transparent animate-scan" />
            </div>
          )}
        </div>

        {/* Status Indicator */}
        <div className="absolute top-4 right-4 glass px-4 py-2 rounded-full text-xs font-light tracking-wide">
          {isScanning ? "SCANNING..." : "READY"}
        </div>
      </div>

      <style>{`
        /* scan animation (existing) */
        @keyframes scan { 0% { top: 0%; } 100% { top: 100%; } }
        .animate-scan { animation: scan 4s ease-in-out infinite; }

        /* BLUE glow pulse (arms + sensors) */
        @keyframes glowPulseBlue {
          0% {
            box-shadow: 0 0 6px rgba(99,102,241,0.22), 0 0 12px rgba(99,102,241,0.16);
            background: rgba(99,102,241,0.06);
          }
          50% {
            box-shadow: 0 0 18px rgba(99,102,241,0.45), 0 0 28px rgba(99,102,241,0.28);
            background: rgba(99,102,241,0.14);
          }
          100% {
            box-shadow: 0 0 6px rgba(99,102,241,0.22), 0 0 12px rgba(99,102,241,0.16);
            background: rgba(99,102,241,0.06);
          }
        }
        .glow-pulse-blue {
          animation: glowPulseBlue 1.7s ease-in-out infinite;
        }

        /* YELLOW glow pulse (legs) */
        @keyframes glowPulseYellow {
          0% {
            box-shadow: 0 0 6px rgba(250,204,21,0.22), 0 0 12px rgba(250,204,21,0.14);
            background: rgba(250,204,21,0.05);
          }
          50% {
            box-shadow: 0 0 18px rgba(250,204,21,0.45), 0 0 28px rgba(250,204,21,0.28);
            background: rgba(250,204,21,0.12);
          }
          100% {
            box-shadow: 0 0 6px rgba(250,204,21,0.22), 0 0 12px rgba(250,204,21,0.14);
            background: rgba(250,204,21,0.05);
          }
        }
        .glow-pulse-yellow {
          animation: glowPulseYellow 1.7s ease-in-out infinite;
        }

        /* CYAN for memory (optional visual distinctness) */
        @keyframes glowPulseCyan {
          0% {
            box-shadow: 0 0 6px rgba(56,189,248,0.20), 0 0 12px rgba(56,189,248,0.14);
            background: rgba(56,189,248,0.05);
          }
          50% {
            box-shadow: 0 0 18px rgba(56,189,248,0.38), 0 0 28px rgba(56,189,248,0.22);
            background: rgba(56,189,248,0.12);
          }
          100% {
            box-shadow: 0 0 6px rgba(56,189,248,0.20), 0 0 12px rgba(56,189,248,0.14);
            background: rgba(56,189,248,0.05);
          }
        }
        .glow-pulse-cyan {
          animation: glowPulseCyan 1.7s ease-in-out infinite;
        }

        /* RIPPLES for joints (outward spread) */
        @keyframes rippleBlue {
          0% {
            box-shadow: 0 0 0 0 rgba(99,102,241,0.40);
            transform: scale(0.96);
            opacity: 0.9;
          }
          60% {
            box-shadow: 0 0 0 18px rgba(99,102,241,0.06);
            transform: scale(1.03);
            opacity: 0.55;
          }
          100% {
            box-shadow: 0 0 0 36px rgba(99,102,241,0);
            transform: scale(1.12);
            opacity: 0;
          }
        }
        .ripple-blue {
          animation: rippleBlue 1.6s ease-out infinite;
          border-radius: inherit;
        }

        @keyframes rippleYellow {
          0% {
            box-shadow: 0 0 0 0 rgba(250,204,21,0.40);
            transform: scale(0.96);
            opacity: 0.9;
          }
          60% {
            box-shadow: 0 0 0 18px rgba(250,204,21,0.06);
            transform: scale(1.03);
            opacity: 0.55;
          }
          100% {
            box-shadow: 0 0 0 36px rgba(250,204,21,0);
            transform: scale(1.12);
            opacity: 0;
          }
        }
        .ripple-yellow {
          animation: rippleYellow 1.6s ease-out infinite;
          border-radius: inherit;
        }

        /* fallback subtle pulse when no ripple needed */
        @keyframes subtlePulse {
          0% { box-shadow: 0 0 8px rgba(99,102,241,0.12); }
          50% { box-shadow: 0 0 18px rgba(99,102,241,0.18); }
          100% { box-shadow: 0 0 8px rgba(99,102,241,0.12); }
        }
      `}</style>
    </div>
  );
};
