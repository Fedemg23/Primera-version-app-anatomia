import React, { useCallback, createContext, useContext, useRef, ReactNode, useState } from 'react';
import { AnimationConfig as AppAnimationConfig, AnimationType } from '../types';

interface AnimationContextType {
    triggerAnimation: (config: AppAnimationConfig) => void;
    setTargetRef: (type: AnimationType, ref: HTMLElement | null) => void;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

export const useAnimation = () => {
    const context = useContext(AnimationContext);
    if (!context) {
        throw new Error('useAnimation must be used within an AnimationProvider');
    }
    return context;
};

interface AnimationProviderProps {
    children: ReactNode;
}

interface Particle {
    id: number;
    type: AnimationType;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    rotation: number;
    scale: number;
    delay: number;
    duration: number;
    image: string;
}

// Mapeo de tipos a imágenes
const typeToImage: Record<AnimationType, string> = {
    xp: '/images/png emoji sombrero de graduacion.png',
    bone: '/images/huesitos.png',
    heart: '/images/Heart.png',
};

export const AnimationProvider: React.FC<AnimationProviderProps> = ({ children }) => {
    const targetsRef = useRef<{ [key in AnimationType]?: HTMLElement | null }>({});
    const [particles, setParticles] = useState<Particle[]>([]);
    const particleIdRef = useRef(0);

    const setTargetRef = useCallback((type: AnimationType, ref: HTMLElement | null) => {
        targetsRef.current[type] = ref;
    }, []);

    const triggerAnimation = useCallback((config: AppAnimationConfig) => {
        const { type, count, startElement, startRect } = config;
        const targetElement = targetsRef.current[type];

        if (!targetElement) return;

        const targetRect = targetElement.getBoundingClientRect();
        let sourceRect: DOMRect | { top: number; left: number; width: number; height: number };

        if (startRect) {
            sourceRect = startRect;
        } else if (startElement) {
            sourceRect = startElement.getBoundingClientRect();
        } else {
            return;
        }

        const newParticles: Particle[] = [];
        const image = typeToImage[type];

        for (let i = 0; i < count; i++) {
            const startX = sourceRect.left + sourceRect.width / 2;
            const startY = sourceRect.top + sourceRect.height / 2;
            const endX = targetRect.left + targetRect.width / 2;
            const endY = targetRect.top + targetRect.height / 2;

            // Variación para hacer más natural
            const spreadX = (Math.random() - 0.5) * 100;
            const spreadY = (Math.random() - 0.5) * 100;

            newParticles.push({
                id: particleIdRef.current++,
                type,
                startX: startX + spreadX,
                startY: startY + spreadY,
                endX,
                endY,
                rotation: Math.random() * 720 - 360,
                scale: 0.6 + Math.random() * 0.6,
                delay: Math.random() * 200,
                duration: 800 + Math.random() * 400,
                image,
            });
        }

        setParticles((prev) => [...prev, ...newParticles]);

        // Limpiar partículas después de la animación
        setTimeout(() => {
            setParticles((prev) =>
                prev.filter((p) => !newParticles.find((np) => np.id === p.id))
            );
        }, 1600);
    }, []);

    return (
        <AnimationContext.Provider value={{ triggerAnimation, setTargetRef }}>
            {children}
            {/* Contenedor de partículas */}
            <div className="fixed inset-0 pointer-events-none z-[9999]" style={{ overflow: 'hidden' }}>
                {particles.map((particle) => (
                    <img
                        key={particle.id}
                        src={particle.image}
                        alt=""
                        className="absolute w-8 h-8 animate-particle-fly"
                        style={{
                            left: particle.startX,
                            top: particle.startY,
                            '--end-x': `${particle.endX}px`,
                            '--end-y': `${particle.endY}px`,
                            '--rotation': `${particle.rotation}deg`,
                            '--scale': particle.scale,
                            '--delay': `${particle.delay}ms`,
                            '--duration': `${particle.duration}ms`,
                            transform: `translate(-50%, -50%) scale(${particle.scale})`,
                            animationDelay: `${particle.delay}ms`,
                            animationDuration: `${particle.duration}ms`,
                        } as React.CSSProperties}
                    />
                ))}
            </div>
        </AnimationContext.Provider>
    );
};
