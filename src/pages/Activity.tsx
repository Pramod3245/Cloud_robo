import { Layout } from "@/components/Layout";
import { RobotVisual } from "@/components/home/RobotVisual";
import { Shirt, Wind, Sparkles, Clock } from "lucide-react";
import { useState } from "react";
import { FoldingModal } from "@/components/activity/FoldingModal";
import { SweepingModal } from "@/components/activity/SweepingModal";
import { CustomWorkflowModal } from "@/components/activity/CustomWorkflowModal";

const activities = [
  { id: 1, icon: Shirt, title: "Folding Clothes", description: "Organize and fold laundry by person" },
  { id: 2, icon: Wind, title: "Sweeping Floor", description: "Clean floors in selected rooms" },
  { id: 3, icon: Sparkles, title: "Custom Workflow", description: "Define custom task sequences" },
];

const comingSoon = [
  "Window Cleaning",
  "Dishwashing",
  "Organize Books",
  "Water Plants",
];

export default function Activity() {
  const [activeModal, setActiveModal] = useState<number | null>(null);

  return (
    <Layout>
      <div className="grid lg:grid-cols-[35%_65%] gap-8 min-h-[80vh]">
        {/* Left: Fixed Robot */}
        <div className="glass rounded-2xl p-8 lg:sticky lg:top-8 h-fit">
          <RobotVisual />
        </div>

        {/* Right: Activity Controls */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-extralight tracking-wide mb-2">Activity Center</h1>
            <p className="text-sm font-light opacity-60">Assign household tasks and watch your robot execute them</p>
          </div>

          {/* Primary Activities */}
          <div className="space-y-4">
            {activities.map((activity) => (
              <button
                key={activity.id}
                onClick={() => setActiveModal(activity.id)}
                className="w-full glass rounded-2xl p-8 flex items-center gap-6 transition-smooth hover:bg-foreground/5 hover:-translate-y-1 group"
              >
                <div className="w-16 h-16 rounded-xl glass-strong flex items-center justify-center flex-shrink-0">
                  <activity.icon className="w-8 h-8 stroke-[1.5] opacity-60 group-hover:opacity-100 transition-smooth" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-normal mb-1">{activity.title}</h3>
                  <p className="text-xs font-light opacity-60">{activity.description}</p>
                </div>
                <div className="opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-smooth">
                  →
                </div>
              </button>
            ))}
          </div>

          {/* Coming Soon */}
          <div>
            <h3 className="text-sm font-light opacity-60 mb-4 tracking-wide">COMING SOON</h3>
            <div className="grid grid-cols-2 gap-4">
              {comingSoon.map((item) => (
                <div
                  key={item}
                  className="glass rounded-xl p-6 opacity-30 cursor-not-allowed"
                >
                  <div className="w-10 h-10 rounded-lg glass-strong mb-3" />
                  <p className="text-sm font-light">{item}</p>
                  <span className="text-xs opacity-60">Soon</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity History */}
          <div className="glass rounded-2xl p-8">
            <h3 className="text-lg font-light mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { task: "Folded clothes for Sarah", time: "18 min ago", status: "Completed" },
                { task: "Swept living room", time: "1 hr ago", status: "Completed" },
                { task: "Custom workflow: Kitchen cleanup", time: "2 hrs ago", status: "Failed" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 pb-4 border-b border-border/10 last:border-0">
                  <Clock className="w-4 h-4 opacity-40" />
                  <div className="flex-1">
                    <p className="text-sm font-normal">{item.task}</p>
                    <p className="text-xs opacity-60">{item.time}</p>
                  </div>
                  <span className="text-xs glass-strong px-3 py-1 rounded-full">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 1 && <FoldingModal onClose={() => setActiveModal(null)} />}
      {activeModal === 2 && <SweepingModal onClose={() => setActiveModal(null)} />}
      {activeModal === 3 && <CustomWorkflowModal onClose={() => setActiveModal(null)} />}
    </Layout>
  );
}
