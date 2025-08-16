import React, { memo, useState, useEffect } from 'react';
import { UserData, ShopItem, ShopScreenProps } from '../../types';
import { shopItems } from '../../constants';
import { iconMap, Gift, ShopCartBold } from '../icons';
import HelpIcon from '../HelpIcon';

const toLocalDateString = (date: Date): string => {
    if (!date || isNaN(new Date(date).getTime())) {
        // Return a date string that will never match today
        return new Date(0).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }
    return new Date(date).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
};


const ShopItemCard: React.FC<{
    item: ShopItem;
    userData: UserData;
    onPurchase: (itemId: ShopItem['id'], startElement: HTMLElement) => void;
    isReadyForInput: boolean;
}> = memo(({ item, userData, onPurchase, isReadyForInput }) => {
    const Icon = iconMap[item.icon];

    const isHeartItem = item.id === 'buy_one_heart';
    const isStreakItem = item.id === 'streak_freeze';
    const isXpBoostItem = item.id === 'xp_boost';
    const isDoubleOrNothingItem = item.id === 'double_or_nothing';

    const isHeartDisabled = isHeartItem && userData.hearts >= 5;
    const isStreakDisabled = isStreakItem && userData.streakFreezeActive;
    const isXpBoostDisabled = isXpBoostItem && userData.xpBoostUntil > Date.now();
    const isDoubleOrNothingDisabled = isDoubleOrNothingItem && userData.doubleOrNothingActive;
    
    const isUnaffordable = item.id !== 'double_or_nothing' && userData.bones < item.price;
    const isDoubleOrNothingUnaffordable = isDoubleOrNothingItem && userData.bones < 50;

    const isDisabledByState = isHeartDisabled || isStreakDisabled || isXpBoostDisabled || isDoubleOrNothingDisabled;
    const isUnaffordableFinal = isUnaffordable || isDoubleOrNothingUnaffordable;
    
    const finalIsDisabled = !isReadyForInput || isDisabledByState || isUnaffordableFinal;

    let buttonText: React.ReactNode;
    if (isHeartDisabled) buttonText = 'Vidas Llenas';
    else if (isStreakDisabled) buttonText = 'Activado';
    else if (isXpBoostDisabled) buttonText = 'Activado';
    else if (isDoubleOrNothingDisabled) buttonText = 'Apuesta Activa';
    else if (isDoubleOrNothingItem) buttonText = (
        <div className="flex items-center justify-center gap-1">
            Apostar {(() => { const B = iconMap['bones']; return <B className="w-5 h-5 -mt-0.5" /> })()} 50
        </div>
    );
    else buttonText = (
        <div className="flex items-center justify-center gap-1">
            {(() => { const B = iconMap['bones']; return <B className="w-5 h-5 -mt-0.5" /> })()}
            <span>{item.price}</span>
        </div>
    );

    let buttonClass = 'bg-gradient-to-r from-blue-500 to-sky-500 text-white enabled:hover:shadow-lg enabled:hover:shadow-blue-500/20 enabled:active:scale-95 shadow-md';
    if (isDisabledByState) {
        buttonClass = 'bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-default shadow-md';
    } else if (isUnaffordableFinal) {
        buttonClass = 'bg-slate-700 text-slate-400 cursor-not-allowed';
    }

    // Mostrar imagen a tamaño completo del contenedor
    const iconColorClass = 'w-full h-full';

    return (
        <div className="relative rounded-2xl border border-slate-800 bg-black transition-all duration-300">
            <div className="rounded-[15px] h-full flex flex-col p-5 text-center transition-all duration-300 hover:shadow-2xl hover:shadow-black/30">
                <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center bg-slate-900 rounded-2xl transition-transform duration-300 shadow-inner group-hover:scale-105 overflow-hidden p-1">
                    {Icon && <Icon className={`${iconColorClass}`} />}
                </div>
                <div className="flex-grow">
                    <h3 className="text-xl font-extrabold text-slate-100">{item.name}</h3>
                    <p className="text-sm text-slate-400 mt-1 min-h-8">{item.description}</p>
                </div>
                <div className="mt-auto pt-4">
                    <button 
                        onClick={(e) => onPurchase(item.id, e.currentTarget)} 
                        disabled={finalIsDisabled} 
                        className={`w-full px-5 py-3 rounded-xl text-base font-extrabold flex items-center justify-center transition-all transform touch-manipulation ${buttonClass}`}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
});

const ShopScreen: React.FC<ShopScreenProps> = ({ userData, onPurchase, onClaimDailyReward }) => {
    const [isReadyForInput, setIsReadyForInput] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsReadyForInput(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const mysteryBoxItem = shopItems.find(item => item.id === 'mystery_box')!;
    const lifelineItems = shopItems.filter(item => item.id.startsWith('lifeline'));
    const generalItems = shopItems.filter(item => !item.id.startsWith('lifeline') && item.id !== 'mystery_box');
    
    const isMysteryBoxAffordable = userData.bones >= mysteryBoxItem.price;

    const today = toLocalDateString(new Date());
    const lastClaimDate = userData.lastDailyShopRewardClaim ? toLocalDateString(new Date(userData.lastDailyShopRewardClaim)) : today;
    const canClaimDailyReward = today !== lastClaimDate;

    return (
        <div className="bg-black">
            <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-10">
                <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-3">
                        <h2 className="inline-block font-graffiti text-4xl md:text-5xl tracking-wide -rotate-1 title-white-clean transform scale-100 md:scale-105">
                            Tienda
                        </h2>
                        <HelpIcon modalTitle="Cómo funciona la Tienda" ariaLabel="Cómo funciona la Tienda" className="ml-1">
                            <ul>
                                <li><strong>Huesitos</strong>: moneda del juego. Gánalos en quizzes y desafíos.</li>
                                <li><strong>Vidas</strong>: máximo 5. Se regeneran con el tiempo o comprándolas.</li>
                                <li><strong>Comodines</strong>: 50/50, Repaso Rápido y Segunda Oportunidad. Se consumen al usarlos.</li>
                                <li><strong>Boost de XP</strong>: duplica la XP durante 15 min.</li>
                                <li><strong>Doble o Nada</strong>: apuesta 50 {(() => { const B = iconMap['bones']; return <B className="w-5 h-5 inline-block align-[-2px]" /> })()}; si haces un test perfecto, ganas 100 {(() => { const B = iconMap['bones']; return <B className="w-5 h-5 inline-block align-[-2px]" /> })()}.</li>
                                <li><strong>Caja Misteriosa</strong>: recompensa aleatoria (huesitos, boost, vida o avatar).</li>
                            </ul>
                        </HelpIcon>
                    </div>
                </div>
                
                {/* Daily Reward Section (hero image as primary button) */}
                <div>
                    <h3 className="text-2xl font-bold text-slate-100 mb-5">Recompensa Diaria Gratuita</h3>
                    <button
                        onClick={(e) => onClaimDailyReward(e.currentTarget)}
                        disabled={!isReadyForInput || !canClaimDailyReward}
                        className={`group relative w-full rounded-3xl border overflow-hidden transition-all duration-700 ease-out text-left hover:backdrop-blur-sm ${canClaimDailyReward ? 'bg-black border-slate-700 hover:bg-white hover:text-black hover:border-white hover:[filter:brightness(0.98)]' : 'bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed'}`}
                    >
                        <div className="w-full h-72 md:h-96 flex items-center justify-center p-0 md:p-1 overflow-visible">
                            {(() => { const DG = iconMap['daily_gift']; return (
                                <DG className={`h-full w-full transition-all duration-300 scale-125 md:scale-150 translate-y-6 md:translate-y-10 ${canClaimDailyReward ? '' : 'opacity-50 [filter:grayscale(1)]'}`} />
                            ); })()}
                        </div>
                        <div className="pl-4 pr-6 pb-6 md:px-6">
                            <div className={`text-xl md:text-2xl font-black tracking-tight transition-colors duration-700 ${canClaimDailyReward ? 'text-slate-100 group-hover:text-black' : 'text-slate-300'}`}>
                                Regalo del Día
                            </div>
                            <div className={`mt-1 text-xs md:text-sm transition-colors duration-700 ${canClaimDailyReward ? 'text-slate-300 group-hover:text-slate-700' : 'text-slate-500'}`}>
                                {canClaimDailyReward ? 'Toca para reclamar tu recompensa gratis.' : 'Ya has reclamado el regalo de hoy.'}
                            </div>
                        </div>
                    </button>
                </div>

                {/* Featured Item: Mystery Box */}
                <div>
                     <h3 className="text-2xl font-bold text-slate-100 mb-5">Caja Misteriosa</h3>
                    <div className="relative bg-gradient-to-br from-slate-800/50 via-purple-900/50 to-slate-900/50 rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row items-center gap-8 text-white overflow-hidden border border-purple-500/30">
                         <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-0 active:opacity-100 transition-opacity duration-500 animate-level-pulse-glow" style={{'--glow-color-start': 'rgba(192, 132, 252, 0.4)', '--glow-color-end': 'rgba(219, 39, 119, 0.6)'} as React.CSSProperties}></div>
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(167,139,250,0.2),_transparent_60%)] animate-pulse"></div>
                         <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 flex-shrink-0 flex items-center justify-center animate-shine-slow">
                            <iconMap.mystery_box className="w-full h-full text-yellow-300 [filter:drop-shadow(0_0_15px_rgba(252,211,77,0.7))]" />
                        </div>
                        <div className="relative z-10 flex-grow text-center md:text-left">
                            <h3 className="text-3xl font-black tracking-tight">Caja Misteriosa</h3>
                            <p className="text-purple-200/90 mt-1 text-base">Contiene una recompensa aleatoria. ¡Podría ser un avatar exclusivo, potenciadores o un montón de Huesitos!</p>
                        </div>
                        <div className="relative z-10 flex-shrink-0 w-full md:w-auto">
                             <button 
                                onClick={(e) => onPurchase(mysteryBoxItem.id, e.currentTarget)} 
                                disabled={!isReadyForInput || !isMysteryBoxAffordable}
                                className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all transform enabled:active:-translate-y-1 enabled:active:scale-95 touch-manipulation ${isMysteryBoxAffordable ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900' : 'bg-slate-600 text-slate-400 cursor-not-allowed'}`}
                            >
                                {(() => { const B = iconMap['bones']; return <B className="w-6 h-6" /> })()}
                                <span>{mysteryBoxItem.price}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lifelines Section */}
                <div>
                    <h3 className="text-2xl font-bold text-slate-100 mb-5">Comodines para el Quiz</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {lifelineItems.map(item => (
                            <ShopItemCard 
                                key={item.id} 
                                item={item} 
                                userData={userData} 
                                onPurchase={onPurchase} 
                                isReadyForInput={isReadyForInput} 
                            />
                        ))}
                    </div>
                </div>

                {/* General Items Section */}
                <div>
                     <h3 className="text-2xl font-bold text-slate-100 mb-5">Potenciadores y Vidas</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {generalItems.map(item => (
                            <ShopItemCard 
                                key={item.id} 
                                item={item} 
                                userData={userData} 
                                onPurchase={onPurchase} 
                                isReadyForInput={isReadyForInput} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(ShopScreen);