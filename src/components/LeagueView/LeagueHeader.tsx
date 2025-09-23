import { Users, Calendar, Trophy, Target } from 'lucide-react';

interface LeagueHeaderProps {
  name: string;
  playersPerTeam: number;
  totalPlayers: number;
  totalMatches: number;
  isGoalsEnabled: boolean;
  isWinStreakEnabled: boolean;
  isLossStreakEnabled: boolean;
}

export default function LeagueHeader({
  name,
  playersPerTeam,
  totalPlayers,
  totalMatches,
  isGoalsEnabled,
  isWinStreakEnabled,
  isLossStreakEnabled
}: LeagueHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          
          {/* Liga Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Trophy className="h-8 w-8 text-[#7600B5]" />
              <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{playersPerTeam} vs {playersPerTeam}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>{totalPlayers} jugadores</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{totalMatches} partidos jugados</span>
              </div>
            </div>
          </div>

          {/* Liga Features */}
          <div className="mt-4 lg:mt-0">
            <div className="flex flex-wrap gap-2">
              {isGoalsEnabled && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fce7f3] text-pink-800">
                  Goles individuales
                </span>
              )}
              
              {isWinStreakEnabled && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e6ccff] text-green-800">
                  Rachas de victoria
                </span>
              )}
              
              {isLossStreakEnabled && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Rachas de derrota
                </span>
              )}
              
              {!isGoalsEnabled && !isWinStreakEnabled && !isLossStreakEnabled && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Liga básica
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
