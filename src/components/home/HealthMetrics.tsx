import { useState } from "react";
import { TrendingUp } from "lucide-react";

const tabs = ["Vitals", "Motion", "Alerts", "Energy"];

const COLORS = {
  black: "#000000",
  midGrey: "#7D7D7D",
  lightGrey: "#E5E5E5",
  veryLight: "#F8F8F8",
  green: "#4CAF50",
  orange: "#FFA726",
  red: "#EF5350",
  blue: "#42A5F5",
  lightBlue: "#90CAF9",
};

const MiniStat = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col items-start">
    <span className="text-xs text-[#7D7D7D]">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

export const HealthMetrics = () => {
  const [activeTab, setActiveTab] = useState(0);

  const healthScore = 87;
  const healthTrend = "+3%";

  const ringColor = healthScore >= 80 ? COLORS.green : healthScore >= 40 ? COLORS.orange : COLORS.red;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-8 border-b" style={{ borderColor: COLORS.lightGrey }}>
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className="relative pb-3 text-sm font-light tracking-wide transition-all"
          >
            <span style={{ color: index === activeTab ? COLORS.black : COLORS.midGrey }}>{tab}</span>
            {activeTab === index && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: COLORS.black }} />
            )}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 0 && (
          // Vitals
          <div>
            <div className="h-40 sm:h-48 md:h-52 lg:h-56 relative bg-transparent">
              <svg className="w-full h-full max-w-[1100px] mx-auto" viewBox="0 0 600 160" preserveAspectRatio="xMidYMid meet">
                {/* grid lines */}
                {[0, 1, 2, 3].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={(i * 40).toString()}
                    x2="600"
                    y2={(i * 40).toString()}
                    stroke={COLORS.lightGrey}
                    strokeOpacity="1"
                    strokeWidth="0.5"
                  />
                ))}

                {/* Temperature trend (green area) */}
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.green} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={COLORS.green} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 120 Q80 110 140 100 T260 90 Q340 85 400 95 T600 80 L600 160 L0 160 Z" fill="url(#tempGrad)" stroke="none" />
                <path d="M0 120 Q80 110 140 100 T260 90 Q340 85 400 95 T600 80" fill="none" stroke={COLORS.green} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

                {/* CPU load (black stroke, light grey fill) */}
                <defs>
                  <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.black} stopOpacity="0.06" />
                    <stop offset="100%" stopColor={COLORS.black} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 140 Q60 130 120 110 T240 100 Q320 95 380 105 T600 95 L600 160 L0 160 Z" fill="url(#cpuGrad)" stroke="none" />
                <path d="M0 140 Q60 130 120 110 T240 100 Q320 95 380 105 T600 95" fill="none" stroke={COLORS.black} strokeWidth={1.5} />
              </svg>
            </div>

            {/* Health ring + mini indicators */}
            <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-6">
              <div className="flex-1 flex flex-col md:flex-row items-center gap-6 w-full">
                <div className="relative w-full max-w-[160px] h-36 md:h-40 lg:h-44">
                  <svg viewBox="0 0 128 128" className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" fill="none" stroke={COLORS.lightGrey} strokeWidth="6" />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke={ringColor}
                      strokeWidth="6"
                      strokeDasharray={`${2 * Math.PI * 56 * (healthScore / 100)} ${2 * Math.PI * 56}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extralight" style={{ color: COLORS.black }}>{healthScore}</span>
                    <span className="text-xs text-[#7D7D7D] flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {healthTrend}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1 w-full">
                  <MiniStat label="Battery Temp" value="36°C" />
                  <MiniStat label="CPU Temp" value="54°C" />
                  <MiniStat label="Motor Temp" value="42°C" />
                  <MiniStat label="Humidity" value="22%" />
                  <MiniStat label="Runtime" value="3d 4h" />
                  <MiniStat label="Health" value="87%" />
                </div>
              </div>

              <div className="w-full md:w-48 text-center md:text-right text-sm text-[#7D7D7D]">
                <div>Overall status</div>
                <div className="mt-2 font-medium" style={{ color: ringColor }}>{healthScore >= 80 ? 'Healthy' : healthScore >= 40 ? 'Warning' : 'Critical'}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 1 && (
          // Motion
          <div>
            <div className="h-40 sm:h-52 md:h-56 lg:h-64 flex items-center justify-center">
              <svg className="w-full max-w-[1100px] h-full mx-auto" viewBox="0 0 600 160" preserveAspectRatio="xMidYMid meet">
                {/* Velocity (blue) */}
                <path d="M0 130 Q80 110 140 100 T260 90 Q340 80 400 90 T600 70" fill="none" stroke={COLORS.blue} strokeWidth={2.5} strokeLinecap="round" />

                {/* Angular (dark grey) */}
                <path d="M0 140 Q80 135 140 120 T260 110 Q340 105 400 115 T600 100" fill="none" stroke="#555555" strokeWidth={1.6} strokeLinecap="round" />

                {/* Acceleration filled light blue */}
                <path d="M0 150 Q80 135 140 120 T260 110 Q340 100 400 110 T600 105 L600 160 L0 160 Z" fill={COLORS.lightBlue} opacity={0.45} stroke="none" />
              </svg>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 items-center">
              <div className="flex flex-col items-center">
                <div className="text-xs text-[#7D7D7D]">Yaw</div>
                <svg className="w-full max-w-[220px] h-8" viewBox="0 0 100 20"><path d="M0 12 Q25 6 50 8 T100 6" stroke={COLORS.blue} strokeWidth={1.2} fill="none"/></svg>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs text-[#7D7D7D]">Pitch</div>
                <svg className="w-full max-w-[220px] h-8" viewBox="0 0 100 20"><path d="M0 10 Q25 8 50 12 T100 9" stroke="#8E24AA" strokeWidth={1.2} fill="none"/></svg>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs text-[#7D7D7D]">Roll</div>
                <svg className="w-full max-w-[220px] h-8" viewBox="0 0 100 20"><path d="M0 11 Q25 9 50 10 T100 8" stroke="#7E57C2" strokeWidth={1.2} fill="none"/></svg>
              </div>
            </div>
          </div>
        )}

        {activeTab === 2 && (
          // Alerts
          <div>
            <div className="h-40 sm:h-52 md:h-56 lg:h-64 flex items-center justify-center">
              <svg className="w-full max-w-[1100px] h-full mx-auto" viewBox="0 0 600 120" preserveAspectRatio="xMidYMid meet">
                {/* spike bars */}
                {[...Array(24)].map((_, i) => {
                  const x = (i * 25) + 10;
                  const height = Math.floor(10 + Math.abs(Math.sin(i / 3)) * 80);
                  const color = i % 7 === 0 ? COLORS.red : i % 4 === 0 ? COLORS.orange : COLORS.lightGrey;
                  return <rect key={i} x={x} y={120 - height} width={12} height={height} fill={color} rx={2} />;
                })}
              </svg>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mt-4 items-center justify-center">
              <div className="w-full md:w-44 flex flex-col items-center">
                <div className="text-xs text-[#7D7D7D]">Alert Breakdown</div>
                <svg viewBox="0 0 100 100" className="w-28 h-28 mt-2">
                  <circle cx="50" cy="50" r="30" fill={COLORS.lightGrey} />
                  <path d="M50 50 L80 50 A30 30 0 0 0 50 20 Z" fill={COLORS.orange} />
                  <path d="M50 50 L50 20 A30 30 0 0 0 20 50 Z" fill={COLORS.red} />
                </svg>
              </div>

              <div className="flex-1 max-w-2xl w-full">
                <div className="text-xs text-[#7D7D7D]">Recent Alerts</div>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="flex items-center justify-between"><div><span className="text-[#7D7D7D]">12:02</span> <strong className="ml-2">Motor spike</strong></div> <span className="px-2 py-0.5 text-xs rounded ml-2" style={{background:COLORS.orange,color:'#fff'}}>Warning</span></li>
                  <li className="flex items-center justify-between"><div><span className="text-[#7D7D7D]">11:40</span> <strong className="ml-2">Battery temp high</strong></div> <span className="px-2 py-0.5 text-xs rounded ml-2" style={{background:COLORS.red,color:'#fff'}}>Critical</span></li>
                  <li className="flex items-center justify-between"><div><span className="text-[#7D7D7D]">11:12</span> <strong className="ml-2">Info: ping</strong></div> <span className="px-2 py-0.5 text-xs rounded ml-2" style={{background:COLORS.lightGrey,color:COLORS.black}}>Info</span></li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 3 && (
          // Energy
          <div>
            <div className="h-36">
              <svg className="w-full h-full" viewBox="0 0 600 140" preserveAspectRatio="none">
                {/* Battery % line */}
                <path d="M0 80 Q80 78 140 76 T260 70 Q340 65 400 62 T600 50" fill="none" stroke={COLORS.black} strokeWidth={1.8} />
                <path d="M0 120 Q80 110 140 100 T260 90 Q340 85 400 88 T600 80 L600 140 L0 140 Z" fill="#f3f3f3" />

                {/* Power consumption area */}
                <path d="M0 140 Q80 120 140 110 T260 100 Q340 96 400 98 T600 92 L600 140 L0 140 Z" fill="#9E9E9E" opacity={0.6} />
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <div className="text-xs text-[#7D7D7D]">Subsystem Power</div>
                <div className="space-y-2 mt-2">
                  <div className="text-xs">Motor</div>
                  <div className="h-3 bg-[#333] rounded" style={{ width: '80%' }} />
                  <div className="text-xs">CPU</div>
                  <div className="h-3 bg-[#666] rounded" style={{ width: '60%' }} />
                  <div className="text-xs">Sensors</div>
                  <div className="h-3 bg-[#999] rounded" style={{ width: '40%' }} />
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-xs text-[#7D7D7D]">Estimated Runtime</div>
                <div className="w-28 h-28 relative mt-2">
                  <svg viewBox="0 0 128 128" className="w-28 h-28 transform -rotate-90">
                    <circle cx="64" cy="64" r="56" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                    <circle cx="64" cy="64" r="56" fill="none" stroke={COLORS.green} strokeWidth="8" strokeDasharray={`${2*Math.PI*56*0.45} ${2*Math.PI*56}`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-sm">
                    <div className="font-medium">3h 12m</div>
                    <div className="text-xs text-[#7D7D7D]">remaining</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
