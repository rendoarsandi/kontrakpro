import { FileText, Search, Filter, Download, MoreVertical } from "lucide-react";

export default function Repository() {
  const contracts = [
    { id: "CTR-2024-001", title: "MSA - Acme Corp", type: "MSA", status: "Active", value: "$120,000", date: "2024-03-15" },
    { id: "CTR-2024-002", title: "NDA - Stark Industries", type: "NDA", status: "Active", value: "-", date: "2024-03-14" },
    { id: "CTR-2024-003", title: "SOW - Wayne Enterprises", type: "SOW", status: "Review", value: "$85,000", date: "2024-03-12" },
    { id: "CTR-2024-004", title: "Vendor Agreement - Cyberdyne", type: "Vendor", status: "Expiring", value: "$45,000", date: "2024-03-10" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Repository</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Smart storage with deep search capabilities.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-4 bg-white dark:bg-slate-800/50 p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search contracts, clauses, or metadata..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <Filter className="h-4 w-4" />
          Filters
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-800/50 rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Contract Title</th>
              <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Type</th>
              <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Status</th>
              <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Value</th>
              <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Effective Date</th>
              <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400"></th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-700">
            {contracts.map((contract) => (
              <tr key={contract.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded flex items-center justify-center">
                      <FileText className="h-4 w-4" />
                    </div>
                    {contract.title}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500">{contract.type}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${contract.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                    ${contract.status === 'Review' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                    ${contract.status === 'Expiring' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                  `}>
                    {contract.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{contract.value}</td>
                <td className="px-6 py-4 text-slate-500">{contract.date}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                    <MoreVertical className="h-4 w-4 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
