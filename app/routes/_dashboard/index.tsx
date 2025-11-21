import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard - KontrakPro" }];
}

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Total Contracts</h3>
          <p className="text-3xl font-bold">142</p>
          <p className="text-green-600 text-sm mt-2">↑ 12% from last month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Pending Approvals</h3>
          <p className="text-3xl font-bold">23</p>
          <p className="text-yellow-600 text-sm mt-2">8 urgent</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Expiring Soon</h3>
          <p className="text-3xl font-bold">15</p>
          <p className="text-red-600 text-sm mt-2">Next 30 days</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Contract Value</h3>
          <p className="text-3xl font-bold">$2.4M</p>
          <p className="text-blue-600 text-sm mt-2">Active contracts</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="font-medium">New contract created</p>
              <p className="text-sm text-gray-500">NDA - Acme Corp</p>
            </div>
            <span className="text-sm text-gray-400">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="font-medium">Contract approved</p>
              <p className="text-sm text-gray-500">MSA - TechStart Inc</p>
            </div>
            <span className="text-sm text-gray-400">5 hours ago</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Review requested</p>
              <p className="text-sm text-gray-500">SOW - Global Services</p>
            </div>
            <span className="text-sm text-gray-400">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
