import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import leagueService, { type League } from '../../services/leagueService';
import matchService from '../../services/matchService';
import playerService from '../../services/playerService';

// Import all admin components
import AdminHeader from '../../components/AdminLeaguePage/AdminHeader';
import AdminNavigation, { type AdminSection } from '../../components/AdminLeaguePage/AdminNavigation';
import LoadingSpinner from '../../components/AdminLeaguePage/LoadingSpinner';
import { useConfirmDialog } from '../../components/AdminLeaguePage/ConfirmDialog';

// Players section components
import PlayersList from '../../components/AdminLeaguePage/PlayersList';
import AddPlayerModal from '../../components/AdminLeaguePage/AddPlayerModal';
import EditPlayerModal from '../../components/AdminLeaguePage/EditPlayerModal';

// Match section components
import AddMatchForm, { type MatchData } from '../../components/AdminLeaguePage/AddMatchForm';
import PlayerImageUpload from '../../components/AdminLeaguePage/PlayerImageUpload';
import { Camera } from 'lucide-react';

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  createdAt: string;
  matchesPlayed?: number;
  matchesWon?: number;
  totalPoints?: number;
  goalsFor?: number;
  imageUrl?: string
}

export default function LeagueAdmin() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showDialog, DialogComponent } = useConfirmDialog();

  // Main state
  const [league, setLeague] = useState<League | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState<AdminSection>('add-match');

  // Modal states
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [isEditPlayerModalOpen, setIsEditPlayerModalOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);

  // Success messages
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load league data
  useEffect(() => {
    if (id && isAuthenticated) {
      loadLeagueData(id);
    }
  }, [id, isAuthenticated]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const loadLeagueData = async (leagueId: string) => {
    setIsLoading(true);
    setError('');

    try {
      const leagueData = await leagueService.getLeagueById(leagueId);
      setLeague(leagueData);

      const playersData: Player[] = leagueData.playerStandings.map(standing => ({
        id: standing.playerId,
        firstName: standing.firstName,
        lastName: standing.lastName,
        fullName: standing.fullName,
        imageUrl: standing.imageUrl,
        createdAt: new Date().toISOString(),
        matchesPlayed: standing.matchesPlayed,
        matchesWon: standing.matchesWon,
        totalPoints: standing.totalPoints,
        goalsFor: standing.goalsFor
      }));
      
      setPlayers(playersData);
    } catch (error: any) {
      setError(error.message || 'Error al cargar la liga');
    } finally {
      setIsLoading(false);
    }
  };

  // Player management functions
  const handleAddPlayer = async (firstName: string, lastName: string) => {
    if (!id) return;

    try {
      const response = await playerService.addPlayer(id, { firstName, lastName });
      
      if (response.success) {
        setSuccessMessage(`Jugador ${firstName} ${lastName} agregado exitosamente`);
        setIsAddPlayerModalOpen(false);
        
        // Add to local state (in real app, you might refetch)
        const newPlayer: Player = {
          id: response.playerId || Date.now().toString(),
          firstName,
          lastName,
          fullName: `${firstName} ${lastName}`,
          createdAt: new Date().toISOString(),
          matchesPlayed: 0,
          matchesWon: 0,
          totalPoints: 0,
          goalsFor: 0
        };
        setPlayers(prev => [...prev, newPlayer]);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const handleEditPlayer = async (playerId: string, firstName: string, lastName: string) => {
    if (!id) return;

    try {
      const response = await playerService.editPlayer(id, playerId, { firstName, lastName });
      
      if (response.success) {
        setSuccessMessage(`Jugador actualizado exitosamente`);
        setIsEditPlayerModalOpen(false);
        setPlayerToEdit(null);
        
        // Update local state
        setPlayers(prev => prev.map(player => 
          player.id === playerId 
            ? { ...player, firstName, lastName, fullName: `${firstName} ${lastName}` }
            : player
        ));
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const handleDeletePlayer = async (player: Player) => {
    if (!id) return;

    showDialog({
      title: 'Eliminar Jugador',
      message: `¿Estás seguro de eliminar a ${player.fullName}? Esta acción no se puede deshacer.${player.matchesPlayed && player.matchesPlayed > 0 ? ' Nota: Este jugador ya participó en partidos.' : ''}`,
      type: 'danger',
      confirmText: 'Eliminar',
      onConfirm: async () => {
        try {
          const response = await playerService.deletePlayer(id, player.id);
          
          if (response.success) {
            setSuccessMessage(`Jugador ${player.fullName} eliminado exitosamente`);
            setPlayers(prev => prev.filter(p => p.id !== player.id));
          }
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    });
  };

  const handleImageUpdate = async (playerId: string, imageFile: File) => {
  if (!id) return;

  try {
    const response = await playerService.updatePlayerImage(id, playerId, imageFile);
    
    if (response.success) {
      setSuccessMessage('Imagen actualizada exitosamente');
      
      setPlayers(prev => prev.map(player => 
        player.id === playerId 
          ? { ...player, imageUrl: response.imageUrl }
          : player
      ));
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

  // Match management functions
  const handleAddMatch = async (matchData: MatchData) => {
    if (!id) return;

    try {
      // Convert TeamPlayer to the format expected by matchService
      const team1Players = matchData.team1Players.map(tp => ({
        playerId: tp.type === 'existing' ? tp.existingPlayer?.id : undefined,
        newPlayer: tp.type === 'new' ? tp.newPlayer : undefined,
        goals: tp.goals
      }));

      const team2Players = matchData.team2Players.map(tp => ({
        playerId: tp.type === 'existing' ? tp.existingPlayer?.id : undefined,
        newPlayer: tp.type === 'new' ? tp.newPlayer : undefined,
        goals: tp.goals
      }));

      const addMatchRequest = {
        team1Score: matchData.team1Score,
        team2Score: matchData.team2Score,
        matchDate: matchData.matchDate,
        team1Players,
        team2Players,
        mvpPlayerId: matchData.mvpPlayerId
      };

      const response = await matchService.addMatch(id, addMatchRequest);
      
      if (response.success) {
        setSuccessMessage('Partido agregado exitosamente');
        // Reload league data to get updated stats
        await loadLeagueData(id);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando panel de administración..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-lg text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // No league found
  if (!league) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-lg text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Liga no encontrada</h1>
          <p className="text-gray-600 mb-6">No se pudo cargar la información de la liga</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <AdminHeader
        leagueName={league.name}
        leagueSlug={league.slug}
        playersPerTeam={league.playersPerTeam}
        totalPlayers={players.length}
        totalMatches={league.matches.length}
      />

      {/* Navigation */}
      <AdminNavigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        playersCount={players.length}
      />

      {/* Success message */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeSection === 'add-match' && (
          <AddMatchForm
            leagueId={league.id}
            availablePlayers={players}
            playersPerTeam={league.playersPerTeam}
            isGoalsEnabled={league.scoring.isGoalsEnabled}
            onSubmit={handleAddMatch}
            isMvpEnabled={true}
          />
        )}

        {activeSection === 'players' && (
          <div className="space-y-6">
            
            {/* Players header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900">Gestión de Jugadores</h2>
              <button
                onClick={() => setIsAddPlayerModalOpen(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Agregar Jugador
              </button>
            </div>

            {/* Players list */}
            <PlayersList
              players={players}
              onEditPlayer={(player) => {
                setPlayerToEdit(player);
                setIsEditPlayerModalOpen(true);
              }}
              onDeletePlayer={handleDeletePlayer}
              isGoalsEnabled={league.scoring.isGoalsEnabled}
            />

            {/* Player Images Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Imágenes de Jugadores</h3>
                <div className="text-sm text-gray-500">
                  {players.filter(p => p.imageUrl).length}/{players.length} con imagen
                </div>
              </div>

              {players.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Camera className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p>No hay jugadores en esta liga</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {players.map(player => (
                    <PlayerImageUpload
                      key={player.id}
                      player={player}
                      onImageUpdate={handleImageUpdate}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'stats' && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Estadísticas Detalladas</h2>
            <p className="text-gray-600">Esta sección estará disponible próximamente</p>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuración de Liga</h2>
            <p className="text-gray-600">Esta sección estará disponible próximamente</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddPlayerModal
        isOpen={isAddPlayerModalOpen}
        onClose={() => setIsAddPlayerModalOpen(false)}
        onAddPlayer={handleAddPlayer}
        existingPlayers={players}
      />

      <EditPlayerModal
        isOpen={isEditPlayerModalOpen}
        onClose={() => {
          setIsEditPlayerModalOpen(false);
          setPlayerToEdit(null);
        }}
        onEditPlayer={handleEditPlayer}
        player={playerToEdit}
        existingPlayers={players}
      />

      {/* Confirm dialog */}
      <DialogComponent />
    </div>
  );
}