"use client";

import React from 'react';

interface CRMAccountFormProps {
  integrationId: string;
  setConnectionStep: (step: number) => void;
}

export const CRMAccountForm: React.FC<CRMAccountFormProps> = ({ integrationId, setConnectionStep }) => {
  return (
    <div>
      <p>CRMAccountForm Placeholder for {integrationId}</p>
      <p>This is a temporary component to allow the build to pass.</p>
      <button onClick={() => setConnectionStep(3)}>Next Step (Placeholder)</button>
    </div>
  );
};