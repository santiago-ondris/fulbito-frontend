import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Share2, ExternalLink, AlertCircle, Users } from 'lucide-react';
import leagueService, { type League } from '../services/leagueService';
import LeagueHeader from '../components/LeagueView/LeagueHeader';
import PlayerStandings from '../components/LeagueView/PlayerStandings';
import MatchHistory from '../components/LeagueView/MatchHistory';
import ScoringInfo from '../components/LeagueView/ScoringInfo';

export default function LeagueView() {
  const { slug } = useParams<{ slug: string }>();
  const [league, setLeague] = useState<League | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      loadLeague(slug);
    }
  }, [slug]);

  const loadLeague = async (leagueSlug: string) => {
    setIsLoading(true);
    setError('');

    try {
      const leagueData = await leagueService.getLeagueBySlug(leagueSlug);
      setLeague(leagueData);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Liga ${league?.name} - Fulbito`,
          text: `Mirá la tabla de posiciones de ${league?.name}`,
          url: url,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copiado al portapapeles');
      } catch (err) {
        console.error('Error copying to clipboard:', err);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-lg text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-[#f3f1ff]0 mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Liga no encontrada</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link 
              to="/" 
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-[#7600B5] text-white rounded-md text-sm font-medium hover:bg-[#5c0089] transition-colors"
            >
              Volver al inicio
            </Link>
            <p className="text-sm text-gray-500">
              Verificá que el nombre de la liga sea correcto
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No league found
  if (!league) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* League Header */}
      <LeagueHeader
        name={league.name}
        playersPerTeam={league.playersPerTeam}
        totalPlayers={league.playerStandings.length}
        totalMatches={league.matches.length}
        isGoalsEnabled={league.scoring.isGoalsEnabled}
        isWinStreakEnabled={league.scoring.isWinStreakEnabled}
        isLossStreakEnabled={league.scoring.isLossStreakEnabled}
      />

      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 sm:py-0 sm:h-12 space-y-3 sm:space-y-0">
            <Link 
              to="/" 
              className="inline-flex items-center text-[#7600B5] hover:text-[#5c0089] text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Buscar otra liga
            </Link>
            
            <div className="flex items-center justify-between sm:space-x-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Share2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Compartir</span>
                <span className="sm:hidden">Compartir</span>
              </button>

              <Link
                to={`/liga/${slug}/enfrentamientos`}
                className="inline-flex items-center px-4 py-2 bg-[#7600B5] text-white rounded-md text-sm font-medium hover:bg-[#5c0089] transition-colors"
              >
                <Users className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Ver Enfrentamientos</span>
                <span className="sm:hidden">Enfrentamientos</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Player Standings - Full Width */}
          <PlayerStandings
            standings={league.playerStandings}
            isGoalsEnabled={league.scoring.isGoalsEnabled}
            isWinStreakEnabled={league.scoring.isWinStreakEnabled}
            isLossStreakEnabled={league.scoring.isLossStreakEnabled}
            isMvpEnabled={league.scoring.isMvpEnabled}
          />

          {/* Match History - Full Width */}
          <MatchHistory
            matches={league.matches}
            isGoalsEnabled={league.scoring.isGoalsEnabled}
            isMvpEnabled={league.scoring.isMvpEnabled}
          />

          {/* Bottom Section - Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Scoring System Info */}
            <ScoringInfo scoring={league.scoring} />

            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas Rápidas</h3>
              <div className="space-y-3">
                
                {/* Most games played */}
                {league.playerStandings.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Más participativo:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {league.playerStandings.reduce((prev, current) => 
                          (prev.matchesPlayed > current.matchesPlayed) ? prev : current
                        ).fullName}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {Math.max(...league.playerStandings.map(p => p.matchesPlayed))} partidos
                    </div>
                  </div>
                )}

                {/* Most wins */}
                {league.playerStandings.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Más ganador:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {league.playerStandings.reduce((prev, current) => 
                          (prev.matchesWon > current.matchesWon) ? prev : current
                        ).fullName}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {Math.max(...league.playerStandings.map(p => p.matchesWon))} victorias
                    </div>
                  </div>
                )}

                {/* Top scorer if goals enabled */}
                {league.scoring.isGoalsEnabled && league.playerStandings.some(p => (p.goalsFor || 0) > 0) && (
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Goleador:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {league.playerStandings.reduce((prev, current) => 
                          ((prev.goalsFor || 0) > (current.goalsFor || 0)) ? prev : current
                        ).fullName}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {Math.max(...league.playerStandings.map(p => p.goalsFor || 0))} goles
                    </div>
                  </div>
                )}

                {/* Current win streak if enabled */}
                {league.scoring.isWinStreakEnabled && league.playerStandings.some(p => (p.currentWinStreak || 0) > 0) && (
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Mejor racha:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {league.playerStandings.reduce((prev, current) => 
                          ((prev.currentWinStreak || 0) > (current.currentWinStreak || 0)) ? prev : current
                        ).fullName}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {Math.max(...league.playerStandings.map(p => p.currentWinStreak || 0))} victorias seguidas
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Link */}
            <div className="bg-[#fdf2f8] border border-pink-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-pink-900 mb-2">¿Sos el administrador?</h3>
              <p className="text-xs text-[#9f1a57] mb-3">
                Iniciá sesión para agregar partidos y gestionar esta liga
              </p>
              <Link
                to="/login"
                className="inline-flex items-center text-sm font-medium text-[#BF416F] hover:text-[#fdf2f8]0"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Administrar liga
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
