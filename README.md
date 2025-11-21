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
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'legal', 'viewer')), -- admin, legal, viewer
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
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
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
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (workflow_instance_id) REFERENCES workflow_instances(id) ON DELETE CASCADE,
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

## 🎨 UI/UX Design System - Ironclad Inspired

### Design Principles

KontrakPro mengadopsi design principles dari Ironclad dengan fokus pada:
- **Clarity First**: Informasi kontrak yang jelas dan mudah dipahami
- **Efficiency**: Minimal clicks untuk complete tasks
- **Progressive Disclosure**: Show complexity only when needed
- **Consistency**: Unified experience across all modules
- **Accessibility**: WCAG 2.1 AA compliant

### Color System

```css
Primary Colors:
- Primary: #1a1a1a (Black) - CTA buttons, primary actions
- Secondary: #6366f1 (Indigo) - Links, secondary actions
- Success: #10b981 (Green) - Approved, active, success states
- Warning: #f59e0b (Amber) - Pending, review needed
- Danger: #ef4444 (Red) - Rejected, expired, errors
- Info: #3b82f6 (Blue) - Information, notices

Neutral Colors:
- Gray 50-900: Base UI elements
- White/Black: Text and backgrounds

Semantic Colors:
- Contract Status: Green (active), Yellow (review), Red (expired), Gray (draft)
- Priority: Red (high), Orange (medium), Blue (low)
- Workflow State: Blue (pending), Yellow (in-progress), Green (completed)
```

### Typography

```
Font Family:
- Primary: Inter (Google Fonts)
- Monospace: JetBrains Mono (for code/legal text)

Font Scales:
- Display: 48px/60px (Hero sections)
- H1: 36px/44px (Page titles)
- H2: 30px/38px (Section headers)
- H3: 24px/32px (Subsection headers)
- H4: 20px/28px (Card titles)
- Body: 16px/24px (Default text)
- Small: 14px/20px (Metadata, captions)
- XSmall: 12px/16px (Labels, badges)

Font Weights:
- Regular: 400 (Body text)
- Medium: 500 (Emphasis)
- Semibold: 600 (Headings)
- Bold: 700 (Strong emphasis)
```

### Spacing System

```
Based on 4px baseline:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px
- 4xl: 96px
```

### Component Library (Radix UI Based)

#### 1. **Buttons**
```tsx
// Primary button - Main actions
<Button variant="primary">Create Contract</Button>

// Secondary button - Alternative actions
<Button variant="secondary">Cancel</Button>

// Outline button - Tertiary actions
<Button variant="outline">View Details</Button>

// Ghost button - Minimal emphasis
<Button variant="ghost">Skip</Button>

// Destructive button - Delete/remove actions
<Button variant="destructive">Delete Contract</Button>

// Icon button - Compact actions
<Button variant="icon"><Icon name="edit" /></Button>

// Loading state
<Button loading>Saving...</Button>

// Disabled state
<Button disabled>Submit</Button>

Sizes: xs, sm, md (default), lg, xl
```

#### 2. **Forms & Inputs**
```tsx
// Text input with validation
<Input
  label="Contract Title"
  placeholder="Enter contract title"
  error="Title is required"
  helperText="Max 255 characters"
/>

// Select dropdown
<Select
  label="Contract Type"
  options={[
    { value: 'nda', label: 'NDA' },
    { value: 'msa', label: 'MSA' },
    { value: 'sow', label: 'SOW' },
  ]}
/>

// Multi-select with search
<MultiSelect
  label="Assign to"
  searchable
  options={users}
/>

// Date picker
<DatePicker
  label="Effective Date"
  minDate={new Date()}
/>

// Rich text editor (TipTap)
<RichTextEditor
  label="Contract Terms"
  placeholder="Enter contract terms..."
  features={['bold', 'italic', 'list', 'link', 'table']}
/>

// File upload (Dropzone)
<FileUpload
  label="Upload Contract"
  accept=".pdf,.docx"
  maxSize={10 * 1024 * 1024} // 10MB
  multiple
/>
```

