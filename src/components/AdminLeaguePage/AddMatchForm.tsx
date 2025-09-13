import { useState, useEffect } from 'react';
import { Calendar, Trophy, Save, Eye, RotateCcw, AlertCircle } from 'lucide-react';
import TeamBuilder from './TeamBuilder';
import LoadingSpinner from './LoadingSpinner';
import MatchPreview from './MatchPreview';

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

interface TeamPlayer {
  type: 'existing' | 'new';
  existingPlayer?: Player;
  newPlayer?: { firstName: string; lastName: string };
  tempId?: string;
  goals: number;
}

interface AddMatchFormProps {
  leagueId: string;
  availablePlayers: Player[];
  playersPerTeam: number;
  isGoalsEnabled: boolean;
  onSubmit: (matchData: MatchData) => Promise<void>;
  onCancel?: () => void;
}

export interface MatchData {
  team1Score: number;
  team2Score: number;
  matchDate: string; // ISO string
  team1Players: TeamPlayer[];
  team2Players: TeamPlayer[];
}

type FormStep = 'teams' | 'scores' | 'preview';

export default function AddMatchForm({
  availablePlayers,
  playersPerTeam,
  isGoalsEnabled,
  onSubmit,
  onCancel
}: AddMatchFormProps) {

  const [currentStep, setCurrentStep] = useState<FormStep>('teams');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [team1Players, setTeam1Players] = useState<TeamPlayer[]>([]);
  const [team2Players, setTeam2Players] = useState<TeamPlayer[]>([]);
  const [team1Score, setTeam1Score] = useState<number>(0);
  const [team2Score, setTeam2Score] = useState<number>(0);
  const [matchDate, setMatchDate] = useState<string>(
    new Date().toISOString().slice(0, 16) // YYYY-MM-DDTHH:MM format for datetime-local
  );

  // Reset error when form changes
  useEffect(() => {
    setError('');
  }, [team1Players, team2Players, team1Score, team2Score, matchDate]);

  // Auto-calculate team scores from individual goals (if goals enabled)
  useEffect(() => {
    if (isGoalsEnabled && currentStep === 'scores') {
      const team1GoalsSum = team1Players.reduce((sum, player) => sum + (player.goals || 0), 0);
      const team2GoalsSum = team2Players.reduce((sum, player) => sum + (player.goals || 0), 0);
      
      // Only auto-update if scores haven't been manually set
      if (team1Score === 0 && team2Score === 0) {
        setTeam1Score(team1GoalsSum);
        setTeam2Score(team2GoalsSum);
      }
    }
  }, [team1Players, team2Players, isGoalsEnabled, currentStep]);

  // Validation functions
  const validateTeams = (): string[] => {
    const errors: string[] = [];
    
    if (team1Players.length !== playersPerTeam) {
      errors.push(`Equipo 1 debe tener exactamente ${playersPerTeam} jugadores`);
    }
    
    if (team2Players.length !== playersPerTeam) {
      errors.push(`Equipo 2 debe tener exactamente ${playersPerTeam} jugadores`);
    }
    
    // Check for duplicate existing players
    const existingPlayerIds = new Set<string>();
    const allPlayers = [...team1Players, ...team2Players];
    
    for (const player of allPlayers) {
      if (player.type === 'existing' && player.existingPlayer) {
        const id = player.existingPlayer.id;
        if (existingPlayerIds.has(id)) {
          errors.push('Un jugador no puede estar en ambos equipos');
          break;
        }
        existingPlayerIds.add(id);
      }
    }
    
    return errors;
  };

  const validateScores = (): string[] => {
    const errors: string[] = [];
    
    if (team1Score < 0 || team2Score < 0) {
      errors.push('Los puntajes no pueden ser negativos');
    }
    
    if (isGoalsEnabled) {
      const team1GoalsSum = team1Players.reduce((sum, player) => sum + (player.goals || 0), 0);
      const team2GoalsSum = team2Players.reduce((sum, player) => sum + (player.goals || 0), 0);
      
      if (team1Score !== team1GoalsSum) {
        errors.push(`Equipo 1: El puntaje (${team1Score}) no coincide con los goles individuales (${team1GoalsSum})`);
      }
      
      if (team2Score !== team2GoalsSum) {
        errors.push(`Equipo 2: El puntaje (${team2Score}) no coincide con los goles individuales (${team2GoalsSum})`);
      }
    }
    
    return errors;
  };

  // Step navigation
  const goToNextStep = () => {
    if (currentStep === 'teams') {
      const teamErrors = validateTeams();
      if (teamErrors.length > 0) {
        setError(teamErrors[0]);
        return;
      }
      setCurrentStep('scores');
    } else if (currentStep === 'scores') {
      const scoreErrors = validateScores();
      if (scoreErrors.length > 0) {
        setError(scoreErrors[0]);
        return;
      }
      setCurrentStep('preview');
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === 'scores') {
      setCurrentStep('teams');
    } else if (currentStep === 'preview') {
      setCurrentStep('scores');
    }
  };

  // Submit match
  const handleSubmit = async () => {
    const teamErrors = validateTeams();
    const scoreErrors = validateScores();
    const allErrors = [...teamErrors, ...scoreErrors];
    
    if (allErrors.length > 0) {
      setError(allErrors[0]);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const matchData: MatchData = {
        team1Score,
        team2Score,
        matchDate: new Date(matchDate).toISOString(),
        team1Players,
        team2Players
      };
      
      await onSubmit(matchData);
    } catch (error: any) {
      setError(error.message || 'Error al guardar el partido');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setTeam1Players([]);
    setTeam2Players([]);
    setTeam1Score(0);
    setTeam2Score(0);
    setMatchDate(new Date().toISOString().slice(0, 16));
    setCurrentStep('teams');
    setError('');
  };

  // Step indicator
  const steps = [
    { key: 'teams', label: 'Equipos', icon: Trophy },
    { key: 'scores', label: 'Puntajes', icon: Trophy },
    { key: 'preview', label: 'Confirmar', icon: Eye }
  ];

  return (
    <div className="space-y-6">
      
      {/* Step indicator */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Agregar Partido</h2>
          
          {/* Steps */}
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const isActive = currentStep === step.key;
              const isCompleted = steps.findIndex(s => s.key === currentStep) > index;
              const Icon = step.icon;
              
              return (
                <div key={step.key} className="flex items-center">
                  <div className={`
                    flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive ? 'bg-green-100 text-green-700' : ''}
                    ${isCompleted ? 'text-green-600' : ''}
                    ${!isActive && !isCompleted ? 'text-gray-500' : ''}
                  `}>
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="mx-2 w-8 h-px bg-gray-300" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Step content */}
      {currentStep === 'teams' && (
        <TeamBuilder
          availablePlayers={availablePlayers}
          playersPerTeam={playersPerTeam}
          team1Players={team1Players}
          team2Players={team2Players}
          onTeam1Change={setTeam1Players}
          onTeam2Change={setTeam2Players}
          isGoalsEnabled={isGoalsEnabled}
          disabled={isLoading}
        />
      )}

      {currentStep === 'scores' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Puntajes y Fecha</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Match date */}
            <div>
              <label htmlFor="matchDate" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha y Hora del Partido
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="datetime-local"
                  id="matchDate"
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50"
                />
              </div>
            </div>

            {/* Team 1 score */}
            <div>
              <label htmlFor="team1Score" className="block text-sm font-medium text-gray-700 mb-2">
                Puntaje Equipo 1
              </label>
              <input
                type="number"
                id="team1Score"
                min="0"
                max="50"
                value={team1Score}
                onChange={(e) => setTeam1Score(parseInt(e.target.value) || 0)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 text-center text-lg font-bold"
              />
            </div>

            {/* Team 2 score */}
            <div>
              <label htmlFor="team2Score" className="block text-sm font-medium text-gray-700 mb-2">
                Puntaje Equipo 2
              </label>
              <input
                type="number"
                id="team2Score"
                min="0"
                max="50"
                value={team2Score}
                onChange={(e) => setTeam2Score(parseInt(e.target.value) || 0)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-50 text-center text-lg font-bold"
              />
            </div>
          </div>

          {/* Goals summary (if enabled) */}
          {isGoalsEnabled && (
            <div className="mt-6 bg-blue-50 rounded-md p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Resumen de Goles</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-700 font-medium">Equipo 1:</p>
                  <p className="text-blue-600">
                    {team1Players.reduce((sum, player) => sum + (player.goals || 0), 0)} goles individuales
                  </p>
                </div>
                <div>
                  <p className="text-blue-700 font-medium">Equipo 2:</p>
                  <p className="text-blue-600">
                    {team2Players.reduce((sum, player) => sum + (player.goals || 0), 0)} goles individuales
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {currentStep === 'preview' && (
        <MatchPreview
          team1Players={team1Players}
          team2Players={team2Players}
          team1Score={team1Score}
          team2Score={team2Score}
          matchDate={matchDate}
          isGoalsEnabled={isGoalsEnabled}
        />
      )}

      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        
        {/* Left side - Reset */}
        <div>
          {(team1Players.length > 0 || team2Players.length > 0) && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reiniciar
            </button>
          )}
        </div>

        {/* Right side - Navigation */}
        <div className="flex space-x-3">
          
          {/* Cancel */}
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancelar
            </button>
          )}

          {/* Previous */}
          {currentStep !== 'teams' && (
            <button
              type="button"
              onClick={goToPreviousStep}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
          )}

          {/* Next / Submit */}
          {currentStep !== 'preview' ? (
            <button
              type="button"
              onClick={goToNextStep}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Partido
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}