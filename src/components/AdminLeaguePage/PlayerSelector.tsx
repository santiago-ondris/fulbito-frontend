import { useState, useRef, useEffect } from 'react';
import { Search, Plus, User, X, Check } from 'lucide-react';

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

interface NewPlayer {
  firstName: string;
  lastName: string;
}

export interface SelectedPlayer {
  type: 'existing' | 'new';
  existingPlayer?: Player;
  newPlayer?: NewPlayer;
  tempId?: string; // Para nuevos jugadores antes de ser creados
}

interface PlayerSelectorProps {
  availablePlayers: Player[]; // Jugadores que se pueden seleccionar
  selectedPlayer: SelectedPlayer | null;
  onPlayerSelect: (player: SelectedPlayer | null) => void;
  placeholder?: string;
  disabled?: boolean;
  showCreateOption?: boolean; // Si mostrar opción de crear nuevo
  className?: string;
}

export default function PlayerSelector({
  availablePlayers,
  selectedPlayer,
  onPlayerSelect,
  placeholder = "Seleccionar jugador...",
  disabled = false,
  showCreateOption = true,
  className = ""
}: PlayerSelectorProps) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newPlayerForm, setNewPlayerForm] = useState({ firstName: '', lastName: '' });
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter available players based on search
  const filteredPlayers = availablePlayers.filter(player =>
    player.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsCreatingNew(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelectExisting = (player: Player) => {
    onPlayerSelect({
      type: 'existing',
      existingPlayer: player
    });
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setSearchTerm('');
  };

  const handleSaveNewPlayer = () => {
    if (!newPlayerForm.firstName.trim() || !newPlayerForm.lastName.trim()) {
      return;
    }

    const tempId = `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    onPlayerSelect({
      type: 'new',
      newPlayer: {
        firstName: newPlayerForm.firstName.trim(),
        lastName: newPlayerForm.lastName.trim()
      },
      tempId
    });

    setIsCreatingNew(false);
    setNewPlayerForm({ firstName: '', lastName: '' });
    setIsOpen(false);
  };

  const handleCancelNewPlayer = () => {
    setIsCreatingNew(false);
    setNewPlayerForm({ firstName: '', lastName: '' });
    setSearchTerm('');
  };

  const handleClear = () => {
    onPlayerSelect(null);
    setSearchTerm('');
  };

  const getDisplayText = () => {
    if (!selectedPlayer) return '';
    
    if (selectedPlayer.type === 'existing' && selectedPlayer.existingPlayer) {
      return selectedPlayer.existingPlayer.fullName;
    }
    
    if (selectedPlayer.type === 'new' && selectedPlayer.newPlayer) {
      return `${selectedPlayer.newPlayer.firstName} ${selectedPlayer.newPlayer.lastName}`;
    }
    
    return '';
  };

  const getDisplayStyle = () => {
    if (!selectedPlayer) return '';
    
    if (selectedPlayer.type === 'new') {
      return 'text-[#9f1a57] bg-[#fdf2f8] border-pink-200';
    }
    
    return 'text-gray-900';
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      
      {/* Main Input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : getDisplayText()}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => !disabled && setIsOpen(true)}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f4e6ff]0 focus:border-[#f4e6ff]0 disabled:bg-gray-50 disabled:cursor-not-allowed pr-8
            ${getDisplayStyle()}
            ${disabled ? 'border-gray-300' : 'border-gray-300 hover:border-gray-400'}
          `}
        />
        
        {/* Clear button */}
        {selectedPlayer && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {/* Search icon */}
        {!selectedPlayer && (
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          
          {!isCreatingNew ? (
            // Normal mode - showing players list
            <>
              {/* Filtered players */}
              {filteredPlayers.length > 0 && (
                <div className="py-1">
                  {filteredPlayers.map((player) => (
                    <button
                      key={player.id}
                      type="button"
                      onClick={() => handleSelectExisting(player)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 transition-colors"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-[#e6ccff] rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-[#5c0089]">
                          {player.firstName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-900">{player.fullName}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* No results */}
              {searchTerm && filteredPlayers.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No se encontraron jugadores con "{searchTerm}"
                </div>
              )}

              {/* Create new option */}
              {showCreateOption && (
                <>
                  {filteredPlayers.length > 0 && <div className="border-t border-gray-200" />}
                  <button
                    type="button"
                    onClick={handleCreateNew}
                    className="w-full px-3 py-2 text-left hover:bg-[#fdf2f8] flex items-center space-x-2 text-[#BF416F] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="text-sm font-medium">Crear nuevo jugador</span>
                  </button>
                </>
              )}
            </>
          ) : (
            // Create new player mode
            <div className="p-3">
              <div className="flex items-center space-x-2 mb-3">
                <User className="h-4 w-4 text-[#BF416F]" />
                <span className="text-sm font-medium text-pink-900">Nuevo Jugador</span>
              </div>
              
              <div className="space-y-2">
                <input
                  type="text"
                  value={newPlayerForm.firstName}
                  onChange={(e) => setNewPlayerForm(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Nombre"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#fdf2f8]0 focus:border-[#fdf2f8]0"
                  maxLength={50}
                />
                <input
                  type="text"
                  value={newPlayerForm.lastName}
                  onChange={(e) => setNewPlayerForm(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Apellido"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#fdf2f8]0 focus:border-[#fdf2f8]0"
                  maxLength={50}
                />
              </div>
              
              <div className="flex justify-end space-x-2 mt-3">
                <button
                  type="button"
                  onClick={handleCancelNewPlayer}
                  className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveNewPlayer}
                  disabled={!newPlayerForm.firstName.trim() || !newPlayerForm.lastName.trim()}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-[#BF416F] rounded hover:bg-[#9f1a57] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Crear
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selected player indicator */}
      {selectedPlayer && selectedPlayer.type === 'new' && (
        <div className="mt-1 text-xs text-[#BF416F] flex items-center">
          <Plus className="h-3 w-3 mr-1" />
          Jugador nuevo (se creará al guardar el partido)
        </div>
      )}
    </div>
  );
}