#### 3. **Data Display**
```tsx
// Table with sorting, filtering, pagination
<DataTable
  columns={[
    { key: 'title', label: 'Title', sortable: true },
    { key: 'status', label: 'Status', filterable: true },
    { key: 'value', label: 'Value', sortable: true, format: 'currency' },
    { key: 'expiry', label: 'Expiry', sortable: true, format: 'date' },
  ]}
  data={contracts}
  pagination={{ pageSize: 25 }}
  onRowClick={(row) => navigate(`/contracts/${row.id}`)}
/>

// Card container
<Card>
  <CardHeader>
    <CardTitle>Contract Details</CardTitle>
    <CardDescription>NDA - Acme Corp</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  <CardFooter>
    <Button>Edit</Button>
  </CardFooter>
</Card>

// Badge/Status indicator
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Expired</Badge>

// Avatar with fallback
<Avatar
  src={user.avatar}
  fallback={user.initials}
  size="lg"
/>

// Progress indicator
<Progress value={65} max={100} />

// Stat card
<StatCard
  label="Total Contracts"
  value={142}
  change={+12}
  trend="up"
  period="vs last month"
/>
```

#### 4. **Navigation**
```tsx
// Sidebar navigation
<Sidebar>
  <SidebarHeader>
    <Logo />
  </SidebarHeader>
  <SidebarNav>
    <NavItem icon="dashboard" to="/dashboard">Dashboard</NavItem>
    <NavItem icon="file" to="/contracts" badge={23}>Contracts</NavItem>
    <NavItem icon="workflow" to="/workflows">Workflows</NavItem>
  </SidebarNav>
  <SidebarFooter>
    <UserMenu />
  </SidebarFooter>
</Sidebar>

// Breadcrumbs
<Breadcrumbs>
  <BreadcrumbItem to="/dashboard">Dashboard</BreadcrumbItem>
  <BreadcrumbItem to="/contracts">Contracts</BreadcrumbItem>
  <BreadcrumbItem>NDA - Acme Corp</BreadcrumbItem>
</Breadcrumbs>

// Tabs
<Tabs defaultValue="details">
  <TabsList>
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="versions">Versions</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
  </TabsList>
  <TabsContent value="details">{/* Content */}</TabsContent>
</Tabs>
```

#### 5. **Feedback & Overlays**
```tsx
// Toast notifications (Sonner)
toast.success('Contract created successfully')
toast.error('Failed to save contract')
toast.loading('Analyzing contract...')
toast.promise(
  analyzeContract(),
  {
    loading: 'Analyzing...',
    success: 'Analysis complete',
    error: 'Analysis failed',
  }
)

// Modal dialog
<Dialog>
  <DialogTrigger>Delete Contract</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogDescription>
        This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

// Popover for contextual info
<Popover>
  <PopoverTrigger>?</PopoverTrigger>
  <PopoverContent>
    This field is automatically extracted from the contract.
  </PopoverContent>
</Popover>

// Tooltip
<Tooltip content="Edit contract">
  <Button variant="icon"><Icon name="edit" /></Button>
</Tooltip>

// Alert banner
<Alert variant="info">
  <AlertIcon />
  <AlertTitle>Contract expiring soon</AlertTitle>
  <AlertDescription>
    This contract expires in 30 days.
  </AlertDescription>
</Alert>
```

### Key User Flows

#### 1. **Contract Creation Flow**
```
Step 1: Choose Method
├─ Upload existing document (PDF/DOCX)
├─ Use template
└─ Start from scratch

Step 2: Extract/Input Information
├─ AI auto-extracts: parties, dates, values, terms
├─ User reviews and edits extracted data
└─ Add custom fields

Step 3: Review & Validation
├─ Check required fields
├─ Validate business rules
└─ AI risk analysis

Step 4: Assign Workflow
├─ Choose approval workflow
├─ Set reviewers/approvers
└─ Configure notifications

Step 5: Create & Route
├─ Create contract record
├─ Start workflow
└─ Notify stakeholders
```

#### 2. **Contract Review Flow**
```
Reviewer receives notification
↓
Opens contract in viewer
↓
Reviews document side-by-side with previous version
↓
Can:
├─ Add comments/annotations
├─ Request changes (with redlining)
├─ Approve with conditions
├─ Reject with reason
└─ Escalate to higher authority
↓
Submit decision
↓
Workflow proceeds to next step or back to requestor
```

