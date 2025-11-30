import { Layout } from "@/components/Layout";
import { PathingTab } from "@/components/kinematics/PathingTab";
import { AssessmentsTab } from "@/components/kinematics/AssessmentsTab";
import { LogsTab } from "@/components/kinematics/LogsTab";
import { useState } from "react";

type Tab = "pathing" | "assessments" | "logs";

export default function Kinematics() {
  const [activeTab, setActiveTab] = useState<Tab>("pathing");

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-extralight tracking-wide mb-2">Kinematics</h1>
          <p className="text-sm font-light opacity-60">Movement analysis and task performance metrics</p>
        </div>

        {/* Tabs */}
        <div className="glass rounded-2xl p-2 inline-flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("pathing")}
            className={`px-6 py-2 rounded-xl text-sm font-light transition-smooth ${
              activeTab === "pathing" ? "bg-foreground/10" : "hover:bg-foreground/5"
            }`}
          >
            Pathing
          </button>
          <button
            onClick={() => setActiveTab("assessments")}
            className={`px-6 py-2 rounded-xl text-sm font-light transition-smooth ${
              activeTab === "assessments" ? "bg-foreground/10" : "hover:bg-foreground/5"
            }`}
          >
            Assessments
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-6 py-2 rounded-xl text-sm font-light transition-smooth ${
              activeTab === "logs" ? "bg-foreground/10" : "hover:bg-foreground/5"
            }`}
          >
            Logs
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === "pathing" && <PathingTab />}
          {activeTab === "assessments" && <AssessmentsTab />}
          {activeTab === "logs" && <LogsTab />}
        </div>
      </div>
    </Layout>
  );
}
