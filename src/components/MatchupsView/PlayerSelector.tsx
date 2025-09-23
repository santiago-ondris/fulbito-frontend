import { useState } from 'react';
import { ChevronDown, Search, User, X } from 'lucide-react';

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

interface PlayerSelectorProps {
  players: Player[];
  selectedPlayer: Player | null;
  onPlayerSelect: (player: Player) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  excludePlayerId?: string;
}

export default function PlayerSelector({
  players,
  selectedPlayer,
  onPlayerSelect,
  placeholder = "Seleccionar jugador",
  label = "Jugador",
  disabled = false,
  excludePlayerId
}: PlayerSelectorProps) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar jugadores disponibles
  const availablePlayers = players.filter(player => 
    player.id !== excludePlayerId &&
    (player.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     player.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     player.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePlayerSelect = (player: Player) => {
    onPlayerSelect(player);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlayerSelect(null as any); // Reset selection
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative">
      
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Selector button */}
      <div className="relative">
        <button
          type="button"
          onClick={handleToggle}
          disabled={disabled}
          className={`
            relative w-full bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#f4e6ff]0 focus:border-[#f4e6ff]0 transition-colors
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'hover:border-gray-400'}
            ${selectedPlayer ? 'text-gray-900' : 'text-gray-500'}
          `}
        >
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-400 mr-2" />
            <span className="block truncate">
              {selectedPlayer ? selectedPlayer.fullName : placeholder}
            </span>
          </div>

          {/* Clear button */}
          {selectedPlayer && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-8 flex items-center pr-2 hover:text-gray-700"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}

          {/* Dropdown arrow */}
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </span>
        </button>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
            
            {/* Search input */}
            <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar jugador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#f4e6ff]0 focus:border-[#f4e6ff]0 text-sm"
                  autoFocus
                />
              </div>
            </div>

            {/* Players list */}
            <div className="py-1">
              {availablePlayers.length > 0 ? (
                availablePlayers.map((player) => (
                  <button
                    key={player.id}
                    type="button"
                    onClick={() => handlePlayerSelect(player)}
                    className={`
                      w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center transition-colors
                      ${selectedPlayer?.id === player.id ? 'bg-[#f4e6ff] text-[#5c0089]' : 'text-gray-900'}
                    `}
                  >
                    <User className="h-4 w-4 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium">{player.fullName}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                  {searchTerm ? 'No se encontraron jugadores' : 'No hay jugadores disponibles'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Backdrop para cerrar dropdown al hacer click fuera */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
