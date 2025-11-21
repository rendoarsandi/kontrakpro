# KontrakPro - Ironclad Clone

Platform manajemen kontrak modern yang dibangun dengan React Router v7 dan Cloudflare Workers, terinspirasi dari Ironclad CLM.

## 📋 Daftar Isi

- [Tentang Project](#tentang-project)
- [Fitur Utama](#fitur-utama)
- [Arsitektur Teknis](#arsitektur-teknis)
- [Rencana Migrasi](#rencana-migrasi)
- [Setup Development](#setup-development)
- [Deployment](#deployment)
- [Roadmap](#roadmap)

---

## 🎯 Tentang Project

**KontrakPro** adalah platform Contract Lifecycle Management (CLM) yang komprehensif, terinspirasi dari Ironclad. Platform ini dirancang untuk mengelola seluruh siklus hidup kontrak dari pembuatan hingga eksekusi, dengan fokus pada otomasi dan AI.

### Perbedaan dari Project Lama

| Aspek | Sebelumnya | Sekarang |
|-------|-----------|----------|
| Framework | Next.js 15 | React Router v7 |
| Runtime | Node.js/Vercel | Cloudflare Workers |
| Database | PostgreSQL/Supabase | Cloudflare D1 (SQLite) |
| Storage | Firebase/Supabase | Cloudflare R2 + KV |
| Real-time | Supabase Realtime | Cloudflare Durable Objects |
| Auth | NextAuth.js/Supabase | Cloudflare Workers Auth + D1 |
| Deployment | Vercel | Cloudflare Pages + Workers |

---

## ✨ Fitur Utama

### 1. **AI-Powered Contract Management**
- **AI Assistant (Jurist Clone)**: Asisten AI untuk drafting, editing, review, summarize, dan translate kontrak
- **Smart Redlining**: Deteksi otomatis perubahan dan saran revisi
- **Risk Analysis**: Analisis risiko kontrak menggunakan AI
- **Auto-tagging**: Deteksi otomatis 150+ properti kontrak (nilai, pihak, tanggal kunci, dll)

### 2. **Repository & Document Management**
- **Centralized Repository**: Penyimpanan terpusat semua kontrak
- **OCR Integration**: Konversi dokumen scan menjadi teks searchable
- **Version Control**: Tracking perubahan dan history lengkap
- **Advanced Search**: Pencarian full-text dengan filter kompleks
- **Document Templates**: Library template kontrak yang customizable

### 3. **Workflow Automation**
- **No-Code Workflow Builder**: Buat workflow tanpa coding
- **Approval Chains**: Routing otomatis untuk approval
- **Auto-notifications**: Email dan notifikasi otomatis
- **Task Management**: Manajemen tugas dan deadline
- **Conditional Logic**: Workflow dengan logika kondisional

### 4. **Collaboration & Review**
- **Real-time Collaboration**: Edit kolaboratif real-time
- **Comment & Annotation**: Komentar inline pada dokumen
- **Side-by-side Comparison**: Bandingkan versi kontrak
- **Internal Notes**: Catatan internal per kontrak
- **Activity Feed**: Timeline aktivitas lengkap

### 5. **E-Signature Integration**
- **Multi-provider Support**: DocuSign, Adobe Sign, HelloSign
- **Embedded Signing**: Sign langsung di platform
- **Audit Trail**: Log lengkap aktivitas signature
- **Certificate Management**: Manajemen sertifikat digital

### 6. **Analytics & Reporting**
- **Contract Dashboard**: Overview portfolio kontrak
- **Custom Reports**: Laporan customizable
- **Value Tracking**: Tracking nilai kontrak
- **Expiry Alerts**: Peringatan renewal dan expiry
- **Performance Metrics**: KPI dan metrics performa

### 7. **Integrations**
- **CRM**: Salesforce, HubSpot
- **Storage**: Dropbox, Google Drive, OneDrive
- **Communication**: Slack, Microsoft Teams
- **Payment**: Stripe integration
- **API Access**: RESTful API lengkap

### 8. **Security & Compliance**
- **Role-based Access Control (RBAC)**: Granular permissions
- **Audit Logging**: Log lengkap semua aktivitas
- **Data Encryption**: Enkripsi at-rest dan in-transit
- **Compliance Tools**: GDPR, SOC 2 compliance tracking
- **Backup & Recovery**: Automated backup system

---

## 🏗 Arsitektur Teknis

### Tech Stack

#### Frontend
- **React Router v7**: Framework fullstack dengan SSR/SSG
- **TypeScript**: Type safety
- **TailwindCSS**: Styling
- **Radix UI**: Component primitives
- **TanStack Query**: Data fetching & caching
- **Zustand**: State management
- **React Hook Form + Zod**: Form handling & validation

#### Backend/Runtime
- **Cloudflare Workers**: Serverless runtime (V8 isolates)
- **Hono**: Lightweight web framework untuk Workers
- **Cloudflare D1**: SQLite database (distributed)
- **Cloudflare R2**: Object storage (S3-compatible)
- **Cloudflare KV**: Key-value store untuk caching
- **Cloudflare Durable Objects**: Stateful coordination & real-time

#### AI/ML
- **Cloudflare AI**: Built-in AI models (Llama, Mistral)
- **Workers AI**: Inference at edge
- **Vectorize**: Vector database untuk semantic search
- **OpenAI API**: Fallback untuk advanced features

#### Authentication & Security
- **Cloudflare Access** (optional): Zero-trust security
- **Custom JWT Auth**: Auth system dengan D1
- **Bcrypt/Argon2**: Password hashing
- **RBAC System**: Role-based permissions

#### Document Processing
- **PDF.js**: PDF rendering
- **TipTap**: Rich text editor
- **Tesseract.js**: OCR processing
- **Diff Algorithm**: Document comparison

#### E-Signature
- **DocuSign API**: Primary provider
- **Adobe Sign API**: Secondary provider
- **Custom Drawing**: Canvas-based signature

---

## 🚀 Rencana Migrasi

### Phase 1: Project Setup & Clean (Week 1)

#### 1.1 Clean Current Project
```bash
# Hapus dependencies lama
- Next.js packages
- Supabase/Firebase SDKs
- Vercel specific packages
- PostgreSQL adapters

# Hapus folders
- app/ (Next.js app directory)
- components/ (akan di-restructure)
- lib/ (akan di-restructure)

# Hapus dokumentasi tidak perlu
- PRD.md
- CUSTOM_DOMAIN_SETUP.md
- SUMMARY.md
- IMPLEMENTATION_GUIDE.md
- plan.md
- DEPLOYMENT_INSTRUCTIONS.md
```

#### 1.2 Setup React Router v7
```bash
# Initialize React Router v7 project
npx create-react-router@latest

# Install core dependencies
npm install react-router@7 @react-router/cloudflare

# Install UI dependencies
npm install @radix-ui/react-* tailwindcss
npm install lucide-react class-variance-authority clsx tailwind-merge

# Install form & validation
npm install react-hook-form zod @hookform/resolvers

# Install data fetching
npm install @tanstack/react-query axios
```

#### 1.3 Setup Cloudflare
```bash
# Install Cloudflare packages
npm install wrangler --save-dev
npm install @cloudflare/workers-types

# Initialize Wrangler
npx wrangler init

# Setup D1 database
npx wrangler d1 create kontrakpro-db

# Setup KV namespace
npx wrangler kv:namespace create "KONTRAKPRO_CACHE"
npx wrangler kv:namespace create "KONTRAKPRO_SESSIONS"

# Setup R2 bucket
npx wrangler r2 bucket create kontrakpro-documents

# Setup Durable Objects
# (Configuration in wrangler.toml)
```

### Phase 2: Database Schema (Week 1-2)

#### 2.1 D1 Schema Design
```sql
-- Users & Organizations
CREATE TABLE organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL, -- admin, legal, viewer
  organization_id TEXT NOT NULL,
  avatar_url TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Contracts
CREATE TABLE contracts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- nda, msa, sow, etc
  status TEXT NOT NULL, -- draft, review, approved, executed, expired
  value REAL,
  currency TEXT,
  start_date INTEGER,
  end_date INTEGER,
  auto_renew INTEGER DEFAULT 0,
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Contract Parties
CREATE TABLE contract_parties (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL, -- counterparty, internal
  created_at INTEGER NOT NULL,
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
);

-- Contract Versions
CREATE TABLE contract_versions (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  document_url TEXT NOT NULL, -- R2 URL
  changes_summary TEXT,
  created_by TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Contract Properties (AI-extracted)
CREATE TABLE contract_properties (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL,
  property_key TEXT NOT NULL,
  property_value TEXT,
  confidence_score REAL,
  extracted_at INTEGER NOT NULL,
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
);

-- Workflows
CREATE TABLE workflows (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL, -- manual, auto, scheduled
  steps TEXT NOT NULL, -- JSON array
  organization_id TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

-- Workflow Instances
CREATE TABLE workflow_instances (
  id TEXT PRIMARY KEY,
  workflow_id TEXT NOT NULL,
  contract_id TEXT NOT NULL,
  status TEXT NOT NULL, -- pending, in_progress, completed, failed
  current_step INTEGER NOT NULL DEFAULT 0,
  started_at INTEGER NOT NULL,
  completed_at INTEGER,
  FOREIGN KEY (workflow_id) REFERENCES workflows(id),
  FOREIGN KEY (contract_id) REFERENCES contracts(id)
);

-- Tasks
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  contract_id TEXT,
  workflow_instance_id TEXT,
  assigned_to TEXT NOT NULL,
  due_date INTEGER,
  status TEXT NOT NULL, -- pending, in_progress, completed
  priority TEXT NOT NULL, -- low, medium, high
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (contract_id) REFERENCES contracts(id),
  FOREIGN KEY (workflow_instance_id) REFERENCES workflow_instances(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Comments
CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  contract_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  parent_id TEXT, -- for threaded comments
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (parent_id) REFERENCES comments(id)
);

-- Audit Logs
CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  changes TEXT, -- JSON
  ip_address TEXT,
  user_agent TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Templates
CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL, -- JSON or HTML
  fields TEXT NOT NULL, -- JSON array of field definitions
  organization_id TEXT NOT NULL,
  created_by TEXT NOT NULL,
  is_public INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX idx_contracts_org ON contracts(organization_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_end_date ON contracts(end_date);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_tasks_due ON tasks(due_date);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
```

#### 2.2 KV Storage Strategy
```
KONTRAKPRO_CACHE:
- user_sessions:{userId}
- contract_cache:{contractId}
- search_cache:{query_hash}
- rate_limit:{ip}:{endpoint}

KONTRAKPRO_SESSIONS:
- session:{sessionId} -> user data
```

#### 2.3 R2 Storage Structure
```
/documents/
  /{organizationId}/
    /contracts/
      /{contractId}/
        /versions/
          /v1.pdf
          /v2.pdf
    /templates/
      /{templateId}.pdf
/avatars/
  /{userId}.jpg
/exports/
  /{exportId}.zip
```

### Phase 3: Core Infrastructure (Week 2-3)

#### 3.1 Folder Structure
```
kontrakpro/
├── app/
│   ├── routes/
│   │   ├── _auth/           # Auth layout
│   │   │   ├── login.tsx
│   │   │   └── signup.tsx
│   │   ├── _dashboard/      # Dashboard layout
│   │   │   ├── route.tsx
│   │   │   ├── contracts/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── new.tsx
│   │   │   │   ├── $id.tsx
│   │   │   │   └── $id.edit.tsx
│   │   │   ├── workflows/
│   │   │   ├── analytics/
│   │   │   ├── templates/
│   │   │   └── settings/
│   │   ├── api/
│   │   │   ├── contracts/
│   │   │   ├── workflows/
│   │   │   ├── ai/
│   │   │   └── webhooks/
│   │   └── index.tsx
│   ├── components/
│   │   ├── ui/              # Radix UI components
│   │   ├── contracts/       # Contract-specific
│   │   ├── workflows/
│   │   └── shared/
│   ├── lib/
│   │   ├── db/              # D1 client & queries
│   │   ├── storage/         # R2 & KV helpers
│   │   ├── auth/            # Auth utilities
│   │   ├── ai/              # AI integrations
│   │   └── utils/
│   ├── workers/
│   │   ├── index.ts         # Main worker
│   │   ├── durable-objects/ # DO classes
│   │   │   ├── collaboration.ts
│   │   │   └── workflow-engine.ts
│   │   └── scheduled/       # Cron jobs
│   ├── root.tsx
│   └── entry.server.tsx
├── public/
├── wrangler.toml
├── drizzle/                 # DB migrations (optional)
├── package.json
└── tsconfig.json
```

#### 3.2 Authentication System
```typescript
// app/lib/auth/session.ts
export async function createSession(userId: string, env: Env) {
  const sessionId = crypto.randomUUID();
  const token = await generateJWT({ userId, sessionId });

  await env.KONTRAKPRO_SESSIONS.put(
    `session:${sessionId}`,
    JSON.stringify({ userId, createdAt: Date.now() }),
    { expirationTtl: 604800 } // 7 days
  );

  return { sessionId, token };
}

export async function validateSession(token: string, env: Env) {
  const payload = await verifyJWT(token);
  const session = await env.KONTRAKPRO_SESSIONS.get(
    `session:${payload.sessionId}`
  );
  return session ? JSON.parse(session) : null;
}
```

#### 3.3 Database Layer (Repository Pattern)
```typescript
// app/lib/db/contracts.repository.ts
export class ContractsRepository {
  constructor(private db: D1Database) {}

  async findById(id: string) {
    return await this.db
      .prepare('SELECT * FROM contracts WHERE id = ?')
      .bind(id)
      .first();
  }

  async create(data: CreateContractDTO) {
    // Implementation
  }

  async update(id: string, data: UpdateContractDTO) {
    // Implementation
  }
}
```

### Phase 4: Core Features Development (Week 3-6)

#### 4.1 Contract Management (Week 3)
- [ ] Contract CRUD operations
- [ ] Version control system
- [ ] File upload to R2
- [ ] PDF viewer & annotations
- [ ] Search & filtering

#### 4.2 Workflow Engine (Week 4)
- [ ] Workflow builder UI (drag-drop)
- [ ] Durable Object for workflow execution
- [ ] Task assignment & notifications
- [ ] Approval chains
- [ ] Conditional logic

#### 4.3 AI Features (Week 5)
- [ ] Contract analysis dengan Cloudflare AI
- [ ] Auto-tagging & property extraction
- [ ] Risk analysis
- [ ] Smart summarization
- [ ] Translation support

#### 4.4 Collaboration (Week 6)
- [ ] Real-time editing (Durable Objects)
- [ ] Comments & annotations
- [ ] Activity feed
- [ ] Notifications system

### Phase 5: Advanced Features (Week 7-10)

#### 5.1 E-Signature Integration (Week 7)
- [ ] DocuSign SDK integration
- [ ] Adobe Sign integration
- [ ] Signature workflow
- [ ] Certificate storage

#### 5.2 Analytics & Reporting (Week 8)
- [ ] Dashboard dengan charts (Recharts)
- [ ] Custom report builder
- [ ] Export functionality (PDF, Excel)
- [ ] Email reports

#### 5.3 Templates & OCR (Week 9)
- [ ] Template library
- [ ] Template editor
- [ ] OCR integration (Tesseract.js)
- [ ] Searchable document index

#### 5.4 Integrations (Week 10)
- [ ] Webhook system
- [ ] REST API dengan OpenAPI
- [ ] Salesforce integration
- [ ] Slack notifications
- [ ] Google Drive sync

### Phase 6: Testing & Optimization (Week 11-12)

#### 6.1 Testing
- [ ] Unit tests (Vitest)
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] Load testing

#### 6.2 Performance
- [ ] Caching strategy (KV)
- [ ] Query optimization
- [ ] Bundle optimization
- [ ] CDN configuration

#### 6.3 Security
- [ ] Security audit
- [ ] Rate limiting
- [ ] Input validation
- [ ] XSS/CSRF protection

---

## 💻 Setup Development

### Prerequisites
```bash
# Required
- Node.js 18+
- npm/pnpm/yarn
- Wrangler CLI
- Cloudflare account

# Optional
- Docker (untuk local D1 testing)
```

### Installation (Akan dijalankan setelah setup)

```bash
# 1. Clone repository
git clone <repo-url>
cd kontrakpro

# 2. Install dependencies
npm install

# 3. Setup Cloudflare resources
npm run setup:cloudflare

# 4. Initialize database
npm run db:migrate

# 5. Start development server
npm run dev
```

### Environment Variables
```bash
# .dev.vars (local development)
DATABASE_ID=your-d1-database-id
KV_NAMESPACE_ID=your-kv-namespace-id
R2_BUCKET=kontrakpro-documents
OPENAI_API_KEY=your-openai-key
DOCUSIGN_CLIENT_ID=your-docusign-client-id
DOCUSIGN_SECRET=your-docusign-secret
JWT_SECRET=your-jwt-secret
```

---

## 🚢 Deployment

### Cloudflare Pages + Workers

```bash
# Build
npm run build

# Deploy to production
npm run deploy

# Deploy to preview
npm run deploy:preview
```

### Wrangler Configuration
```toml
# wrangler.toml
name = "kontrakpro"
compatibility_date = "2024-01-01"
pages_build_output_dir = "build/client"

[[d1_databases]]
binding = "DB"
database_name = "kontrakpro-db"
database_id = "<your-database-id>"

[[kv_namespaces]]
binding = "CACHE"
id = "<your-kv-id>"

[[kv_namespaces]]
binding = "SESSIONS"
id = "<your-sessions-kv-id>"

[[r2_buckets]]
binding = "DOCUMENTS"
bucket_name = "kontrakpro-documents"

[[durable_objects.bindings]]
name = "COLLABORATION"
class_name = "CollaborationDO"
script_name = "kontrakpro"

[[durable_objects.bindings]]
name = "WORKFLOW_ENGINE"
class_name = "WorkflowEngineDO"
script_name = "kontrakpro"

[ai]
binding = "AI"
```

---

## 🗺 Roadmap

### Q1 2025 - Foundation
- ✅ Project setup & architecture
- ✅ Database schema design
- ⏳ Core contract management
- ⏳ Basic workflow engine
- ⏳ Authentication & authorization

### Q2 2025 - Core Features
- ⏳ AI-powered analysis
- ⏳ Real-time collaboration
- ⏳ Template system
- ⏳ E-signature integration
- ⏳ Advanced search

### Q3 2025 - Advanced Features
- ⏳ Analytics dashboard
- ⏳ OCR & document processing
- ⏳ Third-party integrations
- ⏳ Mobile responsive design
- ⏳ Multi-language support

### Q4 2025 - Scale & Polish
- ⏳ Performance optimization
- ⏳ Advanced AI features
- ⏳ Enterprise features (SSO, SAML)
- ⏳ Compliance certifications
- ⏳ API v2

---

## 📚 Resources

### Documentation
- [React Router v7 Docs](https://reactrouter.com/en/main)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Docs](https://developers.cloudflare.com/d1/)
- [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)

### Inspiration
- [Ironclad](https://ironcladapp.com/) - Primary inspiration
- [DocuSign](https://www.docusign.com/) - E-signature reference
- [PandaDoc](https://www.pandadoc.com/) - Document workflow reference

---

## 📝 License

MIT License - See LICENSE file

---

## 👥 Contributing

Contributions are welcome! Please read CONTRIBUTING.md for guidelines.

---

## 🆘 Support

For questions and support:
- GitHub Issues
- Email: support@kontrakpro.com
- Discord: [Join our community]

---

**Status**: 🚧 In Development - Phase 1 (Setup)

**Last Updated**: November 21, 2025
