# Rencana Implementasi KontrakPro di Supabase

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

### Prioritas 1: Infrastruktur Dasar (Supabase) ✅
1. ✅ Setup Proyek Supabase
2. ✅ Konfigurasi Supabase Database (PostgreSQL)
3. ✅ Konfigurasi Supabase Storage (untuk dokumen)
4. ✅ Implementasi Supabase Auth (Autentikasi dan Otorisasi pengguna)
5. ✅ (Opsional) Setup Supabase Edge Functions (untuk logika backend kustom jika diperlukan)

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

## 4. Langkah-langkah Implementasi Backend di Supabase

### 4.1 Setup Proyek Supabase

1.  **Buat Akun Supabase**: Jika belum punya, daftar di [supabase.com](https://supabase.com).
2.  **Buat Proyek Baru**: Di Supabase Dashboard, buat proyek baru untuk KontrakPro.
3.  **Catat Kredensial Proyek**: Simpan Project URL, `anon` key, dan `service_role` key. Ini akan digunakan untuk menghubungkan aplikasi ke Supabase.

### 4.2 Instalasi dan Setup Supabase CLI

1.  **Instalasi Supabase CLI**
    ```bash
    npm install -g supabase
    ```
2.  **Login ke Supabase CLI**
    ```bash
    supabase login
    ```
3.  **Inisialisasi Supabase di Proyek Lokal** (Jalankan di root direktori proyek Next.js Anda)
    ```bash
    supabase init
    ```
    Ini akan membuat direktori `supabase` di proyek Anda.
4.  **Link Proyek Lokal ke Proyek Supabase Remote**
    ```bash
    supabase link --project-ref <PROJECT_ID_ANDA>
    ```
    Ganti `<PROJECT_ID_ANDA>` dengan ID proyek Supabase Anda.

### 4.3 Konfigurasi Supabase Database (PostgreSQL)

1.  **Membuat Skema Database**
    Skema database yang ada (untuk Users, Organizations, Contracts, dll.) sebagian besar kompatibel dengan PostgreSQL. Buat file migrasi SQL di direktori `supabase/migrations`.
    Contoh: `supabase/migrations/YYYYMMDDHHMMSS_initial_schema.sql`
    ```sql
    -- Users Table (Supabase Auth akan menangani tabel users, tapi Anda bisa menambahkan tabel 'profiles' untuk data tambahan)
    CREATE TABLE profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Organizations Table
    CREATE TABLE organizations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Contracts Table
    CREATE TABLE contracts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL,
      type TEXT NOT NULL,
      owner_id UUID NOT NULL REFERENCES profiles(id),
      organization_id UUID NOT NULL REFERENCES organizations(id),
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Contract Versions Table
    CREATE TABLE contract_versions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
      version INTEGER NOT NULL,
      content TEXT NOT NULL, -- Pertimbangkan JSONB jika kontennya terstruktur
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
      created_by UUID NOT NULL REFERENCES profiles(id)
    );

    -- Workflows Table
    CREATE TABLE workflows (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
      status TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Workflow Steps Table
    CREATE TABLE workflow_steps (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
      step_number INTEGER NOT NULL,
      type TEXT NOT NULL, -- e.g., 'approval', 'signature'
      status TEXT NOT NULL, -- e.g., 'pending', 'approved', 'rejected'
      assignee_id UUID REFERENCES profiles(id),
      completed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
    );
    ```
    **Catatan**:
    - Tipe `TEXT PRIMARY KEY` diganti dengan `UUID PRIMARY KEY DEFAULT gen_random_uuid()` untuk ID.
    - `INTEGER` untuk timestamp diganti dengan `TIMESTAMPTZ DEFAULT timezone('utc'::text, now())`.
    - Foreign key `owner_id`, `created_by`, `assignee_id` sekarang merujuk ke `profiles(id)`.

2.  **Menjalankan Migrasi Database**
    ```bash
    supabase db push
    ```
    Atau, untuk kontrol lebih, buat file migrasi individual:
    ```bash
    supabase migration new initial_schema
    # Edit file migrasi yang baru dibuat, lalu:
    supabase migration up
    ```

3.  **Aktifkan Row Level Security (RLS)**
    Sangat penting untuk mengaktifkan RLS pada tabel Anda dan mendefinisikan policies untuk keamanan data. Ini bisa dilakukan di Supabase Dashboard (Authentication -> Policies) atau via SQL.

### 4.4 Konfigurasi Supabase Storage

1.  **Membuat Bucket Penyimpanan**
    Di Supabase Dashboard, navigasi ke Storage dan buat bucket baru (misalnya, `kontrakpro-documents`).
2.  **Mengatur Kebijakan Akses Bucket**
    Konfigurasikan kebijakan akses untuk bucket (misalnya, apakah file publik atau memerlukan autentikasi). Ini bisa dilakukan melalui UI Dashboard atau menggunakan Supabase JS SDK.

### 4.5 Implementasi Supabase Auth

Supabase menyediakan solusi autentikasi bawaan.
1.  **Konfigurasi Provider Auth**: Di Supabase Dashboard (Authentication -> Providers), aktifkan provider yang diinginkan (Email/Password, Google, GitHub, dll.).
2.  **Gunakan Supabase Client Library**: Di frontend (dan backend jika perlu), gunakan `supabase-js` untuk menangani pendaftaran, login, logout, dan manajemen sesi.

## 5. Contoh Implementasi Dasar: Manajemen Kontrak dengan Supabase

Kita akan menggunakan Next.js API Routes sebagai contoh backend.

### 5.1 Setup Supabase Client (misal di `lib/supabaseClient.ts`)

```typescript
// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```
Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` ada di file `.env.local` Anda.

### 5.2 Contoh API Endpoint (Next.js API Route)

**Daftar Kontrak (`pages/api/contracts/index.ts`)**
```typescript
// pages/api/contracts/index.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../lib/supabaseClient' // Sesuaikan path jika perlu

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // TODO: Implementasi autentikasi dan otorisasi (misal, cek session user)
    // const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    // if (sessionError || !session) {
    //   return res.status(401).json({ error: 'Not authenticated' });
    // }

    const { data: contracts, error } = await supabase
      .from('contracts')
      .select('*')
      .order('created_at', { ascending: false });
      // .limit(parseInt(req.query.limit as string) || 10) // Contoh pagination
      // .range(offset, offset + limit -1);

    if (error) {
      console.error('Error fetching contracts:', error);
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ contracts });
  }
  // ... (handle POST untuk membuat kontrak)
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

