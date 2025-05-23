/**
 * API Service untuk KontrakPro
 *
 * File ini berisi fungsi-fungsi untuk berkomunikasi dengan backend Cloudflare Workers
 */

// URL API dari environment variable atau default
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Helper untuk mendapatkan full URL
const getApiUrl = (path: string) => {
  if (API_URL) {
    return `${API_URL}${path}`;
  }
  return path; // Gunakan relative URL untuk development
};

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
function getAuthHeaders(isFormData: boolean = false) { // Tambahkan parameter isFormData
  let token = '';

  // Cek apakah kode berjalan di browser
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || '';
  }

  const headers: HeadersInit = {}; // Gunakan HeadersInit untuk tipe yang lebih fleksibel

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  // Untuk FormData, browser akan mengatur Content-Type yang benar (multipart/form-data) secara otomatis
  // jadi kita tidak perlu menyetelnya di sini jika isFormData true.

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

// API Service
export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await fetch(getApiUrl('/api/auth/login'), {
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
    const response = await fetch(getApiUrl('/api/auth/signup'), {
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
      try {
        await fetch(getApiUrl('/api/auth/logout'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
      } catch (error) {
        console.error('Error during API logout call:', error); 
        // Decide if we should proceed to clear local storage even if API call fails
      }
    }

    // Hapus token dan data user dari localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userData'); // Ensure this matches the key used in UserNav
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

    const response = await fetch(getApiUrl('/api/auth/refresh'), {
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
    const response = await fetch(getApiUrl(`/api/contracts?${queryString}`), {
      headers: getAuthHeaders()
    });

    return handleResponse(response);
  },

  getContract: async (id: string) => {
    const response = await fetch(getApiUrl(`/api/contracts/${id}`), {
      headers: getAuthHeaders()
    });

    return handleResponse(response);
  },

  createContract: async (contractData: FormData) => { // Ubah tipe argumen menjadi FormData
    const response = await fetch(getApiUrl('/api/contracts'), {
      method: 'POST',
      headers: getAuthHeaders(true), // Panggil getAuthHeaders dengan isFormData = true
      body: contractData // Kirim FormData langsung
    });

    return handleResponse(response);
  },

  updateContract: async (id: string, contractData: {
    title?: string;
    description?: string;
    status?: string;
    type?: string;
  }) => {
    const response = await fetch(getApiUrl(`/api/contracts/${id}`), {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(contractData)
    });

    return handleResponse(response);
  },

  deleteContract: async (id: string) => {
    const response = await fetch(getApiUrl(`/api/contracts/${id}`), {
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

    const response = await fetch(getApiUrl('/api/documents/upload'), {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: formData
    });

    return handleResponse(response);
  },

  downloadDocument: async (documentId: string) => {
    const response = await fetch(getApiUrl(`/api/documents/${documentId}`), {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to download document');
    }

    return response.blob();
  },

  // Notifications
  getNotifications: async () => {
    try {
      const response = await fetch(getApiUrl('/api/notifications'), {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { notifications: [], error: 'Failed to fetch notifications' };
    }
  },

  markNotificationAsRead: async (id: string) => {
    try {
      const response = await fetch(getApiUrl(`/api/notifications/${id}/read`), {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  },

  // Reminders
  getReminders: async (params: {
    limit?: number;
    offset?: number;
    status?: string;
  } = {}) => {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const response = await fetch(getApiUrl(`/api/reminders?${queryString}`), {
      headers: getAuthHeaders()
    });

    return handleResponse(response);
  },

  createReminder: async (reminderData: {
    title: string;
    message: string;
    resource_type: string;
    resource_id: string;
    due_date: number;
  }) => {
    const response = await fetch(getApiUrl('/api/reminders'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reminderData)
    });

    return handleResponse(response);
  },

  deleteReminder: async (id: string) => {
    const response = await fetch(getApiUrl(`/api/reminders/${id}`), {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return handleResponse(response);
  },

  // Analytics
  getSummaryMetrics: async (params: {
    organization_id?: string;
    time_period?: string;
  } = {}) => {
    try {
      const queryString = new URLSearchParams(params as Record<string, string>).toString();
      const response = await fetch(getApiUrl(`/api/analytics/summary?${queryString}`), {
        headers: getAuthHeaders()
      });

      const data = await handleResponse(response);

      // Jika data tidak memiliki format yang diharapkan, tambahkan data dummy
      if (!data.summary_metrics) {
        // Data dummy untuk pengembangan frontend
        return {
          summary_metrics: {
            total_contracts: 127,
            active_contracts: 86,
            avg_processing_time: 4.2,
            renewal_rate: 87,
            total_value: 4325890,
            avg_contract_value: 34062,
            contracts_expiring: 14,
            renewal_opportunity: 1200000,
            avg_approval_time: 2.3,
            avg_negotiation_time: 5.7,
            contracts_per_user: 12.4,
            automation_rate: 76,
            high_risk_contracts: 12,
            medium_risk_contracts: 34,
            avg_risk_score: 42,
            risk_reduction_rate: 18.5,
            compliance_score: 92,
            non_compliant_contracts: 5,
            compliance_issues: 12,
            avg_resolution_time: 3.2
          },
          contract_status: [
            { name: "Active", value: 86, color: "#10b981" },
            { name: "Draft", value: 18, color: "#6366f1" },
            { name: "Pending Approval", value: 12, color: "#f59e0b" },
            { name: "Expired", value: 8, color: "#f43f5e" },
            { name: "Terminated", value: 3, color: "#64748b" }
          ],
          contract_types: [
            { name: "Service Agreement", value: 35, color: "#4f46e5" },
            { name: "NDA", value: 25, color: "#10b981" },
            { name: "Employment", value: 15, color: "#f43f5e" },
            { name: "Vendor", value: 12, color: "#f59e0b" },
            { name: "Lease", value: 8, color: "#6366f1" },
            { name: "Other", value: 5, color: "#8b5cf6" }
          ],
          team_performance: [
            { team: "Legal", avgProcessingTime: 3.2, avgApprovalTime: 1.8, contractsProcessed: 42 },
            { team: "Sales", avgProcessingTime: 4.5, avgApprovalTime: 2.3, contractsProcessed: 35 },
            { team: "Procurement", avgProcessingTime: 5.1, avgApprovalTime: 2.7, contractsProcessed: 28 },
            { team: "HR", avgProcessingTime: 2.8, avgApprovalTime: 1.5, contractsProcessed: 22 },
            { team: "Finance", avgProcessingTime: 4.2, avgApprovalTime: 2.1, contractsProcessed: 18 }
          ]
        };
      }

      return data;
    } catch (error) {
      console.error("Error fetching summary metrics:", error);
      // Return dummy data in case of error
      return {
        summary_metrics: {
          total_contracts: 127,
          active_contracts: 86,
          avg_processing_time: 4.2,
          renewal_rate: 87
        }
      };
    }
  },

  executeAnalytics: async (analyticsRequest: any) => {
    const response = await fetch(getApiUrl('/api/analytics/execute'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(analyticsRequest)
    });

    return handleResponse(response);
  }
};

// Hook untuk menggunakan API dengan autentikasi
export function useApi() {
  return api;
}
