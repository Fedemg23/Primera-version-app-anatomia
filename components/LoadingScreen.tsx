import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[10000]">
      <div className="relative w-48 h-48">
        <img 
          src="/images/Emoji hueso png.png" 
          alt="Cargando..." 
          className="w-full h-full object-contain animate-pulse"
          style={{ animationDuration: '1.5s' }}
        />
      </div>
      <p className="text-slate-300 font-semibold mt-4 text-lg">Cargando partida...</p>
    </div>
  );
};

export default LoadingScreen;
