import React, { memo } from 'react';
import { Settings } from './icons';

interface FloatingSettingsButtonProps {
  onOpenSettings: () => void;
}

const FloatingSettingsButton: React.FC<FloatingSettingsButtonProps> = ({ onOpenSettings }) => {
  return (
    <button 
      onClick={onOpenSettings} 
      title="Ajustes" 
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-slate-800/90 backdrop-blur-sm border border-slate-600/50 rounded-full shadow-lg transition-all duration-200 active:scale-95 hover:bg-slate-700/90 hover:shadow-xl hover:shadow-blue-500/20 active:bg-slate-600/90 touch-manipulation"
      style={{ 
        paddingBottom: 'calc(0.25rem + env(safe-area-inset-bottom))',
        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
      }}
    >
      <div className="flex items-center justify-center w-full h-full">
        <Settings className="w-7 h-7 text-slate-300 transition-colors duration-200 group-hover:text-white" />
      </div>
      
      {/* Efecto de resplandor */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 transition-opacity duration-200 hover:opacity-100 -z-10"></div>
      
      {/* Anillo de animación */}
      <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-pulse"></div>
    </button>
  );
};

export default memo(FloatingSettingsButton);
