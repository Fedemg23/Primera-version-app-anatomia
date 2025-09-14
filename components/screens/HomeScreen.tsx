
import React, { useState, memo, useEffect } from 'react';
import { HomeIconNotes, BookOpen, Target } from '../icons';
import { useAudio } from '../../src/contexts/AudioProvider';
import HelpIcon from '../HelpIcon';
import { HomeScreenProps, View } from '../../types';

interface InfoModalProps {onClose: () => void}
const InfoModal: React.FC<InfoModalProps> = memo(({ onClose }) => (
    <div className="fixed inset-0 bg-[#1B263B] bg-opacity-70 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md mx-auto transform animate-scale-in w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-black tracking-tighter text-gray-100 mb-4">Descripción de los Modos</h2>
            <div className="space-y-4 text-left text-gray-300">
                <div>
                    <h3 className="font-bold text-lg text-gray-100 flex items-center gap-2"><BookOpen className="w-5 h-5"/> Modo Estudio</h3>
                    <p className="mt-1">Aprende y repasa temas específicos a tu ritmo. Recibirás feedback inmediato después de cada pregunta. Ideal para construir una base sólida.</p>
                </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-100 flex items-center gap-2"><Target className="w-5 h-5"/> Modo Examen</h3>
                    <p className="mt-1">Ponte a prueba en condiciones de examen. Mezcla preguntas de varios temas y recibe tu puntuación y resultados solo al final. Perfecto para evaluar tu conocimiento global.</p>
                </div>
                
            </div>
            <button onClick={onClose} className="mt-8 w-full bg-slate-200 text-black font-bold py-3 px-4 rounded-xl text-lg shadow-lg active:shadow-xl transition-shadow active:scale-95 touch-manipulation">
                ¡Entendido!
            </button>
        </div>
    </div>
));

// (El SVG se reemplaza por título con scale para evitar mover el layout)

