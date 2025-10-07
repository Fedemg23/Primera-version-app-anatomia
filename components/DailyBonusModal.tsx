

import React, { useState, useEffect, memo } from 'react';
import { Gift } from './icons';
import { iconMap } from './icons';
import ClaimEffects from './ClaimEffects';
import { useAnimation } from './AnimationProvider';

const DailyBonusModal: React.FC<{ isOpen: boolean; rewardAmount: number; onClose: () => void; onClaim: () => void; }> = ({ isOpen, rewardAmount, onClose, onClaim }) => {
    const [effectTrigger, setEffectTrigger] = useState(0);
    const [effectPosition, setEffectPosition] = useState({ x: 0, y: 0 });
    const { triggerAnimation } = useAnimation();
    
    if (!isOpen) return null;
    const Bones = iconMap['bones'];
    
    const handleClaim = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Disparar efectos visuales
        setEffectPosition({ x: centerX, y: centerY });
        setEffectTrigger(Date.now());
        
        // Animar partículas de huesitos (limitado a 10 para evitar sobrecarga)
        triggerAnimation({
            type: 'bone',
            count: 10,
            startElement: e.currentTarget,
        });
        
        setTimeout(() => {
            onClaim();
            onClose();
        }, 500);
    };
    
    return (
        <div className="fixed inset-0 bg-[#1B263B] bg-opacity-70 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-auto transform animate-bounce-in w-full relative" onClick={(e) => e.stopPropagation()}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 animate-golden-glow pointer-events-none" />
                <h2 className="text-3xl font-black tracking-tighter text-gray-800 dark:text-gray-200 mb-2 relative z-10">¡Bonus Diario!</h2>
                <p className="font-black text-5xl text-gray-700 dark:text-amber-400 flex items-center justify-center gap-2 relative z-10 animate-celebration-shake">
                    +{rewardAmount} <Bones className="w-10 h-10 animate-spin-glow" />
                </p>
                <button 
                    onClick={handleClaim}
                    className="mt-6 w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 px-4 rounded-xl text-lg shadow-lg active:shadow-xl transition-all active:scale-95 touch-manipulation animate-reward-light-pulse relative z-10"
                >
                    Reclamar
                </button>
                
                {/* Efectos especiales */}
                <ClaimEffects
                    trigger={effectTrigger}
                    effectType="light-rays"
                    materialType="gold"
                    position={effectPosition}
                    intensity="high"
                />
            </div>
        </div>
    );
};

export default memo(DailyBonusModal);