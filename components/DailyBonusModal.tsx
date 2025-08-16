

import React, { useState, useEffect, memo } from 'react';
import { Gift } from './icons';
import { iconMap } from './icons';

const DailyBonusModal: React.FC<{ isOpen: boolean; rewardAmount: number; onClose: () => void; onClaim: () => void; }> = ({ isOpen, rewardAmount, onClose, onClaim }) => {
    if (!isOpen) return null;
    const Bones = iconMap['bones'];
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-auto transform animate-scale-in w-full" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-3xl font-black tracking-tighter text-gray-800 dark:text-gray-200 mb-2">¡Bonus Diario!</h2>
                <p className="font-black text-5xl text-gray-700 dark:text-amber-400 flex items-center justify-center gap-2">+{rewardAmount} <Bones className="w-10 h-10" /></p>
                <button onClick={() => { onClaim(); onClose(); }} className="mt-6 w-full bg-gray-800 dark:bg-gray-200 text-white dark:text-black font-bold py-3 px-4 rounded-xl text-lg shadow-lg active:shadow-xl transition-shadow active:scale-95 touch-manipulation">Reclamar</button>
            </div>
        </div>
    );
};

export default memo(DailyBonusModal);