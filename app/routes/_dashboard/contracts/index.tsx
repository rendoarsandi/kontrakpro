import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Contracts - KontrakPro" }];
}

export default function Contracts() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Contracts</h1>
        <a
          href="/contracts/new"
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          + New Contract
        </a>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Search contracts..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Expiry
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
              <td className="px-6 py-4">NDA - Acme Corporation</td>
              <td className="px-6 py-4">NDA</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Active
                </span>
              </td>
              <td className="px-6 py-4">$50,000</td>
              <td className="px-6 py-4">Dec 31, 2025</td>
            </tr>
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
              <td className="px-6 py-4">MSA - TechStart Inc</td>
              <td className="px-6 py-4">MSA</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Review
                </span>
              </td>
              <td className="px-6 py-4">$250,000</td>
              <td className="px-6 py-4">Mar 15, 2026</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
