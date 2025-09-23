import { Trophy, Medal, Award, TrendingUp, TrendingDown } from 'lucide-react';
import PlayerAvatar from '../common/PlayerAvatar';

interface PlayerStanding {
  imageUrl?: string;
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

interface PlayerStandingsProps {
  standings: PlayerStanding[];
  isGoalsEnabled: boolean;
  isWinStreakEnabled: boolean;
  isLossStreakEnabled: boolean;
}

export default function PlayerStandings({
  standings,
  isGoalsEnabled,
  isWinStreakEnabled,
  isLossStreakEnabled
}: PlayerStandingsProps) {
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-yellow-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-medium text-gray-500">{position}</span>;
    }
  };

  const getPositionBg = (position: number) => {
    switch (position) {
      case 1:
        return 'bg-yellow-50 border-yellow-200';
      case 2:
        return 'bg-gray-50 border-gray-200';
      case 3:
        return 'bg-yellow-50 border-yellow-100';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Tabla de Posiciones</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posición
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jugador
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Puntos
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                PJ
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                G
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                E
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                P
              </th>
              
              {isGoalsEnabled && (
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Goles
                </th>
              )}
              
              {(isWinStreakEnabled || isLossStreakEnabled) && (
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Racha
                </th>
              )}
              
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                % Asist.
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-200">
            {standings.map((player, index) => {
              const position = index + 1;
              
              return (
                <tr key={player.playerId} className={getPositionBg(position)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getPositionIcon(position)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-6 whitespace-nowrap">
                    <div className="flex items-center">
                      <PlayerAvatar
                        imageUrl={player.imageUrl}
                        firstName={player.firstName}
                        lastName={player.lastName}
                        size="lg"
                        className="mr-4"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {player.fullName}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-lg font-bold text-gray-900">
                      {player.totalPoints}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                    {player.matchesPlayed}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-green-600 font-medium">
                    {player.matchesWon}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-yellow-600 font-medium">
                    {player.matchesDrawn}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-red-600 font-medium">
                    {player.matchesLost}
                  </td>
                  
                  {isGoalsEnabled && (
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-blue-600 font-medium">
                      {player.goalsFor || 0}
                    </td>
                  )}
                  
                  {(isWinStreakEnabled || isLossStreakEnabled) && (
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {player.currentWinStreak && player.currentWinStreak > 0 ? (
                        <span className="inline-flex items-center text-sm text-green-600 font-medium">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {player.currentWinStreak}
                        </span>
                      ) : player.currentLossStreak && player.currentLossStreak > 0 ? (
                        <span className="inline-flex items-center text-sm text-red-600 font-medium">
                          <TrendingDown className="h-4 w-4 mr-1" />
                          {player.currentLossStreak}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                  )}
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                    {player.attendanceRate.toFixed(1)}%
                  </td>
                  
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {standings.length === 0 && (
        <div className="px-6 py-8 text-center text-gray-500">
          <Trophy className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p>Aún no hay partidos jugados en esta liga</p>
        </div>
      )}
    </div>
  );
}