#### 3. **Workflow Builder Flow**
```
Step 1: Name & Trigger
├─ Workflow name
├─ Trigger type: Manual, Auto, Scheduled
└─ Trigger conditions

Step 2: Design Steps (Drag & Drop)
├─ Add approval steps
├─ Add review steps
├─ Add conditional branches
├─ Add parallel paths
└─ Add notifications

Step 3: Configure Each Step
├─ Assign users/roles
├─ Set deadlines
├─ Add instructions
└─ Configure escalation

Step 4: Test & Activate
├─ Test with sample contract
├─ Review all paths
└─ Activate workflow
```

#### 4. **AI Analysis Flow**
```
User uploads/selects contract
↓
Click "Analyze with AI"
↓
AI processes document:
├─ Extract parties, dates, values
├─ Identify contract type
├─ Extract key clauses
├─ Detect risks/red flags
├─ Suggest improvements
└─ Calculate risk score
↓
Results displayed in panels:
├─ Overview (confidence scores)
├─ Extracted Properties (editable)
├─ Risk Analysis (with explanations)
├─ Recommendations
└─ Clause Highlights (in-document)
↓
User can:
├─ Accept all suggestions
├─ Accept/reject individually
├─ Re-analyze with different model
└─ Export analysis report
```

### Page Layouts

#### 1. **Dashboard Layout**
```
┌─────────────────────────────────────────────────────┐
│ Header: Logo | Search | Notifications | User        │
├────────┬────────────────────────────────────────────┤
│        │ Stats Cards (4 columns)                    │
│        │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│        │ │Total │ │Pending│ │Expiry│ │Value │      │
│        │ └──────┘ └──────┘ └──────┘ └──────┘      │
│ Side   │                                             │
│ bar    │ Charts Section (2 columns)                 │
│        │ ┌─────────────────┐ ┌──────────────────┐  │
│ Nav    │ │Contract Timeline│ │Status Distribution│  │
│ Items  │ └─────────────────┘ └──────────────────┘  │
│        │                                             │
│        │ Recent Activity Table                       │
│        │ ┌─────────────────────────────────────┐   │
│        │ │ Title | Status | Date | Actions      │   │
│        │ └─────────────────────────────────────┘   │
└────────┴────────────────────────────────────────────┘
```

#### 2. **Contract List Layout**
```
┌─────────────────────────────────────────────────────┐
│ Header + Breadcrumbs                                │
├────────┬────────────────────────────────────────────┤
│        │ Toolbar: [Search] [Filters] [+ New]       │
│        ├────────────────────────────────────────────┤
│        │ Applied Filters: [Status:Active] [x]       │
│ Side   ├────────────────────────────────────────────┤
│ bar    │ Data Table                                  │
│        │ ┌────────────────────────────────────────┐ │
│        │ │☐ Title   │Type│Status│Value│Expiry│ ⋮ │ │
│        │ ├────────────────────────────────────────┤ │
│        │ │☐ NDA-001 │NDA │Active│$50K │Dec 31│ ⋮ │ │
│        │ │☐ MSA-002 │MSA │Review│$250K│Mar 15│ ⋮ │ │
│        │ └────────────────────────────────────────┘ │
│        │ Pagination: [< 1 2 3 ... 10 >]            │
└────────┴────────────────────────────────────────────┘
```

#### 3. **Contract Detail Layout**
```
┌─────────────────────────────────────────────────────┐
│ Header + Breadcrumbs                                │
├────────┬────────────────────────────────────────────┤
│        │ Contract Title + Status Badge              │
│        │ [Edit] [Share] [Download] [⋮]             │
│        ├────────────────────────────────────────────┤
│        │ Tabs: Details | Document | Versions | ... │
│ Side   ├─────────────────┬──────────────────────────┤
│ bar    │ Document Viewer │ Side Panel               │
│        │                 │                          │
│        │  PDF/DOCX       │ Properties:              │
│        │  Viewer with    │ - Parties                │
│        │  Annotations    │ - Dates                  │
│        │                 │ - Value                  │
│        │  [Zoom tools]   │ - Tags                   │
│        │                 │                          │
│        │                 │ Actions:                 │
│        │                 │ [Request Review]         │
│        │                 │ [Send for Signature]     │
└────────┴─────────────────┴──────────────────────────┘
```

