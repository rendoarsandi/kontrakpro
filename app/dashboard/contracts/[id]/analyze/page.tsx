// app/dashboard/contracts/[id]/analyze/page.tsx

import AnalyzeContractClientComponent from './analyze-contract-client'

// This function tells Next.js which paths to pre-render for this dynamic route.
export async function generateStaticParams() {
  // Fetch all possible contract IDs here.
  // This is just an example, you'll need to replace it with your actual data fetching logic.
  // For example, if you fetch contracts from an API:
  // const contracts = await fetch('https://your-api.com/contracts').then((res) => res.json());
  // return contracts.map((contract) => ({
  //   id: contract.id.toString(), // Ensure id is a string
  // }));

  // For now, let's return a placeholder if you don't have the data fetching logic ready
  // This will generate a page for /dashboard/contracts/1/analyze, /dashboard/contracts/2/analyze, etc.
  // Replace with your actual IDs.
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

export default function AnalyzeContractPage({ params }: { params: { id: string } }) {
  return <AnalyzeContractClientComponent params={params} />;
}
