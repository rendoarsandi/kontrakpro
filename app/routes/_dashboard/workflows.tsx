import { GitPullRequest, Plus, ArrowRight, Clock, Users } from "lucide-react";

export default function Workflows() {
  const workflows = [
    { id: 1, name: "Standard NDA Approval", trigger: "Value > $0", steps: 3, active: 12 },
    { id: 2, name: "High Value MSA Review", trigger: "Value > $50k", steps: 5, active: 4 },
    { id: 3, name: "Vendor Onboarding", trigger: "Manual", steps: 4, active: 8 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Workflow Designer</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Automate approval chains and business logic without coding.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium shadow-sm transition-colors">
          <Plus className="h-4 w-4" />
          New Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {workflows.map((wf) => (
          <div key={wf.id} className="bg-white dark:bg-slate-800/50 rounded-xl border p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg flex items-center justify-center">
                <GitPullRequest className="h-5 w-5" />
              </div>
              <span className="px-2.5 py-0.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">
                Active
              </span>
            </div>

            <h3 className="font-semibold text-lg mb-1">{wf.name}</h3>
            <p className="text-sm text-slate-500 mb-4">Trigger: {wf.trigger}</p>

            <div className="flex items-center justify-between text-sm text-slate-500 border-t pt-4">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {wf.steps} Steps
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {wf.active} In Progress
              </div>
            </div>

            <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">
              Edit Workflow
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Canvas Placeholder */}
      <div className="mt-8 bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <GitPullRequest className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Workflow Canvas</h3>
          <p className="text-slate-500">
            This is where the drag-and-drop workflow builder will live. Visualize approval chains, logic gates, and automated actions.
          </p>
        </div>
      </div>
    </div>
  );
}
