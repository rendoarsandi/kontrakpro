"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function ContractsPage() {
  // Placeholder data - replace with actual data fetching
  const contracts = [
    { id: "1", name: "Contract Alpha", status: "Active", endDate: "2024-12-31" },
    { id: "2", name: "Contract Beta", status: "Pending", endDate: "2025-06-30" },
    { id: "3", name: "Contract Gamma", status: "Expired", endDate: "2023-01-15" },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contracts</h1>
        <Button asChild>
          <Link href="/dashboard/create">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Contract
          </Link>
        </Button>
      </div>

      {contracts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contracts.map((contract) => (
            <Card key={contract.id}>
              <CardHeader>
                <CardTitle>
                  <Link href={`/dashboard/contracts/${contract.id}`} className="hover:underline">
                    {contract.name}
                  </Link>
                </CardTitle>
                <CardDescription>Status: {contract.status}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  End Date: {new Date(contract.endDate).toLocaleDateString()}
                </p>
                <Button variant="outline" size="sm" className="mt-4" asChild>
                  <Link href={`/dashboard/contracts/${contract.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Contracts Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You don't have any contracts yet. Get started by creating one.
            </p>
            <Button asChild>
              <Link href="/dashboard/create">
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Contract
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
