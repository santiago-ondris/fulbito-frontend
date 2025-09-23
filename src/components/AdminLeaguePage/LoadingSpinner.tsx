interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'white' | 'green' | 'gray';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = 'green', 
  text,
  className = '' 
}: LoadingSpinnerProps) {
  
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };

  // Color classes
  const colorClasses = {
    white: 'border-white',
    green: 'border-[#7600B5]',
    gray: 'border-gray-600'
  };

  // Text size classes
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <div 
          className={`
            animate-spin rounded-full border-2 border-t-transparent
            ${sizeClasses[size]} 
            ${colorClasses[color]}
          `}
        />
        {text && (
          <p className={`text-gray-600 ${textSizeClasses[size]}`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
