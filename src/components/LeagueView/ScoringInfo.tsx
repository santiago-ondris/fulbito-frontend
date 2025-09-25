import { useState } from 'react';
import { Info, ChevronDown, ChevronUp, Trophy, Target, TrendingUp, TrendingDown } from 'lucide-react';

interface LeagueScoring {
  pointsPerWin: number;
  pointsPerDraw: number;
  pointsPerLoss: number;
  pointsPerMatchPlayed: number;
  isGoalsEnabled: boolean;
  pointsPerGoal: number;
  isWinStreakEnabled: boolean;
  pointsPerWinInStreak: number;
  isLossStreakEnabled: boolean;
  pointsPerLossInStreak: number;
  isMvpEnabled: boolean;
  pointsPerMvp: number;
}

interface ScoringInfoProps {
  scoring: LeagueScoring;
}

export default function ScoringInfo({ scoring }: ScoringInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Info className="h-5 w-5 text-[#BF416F]" />
          <h2 className="text-lg font-medium text-gray-900">Sistema de Puntaje</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-200">
          <div className="mt-4 space-y-4">
            
            {/* Puntajes básicos */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Trophy className="h-4 w-4 mr-2 text-gray-600" />
                Puntajes por Resultado
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-[#f4e6ff] rounded-lg">
                  <div className="text-lg font-bold text-[#7600B5]">+{scoring.pointsPerWin}</div>
                  <div className="text-xs text-[#5c0089]">Victoria</div>
                </div>
                <div className="text-center p-3 bg-[#f7f7f7] rounded-lg">
                  <div className="text-lg font-bold text-[#404040]">+{scoring.pointsPerDraw}</div>
                  <div className="text-xs text-yellow-700">Empate</div>
                </div>
                <div className="text-center p-3 bg-[#f3f1ff] rounded-lg">
                  <div className="text-lg font-bold text-[#856DE2]">
                    {scoring.pointsPerLoss > 0 ? '+' : ''}{scoring.pointsPerLoss}
                  </div>
                  <div className="text-xs text-[#6b56d4]">Derrota</div>
                </div>
                <div className="text-center p-3 bg-[#fdf2f8] rounded-lg">
                  <div className="text-lg font-bold text-[#BF416F]">+{scoring.pointsPerMatchPlayed}</div>
                  <div className="text-xs text-[#9f1a57]">Participar</div>
                </div>
              </div>
            </div>

            {/* Métricas opcionales */}
            {(scoring.isGoalsEnabled || scoring.isWinStreakEnabled || scoring.isLossStreakEnabled || scoring.isMvpEnabled) && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Métricas Adicionales
                </h3>
                <div className="space-y-3">
                  
                  {scoring.isGoalsEnabled && (
                    <div className="flex items-center justify-between p-3 bg-[#fdf2f8] rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-[#BF416F]" />
                        <span className="text-sm font-medium text-pink-900">Goles</span>
                      </div>
                      <span className="text-sm font-bold text-[#BF416F]">
                        +{scoring.pointsPerGoal} por gol
                      </span>
                    </div>
                  )}

                  {scoring.isWinStreakEnabled && (
                    <div className="flex items-center justify-between p-3 bg-[#f4e6ff] rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-[#7600B5]" />
                        <span className="text-sm font-medium text-pink-900">Racha de victorias</span>
                      </div>
                      <span className="text-sm font-bold text-[#7600B5]">
                        +{scoring.pointsPerWinInStreak} por victoria en racha
                      </span>
                    </div>
                  )}

                  {scoring.isLossStreakEnabled && (
                    <div className="flex items-center justify-between p-3 bg-[#f3f1ff] rounded-lg">
                      <div className="flex items-center space-x-2">
                        <TrendingDown className="h-4 w-4 text-[#856DE2]" />
                        <span className="text-sm font-medium text-red-900">Racha de derrotas</span>
                      </div>
                      <span className="text-sm font-bold text-[#856DE2]">
                        {scoring.pointsPerLossInStreak} por derrota en racha
                      </span>
                    </div>
                  )}

                  {scoring.isMvpEnabled && (
                    <div className="flex items-center justify-between p-3 bg-[#fef7f7] rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-4 w-4 text-[#F23869]" />
                        <span className="text-sm font-medium text-purple-900">MVP del Partido</span>
                      </div>
                      <span className="text-sm font-bold text-[#F23869]">
                        +{scoring.pointsPerMvp} puntos
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ejemplo de cálculo */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Ejemplo de cálculo:</h4>
              <p className="text-xs text-gray-600">
                Un jugador que gana un partido obtiene: {scoring.pointsPerWin} (victoria) + {scoring.pointsPerMatchPlayed} (participar)
                {scoring.isGoalsEnabled && ` + ${scoring.pointsPerGoal} por cada gol`}
                {scoring.isWinStreakEnabled && ` + ${scoring.pointsPerWinInStreak} si está en racha`}
                {' = '}
                <span className="font-medium">
                  {scoring.pointsPerWin + scoring.pointsPerMatchPlayed}
                  {scoring.isGoalsEnabled && `+ goles`}
                  {scoring.isWinStreakEnabled && ` + racha`} puntos
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
