import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h1 className="text-2xl font-bold">KontrakPro</h1>
        </div>

        <nav className="px-4 space-y-2">
          <a
            href="/dashboard"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            📊 Dashboard
          </a>
          <a
            href="/contracts"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            📄 Contracts
          </a>
          <a
            href="/workflows"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ⚙️ Workflows
          </a>
          <a
            href="/templates"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            📝 Templates
          </a>
          <a
            href="/analytics"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            📈 Analytics
          </a>
          <a
            href="/settings"
            className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ⚙️ Settings
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}
