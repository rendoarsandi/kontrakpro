-- Users Table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Organizations Table
CREATE TABLE organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Contracts Table
CREATE TABLE contracts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  type TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  organization_id TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES users(id),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Contract Versions Table
CREATE TABLE contract_versions (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  created_by TEXT NOT NULL,
  FOREIGN KEY (contract_id) REFERENCES contracts(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Workflows Table
CREATE TABLE workflows (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (contract_id) REFERENCES contracts(id)
);

-- Workflow Steps Table
CREATE TABLE workflow_steps (
  id TEXT PRIMARY KEY,
  workflow_id TEXT NOT NULL,
  step_number INTEGER NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  assignee_id TEXT,
  completed_at INTEGER,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (workflow_id) REFERENCES workflows(id),
  FOREIGN KEY (assignee_id) REFERENCES users(id)
);

-- Comments Table
CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (contract_id) REFERENCES contracts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Documents Table (metadata for R2 storage)
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  r2_key TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (contract_id) REFERENCES contracts(id),
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- CRM Integrations Table
CREATE TABLE crm_integrations (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  config TEXT NOT NULL,
  last_sync_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Audit Log Table
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  details TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_contracts_owner ON contracts(owner_id);
CREATE INDEX idx_contracts_organization ON contracts(organization_id);
CREATE INDEX idx_contract_versions_contract ON contract_versions(contract_id);
CREATE INDEX idx_workflows_contract ON workflows(contract_id);
CREATE INDEX idx_workflow_steps_workflow ON workflow_steps(workflow_id);
CREATE INDEX idx_comments_contract ON comments(contract_id);
CREATE INDEX idx_documents_contract ON documents(contract_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- E-Signature Tables
CREATE TABLE e_signature_requests (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL,
  status TEXT NOT NULL, -- pending, sent, completed, voided
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (contract_id) REFERENCES contracts(id)
);

CREATE TABLE e_signature_signers (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL,
  user_id TEXT, -- Can be null if signer is external
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL, -- pending, signed, declined
  signed_at INTEGER,
  signed_document_key TEXT, -- R2 key for the signed document
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (request_id) REFERENCES e_signature_requests(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_e_signature_requests_contract ON e_signature_requests(contract_id);
CREATE INDEX idx_e_signature_signers_request ON e_signature_signers(request_id);
