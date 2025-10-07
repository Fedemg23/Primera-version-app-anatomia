import React, { useEffect, useState, useCallback } from 'react';

export type ClaimEffectType = 'confetti' | 'starburst' | 'radial' | 'light-rays' | 'material-burst';
export type MaterialType = 'wood' | 'stone' | 'bronze' | 'iron' | 'silver' | 'gold' | 'platinum' | 'emerald' | 'ruby' | 'diamond';

interface ClaimEffectsProps {
  trigger: number;
  effectType?: ClaimEffectType;
  materialType?: MaterialType;
  position: { x: number; y: number };
  intensity?: 'low' | 'medium' | 'high';
}

interface Confetti {
  id: number;
  x: number;
  y: number;
  rotation: number;
  tx: string;
  ty: string;
  color: string;
  image?: string;
  size: number;
}

const materialColors: Record<MaterialType, string[]> = {
  wood: ['#8B4513', '#A0522D', '#654321'],
  stone: ['#696969', '#808080', '#556B2F'],
  bronze: ['#CD7F32', '#DAA520', '#B8860B'],
  iron: ['#708090', '#778899', '#2F4F4F'],
  silver: ['#C0C0C0', '#E5E5E5', '#A9A9A9'],
  gold: ['#FFD700', '#FFA500', '#FF8C00'],
  platinum: ['#E5E4E2', '#F5F5F5', '#C0C0C0'],
  emerald: ['#50C878', '#00FF7F', '#228B22'],
  ruby: ['#E0115F', '#FF1493', '#B22222'],
  diamond: ['#B9F2FF', '#FFFFFF', '#87CEEB'],
};

const ClaimEffects: React.FC<ClaimEffectsProps> = ({
  trigger,
  effectType = 'confetti',
  materialType = 'gold',
  position,
  intensity = 'medium',
}) => {
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [showStarburst, setShowStarburst] = useState(false);
  const [showRadial, setShowRadial] = useState(false);
  const [showLightRays, setShowLightRays] = useState(false);

  const getIntensityConfig = useCallback(() => {
    switch (intensity) {
      case 'low':
        return { confettiCount: 15, starCount: 3, rayCount: 4 };
      case 'high':
        return { confettiCount: 50, starCount: 8, rayCount: 8 };
      default:
        return { confettiCount: 30, starCount: 5, rayCount: 6 };
    }
  }, [intensity]);

  useEffect(() => {
    if (trigger === 0) return;

    const config = getIntensityConfig();
    const colors = materialColors[materialType];

    // Limpiar efectos anteriores
    setConfetti([]);
    setShowStarburst(false);
    setShowRadial(false);
    setShowLightRays(false);

    // Confeti explosion
    if (effectType === 'confetti' || effectType === 'material-burst') {
      const newConfetti: Confetti[] = [];
      const images = [
        '/images/huesitos.png',
        '/images/Heart.png',
        '/images/png emoji sombrero de graduacion.png',
        '/images/Logros.png',
      ];

      for (let i = 0; i < config.confettiCount; i++) {
        const angle = (Math.PI * 2 * i) / config.confettiCount + Math.random() * 0.5;
        const velocity = 150 + Math.random() * 200;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity - 100; // Sesgo hacia arriba

        newConfetti.push({
          id: i,
          x: position.x,
          y: position.y,
          rotation: Math.random() * 720 - 360,
          tx: `${tx}px`,
          ty: `${ty}px`,
          color: colors[Math.floor(Math.random() * colors.length)],
          image: Math.random() > 0.5 ? images[Math.floor(Math.random() * images.length)] : undefined,
          size: 20 + Math.random() * 20,
        });
      }

      setConfetti(newConfetti);

      setTimeout(() => {
        setConfetti([]);
      }, 1500);
    }

    // Starburst effect
    if (effectType === 'starburst' || effectType === 'material-burst') {
      setShowStarburst(true);
      setTimeout(() => setShowStarburst(false), 800);
    }

    // Radial burst
    if (effectType === 'radial' || effectType === 'material-burst') {
      setShowRadial(true);
      setTimeout(() => setShowRadial(false), 1000);
    }

    // Light rays
    if (effectType === 'light-rays' || effectType === 'material-burst') {
      setShowLightRays(true);
      setTimeout(() => setShowLightRays(false), 1200);
    }
  }, [trigger, effectType, materialType, position, getIntensityConfig]);

  const config = getIntensityConfig();
  const colors = materialColors[materialType];
  const primaryColor = colors[0];

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]" style={{ overflow: 'hidden' }}>
      {/* Confeti */}
      {confetti.map((particle) => (
        particle.image ? (
          <img
            key={particle.id}
            src={particle.image}
            alt=""
            className="absolute animate-confetti"
            style={{
              left: particle.x,
              top: particle.y,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              '--tx': particle.tx,
              '--ty': particle.ty,
              '--rotation': `${particle.rotation}deg`,
            } as React.CSSProperties}
          />
        ) : (
          <div
            key={particle.id}
            className="absolute animate-confetti rounded-sm"
            style={{
              left: particle.x,
              top: particle.y,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              '--tx': particle.tx,
              '--ty': particle.ty,
              '--rotation': `${particle.rotation}deg`,
            } as React.CSSProperties}
          />
        )
      ))}

      {/* Starburst */}
      {showStarburst && (
        <>
          {Array.from({ length: config.starCount }).map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute animate-star-burst"
              style={{
                left: position.x,
                top: position.y,
                width: '60px',
                height: '60px',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
                  transform: `rotate(${(360 / config.starCount) * i}deg)`,
                }}
              />
            </div>
          ))}
        </>
      )}

      {/* Radial burst */}
      {showRadial && (
        <>
          <div
            className="absolute rounded-full animate-radial-burst"
            style={{
              left: position.x,
              top: position.y,
              width: '100px',
              height: '100px',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, ${primaryColor}40 0%, ${primaryColor}20 50%, transparent 70%)`,
              border: `3px solid ${primaryColor}`,
            }}
          />
          <div
            className="absolute rounded-full animate-radial-burst"
            style={{
              left: position.x,
              top: position.y,
              width: '100px',
              height: '100px',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, ${primaryColor}60 0%, transparent 70%)`,
              animationDelay: '100ms',
            }}
          />
        </>
      )}

      {/* Light rays */}
      {showLightRays && (
        <div
          className="absolute"
          style={{
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {Array.from({ length: config.rayCount }).map((_, i) => (
            <div
              key={`ray-${i}`}
              className="absolute animate-light-ray"
              style={{
                left: '50%',
                top: '50%',
                width: '4px',
                height: '200px',
                background: `linear-gradient(to bottom, ${primaryColor}80, transparent)`,
                transform: `translate(-50%, -50%) rotate(${(360 / config.rayCount) * i}deg)`,
                transformOrigin: 'center top',
                animationDelay: `${i * 50}ms`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClaimEffects;

