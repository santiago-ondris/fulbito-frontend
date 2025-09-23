import { Edit2, Trash2, User, Calendar } from 'lucide-react';

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  createdAt: string;
  // Stats opcionales (si ya jugó partidos)
  matchesPlayed?: number;
  matchesWon?: number;
  totalPoints?: number;
  goalsFor?: number;
}

interface PlayersListProps {
  players: Player[];
  onEditPlayer: (player: Player) => void;
  onDeletePlayer: (player: Player) => void;
  isLoading?: boolean;
  isGoalsEnabled?: boolean;
}

export default function PlayersList({
  players,
  onEditPlayer,
  onDeletePlayer,
  isLoading = false,
  isGoalsEnabled = false
}: PlayersListProps) {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const hasStats = players.some(player => 
    player.matchesPlayed !== undefined && player.matchesPlayed > 0
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <User className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay jugadores</h3>
        <p className="text-gray-600">Agregá jugadores para empezar a crear partidos</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Jugadores ({players.length})
        </h2>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jugador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agregado
              </th>
              {hasStats && (
                <>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partidos
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Victorias
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Puntos
                  </th>
                  {isGoalsEnabled && (
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Goles
                    </th>
                  )}
                </>
              )}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-200">
            {players.map((player) => (
              <tr key={player.id} className="hover:bg-gray-50">
                
                {/* Player name */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-700">
                        {player.firstName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {player.fullName}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Created date */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(player.createdAt)}
                  </div>
                </td>

                {/* Stats columns (if player has played) */}
                {hasStats && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {player.matchesPlayed || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-purple-600 font-medium">
                      {player.matchesWon || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-900">
                      {player.totalPoints || 0}
                    </td>
                    {isGoalsEnabled && (
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-pink-600 font-medium">
                        {player.goalsFor || 0}
                      </td>
                    )}
                  </>
                )}

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEditPlayer(player)}
                      className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 p-1 rounded transition-colors"
                      title="Editar jugador"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeletePlayer(player)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                      title="Eliminar jugador"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-gray-200">
        {players.map((player) => (
          <div key={player.id} className="p-4">
            
            {/* Player header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-700">
                    {player.firstName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {player.fullName}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(player.createdAt)}
                  </p>
                </div>
              </div>
              
              {/* Mobile actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditPlayer(player)}
                  className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 p-2 rounded transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeletePlayer(player)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Player stats (mobile) */}
            {hasStats && (player.matchesPlayed || 0) > 0 && (
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs text-gray-600">Partidos</p>
                  <p className="text-sm font-medium text-gray-900">{player.matchesPlayed}</p>
                </div>
                <div className="bg-purple-50 rounded p-2">
                  <p className="text-xs text-purple-600">Victorias</p>
                  <p className="text-sm font-medium text-purple-700">{player.matchesWon}</p>
                </div>
                <div className="bg-pink-50 rounded p-2">
                  <p className="text-xs text-pink-600">Puntos</p>
                  <p className="text-sm font-medium text-pink-700">{player.totalPoints}</p>
                </div>
                {isGoalsEnabled && (
                  <div className="bg-yellow-50 rounded p-2">
                    <p className="text-xs text-yellow-600">Goles</p>
                    <p className="text-sm font-medium text-yellow-700">{player.goalsFor}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}