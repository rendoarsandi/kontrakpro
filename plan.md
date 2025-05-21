# Rencana Implementasi KontrakPro di Cloudflare

## 1. Checklist Fitur dari PRD

### Manajemen Kontrak
- [x] Pembuatan kontrak dengan template
- [x] Repositori kontrak terpusat
- [x] Pencarian dan filter kontrak
- [x] Pelacakan versi dan riwayat perubahan
- [x] Ekspor kontrak (PDF, HTML)

### Workflow dan Persetujuan
- [x] Alur kerja persetujuan yang dapat dikonfigurasi
- [x] Notifikasi dan pengingat otomatis
- [x] Pelacakan status persetujuan
- [x] Delegasi dan eskalasi tugas

### E-Signature
- [x] Integrasi tanda tangan elektronik (Backend handler dasar dibuat)
- [~] Verifikasi identitas penandatangan (Backend OTP logic implemented)
- [x] Pelacakan status penandatanganan (Backend handler dasar dibuat)
- [ ] Bukti tanda tangan yang aman

### Analitik dan Pelaporan
- [x] Dashboard dengan metrik kontrak utama
- [x] Laporan yang dapat disesuaikan
- [~] Analisis risiko dan kepatuhan (Backend handler dasar dibuat)
- [x] Pelacakan kinerja dan efisiensi

### Integrasi CRM
- [x] Sinkronisasi data dengan sistem CRM (Backend handler dasar dibuat)
- [ ] Pemetaan data dua arah
- [x] Pemicu otomatis berdasarkan peristiwa CRM (Backend handler dasar dibuat)
- [x] Tampilan terpadu data kontrak dan CRM

### AI Analysis
- [~] Analisis risiko otomatis (Backend handler dasar dibuat)
- [~] Ekstraksi ketentuan dan klausa utama (Backend handler dasar dibuat)
- [~] Rekomendasi bahasa kontrak (Backend handler dasar dibuat)
- [~] Deteksi anomali dan potensi masalah (Backend handler dasar dibuat)

## 2. Fitur yang Belum Terimplementasi

Berdasarkan analisis implementasi saat ini, berikut adalah fitur-fitur yang belum terimplementasi:

1. ~~**Notifikasi dan Pengingat**~~: ✅
   - ~~Belum ada implementasi sistem notifikasi~~ ✅
   - ~~Belum ada implementasi pengingat otomatis~~ ✅

2. **E-Signature**:
   - [x] Belum ada implementasi integrasi tanda tangan elektronik (Backend handler dasar ada)
   - [~] Belum ada implementasi verifikasi identitas penandatangan (Backend OTP logic implemented, UI/email pending)
   - [x] Belum ada implementasi pelacakan status penandatanganan (Backend handler dasar ada)

3. ~~**Analitik dan Pelaporan**~~: ✅
   - ~~Belum ada implementasi dashboard dengan metrik kontrak~~ ✅
   - ~~Belum ada implementasi laporan yang dapat disesuaikan~~ ✅
   - [x] Belum ada implementasi analisis risiko dan kepatuhan (Backend handler dasar ada)

4. **Integrasi CRM**:
   - [x] Belum ada implementasi sinkronisasi data dengan sistem CRM (Backend handler dasar ada)
   - [x] Belum ada implementasi pemetaan data dua arah
   - [~] Belum ada implementasi pemicu otomatis berdasarkan peristiwa CRM (Backend handler dasar ada)

5. **AI Analysis**:
   - [~] Belum ada implementasi analisis risiko otomatis (Backend handler dasar ada)
   - [~] Belum ada implementasi ekstraksi ketentuan dan klausa utama (Backend handler dasar ada)
   - [~] Belum ada implementasi rekomendasi bahasa kontrak (Backend handler dasar ada)
   - [~] Belum ada implementasi deteksi anomali (Backend handler dasar ada)

## 3. Prioritas Implementasi

Berikut adalah prioritas implementasi fitur berdasarkan urgensi dan dependensi:

### Prioritas 1: Infrastruktur Dasar ✅
1. ✅ Setup Cloudflare Workers
2. ✅ Konfigurasi Cloudflare D1 (database)
3. ✅ Konfigurasi Cloudflare KV (key-value storage)
4. ✅ Konfigurasi Cloudflare R2 (object storage)
5. ✅ Implementasi autentikasi dan otorisasi

### Prioritas 2: Fitur Inti ✅
1. ✅ Manajemen Kontrak (CRUD)
2. ✅ Repositori kontrak dan pencarian
3. ✅ Ekspor kontrak (PDF/HTML)
4. ✅ Workflow dan persetujuan dasar

### Prioritas 3: Fitur Pendukung (Selesai) ✅
1. ✅ Notifikasi dan pengingat
2. ✅ Analitik dan pelaporan dasar
3. ✅ Pelacakan versi dan riwayat perubahan

