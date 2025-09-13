import api from './api';

// Tipos para administración
export interface MyLeagueSummary {
  id: string;
  name: string;
  slug: string;
  playersPerTeam: number;
  totalPlayers: number;
  totalMatches: number;
  createdAt: string;
  lastMatchDate: string;
}

export interface GetMyLeaguesResponse {
  leagues: MyLeagueSummary[];
}

class AdminService {
  // Obtener mis ligas
  async getMyLeagues(): Promise<GetMyLeaguesResponse> {
    try {
      const response = await api.get<GetMyLeaguesResponse>('/api/admin/my-leagues');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Helper para formatear fecha de última actividad
  formatLastActivity(lastMatchDate: string, createdAt: string): string {
    if (!lastMatchDate || lastMatchDate === '0001-01-01T00:00:00') {
      // No hay partidos jugados
      return 'Sin partidos aún';
    }
    
    const lastMatch = new Date(lastMatchDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastMatch.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Hace ${weeks} semana${weeks > 1 ? 's' : ''}`;
    } else {
      return lastMatch.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  }

  // Helper para obtener estado de la liga
  getLeagueStatus(totalMatches: number, totalPlayers: number): {
    status: 'active' | 'starting' | 'inactive';
    label: string;
    color: string;
  } {
    if (totalMatches === 0) {
      return {
        status: 'starting',
        label: 'Empezando',
        color: 'bg-blue-100 text-blue-800'
      };
    } else if (totalMatches > 0 && totalMatches < 5) {
      return {
        status: 'active',
        label: 'Activa',
        color: 'bg-green-100 text-green-800'
      };
    } else {
      return {
        status: 'active',
        label: 'Establecida',
        color: 'bg-purple-100 text-purple-800'
      };
    }
  }

  // Helper para obtener URL de liga pública
  getPublicLeagueUrl(slug: string): string {
    return `/liga/${slug}`;
  }

  // Helper para obtener URL de administración
  getAdminLeagueUrl(id: string): string {
    return `/admin/liga/${id}`;
  }

  // Helper para manejo de errores
  private handleError(error: any): Error {
    if (error.response?.status === 401) {
      return new Error('No estás autenticado. Iniciá sesión para ver tus ligas.');
    }
    
    if (error.response?.status === 403) {
      return new Error('No tenés permisos para ver esta información.');
    }
    
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    
    if (error.response?.data?.errors) {
      const validationErrors = Object.values(error.response.data.errors).flat();
      return new Error(validationErrors.join(', '));
    }
    
    return new Error(error.message || 'Error al cargar las ligas');
  }
}

export default new AdminService();