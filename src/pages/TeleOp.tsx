import { Layout } from "@/components/Layout";
import { Maximize2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCw, Home, Power, Download, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import useCamera from "@/hooks/useCamera";
import useRobot from "@/hooks/useRobot";

function RealCameraFeed({ isRecording, onToggleRecord }: { isRecording: boolean; onToggleRecord: () => void }) {
  const {
    videoRef,
    canvasRef,
    devices,
    deviceId,
    setDeviceId,
    mirror,
    setMirror,
    mode,
    setMode,
    streamUrl,
    setStreamUrl,
    loading,
    streamError,
    startCamera,
    startStreamUrl,
    stopMedia,
    snapshot,
    refresh,
  } = useCamera(null);

  return (
    <>
      <video ref={videoRef} className={`w-full h-full object-cover ${mirror && mode === "camera" ? "scale-x-[-1]" : ""}`} playsInline autoPlay muted />
      {loading && <div className="absolute inset-0 flex items-center justify-center text-sm text-white/80">Starting...</div>}
      {streamError && <div className="absolute inset-0 flex items-center justify-center text-sm text-red-400 p-3">{streamError}</div>}

      {/* small floating controls */}
      <div className="absolute top-3 right-3 flex gap-2 z-20">
        <button onClick={onToggleRecord} className={`glass px-2 py-1 rounded-md ${isRecording ? "text-red-400" : ""}`} title="Record">
          <div className={`w-4 h-4 rounded-full border-2 border-current flex items-center justify-center`}>
            <div className={`w-2 h-2 rounded-full bg-current ${isRecording ? "animate-pulse" : "opacity-0"}`} />
          </div>
        </button>
        <button onClick={() => snapshot()} className="glass px-2 py-1 rounded-md" title="Snapshot">
          <Download className="w-4 h-4" />
        </button>
        <button onClick={() => refresh()} className="glass px-2 py-1 rounded-md" title="Refresh">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* small bottom-left display for stream/device */}
      <div className="absolute left-3 bottom-3 glass px-3 py-1 rounded-md text-xs z-20">
        <div className="flex items-center gap-2">
          <select value={deviceId ?? ""} onChange={(e) => setDeviceId(e.target.value || null)} className="bg-transparent text-xs" aria-label="Select camera">
            {devices.length === 0 && <option value="">(No cameras)</option>}
            {devices.map((d) => <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId}`}</option>)}
          </select>
          <label className="flex items-center gap-1"><input type="checkbox" checked={mirror} onChange={(e) => setMirror(e.target.checked)} /> Mirror</label>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </>
  );
}

export default function TeleOp() {
  const [speed, setSpeed] = useState(50);
  const [mode, setMode] = useState<"safe" | "manual">("safe");
  const [logs, setLogs] = useState<string[]>([
    "14:02:11 – System ready for manual control",
    "14:02:08 – Connection established",
  ]);

  const { robotState, sendControl, toggleCamera } = useRobot();

  const handleToggleRecord = () => {
    toggleCamera(undefined, !robotState.camera.is_recording);
    addLog(robotState.camera.is_recording ? "Stopped recording" : "Started recording");
  };

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [`${time} – ${message}`, ...prev].slice(0, 10));
  };

  const handleMove = (direction: string) => {
    addLog(`Move ${direction}`);
    const speedFactor = speed / 100;
    let linear = 0;
    let angular = 0;

    switch (direction) {
      case "forward":
        linear = 1.0 * speedFactor;
        break;
      case "backward":
        linear = -1.0 * speedFactor;
        break;
      case "left":
        angular = 1.0 * speedFactor;
        break;
      case "right":
        angular = -1.0 * speedFactor;
        break;
      case "stop":
        linear = 0;
        angular = 0;
        break;
    }
    sendControl(linear, angular);
  };

  // Stop when releasing buttons (optional, but good for safety)
  const handleStop = () => {
    sendControl(0, 0);
  };

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-extralight tracking-wide mb-2">Tele-Op</h1>
          <p className="text-sm font-light opacity-60">Direct manual control and live camera feed</p>
        </div>

        <div className="grid lg:grid-cols-[65%_35%] gap-6">
          {/* Camera Viewport */}
          <div className="glass rounded-2xl p-4 relative">
            <button className="absolute top-6 right-6 w-10 h-10 rounded-lg glass-strong flex items-center justify-center hover:bg-foreground/10 transition-smooth z-10">
              <Maximize2 className="w-5 h-5" />
            </button>

            <div className="relative aspect-video bg-foreground/5 rounded-xl overflow-hidden">
              {/* HUD Overlays */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Corner brackets */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-foreground/20" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-foreground/20" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-foreground/20" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-foreground/20" />

                {/* Crosshair */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative w-8 h-8">
                    <div className="absolute top-0 left-1/2 w-px h-2 bg-foreground/40" />
                    <div className="absolute bottom-0 left-1/2 w-px h-2 bg-foreground/40" />
                    <div className="absolute left-0 top-1/2 h-px w-2 bg-foreground/40" />
                    <div className="absolute right-0 top-1/2 h-px w-2 bg-foreground/40" />
                  </div>
                </div>

                {/* Status bar */}
                <div className="absolute bottom-0 left-0 right-0 glass-strong p-4 flex items-center justify-between text-xs font-mono">
                  <span>FPS: 30</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                  <span>Latency: {robotState.health_details.latency.toFixed(0)}ms</span>
                  <span>Bat: {robotState.battery.toFixed(1)}%</span>
                  <span>Vel: {robotState.linear_velocity.toFixed(2)} m/s</span>
                </div>

                {/* Top info */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
                  <div className="glass px-4 py-2 rounded-full text-xs font-mono flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${robotState.camera.is_on ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                    LIVE FEED
                  </div>
                  {robotState.camera.is_recording && (
                    <div className="glass px-4 py-2 rounded-full text-xs font-mono flex items-center gap-2 text-red-400">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      REC {robotState.camera.recording_time.toFixed(1)}s
                    </div>
                  )}
                </div>
              </div>
              {/* Real camera feed (shared logic) */}
              <RealCameraFeed isRecording={robotState.camera.is_recording} onToggleRecord={handleToggleRecord} />
            </div>

            {/* Command Log */}
            <div className="mt-4 glass-strong rounded-xl p-4">
              <h4 className="text-xs font-light opacity-60 mb-3 tracking-wide">COMMAND LOG</h4>
              <div className="space-y-1 text-xs font-mono max-h-32 overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className="opacity-60 hover:opacity-100 transition-smooth">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Directional Controls */}
            <div className="glass rounded-2xl p-8">
              <h3 className="text-sm font-light mb-6 tracking-wide">MOVEMENT</h3>

              <div className="grid grid-cols-3 gap-2 mb-6">
                <div />
                <button
                  onMouseDown={() => handleMove("forward")}
                  onMouseUp={handleStop}
                  onMouseLeave={handleStop}
                  className="aspect-square glass-strong rounded-xl flex items-center justify-center transition-smooth hover:bg-foreground/10 active:scale-95"
                >
                  <ArrowUp className="w-6 h-6" />
                </button>
                <div />

                <button
                  onMouseDown={() => handleMove("left")}
                  onMouseUp={handleStop}
                  onMouseLeave={handleStop}
                  className="aspect-square glass-strong rounded-xl flex items-center justify-center transition-smooth hover:bg-foreground/10 active:scale-95"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => { addLog("Emergency stop"); handleStop(); }}
                  className="aspect-square glass-strong rounded-xl flex items-center justify-center transition-smooth hover:bg-foreground/10 active:scale-95"
                >
                  <Power className="w-6 h-6" />
                </button>
                <button
                  onMouseDown={() => handleMove("right")}
                  onMouseUp={handleStop}
                  onMouseLeave={handleStop}
                  className="aspect-square glass-strong rounded-xl flex items-center justify-center transition-smooth hover:bg-foreground/10 active:scale-95"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>

                <div />
                <button
                  onMouseDown={() => handleMove("backward")}
                  onMouseUp={handleStop}
                  onMouseLeave={handleStop}
                  className="aspect-square glass-strong rounded-xl flex items-center justify-center transition-smooth hover:bg-foreground/10 active:scale-95"
                >
                  <ArrowDown className="w-6 h-6" />
                </button>
                <div />
              </div>

              {/* Speed Control */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-light opacity-60 tracking-wide">SPEED</span>
                  <span className="text-xs font-light">{speed}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Mode Toggle */}
              <div className="relative glass-strong rounded-full p-1 flex mb-4">
                <button
                  onClick={() => setMode("safe")}
                  className={`flex-1 py-2 rounded-full text-xs font-light transition-smooth ${mode === "safe" ? "bg-foreground/10" : ""
                    }`}
                >
                  Safe Mode
                </button>
                <button
                  onClick={() => setMode("manual")}
                  className={`flex-1 py-2 rounded-full text-xs font-light transition-smooth ${mode === "manual" ? "bg-foreground/10" : ""
                    }`}
                >
                  Manual
                </button>
              </div>
            </div>

            {/* Additional Controls */}
            <div className="glass rounded-2xl p-8 space-y-3">
              <h3 className="text-sm font-light mb-4 tracking-wide">ACTIONS</h3>

              <button
                onClick={() => addLog("Rotate 180°")}
                className="w-full glass-strong rounded-xl py-3 transition-smooth hover:bg-foreground/10 flex items-center justify-center gap-2"
              >
                <RotateCw className="w-4 h-4" />
                <span className="text-sm font-light">Rotate 180°</span>
              </button>

              <button
                onClick={() => addLog("Return to home position")}
                className="w-full glass-strong rounded-xl py-3 transition-smooth hover:bg-foreground/10 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm font-light">Home Position</span>
              </button>

              <button
                onClick={() => addLog("Auto-level activated")}
                className="w-full glass-strong rounded-xl py-3 transition-smooth hover:bg-foreground/10 flex items-center justify-center gap-2"
              >
                <span className="text-sm font-light">Auto-Level</span>
              </button>
            </div>

            {/* Safety Notice */}
            <div className="glass rounded-xl p-4">
              <p className="text-xs font-light opacity-60 text-center">
                Manual controls override autonomous behavior while active
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
