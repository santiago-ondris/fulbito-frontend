import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import leagueService, { type League } from '../services/leagueService';
import matchupsService, { type MatchupsResponse, type MatchupData } from '../services/matchupsService';

// Components
import PlayerSelector from '../components/MatchupsView/PlayerSelector';
import MatchupResults from '../components/MatchupsView/MatchupResults';
import MatchHistory from '../components/MatchupsView/MatchHistory';
import NoMatchupsFound from '../components/MatchupsView/NoMatchupsFound';

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export default function MatchupsView() {
  const { slug } = useParams<{ slug: string }>();
  
  // State
  const [league, setLeague] = useState<League | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer1, setSelectedPlayer1] = useState<Player | null>(null);
  const [selectedPlayer2, setSelectedPlayer2] = useState<Player | null>(null);
  const [matchupData, setMatchupData] = useState<MatchupData | null>(null);
  
  // Loading states
  const [isLoadingLeague, setIsLoadingLeague] = useState(true);
  const [isLoadingMatchups, setIsLoadingMatchups] = useState(false);
  
  // Errors
  const [leagueError, setLeagueError] = useState('');
  const [matchupsError, setMatchupsError] = useState('');

  // Load league data on mount
  useEffect(() => {
    if (slug) {
      loadLeague(slug);
    }
  }, [slug]);

  // Load matchups when both players are selected
  useEffect(() => {
    if (slug && selectedPlayer1 && selectedPlayer2) {
      loadMatchups(slug, selectedPlayer1.id, selectedPlayer2.id);
    } else {
      setMatchupData(null);
      setMatchupsError('');
    }
  }, [slug, selectedPlayer1, selectedPlayer2]);

  const loadLeague = async (leagueSlug: string) => {
    setIsLoadingLeague(true);
    setLeagueError('');

    try {
      const leagueData = await leagueService.getLeagueBySlug(leagueSlug);
      setLeague(leagueData);
      
      // Extract players from league standings
      const playersFromStandings: Player[] = leagueData.playerStandings.map(standing => ({
        id: standing.playerId,
        firstName: standing.firstName,
        lastName: standing.lastName,
        fullName: `${standing.firstName} ${standing.lastName}`
      }));
      
      setPlayers(playersFromStandings);
    } catch (error: any) {
      setLeagueError(error.message);
    } finally {
      setIsLoadingLeague(false);
    }
  };

  const loadMatchups = async (leagueSlug: string, player1Id: string, player2Id: string) => {
    setIsLoadingMatchups(true);
    setMatchupsError('');

    try {
      // Validate parameters before API call
      const validationErrors = matchupsService.validateMatchupParams(player1Id, player2Id);
      if (validationErrors.length > 0) {
        setMatchupsError(validationErrors[0]);
        return;
      }

      const response: MatchupsResponse = await matchupsService.getMatchups(leagueSlug, player1Id, player2Id);
      
      if (response.success && response.data) {
        setMatchupData(response.data);
      } else {
        setMatchupsError(response.message || 'Error al obtener enfrentamientos');
      }
    } catch (error: any) {
      setMatchupsError(error.message);
    } finally {
      setIsLoadingMatchups(false);
    }
  };

  const handlePlayer1Select = (player: Player) => {
    setSelectedPlayer1(player);
    // Clear player 2 if it's the same as player 1
    if (selectedPlayer2?.id === player?.id) {
      setSelectedPlayer2(null);
    }
  };

  const handlePlayer2Select = (player: Player) => {
    setSelectedPlayer2(player);
    // Clear player 1 if it's the same as player 2
    if (selectedPlayer1?.id === player?.id) {
      setSelectedPlayer1(null);
    }
  };

  const handleRefresh = () => {
    if (slug && selectedPlayer1 && selectedPlayer2) {
      loadMatchups(slug, selectedPlayer1.id, selectedPlayer2.id);
    }
  };

  const handleClearSelection = () => {
    setSelectedPlayer1(null);
    setSelectedPlayer2(null);
    setMatchupData(null);
    setMatchupsError('');
  };

  // Loading state for league
  if (isLoadingLeague) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state for league
  if (leagueError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-lg text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Liga no encontrada</h1>
          <p className="text-gray-600 mb-6">{leagueError}</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const hasSelectedPlayers = selectedPlayer1 && selectedPlayer2;
  const hasMatchupData = matchupData && matchupData.stats.totalMatches > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-gray-900 transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <Link 
              to={`/liga/${slug}`} 
              className="hover:text-gray-900 transition-colors"
            >
              {league?.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Enfrentamientos</span>
          </div>

          {/* Title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Enfrentamientos Directos
              </h1>
              <p className="text-gray-600">
                Compara el historial entre dos jugadores de {league?.name}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-4 sm:mt-0 flex space-x-3">
              {hasSelectedPlayers && (
                <>
                  <button
                    onClick={handleRefresh}
                    disabled={isLoadingMatchups}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingMatchups ? 'animate-spin' : ''}`} />
                    Actualizar
                  </button>
                  
                  <button
                    onClick={handleClearSelection}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Limpiar selección
                  </button>
                </>
              )}
              
              <Link
                to={`/liga/${slug}`}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a la liga
              </Link>
            </div>
          </div>
        </div>

        {/* Player selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <PlayerSelector
              players={players}
              selectedPlayer={selectedPlayer1}
              onPlayerSelect={handlePlayer1Select}
              label="Primer jugador"
              placeholder="Seleccionar primer jugador"
              excludePlayerId={selectedPlayer2?.id}
              disabled={isLoadingMatchups}
            />
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <PlayerSelector
              players={players}
              selectedPlayer={selectedPlayer2}
              onPlayerSelect={handlePlayer2Select}
              label="Segundo jugador"
              placeholder="Seleccionar segundo jugador"
              excludePlayerId={selectedPlayer1?.id}
              disabled={isLoadingMatchups}
            />
          </div>
        </div>

        {/* Content area */}
        <div className="space-y-8">
          
          {/* Loading matchups */}
          {isLoadingMatchups && hasSelectedPlayers && (
            <div className="bg-white rounded-lg border border-gray-200 p-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Buscando enfrentamientos...</p>
              </div>
            </div>
          )}

          {/* Matchups error */}
          {matchupsError && hasSelectedPlayers && !isLoadingMatchups && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    Error al cargar enfrentamientos
                  </h3>
                  <div className="mt-1 text-sm text-red-700">
                    {matchupsError}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Matchup results */}
          {hasMatchupData && !isLoadingMatchups && (
            <>
              <MatchupResults
                stats={matchupData.stats}
                player1={matchupData.player1}
                player2={matchupData.player2}
              />

              <MatchHistory
                matches={matchupData.matches}
                player1={matchupData.player1}
                player2={matchupData.player2}
                isGoalsEnabled={league?.scoring.isGoalsEnabled || false}
              />
            </>
          )}

          {/* No matchups found */}
          {!hasMatchupData && !isLoadingMatchups && !matchupsError && (
            <NoMatchupsFound
              player1Name={selectedPlayer1?.firstName}
              player2Name={selectedPlayer2?.firstName}
              leagueSlug={slug || ''}
              hasSelectedPlayers={!!hasSelectedPlayers}
              totalPlayersInLeague={players.length}
            />
          )}
        </div>
      </div>
    </div>
  );
}