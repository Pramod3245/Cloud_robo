import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, Home, Power } from "lucide-react";

type SystemStatus = "idle" | "running" | "paused" | "docking" | "checking";

const LS_KEY = "quick-actions-system-status";

const notify = (title: string, body?: string) => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, { body });
  }
};

const requestNotificationPermission = async () => {
  if ("Notification" in window && Notification.permission === "default") {
    try {
      await Notification.requestPermission();
    } catch {
      /* ignore */
    }
  }
};

/* ---------- Tiny Toast System ---------- */
type Toast = { id: string; text: string; undo?: () => void; timeout?: number };

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = (t: Toast) => {
    setToasts((s) => [...s, t]);
    if (t.timeout ?? 5000) {
      const ms = t.timeout ?? 5000;
      setTimeout(() => setToasts((s) => s.filter((x) => x.id !== t.id)), ms);
    }
  };
  const remove = (id: string) => setToasts((s) => s.filter((t) => t.id !== id));
  return { toasts, push, remove };
}

/* ---------- Main Component ---------- */
export const QuickActions: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw) as SystemStatus;
    } catch {}
    return "idle";
  });
  const [checkingProgress, setCheckingProgress] = useState(0); // 0-100
  const [checkingLog, setCheckingLog] = useState<string[]>([]);
  const { toasts, push, remove } = useToasts();
  const holdTimer = useRef<number | null>(null);
  const holdStartRef = useRef<number | null>(null);

  // Persist status
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(status));
    } catch {}
  }, [status]);

  useEffect(() => {
    // request notification permission politely
    requestNotificationPermission();

    const onKey = (e: KeyboardEvent) => {
      // avoid keybinds while typing
      const tag = (document.activeElement?.tagName || "").toLowerCase();
      if (["input", "textarea"].includes(tag)) return;

      const key = e.key.toLowerCase();
      if (key === "r") handleResume();
      if (key === "p") handlePause();
      if (key === "h") triggerReturnHome();
      if (key === "s") runSystemCheck();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Action Handlers ---------- */

  const handleResume = () => {
    if (status === "running") {
      push({ id: crypto.randomUUID(), text: "Already running." });
      return;
    }
    setStatus("running");
    push({ id: crypto.randomUUID(), text: "Resuming tasks — system running." });
    notify("Tasks Resumed", "System status: running");
  };

  const handlePause = () => {
    if (status === "paused") {
      push({ id: crypto.randomUUID(), text: "Already paused." });
      return;
    }
    const id = crypto.randomUUID();
    setStatus("paused");
    push({
      id,
      text: "System paused. Click UNDO to resume within 6s.",
      undo: () => {
        setStatus("running");
        push({ id: crypto.randomUUID(), text: "Undo: Resumed tasks." });
        remove(id);
      },
      timeout: 6000,
    });
    notify("System Paused", "All tasks temporarily stopped.");
  };

  const triggerReturnHome = () => {
    // immediate UI feedback (optimistic)
    if (status === "docking") {
      push({ id: crypto.randomUUID(), text: "Already heading to dock." });
      return;
    }
    setStatus("docking");
    push({ id: crypto.randomUUID(), text: "Returning to charging station..." });
    notify("Returning Home", "Navigating to charging station.");

    // simulate travel and docking
    setTimeout(() => {
      setStatus("idle");
      push({ id: crypto.randomUUID(), text: "Docked. Charging started." });
      notify("Docked", "Charging started.");
    }, 3500);
  };

  const runSystemCheck = async () => {
    if (status === "checking") {
      push({ id: crypto.randomUUID(), text: "System check already running..." });
      return;
    }
    setStatus("checking");
    setCheckingProgress(0);
    setCheckingLog([]);
    push({ id: crypto.randomUUID(), text: "System check started — running diagnostics." });
    notify("System Check", "Diagnostics started.");

    const steps = [
      { name: "CPU health", ms: 600 },
      { name: "Memory integrity", ms: 700 },
      { name: "Sensors calibration", ms: 800 },
      { name: "Motor tests", ms: 700 },
      { name: "Network connectivity", ms: 500 },
    ];

    let accum = 0;
    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];
      await new Promise((res) => setTimeout(res, s.ms));
      accum += 100 / steps.length;
      setCheckingProgress(Math.min(100, Math.round(accum)));
      setCheckingLog((l) => [...l, `${s.name}: OK`]);
    }

    // small finalization
    await new Promise((r) => setTimeout(r, 400));
    setCheckingProgress(100);
    setCheckingLog((l) => [...l, `Finalizing...`, `Diagnostics complete — all systems nominal.`]);
    setStatus("idle");
    push({ id: crypto.randomUUID(), text: "System check complete — no issues found." });
    notify("System Check Complete", "All systems nominal.");
    setTimeout(() => {
      setCheckingLog([]);
      setCheckingProgress(0);
    }, 3000);
  };

  /* ---------- Hold-to-confirm helpers for Return Home ---------- */
  const startHold = () => {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    holdStartRef.current = Date.now();
    // require 900ms hold
    holdTimer.current = window.setTimeout(() => {
      // confirmed
      triggerReturnHome();
      holdTimer.current = null;
      holdStartRef.current = null;
    }, 900);
  };

  const cancelHold = () => {
    if (holdTimer.current) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
      holdStartRef.current = null;
      push({ id: crypto.randomUUID(), text: "Hold cancelled." });
    }
  };

  /* ---------- Actions Definition for rendering ---------- */
  const actions = [
    {
      Icon: Play,
      label: "Resume Tasks",
      description: "Continue pending activities",
      onClick: handleResume,
      shortcut: "R",
      disabled: status === "running" || status === "checking",
    },
    {
      Icon: Pause,
      label: "Pause All",
      description: "Temporarily stop operations",
      onClick: handlePause,
      shortcut: "P",
      disabled: status === "paused" || status === "checking",
    },
    {
      Icon: Home,
      label: "Return Home",
      description: "Navigate to charging station (hold to confirm)",
      // note: onClick isn't immediate — controlled by hold-to-confirm
      onClick: triggerReturnHome,
      shortcut: "H",
      disabled: status === "docking" || status === "checking",
      longPress: true,
    },
    {
      Icon: Power,
      label: "System Check",
      description: "Run diagnostics",
      onClick: runSystemCheck,
      shortcut: "S",
      disabled: status === "checking",
    },
  ];

  /* ---------- Render ---------- */
  return (
    <div className="glass rounded-2xl p-6 w-full max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-extralight tracking-wide mb-1">Quick Actions</h2>
          <p className="text-sm text-muted-foreground">
            System status:{" "}
            <span className="font-medium capitalize">
              {status}
            </span>
            {status === "checking" && ` — ${checkingProgress}%`}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <button
            className="text-xs px-3 py-1 rounded-md bg-foreground/6 hover:bg-foreground/10"
            onClick={() => {
              requestNotificationPermission();
              push({ id: crypto.randomUUID(), text: "Notification permission requested." });
            }}
            aria-label="Request notifications permission"
          >
            Enable Notifications
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {actions.map((action) => {
          const Icon = action.Icon;
          const disabled = action.disabled;
          const longPress = (action as any).longPress;

          return (
            <button
              key={action.label}
              onClick={(e) => {
                if (disabled) {
                  push({ id: crypto.randomUUID(), text: `${action.label} is not available right now.` });
                  return;
                }
                if (longPress) {
                  // start hold if click/touch
                  startHold();
                } else {
                  action.onClick();
                }
              }}
              onMouseDown={() => {
                if (longPress && !disabled) startHold();
              }}
              onMouseUp={() => {
                if (longPress) cancelHold();
              }}
              onMouseLeave={() => {
                if (longPress) cancelHold();
              }}
              onTouchStart={() => {
                if (longPress && !disabled) startHold();
              }}
              onTouchEnd={() => {
                if (longPress) cancelHold();
              }}
              disabled={disabled}
              aria-pressed={status === "running" && action.label === "Resume Tasks"}
              className={`glass-strong rounded-xl p-5 text-left transition-transform transform-gpu hover:scale-[1.01] active:scale-[0.99] group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground/20 ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-foreground/6 group-hover:bg-foreground/8">
                  <Icon className="w-6 h-6 stroke-[1.5] opacity-60" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-medium">{action.label}</h3>
                    <div className="text-xs text-muted-foreground">{action.shortcut}</div>
                  </div>
                  <p className="text-xs font-light opacity-70 mt-1">{action.description}</p>

                  {/* show small state / hint */}
                  {action.label === "Pause All" && status === "paused" && (
                    <div className="mt-2 text-xs text-amber-600">Paused — tasks are halted</div>
                  )}

                  {action.label === "Resume Tasks" && status === "running" && (
                    <div className="mt-2 text-xs text-emerald-600">Running — tasks continuing</div>
                  )}

                  {action.label === "System Check" && status === "checking" && (
                    <div className="mt-3">
                      <div className="h-2 w-full bg-foreground/6 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${checkingProgress}%` }}
                        />
                      </div>
                      <div className="text-xs mt-1 text-muted-foreground">{checkingProgress}%</div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Diagnostic modal-like inline output */}
      {status === "checking" && (
        <div className="mt-4 p-3 bg-foreground/4 rounded-md text-sm">
          <div className="font-medium mb-2">Diagnostics</div>
          <div className="flex gap-2 items-center">
            <div className="text-xs">Progress: {checkingProgress}%</div>
            <div className="flex-1 h-2 bg-foreground/6 rounded overflow-hidden">
              <div style={{ width: `${checkingProgress}%` }} className="h-full rounded" />
            </div>
          </div>

          <div className="mt-3 max-h-28 overflow-auto text-xs opacity-90 space-y-1">
            {checkingLog.map((l, idx) => (
              <div key={idx} className="text-[13px]">
                • {l}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="min-w-[220px] px-3 py-2 bg-neutral-900/90 text-white rounded-md shadow-lg flex items-center justify-between gap-3"
            role="status"
          >
            <div className="text-sm">{t.text}</div>
            <div className="flex items-center gap-2">
              {t.undo && (
                <button
                  onClick={() => {
                    t.undo?.();
                    remove(t.id);
                  }}
                  className="text-xs px-2 py-1 rounded-md bg-white/6 hover:bg-white/10"
                >
                  UNDO
                </button>
              )}
              <button
                onClick={() => remove(t.id)}
                className="text-xs px-2 py-1 rounded-md bg-white/6 hover:bg-white/10"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
