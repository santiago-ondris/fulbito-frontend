import { Trophy, Users, TrendingUp, Calendar } from 'lucide-react';
import matchupsService, { type MatchupStats, type PlayerSummary } from '../../services/matchupsService';

interface MatchupResultsProps {
  stats: MatchupStats;
  player1: PlayerSummary;
  player2: PlayerSummary;
}

export default function MatchupResults({ stats, player1, player2 }: MatchupResultsProps) {
  
  const { winner, isDraw } = matchupsService.getOverallWinner(stats, player1, player2);
  
  // Calcular porcentajes
  const player1WinRate = stats.totalMatches > 0 
    ? Math.round((stats.player1Wins / stats.totalMatches) * 100) 
    : 0;
  const player2WinRate = stats.totalMatches > 0 
    ? Math.round((stats.player2Wins / stats.totalMatches) * 100) 
    : 0;
  const drawRate = stats.totalMatches > 0 
    ? Math.round((stats.draws / stats.totalMatches) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      
      {/* Header con resumen principal */}
      <div className="px-6 py-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Enfrentamientos Directos
          </h2>
          
          {/* Resumen principal */}
          <div className="text-lg text-gray-700 mb-4">
            {stats.summary}
          </div>

          {/* Conteo de partidos */}
          <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {stats.totalMatches} partido{stats.totalMatches !== 1 ? 's' : ''} jugado{stats.totalMatches !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Estadísticas detalladas */}
      <div className="px-6 py-6">
        
        {/* Comparación visual de victorias */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          
          {/* Player 1 stats */}
          <div className={`
            p-4 rounded-lg border-2 transition-colors
            ${winner?.id === player1.id 
              ? 'border-green-300 bg-green-50' 
              : isDraw 
              ? 'border-yellow-300 bg-yellow-50'
              : 'border-gray-300 bg-gray-50'
            }
          `}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-900">
                  {player1.fullName}
                </h3>
                {winner?.id === player1.id && (
                  <Trophy className="h-5 w-5 text-yellow-500 ml-2" />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600">
                  {stats.player1Wins}
                </div>
                <div className="text-sm text-gray-600">
                  victoria{stats.player1Wins !== 1 ? 's' : ''}
                </div>
                <div className="text-xs text-gray-500">
                  {player1WinRate}% de victorias
                </div>
              </div>
            </div>
          </div>

          {/* Player 2 stats */}
          <div className={`
            p-4 rounded-lg border-2 transition-colors
            ${winner?.id === player2.id 
              ? 'border-green-300 bg-green-50' 
              : isDraw 
              ? 'border-yellow-300 bg-yellow-50'
              : 'border-gray-300 bg-gray-50'
            }
          `}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-900">
                  {player2.fullName}
                </h3>
                {winner?.id === player2.id && (
                  <Trophy className="h-5 w-5 text-yellow-500 ml-2" />
                )}
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl font-bold text-green-600">
                  {stats.player2Wins}
                </div>
                <div className="text-sm text-gray-600">
                  victoria{stats.player2Wins !== 1 ? 's' : ''}
                </div>
                <div className="text-xs text-gray-500">
                  {player2WinRate}% de victorias
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empates (si hay) */}
        {stats.draws > 0 && (
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-yellow-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Empates</h3>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.draws}
                  </div>
                  <div className="text-sm text-gray-600">
                    empate{stats.draws !== 1 ? 's' : ''}
                  </div>
                  <div className="text-xs text-gray-500">
                    {drawRate}% de los partidos
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Barra de progreso visual */}
        {stats.totalMatches > 0 && (
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Distribución de resultados
            </div>
            <div className="flex rounded-full overflow-hidden bg-gray-200 h-3">
              {/* Player 1 wins */}
              <div 
                className="bg-green-500 transition-all duration-500"
                style={{ width: `${player1WinRate}%` }}
                title={`${player1.firstName}: ${player1WinRate}%`}
              />
              {/* Draws */}
              {stats.draws > 0 && (
                <div 
                  className="bg-yellow-500 transition-all duration-500"
                  style={{ width: `${drawRate}%` }}
                  title={`Empates: ${drawRate}%`}
                />
              )}
              {/* Player 2 wins */}
              <div 
                className="bg-blue-500 transition-all duration-500"
                style={{ width: `${player2WinRate}%` }}
                title={`${player2.firstName}: ${player2WinRate}%`}
              />
            </div>
            
            {/* Legend */}
            <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
              <span className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                {player1.firstName}
              </span>
              {stats.draws > 0 && (
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                  Empates
                </span>
              )}
              <span className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                {player2.firstName}
              </span>
            </div>
          </div>
        )}

        {/* Mensaje de estado si no hay partidos */}
        {stats.totalMatches === 0 && (
          <div className="text-center py-4">
            <div className="text-gray-500 mb-2">
              Aún no se han enfrentado estos jugadores
            </div>
            <div className="text-sm text-gray-400">
              Los enfrentamientos aparecerán cuando ambos jugadores participen en el mismo partido
            </div>
          </div>
        )}

        {/* Dominancia (solo si hay suficientes partidos) */}
        {stats.totalMatches >= 3 && !isDraw && winner && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>
                <strong className="text-gray-900">{winner.firstName}</strong> domina este enfrentamiento
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}