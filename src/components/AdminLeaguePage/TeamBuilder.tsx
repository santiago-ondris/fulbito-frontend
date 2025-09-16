import { useState, useEffect } from 'react';
import { Users, Shuffle, RotateCcw, AlertCircle, Target } from 'lucide-react';
import PlayerSelector, { type SelectedPlayer } from './PlayerSelector';

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

interface TeamPlayer extends SelectedPlayer {
  goals: number; // Goles del jugador en este partido
}

interface TeamBuilderProps {
  availablePlayers: Player[];
  playersPerTeam: number;
  team1Players: TeamPlayer[];
  team2Players: TeamPlayer[];
  onTeam1Change: (players: TeamPlayer[]) => void;
  onTeam2Change: (players: TeamPlayer[]) => void;
  isGoalsEnabled?: boolean;
  disabled?: boolean;
}

export default function TeamBuilder({
  availablePlayers,
  playersPerTeam,
  team1Players,
  team2Players,
  onTeam1Change,
  onTeam2Change,
  isGoalsEnabled = false,
  disabled = false
}: TeamBuilderProps) {

  const [errors, setErrors] = useState<string[]>([]);

  // Get all selected player IDs to avoid duplicates
  const getSelectedPlayerIds = () => {
    const ids = new Set<string>();
    
    [...team1Players, ...team2Players].forEach(teamPlayer => {
      if (teamPlayer && teamPlayer.type === 'existing' && teamPlayer.existingPlayer) {
        ids.add(teamPlayer.existingPlayer.id);
      }
    });
    
    return ids;
  };

  // Get available players excluding already selected ones
  const getAvailablePlayersForSlot = () => {
    const selectedIds = getSelectedPlayerIds();
    return availablePlayers.filter(player => !selectedIds.has(player.id));
  };

  // Validate teams
  useEffect(() => {
    const newErrors: string[] = [];
    
    // Check if teams have correct number of players
    const team1Count = team1Players.filter(p => p).length;
    const team2Count = team2Players.filter(p => p).length;
    
    if (team1Count < playersPerTeam) {
      newErrors.push(`Equipo 1 necesita ${playersPerTeam - team1Count} jugador(es) más`);
    }
    
    if (team2Count < playersPerTeam) {
      newErrors.push(`Equipo 2 necesita ${playersPerTeam - team2Count} jugador(es) más`);
    }
    
    // Check for duplicate players
    const allPlayers = [...team1Players, ...team2Players].filter(p => p);
    const existingPlayerIds = allPlayers
      .filter(p => p.type === 'existing' && p.existingPlayer)
      .map(p => p.existingPlayer!.id);
    
    const uniqueIds = new Set(existingPlayerIds);
    if (existingPlayerIds.length !== uniqueIds.size) {
      newErrors.push('Un jugador no puede estar en ambos equipos');
    }
    
    setErrors(newErrors);
  }, [team1Players, team2Players, playersPerTeam]);

  // Update team player
  const updateTeamPlayer = (
    team: 'team1' | 'team2',
    index: number,
    player: SelectedPlayer | null
  ) => {
    const currentTeam = team === 'team1' ? team1Players : team2Players;
    const updateFunction = team === 'team1' ? onTeam1Change : onTeam2Change;
    
    const newTeam = [...currentTeam];
    
    if (player) {
      newTeam[index] = {
        ...player,
        goals: newTeam[index]?.goals || 0
      };
    } else {
      newTeam.splice(index, 1);
    }
    
    updateFunction(newTeam);
  };

  // Update player goals
  const updatePlayerGoals = (
    team: 'team1' | 'team2',
    index: number,
    goals: number
  ) => {
    const currentTeam = team === 'team1' ? team1Players : team2Players;
    const updateFunction = team === 'team1' ? onTeam1Change : onTeam2Change;
    
    const newTeam = [...currentTeam];
    if (newTeam[index]) {
      newTeam[index] = {
        ...newTeam[index],
        goals: Math.max(0, goals)
      };
      updateFunction(newTeam);
    }
  };


  // Auto-distribute available players randomly
  const autoDistribute = () => {
    if (disabled) return;
    
    const shuffled = [...availablePlayers].sort(() => Math.random() - 0.5);
    const totalNeeded = playersPerTeam * 2;
    
    if (shuffled.length < totalNeeded) {
      return; // Not enough players
    }
    
    const newTeam1: TeamPlayer[] = [];
    const newTeam2: TeamPlayer[] = [];
    
    for (let i = 0; i < playersPerTeam; i++) {
      newTeam1.push({
        type: 'existing',
        existingPlayer: shuffled[i],
        goals: 0
      });
    }
    
    for (let i = playersPerTeam; i < totalNeeded; i++) {
      newTeam2.push({
        type: 'existing',
        existingPlayer: shuffled[i],
        goals: 0
      });
    }
    
    onTeam1Change(newTeam1);
    onTeam2Change(newTeam2);
  };

  // Clear all teams
  const clearTeams = () => {
    if (disabled) return;
    onTeam1Change([]);
    onTeam2Change([]);
  };

  // Render team
  const renderTeam = (
    teamPlayers: TeamPlayer[],
    teamNumber: 1 | 2,
    teamName: string,
    _updateFunction: (players: TeamPlayer[]) => void
  ) => {
    const team = teamNumber === 1 ? 'team1' : 'team2';
    
    // Ensure we show exactly playersPerTeam slots
    const slots = Array.from({ length: playersPerTeam }, (_, index) => {
      return teamPlayers[index] || null;
    });

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Users className="h-5 w-5 mr-2 text-gray-600" />
            {teamName}
          </h3>
          <span className="text-sm text-gray-500">
            {teamPlayers.length} / {playersPerTeam}
          </span>
        </div>
        
        <div className="space-y-3">
          {slots.map((teamPlayer, index) => (
            <div key={index} className="flex items-center space-x-3">
              
              {/* Player selector */}
              <div className="flex-1">
                <PlayerSelector
                  availablePlayers={getAvailablePlayersForSlot()}
                  selectedPlayer={teamPlayer}
                  onPlayerSelect={(player) => updateTeamPlayer(team, index, player)}
                  placeholder={`Jugador ${index + 1}`}
                  disabled={disabled}
                  showCreateOption={true}
                />
              </div>

              {/* Goals input (if enabled) */}
              {isGoalsEnabled && teamPlayer && (
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={teamPlayer.goals}
                    onChange={(e) => updatePlayerGoals(team, index, parseInt(e.target.value) || 0)}
                    disabled={disabled}
                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50"
                    placeholder="0"
                  />
                  <span className="text-xs text-gray-500">goles</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Team totals (if goals enabled) */}
        {isGoalsEnabled && teamPlayers.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total goles:</span>
              <span className="font-medium text-gray-900">
                {teamPlayers.reduce((sum, player) => sum + (player.goals || 0), 0)}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const availableForDistribution = availablePlayers.length >= playersPerTeam * 2;

  return (
    <div className="space-y-6">
      
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Formar Equipos</h2>
          <p className="text-sm text-gray-600">
            Seleccioná {playersPerTeam} jugadores para cada equipo ({playersPerTeam} vs {playersPerTeam})
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={autoDistribute}
            disabled={disabled || !availableForDistribution}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title={!availableForDistribution ? `Se necesitan ${playersPerTeam * 2} jugadores para auto-distribuir` : 'Distribuir jugadores aleatoriamente'}
          >
            <Shuffle className="h-4 w-4 mr-2" />
            Auto
          </button>
          
          <button
            type="button"
            onClick={clearTeams}
            disabled={disabled || (team1Players.length === 0 && team2Players.length === 0)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Limpiar
          </button>
        </div>
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800 mb-1">
                Completá los equipos:
              </h3>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Teams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderTeam(team1Players, 1, 'Equipo 1', onTeam1Change)}
        {renderTeam(team2Players, 2, 'Equipo 2', onTeam2Change)}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-gray-600">
            <p>
              <span className="font-medium">{team1Players.length + team2Players.length}</span> de{' '}
              <span className="font-medium">{playersPerTeam * 2}</span> jugadores seleccionados
            </p>
            {isGoalsEnabled && (
              <p className="mt-1">
                Total goles: {[...team1Players, ...team2Players].reduce((sum, player) => sum + (player.goals || 0), 0)}
              </p>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            Jugadores disponibles: {getAvailablePlayersForSlot().length}
          </div>
        </div>
      </div>
    </div>
  );
}