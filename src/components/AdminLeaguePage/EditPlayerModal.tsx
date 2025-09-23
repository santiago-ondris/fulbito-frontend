import React, { useState, useEffect } from 'react';
import { X, Save, User } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  imageUrl?: string;
}

interface EditPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditPlayer: (playerId: string, firstName: string, lastName: string) => Promise<void>;
  player: Player | null; // Player to edit
  existingPlayers?: Array<{ id: string; firstName: string; lastName: string }>; // Para validar duplicados
}

export default function EditPlayerModal({
  isOpen,
  onClose,
  onEditPlayer,
  player,
  existingPlayers = []
}: EditPlayerModalProps) {
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form when player changes or modal opens
  useEffect(() => {
    if (isOpen && player) {
      setFirstName(player.firstName);
      setLastName(player.lastName);
      setError('');
    }
  }, [isOpen, player]);

  // Check for duplicate names (excluding current player)
  const isDuplicate = () => {
    if (!firstName.trim() || !lastName.trim() || !player) return false;
    
    return existingPlayers.some(p => 
      p.id !== player.id && // Exclude current player
      p.firstName.toLowerCase() === firstName.trim().toLowerCase() &&
      p.lastName.toLowerCase() === lastName.trim().toLowerCase()
    );
  };

  // Check if values have changed
  const hasChanges = () => {
    if (!player) return false;
    return firstName.trim() !== player.firstName || lastName.trim() !== player.lastName;
  };

  // Validate form
  const validateForm = () => {
    const errors: string[] = [];
    
    if (!firstName.trim()) {
      errors.push('El nombre es requerido');
    }
    
    if (!lastName.trim()) {
      errors.push('El apellido es requerido');
    }
    
    if (firstName.trim().length > 50) {
      errors.push('El nombre no puede exceder 50 caracteres');
    }
    
    if (lastName.trim().length > 50) {
      errors.push('El apellido no puede exceder 50 caracteres');
    }
    
    // Validate only letters and spaces
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    if (firstName.trim() && !nameRegex.test(firstName.trim())) {
      errors.push('El nombre solo puede contener letras y espacios');
    }
    
    if (lastName.trim() && !nameRegex.test(lastName.trim())) {
      errors.push('El apellido solo puede contener letras y espacios');
    }
    
    if (isDuplicate()) {
      errors.push('Ya existe otro jugador con ese nombre en la liga');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!player) return;
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }
    
    // Check if there are actual changes
    if (!hasChanges()) {
      setError('No hay cambios para guardar');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await onEditPlayer(player.id, firstName.trim(), lastName.trim());
      onClose();
    } catch (error: any) {
      setError(error.message || 'Error al actualizar jugador');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
    setError(''); // Clear errors on change
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);
    setError(''); // Clear errors on change
  };

  // Reset to original values
  const handleReset = () => {
    if (player) {
      setFirstName(player.firstName);
      setLastName(player.lastName);
      setError('');
    }
  };

  if (!isOpen || !player) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-pink-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Editar Jugador
                </h3>
                <p className="text-sm text-gray-500">
                  {player.fullName}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6">
            
            {/* Error message */}
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Changes indicator */}
            {hasChanges() && !error && (
              <div className="mb-4 bg-pink-50 border border-pink-200 rounded-md p-3">
                <p className="text-sm text-pink-600">
                  📝 Hay cambios sin guardar
                </p>
              </div>
            )}

            {/* Form fields */}
            <div className="space-y-4">
              
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => handleFirstNameChange(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Juan"
                  maxLength={50}
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => handleLastNameChange(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Pérez"
                  maxLength={50}
                />
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-md p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">Vista previa:</p>
                    <p className="text-sm font-medium text-gray-900">
                      {firstName.trim()} {lastName.trim()}
                    </p>
                    {isDuplicate() && (
                      <p className="text-xs text-red-600 mt-1">
                        ⚠ Este nombre ya existe en la liga
                      </p>
                    )}
                  </div>
                  
                  {hasChanges() && (
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={isLoading}
                      className="text-xs text-pink-600 hover:text-pink-700 disabled:opacity-50"
                    >
                      Deshacer
                    </button>
                  )}
                </div>
              </div>

              {/* Original values for reference */}
              {hasChanges() && (
                <div className="bg-yellow-50 rounded-md p-3">
                  <p className="text-sm text-yellow-700 mb-1">Nombre original:</p>
                  <p className="text-sm font-medium text-yellow-800">
                    {player.fullName}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0 mt-6">
              
              {/* Cancel */}
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancelar
              </button>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading || !firstName.trim() || !lastName.trim() || isDuplicate() || !hasChanges()}
                className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}