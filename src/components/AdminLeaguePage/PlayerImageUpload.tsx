import React, { useState, useRef } from 'react';
import { Camera, Check, AlertCircle } from 'lucide-react';
import PlayerAvatar from '../common/PlayerAvatar';

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  imageUrl?: string;
}

interface PlayerImageUploadProps {
  player: Player;
  onImageUpdate: (playerId: string, imageFile: File) => Promise<void>;
}

export default function PlayerImageUpload({
  player,
  onImageUpdate
}: PlayerImageUploadProps) {
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsUploading(true);
    setUploadSuccess(false);

    try {
      await onImageUpdate(player.id, file);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const validateFile = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (file.size > maxSize) {
      return 'La imagen es demasiado grande. Máximo 5MB.';
    }

    if (!allowedTypes.includes(file.type)) {
      return 'Formato no válido. Use JPG, PNG o GIF.';
    }

    return null;
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      
      <PlayerAvatar
        imageUrl={player.imageUrl}
        firstName={player.firstName}
        lastName={player.lastName}
        size="lg"
      />

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 truncate">
          {player.fullName}
        </div>
        <div className="text-xs text-gray-500">
          {player.imageUrl ? 'Imagen actual' : 'Sin imagen'}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        
        {uploadSuccess && (
          <div className="flex items-center text-green-600">
            <Check className="h-4 w-4 mr-1" />
            <span className="text-xs">Actualizada</span>
          </div>
        )}

        {error && (
          <div className="flex items-center text-red-600 max-w-xs">
            <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-xs truncate" title={error}>{error}</span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          onClick={triggerFileSelect}
          disabled={isUploading}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <div className="animate-spin h-3 w-3 mr-2">
                <div className="h-full w-full rounded-full border-2 border-gray-300 border-t-gray-600"></div>
              </div>
              Subiendo...
            </>
          ) : (
            <>
              <Camera className="h-3 w-3 mr-2" />
              {player.imageUrl ? 'Cambiar' : 'Subir'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}