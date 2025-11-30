import { BodyPart } from "@/pages/SelfHeal";
import { Cpu, Thermometer, Activity, Clock } from "lucide-react";

interface MetricsPanelProps {
  selectedPart: BodyPart;
}

const metricsData: Record<string, any> = {
  head: {
    components: ["Vision sensors", "Audio processors", "CPU module"],
    metrics: [
      { icon: Cpu, label: "CPU Usage", value: "42%", status: "ok" },
      { icon: Thermometer, label: "Temperature", value: "38°C", status: "ok" },
      { icon: Activity, label: "Sensor Load", value: "Normal", status: "ok" },
    ],
  },
  torso: {
    components: ["Core compute", "Power distribution", "Main controller"],
    metrics: [
      { icon: Cpu, label: "System Load", value: "58%", status: "ok" },
      { icon: Thermometer, label: "Core Temp", value: "45°C", status: "warning" },
      { icon: Activity, label: "Power Draw", value: "85W", status: "ok" },
    ],
  },
  "left-arm": {
    components: ["Shoulder motor", "Elbow joint", "Wrist actuator", "Gripper"],
    metrics: [
      { icon: Activity, label: "Torque", value: "72%", status: "ok" },
      { icon: Thermometer, label: "Motor Temp", value: "52°C", status: "warning" },
      { icon: Clock, label: "Life Remaining", value: "68%", status: "ok" },
    ],
  },
  "right-arm": {
    components: ["Shoulder motor", "Elbow joint", "Wrist actuator", "Gripper"],
    metrics: [
      { icon: Activity, label: "Torque", value: "78%", status: "ok" },
      { icon: Thermometer, label: "Motor Temp", value: "48°C", status: "ok" },
      { icon: Clock, label: "Life Remaining", value: "75%", status: "ok" },
    ],
  },
  legs: {
    components: ["Hip motors", "Knee joints", "Ankle stabilizers", "Foot sensors"],
    metrics: [
      { icon: Activity, label: "Mobility", value: "Active", status: "ok" },
      { icon: Thermometer, label: "Avg Temp", value: "41°C", status: "ok" },
      { icon: Clock, label: "Steps Today", value: "12,482", status: "ok" },
    ],
  },
  base: {
    components: ["Wheel motors", "Gyroscope", "Navigation sensors"],
    metrics: [
      { icon: Activity, label: "Navigation", value: "Active", status: "ok" },
      { icon: Thermometer, label: "Motor Temp", value: "39°C", status: "ok" },
      { icon: Clock, label: "Odometer", value: "1,247 km", status: "ok" },
    ],
  },
};

export const MetricsPanel = ({ selectedPart }: MetricsPanelProps) => {
  if (!selectedPart) {
    return (
      <div className="glass rounded-2xl p-8">
        <h3 className="text-lg font-light mb-4">Component Diagnostics</h3>
        <p className="text-sm font-light opacity-60">
          Click on a body part to view detailed metrics
        </p>
      </div>
    );
  }

  const data = metricsData[selectedPart];

  return (
    <div className="glass rounded-2xl p-8 space-y-6">
      <div>
        <h3 className="text-lg font-light mb-2">Component Diagnostics</h3>
        <p className="text-xs opacity-60 capitalize">{selectedPart.replace("-", " ")}</p>
      </div>

      {/* Components List */}
      <div>
        <h4 className="text-xs font-light opacity-60 mb-3 tracking-wide">COMPONENTS</h4>
        <div className="space-y-2">
          {data.components.map((comp: string, i: number) => (
            <div key={i} className="flex items-center justify-between text-sm glass-strong rounded-lg px-3 py-2">
              <span className="font-light">{comp}</span>
              <div className="w-2 h-2 rounded-full bg-foreground/60" />
            </div>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div>
        <h4 className="text-xs font-light opacity-60 mb-3 tracking-wide">METRICS</h4>
        <div className="space-y-3">
          {data.metrics.map((metric: any, i: number) => (
            <div key={i} className="glass-strong rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <metric.icon className="w-4 h-4 opacity-40" />
                <span className="text-xs font-light opacity-60">{metric.label}</span>
              </div>
              <p className="text-lg font-light">{metric.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
