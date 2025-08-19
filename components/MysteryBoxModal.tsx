import React, { useState, useEffect } from 'react';
import { MysteryReward, UserData } from '../types';
import { iconMap } from './icons';
import { 
    Rarity,
    getRewardRarity, 
    rarityColors, 
    rarityPercentages,
    commonRewards,
    uncommonRewards,
    rareRewards,
    epicRewards,
} from '../src/features/rewards';

interface MysteryBoxModalProps {
    isOpen: boolean;
    onClose: () => void;
    reward: MysteryReward;
    onClaim: (reward: MysteryReward) => void;
    userData: UserData;
}

const ITEM_WIDTH = 240; // w-60
const MARGIN = 8; // mx-2 on each side = 8px
const TOTAL_ITEM_WIDTH = ITEM_WIDTH + MARGIN * 2;

const MysteryBoxModal: React.FC<MysteryBoxModalProps> = ({ isOpen, onClose, reward, onClaim, userData }) => {
    const [isRolling, setIsRolling] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const [rollSequence, setRollSequence] = useState<MysteryReward[]>([]);
    const [translateX, setTranslateX] = useState(0);

    useEffect(() => {
        if (isOpen && reward) {
            // Reset states
            setIsRolling(false);
            setIsRevealed(false);
            setTranslateX(0);

            const totalItems = 100;
            const winningIndex = 85;

            // Create a purely decorative random sequence
            let sequence = Array.from({ length: totalItems }, (_, i) => {
                const r = Math.random();
                if (r < 0.05) return epicRewards[i % epicRewards.length];
                if (r < 0.15) return rareRewards[i % rareRewards.length];
                if (r < 0.40) return uncommonRewards[i % uncommonRewards.length];
                return commonRewards[i % commonRewards.length];
            });
            setRollSequence(sequence);

            // --- Animation Logic ---
            const finalPosition = (winningIndex * TOTAL_ITEM_WIDTH) - (window.innerWidth / 2) + (TOTAL_ITEM_WIDTH / 2);
            const startPosition = finalPosition - 20000; // Increased distance for more speed
            
            setTranslateX(-startPosition);

            const rollTimer = setTimeout(() => {
                setIsRolling(true);
                setTranslateX(-finalPosition);
            }, 100);

            // Reveal the ACTUAL reward card after 3.5 seconds of spinning
            const revealTimer = setTimeout(() => {
                setIsRevealed(true);
            }, 3500);

            return () => {
                clearTimeout(rollTimer);
                clearTimeout(revealTimer);
            };
        }
    }, [isOpen, reward]);

    if (!isOpen) return null;

    const renderIcon = (item: MysteryReward, large: boolean = false) => {
        const size = large ? "w-40 h-40" : "w-40 h-40"; // Increased size for spinning items
        if (item.type === 'avatar') {
            return <img src={item.icon} alt={item.name} className={`${size} object-contain`} />;
        }
        const IconComponent = iconMap[item.icon];
        return IconComponent ? <IconComponent className={size} /> : <div className={`${size} bg-slate-500 rounded-md`} />;
    };
    
    const rewardRarity = getRewardRarity(reward);
    const colors = rarityColors[rewardRarity];

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col justify-center items-center transition-opacity duration-300 overflow-hidden" style={{ opacity: isOpen ? 1 : 0 }}>
            <div className="absolute top-4 right-4 flex items-center gap-4 z-30">
                <button onClick={onClose} className="text-white text-4xl font-bold">&times;</button>
            </div>
            
            <div className="w-full text-center mb-8 h-20 flex items-center justify-center">
                <h1 className={`text-6xl font-black text-white uppercase tracking-widest transition-all duration-500 ${isRevealed ? 'scale-110' : 'scale-100'}`}>
                    {isRevealed ? '¡Has Ganado!' : 'Abriendo Caja'}
                </h1>
            </div>
            
            <div className="relative w-full h-64">
                {/* This container will fade out, taking both the glow and the bar with it */}
                <div className={`absolute inset-0 transition-opacity duration-1000 ${isRevealed ? 'opacity-0' : 'opacity-100'}`}>
                    
                    {/* Illumination Effect */}
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-amber-400/20 rounded-full blur-3xl z-0"></div>

                    {/* Spinning Bar Container */}
                    <div className="relative w-full h-full overflow-hidden z-10">
                        <div className="absolute top-1/2 left-0 w-full h-48 -translate-y-1/2 bg-black/30"></div>
                        
                        <div
                            className="flex h-full items-center"
                            style={{
                                transform: `translateX(${translateX}px)`,
                                transition: isRolling ? 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
                            }}
                        >
                            {rollSequence.map((item, index) => {
                                const rarity = getRewardRarity(item);
                                const itemColors = rarityColors[rarity];

                                return (
                                <div
                                    key={index}
                                    className={`flex-shrink-0 w-60 h-64 mx-2 ${itemColors.bg} border-2 ${itemColors.border} rounded-lg flex flex-col justify-center items-center p-2 shadow-lg ${itemColors.shadow}`}
                                >
                                    <div className="w-48 h-48 flex items-center justify-center mb-2">
                                        {renderIcon(item)}
                                    </div>
                                    <p className="text-white font-bold text-center text-sm">{item.name}</p>
                                    {item.type === 'bones' && <p className={`text-xs ${itemColors.text}`}>{item.amount}</p>}
                                </div>
                            )})}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* --- Reward Reveal Card --- */}
            {isRevealed && (() => {
                let beforeValue: number | null = null;
                let afterValue: number | null = null;

                if (reward.type === 'bones' && reward.amount) {
                    beforeValue = userData.bones;
                    afterValue = userData.bones + reward.amount;
                } else if (reward.type === 'heart') {
                    beforeValue = userData.hearts;
                    afterValue = userData.hearts + (reward.amount || 1);
                } else if (reward.type.startsWith('lifeline')) {
                    const lifelineKey = reward.type.replace('lifeline_', '') as keyof UserData['lifelineData'];
                    beforeValue = userData.lifelineData[lifelineKey] as number;
                    afterValue = (userData.lifelineData[lifelineKey] as number || 0) + 1;
                }

                return (
                    <div className="absolute inset-0 z-30 flex flex-col justify-center items-center bg-black/50 backdrop-blur-sm animate-fade-in">
                        <div className={`relative w-80 h-96 ${colors.bg} border-4 ${colors.border} rounded-2xl flex flex-col justify-between items-center p-6 shadow-2xl ${colors.shadow} animate-card-reveal`}>
                            {/* Top Section: Icon and Name */}
                            <div className="flex flex-col items-center">
                                <div className="w-48 h-48 flex items-center justify-center mb-4">
                                    {renderIcon(reward, true)}
                                </div>
                                <h2 className="text-white font-bold text-center text-3xl mb-1">{reward.name}</h2>
                                {reward.type === 'bones' && <p className={`text-xl ${colors.text}`}>{reward.amount}</p>}
                            </div>

                            {/* Bottom Section: Rarity and Quantity Change */}
                            <div className="flex flex-col items-center text-center">
                                <p className={`font-bold uppercase text-lg ${colors.text} mb-2`}>{rewardRarity}</p>
                                
                                {beforeValue !== null && afterValue !== null && (
                                    <div className="bg-black/40 px-4 py-2 rounded-lg">
                                        <p className="text-white text-2xl font-semibold tracking-wider">
                                            {beforeValue} <span className="text-amber-400 mx-2">→</span> {afterValue}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button 
                            onClick={() => onClaim(reward)} 
                            className="mt-8 bg-amber-500 text-black font-bold uppercase py-4 px-12 rounded-lg text-2xl tracking-wider hover:bg-amber-400 transition-all duration-300 active:scale-95"
                        >
                            Reclamar
                        </button>
                    </div>
                );
            })()}
        </div>
    );
};

export default MysteryBoxModal;
