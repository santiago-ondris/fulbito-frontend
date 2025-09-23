import React, { useState, useEffect } from 'react';
import { X, Plus, User } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlayer: (firstName: string, lastName: string) => Promise<void>;
  existingPlayers?: Array<{ firstName: string; lastName: string }>; // Para validar duplicados
}

export default function AddPlayerModal({
  isOpen,
  onClose,
  onAddPlayer,
  existingPlayers = []
}: AddPlayerModalProps) {
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFirstName('');
      setLastName('');
      setError('');
    }
  }, [isOpen]);

  // Check for duplicate names
  const isDuplicate = () => {
    if (!firstName.trim() || !lastName.trim()) return false;
    
    return existingPlayers.some(player => 
      player.firstName.toLowerCase() === firstName.trim().toLowerCase() &&
      player.lastName.toLowerCase() === lastName.trim().toLowerCase()
    );
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
      errors.push('Ya existe un jugador con ese nombre en la liga');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await onAddPlayer(firstName.trim(), lastName.trim());
      onClose();
    } catch (error: any) {
      setError(error.message || 'Error al agregar jugador');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  // Format name as user types (capitalize first letter)
  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
    setError(''); // Clear errors on change
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);
    setError(''); // Clear errors on change
  };

  if (!isOpen) return null;

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
              <div className="flex-shrink-0 w-8 h-8 bg-[#e6ccff] rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-[#7600B5]" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Agregar Jugador
              </h3>
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
              <div className="mb-4 bg-[#f3f1ff] border border-red-200 rounded-md p-3">
                <p className="text-sm text-[#856DE2]">{error}</p>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f4e6ff]0 focus:border-[#f4e6ff]0 disabled:bg-gray-50 disabled:cursor-not-allowed"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f4e6ff]0 focus:border-[#f4e6ff]0 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Pérez"
                  maxLength={50}
                />
              </div>

              {/* Preview */}
              {firstName.trim() || lastName.trim() ? (
                <div className="bg-gray-50 rounded-md p-3">
                  <p className="text-sm text-gray-600 mb-1">Vista previa:</p>
                  <p className="text-sm font-medium text-gray-900">
                    {firstName.trim()} {lastName.trim()}
                  </p>
                  {isDuplicate() && (
                    <p className="text-xs text-[#856DE2] mt-1">
                      ⚠ Este nombre ya existe en la liga
                    </p>
                  )}
                </div>
              ) : null}
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
                disabled={isLoading || !firstName.trim() || !lastName.trim() || isDuplicate()}
                className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#7600B5] hover:bg-[#5c0089] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f4e6ff]0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Jugador
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
