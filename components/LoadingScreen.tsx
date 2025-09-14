import React from 'react';
import { OptimizedBones } from '../src/utils/optimizedIcons';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex flex-col items-center justify-center z-[10000] animate-fade-in">
      <div className="relative w-48 h-48">
        <OptimizedBones 
          className="w-full h-full object-contain"
          style={{
            animation: 'wobble-and-float 3s ease-in-out infinite',
            filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.3))'
          }}
        />
      </div>
      <div className="relative mt-4">
        <p className="text-slate-200 font-bold mt-4 text-xl tracking-wider animate-pulse" style={{ animationDuration: '2s' }}>
          Cargando...
        </p>
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white animate-move-line"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
