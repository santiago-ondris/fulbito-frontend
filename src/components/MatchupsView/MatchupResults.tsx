import { Trophy, TrendingUp, Calendar } from 'lucide-react';
import matchupsService, { type MatchupStats, type PlayerSummary } from '../../services/matchupsService';
import PlayerAvatar from '../common/PlayerAvatar';

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
    <div className="bg-white rounded-lg border border-gray-200 relative">
      
      {/* Header con resumen principal */}
      <div className="px-6 py-6 bg-gradient-to-r from-[#f4e6ff] to-[#fdf2f8] rounded-t-lg">
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

      {/* Player Face-off Section - Desktop Only */}
      <div className="hidden md:block px-6 py-8 bg-gradient-to-r from-[#f4e6ff] via-gray-50 to-[#fdf2f8]">
        <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Player 1 Large Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className={`
                w-80 h-80 rounded-2xl overflow-hidden border-4 shadow-xl transition-all duration-300
                ${winner?.id === player1.id 
                  ? 'border-green-400 ring-4 ring-[#d1b3ff]' 
                  : isDraw 
                  ? 'border-yellow-400 ring-4 ring-yellow-200'
                  : 'border-gray-300'
                }
              `}>
                {player1.imageUrl ? (
                  <img
                    src={player1.imageUrl}
                    alt={`${player1.firstName} ${player1.lastName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full bg-[#e6ccff] flex items-center justify-center">
                            <span class="text-6xl font-bold text-[#5c0089]">
                              ${player1.firstName.charAt(0)}${player1.lastName.charAt(0)}
                            </span>
                          </div>
                        `;
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#e6ccff] flex items-center justify-center">
                    <span className="text-6xl font-bold text-[#5c0089]">
                      {player1.firstName.charAt(0)}{player1.lastName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {player1.fullName}
              </h3>
              <div className="text-4xl font-bold text-[#7600B5] mb-1">
                {stats.player1Wins}
              </div>
              <div className="text-lg text-gray-600">
                victoria{stats.player1Wins !== 1 ? 's' : ''}
              </div>
              <div className="text-sm text-gray-500">
                {player1WinRate}% de victorias
              </div>
            </div>
          </div>

          {/* VS Divider */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center border-4 border-gray-300 shadow-xl">
              <span className="text-2xl font-bold text-gray-700">VS</span>
            </div>
          </div>

          {/* Player 2 Large Avatar */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className={`
                w-80 h-80 rounded-2xl overflow-hidden border-4 shadow-xl transition-all duration-300
                ${winner?.id === player2.id 
                  ? 'border-green-400 ring-4 ring-[#d1b3ff]' 
                  : isDraw 
                  ? 'border-yellow-400 ring-4 ring-yellow-200'
                  : 'border-gray-300'
                }
              `}>
                {player2.imageUrl ? (
                  <img
                    src={player2.imageUrl}
                    alt={`${player2.firstName} ${player2.lastName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full bg-[#fce7f3] flex items-center justify-center">
                            <span class="text-6xl font-bold text-[#9f1a57]">
                              ${player2.firstName.charAt(0)}${player2.lastName.charAt(0)}
                            </span>
                          </div>
                        `;
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#fce7f3] flex items-center justify-center">
                    <span className="text-6xl font-bold text-[#9f1a57]">
                      {player2.firstName.charAt(0)}{player2.lastName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {player2.fullName}
              </h3>
              <div className="text-4xl font-bold text-[#BF416F] mb-1">
                {stats.player2Wins}
              </div>
              <div className="text-lg text-gray-600">
                victoria{stats.player2Wins !== 1 ? 's' : ''}
              </div>
              <div className="text-sm text-gray-500">
                {player2WinRate}% de victorias
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas detalladas */}
      <div className="px-6 py-6">
        
        {/* Comparación visual de victorias */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 md:hidden">
          
          {/* Player 1 stats */}
          <div className={`
            p-4 rounded-lg border-2 transition-colors
            ${winner?.id === player1.id 
              ? 'border-green-300 bg-[#f4e6ff]' 
              : isDraw 
              ? 'border-yellow-300 bg-[#f7f7f7]'
              : 'border-gray-300 bg-gray-50'
            }
          `}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <PlayerAvatar
                  imageUrl={player1.imageUrl}
                  firstName={player1.firstName}
                  lastName={player1.lastName}
                  size="lg"
                  className="mr-3"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {player1.fullName}
                  </h3>
                  {winner?.id === player1.id && (
                    <Trophy className="h-5 w-5 text-[#595959] mx-auto mt-1" />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl font-bold text-[#7600B5]">
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
              ? 'border-green-300 bg-[#f4e6ff]' 
              : isDraw 
              ? 'border-yellow-300 bg-[#f7f7f7]'
              : 'border-gray-300 bg-gray-50'
            }
          `}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <PlayerAvatar
                  imageUrl={player2.imageUrl}
                  firstName={player2.firstName}
                  lastName={player2.lastName}
                  size="lg"
                  className="mr-3"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {player2.fullName}
                  </h3>
                  {winner?.id === player2.id && (
                    <Trophy className="h-5 w-5 text-[#595959] mx-auto mt-1" />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-3xl font-bold text-[#7600B5]">
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
            <div className="bg-[#f7f7f7] border border-yellow-200 rounded-lg p-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-[#404040] mr-2" />
                  <h3 className="font-semibold text-gray-900">Empates</h3>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-[#404040]">
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
                className="bg-[#f4e6ff]0 transition-all duration-500"
                style={{ width: `${player1WinRate}%` }}
                title={`${player1.firstName}: ${player1WinRate}%`}
              />
              {/* Draws */}
              {stats.draws > 0 && (
                <div 
                  className="bg-[#595959] transition-all duration-500"
                  style={{ width: `${drawRate}%` }}
                  title={`Empates: ${drawRate}%`}
                />
              )}
              {/* Player 2 wins */}
              <div 
                className="bg-[#fdf2f8]0 transition-all duration-500"
                style={{ width: `${player2WinRate}%` }}
                title={`${player2.firstName}: ${player2WinRate}%`}
              />
            </div>
            
            {/* Legend */}
            <div className="flex justify-between items-center mt-2 text-xs text-gray-600">
              <span className="flex items-center">
                <div className="w-3 h-3 bg-[#f4e6ff]0 rounded-full mr-1"></div>
                {player1.firstName}
              </span>
              {stats.draws > 0 && (
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-[#595959] rounded-full mr-1"></div>
                  Empates
                </span>
              )}
              <span className="flex items-center">
                <div className="w-3 h-3 bg-[#fdf2f8]0 rounded-full mr-1"></div>
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
              <Trophy className="h-4 w-4 text-[#595959]" />
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
