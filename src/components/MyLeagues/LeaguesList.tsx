import { PlusCircle, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import LeagueCard from './LeagueCard';
import { type MyLeagueSummary } from '../../services/adminService';

interface LeaguesListProps {
  leagues: MyLeagueSummary[];
  isLoading: boolean;
  error: string;
  isEmpty: boolean;
  hasError: boolean;
  onRefresh: () => void;
}

export default function LeaguesList({
  leagues,
  isLoading,
  error,
  isEmpty,
  hasError,
  onRefresh
}: LeaguesListProps) {

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
            
            <div className="h-16 bg-gray-200 rounded-lg mb-4"></div>
            
            <div className="flex gap-2">
              <div className="flex-1 h-10 bg-gray-200 rounded"></div>
              <div className="flex-1 h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 rounded-lg p-8 max-w-md mx-auto">
          <Trophy className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">
            Error al cargar las ligas
          </h3>
          <p className="text-red-700 mb-4">
            {error}
          </p>
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (isEmpty) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
          <Trophy className="mx-auto h-16 w-16 text-gray-300 mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aún no tenés ligas
          </h3>
          <p className="text-gray-600 mb-6">
            Creá tu primera liga y empezá a llevar el control de tus partidos con amigos
          </p>
          <Link
            to="/crear-liga"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Crear Primera Liga
          </Link>
        </div>
      </div>
    );
  }

  // Normal state - show leagues
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Mis Ligas ({leagues.length})
          </h2>
          <p className="text-gray-600">
            Administrá tus ligas y agregá nuevos partidos
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Link
            to="/crear-liga"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Crear Nueva Liga
          </Link>
        </div>
      </div>

      {/* Leagues grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {leagues.map((league) => (
          <LeagueCard
            key={league.id}
            league={league}
            onRefresh={onRefresh}
          />
        ))}
      </div>

      {/* Footer info */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          {leagues.length === 1 
            ? 'Tenés 1 liga creada' 
            : `Tenés ${leagues.length} ligas creadas`}
        </p>
      </div>
    </div>
  );
}