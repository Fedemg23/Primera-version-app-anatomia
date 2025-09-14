import React, { memo } from 'react';

interface ProfileDisplayProps {
  avatar: string;
  name: string;
  level: number;
  onClick?: () => void;
  friendRequestsCount?: number;
  className?: string;
}

const ProfileDisplay: React.FC<ProfileDisplayProps> = memo(({ 
  avatar, 
  name, 
  level, 
  onClick, 
  friendRequestsCount,
  className = ""
}) => {
  return (
    <button 
      onClick={onClick}
      className={`group relative flex items-center gap-4 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-md border-2 border-slate-600/60 rounded-3xl p-4 transition-all duration-300 hover:from-slate-700/80 hover:to-slate-600/80 hover:border-slate-500/70 hover:shadow-xl hover:shadow-slate-900/40 active:scale-95 active:from-slate-600/80 active:to-slate-500/80 touch-manipulation shadow-lg ${className}`}
      title={`Perfil de ${name}`}
    >
      {/* Avatar Container */}
      <div className="relative flex-shrink-0">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-slate-600/60 to-slate-800/60 border-3 border-slate-500/70 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-slate-400/80 group-hover:shadow-lg group-hover:shadow-slate-900/50 group-hover:scale-105 ring-2 ring-slate-700/50 group-hover:ring-slate-600/60">
          {typeof avatar === 'string' && /(png|webp|jpg|jpeg|svg)$/i.test(avatar) ? (
            <img 
              src={avatar} 
              alt="Avatar" 
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-lg" 
            />
          ) : (
            <span className="text-3xl sm:text-4xl transition-transform duration-300 group-hover:scale-110 drop-shadow-lg">
              {avatar}
            </span>
          )}
        </div>
        
        {/* Friend requests notification */}
        {friendRequestsCount && friendRequestsCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-black px-1.5 rounded-full ring-2 ring-slate-900 shadow-lg flex items-center justify-center animate-pulse">
            {Math.min(friendRequestsCount, 9)}{friendRequestsCount > 9 ? '+' : ''}
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-start min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-black text-lg sm:text-xl truncate max-w-32 sm:max-w-40 drop-shadow-lg">
            {name}
          </h3>
        </div>
      </div>

      {/* Hover indicator */}
      <div className="flex flex-col gap-1">
        <div className="w-2 h-2 bg-slate-500/60 rounded-full transition-all duration-300 group-hover:bg-slate-300 group-hover:scale-125"></div>
        <div className="w-1.5 h-1.5 bg-slate-600/60 rounded-full transition-all duration-300 group-hover:bg-slate-400 group-hover:scale-125"></div>
        <div className="w-1 h-1 bg-slate-700/60 rounded-full transition-all duration-300 group-hover:bg-slate-500 group-hover:scale-125"></div>
      </div>
    </button>
  );
});

ProfileDisplay.displayName = 'ProfileDisplay';

export default ProfileDisplay;
