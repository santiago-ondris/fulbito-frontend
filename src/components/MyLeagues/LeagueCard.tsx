import { Calendar, Users, Trophy, Settings, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import adminService, { type MyLeagueSummary } from '../../services/adminService';

interface LeagueCardProps {
  league: MyLeagueSummary;
  onRefresh?: () => void;
}

export default function LeagueCard({ league }: LeagueCardProps) {
  const status = adminService.getLeagueStatus(league.totalMatches, league.totalPlayers);
  const lastActivity = adminService.formatLastActivity(league.lastMatchDate, league.createdAt);
  const publicUrl = adminService.getPublicLeagueUrl(league.slug);
  const adminUrl = adminService.getAdminLeagueUrl(league.id);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {league.name}
          </h3>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{league.playersPerTeam} vs {league.playersPerTeam}</span>
            </div>
            <span>•</span>
            <span>{league.totalPlayers} jugadores</span>
          </div>
        </div>
        
        {/* Status badge */}
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {league.totalMatches}
          </div>
          <div className="text-xs text-gray-600">
            Partidos jugados
          </div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-900 mb-1 flex items-center justify-center">
            <Calendar className="h-4 w-4 mr-1" />
            Último partido
          </div>
          <div className="text-xs text-gray-600">
            {lastActivity}
          </div>
        </div>
      </div>

      {/* League info */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-xs text-blue-600 mb-1">Liga creada:</div>
        <div className="text-sm font-medium text-blue-800">
          {new Date(league.createdAt).toLocaleDateString('es-AR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2">
        
        {/* Administrar (botón principal) */}
        <Link
          to={adminUrl}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          <Settings className="h-4 w-4 mr-2" />
          Administrar
        </Link>

        {/* Ver liga pública */}
        <Link
          to={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Ver Pública
        </Link>
      </div>

      {/* Quick actions hint */}
      {league.totalMatches === 0 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center">
            <Trophy className="h-4 w-4 text-yellow-600 mr-2" />
            <p className="text-xs text-yellow-700">
              ¡Empezá agregando el primer partido de tu liga!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}