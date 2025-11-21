import { BrainCircuit, Sparkles, AlertTriangle, CheckCircle, FileSearch } from "lucide-react";

export default function AIHub() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-purple-600" />
          AI Hub
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Advanced legal intelligence for analysis, redlining, and playbook enforcement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feature Card: Playbooks */}
        <div className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-800 rounded-xl border p-6 shadow-sm">
          <div className="h-10 w-10 bg-purple-600 text-white rounded-lg flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold mb-2">AI Playbooks</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
            "Teach" the AI your company policies. Automatically flag non-compliant clauses in incoming vendor paper.
          </p>
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border text-sm space-y-2">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>Standard Payment Terms (Net 30)</span>
            </div>
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-4 w-4" />
              <span>Unlimited Liability Detected</span>
            </div>
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-4 w-4" />
              <span>Missing IP Indemnification</span>
            </div>
          </div>
        </div>

        {/* Feature Card: Data Extraction */}
        <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-slate-800 rounded-xl border p-6 shadow-sm">
          <div className="h-10 w-10 bg-blue-600 text-white rounded-lg flex items-center justify-center mb-4">
            <FileSearch className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold mb-2">Smart Extraction</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
            Turn PDF scans into structured data. Automatically identifying parties, dates, and value.
          </p>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-white dark:bg-slate-900 rounded border text-sm">
              <span className="text-slate-500">Effective Date</span>
              <span className="font-mono font-medium bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded text-blue-700 dark:text-blue-300">2024-04-01</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white dark:bg-slate-900 rounded border text-sm">
              <span className="text-slate-500">Total Value</span>
              <span className="font-mono font-medium bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded text-blue-700 dark:text-blue-300">$1,250,000</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white dark:bg-slate-900 rounded border text-sm">
              <span className="text-slate-500">Renewal</span>
              <span className="font-mono font-medium bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded text-blue-700 dark:text-blue-300">Auto-renew</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat / Interaction Placeholder */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Legal Assistant</h3>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 h-64 border mb-4 flex flex-col justify-end">
            <div className="self-end bg-blue-600 text-white px-4 py-2 rounded-lg rounded-tr-none mb-2 max-w-md">
                Summarize the indemnification clause in the uploaded MSA.
            </div>
            <div className="self-start bg-white dark:bg-slate-800 border text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg rounded-tl-none max-w-lg shadow-sm">
                The indemnification clause requires the Vendor to indemnify the Client against third-party claims related to IP infringement. However, it currently lacks a cap on liability, which is a deviation from your standard playbook (Cap: 2x Contract Value).
            </div>
        </div>
        <div className="flex gap-2">
            <input type="text" placeholder="Ask AI about your contracts..." className="flex-1 px-4 py-2 border rounded-md bg-white dark:bg-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
            <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors">
                Ask
            </button>
        </div>
      </div>
    </div>
  );
}
