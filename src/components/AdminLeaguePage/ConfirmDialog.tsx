import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  isLoading = false
}: ConfirmDialogProps) {
  
  if (!isOpen) return null;

  // Type-based styling
  const typeStyles = {
    danger: {
      icon: 'text-[#856DE2]',
      button: 'bg-[#856DE2] hover:bg-[#6b56d4] focus:ring-[#f3f1ff]0'
    },
    warning: {
      icon: 'text-[#404040]',
      button: 'bg-[#404040] hover:bg-yellow-700 focus:ring-[#595959]'
    },
    info: {
      icon: 'text-[#BF416F]',
      button: 'bg-[#BF416F] hover:bg-[#9f1a57] focus:ring-[#fdf2f8]0'
    }
  };

  const currentStyle = typeStyles[type];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="p-6">
            
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className={`flex-shrink-0 ${currentStyle.icon}`}>
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {title}
              </h3>
            </div>

            {/* Message */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
              
              {/* Cancel button */}
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {cancelText}
              </button>

              {/* Confirm button */}
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${currentStyle.button}`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Procesando...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook para usar el dialog fácilmente
export function useConfirmDialog() {
  const [dialog, setDialog] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [isLoading, setIsLoading] = React.useState(false);

  const showDialog = (options: Omit<typeof dialog, 'isOpen'>) => {
    setDialog({ ...options, isOpen: true });
    setIsLoading(false);
  };

  const hideDialog = () => {
    if (!isLoading) {
      setDialog(prev => ({ ...prev, isOpen: false }));
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await dialog.onConfirm();
      hideDialog();
    } catch (error) {
      // El error se maneja en el onConfirm
    } finally {
      setIsLoading(false);
    }
  };

  const DialogComponent = () => (
    <ConfirmDialog
      isOpen={dialog.isOpen}
      onClose={hideDialog}
      onConfirm={handleConfirm}
      title={dialog.title}
      message={dialog.message}
      type={dialog.type}
      confirmText={dialog.confirmText}
      cancelText={dialog.cancelText}
      isLoading={isLoading}
    />
  );

  return {
    showDialog,
    hideDialog,
    DialogComponent,
    isLoading
  };
}
