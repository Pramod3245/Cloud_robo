import { Layout } from "@/components/Layout";
import { Download, Shield, Activity, ChevronDown } from "lucide-react";
import { useState } from "react";
import useRobot from "@/hooks/useRobot";

export default function Updates() {
  const { robotState, triggerUpdate } = useRobot();
  const { firmware } = robotState;
  const [devMode, setDevMode] = useState(false);

  const handleUpdate = () => {
    triggerUpdate();
  };

  // Determine step based on progress for UI feedback
  const getStep = (progress: number) => {
    if (progress < 20) return "Initializing";
    if (progress < 50) return "Downloading";
    if (progress < 80) return "Installing";
    return "Finalizing";
  };

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-extralight tracking-wide mb-2">Remote Updates</h1>
          <p className="text-sm font-light opacity-60">System control and firmware management</p>
        </div>

        {/* Current System Status */}
        <div className="glass rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-normal mb-2">Current Firmware</h3>
              <p className="text-3xl font-extralight mb-1">v{firmware.version}</p>
              <p className="text-xs opacity-60">Last updated 12 days ago</p>
            </div>
            <div className="glass-strong px-6 py-3 rounded-full">
              <span className="text-xs font-light tracking-wide">UP TO DATE</span>
            </div>
          </div>
        </div>

        {/* Firmware Update */}
        <div className="glass rounded-2xl p-8 mb-8">
          <h3 className="text-lg font-light mb-6 flex items-center gap-2">
            <Download className="w-5 h-5 opacity-40" />
            System Firmware
          </h3>

          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div>
              <p className="text-xs opacity-60 mb-2">CURRENT VERSION</p>
              <p className="text-lg font-light mb-4">v{firmware.version}</p>
              <ul className="text-xs opacity-60 space-y-1">
                <li>• Improved navigation algorithms</li>
                <li>• Enhanced battery optimization</li>
                <li>• Bug fixes and performance</li>
              </ul>
            </div>

            <div>
              <p className="text-xs opacity-60 mb-2">LATEST AVAILABLE</p>
              <p className="text-lg font-light mb-4">v{firmware.version === "1.0.0" ? "1.1.0" : firmware.version}</p>
              <p className="text-xs opacity-60">
                {firmware.version === "1.0.0" ? "Update available" : "You're running the latest version"}
              </p>
            </div>
          </div>

          {!firmware.is_updating ? (
            <button
              onClick={handleUpdate}
              disabled={firmware.version !== "1.0.0"} // Disable if already updated for demo
              className="w-full glass-strong rounded-xl py-4 transition-smooth hover:bg-foreground/8 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="text-sm font-normal">
                {firmware.version === "1.0.0" ? "Update Now" : "Check for Updates"}
              </span>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-light">{getStep(firmware.update_progress)}...</span>
                <span className="opacity-60">{Math.round(firmware.update_progress)}%</span>
              </div>
              <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground/40 transition-all duration-300"
                  style={{ width: `${firmware.update_progress}%` }}
                />
              </div>
              <p className="text-xs opacity-60 text-center">Estimated time remaining...</p>
            </div>
          )}
        </div>

        {/* Security & System Check */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Security */}
          <div className="glass rounded-2xl p-8">
            <h3 className="text-lg font-light mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 opacity-40" />
              Security & Protection
            </h3>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-light">Auto-update security patches</span>
                <div className="w-11 h-6 rounded-full bg-foreground/20 transition-smooth relative">
                  <div className="absolute top-1 left-6 w-4 h-4 rounded-full bg-foreground/60" />
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-light">Firewall enabled</span>
                <div className="w-11 h-6 rounded-full bg-foreground/20 transition-smooth relative">
                  <div className="absolute top-1 left-6 w-4 h-4 rounded-full bg-foreground/60" />
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-light">Threat detection</span>
                <div className="w-11 h-6 rounded-full bg-foreground/20 transition-smooth relative">
                  <div className="absolute top-1 left-6 w-4 h-4 rounded-full bg-foreground/60" />
                </div>
              </label>
            </div>

            <div className="mt-6 pt-6 border-t border-border/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs opacity-60">Last scan</span>
                <span className="text-sm font-light">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-60">Threats blocked</span>
                <span className="text-sm font-light">0</span>
              </div>
            </div>
          </div>

          {/* System Diagnostics */}
          <div className="glass rounded-2xl p-8">
            <h3 className="text-lg font-light mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 opacity-40" />
              System Check
            </h3>

            <button className="w-full glass-strong rounded-xl py-3 mb-6 transition-smooth hover:bg-foreground/8 text-sm font-normal">
              Run Diagnostic
            </button>

            <div className="space-y-3">
              {[
                { name: "Network", status: "ok" },
                { name: "Storage", status: "ok" },
                { name: "Sensors", status: "ok" },
                { name: "Compute", status: "ok" },
                { name: "Power", status: "ok" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between py-2">
                  <span className="text-sm font-light">{item.name}</span>
                  <div className="w-4 h-4 rounded-full bg-foreground/20" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Developer Options */}
        <div className="glass rounded-2xl p-8">
          <button
            onClick={() => setDevMode(!devMode)}
            className="w-full flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-light">Advanced Settings</h3>
              <span className="text-xs glass-strong px-2 py-1 rounded">Developer Mode</span>
            </div>
            <ChevronDown
              className={`w-5 h-5 transition-smooth ${devMode ? "rotate-180" : ""}`}
            />
          </button>

          {devMode && (
            <div className="space-y-4 pt-4 border-t border-border/10 animate-fade-in">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-light">Enable verbose logging</span>
                <div className="w-11 h-6 rounded-full bg-foreground/10 transition-smooth relative">
                  <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-foreground/60" />
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-light">Beta firmware channel</span>
                <div className="w-11 h-6 rounded-full bg-foreground/10 transition-smooth relative">
                  <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-foreground/60" />
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-light">SSH access</span>
                <div className="w-11 h-6 rounded-full bg-foreground/10 transition-smooth relative">
                  <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-foreground/60" />
                </div>
              </label>

              <button className="mt-4 glass-strong rounded-xl py-3 px-6 transition-smooth hover:bg-foreground/8 text-sm font-normal">
                Export Diagnostic Report
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