#### 4. **Workflow Builder Layout**
```
┌─────────────────────────────────────────────────────┐
│ Header: Workflow Name [Save] [Test] [Activate]     │
├────────┬────────────────────────────────────────────┤
│        │ Canvas (Drag & Drop)                       │
│ Tools  │                                             │
│ Panel  │  [Start] ──→ [Review] ──→ [Approve]       │
│        │                 ↓                           │
│ Steps: │              [Changes?]                     │
│ ┌───┐  │             Yes ↙  ↘ No                    │
│ │Rev│  │        [Revision]  [Execute]               │
│ │App│  │                                             │
│ │Not│  │                                             │
│ │Cond│ │ [+ Add Step]                               │
│ └───┘  │                                             │
│        │ Properties Panel (for selected step):      │
│        │ Assignee: [Select users]                   │
│        │ Deadline: [3 days]                         │
└────────┴────────────────────────────────────────────┘
```

### Responsive Design Breakpoints

```css
Mobile: 320px - 640px
- Single column layout
- Hamburger menu
- Stacked cards
- Bottom navigation

Tablet: 641px - 1024px
- Two column layout
- Collapsible sidebar
- Grid cards (2 columns)

Desktop: 1025px - 1920px
- Full sidebar always visible
- Multi-column layouts
- Grid cards (3-4 columns)

Large Desktop: 1921px+
- Wide layouts
- More whitespace
- Grid cards (4-6 columns)
```

### Animation & Transitions

```css
/* Micro-interactions */
Button hover: transform: scale(1.02), duration: 150ms
Card hover: shadow elevation change, duration: 200ms
Modal open: fade + scale, duration: 250ms
Toast appear: slide + fade, duration: 300ms

/* Page transitions */
Route change: fade, duration: 200ms
Tab switch: fade, duration: 150ms

/* Loading states */
Skeleton: shimmer effect, duration: 1500ms loop
Spinner: rotate, duration: 1000ms infinite
Progress: smooth fill, duration: match actual progress
```

### Dark Mode Support

All components support dark mode with:
- System preference detection
- Manual toggle in settings
- Persisted preference (KV storage)
- Smooth theme transition (200ms)
- Dark-optimized colors (reduced brightness for OLED)

---

## 🛠 Developer Experience (DX)

### Development Workflow

#### 1. **Local Development Setup**

```bash
# Clone repository
git clone <repo-url>
cd kontrakpro

# Install dependencies (uses npm workspaces if needed)
npm install

# Setup environment variables
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your local config

# Start development server (with HMR)
npm run dev

# Access at http://localhost:5173
# - Hot Module Replacement enabled
# - React Fast Refresh for instant updates
# - Source maps for debugging
# - TypeScript type checking in watch mode
```

#### 2. **Cloudflare Local Development**

```bash
# Create D1 database locally
npm run db:create-local

# Run migrations
npm run db:migrate

# Seed database with test data
npm run db:seed

# Start with Cloudflare Workers emulation
npm run cf:dev

# This starts:
# - React Router dev server
# - Wrangler local mode (with D1, KV, R2 emulation)
# - Live reload on code changes
```

#### 3. **Type Safety & Code Quality**

```bash
# Type checking
npm run typecheck

# Generate React Router types
npm run typegen

# Lint code
npm run lint

# Format code (Prettier)
npm run format

# Run all checks before commit
npm run pre-commit
```

#### 4. **Testing Strategy**

```bash
# Unit tests (Vitest)
npm run test
npm run test:watch  # Watch mode
npm run test:coverage  # Coverage report

# Integration tests (Testing Library)
npm run test:integration

# E2E tests (Playwright)
npm run test:e2e
npm run test:e2e:ui  # Interactive mode

# Visual regression tests (Percy/Chromatic)
npm run test:visual
```

### Project Structure Best Practices

