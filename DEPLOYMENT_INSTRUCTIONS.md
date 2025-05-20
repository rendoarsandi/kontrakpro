# Instruksi Deployment KontrakPro di Cloudflare

Dokumen ini berisi langkah-langkah untuk men-deploy backend KontrakPro di Cloudflare menggunakan layanan yang telah kita siapkan.

## Persiapan Lingkungan

1. **Install Node.js** (jika belum terinstall):
   - Download dan install dari [nodejs.org](https://nodejs.org/)
   - Pastikan versi Node.js 18 atau lebih baru

2. **Install Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

3. **Login ke Cloudflare**:
   ```bash
   wrangler login
   ```

## Layanan Cloudflare yang Sudah Dibuat

Berikut adalah layanan Cloudflare yang sudah kita buat dan siap digunakan:

1. **D1 Database**:
   - Nama: kontrakpro-db
   - ID: 0c2cc587-c3d5-41bf-9f10-f7431c5c65f3

2. **KV Namespaces**:
   - KONTRAKPRO_SESSIONS (ID: 4c34d24d4d1d4a3e9f0766e913278a7f)
   - KONTRAKPRO_SETTINGS (ID: b75fc1e4e71940c78760a7bd2e493528)

3. **R2 Bucket**:
   - Nama: kontrakpro-documents

## Langkah-langkah Deployment

### 1. Clone Repository (jika belum)

```bash
git clone https://github.com/rendoarsandi/kontrakpro.git
cd kontrakpro
```

### 2. Jalankan Migrasi Database

Jalankan migrasi database untuk membuat skema di D1:

```bash
cd cloudflare
wrangler d1 execute kontrakpro-db --file=schema.sql
```

### 3. Install Dependensi

```bash
npm install
```

### 4. Deploy Worker

```bash
wrangler deploy
```

Setelah deployment berhasil, Anda akan mendapatkan URL untuk API Anda, misalnya:
```
Deployed to https://kontrakpro-api.your-username.workers.dev
```

## Pengujian API

Setelah API di-deploy, Anda dapat mengujinya menggunakan curl atau Postman:

### 1. Registrasi Pengguna Baru

```bash
curl -X POST https://kontrakpro-api.your-username.workers.dev/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123",
    "name": "Admin User",
    "organization_name": "My Company"
  }'
```

### 2. Login

```bash
curl -X POST https://kontrakpro-api.your-username.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

Respons akan berisi token yang dapat Anda gunakan untuk permintaan berikutnya:

```json
{
  "token": "your-token",
  "expires": 1234567890,
  "user": {
    "id": "user-id",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

### 3. Buat Kontrak Baru

```bash
curl -X POST https://kontrakpro-api.your-username.workers.dev/api/contracts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "title": "Service Agreement",
    "description": "Service agreement with Client XYZ",
    "type": "service_agreement",
    "organization_id": "organization-id-from-signup-response"
  }'
```

### 4. Daftar Kontrak

```bash
curl -X GET https://kontrakpro-api.your-username.workers.dev/api/contracts \
  -H "Authorization: Bearer your-token"
```

## Integrasi dengan Frontend

Untuk mengintegrasikan API dengan frontend Next.js, Anda perlu:

1. **Tambahkan URL API ke Environment Variables**:
   
   Buat file `.env.local` di root proyek Next.js:
   ```
   NEXT_PUBLIC_API_URL=https://kontrakpro-api.your-username.workers.dev
   ```

2. **Buat Service API**:
   
   Implementasikan service untuk berkomunikasi dengan backend Cloudflare seperti yang dijelaskan di `IMPLEMENTATION_GUIDE.md`.

3. **Update Komponen UI**:
   
   Hubungkan komponen UI dengan API service untuk menampilkan dan mengelola data kontrak.

## Pemecahan Masalah

Jika Anda mengalami masalah selama deployment atau penggunaan API, berikut adalah beberapa langkah pemecahan masalah:

1. **Periksa Log Worker**:
   ```bash
   wrangler tail
   ```

2. **Validasi Konfigurasi Wrangler**:
   Pastikan ID database, KV namespaces, dan bucket R2 di `wrangler.toml` sudah benar.

3. **Periksa CORS**:
   Jika frontend tidak dapat berkomunikasi dengan API, pastikan konfigurasi CORS sudah benar.

4. **Periksa Autentikasi**:
   Pastikan token yang digunakan masih valid dan belum kedaluwarsa.

## Langkah Selanjutnya

Setelah backend berhasil di-deploy dan terintegrasi dengan frontend, Anda dapat melanjutkan dengan:

1. **Implementasi Fitur Lanjutan**:
   - Workflow dan persetujuan
   - Upload dan manajemen dokumen
   - Integrasi CRM
   - Analitik dan pelaporan

2. **Pengujian dan Optimasi**:
   - Uji performa API
   - Optimasi query database
   - Implementasi caching

3. **Keamanan dan Kepatuhan**:
   - Audit keamanan
   - Implementasi enkripsi end-to-end
   - Validasi kepatuhan GDPR/SOC 2