### Prioritas 4: Fitur Lanjutan
1. [x] Integrasi E-Signature (Backend handler dasar selesai)
2. [x] Integrasi CRM dasar (Backend handler dasar selesai)
3. [~] Analitik dan pelaporan lanjutan (Backend handler dasar untuk analisis risiko dimulai)

### Prioritas 5: Fitur Premium
1. [x] AI Analysis (Backend handler dasar selesai)
2. [x] Integrasi CRM lanjutan (Backend handler dasar untuk event webhook dimulai)
3. [x] Fitur kolaborasi lanjutan (Backend handler dasar untuk komentar dimulai)

## 4. Langkah-langkah Implementasi Backend di Cloudflare

### 4.1 Setup Cloudflare Workers

1. **Instalasi Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

2. **Login ke Cloudflare**
   ```bash
   wrangler login
   ```

3. **Inisialisasi Proyek Workers**
   ```bash
   wrangler init kontrakpro-api
   ```

4. **Struktur Proyek Workers**
   ```
   kontrakpro-api/
   ├── src/
   │   ├── index.ts
   │   ├── auth/
   │   ├── contracts/
   │   ├── workflows/
   │   ├── users/
   │   └── utils/
   ├── wrangler.toml
   └── package.json
   ```

5. **Konfigurasi wrangler.toml**
   ```toml
   name = "kontrakpro-api"
   main = "src/index.ts"
   compatibility_date = "2023-12-01"

   [vars]
   ENVIRONMENT = "development"

   # Konfigurasi untuk D1, KV, dan R2 akan ditambahkan nanti
   ```

### 4.2 Konfigurasi Cloudflare D1 (Database)

1. **Membuat Database D1**
   ```bash
   wrangler d1 create kontrakpro-db
   ```

2. **Menambahkan Konfigurasi D1 ke wrangler.toml**
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "kontrakpro-db"
   database_id = "ID_DARI_LANGKAH_SEBELUMNYA"
   ```

3. **Membuat Skema Database**
   Buat file `schema.sql`:
   ```sql
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
   ```

4. **Menjalankan Migrasi Database**
   ```bash
   wrangler d1 execute kontrakpro-db --file=schema.sql
   ```

### 4.3 Konfigurasi Cloudflare KV (Key-Value Storage)

1. **Membuat KV Namespace**
   ```bash
   wrangler kv:namespace create "SESSIONS"
   wrangler kv:namespace create "SETTINGS"
   ```

2. **Menambahkan Konfigurasi KV ke wrangler.toml**
   ```toml
   [[kv_namespaces]]
   binding = "SESSIONS"
   id = "ID_DARI_LANGKAH_SEBELUMNYA"

   [[kv_namespaces]]
   binding = "SETTINGS"
   id = "ID_DARI_LANGKAH_SEBELUMNYA"
   ```

### 4.4 Konfigurasi Cloudflare R2 (Object Storage)

1. **Membuat R2 Bucket**
   ```bash
   wrangler r2 bucket create kontrakpro-documents
   ```

2. **Menambahkan Konfigurasi R2 ke wrangler.toml**
   ```toml
   [[r2_buckets]]
   binding = "DOCUMENTS"
   bucket_name = "kontrakpro-documents"
   ```

## 5. Contoh Implementasi Dasar: Manajemen Kontrak

### 5.1 API Router (src/index.ts)

```typescript
import { Router } from 'itty-router';
import { createContract, getContract, listContracts, updateContract, deleteContract } from './contracts/handlers';
import { authenticate } from './auth/middleware';

// Buat router
const router = Router();

// Middleware autentikasi
router.all('/api/*', authenticate);

// Endpoint kontrak
router.get('/api/contracts', listContracts);
router.post('/api/contracts', createContract);
router.get('/api/contracts/:id', getContract);
router.put('/api/contracts/:id', updateContract);
router.delete('/api/contracts/:id', deleteContract);

// Handler untuk permintaan yang tidak cocok
router.all('*', () => new Response('Not Found', { status: 404 }));

// Fungsi fetch untuk Cloudflare Worker
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return router.handle(request, env, ctx);
  }
};

// Definisi tipe Env untuk Cloudflare Worker
export interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  SETTINGS: KVNamespace;
  DOCUMENTS: R2Bucket;
}
```

### 5.2 Contract Handlers (src/contracts/handlers.ts)

```typescript
import { Env } from '../index';
import { generateId } from '../utils/id';

