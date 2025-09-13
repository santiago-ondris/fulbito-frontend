import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import leagueService, { type CreateLeagueRequest } from '../services/leagueService';

export default function CreateLeague() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Form state
  const [formData, setFormData] = useState<CreateLeagueRequest>({
    name: '',
    playersPerTeam: 5,
    
    // Puntajes obligatorios
    pointsPerWin: 3,
    pointsPerDraw: 1,
    pointsPerLoss: 0,
    pointsPerMatchPlayed: 1,
    
    // Métricas opcionales
    isGoalsEnabled: false,
    pointsPerGoal: 1,
    isWinStreakEnabled: false,
    pointsPerWinInStreak: 2,
    isLossStreakEnabled: false,
    pointsPerLossInStreak: -1,
    
    // Jugadores iniciales
    players: [
      { firstName: '', lastName: '' },
      { firstName: '', lastName: '' },
      { firstName: '', lastName: '' }
    ]
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validar jugadores (filtrar vacíos)
      const validPlayers = formData.players.filter(
        player => player.firstName.trim() && player.lastName.trim()
      );

      if (validPlayers.length === 0) {
        setError('Debés agregar al menos un jugador inicial');
        setIsLoading(false);
        return;
      }

      const leagueData = {
        ...formData,
        players: validPlayers
      };

      const response = await leagueService.createLeague(leagueData);
      
      if (response.success) {
        setSuccess('Liga creada exitosamente! Redirigiendo...');
        setTimeout(() => {
          if (response.slug) {
            navigate(`/admin/liga/${response.leagueId}`);
          } else {
            navigate('/');
          }
        }, 2000);
      } else {
        setError(response.message);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle player changes
  const updatePlayer = (index: number, field: 'firstName' | 'lastName', value: string) => {
    const newPlayers = [...formData.players];
    newPlayers[index][field] = value;
    setFormData({ ...formData, players: newPlayers });
  };

  // Add player
  const addPlayer = () => {
    setFormData({
      ...formData,
      players: [...formData.players, { firstName: '', lastName: '' }]
    });
  };

  // Remove player
  const removePlayer = (index: number) => {
    if (formData.players.length > 1) {
      const newPlayers = formData.players.filter((_, i) => i !== index);
      setFormData({ ...formData, players: newPlayers });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver al inicio
          </Link>
          
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Liga</h1>
              <p className="text-gray-600">Configurá tu liga personalizada con el sistema de puntaje que prefieras</p>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Información básica */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Básica</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Liga *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Liga de los Viernes"
                />
              </div>
              
              <div>
                <label htmlFor="playersPerTeam" className="block text-sm font-medium text-gray-700 mb-2">
                  Jugadores por Equipo *
                </label>
                <select
                  id="playersPerTeam"
                  value={formData.playersPerTeam}
                  onChange={(e) => setFormData({ ...formData, playersPerTeam: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value={5}>5 vs 5</option>
                  <option value={6}>6 vs 6</option>
                  <option value={7}>7 vs 7</option>
                  <option value={8}>8 vs 8</option>
                  <option value={9}>9 vs 9</option>
                  <option value={10}>10 vs 10</option>
                  <option value={11}>11 vs 11</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sistema de puntaje obligatorio */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Sistema de Puntaje</h2>
            <p className="text-gray-600 mb-6">Configurá los puntos que recibe cada jugador por las métricas básicas</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puntos por Victoria
                </label>
                <input
                  type="number"
                  value={formData.pointsPerWin}
                  onChange={(e) => setFormData({ ...formData, pointsPerWin: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puntos por Empate
                </label>
                <input
                  type="number"
                  value={formData.pointsPerDraw}
                  onChange={(e) => setFormData({ ...formData, pointsPerDraw: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puntos por Derrota
                </label>
                <input
                  type="number"
                  value={formData.pointsPerLoss}
                  onChange={(e) => setFormData({ ...formData, pointsPerLoss: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puntos por Participar
                </label>
                <input
                  type="number"
                  value={formData.pointsPerMatchPlayed}
                  onChange={(e) => setFormData({ ...formData, pointsPerMatchPlayed: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>

          {/* Métricas opcionales */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Métricas Opcionales</h2>
            <p className="text-gray-600 mb-6">Activá métricas adicionales para hacer la liga más interesante</p>
            
            <div className="space-y-6">
              
              {/* Goles */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="goalsEnabled"
                  checked={formData.isGoalsEnabled}
                  onChange={(e) => setFormData({ ...formData, isGoalsEnabled: e.target.checked })}
                  className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label htmlFor="goalsEnabled" className="text-sm font-medium text-gray-700">
                    Registrar Goles Individuales
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Permite cargar quién hizo cada gol en los partidos
                  </p>
                  {formData.isGoalsEnabled && (
                    <div className="mt-3 w-32">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Puntos por Gol
                      </label>
                      <input
                        type="number"
                        value={formData.pointsPerGoal}
                        onChange={(e) => setFormData({ ...formData, pointsPerGoal: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Racha de victoria */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="winStreakEnabled"
                  checked={formData.isWinStreakEnabled}
                  onChange={(e) => setFormData({ ...formData, isWinStreakEnabled: e.target.checked })}
                  className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label htmlFor="winStreakEnabled" className="text-sm font-medium text-gray-700">
                    Racha de Victorias
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Puntos extra por cada partido ganado consecutivamente
                  </p>
                  {formData.isWinStreakEnabled && (
                    <div className="mt-3 w-32">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Puntos por Victoria en Racha
                      </label>
                      <input
                        type="number"
                        value={formData.pointsPerWinInStreak}
                        onChange={(e) => setFormData({ ...formData, pointsPerWinInStreak: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Racha de derrota */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="lossStreakEnabled"
                  checked={formData.isLossStreakEnabled}
                  onChange={(e) => setFormData({ ...formData, isLossStreakEnabled: e.target.checked })}
                  className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label htmlFor="lossStreakEnabled" className="text-sm font-medium text-gray-700">
                    Racha de Derrotas
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Puntos negativos por cada partido perdido consecutivamente
                  </p>
                  {formData.isLossStreakEnabled && (
                    <div className="mt-3 w-32">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Puntos por Derrota en Racha
                      </label>
                      <input
                        type="number"
                        value={formData.pointsPerLossInStreak}
                        onChange={(e) => setFormData({ ...formData, pointsPerLossInStreak: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Jugadores iniciales */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Jugadores Iniciales</h2>
            <p className="text-gray-600 mb-6">Agregá los jugadores que van a participar en tu liga</p>
            
            <div className="space-y-3">
              {formData.players.map((player, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={player.firstName}
                      onChange={(e) => updatePlayer(index, 'firstName', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Nombre"
                    />
                    <input
                      type="text"
                      value={player.lastName}
                      onChange={(e) => updatePlayer(index, 'lastName', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Apellido"
                    />
                  </div>
                  {formData.players.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePlayer(index)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addPlayer}
                className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Jugador
              </button>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/"
              className="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Creando Liga...' : 'Crear Liga'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}