```
app/
├── routes/              # File-based routing
│   ├── _auth/          # Auth layout group
│   ├── _dashboard/     # Dashboard layout group
│   └── api/            # API routes
│
├── components/          # React components
│   ├── ui/             # Reusable UI primitives (Radix-based)
│   ├── contracts/      # Contract-specific components
│   ├── workflows/      # Workflow-specific components
│   └── shared/         # Shared business components
│
├── lib/                 # Utilities and integrations
│   ├── db/             # Database layer (repositories)
│   │   ├── client.ts   # D1 client setup
│   │   ├── contracts.repository.ts
│   │   └── users.repository.ts
│   │
│   ├── storage/        # Storage utilities
│   │   ├── r2.ts       # R2 operations
│   │   └── kv.ts       # KV operations
│   │
│   ├── auth/           # Authentication
│   │   ├── session.ts  # Session management
│   │   ├── jwt.ts      # JWT utilities
│   │   └── rbac.ts     # Role-based access control
│   │
│   ├── ai/             # AI integrations
│   │   ├── analyze.ts  # Contract analysis
│   │   ├── extract.ts  # Property extraction
│   │   └── prompts.ts  # AI prompts
│   │
│   └── utils/          # General utilities
│       ├── date.ts
│       ├── format.ts
│       └── validation.ts
│
├── workers/             # Cloudflare Workers code
│   ├── index.ts        # Main worker entry
│   ├── durable-objects/
│   │   ├── collaboration.ts  # Real-time collaboration
│   │   └── workflow-engine.ts
│   └── scheduled/      # Cron jobs
│       ├── expiry-check.ts
│       └── reports.ts
│
├── styles/              # Global styles
│   └── globals.css     # Tailwind + custom CSS
│
└── types/              # TypeScript types
    ├── contract.ts
    ├── workflow.ts
    └── env.d.ts        # Environment types
```

### Environment Variables

```bash
# .dev.vars (local development)
DATABASE_ID=local-d1-db
KV_CACHE_ID=local-kv-cache
KV_SESSIONS_ID=local-kv-sessions
R2_BUCKET=local-documents

# AI & Integrations
OPENAI_API_KEY=sk-...
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_API_TOKEN=...

# E-Signature
DOCUSIGN_CLIENT_ID=...
DOCUSIGN_SECRET=...
DOCUSIGN_REDIRECT_URI=http://localhost:5173/api/webhooks/docusign

# Security
JWT_SECRET=your-secret-key
ENCRYPTION_KEY=your-encryption-key

# Feature Flags
ENABLE_AI_FEATURES=true
ENABLE_ESIGNATURE=true
ENABLE_ANALYTICS=true
```

### Code Conventions

#### 1. **File Naming**
```
Components: PascalCase
  - ContractCard.tsx
  - WorkflowBuilder.tsx

Utilities: camelCase
  - dateUtils.ts
  - formatCurrency.ts

Routes: kebab-case or special chars
  - contracts/index.tsx
  - contracts/$id.tsx
  - _auth/login.tsx

Types: PascalCase with .types.ts
  - Contract.types.ts
  - Workflow.types.ts
```

#### 2. **Component Structure**
```tsx
// Imports
import { useState } from 'react';
import type { Contract } from '~/types/contract';

// Types
interface ContractCardProps {
  contract: Contract;
  onEdit?: (id: string) => void;
}

// Component
export function ContractCard({ contract, onEdit }: ContractCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Handlers
  const handleEdit = () => {
    onEdit?.(contract.id);
  };

  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

#### 3. **API Route Pattern**
```tsx
// app/routes/api/contracts.ts
import type { Route } from './+types/contracts';
import { json } from 'react-router';
import { ContractsRepository } from '~/lib/db/contracts.repository';

export async function loader({ request, context }: Route.LoaderArgs) {
  const { DB } = context.cloudflare.env;
  const repo = new ContractsRepository(DB);

  const contracts = await repo.findAll();

  return json({ contracts });
}

export async function action({ request, context }: Route.ActionArgs) {
  const { DB } = context.cloudflare.env;
  const repo = new ContractsRepository(DB);

  const data = await request.json();
  const contract = await repo.create(data);

  return json({ contract }, { status: 201 });
}
```

### Debugging Tools

#### 1. **React Router DevTools**
```tsx
// Add to app/root.tsx in development
import { ReactRouterDevTools } from '@react-router/dev-tools';

