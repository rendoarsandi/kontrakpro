import { MousePointerClick, CheckSquare, Globe, Code, ShieldCheck } from "lucide-react";

export default function Clickwrap() {
  const agreements = [
    { id: 1, name: "Terms of Service v2.1", location: "Signup Page", acceptances: "12,450", lastUpdated: "2 days ago" },
    { id: 2, name: "Privacy Policy v1.5", location: "Footer / Signup", acceptances: "12,200", lastUpdated: "2 weeks ago" },
    { id: 3, name: "Beta Access Agreement", location: "Beta Portal", acceptances: "850", lastUpdated: "1 month ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <MousePointerClick className="h-8 w-8 text-blue-600" />
          Clickwrap
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Manage one-click digital agreements and audit trails.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Total Acceptances</h3>
            <p className="text-2xl font-bold mt-2">25,500</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Active Agreements</h3>
            <p className="text-2xl font-bold mt-2">5</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border shadow-sm">
            <h3 className="text-sm font-medium text-slate-500">Audit Coverage</h3>
            <p className="text-2xl font-bold mt-2 text-green-600">100%</p>
          </div>
        </div>

        {/* Agreements List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="font-semibold text-lg">Active Agreements</h3>
          </div>
          <div className="divide-y">
            {agreements.map((item) => (
              <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-500">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">{item.name}</h4>
                    <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                      <Code className="h-3 w-3" />
                      {item.location}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{item.acceptances}</p>
                  <p className="text-xs text-slate-500">acceptances</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Code Snippet / Integration */}
        <div className="bg-slate-900 text-slate-300 rounded-xl border border-slate-800 p-6 font-mono text-sm shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-white border-b border-slate-800 pb-4">
            <Code className="h-4 w-4" />
            <span>Integration Snippet</span>
          </div>
          <div className="space-y-2">
            <p><span className="text-purple-400">const</span> <span className="text-blue-400">clickwrap</span> = <span className="text-yellow-300">new</span> <span className="text-green-400">KontrakPro</span>.Clickwrap({`{`}</p>
            <p className="pl-4"><span className="text-blue-300">siteId</span>: <span className="text-orange-300">"kp_live_12345"</span>,</p>
            <p className="pl-4"><span className="text-blue-300">agreement</span>: <span className="text-orange-300">"terms-v2"</span>,</p>
            <p className="pl-4"><span className="text-blue-300">user</span>: user.id</p>
            <p>{`}`});</p>
            <p className="mt-4 text-slate-500">// Automatically renders checkbox and tracks acceptance</p>
          </div>
          <button className="w-full mt-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-center font-sans font-medium transition-colors">
            View Documentation
          </button>
        </div>
      </div>
    </div>
  );
}
