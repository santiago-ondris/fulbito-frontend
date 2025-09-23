import React from 'react';
import { PlusCircle, Users, BarChart3, Settings } from 'lucide-react';

export type AdminSection = 'add-match' | 'players' | 'stats' | 'settings';

interface AdminNavigationProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  newMatchesCount?: number; // Para badge de notificación
  playersCount?: number;
}

interface NavItem {
  id: AdminSection;
  label: string;
  icon: React.ReactNode;
  description: string;
  badge?: number;
}

export default function AdminNavigation({
  activeSection,
  onSectionChange,
  newMatchesCount,
  playersCount
}: AdminNavigationProps) {
  
  const navItems: NavItem[] = [
    {
      id: 'add-match',
      label: 'Agregar Partido',
      icon: <PlusCircle className="h-5 w-5" />,
      description: 'Cargar nuevos resultados',
      badge: newMatchesCount
    },
    {
      id: 'players',
      label: 'Jugadores',
      icon: <Users className="h-5 w-5" />,
      description: 'Gestionar jugadores',
      badge: playersCount
    },
    {
      id: 'stats',
      label: 'Estadísticas',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Ver reportes detallados'
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: <Settings className="h-5 w-5" />,
      description: 'Ajustes de la liga'
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <nav className="flex space-x-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`
                    group relative py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${isActive
                      ? 'border-[#f4e6ff]0 text-[#7600B5]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <span className={isActive ? 'text-[#7600B5]' : 'text-gray-400 group-hover:text-gray-600'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fce7f3] text-pink-800">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {item.description}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="py-3">
            <select
              value={activeSection}
              onChange={(e) => onSectionChange(e.target.value as AdminSection)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#f4e6ff]0 focus:border-[#f4e6ff]0"
            >
              {navItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                  {item.badge !== undefined && item.badge > 0 && ` (${item.badge})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Section Description */}
        <div className="py-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            {navItems.find(item => item.id === activeSection)?.description}
          </p>
        </div>
      </div>
    </div>
  );
}
