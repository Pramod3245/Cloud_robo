import { Search } from "lucide-react";
import { useState } from "react";

const logs = [
  "[14:23:45] Navigate to kitchen - position (12.4, 8.2) - velocity 0.8 m/s",
  "[14:23:12] Task started: fold laundry - bedroom area",
  "[14:22:48] Obstacle detected at (10.1, 7.5) - rerouting path",
  "[14:22:15] Battery level: 76% - estimated runtime 4.2 hours",
  "[14:21:53] Collision avoidance activated - emergency stop",
  "[14:21:20] Resume autonomous navigation - target: charging station",
  "[14:20:48] Sensor calibration complete - all systems nominal",
  "[14:20:12] Position update: living room (15.7, 12.3)",
  "[14:19:45] Task completed: sweep floor - quality score 88%",
  "[14:19:20] Navigation checkpoint reached - proceeding to next waypoint",
];

export const LogsTab = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="glass rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-strong rounded-xl flex items-center gap-3 px-4">
            <Search className="w-4 h-4 opacity-40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search logs..."
              className="flex-1 bg-transparent py-3 text-sm font-light focus:outline-none"
            />
          </div>

          <select className="glass-strong rounded-xl px-4 py-3 text-sm font-light focus:outline-none cursor-pointer">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>

          <select className="glass-strong rounded-xl px-4 py-3 text-sm font-light focus:outline-none cursor-pointer">
            <option>All task types</option>
            <option>Navigation</option>
            <option>Task execution</option>
            <option>System events</option>
          </select>
        </div>
      </div>

      {/* Logs Display */}
      <div className="glass rounded-2xl p-6">
        <div className="space-y-1 font-mono text-xs">
          {logs
            .filter((log) => log.toLowerCase().includes(search.toLowerCase()))
            .map((log, i) => (
              <div
                key={i}
                className="py-2 px-3 hover:bg-foreground/3 rounded transition-smooth"
              >
                {log}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
