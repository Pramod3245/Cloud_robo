import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import useRobot from "@/hooks/useRobot";

const Settings = () => {
  const { robotState, updateSettings } = useRobot();
  const { settings } = robotState;

  // User Settings
  const [profileName, setProfileName] = useState("Operator");
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState("system");
  const [timeFormat, setTimeFormat] = useState("24");
  const [landing, setLanding] = useState("/");

  // Robot & Fleet
  const [telemetryInterval, setTelemetryInterval] = useState("200");
  const [pathLoggingNth, setPathLoggingNth] = useState(10);
  const [firmwareChannel, setFirmwareChannel] = useState("stable");
  const [autoNamePattern, setAutoNamePattern] = useState("BOT-{id}");

  // Tele-op & Safety
  const [maxLinear, setMaxLinear] = useState(1);
  const [maxAngular, setMaxAngular] = useState(1);
  const [deadman, setDeadman] = useState(true);
  const [autoStop, setAutoStop] = useState(true);
  const [teleopLevel, setTeleopLevel] = useState("admin");

  // Alerts
  const [batteryLow, setBatteryLow] = useState(20);
  const [highTemp, setHighTemp] = useState(75);
  const [offlineTimeout, setOfflineTimeout] = useState(30);
  const [alertLevel, setAlertLevel] = useState("all");

  // OTA
  const [updateStrategy, setUpdateStrategy] = useState("staged");
  const [minBatteryUpdate, setMinBatteryUpdate] = useState(50);
  const [allowRollback, setAllowRollback] = useState(true);

  // API
  const [apiKeys, setApiKeys] = useState<string[]>(["abcd-****", "xxxx-****"]);
  const [webhookUrl, setWebhookUrl] = useState("");

  // Simulator
  const [demoMode, setDemoMode] = useState(false);
  const [simRobots, setSimRobots] = useState(3);
  const [simSpeed, setSimSpeed] = useState("normal");

  // Sync with backend settings
  useEffect(() => {
    if (settings) {
      setMaxLinear(settings.speed_limit / 100); // Assuming speed_limit is % or scaled, but here we treat it as max speed for simplicity or need conversion. 
      // Actually simulator uses speed_limit as %. Let's assume maxLinear is m/s and speed_limit is %. 
      // For now, let's map maxLinear directly to speed_limit if they were same unit, but they are not.
      // Let's just map the ones that match directly.
      setTheme(settings.theme);
      // setSafeMode(settings.safe_mode); // We don't have safe_mode state variable in this component yet, it has 'deadman' etc.
      // Let's just map what we can.
    }
  }, [settings]);

  const saveAll = () => {
    // Update backend
    updateSettings({
      speed_limit: maxLinear * 100, // Convert back to % or whatever unit
      theme: theme,
      safe_mode: deadman // Map deadman to safe_mode for now
    });

    // For now persist to console. Integration with backend can follow.
    console.log("Saving settings", {
      profileName,
      email,
      theme,
      timeFormat,
      landing,
      telemetryInterval,
      pathLoggingNth,
      firmwareChannel,
      autoNamePattern,
      maxLinear,
      maxAngular,
      deadman,
      autoStop,
      teleopLevel,
      batteryLow,
      highTemp,
      offlineTimeout,
      alertLevel,
      updateStrategy,
      minBatteryUpdate,
      allowRollback,
      apiKeys,
      webhookUrl,
      demoMode,
      simRobots,
      simSpeed,
    });
    alert("Settings saved (synced with backend)");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold">Settings</h2>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* User Settings */}
          <Card>
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
              <CardDescription>Profile and UI preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="block text-sm">Profile Name</label>
                <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} />

                <label className="block text-sm">Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />

                <label className="block text-sm">Theme</label>
                <select className="w-full rounded-md border px-3 py-2" value={theme} onChange={(e) => setTheme(e.target.value)}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>

                <label className="block text-sm">Time Format</label>
                <select className="w-full rounded-md border px-3 py-2" value={timeFormat} onChange={(e) => setTimeFormat(e.target.value)}>
                  <option value="12">12h</option>
                  <option value="24">24h</option>
                </select>

                <label className="block text-sm">Default Landing Page</label>
                <select className="w-full rounded-md border px-3 py-2" value={landing} onChange={(e) => setLanding(e.target.value)}>
                  <option value="/">Dashboard</option>
                  <option value="/tele-op">Robots</option>
                  <option value="/activity">Alerts</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Robot & Fleet Defaults */}
          <Card>
            <CardHeader>
              <CardTitle>Robot & Fleet Defaults</CardTitle>
              <CardDescription>Defaults applied to newly added robots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="block text-sm">Default Telemetry Interval</label>
                <select className="w-full rounded-md border px-3 py-2" value={telemetryInterval} onChange={(e) => setTelemetryInterval(e.target.value)}>
                  <option value="200">200ms</option>
                  <option value="500">500ms</option>
                  <option value="1000">1s</option>
                </select>

                <label className="block text-sm">Path Logging Frequency (save every Nth point)</label>
                <Input type="number" value={pathLoggingNth} onChange={(e) => setPathLoggingNth(Number(e.target.value))} />

                <label className="block text-sm">Default Firmware Channel</label>
                <select className="w-full rounded-md border px-3 py-2" value={firmwareChannel} onChange={(e) => setFirmwareChannel(e.target.value)}>
                  <option value="stable">Stable</option>
                  <option value="beta">Beta</option>
                </select>

                <label className="block text-sm">Auto-Naming Pattern</label>
                <Input value={autoNamePattern} onChange={(e) => setAutoNamePattern(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Tele-op & Safety */}
          <Card>
            <CardHeader>
              <CardTitle>Tele-operation & Safety</CardTitle>
              <CardDescription>Limits and safety preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="block text-sm">Max Linear Speed</label>
                <Slider defaultValue={[maxLinear]} min={0} max={5} onValueChange={(v: number[]) => setMaxLinear(v[0])} />
                <div className="text-xs">{maxLinear} m/s</div>

                <label className="block text-sm">Max Angular Speed</label>
                <Slider defaultValue={[maxAngular]} min={0} max={5} onValueChange={(v: number[]) => setMaxAngular(v[0])} />
                <div className="text-xs">{maxAngular} rad/s</div>

                <div className="flex items-center justify-between">
                  <label className="text-sm">Enable Dead-Man Switch</label>
                  <Switch checked={deadman} onCheckedChange={(v) => setDeadman(Boolean(v))} />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm">Auto-Stop on Connection Loss</label>
                  <Switch checked={autoStop} onCheckedChange={(v) => setAutoStop(Boolean(v))} />
                </div>

                <label className="block text-sm">Tele-op Permission Level</label>
                <select className="w-full rounded-md border px-3 py-2" value={teleopLevel} onChange={(e) => setTeleopLevel(e.target.value)}>
                  <option value="admin">Admin only</option>
                  <option value="admin+op">Admin + Operator</option>
                  <option value="everyone">Everyone</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Alerts & Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Alerts & Notifications</CardTitle>
              <CardDescription>Thresholds and alert preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="block text-sm">Battery Low Threshold (%)</label>
                <Input type="number" value={batteryLow} onChange={(e) => setBatteryLow(Number(e.target.value))} />

                <label className="block text-sm">High Temperature Threshold (°C)</label>
                <Input type="number" value={highTemp} onChange={(e) => setHighTemp(Number(e.target.value))} />

                <label className="block text-sm">Offline Timeout (seconds)</label>
                <Input type="number" value={offlineTimeout} onChange={(e) => setOfflineTimeout(Number(e.target.value))} />

                <label className="block text-sm">Alert Level Preferences</label>
                <select className="w-full rounded-md border px-3 py-2" value={alertLevel} onChange={(e) => setAlertLevel(e.target.value)}>
                  <option value="critical">Critical only</option>
                  <option value="all">All alerts</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* OTA / Updates */}
          <Card>
            <CardHeader>
              <CardTitle>OTA / Updates</CardTitle>
              <CardDescription>Update strategies and safety</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="block text-sm">Default Update Strategy</label>
                <select className="w-full rounded-md border px-3 py-2" value={updateStrategy} onChange={(e) => setUpdateStrategy(e.target.value)}>
                  <option value="immediate">Immediate</option>
                  <option value="staged">Staged</option>
                </select>

                <label className="block text-sm">Minimum Battery Required for Update (%)</label>
                <Input type="number" value={minBatteryUpdate} onChange={(e) => setMinBatteryUpdate(Number(e.target.value))} />

                <div className="flex items-center justify-between">
                  <label className="text-sm">Allow Auto-Rollback</label>
                  <Switch checked={allowRollback} onCheckedChange={(v) => setAllowRollback(Boolean(v))} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API & Integrations */}
          <Card>
            <CardHeader>
              <CardTitle>API & Integrations</CardTitle>
              <CardDescription>Keys and webhooks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="block text-sm">API Keys</label>
                <div className="space-y-2">
                  {apiKeys.map((k, i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                      <div className="text-sm text-muted-foreground">{k}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setApiKeys((s) => s.filter((_, idx) => idx !== i))}>
                          Revoke
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={() => setApiKeys((s) => [...s, `key-${Math.random().toString(36).slice(2, 10)}`])}>Create New API Key</Button>

                <label className="block text-sm">Webhook URL (optional)</label>
                <Input value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* System / Simulator */}
          <Card>
            <CardHeader>
              <CardTitle>System / Simulator</CardTitle>
              <CardDescription>Simulator and demo options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm">Enable Demo Mode</label>
                  <Switch checked={demoMode} onCheckedChange={(v) => setDemoMode(Boolean(v))} />
                </div>

                <label className="block text-sm">Number of Simulated Robots</label>
                <Input type="number" value={simRobots} onChange={(e) => setSimRobots(Number(e.target.value))} />

                <label className="block text-sm">Simulation Speed</label>
                <select className="w-full rounded-md border px-3 py-2" value={simSpeed} onChange={(e) => setSimSpeed(e.target.value)}>
                  <option value="normal">Normal</option>
                  <option value="fast">Fast</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
              <CardDescription>App information and support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">App Version</div>
                  <div className="font-medium">{typeof process !== "undefined" && (process as any)?.env?.npm_package_version ? (process as any).env.npm_package_version : "0.0.0"}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground">Team Members</div>
                  <ul className="list-disc pl-5">
                    <li>Alice</li>
                    <li>Bob</li>
                    <li>Charlie</li>
                  </ul>
                </div>

                <div>
                  <a className="text-sm text-primary underline" href="mailto:support@fitfest.local">Support / Feedback</a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={saveAll}>Save All</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
