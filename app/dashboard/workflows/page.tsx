 "use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WorkflowsPage() {
  // Placeholder data for workflows
  const workflows = [
    { id: "wf1", name: "Standard Approval Workflow", status: "Active" },
    { id: "wf2", name: "Legal Review Workflow", status: "Draft" },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Workflows</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/dashboard/workflows/builder">Create New Workflow</Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="rounded-lg border p-4 shadow-sm">
            <h3 className="text-lg font-semibold">{workflow.name}</h3>
            <p className="text-sm text-gray-500">Status: {workflow.status}</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm">
                View
              </Button>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}