import { Link } from 'react-router-dom';
import { ArrowLeft, Settings, ExternalLink, Shield, Users } from 'lucide-react';

interface AdminHeaderProps {
  leagueName: string;
  leagueSlug: string;
  playersPerTeam: number;
  totalPlayers: number;
  totalMatches: number;
}

export default function AdminHeader({
  leagueName,
  leagueSlug,
  playersPerTeam,
  totalPlayers,
  totalMatches
}: AdminHeaderProps) {
  
  const publicUrl = `/liga/${leagueSlug}`;

  return (
    <div className="bg-white border-b border-gray-200">
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
          <Link 
            to={publicUrl}
            className="hover:text-gray-900 transition-colors"
          >
            {leagueName}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Administración</span>
        </div>

        {/* Main header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-6">
          
          {/* Left side - Liga info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-[#7600B5]" />
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e6ccff] text-green-800">
                  Admin
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{leagueName}</h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{playersPerTeam} vs {playersPerTeam}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <span>{totalPlayers} jugadores</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <span>{totalMatches} partidos</span>
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
            
            {/* View public link */}
            <Link
              to={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Liga Pública
            </Link>

            {/* Settings button */}
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors">
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </button>

            {/* Back to home */}
            <Link
              to="/"
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Salir
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
