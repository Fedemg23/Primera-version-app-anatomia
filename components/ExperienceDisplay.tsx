import React, { memo } from 'react';

interface ExperienceDisplayProps {
  currentXp: number;
  xpForNextLevel: number;
  level: number;
  onClick?: () => void;
  className?: string;
  levelUpAnimationKey?: string | number;
}

const ExperienceDisplay: React.FC<ExperienceDisplayProps> = memo(({ 
  currentXp, 
  xpForNextLevel, 
  level, 
  onClick,
  className = "",
  levelUpAnimationKey
}) => {
  const xpRatio = xpForNextLevel > 0 ? Math.max(0, Math.min(1, currentXp / xpForNextLevel)) : 0;
  const neededXp = xpForNextLevel > 0 ? Math.max(0, Math.ceil(xpForNextLevel - Math.max(0, currentXp))) : 0;
  
  return (
    <button 
      onClick={onClick}
      className={`group relative bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 transition-all duration-300 hover:bg-slate-700/60 hover:border-slate-600/50 hover:shadow-lg hover:shadow-slate-900/25 active:scale-95 active:bg-slate-700/80 touch-manipulation ${className}`}
      title={`XP ${Math.max(0, Math.floor(currentXp))}/${Math.max(0, Math.floor(xpForNextLevel))}${xpForNextLevel > 0 ? ` · Faltan ${neededXp}` : ''}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-black">XP</span>
          </div>
          <span className="text-slate-300 text-sm font-semibold">Experiencia</span>
        </div>
        <div 
          key={levelUpAnimationKey}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black text-xs px-2 py-1 rounded-full shadow-md animate-level-up-pop"
        >
          Nivel {level}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-slate-700/80 rounded-full h-3 overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
            style={{ width: `${xpRatio * 100}%` }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer"></div>
          </div>
        </div>
        
        {/* Progress text */}
        <div className="flex justify-between items-center mt-2">
          <span className="text-slate-400 text-xs font-semibold">
            {Math.max(0, Math.floor(currentXp)).toLocaleString()} XP
          </span>
          <span className="text-slate-400 text-xs font-semibold">
            {xpForNextLevel > 0 ? `${neededXp.toLocaleString()} restantes` : 'Máximo'}
          </span>
        </div>
      </div>

      {/* Hover indicator */}
      <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-slate-500/60 rounded-full transition-all duration-300 group-hover:bg-slate-400 group-hover:scale-125"></div>
    </button>
  );
});

ExperienceDisplay.displayName = 'ExperienceDisplay';

export default ExperienceDisplay;
