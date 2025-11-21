import type { Route } from "./+types/index";
import { ArrowUpRight, Clock, FileCheck, AlertTriangle, Sparkles, Activity } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard - KontrakPro" }];
}

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome / Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-lg">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Legal Team</h1>
          <p className="text-blue-100 max-w-2xl">
            You have 5 contracts pending review and 2 workflows awaiting your approval.
            KontrakPro AI has flagged 3 potential risks in the new "Vendor Agreement - Cyberdyne".
          </p>
          <div className="mt-6 flex gap-4">
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Review AI Insights
            </button>
            <button className="bg-blue-500/30 text-white border border-white/20 px-4 py-2 rounded-lg font-medium hover:bg-blue-500/40 transition-colors">
              View Pending Tasks
            </button>
          </div>
        </div>
        {/* Decorative Circle */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              12%
            </span>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Workflows</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">24</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-slate-500">Avg 4.2 days</span>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Pending Approval</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">8</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg flex items-center justify-center">
              <FileCheck className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Executed This Month</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">142</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
              Action Needed
            </span>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Expiring Soon</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">15</p>
        </div>
      </div>

      {/* Recent Activity / Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h2>
            <button className="text-sm text-blue-600 hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {[
              { title: "NDA - Acme Corp", action: "Created by Sales", time: "2 hours ago", icon: "📝" },
              { title: "MSA - TechStart Inc", action: "Approved by Legal", time: "5 hours ago", icon: "✅" },
              { title: "SOW - Global Services", action: "Review Requested", time: "1 day ago", icon: "👀" },
              { title: "Vendor Agreement - Cyberdyne", action: "AI Risk Analysis Complete", time: "1 day ago", icon: "🤖" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="h-10 w-10 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.action}</p>
                </div>
                <span className="ml-auto text-xs text-slate-400">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border shadow-sm p-6">
           <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Tasks</h2>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">5 Pending</span>
          </div>
           <div className="space-y-4">
             {[
               { task: "Review Liability Cap", doc: "MSA - TechStart", due: "Today", priority: "High" },
               { task: "Approve Vendor Onboarding", doc: "Workflow #2411", due: "Tomorrow", priority: "Medium" },
               { task: "Sign NDA", doc: "NDA - Future Corp", due: "Nov 24", priority: "Low" },
             ].map((item, i) => (
                <div key={i} className="p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                     <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{item.task}</h4>
                     <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                       item.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                       item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                       'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                     }`}>
                       {item.priority}
                     </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>{item.doc}</span>
                    <span>Due {item.due}</span>
                  </div>
                </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
