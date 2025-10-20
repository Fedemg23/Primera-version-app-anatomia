import React from 'react';

interface EritrosDisplayProps {
  value: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

/**
 * Componente reutilizable para mostrar los Eritros (MMR/Rating)
 * con el número a la izquierda y la imagen a la derecha.
 * Si la imagen no existe, usa un emoji como fallback.
 */
const EritrosDisplay: React.FC<EritrosDisplayProps> = ({ value, size = 'md', showLabel = false }) => {
  const sizeClasses = {
    sm: { text: 'text-sm', icon: 'w-5 h-5', emoji: 'text-sm' },
    md: { text: 'text-xl', icon: 'w-6 h-6', emoji: 'text-base' },
    lg: { text: 'text-3xl', icon: 'w-8 h-8', emoji: 'text-2xl' },
    xl: { text: 'text-4xl', icon: 'w-10 h-10', emoji: 'text-3xl' }
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      {showLabel && (
        <span className="text-sm text-neutral-400 mr-1">Eritros:</span>
      )}
      <span className={`font-black text-white tabular-nums ${sizeClasses[size].text}`}>
        {value.toLocaleString()}
      </span>
      <div className={`${sizeClasses[size].icon} rounded-full flex items-center justify-center bg-gradient-to-br from-red-500 to-red-700 shadow-lg flex-shrink-0`}>
        <img 
          src="/images/eritros.png" 
          alt="Eritros" 
          className="w-full h-full object-contain"
          onError={(e) => {
            // Si la imagen no existe, mostramos un emoji como fallback
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.eritros-emoji')) {
              const span = document.createElement('span');
              span.className = `eritros-emoji ${sizeClasses[size].emoji}`;
              span.textContent = '🔴';
              parent.appendChild(span);
            }
          }}
        />
      </div>
    </div>
  );
};

export default EritrosDisplay;