export default function App() {
  return (
    <>
      <Outlet />
      {process.env.NODE_ENV === 'development' && <ReactRouterDevTools />}
    </>
  );
}
```

#### 2. **Cloudflare Wrangler Logs**
```bash
# Tail production logs
wrangler tail

# Tail with filters
wrangler tail --status error

# Tail specific environment
wrangler tail --env production
```

#### 3. **D1 Database Inspection**
```bash
# Query D1 locally
wrangler d1 execute kontrakpro-db --local --command "SELECT * FROM contracts LIMIT 10"

# Export database
wrangler d1 export kontrakpro-db --local --output=backup.sql

# Import database
wrangler d1 execute kontrakpro-db --local --file=backup.sql
```

### Performance Optimization

#### 1. **Code Splitting**
```tsx
// Lazy load heavy components
import { lazy } from 'react';

const PDFViewer = lazy(() => import('~/components/PDFViewer'));
const WorkflowBuilder = lazy(() => import('~/components/WorkflowBuilder'));

// Use with Suspense
<Suspense fallback={<Skeleton />}>
  <PDFViewer />
</Suspense>
```

#### 2. **Caching Strategy**
```tsx
// KV caching for expensive operations
export async function loader({ context }: Route.LoaderArgs) {
  const { CACHE } = context.cloudflare.env;

  // Check cache first
  const cached = await CACHE.get('contracts:stats');
  if (cached) {
    return json(JSON.parse(cached));
  }

  // Compute and cache
  const stats = await computeExpensiveStats();
  await CACHE.put('contracts:stats', JSON.stringify(stats), {
    expirationTtl: 3600, // 1 hour
  });

  return json(stats);
}
```

#### 3. **Database Optimization**
```sql
-- Create indexes for frequently queried columns
CREATE INDEX idx_contracts_org ON contracts(organization_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_expiry ON contracts(end_date) WHERE end_date IS NOT NULL;

-- Composite index for complex queries
CREATE INDEX idx_contracts_org_status ON contracts(organization_id, status);
```

#### 4. **Bundle Size Monitoring**
```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer

# Keep track of:
# - Total bundle size < 500KB (gzipped)
# - Lazy loaded routes
# - Tree-shaking effectiveness
# - Duplicate dependencies
```

### CI/CD Pipeline

```yaml
# .github/workflows/main.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run typecheck

      - name: Lint
        run: npm run lint

      - name: Unit tests
        run: npm run test:coverage

      - name: E2E tests
        run: npm run test:e2e

  deploy-preview:
    needs: test
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
      - name: Deploy to Preview
        run: npx wrangler pages deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
      - name: Deploy to Production
        run: npx wrangler pages deploy --env production
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

### Common Development Tasks

```bash
# Add new route
npm run generate:route -- --name contracts/$id --type loader

# Add new component
npm run generate:component -- --name ContractCard --path components/contracts

# Add new migration
npm run db:migration:create -- --name add_contract_templates

# Generate types from D1 schema
npm run db:generate-types

# Update dependencies
npm run update-deps

# Check for security vulnerabilities
npm audit
npm audit fix
```

---

## ⚠️ Known Challenges & Solutions

### Challenge 1: D1 Database Limitations

**Problem**: D1 is SQLite-based with size limits and no native full-text search.

**Solutions**:
```typescript
// 1. Use Vectorize for semantic search
import type { Vectorize } from '@cloudflare/workers-types';

async function semanticSearch(query: string, env: Env) {
  const embedding = await generateEmbedding(query);

  const results = await env.VECTORIZE.query(embedding, {
    topK: 10,
    returnMetadata: true,
  });

  return results;
}

// 2. Implement FTS5 for full-text search in D1
-- In migration
CREATE VIRTUAL TABLE contracts_fts USING fts5(
  title,
  content,
  parties,
  content=contracts,
  content_rowid=id
);

// 3. Use KV for frequently accessed data
async function getContract(id: string, env: Env) {
  // Check KV cache first
  const cached = await env.CACHE.get(`contract:${id}`);
  if (cached) return JSON.parse(cached);

  // Fallback to D1
  const contract = await env.DB.prepare(
    'SELECT * FROM contracts WHERE id = ?'
  ).bind(id).first();

  // Cache for next time
  await env.CACHE.put(
    `contract:${id}`,
    JSON.stringify(contract),
    { expirationTtl: 3600 }
  );

  return contract;
}
```

### Challenge 2: Real-time Collaboration

**Problem**: Cloudflare Workers are stateless; need persistent connections.

**Solutions**:
```typescript
// Use Durable Objects for WebSocket connections
export class CollaborationDO {
  private sessions: Map<string, WebSocket>;

  constructor(private state: DurableObjectState) {
    this.sessions = new Map();
  }

  async fetch(request: Request) {
    const { 0: client, 1: server } = new WebSocketPair();

    await this.handleSession(server);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async handleSession(ws: WebSocket) {
    ws.accept();

    const sessionId = crypto.randomUUID();
    this.sessions.set(sessionId, ws);

    ws.addEventListener('message', (event) => {
      // Broadcast to all sessions
      const data = JSON.parse(event.data);
      this.broadcast(data, sessionId);
    });

    ws.addEventListener('close', () => {
      this.sessions.delete(sessionId);
    });
  }

  broadcast(data: any, excludeSession?: string) {
    this.sessions.forEach((ws, sessionId) => {
      if (sessionId !== excludeSession) {
        ws.send(JSON.stringify(data));
      }
    });
  }
}
```

### Challenge 3: Large File Uploads

**Problem**: Workers have 100MB limit; need chunked uploads.

**Solutions**:
```typescript
// Client-side chunked upload
async function uploadLargeFile(file: File, env: Env) {
  const chunkSize = 5 * 1024 * 1024; // 5MB chunks
  const totalChunks = Math.ceil(file.size / chunkSize);
  const uploadId = crypto.randomUUID();

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);

    await uploadChunk(chunk, uploadId, i, totalChunks);
  }

  // Finalize upload (combine chunks in R2)
  await finalizeUpload(uploadId);
}

// Server-side R2 multipart upload
async function uploadChunk(
  chunk: Blob,
  uploadId: string,
  partNumber: number,
  env: Env
) {
  const key = `uploads/${uploadId}/part-${partNumber}`;
  await env.DOCUMENTS.put(key, chunk);
}

async function finalizeUpload(uploadId: string, env: Env) {
  // Combine all parts using R2 MultipartUpload API
  const upload = await env.DOCUMENTS.createMultipartUpload(
    `documents/${uploadId}/final.pdf`
  );

  // Upload parts
  const parts = /* list all part keys */;
  for (const [index, partKey] of parts.entries()) {
    const part = await env.DOCUMENTS.get(partKey);
    await upload.uploadPart(index + 1, part.body);
  }

  // Complete
  await upload.complete();

  // Cleanup temp parts
  for (const partKey of parts) {
    await env.DOCUMENTS.delete(partKey);
  }
}
```

### Challenge 4: OCR Processing

**Problem**: Tesseract.js is large and slow in browser.

**Solutions**:
```typescript
// Option 1: Use Cloudflare AI for OCR
async function extractText(imageUrl: string, env: Env) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();

  const result = await env.AI.run(
    '@cf/meta/llama-2-7b-chat-fp16',
    {
      image: blob,
      prompt: 'Extract all text from this document',
    }
  );

  return result.text;
}

// Option 2: Offload to Worker with longer timeout
// In a dedicated worker (not bound by 50ms CPU limit)
export default {
  async fetch(request: Request, env: Env) {
    const { image } = await request.json();

    // Process with Tesseract
    const text = await Tesseract.recognize(image, 'eng');

    return new Response(JSON.stringify({ text }));
  },
};

// Option 3: Use external OCR API (Google Vision, AWS Textract)
async function ocrWithGoogle(imageUrl: string) {
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { source: { imageUri: imageUrl } },
          features: [{ type: 'TEXT_DETECTION' }],
        }],
      }),
    }
  );

  const data = await response.json();
  return data.responses[0].fullTextAnnotation.text;
}
```

### Challenge 5: PDF Generation & Manipulation

**Problem**: PDF libraries are heavy; Workers have size limits.

**Solutions**:
```typescript
// Option 1: Use lightweight pdf-lib
import { PDFDocument } from 'pdf-lib';

async function generatePDF(contractData: Contract) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  page.drawText(contractData.title, { x: 50, y: 750 });
  page.drawText(contractData.content, { x: 50, y: 700 });

  const pdfBytes = await pdfDoc.save();
  return new Response(pdfBytes, {
    headers: { 'Content-Type': 'application/pdf' },
  });
}

// Option 2: Use Cloudflare Browser Rendering API
async function pdfFromHTML(html: string, env: Env) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/browser/render`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: `data:text/html,${encodeURIComponent(html)}`,
        format: 'pdf',
      }),
    }
  );

  return response.blob();
}