**Membuat Kontrak Baru (bagian dari `pages/api/contracts/index.ts`)**
```typescript
// ... (lanjutan dari pages/api/contracts/index.ts)
  else if (req.method === 'POST') {
    // const { data: { session }, error: sessionError } = await supabase.auth.getSession(); // Jika menggunakan cookie-based session
    // Untuk API, lebih umum menggunakan token JWT di header Authorization
    const token = req.headers.authorization?.split('Bearer ')[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({ error: 'Not authenticated or invalid token' });
    }

    const { title, description, type, organization_id } = req.body;

    if (!title || !type || !organization_id) {
      return res.status(400).json({ error: 'Missing required fields: title, type, organization_id' });
    }

    const { data: newContract, error: insertError } = await supabase
      .from('contracts')
      .insert([{ title, description, type, organization_id, owner_id: user.id, status: 'draft' }])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating contract:', insertError);
      return res.status(500).json({ error: insertError.message });
    }

    // Buat versi awal kontrak
    const { error: versionError } = await supabase
      .from('contract_versions')
      .insert([{ contract_id: newContract.id, version: 1, content: description || '', created_by: user.id }]);
    
    if (versionError) {
        console.warn('Error creating initial contract version:', versionError.message);
        // Mungkin tidak fatal, lanjutkan response
    }

    return res.status(201).json(newContract);
  }
// ...
```
Implementasi untuk `GET [id]`, `PUT [id]`, `DELETE [id]` akan mengikuti pola serupa, menggunakan Supabase client untuk berinteraksi dengan database dan Supabase Auth untuk keamanan.

