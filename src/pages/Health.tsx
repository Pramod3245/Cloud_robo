import { Layout } from "@/components/Layout";
import { Activity, Clock, Wrench, AlertCircle } from "lucide-react";
import useRobot from "@/hooks/useRobot";

export default function Health() {
  const { robotState } = useRobot();
  const { health_details, battery, temperature } = robotState;

  // Calculate an overall health score based on available metrics
  const healthScore = Math.round(
    (battery + (100 - health_details.cpu_load) + (100 - health_details.memory_usage)) / 3
  );

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-extralight tracking-wide mb-2">Health</h1>
          <p className="text-sm font-light opacity-60">Hardware health and maintenance overview</p>
        </div>

        {/* Overall Health */}
        <div className="glass rounded-2xl p-8 mb-8">
          <div className="grid md:grid-cols-[auto_1fr_auto] gap-8 items-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="4" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 56 * (healthScore / 100)} ${2 * Math.PI * 56}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extralight">{healthScore}%</span>
                <span className="text-xs opacity-60">Health</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-light mb-2">System Health</h2>
              <p className="text-sm font-light opacity-60">
                {healthScore > 80 ? "All systems operating within normal parameters" : "System performance degraded"}
              </p>
            </div>

            <div className="text-right space-y-2">
              <div>
                <p className="text-xs opacity-60">Last Service</p>
                <p className="text-sm font-light">12 days ago</p>
              </div>
              <div>
                <p className="text-xs opacity-60">Next Service</p>
                <p className="text-sm font-light">In 18 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Component Lifespan */}
        <div className="glass rounded-2xl p-8 mb-8">
          <h3 className="text-lg font-light mb-6">Component Lifecycle</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/10">
                  <th className="text-left p-3 text-xs font-light opacity-60">COMPONENT</th>
                  <th className="text-left p-3 text-xs font-light opacity-60">METRIC</th>
                  <th className="text-left p-3 text-xs font-light opacity-60">STATUS</th>
                  <th className="text-left p-3 text-xs font-light opacity-60">RISK</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "CPU Load", metric: `${health_details.cpu_load.toFixed(1)}%`, life: 100 - health_details.cpu_load, risk: health_details.cpu_load > 80 ? "H" : "L" },
                  { name: "Memory Usage", metric: `${health_details.memory_usage.toFixed(1)}%`, life: 100 - health_details.memory_usage, risk: health_details.memory_usage > 80 ? "H" : "L" },
                  { name: "Left Motor Temp", metric: `${health_details.motor_temp_l.toFixed(1)}°C`, life: 100 - (health_details.motor_temp_l / 2), risk: health_details.motor_temp_l > 60 ? "H" : "L" },
                  { name: "Right Motor Temp", metric: `${health_details.motor_temp_r.toFixed(1)}°C`, life: 100 - (health_details.motor_temp_r / 2), risk: health_details.motor_temp_r > 60 ? "H" : "L" },
                  { name: "Battery Temp", metric: `${health_details.battery_temp.toFixed(1)}°C`, life: 100 - (health_details.battery_temp / 2), risk: health_details.battery_temp > 50 ? "M" : "L" },
                ].map((item, i) => (
                  <tr key={i} className="border-b border-border/5 hover:bg-foreground/3 transition-smooth">
                    <td className="p-3 text-sm font-light">{item.name}</td>
                    <td className="p-3 text-sm font-light opacity-60">{item.metric}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-foreground/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-foreground/40"
                            style={{ width: `${Math.max(0, Math.min(100, item.life))}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`glass-strong px-2 py-1 rounded text-xs ${item.risk === 'H' ? 'text-red-400' : 'text-foreground'}`}>{item.risk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Maintenance & History */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Upcoming Maintenance */}
          <div className="glass rounded-2xl p-8">
            <h3 className="text-lg font-light mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 opacity-40" />
              Maintenance Schedule
            </h3>
            <div className="space-y-4">
              {[
                { task: "Replace left shoulder motor", due: "15 days", urgent: true },
                { task: "Battery health check", due: "30 days", urgent: false },
                { task: "Sensor calibration", due: "45 days", urgent: false },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b border-border/10 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${item.urgent ? "bg-foreground/60" : "bg-foreground/20"}`} />
                  <div className="flex-1">
                    <p className="text-sm font-normal mb-1">{item.task}</p>
                    <p className="text-xs opacity-60">Due in {item.due}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Repair History */}
          <div className="glass rounded-2xl p-8">
            <h3 className="text-lg font-light mb-6 flex items-center gap-2">
              <Wrench className="w-5 h-5 opacity-40" />
              Service Log
            </h3>
            <div className="space-y-4">
              {[
                { date: "Nov 16", component: "Right arm motor", issue: "Wear detected", cost: "$120" },
                { date: "Oct 28", component: "Navigation sensor", issue: "Calibration drift", cost: "$45" },
                { date: "Oct 5", component: "Battery cells", issue: "Rebalancing", cost: "$0" },
              ].map((item, i) => (
                <div key={i} className="pb-4 border-b border-border/10 last:border-0">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm font-normal">{item.component}</p>
                    <span className="text-xs opacity-60">{item.date}</span>
                  </div>
                  <p className="text-xs opacity-60 mb-1">{item.issue}</p>
                  <p className="text-xs font-light">{item.cost}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