// Option 3: Offload to dedicated service
async function generatePDFService(contractId: string) {
  // Call external PDF generation service
  // e.g., DocRaptor, PDFShift, etc.
}
```

### Challenge 6: Cost Optimization

**Problem**: Cloudflare has usage limits and costs.

**Solutions**:
```typescript
// 1. Aggressive caching strategy
const CACHE_TTL = {
  static: 86400,      // 24 hours
  contracts: 3600,    // 1 hour
  search: 300,        // 5 minutes
  analytics: 1800,    // 30 minutes
};

// 2. Implement rate limiting
async function rateLimit(
  key: string,
  limit: number,
  window: number,
  env: Env
) {
  const current = await env.CACHE.get(`ratelimit:${key}`);
  const count = current ? parseInt(current) : 0;

  if (count >= limit) {
    throw new Error('Rate limit exceeded');
  }

  await env.CACHE.put(
    `ratelimit:${key}`,
    (count + 1).toString(),
    { expirationTtl: window }
  );
}

// 3. Batch operations to reduce D1 queries
async function batchGetContracts(ids: string[], env: Env) {
  const placeholders = ids.map(() => '?').join(',');
  const query = `SELECT * FROM contracts WHERE id IN (${placeholders})`;

  const results = await env.DB.prepare(query).bind(...ids).all();
  return results.results;
}

