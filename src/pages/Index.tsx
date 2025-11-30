import { Layout } from "@/components/Layout";
import { HealthMetrics } from "@/components/home/HealthMetrics";
import { RobotVisual } from "@/components/home/RobotVisual";
import { StatusCards } from "@/components/home/StatusCards";
import { ActivityTimeline } from "@/components/home/ActivityTimeline";
import { QuickActions } from "@/components/home/QuickActions";
import useRobot from "@/hooks/useRobot";

const Index = () => {
  const { robotState } = useRobot();

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section: Health & Robot */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="grid lg:grid-cols-[65%_35%]">
            <div className="p-8 lg:border-r border-border/10">
              <HealthMetrics robotState={robotState} />
            </div>
            <div className="min-h-[400px] lg:min-h-[500px]">
              <RobotVisual />
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <StatusCards robotState={robotState} />

        {/* Activity Timeline & Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-8">
          <ActivityTimeline />
          <QuickActions />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
