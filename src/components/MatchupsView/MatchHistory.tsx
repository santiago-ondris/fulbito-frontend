import { Calendar, Trophy, Target } from 'lucide-react';
import matchupsService, { type MatchupHistory, type PlayerSummary } from '../../services/matchupsService';

interface MatchHistoryProps {
  matches: MatchupHistory[];
  player1: PlayerSummary;
  player2: PlayerSummary;
  isGoalsEnabled: boolean;
}

export default function MatchHistory({ 
  matches, 
  player1, 
  player2, 
  isGoalsEnabled 
}: MatchHistoryProps) {
  
  if (matches.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Historial de Partidos
        </h3>
        <div className="text-center py-8">
          <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">
            No hay partidos registrados entre estos jugadores
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Historial de Partidos
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {matches.length} partido{matches.length !== 1 ? 's' : ''} jugado{matches.length !== 1 ? 's' : ''} entre ambos
        </p>
      </div>

      {/* Matches list */}
      <div className="divide-y divide-gray-200">
        {matches.map((match, index) => {
          const formattedDate = matchupsService.formatMatchDate(match.matchDate);
          const resultClass = getResultClass(match.result, player1.firstName, player2.firstName);

          return (
            <div key={match.matchId} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              
              {/* Match header */}
              <div className="flex items-center justify-between mb-3">
                
                {/* Date and match number */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formattedDate}
                  </div>
                  <span className="text-xs text-gray-400">
                    Partido #{matches.length - index}
                  </span>
                </div>

                {/* Result badge */}
                <span className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${resultClass}
                `}>
                  {match.result}
                </span>
              </div>

              {/* Score */}
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-bold text-gray-900">
                      Equipo 1
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {match.team1Score}
                      </span>
                      <span className="text-gray-400">-</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {match.team2Score}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      Equipo 2
                    </span>
                  </div>
                </div>
              </div>

              {/* Players details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Player 1 */}
                <div className={`
                  p-3 rounded-lg border-2 transition-colors
                  ${match.player1Details.wasInWinningTeam 
                    ? 'border-purple-200 bg-purple-50' 
                    : match.result === 'Empate' 
                    ? 'border-black-200 bg-black-50'
                    : 'border-white-200 bg-white-50'
                  }
                `}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {player1.fullName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {match.player1Details.wasInWinningTeam 
                          ? '🏆 Victoria' 
                          : match.result === 'Empate' 
                          ? '🤝 Empate'
                          : '❌ Derrota'
                        }
                      </p>
                    </div>
                    
                    {/* Goals (if enabled) */}
                    {isGoalsEnabled && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Target className="h-4 w-4" />
                        <span>{match.player1Details.goals} gol{match.player1Details.goals !== 1 ? 'es' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Player 2 */}
                <div className={`
                  p-3 rounded-lg border-2 transition-colors
                  ${match.player2Details.wasInWinningTeam 
                    ? 'border-purple-200 bg-purple-50' 
                    : match.result === 'Empate' 
                    ? 'border-black-200 bg-black-50'
                    : 'border-white-200 bg-white-50'
                  }
                `}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {player2.fullName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {match.player2Details.wasInWinningTeam 
                          ? '🏆 Victoria' 
                          : match.result === 'Empate' 
                          ? '🤝 Empate'
                          : '❌ Derrota'
                        }
                      </p>
                    </div>
                    
                    {/* Goals (if enabled) */}
                    {isGoalsEnabled && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Target className="h-4 w-4" />
                        <span>{match.player2Details.goals} gol{match.player2Details.goals !== 1 ? 'es' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Helper function para obtener clases CSS del resultado
function getResultClass(result: string, player1Name: string, player2Name: string): string {
  if (result === 'Empate') {
    return 'bg-black-100 text-black-800';
  }
  if (result.includes(`Victoria de ${player1Name}`) || result.includes(`Victoria de ${player2Name}`)) {
    return 'bg-purple-100 text-purple-800';
  }
  return 'bg-white-100 text-white-800';
}