// 4. Use R2 lifecycle policies for old documents
// Configure in wrangler.toml or dashboard:
// - Move to infrequent access after 90 days
// - Delete after 7 years (or per retention policy)

// 5. Optimize AI usage
async function analyzeContract(contract: Contract, env: Env) {
  // Check if already analyzed
  const cached = await env.CACHE.get(`analysis:${contract.id}`);
  if (cached) return JSON.parse(cached);

  // Only analyze changed contracts
  if (!contract.hasChanged) {
    return contract.cachedAnalysis;
  }

  // Use smaller, faster models for simple tasks
  const model = contract.isComplex
    ? '@cf/meta/llama-2-7b-chat-fp16'  // Complex analysis
    : '@cf/meta/llama-2-7b-chat-int8';  // Simple analysis (faster, cheaper)

  const result = await env.AI.run(model, {
    prompt: generatePrompt(contract),
  });

  // Cache result
  await env.CACHE.put(
    `analysis:${contract.id}`,
    JSON.stringify(result),
    { expirationTtl: 86400 }
  );

  return result;
}
```

### Challenge 7: Testing Cloudflare-specific Features

**Problem**: Mocking D1, KV, R2, DO is complex.

**Solutions**:
```typescript
// Use Miniflare for local testing
import { Miniflare } from 'miniflare';
import { describe, it, beforeAll, afterAll } from 'vitest';

describe('Contracts API', () => {
  let mf: Miniflare;

  beforeAll(async () => {
    mf = new Miniflare({
      modules: true,
      script: `
        export default {
          async fetch(request, env) {
            // Your worker code
          }
        }
      `,
      d1Databases: ['DB'],
      kvNamespaces: ['CACHE', 'SESSIONS'],
      r2Buckets: ['DOCUMENTS'],
    });
  });

  afterAll(async () => {
    await mf.dispose();
  });

  it('should create contract', async () => {
    const response = await mf.dispatchFetch('http://localhost/api/contracts', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test Contract' }),
    });

    expect(response.status).toBe(201);
  });
});

// Mock D1 in tests
export function createMockD1(): D1Database {
  const data = new Map();

  return {
    prepare: (query: string) => ({
      bind: (...params: any[]) => ({
        first: async () => data.get(params[0]),
        all: async () => ({ results: Array.from(data.values()) }),
        run: async () => {
          // Mock insert/update
        },
      }),
    }),
  } as any;
}
```

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
