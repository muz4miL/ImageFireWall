import React, { useState } from "react";
import {
  Moon,
  Sun,
  FolderPlus,
  FolderClock,
  ScrollText,
  Users,
} from "lucide-react";
import { TrustDashboard } from "./components/dashboard/TrustDashboard";
import appLogo from "./assets/logo.png";
import profilePhoto from "./assets/profile.jpg";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const menuItems = [
    { id: "new-case", label: "New Case", icon: FolderPlus, active: true },
    { id: "history", label: "Case History", icon: FolderClock, active: false },
    { id: "audit", label: "Audit Logs", icon: ScrollText, active: false },
    { id: "team", label: "Team Settings", icon: Users, active: false },
  ];

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="flex min-h-screen w-full transition-colors duration-300 bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100">
        {/* Sidebar */}
        <aside className="fixed left-0 top-0 h-screen w-60 border-r border-slate-200 bg-white/70 backdrop-blur-xl shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:backdrop-blur-none flex flex-col z-20">
          {/* Logo */}
          <div className="flex items-center gap-4 px-6 py-5 border-b border-slate-200 dark:border-slate-800">
            <img
              src={appLogo}
              alt="Axiom Forensics"
              className="h-14 w-14 object-contain drop-shadow-md dark:drop-shadow-[0_0_18px_rgba(6,182,212,0.28)]"
              draggable={false}
            />
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Axiom Forensics
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Medical Firewall
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() =>
                    !item.active && console.log(`Clicked: ${item.label}`)
                  }
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                    item.active
                      ? "bg-blue-50 text-blue-700 shadow-sm dark:bg-cyan-950/50 dark:text-cyan-400"
                      : "text-slate-500 hover:bg-white/40 hover:backdrop-blur-md hover:border hover:border-white/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:text-blue-600 dark:text-slate-500 dark:hover:bg-slate-800/40 dark:hover:backdrop-blur-md dark:hover:border dark:hover:border-cyan-500/20 dark:hover:shadow-[0_4px_20px_rgba(6,182,212,0.1)] dark:hover:text-cyan-400"
                  }`}
                >
                  <Icon size={18} />
                  <span className="tracking-tight">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-full border-2 border-slate-100 bg-white shadow-sm overflow-hidden flex items-center justify-center dark:border-slate-700 dark:bg-slate-900">
                <img
                  src={profilePhoto}
                  alt="Dr. Shiraz"
                  className="w-full h-full object-contain p-1"
                  draggable={false}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  Dr. Shiraz
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Radiologist
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 ml-60 relative overflow-hidden">
          {/* Background Grid & Effects */}
          <div className="fixed inset-0 ml-60 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-slate-900 dark:via-[#0B1120] dark:to-black" />
          <div className="fixed inset-0 ml-60 -z-5 pointer-events-none dark:bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]" />
          <div
            className="fixed inset-0 ml-60 -z-10 pointer-events-none opacity-5 dark:block hidden"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6, 182, 212, 0.03) 2px, rgba(6, 182, 212, 0.03) 4px)",
            }}
          />

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={() => setIsDarkMode((v) => !v)}
            className="fixed top-6 right-6 z-10 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white/90 px-4 py-2 text-sm font-medium shadow-md backdrop-blur hover:bg-white transition-all dark:border-cyan-900 dark:bg-black/80 dark:text-cyan-100 dark:shadow-[0_0_10px_rgba(6,182,212,0.3)] dark:hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]"
          >
            {isDarkMode ? (
              <Sun size={16} className="text-blue-600 dark:text-cyan-400" />
            ) : (
              <Moon size={16} className="text-blue-600 dark:text-cyan-400" />
            )}
            {isDarkMode ? "Light" : "Dark"}
          </button>

          {/* Dashboard Content */}
          <TrustDashboard />
        </div>
      </div>
    </div>
  );
}
