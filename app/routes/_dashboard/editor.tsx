import { PenTool, MessageSquare, History, Share2, FileText, ArrowRight } from "lucide-react";

export default function Editor() {
  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Collaborative Editor</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Real-time browser-based editing with DOCX compatibility.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 mr-4">
            <div className="h-8 w-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-xs text-white font-medium">JD</div>
            <div className="h-8 w-8 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-xs text-white font-medium">AS</div>
            <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs text-slate-600 font-medium">+2</div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium shadow-sm transition-colors">
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border shadow-sm overflow-hidden flex">
        {/* Document View */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-900 p-8 overflow-y-auto flex justify-center">
          <div className="w-full max-w-3xl bg-white min-h-[1000px] shadow-md p-12 text-slate-900">
            <h1 className="text-2xl font-bold mb-8 text-center">NON-DISCLOSURE AGREEMENT</h1>
            <div className="space-y-6 text-justify font-serif leading-relaxed">
              <p>
                This Non-Disclosure Agreement (the "Agreement") is entered into by and between [Party A] and [Party B] (collectively, the "Parties") for the purpose of preventing the unauthorized disclosure of Confidential Information as defined below.
              </p>
              <p>
                1. <strong>Definition of Confidential Information.</strong> For purposes of this Agreement, "Confidential Information" shall include all information or material that has or could have commercial value or other utility in the business in which Disclosing Party is engaged.
              </p>
              <p className="bg-yellow-100 dark:bg-yellow-900/30 px-1 relative group cursor-pointer border-b-2 border-yellow-400">
                2. <strong>Exclusions from Confidential Information.</strong> Receiving Party's obligations under this Agreement do not extend to information that is: (a) publicly known at the time of disclosure or subsequently becomes publicly known through no fault of the Receiving Party; (b) discovered or created by the Receiving Party before disclosure by Disclosing Party; (c) learned by the Receiving Party through legitimate means other than from the Disclosing Party or Disclosing Party's representatives.
                <span className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 text-yellow-600 bg-yellow-50 p-1 rounded shadow-sm">
                  <MessageSquare className="h-4 w-4" />
                </span>
              </p>
              <p>
                3. <strong>Obligations of Receiving Party.</strong> Receiving Party shall hold and maintain the Confidential Information in strictest confidence for the sole and exclusive benefit of the Disclosing Party.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar (Comments/History) */}
        <div className="w-80 border-l bg-white dark:bg-slate-800 flex flex-col">
          <div className="flex items-center border-b">
            <button className="flex-1 py-3 text-sm font-medium text-blue-600 border-b-2 border-blue-600">Comments</button>
            <button className="flex-1 py-3 text-sm font-medium text-slate-500 hover:text-slate-700">History</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Sarah Legal</span>
                <span className="text-xs text-slate-400">2m ago</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Should we extend the exclusion period to 5 years?</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">John Doe</span>
                <span className="text-xs text-slate-400">1h ago</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Updated section 2 based on previous feedback.</p>
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="relative">
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full pl-4 pr-10 py-2 bg-slate-50 dark:bg-slate-900 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