### 5.3 Utilitas ID

Supabase secara otomatis menghasilkan UUID untuk kolom `PRIMARY KEY` bertipe `UUID` dengan `DEFAULT gen_random_uuid()`. Jadi, fungsi `generateId()` kustom mungkin tidak lagi diperlukan untuk ID tabel utama.

### 5.4 Autentikasi dengan Supabase Auth

-   **Frontend**: Gunakan `supabase.auth.signUp()`, `supabase.auth.signInWithPassword()`, `supabase.auth.signOut()`, dll.
-   **Backend (API Routes/Edge Functions)**:
    -   Untuk mendapatkan user saat ini: `const { data: { user } } = await supabase.auth.getUser(jwtToken);` (jika JWT dikirim di header) atau `const { data: { session } } = await supabase.auth.getSession()` (jika menggunakan cookie sessions yang di-setup dengan Supabase Auth Helpers).
    -   Lindungi endpoint dengan memeriksa keberadaan user/session yang valid.
    -   Gunakan RLS (Row Level Security) di database untuk memastikan user hanya bisa mengakses data yang diizinkan.

## 6. Langkah Selanjutnya

### 1. Setup dan Konfigurasi Supabase
- ✅ Migrasi database Supabase (via CLI atau Dashboard) sudah dilakukan.
- ✅ Konfigurasi Supabase Auth (RLS, providers) sudah dilakukan.
- ✅ Konfigurasi Supabase Storage (buckets, policies) sudah dilakukan.
- ✅ (Jika menggunakan Edge Functions) Deploy Supabase Edge Functions.

### 2. Implementasi Fitur Pendukung yang Belum Lengkap
- ✅ Notifikasi dan Pengingat: (Backend akan menggunakan Supabase Functions atau trigger database)
  - ✅ Implementasi endpoint/fungsi untuk mengirim notifikasi
  - ✅ Implementasi endpoint/fungsi untuk mengatur pengingat
  - ✅ Implementasi UI untuk menampilkan notifikasi

- ✅ Analitik dan Pelaporan Dasar: (Backend akan query dari Supabase Database)
  - ✅ Implementasi endpoint/fungsi untuk mengambil data analitik
  - ✅ Implementasi UI dashboard untuk menampilkan metrik

### 3. Integrasi Frontend-Backend (dengan Supabase)
- ✅ Konfigurasi CORS (jika API di-host di domain berbeda, Supabase Edge Functions biasanya sudah terkonfigurasi).
- ✅ Tambahkan URL Supabase dan Kunci API ke environment variables (`.env.local`).
- ✅ Integrasikan komponen UI dengan API endpoint yang menggunakan Supabase client.
- ✅ Implementasikan fitur upload dokumen di frontend menggunakan Supabase Storage SDK.

### 4. Implementasi Fitur Lanjutan (Backend menggunakan Supabase)
- [~] Integrasi E-Signature: (Backend handler dasar selesai, perlu adaptasi ke Supabase)
  - ✅ Implementasi endpoint/fungsi untuk tanda tangan elektronik
  - Integrasi dengan penyedia tanda tangan elektronik (jika diperlukan)

- [~] Integrasi CRM: (Backend handler dasar selesai, perlu adaptasi ke Supabase)
  - Implementasi endpoint/fungsi untuk sinkronisasi data CRM
  - ✅ Implementasi endpoint/fungsi untuk sinkronisasi data CRM
  - Implementasi UI untuk konfigurasi dan sinkronisasi CRM
- ✅ Implementasi UI untuk konfigurasi dan sinkronisasi CRM

### 5. Implementasi Fitur Premium (Backend menggunakan Supabase)
- [~] AI Analysis: (Backend handler dasar selesai, perlu adaptasi ke Supabase)
  - Implementasi endpoint/fungsi untuk analisis AI
  - ✅ Implementasi endpoint/fungsi untuk analisis AI
  - Implementasi UI untuk menampilkan hasil analisis
  - ✅ Implementasi UI untuk menampilkan hasil analisis
