# Panduan Implementasi KontrakPro di Cloudflare

Dokumen ini berisi langkah-langkah detail untuk mengimplementasikan backend KontrakPro di Cloudflare menggunakan Workers, D1, KV, dan R2.

## 1. Persiapan Lingkungan

### 1.1 Prasyarat

- Node.js (versi 18 atau lebih baru)
- Akun Cloudflare
- Akses ke dashboard Cloudflare

### 1.2 Instalasi Wrangler CLI

```bash
npm install -g wrangler
```

### 1.3 Login ke Cloudflare

```bash
wrangler login
```

Ini akan membuka browser untuk autentikasi dengan akun Cloudflare Anda.

## 2. Setup Proyek

### 2.1 Struktur Folder

Semua file untuk backend Cloudflare sudah disiapkan di folder `cloudflare/`. Struktur folder adalah sebagai berikut:

```
cloudflare/
├── src/
│   ├── index.ts                # Entry point
│   ├── auth/                   # Autentikasi
│   │   ├── handlers.ts         # Handler autentikasi
│   │   └── middleware.ts       # Middleware autentikasi
│   ├── contracts/              # Manajemen kontrak
│   │   └── handlers.ts         # Handler kontrak
│   └── utils/                  # Utilitas
│       ├── cors.ts             # Konfigurasi CORS
│       └── id.ts               # Generator ID
├── schema.sql                  # Skema database
├── wrangler.toml               # Konfigurasi Wrangler
├── package.json                # Dependensi
└── tsconfig.json               # Konfigurasi TypeScript
```

### 2.2 Instalasi Dependensi

Masuk ke folder `cloudflare` dan install dependensi:

```bash
cd cloudflare
npm install
```

## 3. Konfigurasi Cloudflare Services

### 3.1 Membuat Database D1

```bash
wrangler d1 create kontrakpro-db
```

Setelah menjalankan perintah di atas, Anda akan mendapatkan output seperti:

```
✅ Successfully created DB 'kontrakpro-db' in region 'enam'
Created D1 database '12345678-abcd-1234-abcd-1234567890ab'

[[d1_databases]]
binding = "DB"
database_name = "kontrakpro-db"
database_id = "12345678-abcd-1234-abcd-1234567890ab"
```

Salin bagian `[[d1_databases]]` dan perbarui file `wrangler.toml` dengan ID database yang benar.

### 3.2 Membuat KV Namespaces

```bash
wrangler kv:namespace create "SESSIONS"
```

Output:

```
✅ Created namespace "SESSIONS" in account "Your Account"
Add the following to your configuration file in your kv_namespaces array:
{ binding = "SESSIONS", id = "abcdef1234567890abcdef1234567890" }
```

```bash
wrangler kv:namespace create "SETTINGS"
```

Perbarui file `wrangler.toml` dengan ID namespace yang dihasilkan.

### 3.3 Membuat R2 Bucket

```bash
wrangler r2 bucket create kontrakpro-documents
```

Output:

```
✅ Created bucket kontrakpro-documents
Add the following to your configuration file in your r2_buckets array:
{ binding = "DOCUMENTS", bucket_name = "kontrakpro-documents" }
```

Perbarui file `wrangler.toml` dengan konfigurasi bucket yang benar.

## 4. Menjalankan Migrasi Database

Jalankan migrasi database untuk membuat skema:

```bash
wrangler d1 execute kontrakpro-db --file=schema.sql
```

## 5. Pengembangan Lokal

Untuk menjalankan server pengembangan lokal:

```bash
npm run dev
```

Ini akan menjalankan server lokal di `http://localhost:8787`.

## 6. Deployment ke Cloudflare

Untuk men-deploy ke Cloudflare Workers:

```bash
npm run deploy
```

Setelah deployment berhasil, Anda akan mendapatkan URL untuk API Anda, misalnya `https://kontrakpro-api.your-username.workers.dev`.

## 7. Integrasi dengan Frontend

### 7.1 Konfigurasi API Service

Buat file `lib/api.ts` di proyek Next.js Anda:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kontrakpro-api.your-username.workers.dev';

// Fungsi untuk menangani respons API
async function handleResponse(response: Response) {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  
  return data;
}

// Fungsi untuk menambahkan token ke header
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

// API Service
export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await handleResponse(response);
    
    // Simpan token di localStorage
    localStorage.setItem('token', data.token);
    
    return data;
  },
  
  signup: async (userData: any) => {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    const data = await handleResponse(response);
    
    // Simpan token di localStorage
    localStorage.setItem('token', data.token);
    
    return data;
  },
  
  logout: async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
    }
    
    localStorage.removeItem('token');
  },
  
  // Contracts
  getContracts: async (params = {}) => {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const response = await fetch(`${API_URL}/api/contracts?${queryString}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },
  
  getContract: async (id: string) => {
    const response = await fetch(`${API_URL}/api/contracts/${id}`, {
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },
  
  createContract: async (contractData: any) => {
    const response = await fetch(`${API_URL}/api/contracts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(contractData)
    });
    
    return handleResponse(response);
  },
  
  updateContract: async (id: string, contractData: any) => {
    const response = await fetch(`${API_URL}/api/contracts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(contractData)
    });
    
    return handleResponse(response);
  },
  
  deleteContract: async (id: string) => {
    const response = await fetch(`${API_URL}/api/contracts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  }
};
```

### 7.2 Menggunakan API Service di Komponen

Contoh penggunaan di halaman kontrak:

```tsx
"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"

export default function ContractsPage() {
  const [contracts, setContracts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    async function fetchContracts() {
      try {
        setLoading(true)
        const data = await api.getContracts()
        setContracts(data.contracts)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchContracts()
  }, [])
  
  // Render contracts...
}
```

## 8. Langkah Selanjutnya

Setelah implementasi dasar selesai, Anda dapat melanjutkan dengan:

1. **Implementasi Fitur Workflow**:
   - Tambahkan endpoint untuk manajemen workflow
   - Implementasikan notifikasi

2. **Implementasi Upload Dokumen**:
   - Tambahkan endpoint untuk upload/download dokumen menggunakan R2
   - Implementasikan versioning dokumen

3. **Implementasi Integrasi CRM**:
   - Tambahkan endpoint untuk konfigurasi dan sinkronisasi CRM
   - Implementasikan webhook untuk integrasi real-time

4. **Implementasi Analitik**:
   - Tambahkan endpoint untuk laporan dan analitik
   - Implementasikan dashboard metrik

5. **Implementasi AI Analysis**:
   - Integrasi dengan model AI untuk analisis kontrak
   - Implementasikan ekstraksi ketentuan dan klausa
