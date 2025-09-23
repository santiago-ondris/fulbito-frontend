import { Users, Search, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NoMatchupsFoundProps {
  player1Name?: string;
  player2Name?: string;
  leagueSlug: string;
  hasSelectedPlayers: boolean;
  totalPlayersInLeague?: number;
}

export default function NoMatchupsFound({
  player1Name,
  player2Name,
  leagueSlug,
  hasSelectedPlayers,
  totalPlayersInLeague = 0
}: NoMatchupsFoundProps) {
  
  // Diferentes estados del componente
  if (!hasSelectedPlayers) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="text-center">
          <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Selecciona dos jugadores
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Elige dos jugadores de la liga para ver su historial de enfrentamientos directos
          </p>
          
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Users className="h-5 w-5 text-pink-500 mt-0.5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-pink-900">
                  ¿Cómo funciona?
                </p>
                <p className="text-sm text-pink-700 mt-1">
                  Los enfrentamientos muestran solo partidos donde ambos jugadores participaron en equipos opuestos o el mismo resultado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado cuando ya se seleccionaron jugadores pero no hay enfrentamientos
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="text-center">
        <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Sin enfrentamientos registrados
        </h3>
        
        <div className="text-gray-600 mb-6 max-w-md mx-auto">
          <p className="mb-2">
            <strong className="text-gray-900">{player1Name}</strong> y{' '}
            <strong className="text-gray-900">{player2Name}</strong> todavia no jugaron en contra
          </p>
          <p className="text-sm">
            Los enfrentamientos aparecen cuando ambos jugadores tienen al menos un partido jugado en contra
          </p>
        </div>

        {/* Estadísticas de la liga */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
          <div className="text-sm text-gray-600">
            <div className="flex justify-between items-center mb-2">
              <span>Jugadores en la liga:</span>
              <span className="font-semibold text-gray-900">{totalPlayersInLeague}</span>
            </div>
            <div className="text-xs text-gray-500">
              Capaz jugaron en el mismo equipo o no coincidieron en el dia
            </div>
          </div>
        </div>

        {/* Sugerencias */}
        <div className="space-y-3 max-w-md mx-auto">
          
          {/* Botón para ver tabla general */}
          <Link
            to={`/liga/${leagueSlug}`}
            className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Ver tabla de la liga
          </Link>

          {/* Mensaje motivacional */}
          <div className="bg-[#f4e6ff] border border-[#d1b3ff] rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Plus className="h-5 w-5 text-[#f4e6ff]0 mt-0.5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-green-900">
                  si llegaste hasta aca
                </p>
                <p className="text-sm text-[#5c0089] mt-1">
                  maestro gringo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alternativa: probar con otros jugadores */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">
            Fijate otro enfrentamiento 
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-sm text-[#7600B5] hover:text-[#5c0089] font-medium transition-colors"
          >
            Elegir otros jugadores
          </button>
        </div>
      </div>
    </div>
  );
}
