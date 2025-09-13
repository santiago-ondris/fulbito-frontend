import api, { tokenManager } from './api';

// Tipos para auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

class AuthService {
  // Login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/api/auth/login', credentials);
      
      // Si el login es exitoso, guardar token
      if (response.data.success && response.data.token) {
        tokenManager.set(response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Register
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>('/api/auth/register', userData);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Logout
  logout(): void {
    tokenManager.remove();
    window.location.href = '/';
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  }

  // Get current user info (decode JWT token)
  getCurrentUser(): User | null {
    const token = tokenManager.get();
    if (!token) return null;

    try {
      // Decode JWT payload (simple base64 decode)
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      return {
        id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || payload.sub,
        email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || payload.email,
        firstName: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']?.split(' ')[0] || '',
        lastName: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']?.split(' ')[1] || '',
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      this.logout();
      return null;
    }
  }

  // Helper para manejo de errores
  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    
    if (error.response?.data?.errors) {
      // FluentValidation errors
      const validationErrors = Object.values(error.response.data.errors).flat();
      return new Error(validationErrors.join(', '));
    }
    
    return new Error(error.message || 'Error desconocido');
  }
}

export default new AuthService();