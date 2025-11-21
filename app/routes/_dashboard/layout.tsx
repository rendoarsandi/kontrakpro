import { Outlet, NavLink } from "react-router";
import {
  LayoutDashboard,
  FileText,
  GitPullRequest,
  PenTool,
  BrainCircuit,
  MousePointerClick,
  BarChart3,
  Settings,
  LogOut
} from "lucide-react";
import { cn } from "~/lib/utils";

export default function DashboardLayout() {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: FileText, label: "Repository", href: "/repository" },
    { icon: GitPullRequest, label: "Workflows", href: "/workflows" },
    { icon: PenTool, label: "Editor", href: "/editor" },
    { icon: BrainCircuit, label: "AI Hub", href: "/ai" },
    { icon: MousePointerClick, label: "Clickwrap", href: "/clickwrap" },
    { icon: BarChart3, label: "Reports", href: "/reports" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1120] flex font-sans text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-[#0F172A] dark:bg-[#020617] border-r border-slate-800 z-50 flex flex-col">
        {/* Logo Area */}
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">KontrakPro</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-sm"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User / Footer */}
        <div className="p-4 border-t border-slate-800/50 bg-[#0F172A] dark:bg-[#020617]">
           <button className="flex items-center w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-colors">
              <Settings className="h-4 w-4" />
              Settings
           </button>
           <button className="flex items-center w-full gap-3 px-3 py-2 mt-1 rounded-lg text-sm font-medium text-red-400/80 hover:bg-red-950/20 hover:text-red-400 transition-colors">
              <LogOut className="h-4 w-4" />
              Sign Out
           </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8 max-w-7xl mx-auto w-full">
        {/* Top Header (Breadcrumbs / Actions placeholder) */}
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-border">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Overview
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Welcome back to your contract command center.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-2">
              <FileText className="h-4 w-4" />
              New Contract
            </button>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
