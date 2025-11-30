import { ReactNode } from "react";
import { Home, Activity, Heart, LineChart, Stethoscope, Download, Radio, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Activity, label: "Activity", path: "/activity" },
  { icon: Heart, label: "Self-Heal", path: "/self-heal" },
  { icon: LineChart, label: "Kinematics", path: "/kinematics" },
  { icon: Stethoscope, label: "Health", path: "/health" },
  { icon: Download, label: "Updates", path: "/updates" },
  { icon: Radio, label: "Tele-Op", path: "/tele-op" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Sidebar */}
      <aside className="fixed left-4 top-4 bottom-4 w-64 glass rounded-2xl p-6 flex flex-col z-50 hidden lg:flex">
        {/* Logo */}
        <div className="mb-12">
          <h1 className="text-2xl font-extralight tracking-wider">NIMBUS</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-smooth hover:bg-foreground/5"
              activeClassName="bg-foreground/10 font-normal"
            >
              <item.icon className="w-5 h-5 stroke-[1.5]" />
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* spacers + footer */}
        <div className="mt-auto" />
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-4 lg:p-8">
        {/* Top Bar */}
        <header className="glass rounded-2xl p-4 mb-8 flex items-center justify-between">
          <div className="flex-1" />
          
          <div className="flex items-center gap-4 px-6 py-2 glass-strong rounded-full">
            <div className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
            <span className="text-xs font-light tracking-wide">OPERATIONAL</span>
          </div>

          <div className="flex-1 flex items-center justify-end gap-4">
            <span className="text-xs font-light tracking-wide">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <div className="w-8 h-8 rounded-full glass-strong flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-foreground/10" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};