// Daftar kontrak
export async function listContracts(request: Request, env: Env): Promise<Response> {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    const { results } = await env.DB.prepare(
      `SELECT * FROM contracts ORDER BY created_at DESC LIMIT ? OFFSET ?`
    )
    .bind(limit, offset)
    .all();

    return new Response(JSON.stringify({ contracts: results }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Membuat kontrak baru
export async function createContract(request: Request, env: Env): Promise<Response> {
  try {
    const { title, description, type, organization_id } = await request.json();

    // Validasi input
    if (!title || !type || !organization_id) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Dapatkan user ID dari session (diasumsikan sudah diatur oleh middleware authenticate)
    const user = request.user;

    const id = generateId();
    const now = Date.now();

    await env.DB.prepare(
      `INSERT INTO contracts (id, title, description, status, type, owner_id, organization_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(id, title, description || '', 'draft', type, user.id, organization_id, now, now)
    .run();

    // Buat versi awal kontrak
    await env.DB.prepare(
      `INSERT INTO contract_versions (id, contract_id, version, content, created_at, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(generateId(), id, 1, '', now, user.id)
    .run();

    return new Response(JSON.stringify({
      id,
      title,
      description,
      status: 'draft',
      type,
      owner_id: user.id,
      organization_id,
      created_at: now,
      updated_at: now
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Mendapatkan detail kontrak
export async function getContract(request: Request, env: Env): Promise<Response> {
  try {
    const { params } = request;
    const id = params.id;

    const { results } = await env.DB.prepare(
      `SELECT * FROM contracts WHERE id = ?`
    )
    .bind(id)
    .all();

    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Contract not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Dapatkan versi kontrak terbaru
    const { results: versions } = await env.DB.prepare(
      `SELECT * FROM contract_versions WHERE contract_id = ? ORDER BY version DESC LIMIT 1`
    )
    .bind(id)
    .all();

    const contract = {
      ...results[0],
      latest_version: versions[0] || null
    };

    return new Response(JSON.stringify(contract), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Fungsi untuk update dan delete kontrak akan diimplementasikan dengan cara yang serupa
```

### 5.3 Utilitas ID (src/utils/id.ts)

```typescript
// Fungsi untuk menghasilkan ID unik
export function generateId(): string {
  return crypto.randomUUID();
}
```

### 5.4 Middleware Autentikasi (src/auth/middleware.ts)

```typescript
import { Env } from '../index';

// Middleware untuk autentikasi
export async function authenticate(request: Request, env: Env): Promise<Response | void> {
  try {
    // Dapatkan token dari header Authorization
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.split(' ')[1];

    // Dapatkan session dari KV
    const sessionData = await env.SESSIONS.get(token);
    if (!sessionData) {
      return new Response(JSON.stringify({ error: 'Invalid or expired session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse data session
    const session = JSON.parse(sessionData);

    // Verifikasi bahwa session belum kedaluwarsa
    if (session.expires < Date.now()) {
      await env.SESSIONS.delete(token);
      return new Response(JSON.stringify({ error: 'Session expired' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Tambahkan data user ke request untuk digunakan oleh handler
    request.user = session.user;

    // Lanjutkan ke handler berikutnya
    return;
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
```

## 6. Langkah Selanjutnya

### 1. Deployment Backend
- ✅ Migrasi database D1 sudah dilakukan
- ✅ Deploy Worker ke Cloudflare
- ✅ Konfigurasi domain dan DNS (panduan sudah dibuat)

### 2. Implementasi Fitur Pendukung yang Belum Lengkap
- ✅ Notifikasi dan Pengingat:
  - ✅ Implementasi endpoint untuk mengirim notifikasi
  - ✅ Implementasi endpoint untuk mengatur pengingat
  - ✅ Implementasi UI untuk menampilkan notifikasi

- ✅ Analitik dan Pelaporan Dasar:
  - ✅ Implementasi endpoint untuk mengambil data analitik
  - ⏳ Implementasi UI dashboard untuk menampilkan metrik
  - ✅ Implementasi UI dashboard untuk menampilkan metrik

### 3. Integrasi Frontend-Backend
- ✅ Konfigurasi CORS sudah diimplementasikan
- ✅ Tambahkan URL API ke environment variables
- ✅ Integrasikan komponen UI dengan API endpoint yang sudah dibuat
- ✅ Implementasikan fitur upload dokumen di frontend

### 4. Implementasi Fitur Lanjutan
- [~] Integrasi E-Signature: (Backend handler dasar selesai)
  - ✅ Implementasi endpoint untuk tanda tangan elektronik
  - Integrasi dengan penyedia tanda tangan elektronik (jika diperlukan)

- [~] Integrasi CRM: (Backend handler dasar selesai)
  - Implementasi endpoint untuk sinkronisasi data CRM
  - ✅ Implementasi endpoint untuk sinkronisasi data CRM
  - Implementasi UI untuk konfigurasi dan sinkronisasi CRM
- ✅ Implementasi UI untuk konfigurasi dan sinkronisasi CRM

### 5. Implementasi Fitur Premium
- [~] AI Analysis: (Backend handler dasar selesai)
  - Implementasi endpoint untuk analisis AI
  - ✅ Implementasi endpoint untuk analisis AI
  - Implementasi UI untuk menampilkan hasil analisis
  - ✅ Implementasi UI untuk menampilkan hasil analisis
