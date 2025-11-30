import React from "react";
import { X, Camera, Download, RefreshCw, Link } from "lucide-react";
import useCamera from "@/hooks/useCamera";

export interface VideoModalProps {
  onClose: () => void;
  initialDeviceId?: string | null;
  title?: string;
  className?: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({ onClose, initialDeviceId = null, title = "Live Camera", className = "" }) => {
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
  } = useCamera(initialDeviceId ?? null);

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { stopMedia(); onClose(); }} />
      <div className={`relative glass-elevated rounded-2xl w-full max-w-3xl overflow-hidden ${className}`} role="dialog" aria-modal="true">
        <div className="flex items-center justify-between p-4 border-b border-border/10">
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5 opacity-70" />
            <div>
              <div className="text-sm font-medium">{title}</div>
              <div className="text-xs opacity-60">Camera & stream preview</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { enumerate(); if (mode === "camera") startCamera(deviceId); else if (mode === "stream" && streamUrl) startStreamUrl(streamUrl); }} className="glass px-2 py-1 rounded-md" aria-label="Refresh cameras" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={() => { stopMedia(); onClose(); }} className="w-8 h-8 rounded-lg glass-strong flex items-center justify-center" aria-label="Close camera">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-4">
          <div className="bg-black/80 rounded-md flex items-center justify-center min-h-[340px] relative">
            <video ref={videoRef} className={`max-h-[68vh] max-w-full ${mirror && mode === "camera" ? "scale-x-[-1]" : ""}`} playsInline autoPlay muted />
            {loading && <div className="absolute text-sm text-white/80">Starting...</div>}
            {streamError && <div className="absolute text-sm text-red-400 p-3">{streamError}</div>}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setMode("camera")} className={`px-3 py-1 rounded-md ${mode === "camera" ? "glass-strong" : "glass"}`}>Browser Cameras</button>
              <button onClick={() => setMode("stream")} className={`px-3 py-1 rounded-md ${mode === "stream" ? "glass-strong" : "glass"}`}>External Stream</button>
            </div>

            {mode === "camera" && (
              <>
                <div className="text-xs opacity-70">Camera</div>
                <select value={deviceId ?? ""} onChange={(e) => setDeviceId(e.target.value || null)} className="w-full glass-strong rounded-md px-3 py-2 text-sm" aria-label="Select camera">
                  {devices.length === 0 && <option value="">(No cameras found)</option>}
                  {devices.map((d) => <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId}`}</option>)}
                </select>

                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs opacity-70">Mirror</div>
                  <input type="checkbox" checked={mirror} onChange={(e) => setMirror(e.target.checked)} aria-label="Mirror preview" />
                </div>

                <div className="flex gap-2">
                  <button onClick={snapshot} className="glass-strong flex-1 px-3 py-2 rounded-md flex items-center justify-center gap-2" aria-label="Take snapshot">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Snapshot</span>
                  </button>
                  <button onClick={() => startCamera(deviceId)} className="glass flex-1 px-3 py-2 rounded-md flex items-center justify-center gap-2" aria-label="Restart camera">
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-sm">Restart</span>
                  </button>
                </div>

                <div className="text-xs opacity-60">Allow camera permission for device labels and switching external cams.</div>
              </>
            )}

            {mode === "stream" && (
              <>
                <div className="text-xs opacity-70">Stream URL</div>
                <input type="text" value={streamUrl} onChange={(e) => setStreamUrl(e.target.value)} placeholder="https://example.com/stream.m3u8 or https://server/video.mp4" className="w-full glass-strong rounded-md px-3 py-2 text-sm" />
                <div className="flex gap-2">
                  <button onClick={() => startStreamUrl(streamUrl)} className="glass-strong flex-1 px-3 py-2 rounded-md flex items-center justify-center gap-2" aria-label="Start stream">
                    <Link className="w-4 h-4" />
                    <span className="text-sm">Preview</span>
                  </button>
                  <button onClick={() => { if (videoRef.current) { videoRef.current.src = ""; videoRef.current.pause(); } }} className="glass flex-1 px-3 py-2 rounded-md flex items-center justify-center gap-2" aria-label="Stop stream">
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-sm">Stop</span>
                  </button>
                </div>
                <div className="text-xs opacity-60">HLS/MP4 over HTTPS will usually play. RTSP needs a proxy or conversion to HLS/WebRTC.</div>
              </>
            )}

            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
