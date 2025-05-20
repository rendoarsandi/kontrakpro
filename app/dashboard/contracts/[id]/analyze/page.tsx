export const runtime = 'edge';

// app/dashboard/contracts/[id]/analyze/page.tsx

import AnalyzeContractClientComponent from './analyze-contract-client'

export default function AnalyzeContractPage({ params }: { params: { id: string } }) {
  return <AnalyzeContractClientComponent params={params} />;
}
