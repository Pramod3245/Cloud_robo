import { useState, useMemo } from "react";

type Point = { x: number; y: number; t: number; speed: number; heading: number; stop?: boolean; avoid?: boolean };

const PALETTE = {
  bgGrid: "#F1F1F1",
  pathLine: "#BDBDBD",
  node: "#616161",
  arrow: "#9E9E9E",
  motionBlue: "#42A5F5",
  warn: "#FFA726",
  dark: "#333333",
};

const generateSamplePath = (range: "today" | "7d" | "30d"): Point[] => {
  let count = 8;
  if (range === "today") count = 6;
  if (range === "7d") count = 16;
  if (range === "30d") count = 40;

  const widthStart = 80;
  const widthEnd = 720;
  const span = widthEnd - widthStart;

  return Array.from({ length: count }).map((_, i) => {
    const t = i;
    const x = Math.round(widthStart + (span * (i / Math.max(1, count - 1))));
    const wiggleBase = Math.sin(i * 0.5) * 60;
    const wiggleRange = range === "30d" ? 45 : range === "7d" ? 30 : 18;
    const y = Math.round(320 - wiggleBase - Math.cos(i * 0.3) * wiggleRange);

    const speed = parseFloat((0.2 + Math.abs(Math.sin(i * 0.35)) * (range === "30d" ? 1.5 : range === "7d" ? 1.2 : 0.9)).toFixed(2));
    const heading = parseFloat(((i * 0.18) % (Math.PI * 2)).toFixed(3));

    const stop = i % Math.max(4, Math.floor(count / 8)) === 0 && i !== 0;
    const avoid = i % Math.max(6, Math.floor(count / 6)) === 3;

    return { x, y, t, speed, heading, stop, avoid } as Point;
  });
};

const getPathD = (pts: Point[]) => {
  if (!pts.length) return "";
  return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
};

const speedToShade = (s: number) => {
  if (s < 0.5) return "#E0E0E0"; // slow
  if (s < 1.2) return "#BDBDBD"; // medium
  return "#616161"; // fast
};

