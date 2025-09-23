interface PlayerAvatarProps {
  imageUrl?: string | null;
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function PlayerAvatar({
  imageUrl,
  firstName,
  lastName,
  size = 'md',
  className = ''
}: PlayerAvatarProps) {
  
  const getInitials = () => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm', 
    lg: 'h-10 w-10 text-base',
    xl: 'h-12 w-12 text-lg'
  };

  const baseClasses = `
    ${sizeClasses[size]} 
    rounded-full 
    flex-shrink-0 
    flex 
    items-center 
    justify-center 
    font-medium 
    ${className}
  `.trim();

  if (!imageUrl || imageUrl.trim() === '') {
    return (
      <div className={`${baseClasses} bg-[#e6ccff] text-[#5c0089] border border-[#d1b3ff]`}>
        {getInitials()}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} overflow-hidden bg-[#e6ccff] text-[#5c0089] border border-[#d1b3ff]`}>
      <img
        src={imageUrl}
        alt={`${firstName} ${lastName}`}
        className="h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          const parent = e.currentTarget.parentElement;
          if (parent) {
            parent.innerHTML = getInitials();
          }
        }}
      />
    </div>
  );
}
