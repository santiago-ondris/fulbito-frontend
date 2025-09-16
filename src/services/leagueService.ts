import api from './api';

// Tipos para ligas
export interface CreateLeagueRequest {
  name: string;
  playersPerTeam: number;
  
  // Puntajes obligatorios
  pointsPerWin: number;
  pointsPerDraw: number;
  pointsPerLoss: number;
  pointsPerMatchPlayed: number;
  
  // Métricas opcionales
  isGoalsEnabled: boolean;
  pointsPerGoal: number;
  isWinStreakEnabled: boolean;
  pointsPerWinInStreak: number;
  minWinStreakToActivate: number;
  isLossStreakEnabled: boolean;
  pointsPerLossInStreak: number;
  minLossStreakToActivate: number;
  isMvpEnabled: boolean;
  pointsPerMvp: number;

  // Jugadores iniciales
  players: CreatePlayerRequest[];
}

export interface CreatePlayerRequest {
  firstName: string;
  lastName: string;
}

export interface CreateLeagueResponse {
  success: boolean;
  message: string;
  leagueId?: string;
  slug?: string;
}

export interface League {
  id: string;
  name: string;
  slug: string;
  playersPerTeam: number;
  scoring: LeagueScoring;
  playerStandings: PlayerStanding[];
  matches: MatchSummary[];
}

export interface LeagueScoring {
  pointsPerWin: number;
  pointsPerDraw: number;
  pointsPerLoss: number;
  pointsPerMatchPlayed: number;
  isGoalsEnabled: boolean;
  pointsPerGoal: number;
  isWinStreakEnabled: boolean;
  minWinStreakToActivate: number;
  pointsPerWinInStreak: number;
  isLossStreakEnabled: boolean;
  pointsPerLossInStreak: number;
  minLossStreakToActivate: number;
  isMvpEnabled: boolean;
  pointsPerMvp: number;
}

export interface PlayerStanding {
  playerId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  totalPoints: number;
  matchesPlayed: number;
  matchesWon: number;
  matchesDrawn: number;
  matchesLost: number;
  goalsFor?: number;
  currentWinStreak?: number;
  currentLossStreak?: number;
  attendanceRate: number;
  winRate: number;
  drawRate: number;
  lossRate: number;
}

export interface MatchSummary {
  matchId: string;
  matchDate: string;
  team1Score: number;
  team2Score: number;
  team1Players: PlayerInMatch[];
  team2Players: PlayerInMatch[];
}

export interface PlayerInMatch {
  playerId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  goals: number;
}

class LeagueService {
  // Crear nueva liga
  async createLeague(leagueData: CreateLeagueRequest): Promise<CreateLeagueResponse> {
    try {
      const response = await api.post<CreateLeagueResponse>('/api/leagues', leagueData);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Obtener liga por slug (vista pública)
  async getLeagueBySlug(slug: string): Promise<League> {
    try {
      const response = await api.get<League>(`/api/leagues/${slug}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Buscar liga por nombre (convertir a slug y buscar)
  async searchLeague(query: string): Promise<League> {
    const slug = this.convertToSlug(query);
    return this.getLeagueBySlug(slug);
  }

  // Helper para convertir texto a slug
  private convertToSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  // Helper para manejo de errores
  private handleError(error: any): Error {
    if (error.response?.status === 404) {
      return new Error('Liga no encontrada');
    }
    
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    
    if (error.response?.data?.errors) {
      const validationErrors = Object.values(error.response.data.errors).flat();
      return new Error(validationErrors.join(', '));
    }
    
    return new Error(error.message || 'Error desconocido');
  }

  async getLeagueById(id: string): Promise<League> {
    try {
      const response = await api.get<League>(`/api/admin/leagues/${id}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }
}

export default new LeagueService();