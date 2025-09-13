import { Calendar, Users, Target } from 'lucide-react';

interface PlayerInMatch {
  playerId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  goals: number;
}

interface MatchSummary {
  matchId: string;
  matchDate: string;
  team1Score: number;
  team2Score: number;
  team1Players: PlayerInMatch[];
  team2Players: PlayerInMatch[];
}

interface MatchHistoryProps {
  matches: MatchSummary[];
  isGoalsEnabled: boolean;
}

export default function MatchHistory({ matches, isGoalsEnabled }: MatchHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getResultColor = (team1Score: number, team2Score: number, isTeam1: boolean) => {
    if (team1Score === team2Score) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    
    const isWinner = isTeam1 ? team1Score > team2Score : team2Score > team1Score;
    return isWinner 
      ? 'text-green-600 bg-green-50 border-green-200' 
      : 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Historial de Partidos</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {matches.length > 0 ? (
          matches.map((match) => (
            <div key={match.matchId} className="p-6">
              {/* Match Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(match.matchDate)}</span>
                </div>
                
                {/* Score */}
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {match.team1Score} - {match.team2Score}
                    </div>
                  </div>
                </div>
              </div>

              {/* Teams */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Team 1 */}
                <div className={`rounded-lg border p-4 ${getResultColor(match.team1Score, match.team2Score, true)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Equipo 1
                    </h3>
                    <span className="text-xl font-bold">{match.team1Score}</span>
                  </div>
                  
                  <div className="space-y-2">
                    {match.team1Players.map((player) => (
                      <div key={player.playerId} className="flex items-center justify-between text-sm">
                        <span>{player.fullName}</span>
                        {isGoalsEnabled && player.goals > 0 && (
                          <span className="flex items-center text-blue-600 font-medium">
                            <Target className="h-3 w-3 mr-1" />
                            {player.goals}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team 2 */}
                <div className={`rounded-lg border p-4 ${getResultColor(match.team1Score, match.team2Score, false)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Equipo 2
                    </h3>
                    <span className="text-xl font-bold">{match.team2Score}</span>
                  </div>
                  
                  <div className="space-y-2">
                    {match.team2Players.map((player) => (
                      <div key={player.playerId} className="flex items-center justify-between text-sm">
                        <span>{player.fullName}</span>
                        {isGoalsEnabled && player.goals > 0 && (
                          <span className="flex items-center text-blue-600 font-medium">
                            <Target className="h-3 w-3 mr-1" />
                            {player.goals}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-center text-gray-500">
            <Calendar className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>Aún no se han jugado partidos en esta liga</p>
          </div>
        )}
      </div>
    </div>
  );
}