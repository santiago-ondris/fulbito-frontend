import axios, { type AxiosInstance, AxiosError } from 'axios';

// Base URL configurable por environment
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Helper functions para JWT token
export const tokenManager = {
  get: (): string | null => localStorage.getItem('fulbito_token'),
  set: (token: string): void => localStorage.setItem('fulbito_token', token),
  remove: (): void => localStorage.removeItem('fulbito_token'),
  isAuthenticated: (): boolean => !!localStorage.getItem('fulbito_token')
};

// Crear instancia de Axios
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Agregar JWT token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Manejo centralizado de errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Token expirado o no válido
    if (error.response?.status === 401) {
      tokenManager.remove();
      // Redirigir al login si no estamos ya ahí
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Server error
    if (error.response?.status === 500) {
      console.error('Error del servidor:', error.response.data);
    }
    
    // Network error
    if (!error.response) {
      console.error('Error de conexión:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Tipos base para respuestas de API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export default api;