const NavItem: React.FC<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    disabled: boolean;
    hasNotification?: boolean;
}> = memo(({label, icon, onClick, disabled, hasNotification}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="group flex flex-col items-center justify-center w-28 md:w-32 text-center gap-2 transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-wait touch-manipulation"
    >
        <div className="
            relative w-24 h-24 md:w-28 md:h-28 rounded-full
            flex items-center justify-center
            bg-[#121212] ring-4 ring-white/60
            transition-[box-shadow,transform,ring] duration-200
            group-hover:ring-white group-hover:shadow-[0_0_28px_rgba(255,255,255,0.5)]
            group-active:scale-95 group-active:shadow-[0_0_18px_rgba(255,255,255,0.4)]
        ">
            <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]"></div>

            <div className="relative text-slate-300 group-hover:text-slate-100 transition-colors duration-200 scale-110 md:scale-125">
                {icon}
            </div>

             {hasNotification && (
               <span className="absolute top-2 right-2 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-slate-900 animate-notification-pulse"></span>
           )}
        </div>
        <span className="
            font-extrabold text-xs md:text-sm uppercase tracking-wider text-[#3A3A3A]
            transition-colors duration-300
        ">
            {label}
        </span>
    </button>
));


const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectMode, userData, onNavigate, notifications }) => {
    const { playSound } = useAudio();
    const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
    const [isReadyForInput, setIsReadyForInput] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsReadyForInput(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const modeButtonClasses = (disabled: boolean) => `
        group relative rounded-2xl w-full max-w-2xl mx-auto border-0
        transition-colors duration-200 ${disabled ? 'opacity-60 cursor-wait pointer-events-none' : ''}
    `;

    const handleNavigation = (view: View) => {
        playSound('button-click');
        onNavigate(view);
    };

    const handleModeSelection = (mode: 'study' | 'exam') => {
        playSound('button-click');
        onSelectMode(mode);
    };

    return (
        <div className="relative flex flex-col min-h-[100vh] items-center p-4 pb-24 md:pb-28" style={{ paddingTop: '2rem', paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}>
            
            <div className="flex flex-col justify-start w-full max-w-6xl mx-auto min-h-full">
                {/* Top Group: Title and Mode Buttons */}
                <div className="flex flex-col items-center gap-4 md:gap-6 w-full mt-0 md:mt-0">
                    <div className="w-11/12 max-w-[300px] sm:max-w-[440px] md:max-w-[680px] lg:max-w-[760px] ml-auto mr-4 md:mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-7 justify-items-end md:justify-items-center">
                            <button
                                onClick={() => handleNavigation('challenges')}
                                disabled={!isReadyForInput}
                                className={`${modeButtonClasses(!isReadyForInput)} aspect-[4/5] group relative overflow-hidden`}
                            >
                                <div className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 w-full h-full flex flex-col items-center justify-center text-center shadow-2xl shadow-slate-900/50 transition-all duration-300 group-hover:shadow-[0_0_35px_rgba(251,146,60,0.3)] group-hover:scale-105 group-hover:-translate-y-1 group-active:scale-98 group-active:translate-y-0 border border-orange-400/20 group-hover:border-orange-400/40">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="mb-2 md:mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 relative z-10">
                                        <img 
                                            src="/images/Png Emoji tiro al arco.png" 
                                            alt="Desafíos" 
                                            className="w-18 h-18 md:w-24 md:h-24 object-contain drop-shadow-lg"
                                        />
                                    </div>
                                    <div className="h-10 flex flex-col justify-center relative z-10">
                                        <span className="text-sm md:text-base font-extrabold text-white drop-shadow-md">Desafíos</span>
                                    </div>
                                </div>
                                {notifications.challenges && (
                                    <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-red-500 ring-2 ring-slate-900 animate-notification-pulse"></span>
                                )}
                            </button>
                            <button
                                data-tour="home-study-btn"
                                onClick={() => handleModeSelection('study')}
                                disabled={!isReadyForInput}
                                className={`${modeButtonClasses(!isReadyForInput)} aspect-[4/5] group relative overflow-hidden`}
                            >
                                <div className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 w-full h-full flex flex-col items-center justify-center text-center shadow-2xl shadow-slate-900/50 transition-all duration-300 group-hover:shadow-[0_0_35px_rgba(59,130,246,0.3)] group-hover:scale-105 group-hover:-translate-y-1 group-active:scale-98 group-active:translate-y-0 border border-blue-400/20 group-hover:border-blue-400/40">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="mb-2 md:mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-2 relative z-10">
                                        <img 
                                            src="/images/Modo estudio.png" 
                                            alt="Modo Estudio" 
                                            className="w-18 h-18 md:w-24 md:h-24 object-contain drop-shadow-lg"
                                        />
                                    </div>
                                    <div className="h-10 flex flex-col justify-center relative z-10">
                                        <span className="text-sm md:text-base font-extrabold text-white drop-shadow-md leading-tight">
                                            <span className="block">Modo</span>
                                            <span className="block">Estudio</span>
                                        </span>
                                    </div>
                                </div>
                            </button>
                            <button
                                onClick={() => handleModeSelection('exam')}
                                disabled={!isReadyForInput}
                                className={`${modeButtonClasses(!isReadyForInput)} aspect-[4/5] group relative overflow-hidden`}
                            >
                                <div className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 w-full h-full flex flex-col items-center justify-center text-center shadow-2xl shadow-slate-900/50 transition-all duration-300 group-hover:shadow-[0_0_35px_rgba(147,51,234,0.3)] group-hover:scale-105 group-hover:-translate-y-1 group-active:scale-98 group-active:translate-y-0 border border-purple-400/20 group-hover:border-purple-400/40">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="mb-2 md:mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1 relative z-10">
                                        <img 
                                            src="/images/Modo examen.png" 
                                            alt="Modo Examen" 
                                            className="w-18 h-18 md:w-24 md:h-24 object-contain drop-shadow-lg"
                                        />
                                    </div>
                                    <div className="h-10 flex flex-col justify-center relative z-10">
                                        <span className="text-sm md:text-base font-extrabold text-white drop-shadow-md leading-tight">
                                            <span className="block">Modo</span>
                                            <span className="block">Examen</span>
                                        </span>
                                    </div>
                                </div>
                            </button>
                            <button
                                onClick={() => handleNavigation('shop')}
                                disabled={!isReadyForInput}
                                className={`${modeButtonClasses(!isReadyForInput)} aspect-[4/5] group relative overflow-hidden`}
                            >
                                <div className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 w-full h-full flex flex-col items-center justify-center text-center shadow-2xl shadow-slate-900/50 transition-all duration-300 group-hover:shadow-[0_0_35px_rgba(16,185,129,0.3)] group-hover:scale-105 group-hover:-translate-y-1 group-active:scale-98 group-active:translate-y-0 border border-emerald-400/20 group-hover:border-emerald-400/40">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="mb-2 md:mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 relative z-10">
                                        <img 
                                            src="/images/Tienda.png" 
                                            alt="Tienda" 
                                            className="w-18 h-18 md:w-24 md:h-24 object-contain drop-shadow-lg"
                                        />
                                    </div>
                                    <div className="h-10 flex flex-col justify-center relative z-10">
                                        <span className="text-sm md:text-base font-extrabold text-white drop-shadow-md">Tienda</span>
                                    </div>
                                </div>
                                {notifications.shop && (
                                    <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-red-500 ring-2 ring-slate-900 animate-notification-pulse"></span>
                                )}
                            </button>
                            <button
                                onClick={() => handleNavigation('achievements')}
                                disabled={!isReadyForInput}
                                className={`${modeButtonClasses(!isReadyForInput)} aspect-[4/5] group relative overflow-hidden`}
                            >
                                <div className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 w-full h-full flex flex-col items-center justify-center text-center shadow-2xl shadow-slate-900/50 transition-all duration-300 group-hover:shadow-[0_0_35px_rgba(234,179,8,0.3)] group-hover:scale-105 group-hover:-translate-y-1 group-active:scale-98 group-active:translate-y-0 border border-yellow-400/20 group-hover:border-yellow-400/40">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="mb-2 md:mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-2 relative z-10">
                                        <img 
                                            src="/images/Logros.png" 
                                            alt="Logros" 
                                            className="w-18 h-18 md:w-24 md:h-24 object-contain drop-shadow-lg"
                                        />
                                    </div>
                                    <div className="h-10 flex flex-col justify-center relative z-10">
                                        <span className="text-sm md:text-base font-extrabold text-white drop-shadow-md">Logros</span>
                                    </div>
                                </div>
                                {notifications.achievements && (
                                    <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-red-500 ring-2 ring-slate-900 animate-notification-pulse"></span>
                                )}
                            </button>
                            <button
                                onClick={() => handleNavigation('leaderboard')}
                                disabled={!isReadyForInput}
                                className={`${modeButtonClasses(!isReadyForInput)} aspect-[4/5] group relative overflow-hidden`}
                            >
                                <div className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 w-full h-full flex flex-col items-center justify-center text-center shadow-2xl shadow-slate-900/50 transition-all duration-300 group-hover:shadow-[0_0_35px_rgba(100,116,139,0.3)] group-hover:scale-105 group-hover:-translate-y-1 group-active:scale-98 group-active:translate-y-0 border border-slate-400/20 group-hover:border-slate-400/40">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="mb-2 md:mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-1 relative z-10">
                                        <img 
                                            src="/images/Leaderboard.png" 
                                            alt="Ranking" 
                                            className="w-18 h-18 md:w-24 md:h-24 object-contain drop-shadow-lg"
                                            onError={(e:any)=>{ e.currentTarget.src='/images/Logros.png'; }}
                                        />
                                    </div>
                                    <div className="h-10 flex flex-col justify-center relative z-10">
                                        <span className="text-sm md:text-base font-extrabold text-white drop-shadow-md">Ranking</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isInfoModalVisible && <InfoModal onClose={() => setIsInfoModalVisible(false)} />}
        </div>
    );
};

export default memo(HomeScreen);