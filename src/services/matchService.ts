import api from './api';

// Tipos para partidos
export interface AddMatchRequest {
  team1Score: number;
  team2Score: number;
  matchDate: string; // ISO string
  team1Players: PlayerInTeamRequest[];
  team2Players: PlayerInTeamRequest[];
  mvpPlayerId?: string;
}

export interface PlayerInTeamRequest {
  // Para jugador existente
  playerId?: string;
  
  // Para jugador nuevo
  newPlayer?: NewPlayerRequest;
  
  // Goles del jugador (solo si la liga tiene goles habilitados)
  goals: number;
}

export interface NewPlayerRequest {
  firstName: string;
  lastName: string;
}

export interface AddMatchResponse {
  success: boolean;
  message: string;
  matchId?: string;
}

class MatchService {
  // Agregar nuevo partido
  async addMatch(leagueId: string, matchData: AddMatchRequest): Promise<AddMatchResponse> {
    try {
      const response = await api.post<AddMatchResponse>(
        `/api/leagues/${leagueId}/matches`,
        matchData
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Helper para crear estructura de equipo con jugadores existentes
  createTeamWithExistingPlayers(playerIds: string[], goals: number[] = []): PlayerInTeamRequest[] {
    return playerIds.map((playerId, index) => ({
      playerId,
      goals: goals[index] || 0
    }));
  }

  // Helper para crear estructura de equipo con jugadores nuevos
  createTeamWithNewPlayers(
    players: Array<{ firstName: string; lastName: string; goals?: number }>
  ): PlayerInTeamRequest[] {
    return players.map(player => ({
      newPlayer: {
        firstName: player.firstName,
        lastName: player.lastName
      },
      goals: player.goals || 0
    }));
  }

  // Helper para crear estructura de equipo mixto (existentes + nuevos)
  createMixedTeam(
    existingPlayers: Array<{ playerId: string; goals?: number }>,
    newPlayers: Array<{ firstName: string; lastName: string; goals?: number }>
  ): PlayerInTeamRequest[] {
    const existing = existingPlayers.map(player => ({
      playerId: player.playerId,
      goals: player.goals || 0
    }));

    const newOnes = newPlayers.map(player => ({
      newPlayer: {
        firstName: player.firstName,
        lastName: player.lastName
      },
      goals: player.goals || 0
    }));

    return [...existing, ...newOnes];
  }

  // Helper para crear partido rápido (sin goles individuales)
  async addSimpleMatch(
    leagueId: string,
    team1PlayerIds: string[],
    team2PlayerIds: string[],
    team1Score: number,
    team2Score: number,
    matchDate?: Date
  ): Promise<AddMatchResponse> {
    const matchData: AddMatchRequest = {
      team1Score,
      team2Score,
      matchDate: (matchDate || new Date()).toISOString(),
      team1Players: this.createTeamWithExistingPlayers(team1PlayerIds),
      team2Players: this.createTeamWithExistingPlayers(team2PlayerIds)
    };

    return this.addMatch(leagueId, matchData);
  }

  // Validar estructura de partido antes de enviar
  validateMatch(matchData: AddMatchRequest): string[] {
    const errors: string[] = [];

    // Validar que ambos equipos tengan jugadores
    if (!matchData.team1Players.length) {
      errors.push('El equipo 1 debe tener al menos un jugador');
    }

    if (!matchData.team2Players.length) {
      errors.push('El equipo 2 debe tener al menos un jugador');
    }

    // Validar que ambos equipos tengan la misma cantidad
    if (matchData.team1Players.length !== matchData.team2Players.length) {
      errors.push('Ambos equipos deben tener la misma cantidad de jugadores');
    }

    // Validar que cada jugador tenga playerId O newPlayer
    const allPlayers = [...matchData.team1Players, ...matchData.team2Players];
    allPlayers.forEach((player, index) => {
      if (!player.playerId && !player.newPlayer) {
        errors.push(`Jugador ${index + 1}: debe ser existente (playerId) o nuevo (newPlayer)`);
      }
      if (player.playerId && player.newPlayer) {
        errors.push(`Jugador ${index + 1}: no puede ser existente y nuevo al mismo tiempo`);
      }
    });

    // Validar goles no negativos
    allPlayers.forEach((player, index) => {
      if (player.goals < 0) {
        errors.push(`Jugador ${index + 1}: los goles no pueden ser negativos`);
      }
    });

    // Validar puntajes no negativos
    if (matchData.team1Score < 0 || matchData.team2Score < 0) {
      errors.push('Los puntajes no pueden ser negativos');
    }

    // Validar que MVP esté en el partido (si se especifica)
    if (matchData.mvpPlayerId) {
      const allPlayerIds = allPlayers
        .filter(p => p.playerId)
        .map(p => p.playerId);
      
      if (!allPlayerIds.includes(matchData.mvpPlayerId)) {
        errors.push('El jugador MVP debe estar participando en el partido');
      }
    } 

    return errors;
  }

  // Helper para manejo de errores
  private handleError(error: any): Error {
    if (error.response?.status === 404) {
      return new Error('Liga no encontrada');
    }
    
    if (error.response?.status === 403) {
      return new Error('No tenés permisos para agregar partidos a esta liga');
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
}

export default new MatchService();
