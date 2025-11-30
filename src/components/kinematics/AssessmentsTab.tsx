export const AssessmentsTab = () => {
  const tasks = [
    { task: "Fold laundry", location: "Bedroom", time: "12:45 PM", confidence: 94, quality: 91, status: "Satisfied" },
    { task: "Sweep floor", location: "Kitchen", time: "11:20 AM", confidence: 88, quality: 85, status: "Satisfied" },
    { task: "Organize books", location: "Study", time: "10:05 AM", confidence: 76, quality: 72, status: "Retry recommended" },
    { task: "Clean windows", location: "Living Room", time: "09:15 AM", confidence: 82, quality: 88, status: "Satisfied" },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="glass rounded-xl p-6">
          <p className="text-xs font-light opacity-60 mb-2">AVG SCORE</p>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="3" />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${2 * Math.PI * 28 * 0.85} ${2 * Math.PI * 28}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-light">85</div>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <p className="text-xs font-light opacity-60 mb-2">COMPLETION RATE</p>
          <p className="text-2xl font-extralight mb-2">92%</p>
          <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
            <div className="h-full bg-foreground/40" style={{ width: "92%" }} />
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <p className="text-xs font-light opacity-60 mb-2">TOTAL TASKS</p>
          <p className="text-2xl font-extralight">127</p>
          <p className="text-xs opacity-40 mt-1">This month</p>
        </div>
      </div>

      {/* Task Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/10">
              <th className="text-left p-4 text-xs font-light opacity-60 tracking-wide">TASK</th>
              <th className="text-left p-4 text-xs font-light opacity-60 tracking-wide">LOCATION</th>
              <th className="text-left p-4 text-xs font-light opacity-60 tracking-wide">TIME</th>
              <th className="text-left p-4 text-xs font-light opacity-60 tracking-wide">CONFIDENCE</th>
              <th className="text-left p-4 text-xs font-light opacity-60 tracking-wide">QUALITY</th>
              <th className="text-left p-4 text-xs font-light opacity-60 tracking-wide">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, i) => (
              <tr key={i} className="border-b border-border/5 hover:bg-foreground/3 transition-smooth">
                <td className="p-4 text-sm font-light">{task.task}</td>
                <td className="p-4 text-sm font-light opacity-60">{task.location}</td>
                <td className="p-4 text-sm font-light opacity-60">{task.time}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-foreground/40"
                        style={{ width: `${task.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs opacity-60">{task.confidence}%</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-foreground/40"
                        style={{ width: `${task.quality}%` }}
                      />
                    </div>
                    <span className="text-xs opacity-60">{task.quality}%</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-xs glass-strong px-3 py-1 rounded-full">{task.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
