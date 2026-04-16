/**
 * Centralized API utility for interacting with the backend.
 * Automatically handles JSON parsing, error throwing, and injecting the Bearer token.
 */

const API_BASE_URL = "https://<your-azure-app>.azurewebsites.net/api";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // Try to get token from localStorage (safe check for SSR)
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('meditrack_token');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const responseText = await response.text();
  let responseData;
  
  try {
    responseData = responseText ? JSON.parse(responseText) : null;
  } catch (err) {
    responseData = { message: 'Invalid JSON response from server' };
  }

  if (!response.ok) {
    throw new ApiError(
      responseData?.message || `HTTP Error ${response.status}`,
      response.status,
      responseData?.errors
    );
  }

  return responseData?.data || responseData;
}

export const api = {
  get: (endpoint: string, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint: string, data: any, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
    
  put: (endpoint: string, data: any, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
    
  delete: (endpoint: string, options?: RequestInit) => 
    fetchWithAuth(endpoint, { ...options, method: 'DELETE' }),
};
