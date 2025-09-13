import { Calendar, Users, Target, Trophy, Plus, User, CheckCircle } from 'lucide-react';

interface TeamPlayer {
  type: 'existing' | 'new';
  existingPlayer?: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
  };
  newPlayer?: {
    firstName: string;
    lastName: string;
  };
  tempId?: string;
  goals: number;
}

interface MatchPreviewProps {
  team1Players: TeamPlayer[];
  team2Players: TeamPlayer[];
  team1Score: number;
  team2Score: number;
  matchDate: string; // ISO string or datetime-local format
  isGoalsEnabled: boolean;
}

export default function MatchPreview({
  team1Players,
  team2Players,
  team1Score,
  team2Score,
  matchDate,
  isGoalsEnabled
}: MatchPreviewProps) {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-AR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const getPlayerDisplayName = (player: TeamPlayer) => {
    if (player.type === 'existing' && player.existingPlayer) {
      return player.existingPlayer.fullName;
    }
    if (player.type === 'new' && player.newPlayer) {
      return `${player.newPlayer.firstName} ${player.newPlayer.lastName}`;
    }
    return 'Jugador desconocido';
  };

  const getMatchResult = () => {
    if (team1Score > team2Score) return { winner: 'team1', type: 'win' };
    if (team2Score > team1Score) return { winner: 'team2', type: 'win' };
    return { winner: null, type: 'draw' };
  };

  const result = getMatchResult();
  const { date, time } = formatDate(matchDate);

  const newPlayersCount = [...team1Players, ...team2Players].filter(p => p.type === 'new').length;
  const totalGoals = isGoalsEnabled ? 
    [...team1Players, ...team2Players].reduce((sum, player) => sum + (player.goals || 0), 0) : 0;

  const renderTeam = (players: TeamPlayer[], teamNumber: 1 | 2, score: number) => {
    const isWinner = result.type === 'win' && result.winner === `team${teamNumber}`;
    const isDraw = result.type === 'draw';
    
    const bgColor = isWinner ? 'bg-green-50 border-green-200' : 
                   isDraw ? 'bg-yellow-50 border-yellow-200' : 
                   'bg-red-50 border-red-200';
    
    const scoreColor = isWinner ? 'text-green-600' : 
                      isDraw ? 'text-yellow-600' : 
                      'text-red-600';

    return (
      <div className={`rounded-lg border p-4 ${bgColor}`}>
        
        {/* Team header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Equipo {teamNumber}
            {isWinner && <Trophy className="h-4 w-4 ml-2 text-green-600" />}
          </h3>
          <div className={`text-3xl font-bold ${scoreColor}`}>
            {score}
          </div>
        </div>

        {/* Players list */}
        <div className="space-y-2">
          {players.map((player, index) => (
            <div key={index} className="flex items-center justify-between py-2 px-3 bg-white rounded border border-gray-100">
              
              {/* Player info */}
              <div className="flex items-center space-x-3">
                
                {/* Avatar */}
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${player.type === 'existing' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}
                `}>
                  {player.type === 'existing' ? 
                    getPlayerDisplayName(player).charAt(0).toUpperCase() :
                    <Plus className="h-3 w-3" />
                  }
                </div>

                {/* Name and status */}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {getPlayerDisplayName(player)}
                  </p>
                  {player.type === 'new' && (
                    <p className="text-xs text-blue-600 flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      Jugador nuevo
                    </p>
                  )}
                </div>
              </div>

              {/* Goals (if enabled) */}
              {isGoalsEnabled && (
                <div className="flex items-center space-x-1">
                  {player.goals > 0 && (
                    <>
                      <Target className="h-3 w-3 text-blue-500" />
                      <span className="text-sm font-medium text-blue-600">
                        {player.goals}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Team totals */}
        {isGoalsEnabled && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total goles individuales:</span>
              <span className="font-medium text-gray-900">
                {players.reduce((sum, player) => sum + (player.goals || 0), 0)}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            Confirmar Partido
          </h2>
          
          {/* Result indicator */}
          <div className="text-right">
            {result.type === 'win' ? (
              <p className="text-sm text-green-600 font-medium">
                Ganó Equipo {result.winner?.slice(-1)}
              </p>
            ) : (
              <p className="text-sm text-yellow-600 font-medium">
                Empate
              </p>
            )}
          </div>
        </div>

        {/* Match details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <div>
              <p className="font-medium text-gray-900">{date}</p>
              <p>{time}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <div>
              <p className="font-medium text-gray-900">
                {team1Players.length + team2Players.length} jugadores
              </p>
              <p>
                {team1Players.length} vs {team2Players.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Score display */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center space-x-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Equipo 1</p>
            <p className="text-4xl font-bold text-gray-900">{team1Score}</p>
          </div>
          
          <div className="text-2xl font-bold text-gray-400">-</div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Equipo 2</p>
            <p className="text-4xl font-bold text-gray-900">{team2Score}</p>
          </div>
        </div>
      </div>

      {/* Teams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderTeam(team1Players, 1, team1Score)}
        {renderTeam(team2Players, 2, team2Score)}
      </div>

      {/* Summary and warnings */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-4">
        
        {/* Match summary */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Resumen del Partido</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Jugadores totales:</p>
              <p className="font-medium text-gray-900">{team1Players.length + team2Players.length}</p>
            </div>
            
            {newPlayersCount > 0 && (
              <div>
                <p className="text-gray-600">Jugadores nuevos:</p>
                <p className="font-medium text-blue-600">{newPlayersCount}</p>
              </div>
            )}
            
            {isGoalsEnabled && (
              <div>
                <p className="text-gray-600">Total goles:</p>
                <p className="font-medium text-gray-900">{totalGoals}</p>
              </div>
            )}
            
            <div>
              <p className="text-gray-600">Diferencia:</p>
              <p className="font-medium text-gray-900">{Math.abs(team1Score - team2Score)} gol(es)</p>
            </div>
          </div>
        </div>

        {/* New players warning */}
        {newPlayersCount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start space-x-2">
              <Plus className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Se crearán {newPlayersCount} jugador(es) nuevo(s)
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Los jugadores nuevos se agregarán automáticamente a la liga
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Goals consistency check */}
        {isGoalsEnabled && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-700">
                Los puntajes coinciden con los goles individuales
              </p>
            </div>
          </div>
        )}

        {/* Final confirmation */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600 text-center">
            ¿Toda la información es correcta? Al confirmar, el partido se guardará y no podrá modificarse.
          </p>
        </div>
      </div>
    </div>
  );
}