export const PathingTab = () => {
  const [timeRange, setTimeRange] = useState<"today" | "7d" | "30d">("today");

  const path = useMemo(() => generateSamplePath(timeRange), [timeRange]);

  const pathD = useMemo(() => getPathD(path), [path]);

  const efficiency = useMemo(() => {
    if (!path.length) return 0;
    const avgSpeed = path.reduce((s, p) => s + p.speed, 0) / path.length;
    const stops = path.filter((p) => p.stop).length;
    const score = Math.max(0, Math.min(100, Math.round((avgSpeed / 1.6) * 100 - stops * 8 + 50)));
    return score;
  }, [path]);

  const metrics = useMemo(() => {
    if (!path.length) return {
      totalDistance: 0,
      avgSpeed: 0,
      obstacles: 0,
      avgAccel: 0,
      maxSpeed: 0,
      stops: 0,
      smoothness: 0,
    };

    let totalDistance = 0;
    const speeds: number[] = [];
    const accs: number[] = [];
    const headingDiffs: number[] = [];

    for (let i = 0; i < path.length; i++) {
      const p = path[i];
      speeds.push(p.speed);
      if (i > 0) {
        const prev = path[i - 1];
        const dx = p.x - prev.x;
        const dy = p.y - prev.y;
        totalDistance += Math.sqrt(dx * dx + dy * dy);
        const dt = Math.max(1, p.t - prev.t);
        const a = (p.speed - prev.speed) / dt;
        accs.push(a);
        // heading circular diff
        const diff = Math.abs(((p.heading - prev.heading + Math.PI) % (2 * Math.PI)) - Math.PI);
        headingDiffs.push(diff);
      }
    }

    const avgSpeed = speeds.reduce((s, v) => s + v, 0) / speeds.length;
    const maxSpeed = Math.max(...speeds);
    const obstacles = path.filter((p) => p.avoid).length;
    const stops = path.filter((p) => p.stop).length;
    const avgAccel = accs.length ? accs.reduce((s, v) => s + Math.abs(v), 0) / accs.length : 0;
    const meanHeadingChange = headingDiffs.length ? headingDiffs.reduce((s, v) => s + v, 0) / headingDiffs.length : 0;

    // smoothness: higher heading change and higher accel lowers smoothness
    const smoothness = Math.max(0, Math.min(100, Math.round(100 - meanHeadingChange * 30 - avgAccel * 8 - stops * 4)));

    return {
      totalDistance,
      avgSpeed,
      obstacles,
      avgAccel,
      maxSpeed,
      stops,
      smoothness,
    };
  }, [path]);

  return (
    <div className="space-y-6">
      {/* Map Canvas */}
      <div className="glass rounded-2xl p-4 relative">
        <div className="absolute top-4 right-4 glass-strong rounded-full p-1 flex gap-1 z-10">
          <button
            onClick={() => setTimeRange("today")}
            className={`px-3 py-1 rounded-full text-xs font-light transition-smooth ${
              timeRange === "today" ? "bg-foreground/10" : ""
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeRange("7d")}
            className={`px-3 py-1 rounded-full text-xs font-light transition-smooth ${
              timeRange === "7d" ? "bg-foreground/10" : ""
            }`}
          >
            7d
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`px-3 py-1 rounded-full text-xs font-light transition-smooth ${
              timeRange === "30d" ? "bg-foreground/10" : ""
            }`}
          >
            30d
          </button>
        </div>

        <div className="w-full h-[48vh] sm:h-[56vh] md:h-[64vh] relative">
          <svg className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
            {/* Grid */}
            {Array.from({ length: 11 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 80}
                y1="0"
                x2={i * 80}
                y2="500"
                stroke={PALETTE.bgGrid}
                strokeWidth="1"
              />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 80}
                x2="800"
                y2={i * 80}
                stroke={PALETTE.bgGrid}
                strokeWidth="1"
              />
            ))}

            {/* Speed-coded segments (draw small lines between points colored by speed) */}
            {path.map((p, i) => {
              if (i === 0) return null;
              const prev = path[i - 1];
              const color = speedToShade(p.speed);
              return (
                <line
                  key={`seg-${i}`}
                  x1={prev.x}
                  y1={prev.y}
                  x2={p.x}
                  y2={p.y}
                  stroke={color}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Path as dotted line overlay */}
            <path d={pathD} fill="none" stroke={PALETTE.pathLine} strokeWidth={2} strokeDasharray="6,6" strokeLinecap="round" />

            {/* Directional arrows */}
            {path.map((p, i) => {
              if (i % 2 !== 0) return null; // sparse arrows
              const size = 8;
              const angle = (p.heading || 0) * 180;
              return (
                <g key={`arrow-${i}`} transform={`translate(${p.x}, ${p.y}) rotate(${angle})`}>
                  <path d={`M0 ${-size} L${size} 0 L0 ${size}`} fill={PALETTE.arrow} opacity={0.9} />
                </g>
              );
            })}

            {/* Nodes (points) */}
            {path.map((node, i) => (
              <g key={i} className="cursor-pointer group">
                <circle cx={node.x} cy={node.y} r={6} fill={PALETTE.node} />
                {/* Start / End highlights */}
                {i === 0 && <circle cx={node.x} cy={node.y} r={10} stroke={PALETTE.motionBlue} strokeWidth={2} fill="none" />}
                {i === path.length - 1 && <circle cx={node.x} cy={node.y} r={10} stroke={PALETTE.dark} strokeWidth={2} fill="none" />}
                {/* Obstacle markers */}
                {node.avoid && <rect x={node.x - 6} y={node.y - 22} width={12} height={12} rx={2} fill={PALETTE.warn} />}
                {node.stop && <circle cx={node.x} cy={node.y - 18} r={5} fill="#EF5350" />}
              </g>
            ))}
          </svg>
        </div>

        {/* Path Score */}
        <div className="absolute left-6 bottom-6 glass rounded-xl px-4 py-3 text-sm">
          <div className="text-xs text-[#777777]">Path Efficiency</div>
          <div className="text-2xl font-extralight">{efficiency}</div>
        </div>
      </div>

      {/* Metrics row + charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-4">
          <div className="mb-3">
            <p className="text-xs text-[#777777]">Velocity Breakdown</p>
            <p className="text-sm text-[#333333]">Linear / Angular</p>
          </div>
          <div className="h-28">
            <svg className="w-full h-full" viewBox="0 0 600 80" preserveAspectRatio="xMidYMid meet">
              {/* Linear velocity */}
              <path d="M0 60 Q100 40 200 30 T400 25 T600 20" fill="none" stroke={PALETTE.motionBlue} strokeWidth={2} />
              {/* Angular velocity */}
              <path d="M0 70 Q100 65 200 50 T400 45 T600 40" fill="none" stroke="#757575" strokeWidth={1.6} />
            </svg>
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="mb-3">
            <p className="text-xs text-[#777777]">Acceleration Profile</p>
            <p className="text-sm text-[#333333]">m/s²</p>
          </div>
          <div className="h-28">
            <svg className="w-full h-full" viewBox="0 0 600 80" preserveAspectRatio="xMidYMid meet">
              <path d="M0 70 Q100 50 200 40 T400 30 T600 35 L600 80 L0 80 Z" fill="#BBDEFB" opacity={0.6} stroke="none" />
            </svg>
          </div>
        </div>

        <div className="glass rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#777777]">Path Smoothness</p>
              <p className="text-sm text-[#333333]">Index</p>
            </div>
            <div className="text-2xl font-extralight">{metrics.smoothness}</div>
          </div>
          <div className="text-xs text-[#777777]">Stop Frequency</div>
          <div className="h-12 mt-2 flex items-center gap-2">
            {/* stop timeline based on stops count - highlight some blocks */}
            {Array.from({ length: 6 }).map((_, i) => {
              const ratio = (i + 1) / 6;
              const active = Math.round(ratio * path.length) <= metrics.stops * 2; // heuristic mapping
              return <div key={i} className={`h-4 ${active ? "bg-[#EF5350]" : "bg-[#E0E0E0]"}`} style={{ flex: 1 }} />;
            })}
          </div>
        </div>
      </div>

      {/* Bottom metrics summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {[
          { label: "Total distance", value: `${(metrics.totalDistance / 1000).toFixed(1)} km` },
          { label: "Avg speed", value: `${metrics.avgSpeed.toFixed(2)} m/s` },
          { label: "Obstacles avoided", value: `${metrics.obstacles}` },
          { label: "Smoothness", value: `${metrics.smoothness}` },
          { label: "Avg acceleration", value: `${metrics.avgAccel.toFixed(2)} m/s²` },
          { label: "Max speed", value: `${metrics.maxSpeed.toFixed(2)} m/s` },
          { label: "Total stops", value: `${metrics.stops}` },
          { label: "Efficiency", value: `${efficiency}` },
        ].map((m, i) => (
          <div key={i} className="glass rounded-xl p-4">
            <p className="text-xs font-light opacity-60 mb-2">{m.label.toUpperCase()}</p>
            <p className="text-lg font-extralight">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
