import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, RefreshCw } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useMyLeagues } from '../../hooks/useMyLeagues';
import LeaguesList from '../../components/MyLeagues/LeaguesList';

export default function MyLeagues() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const { leagues, isLoading, error, refetch, isEmpty, hasError } = useMyLeagues();
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Not authenticated (shouldn't happen due to redirect, but just in case)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Navigation breadcrumb */}
          <div className="flex items-center space-x-2 py-3 text-sm text-gray-600">
            <Link 
              to="/" 
              className="hover:text-gray-900 transition-colors"
            >
              Inicio
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Mis Ligas</span>
          </div>

          {/* Main header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-6">
            
            {/* Left side - Title and user info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Mis Ligas</h1>
                  <p className="text-gray-600">
                    Bienvenido, <span className="font-medium">{user?.firstName}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
              
              {/* Refresh button */}
              <button
                onClick={handleRefresh}
                disabled={isLoading || isRefreshing}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Actualizar
              </button>

              {/* Back to home */}
              <Link
                to="/"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Quick stats */}
        {!isLoading && !hasError && leagues.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Total leagues */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total de Ligas
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900">
                      {leagues.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            {/* Total players */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total de Jugadores
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900">
                      {leagues.reduce((sum, league) => sum + league.totalPlayers, 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            {/* Total matches */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total de Partidos
                    </dt>
                    <dd className="text-3xl font-bold text-gray-900">
                      {leagues.reduce((sum, league) => sum + league.totalMatches, 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leagues list */}
        <LeaguesList
          leagues={leagues}
          isLoading={isLoading}
          error={error}
          isEmpty={isEmpty}
          hasError={hasError}
          onRefresh={handleRefresh}
        />
      </main>
    </div>
  );
}