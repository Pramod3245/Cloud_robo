import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";

const activities = [
  {
    id: 1,
    task: "Completed laundry folding for Sarah",
    time: "2 min ago",
    status: "completed",
    icon: CheckCircle2,
  },
  {
    id: 2,
    task: "Swept kitchen floor",
    time: "18 min ago",
    status: "completed",
    icon: CheckCircle2,
  },
  {
    id: 3,
    task: "Started charging cycle",
    time: "45 min ago",
    status: "in-progress",
    icon: Clock,
  },
  {
    id: 4,
    task: "Navigation recalibration required",
    time: "1 hr ago",
    status: "alert",
    icon: AlertCircle,
  },
];

export const ActivityTimeline = () => {
  const [timeRange, setTimeRange] = useState<"24h" | "7d">("24h");

  return (
    <div className="glass rounded-2xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-extralight tracking-wide">Activity Timeline</h2>
        
        <div className="relative glass-strong rounded-full p-1 flex">
          <button
            onClick={() => setTimeRange("24h")}
            className={`px-4 py-1 rounded-full text-xs font-light tracking-wide transition-smooth ${
              timeRange === "24h" ? "bg-foreground/10" : ""
            }`}
          >
            24h
          </button>
          <button
            onClick={() => setTimeRange("7d")}
            className={`px-4 py-1 rounded-full text-xs font-light tracking-wide transition-smooth ${
              timeRange === "7d" ? "bg-foreground/10" : ""
            }`}
          >
            7d
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative">
            {/* Timeline line */}
            {index < activities.length - 1 && (
              <div className="absolute left-6 top-12 bottom-0 w-px bg-border/15" />
            )}

            {/* Activity card */}
            <div className="relative flex gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl glass-strong flex items-center justify-center">
                <activity.icon className="w-5 h-5 stroke-[1.5] opacity-60" />
              </div>

              <div className="flex-1 glass-strong rounded-xl p-4 transition-smooth hover:bg-foreground/5 hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-normal flex-1">{activity.task}</p>
                  <span className="text-xs font-light opacity-60 whitespace-nowrap">{activity.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
