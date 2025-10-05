import React, { memo } from 'react';

const Background: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Degradado base */}
      <div
        className="absolute inset-0 w-full"
        style={{
          background: `
            radial-gradient(ellipse at 15% 20%, #111827 0%, transparent 40%),
            radial-gradient(ellipse at 85% 30%, #1e293b 0%, transparent 45%),
            radial-gradient(ellipse at 40% 70%, #312e81 0%, transparent 50%),
            radial-gradient(ellipse at 75% 85%, #111827 0%, transparent 35%),
            radial-gradient(ellipse at 25% 85%, #1e293b 0%, transparent 40%),
            radial-gradient(ellipse at 90% 15%, #4f46e5 0%, transparent 45%),
            radial-gradient(ellipse at 10% 60%, #312e81 0%, transparent 35%),
            radial-gradient(ellipse at 60% 25%, #111827 0%, transparent 30%),
            radial-gradient(ellipse at 35% 40%, #1e293b 0%, transparent 35%),
            linear-gradient(to bottom right, #111827 0%, #1e293b 100%)
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
            radial-gradient(ellipse at top, rgba(79, 70, 229, 0.3) 0%, transparent 70%),
            radial-gradient(ellipse at bottom, rgba(30, 41, 59, 0.5) 0%, transparent 70%),
            radial-gradient(ellipse at left, rgba(49, 46, 129, 0.2) 0%, transparent 60%),
            radial-gradient(ellipse at right, rgba(49, 46, 129, 0.2) 0%, transparent 60%)
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


