import { Layout } from "@/components/Layout";
import { InteractiveRobot } from "@/components/self-heal/InteractiveRobot";
import { MetricsPanel } from "@/components/self-heal/MetricsPanel";
import { ControlsPanel } from "@/components/self-heal/ControlsPanel";
import { useState } from "react";

export type BodyPart = "head" | "torso" | "left-arm" | "right-arm" | "legs" | "base" | null;

export default function SelfHeal() {
  const [selectedPart, setSelectedPart] = useState<BodyPart>(null);
  const [isScanning, setIsScanning] = useState(false);

  // NEW: keep quick-fix status in parent so both ControlsPanel and InteractiveRobot can share it
  const [quickFixStatus, setQuickFixStatus] = useState({
    joints: false,
    sensors: false,
    memory: false,
  });

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-extralight tracking-wide mb-2">Self-Heal</h1>
          <p className="text-sm font-light opacity-60">Component diagnostics and automated healing</p>
        </div>

        <div className="grid lg:grid-cols-[25%_50%_25%] gap-6">
          {/* Left: Metrics Panel */}
          <MetricsPanel selectedPart={selectedPart} />

          {/* Center: Interactive Robot */}
          <InteractiveRobot
            selectedPart={selectedPart}
            onSelectPart={setSelectedPart}
            isScanning={isScanning}
            activeFixes={quickFixStatus}
          />

          {/* Right: Controls Panel */}
          <ControlsPanel
            onScanStart={() => setIsScanning(true)}
            onScanEnd={() => setIsScanning(false)}
            onQuickFixApplied={(name, enabled) =>
              setQuickFixStatus((prev) => ({ ...prev, [name]: enabled }))
            }
          />
        </div>
      </div>
    </Layout>
  );
}
