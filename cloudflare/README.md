# KontrakPro API - Cloudflare Workers

Backend API untuk aplikasi KontrakPro menggunakan Cloudflare Workers, D1, KV, dan R2.

## Persiapan

### Prasyarat

- Node.js (versi 18 atau lebih baru)
- Akun Cloudflare
- Wrangler CLI

### Instalasi

1. Install Wrangler CLI:

```bash
npm install -g wrangler
```

2. Login ke Cloudflare:

```bash
wrangler login
```

3. Install dependensi:

```bash
npm install
```

## Konfigurasi

### 1. Buat Database D1

```bash
wrangler d1 create kontrakpro-db
```

Setelah menjalankan perintah di atas, Anda akan mendapatkan ID database. Salin ID tersebut dan perbarui file `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "kontrakpro-db"
database_id = "ID_DARI_LANGKAH_SEBELUMNYA"
```

### 2. Buat KV Namespaces

```bash
wrangler kv:namespace create "SESSIONS"
wrangler kv:namespace create "SETTINGS"
```

Perbarui file `wrangler.toml` dengan ID namespace yang dihasilkan:

```toml
[[kv_namespaces]]
binding = "SESSIONS"
id = "ID_DARI_LANGKAH_SEBELUMNYA"

[[kv_namespaces]]
binding = "SETTINGS"
id = "ID_DARI_LANGKAH_SEBELUMNYA"
```

### 3. Buat R2 Bucket

```bash
wrangler r2 bucket create kontrakpro-documents
```

Perbarui file `wrangler.toml`:

```toml
[[r2_buckets]]
binding = "DOCUMENTS"
bucket_name = "kontrakpro-documents"
```

### 4. Jalankan Migrasi Database

```bash
wrangler d1 execute kontrakpro-db --file=schema.sql
```

## Pengembangan

Untuk menjalankan server pengembangan lokal:

```bash
npm run dev
```

## Deployment

Untuk men-deploy ke Cloudflare Workers:

```bash
npm run deploy
```

## Struktur API

### Autentikasi

- `POST /api/auth/login` - Login pengguna
- `POST /api/auth/signup` - Registrasi pengguna baru
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout pengguna

### Kontrak

- `GET /api/contracts` - Daftar kontrak
- `POST /api/contracts` - Buat kontrak baru
- `GET /api/contracts/:id` - Detail kontrak
- `PUT /api/contracts/:id` - Update kontrak
- `DELETE /api/contracts/:id` - Hapus kontrak

## Integrasi dengan Frontend

Untuk mengintegrasikan API ini dengan frontend Next.js, Anda perlu:

1. Konfigurasi CORS (sudah diimplementasikan di API)
2. Buat service API di frontend untuk berkomunikasi dengan backend
3. Implementasikan autentikasi dan manajemen token di frontend

## Keamanan

- Semua endpoint API (kecuali autentikasi) dilindungi dengan middleware autentikasi
- Password di-hash menggunakan bcrypt
- Session disimpan di Cloudflare KV dengan waktu kedaluwarsa
- Audit log untuk melacak semua aktivitas
