import api from './api';

// Tipos para la respuesta de enfrentamientos
export interface MatchupsResponse {
  success: boolean;
  message: string;
  data?: MatchupData;
}

export interface MatchupData {
  player1: PlayerSummary;
  player2: PlayerSummary;
  stats: MatchupStats;
  matches: MatchupHistory[];
}

export interface PlayerSummary {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface MatchupStats {
  player1Wins: number;
  player2Wins: number;
  draws: number;
  totalMatches: number;
  summary: string;
}

export interface MatchupHistory {
  matchId: string;
  matchDate: string; // ISO string
  team1Score: number;
  team2Score: number;
  result: string; 
  player1Details: PlayerMatchDetails;
  player2Details: PlayerMatchDetails;
}

export interface PlayerMatchDetails {
  goals: number;
  wasInWinningTeam: boolean;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

class MatchupsService {
  
  async getMatchups(
    leagueSlug: string, 
    player1Id: string, 
    player2Id: string
  ): Promise<MatchupsResponse> {
    try {
      const response = await api.get<MatchupsResponse>(
        `/api/leagues/${leagueSlug}/matchups`,
        {
          params: {
            player1Id,
            player2Id
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  validateMatchupParams(player1Id: string, player2Id: string): string[] {
    const errors: string[] = [];

    if (!player1Id || !player1Id.trim()) {
      errors.push('Debe seleccionar el primer jugador');
    }

    if (!player2Id || !player2Id.trim()) {
      errors.push('Debe seleccionar el segundo jugador');
    }

    if (player1Id === player2Id) {
      errors.push('No se puede comparar un jugador consigo mismo');
    }

    return errors;
  }

  // Helper para formatear fecha de partido para mostrar
  formatMatchDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  // Helper para obtener clase CSS según resultado
  getResultStyleClass(result: string, playerName: string): string {
    if (result === 'Empate') {
      return 'text-yellow-600 bg-yellow-50';
    }
    if (result.includes(`Victoria de ${playerName}`)) {
      return 'text-green-600 bg-green-50';
    }
    return 'text-red-600 bg-red-50';
  }

  createShortSummary(stats: MatchupStats): string {
    if (stats.totalMatches === 0) {
      return 'Sin enfrentamientos';
    }
    
    if (stats.player1Wins > stats.player2Wins) {
      return `${stats.player1Wins}-${stats.player2Wins}`;
    } else if (stats.player2Wins > stats.player1Wins) {
      return `${stats.player2Wins}-${stats.player1Wins}`;
    } else {
      return `${stats.player1Wins}-${stats.player2Wins}`;
    }
  }

  getOverallWinner(stats: MatchupStats, player1: PlayerSummary, player2: PlayerSummary): {
    winner: PlayerSummary | null;
    isDraw: boolean;
  } {
    if (stats.player1Wins > stats.player2Wins) {
      return { winner: player1, isDraw: false };
    } else if (stats.player2Wins > stats.player1Wins) {
      return { winner: player2, isDraw: false };
    } else {
      return { winner: null, isDraw: true };
    }
  }

  filterPlayers(players: Player[], searchTerm: string): Player[] {
    if (!searchTerm.trim()) {
      return players;
    }

    const term = searchTerm.toLowerCase();
    return players.filter(player => 
      player.firstName.toLowerCase().includes(term) ||
      player.lastName.toLowerCase().includes(term) ||
      player.fullName.toLowerCase().includes(term)
    );
  }

  private handleError(error: any): Error {
    if (error.response?.status === 404) {
      return new Error('Liga o jugadores no encontrados');
    }
    
    if (error.response?.status === 400) {
      return new Error('Parámetros inválidos para obtener enfrentamientos');
    }
    
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    
    if (error.response?.data?.errors) {
      const validationErrors = Object.values(error.response.data.errors).flat();
      return new Error(validationErrors.join(', '));
    }
    
    return new Error(error.message || 'Error al obtener enfrentamientos');
  }
}

export default new MatchupsService();