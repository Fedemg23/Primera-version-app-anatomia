import React, { memo } from 'react';

const Background: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Degradado base */}
      <div
        className="absolute inset-0 w-full"
        style={{
          background: `
            radial-gradient(ellipse at 15% 20%, #374151 0%, transparent 40%),
            radial-gradient(ellipse at 85% 30%, #6b7280 0%, transparent 45%),
            radial-gradient(ellipse at 40% 70%, #ffffff 0%, transparent 50%),
            radial-gradient(ellipse at 75% 85%, #374151 0%, transparent 35%),
            radial-gradient(ellipse at 25% 85%, #6b7280 0%, transparent 40%),
            radial-gradient(ellipse at 90% 15%, #ffffff 0%, transparent 45%),
            radial-gradient(ellipse at 10% 60%, #ffffff 0%, transparent 35%),
            radial-gradient(ellipse at 60% 25%, #374151 0%, transparent 30%),
            radial-gradient(ellipse at 35% 40%, #6b7280 0%, transparent 35%),
            linear-gradient(to bottom right, #6b7280 0%, #ffffff 100%)
          `,
          minHeight: 'max(100vh, 100%)',
          height: 'auto',
          animation: 'backgroundFloat 12s ease-in-out infinite'
        }}
      />
      
      {/* Glow effects en los bordes */}
      <div 
        className="absolute inset-0 w-full"
        style={{
          background: `
            radial-gradient(ellipse at top, rgba(255,255,255,0.4) 0%, transparent 70%),
            radial-gradient(ellipse at bottom, rgba(55,65,81,0.5) 0%, transparent 70%),
            radial-gradient(ellipse at left, rgba(107,114,128,0.3) 0%, transparent 60%),
            radial-gradient(ellipse at right, rgba(107,114,128,0.3) 0%, transparent 60%)
          `,
          minHeight: 'max(100vh, 100%)',
          animation: 'breathe 4s ease-in-out infinite'
        }}
      />
      
      
      
      {/* CSS para las animaciones */}
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.7; transform: scale(1) translateX(0px); }
          50% { opacity: 1; transform: scale(1.08) translateX(5px); }
        }
        
        @keyframes backgroundFloat {
          0%, 100% { transform: translateX(0px) translateY(0px) scale(1); }
          25% { transform: translateX(15px) translateY(-10px) scale(1.03); }
          50% { transform: translateX(-12px) translateY(18px) scale(1.05); }
          75% { transform: translateX(10px) translateY(-8px) scale(1.04); }
        }
      `}</style>
    </div>
  );
};

export default memo(Background);


