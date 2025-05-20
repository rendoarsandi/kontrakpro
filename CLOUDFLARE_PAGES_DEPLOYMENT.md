# Panduan Deployment KontrakPro di Cloudflare Pages

Dokumen ini berisi langkah-langkah untuk men-deploy frontend Next.js KontrakPro di Cloudflare Pages.

## Prasyarat

1. Akun Cloudflare
2. Repository GitHub yang berisi kode frontend Next.js KontrakPro
3. API KontrakPro yang sudah di-deploy di Cloudflare Workers

## Langkah-langkah Deployment

### 1. Persiapan Kode Frontend

1. Pastikan file `next.config.mjs` sudah dikonfigurasi untuk Cloudflare Pages:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
```

2. Pastikan file `.env.production` sudah berisi URL API yang benar:

```
NEXT_PUBLIC_API_URL=https://kontrakpro-api.rendoarsandi.workers.dev
# Atau gunakan domain kustom jika sudah dikonfigurasi
# NEXT_PUBLIC_API_URL=https://api.kontrakpro.com
```

3. Commit dan push perubahan ke repository GitHub.

### 2. Konfigurasi Cloudflare Pages

1. Login ke [dashboard Cloudflare](https://dash.cloudflare.com)
2. Pilih akun Anda dan klik "Pages" di sidebar
3. Klik tombol "Create a project"
4. Pilih "Connect to Git"
5. Pilih repository GitHub yang berisi kode frontend Next.js KontrakPro
6. Klik "Begin setup"
7. Isi informasi berikut:
   - **Project name**: `kontrakpro` (atau nama lain yang Anda inginkan)
   - **Production branch**: `main` (atau branch yang Anda gunakan untuk production)
   - **Framework preset**: `Next.js`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/` (atau direktori lain jika frontend tidak berada di root repository)
   - **Environment variables**: Tambahkan variabel lingkungan yang diperlukan, seperti `NEXT_PUBLIC_API_URL`
8. Klik "Save and Deploy"

### 3. Konfigurasi Domain Kustom (Opsional)

1. Setelah deployment berhasil, klik tab "Custom domains"
2. Klik "Set up a custom domain"
3. Masukkan domain yang ingin Anda gunakan (misalnya `app.kontrakpro.com`)
4. Pilih "Continue with setup"
5. Ikuti petunjuk untuk mengkonfigurasi DNS:
   - Jika domain sudah dikelola oleh Cloudflare, Anda hanya perlu mengkonfirmasi
   - Jika domain belum dikelola oleh Cloudflare, Anda perlu menambahkan record CNAME di DNS provider Anda

### 4. Konfigurasi Build Cache (Opsional)

Untuk mempercepat build, Anda dapat mengaktifkan build cache:

1. Di halaman project Cloudflare Pages, klik tab "Settings"
2. Scroll ke bagian "Build cache"
3. Aktifkan "Cache build dependencies"

### 5. Konfigurasi Preview Deployments (Opsional)

Cloudflare Pages secara otomatis membuat preview deployment untuk setiap pull request. Untuk mengkonfigurasi ini:

1. Di halaman project Cloudflare Pages, klik tab "Settings"
2. Scroll ke bagian "Preview deployments"
3. Pilih opsi yang sesuai:
   - **All commits**: Preview deployment untuk semua commits
   - **Pull requests only**: Preview deployment hanya untuk pull requests
   - **None**: Nonaktifkan preview deployments

### 6. Verifikasi Deployment

1. Setelah deployment selesai, klik tombol "Visit site" untuk membuka situs
2. Verifikasi bahwa semua fitur berfungsi dengan benar
3. Periksa integrasi dengan API KontrakPro

## Pemecahan Masalah

### Masalah: Build Gagal

1. Periksa log build untuk melihat error
2. Pastikan konfigurasi Next.js sudah benar untuk Cloudflare Pages
3. Pastikan semua dependensi sudah diinstal

### Masalah: API Tidak Terhubung

1. Periksa konfigurasi CORS di backend
2. Pastikan URL API sudah benar di environment variables
3. Periksa apakah API dapat diakses dari browser

### Masalah: Routing Tidak Berfungsi

1. Pastikan `next.config.mjs` sudah dikonfigurasi dengan benar
2. Pastikan Anda menggunakan `Link` dari Next.js untuk navigasi internal
3. Pastikan Anda menggunakan `trailingSlash: true` di konfigurasi Next.js

## Langkah Selanjutnya

Setelah frontend berhasil di-deploy di Cloudflare Pages, Anda dapat:

1. **Konfigurasi Analytics**:
   - Aktifkan Cloudflare Web Analytics untuk melacak penggunaan situs

2. **Konfigurasi Keamanan**:
   - Aktifkan Cloudflare WAF (Web Application Firewall)
   - Konfigurasi rate limiting
   - Aktifkan HTTPS Strict

3. **Konfigurasi Performance**:
   - Aktifkan Cloudflare Cache
   - Konfigurasi Cloudflare Workers untuk edge computing

4. **Konfigurasi CI/CD**:
   - Integrasi dengan GitHub Actions untuk otomatisasi deployment
   - Konfigurasi pengujian otomatis sebelum deployment
