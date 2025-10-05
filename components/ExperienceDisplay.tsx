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
      className={`group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-md border-2 border-slate-600/50 rounded-2xl p-5 transition-all duration-300 hover:bg-gradient-to-br hover:from-slate-700/80 hover:to-slate-800/80 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-900/30 active:scale-[0.98] active:bg-slate-700/80 touch-manipulation ${className}`}
      title={`XP ${Math.max(0, Math.floor(currentXp))}/${Math.max(0, Math.floor(xpForNextLevel))}${xpForNextLevel > 0 ? ` · Faltan ${neededXp}` : ''}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            <span className="text-white text-sm font-black">XP</span>
          </div>
          <span className="text-white text-base md:text-lg font-bold">Experiencia</span>
        </div>
        <div 
          key={levelUpAnimationKey}
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-black text-sm md:text-base px-4 py-2 rounded-full shadow-lg shadow-blue-500/30 animate-level-up-pop"
        >
          Nivel {level}
        </div>
      </div>

      {/* Progress Bar - Más grande y prominente */}
      <div className="relative">
        <div className="w-full bg-slate-700/80 rounded-full h-5 md:h-6 overflow-hidden shadow-inner border border-slate-600/50">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full transition-all duration-700 ease-out relative overflow-hidden shadow-lg"
            style={{ width: `${xpRatio * 100}%` }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shimmer"></div>
          </div>
        </div>
        
        {/* Progress text */}
        <div className="flex justify-between items-center mt-3">
          <span className="text-slate-300 text-sm md:text-base font-bold">
            {Math.max(0, Math.floor(currentXp)).toLocaleString()} XP
          </span>
          <span className="text-purple-300 text-sm md:text-base font-bold">
            {xpForNextLevel > 0 ? `${neededXp.toLocaleString()} restantes` : 'Nivel Máximo'}
          </span>
        </div>
      </div>

      {/* Hover indicator - Más visible */}
      <div className="absolute top-3 right-3 w-2 h-2 bg-purple-500/60 rounded-full transition-all duration-300 group-hover:bg-purple-400 group-hover:scale-150 group-hover:shadow-lg group-hover:shadow-purple-400/50"></div>
    </button>
  );
});

ExperienceDisplay.displayName = 'ExperienceDisplay';

export default ExperienceDisplay;
