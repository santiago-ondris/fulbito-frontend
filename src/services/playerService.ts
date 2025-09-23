import api from './api';

// Tipos para jugadores
export interface AddPlayerRequest {
  firstName: string;
  lastName: string;
}

export interface EditPlayerRequest {
  firstName: string;
  lastName: string;
}

export interface AddPlayerResponse {
  success: boolean;
  message: string;
  playerId?: string;
}

export interface EditPlayerResponse {
  success: boolean;
  message: string;
}

export interface DeletePlayerResponse {
  success: boolean;
  message: string;
}

export interface UpdatePlayerImageResponse {
  success: boolean;
  message: string;
  imageUrl?: string;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  leagueId: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
}

class PlayerService {
  // Agregar jugador a liga
  async addPlayer(leagueId: string, playerData: AddPlayerRequest): Promise<AddPlayerResponse> {
    try {
      const response = await api.post<AddPlayerResponse>(
        `/api/leagues/${leagueId}/players`,
        playerData
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Editar jugador existente
  async editPlayer(
    leagueId: string, 
    playerId: string, 
    playerData: EditPlayerRequest
  ): Promise<EditPlayerResponse> {
    try {
      const response = await api.put<EditPlayerResponse>(
        `/api/leagues/${leagueId}/players/${playerId}`,
        playerData
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Eliminar jugador (solo si no tiene partidos)
  async deletePlayer(leagueId: string, playerId: string): Promise<DeletePlayerResponse> {
    try {
      const response = await api.delete<DeletePlayerResponse>(
        `/api/leagues/${leagueId}/players/${playerId}`
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async updatePlayerImage(
    leagueId: string, 
    playerId: string, 
    imageFile: File
  ): Promise<UpdatePlayerImageResponse> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
  
      const response = await api.post<UpdatePlayerImageResponse>(
        `/api/leagues/${leagueId}/players/${playerId}/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Helper para agregar múltiples jugadores
  async addMultiplePlayers(
    leagueId: string, 
    players: AddPlayerRequest[]
  ): Promise<{ success: AddPlayerResponse[]; failed: { player: AddPlayerRequest; error: string }[] }> {
    const success: AddPlayerResponse[] = [];
    const failed: { player: AddPlayerRequest; error: string }[] = [];

    for (const player of players) {
      try {
        const result = await this.addPlayer(leagueId, player);
        success.push(result);
      } catch (error: any) {
        failed.push({ player, error: error.message });
      }
    }

    return { success, failed };
  }

  // Validar datos de jugador
  validatePlayerData(playerData: AddPlayerRequest | EditPlayerRequest): string[] {
    const errors: string[] = [];

    if (!playerData.firstName?.trim()) {
      errors.push('El nombre es requerido');
    }

    if (!playerData.lastName?.trim()) {
      errors.push('El apellido es requerido');
    }

    if (playerData.firstName?.length > 50) {
      errors.push('El nombre no puede exceder 50 caracteres');
    }

    if (playerData.lastName?.length > 50) {
      errors.push('El apellido no puede exceder 50 caracteres');
    }

    // Validar caracteres especiales si querés
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (playerData.firstName && !nameRegex.test(playerData.firstName)) {
      errors.push('El nombre solo puede contener letras y espacios');
    }

    if (playerData.lastName && !nameRegex.test(playerData.lastName)) {
      errors.push('El apellido solo puede contener letras y espacios');
    }

    return errors;
  }

  // Helper para formatear nombre completo
  formatFullName(firstName: string, lastName: string): string {
    return `${firstName.trim()} ${lastName.trim()}`;
  }

  // Helper para crear estructura de jugador para forms
  createPlayerFromForm(formData: FormData): AddPlayerRequest {
    return {
      firstName: (formData.get('firstName') as string)?.trim() || '',
      lastName: (formData.get('lastName') as string)?.trim() || ''
    };
  }

  // Helper para normalizar nombres (capitalizar primera letra)
  normalizePlayerData(playerData: AddPlayerRequest | EditPlayerRequest): AddPlayerRequest | EditPlayerRequest {
    return {
      firstName: this.capitalizeFirstLetter(playerData.firstName?.trim() || ''),
      lastName: this.capitalizeFirstLetter(playerData.lastName?.trim() || '')
    };
  }

  private capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  // Helper para buscar jugador por nombre en lista
  findPlayerByName(
    players: Player[], 
    firstName: string, 
    lastName: string
  ): Player | undefined {
    return players.find(player => 
      player.firstName.toLowerCase() === firstName.toLowerCase() &&
      player.lastName.toLowerCase() === lastName.toLowerCase()
    );
  }

  // Helper para verificar si un nombre ya existe
  isPlayerNameDuplicate(
    players: Player[], 
    firstName: string, 
    lastName: string, 
    excludePlayerId?: string
  ): boolean {
    return players.some(player => 
      player.id !== excludePlayerId &&
      player.firstName.toLowerCase() === firstName.toLowerCase() &&
      player.lastName.toLowerCase() === lastName.toLowerCase()
    );
  }

  // Helper para manejo de errores
  private handleError(error: any): Error {
    if (error.response?.status === 404) {
      return new Error('Liga o jugador no encontrado');
    }
    
    if (error.response?.status === 403) {
      return new Error('No tenés permisos para gestionar jugadores en esta liga');
    }

    if (error.response?.status === 409) {
      return new Error('Ya existe un jugador con ese nombre en la liga');
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

export default new PlayerService();
