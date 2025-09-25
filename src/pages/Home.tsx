import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Users, PlusCircle, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import CeltaImage from '../../public/celta.svg';
import Lunes from '../../public/lunes.jpeg';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#f4e6ff]/30">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 group">
                <div className="relative">
                  <Users className="h-8 w-8 text-[#7600B5] group-hover:animate-heartbeat transition-all duration-300" />
                  <div className="absolute -inset-1 bg-pink-400 rounded-full opacity-30 group-hover:animate-pulse-glow"></div>
                </div>
                <div className="transition-all duration-300 group-hover:scale-105">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-[#5c0089] bg-clip-text text-transparent">
                    Fulbito
                  </h1>
                  <p className="text-xs text-gray-500 group-hover:text-[#7600B5] transition-colors duration-300">
                    Maestro Gringo
                  </p>
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
                  <div className="flex items-center space-x-2 text-sm group">
                    <User className="h-4 w-4 text-gray-500 group-hover:text-[#7600B5] transition-colors duration-300" />
                    <span className="text-gray-700">
                      Hola, <span className="font-medium bg-gradient-to-r from-[#7600B5] to-[#5c0089] bg-clip-text text-transparent">
                        {user.firstName}
                      </span>
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300 transform hover:scale-105"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                // Not authenticated state
                <Link 
                  to="/login"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-[#f4e6ff] hover:border-pink-300 hover:text-[#7600B5] transition-all duration-300 transform hover:scale-105 hover:shadow-md"
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
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 via-[#5c0089] to-[#7600B5] bg-clip-text">
                Buscar Liga
              </h2>
              <p className="text-gray-600 mb-6">
                Ingresá el nombre de tu liga para ver la tabla de posiciones y enfrentamientos
              </p>
              
              <div className="flex space-x-3 group">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-all duration-300 group-focus-within:text-[#f4e6ff]0 group-focus-within:scale-110" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ej: 414, Vlack..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#f4e6ff]0 focus:border-[#f4e6ff]0 transition-all duration-300 focus:shadow-lg focus:scale-105"
                  />
                </div>
                <button
                  onClick={handleLeagueSearch}
                  disabled={!searchQuery.trim()}
                  className="px-8 py-3 bg-gradient-to-r from-[#7600B5] to-[#5c0089] hover:from-[#5c0089] hover:to-pink-800 text-white rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#f4e6ff]0 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  Buscar
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg border border-orange-200 p-6">
              <div className="max-w-sm w-full text-center">
                <img src={Lunes} alt="Futbol lunes" className="w-full h-auto" />
              </div>
            </div>
          </div>

          {/* Admin Actions Sidebar */}
          <div className="space-y-6">
            {isAuthenticated ? (
              // Authenticated sidebar
              <div className="bg-gradient-to-br from-white to-[#f4e6ff]/50 rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-500 group">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative">
                    <User className="h-6 w-6 text-[#7600B5] group-hover:animate-heartbeat" />
                    <div className="absolute -inset-1 bg-pink-400 rounded-full opacity-20 group-hover:animate-pulse-glow"></div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#5c0089] transition-colors duration-300">
                    Panel de Administrador
                  </h3>
                </div>
                <div className="space-y-4">
                  <Link 
                    to="/crear-liga"
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-[#7600B5] to-[#5c0089] hover:from-[#5c0089] hover:to-pink-800 text-white rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#f4e6ff]0 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <PlusCircle className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                    Crear Nueva Liga
                  </Link>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">¿Ya tenés una liga?</p>
                    <Link
                      to="/mis-ligas"
                      className="text-[#7600B5] text-sm font-medium hover:text-[#5c0089] hover:underline transition-all duration-300"
                    >
                      Ver mis ligas →
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              // Not authenticated sidebar
              <div className="bg-gradient-to-br from-white to-[#fdf2f8]/50 rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-all duration-500 group">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative">
                    <LogIn className="h-6 w-6 text-[#BF416F] group-hover:animate-heartbeat" />
                    <div className="absolute -inset-1 bg-pink-400 rounded-full opacity-20 group-hover:animate-pulse-glow"></div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#9f1a57] transition-colors duration-300">
                    ¿Sos administrador?
                  </h3>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Iniciá sesión para crear y administrar tus ligas
                  </p>
                  
                  <Link 
                    to="/login"
                    className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-[#fdf2f8] hover:border-pink-300 hover:text-[#BF416F] transition-all duration-300 transform hover:scale-105 hover:shadow-md"
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


            <div className="bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-center">
              <div className="max-w-sm w-full">
                <img src={CeltaImage} alt="Celta - Hoy Juega" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
