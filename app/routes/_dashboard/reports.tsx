import { BarChart3, TrendingUp, PieChart, Calendar, Download } from "lucide-react";

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          Reports & Analytics
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Deep insights into your contract portfolio and team performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border shadow-sm">
            <h3 className="text-sm text-slate-500 mb-1">Avg. Cycle Time</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">4.2 Days</p>
            <span className="text-xs text-green-600 flex items-center mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                -12% vs last month
            </span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border shadow-sm">
            <h3 className="text-sm text-slate-500 mb-1">Active Contracts</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">1,240</p>
            <span className="text-xs text-blue-600 flex items-center mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5% growth
            </span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border shadow-sm">
            <h3 className="text-sm text-slate-500 mb-1">Expiring (30 Days)</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">15</p>
            <span className="text-xs text-yellow-600 flex items-center mt-2">
                Action needed
            </span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border shadow-sm">
            <h3 className="text-sm text-slate-500 mb-1">Value at Risk</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">$2.1M</p>
            <span className="text-xs text-slate-400 flex items-center mt-2">
                Pending renewal
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placeholder Chart 1 */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border shadow-sm h-80 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold">Contract Volume by Type</h3>
                <button className="p-2 hover:bg-slate-100 rounded-full"><Download className="h-4 w-4 text-slate-400" /></button>
            </div>
            <div className="flex-1 flex items-end justify-around gap-2 pb-4 border-b border-slate-100 dark:border-slate-700">
                {/* Fake Bar Chart */}
                <div className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-md h-[60%] relative group">
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">NDA</div>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-800/30 rounded-t-md h-[40%] relative group">
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">MSA</div>
                </div>
                <div className="w-full bg-blue-300 dark:bg-blue-700/30 rounded-t-md h-[80%] relative group">
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">SOW</div>
                </div>
                <div className="w-full bg-blue-400 dark:bg-blue-600/30 rounded-t-md h-[30%] relative group">
                     <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">Vendor</div>
                </div>
                <div className="w-full bg-blue-500 dark:bg-blue-500/30 rounded-t-md h-[50%] relative group">
                     <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">Other</div>
                </div>
            </div>
            <div className="flex justify-around text-xs text-slate-500 pt-2">
                <span>NDA</span><span>MSA</span><span>SOW</span><span>Vendor</span><span>Other</span>
            </div>
        </div>

        {/* Placeholder Chart 2 */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border shadow-sm h-80">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold">Workflow Bottlenecks</h3>
                <select className="text-sm border rounded p-1 bg-transparent">
                    <option>Last 30 Days</option>
                </select>
            </div>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span>Legal Review</span>
                        <span className="font-medium">3.5 days</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 w-[80%]"></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span>Finance Approval</span>
                        <span className="font-medium">1.2 days</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 w-[30%]"></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span>Signature</span>
                        <span className="font-medium">0.5 days</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[15%]"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
