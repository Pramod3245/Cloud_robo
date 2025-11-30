import { Activity, Battery, MapPin } from "lucide-react";
import { RobotState } from "@/hooks/useRobot";

export const StatusCards = ({ robotState }: { robotState?: RobotState }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Current Task */}
      <div className="glass rounded-2xl p-8 hover-lift">
        <Activity className="w-8 h-8 stroke-[1.5] opacity-40 mb-4" />
        <p className="text-xs font-light opacity-60 mb-2">CURRENT STATUS</p>
        <h3 className="text-lg font-normal mb-2 capitalize">{robotState?.status ?? "Idle"}</h3>
        <div className="flex items-center gap-2">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeWidth="2"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 20 * 0.65} ${2 * Math.PI * 20}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-light">
              65%
            </div>
          </div>
          <div>
            <p className="text-xs font-light">12 min elapsed</p>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
              <span className="text-xs font-light opacity-60">In Progress</span>
            </div>
          </div>
        </div>
      </div>

      {/* Battery */}
      <div className="glass rounded-2xl p-8 hover-lift">
        <Battery className="w-8 h-8 stroke-[1.5] opacity-40 mb-4" />
        <p className="text-xs font-light opacity-60 mb-2">BATTERY</p>
        <h3 className="text-3xl font-extralight mb-2">{robotState?.battery.toFixed(0) ?? 0}%</h3>
        <p className="text-xs font-light opacity-60">{robotState?.is_charging ? "Charging" : "Discharging"}</p>
        <p className="text-xs font-light mt-2">~{((robotState?.battery ?? 0) / 20).toFixed(2)} hrs runtime</p>
      </div>

      {/* Environment */}
      <div className="glass rounded-2xl p-8 hover-lift">
        <MapPin className="w-8 h-8 stroke-[1.5] opacity-40 mb-4" />
        <p className="text-xs font-light opacity-60 mb-2">LOCATION</p>
        <h3 className="text-lg font-normal mb-4">{robotState?.location_name || "Unknown"}</h3>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-foreground/80" />
          <div className="w-2 h-2 rounded-full bg-foreground/40" />
          <div className="w-2 h-2 rounded-full bg-foreground/40" />
          <div className="w-2 h-2 rounded-full bg-foreground/20" />
        </div>
      </div>
    </div>
  );
};
