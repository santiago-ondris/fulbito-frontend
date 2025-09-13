import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Users, PlusCircle, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading, logout } = useAuth();

  const handleLeagueSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Convertir query a slug y navegar
    const slug = convertToSlug(searchQuery);
    navigate(`/liga/${slug}`);
  };

  const convertToSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLeagueSearch();
    }
  };

  const handleLogout = () => {
    logout();
    // Opcional: mostrar mensaje de logout exitoso
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Fulbito</h1>
                  <p className="text-xs text-gray-500">Maestro Gringo</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {isLoading ? (
                // Loading state
                <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
              ) : isAuthenticated && user ? (
                // Authenticated state
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">
                      Hola, <span className="font-medium">{user.firstName}</span>
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                // Not authenticated state
                <Link 
                  to="/login"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Liga Search Section */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Buscar Liga
              </h2>
              <p className="text-gray-600 mb-6">
                Ingresá el nombre de tu liga para ver la tabla de posiciones y estadísticas
              </p>
              
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ej: Liga de los Martes, Fulbito Amigos..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
                <button
                  onClick={handleLeagueSearch}
                  disabled={!searchQuery.trim()}
                  className="px-6 py-3 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Buscar
                </button>
              </div>
            </div>

            {/* Recent or Popular Leagues */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ligas Populares</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium text-gray-900">Liga de los Viernes</p>
                    <p className="text-sm text-gray-500">12 jugadores • 8 partidos</p>
                  </div>
                  <Link 
                    to="/liga/liga-de-los-viernes"
                    className="text-green-600 text-sm font-medium hover:text-green-700"
                  >
                    Ver →
                  </Link>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium text-gray-900">Fulbito Barrio Norte</p>
                    <p className="text-sm text-gray-500">16 jugadores • 15 partidos</p>
                  </div>
                  <Link 
                    to="/liga/fulbito-barrio-norte"
                    className="text-green-600 text-sm font-medium hover:text-green-700"
                  >
                    Ver →
                  </Link>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <p className="font-medium text-gray-900">Champions del Domingo</p>
                    <p className="text-sm text-gray-500">10 jugadores • 12 partidos</p>
                  </div>
                  <Link 
                    to="/liga/champions-del-domingo"
                    className="text-green-600 text-sm font-medium hover:text-green-700"
                  >
                    Ver →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Actions Sidebar */}
          <div className="space-y-6">
            {isAuthenticated ? (
              // Authenticated sidebar
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Panel de Administrador</h3>
                <div className="space-y-4">
                  <Link 
                    to="/crear-liga"
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Crear Nueva Liga
                  </Link>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">¿Ya tenés una liga?</p>
                    <Link
                      to="/mis-ligas"
                      className="text-green-600 text-sm font-medium hover:text-green-700"
                    >
                      Ver mis ligas →
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              // Not authenticated sidebar
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">¿Sos administrador?</h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Iniciá sesión para crear y administrar tus ligas
                  </p>
                  
                  <Link 
                    to="/login"
                    className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Iniciar Sesión
                  </Link>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Con una cuenta podés crear ligas, agregar partidos y gestionar jugadores
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ligas activas</span>
                  <span className="font-medium text-gray-900">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jugadores registrados</span>
                  <span className="font-medium text-gray-900">456</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Partidos jugados</span>
                  <span className="font-medium text-gray-900">1,234</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Todo lo que necesitás para tu liga
            </h2>
            <p className="text-gray-600">
              Llevá el control de tus partidos de fútbol con amigos de manera simple y organizada
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tabla de Posiciones</h3>
              <p className="text-gray-600 text-sm">
                Mirá quién lidera, las rachas y todas las estadísticas de cada jugador
              </p>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <PlusCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Carga de Partidos</h3>
              <p className="text-gray-600 text-sm">
                Agregá resultados, goles y formá los equipos de cada partido fácilmente
              </p>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Acceso Público</h3>
              <p className="text-gray-600 text-sm">
                Compartí tu liga con cualquiera sin necesidad de crear cuentas
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}