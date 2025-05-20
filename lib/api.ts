/**
 * API Service untuk KontrakPro
 * 
 * File ini berisi fungsi-fungsi untuk berkomunikasi dengan backend Cloudflare Workers
 */

// URL API dari environment variable atau default
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kontrakpro-api.your-username.workers.dev';

// Tipe untuk respons pagination
interface PaginationResponse {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// Tipe untuk respons kontrak
interface ContractResponse {
  contracts: any[];
  pagination: PaginationResponse;
}

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
  let token = '';
  
  // Cek apakah kode berjalan di browser
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || '';
  }
  
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
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  },
  
  signup: async (userData: {
    email: string;
    password: string;
    name: string;
    organization_name: string;
  }) => {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    const data = await handleResponse(response);
    
    // Simpan token di localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  },
  
  logout: async () => {
    let token = '';
    
    // Cek apakah kode berjalan di browser
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }
    
    if (token) {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
    }
    
    // Hapus token dari localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
  
  refreshToken: async () => {
    let token = '';
    
    // Cek apakah kode berjalan di browser
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }
    
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    
    const data = await handleResponse(response);
    
    // Simpan token baru di localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
    }
    
    return data;
  },
  
  // Contracts
  getContracts: async (params: {
    limit?: number;
    offset?: number;
    status?: string;
    type?: string;
    search?: string;
  } = {}): Promise<ContractResponse> => {
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
  
  createContract: async (contractData: {
    title: string;
    description?: string;
    type: string;
    organization_id: string;
  }) => {
    const response = await fetch(`${API_URL}/api/contracts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(contractData)
    });
    
    return handleResponse(response);
  },
  
  updateContract: async (id: string, contractData: {
    title?: string;
    description?: string;
    status?: string;
    type?: string;
  }) => {
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
  },
  
  // Documents (untuk integrasi dengan R2)
  uploadDocument: async (contractId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contractId', contractId);
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
    
    const response = await fetch(`${API_URL}/api/documents/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    return handleResponse(response);
  },
  
  downloadDocument: async (documentId: string) => {
    const response = await fetch(`${API_URL}/api/documents/${documentId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to download document');
    }
    
    return response.blob();
  }
};

// Hook untuk menggunakan API dengan autentikasi
export function useApi() {
  return api;
}
