# Panduan Konfigurasi Domain Kustom untuk KontrakPro API

Dokumen ini berisi langkah-langkah untuk mengkonfigurasi domain kustom untuk API KontrakPro yang di-deploy di Cloudflare Workers.

## Prasyarat

1. Memiliki domain yang terdaftar (misalnya `kontrakpro.com`)
2. Domain tersebut harus dikelola oleh Cloudflare (menggunakan nameserver Cloudflare)
3. Akses ke dashboard Cloudflare untuk domain tersebut

## Langkah-langkah Konfigurasi

### 1. Tambahkan Domain ke Cloudflare

Jika domain Anda belum dikelola oleh Cloudflare, ikuti langkah-langkah berikut:

1. Login ke [dashboard Cloudflare](https://dash.cloudflare.com)
2. Klik "Add a Site" dan ikuti petunjuk untuk menambahkan domain Anda
3. Perbarui nameserver domain Anda di registrar domain untuk menggunakan nameserver Cloudflare
4. Tunggu hingga perubahan nameserver diterapkan (bisa memakan waktu hingga 24 jam)

### 2. Buat Subdomain untuk API

1. Di dashboard Cloudflare, pilih domain Anda
2. Navigasi ke tab "DNS"
3. Klik "Add Record"
4. Pilih tipe "CNAME"
5. Di field "Name", masukkan "api" (untuk membuat subdomain `api.kontrakpro.com`)
6. Di field "Target", masukkan `kontrakpro-api.rendoarsandi.workers.dev`
7. Pastikan "Proxy status" diaktifkan (ikon cloud berwarna oranye)
8. Klik "Save"

### 3. Konfigurasi Worker untuk Menggunakan Domain Kustom

1. Buka file `cloudflare/wrangler.toml`
2. Uncomment dan sesuaikan bagian konfigurasi domain kustom:

```toml
[routes]
pattern = "api.kontrakpro.com/*"
zone_name = "kontrakpro.com"
```

3. Ganti `kontrakpro.com` dengan domain Anda yang sebenarnya
4. Simpan perubahan

### 4. Deploy Ulang Worker

```bash
cd cloudflare
npx wrangler deploy
```

### 5. Verifikasi Konfigurasi

Setelah deployment selesai, Anda dapat memverifikasi konfigurasi domain kustom dengan:

```bash
curl -I https://api.kontrakpro.com/api/health
```

Jika konfigurasi berhasil, Anda akan melihat respons HTTP 200 OK.

## Pemecahan Masalah

### Masalah: Domain Kustom Tidak Berfungsi

1. **Periksa Status DNS**:
   - Pastikan record CNAME sudah dibuat dengan benar
   - Pastikan Proxy status diaktifkan (ikon cloud berwarna oranye)
   - Tunggu beberapa menit untuk propagasi DNS

2. **Periksa Konfigurasi Worker**:
   - Pastikan pattern dan zone_name di wrangler.toml sudah benar
   - Pastikan Worker sudah di-deploy ulang setelah perubahan konfigurasi

3. **Periksa SSL/TLS**:
   - Di dashboard Cloudflare, navigasi ke tab "SSL/TLS"
   - Pastikan mode SSL/TLS diatur ke "Full" atau "Full (Strict)"

4. **Periksa Firewall Rules**:
   - Pastikan tidak ada firewall rules yang memblokir akses ke subdomain API

### Masalah: Error 1000 DNS Points to Prohibited IP

Jika Anda melihat error ini, berarti target CNAME Anda mengarah ke IP yang dilarang oleh Cloudflare. Pastikan Anda menggunakan domain Workers yang benar sebagai target CNAME.

### Masalah: Error 521 Web Server Is Down

Jika Anda melihat error ini, berarti Cloudflare tidak dapat terhubung ke Worker Anda. Pastikan Worker Anda berjalan dengan benar dan URL target CNAME sudah benar.

## Langkah Selanjutnya

Setelah domain kustom berhasil dikonfigurasi, Anda perlu:

1. **Perbarui Konfigurasi Frontend**:
   - Update file `.env.local` dengan URL API baru:
     ```
     NEXT_PUBLIC_API_URL=https://api.kontrakpro.com
     ```

2. **Perbarui Dokumentasi API**:
   - Update semua referensi ke URL API di dokumentasi Anda

3. **Pertimbangkan Keamanan Tambahan**:
   - Aktifkan WAF (Web Application Firewall) di Cloudflare
   - Konfigurasi rate limiting untuk melindungi API dari serangan DDoS
   - Pertimbangkan untuk menggunakan Cloudflare Access untuk autentikasi tambahan
