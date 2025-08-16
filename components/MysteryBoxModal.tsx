
import React, { useState, useEffect, memo } from 'react';
import { MysteryReward } from '../types';
import { Gift, iconMap } from './icons';

interface MysteryBoxModalProps {
    isOpen: boolean;
    onClose: () => void;
    reward: MysteryReward;
}

const MysteryBoxModal: React.FC<MysteryBoxModalProps> = ({ isOpen, onClose, reward }) => {
    const [isOpening, setIsOpening] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    
    useEffect(() => {
        if (isOpen) {
            setIsOpening(false);
            setIsRevealed(false);
            const openTimer = setTimeout(() => setIsOpening(true), 500);
            const revealTimer = setTimeout(() => setIsRevealed(true), 1500);
            return () => {
                clearTimeout(openTimer);
                clearTimeout(revealTimer);
            };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    let rewardIconElement: React.ReactNode;
    if (reward.type === 'avatar') {
        rewardIconElement = <span className="text-6xl">{reward.icon}</span>;
    } else {
        const IconComponent = reward.icon === '🦴' ? iconMap['bones'] : iconMap[reward.icon];
        if (IconComponent) {
            rewardIconElement = <IconComponent className="w-16 h-16 text-gray-700 dark:text-gray-300" />;
        } else {
            rewardIconElement = null;
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-auto transform animate-scale-in w-full" onClick={(e) => e.stopPropagation()}>
                
                {!isRevealed ? (
                    <>
                        <h2 className="text-3xl font-black tracking-tighter text-gray-800 dark:text-gray-200 mb-4">Caja Misteriosa</h2>
                        <div className={`relative w-40 h-40 mx-auto transition-transform duration-1000 ${isOpening ? 'scale-110' : 'scale-100'}`}>
                            <Gift className={`w-full h-full text-gray-500 transition-all duration-500 ${isOpening ? 'text-amber-500' : ''}`} />
                            {isOpening && (
                                <>
                                    <div className="absolute top-0 left-0 w-full h-full animate-ping-slow bg-yellow-300 rounded-full opacity-50 -z-10"></div>
                                    <div className="absolute top-0 left-0 w-full h-full animate-shine-pulse border-4 border-yellow-300 rounded-full"></div>
                                </>
                            )}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 mt-4 font-semibold">Abriendo...</p>
                    </>
                ) : (
                    <div className="animate-fade-in">
                         <h2 className="text-3xl font-black tracking-tighter text-gray-800 dark:text-gray-200 mb-4">¡Has conseguido!</h2>
                         <div className="w-24 h-24 mx-auto my-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center animate-scale-in">
                            {rewardIconElement}
                         </div>
                         <p className="font-black text-4xl text-gray-700 dark:text-amber-400">{reward.name}</p>
                         <button 
                            onClick={onClose} 
                            className="mt-8 w-full bg-gray-800 dark:bg-gray-200 text-white dark:text-black font-bold py-3 px-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-shadow active:scale-95 touch-manipulation"
                        >
                            ¡Increíble!
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(MysteryBoxModal);