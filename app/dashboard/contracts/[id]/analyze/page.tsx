export const runtime = 'edge';

// app/dashboard/contracts/[id]/analyze/page.tsx

import AnalyzeContractClientComponent from './analyze-contract-client'

interface AnalyzeContractPageProps {
  params: {
    id: string;
  };
}

export default function AnalyzeContractPage({ params }: AnalyzeContractPageProps) {
  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">AI Analysis for Contract {params.id}</h1>
      <div className="flex-1">
        {/*
          This client component will handle fetching and displaying the AI analysis.
          We pass the contract ID to it.
        */}
        <AnalyzeContractClientComponent contractId={params.id} />
      </div>
    </div>
  );
}