import { useCallback, useEffect, useRef, useState } from "react";

export type UseCameraReturn = {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  devices: MediaDeviceInfo[];
  deviceId: string | null;
  setDeviceId: (id: string | null) => void;
  mirror: boolean;
  setMirror: (v: boolean) => void;
  mode: "camera" | "stream";
  setMode: (m: "camera" | "stream") => void;
  streamUrl: string;
  setStreamUrl: (s: string) => void;
  loading: boolean;
  streamError: string | null;
  startCamera: (dId?: string | null) => Promise<void>;
  startStreamUrl: (url: string) => Promise<void>;
  stopMedia: () => void;
  snapshot: () => void;
  refresh: () => Promise<void>;
};

export const useCamera = (initialDeviceId: string | null = null): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string | null>(initialDeviceId);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [mirror, setMirror] = useState(true);
  const [mode, setMode] = useState<"camera" | "stream">("camera");
  const [streamUrl, setStreamUrl] = useState<string>("");
  const [streamError, setStreamError] = useState<string | null>(null);

  const enumerate = useCallback(async () => {
    try {
      const ds = await navigator.mediaDevices.enumerateDevices();
      const cams = ds.filter((d) => d.kind === "videoinput");
      setDevices(cams);
      if (!deviceId && cams.length) setDeviceId(cams[0].deviceId);
    } catch {
      setDevices([]);
    }
  }, [deviceId]);

  const stopMedia = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        videoRef.current.removeAttribute("src");
      } catch {}
    }
  }, [stream]);

  const startCamera = useCallback(async (dId?: string | null) => {
    setLoading(true);
    stopMedia();
    try {
      const constraints: MediaStreamConstraints = { video: dId ? { deviceId: { exact: dId } } : { facingMode: "user" }, audio: false };
      const s = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        // play
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await videoRef.current.play();
      }
      await enumerate();
      setStreamError(null);
    } catch (err: any) {
      setStreamError(String(err?.message || err || "Camera access failed"));
    } finally {
      setLoading(false);
    }
  }, [enumerate, stopMedia]);

  const startStreamUrl = useCallback(async (url: string) => {
    setLoading(true);
    stopMedia();
    setStreamError(null);
    try {
      if (!videoRef.current) throw new Error("No video element");
      videoRef.current.srcObject = null;
      videoRef.current.src = url;
      videoRef.current.crossOrigin = "anonymous";
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await videoRef.current.play();
    } catch (err: any) {
      setStreamError(String(err?.message || err || "Unable to play stream"));
    } finally {
      setLoading(false);
    }
  }, [stopMedia]);

  const snapshot = useCallback(() => {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c) return;
    c.width = v.videoWidth || 1280;
    c.height = v.videoHeight || 720;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    if (mirror && mode === "camera") {
      ctx.translate(c.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(v, 0, 0, c.width, c.height);
    if (mirror && mode === "camera") ctx.setTransform(1, 0, 0, 1, 0, 0);
    c.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `snapshot-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [mirror, mode]);

  useEffect(() => {
    if (mode === "camera") startCamera(deviceId);
    if (mode === "stream" && streamUrl) startStreamUrl(streamUrl);
    return () => stopMedia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceId, mode]);

  useEffect(() => {
    enumerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = useCallback(async () => {
    await enumerate();
    if (mode === "camera") await startCamera(deviceId);
    if (mode === "stream" && streamUrl) await startStreamUrl(streamUrl);
  }, [deviceId, enumerate, mode, startCamera, startStreamUrl, streamUrl]);

  return {
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
  };
};

export default useCamera;
