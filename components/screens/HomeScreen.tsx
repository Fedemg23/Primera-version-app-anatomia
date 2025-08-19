
import React, { useState, memo, useEffect } from 'react';
import { HomeIconNotes, BookOpen, Target } from '../icons';
import HelpIcon from '../HelpIcon';
import { HomeScreenProps, View } from '../../types';

interface InfoModalProps {onClose: () => void}
const InfoModal: React.FC<InfoModalProps> = memo(({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
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
            bg-black ring-4 ring-white/60
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
            font-extrabold text-xs md:text-sm uppercase tracking-wider text-slate-200
            transition-colors duration-300
        ">
            {label}
        </span>
    </button>
));


const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectMode, userData, onNavigate, notifications }) => {
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

    return (
        <div className="relative flex flex-col min-h-screen items-center p-4 pb-24 md:pb-28 overflow-y-scroll" style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom))' }}>
            <img 
                src="/images/logo-bone.png" 
                alt="AnatomyGO" 
                className="absolute top-2 left-4 h-20 md:h-24 w-auto object-contain select-none pointer-events-none z-0" 
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} 
            />
            
            <div className="flex flex-col justify-start w-full max-w-6xl mx-auto min-h-full">
                {/* Top Group: Title and Mode Buttons */}
                <div className="flex flex-col items-center gap-4 md:gap-6 w-full mt-0 md:mt-1">
                    <div className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px] mx-auto">
                        {/* Botón Desafíos centrado encima de la cuadrícula */}
                        <div className="flex justify-center mb-2 md:mb-3">
                            <button
                                onClick={() => onNavigate('challenges')}
                                disabled={!isReadyForInput}
                                className={`${modeButtonClasses(!isReadyForInput)} group w-1/2`}
                            >
                                <div className="rounded-2xl bg-black w-full h-8 md:h-10 flex items-center justify-center text-center ring-4 ring-white/60 transition-[box-shadow,transform,ring] duration-200 group-hover:ring-white group-hover:shadow-[0_0_28px_rgba(255,255,255,0.5)] group-active:scale-95 group-active:-translate-y-0.5 group-active:shadow-[0_0_18px_rgba(255,255,255,0.4)]">
                                    <span className="text-sm md:text-base font-extrabold text-slate-100">Desafíos</span>
                                </div>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                        <button
                            data-tour="home-study-btn"
                            onClick={() => onSelectMode('study')}
                            disabled={!isReadyForInput}
                            className={`${modeButtonClasses(!isReadyForInput)} aspect-[4/5] group`}
                        >
                            <div className="rounded-2xl bg-black w-full h-full flex flex-col items-center justify-center text-center ring-4 ring-white/60 transition-[box-shadow,transform,ring] duration-200 group-hover:ring-white group-hover:shadow-[0_0_28px_rgba(255,255,255,0.5)] group-active:scale-95 group-active:-translate-y-0.5 group-active:shadow-[0_0_18px_rgba(255,255,255,0.4)]">
                                <div className="mb-1 md:mb-2">
                                    <img 
                                        src="/images/Modo estudio.png" 
                                        alt="Modo Estudio" 
                                        className="w-18 h-18 md:w-20 md:h-20 object-contain"
                                    />
                                </div>
                                <span className="text-xs md:text-sm font-extrabold text-slate-100 leading-tight">
                                    <span className="block">Modo</span>
                                    <span className="block">Estudio</span>
                                </span>
                            </div>
                        </button>
                        <button
                            onClick={() => onSelectMode('exam')}
                            disabled={!isReadyForInput}
                            className={`${modeButtonClasses(!isReadyForInput)} aspect-[4/5] group`}
                        >
                            <div className="rounded-2xl bg-black w-full h-full flex flex-col items-center justify-center text-center ring-4 ring-white/60 transition-[box-shadow,transform,ring] duration-200 group-hover:ring-white group-hover:shadow-[0_0_28px_rgba(255,255,255,0.5)] group-active:scale-95 group-active:-translate-y-0.5 group-active:shadow-[0_0_18px_rgba(255,255,255,0.4)]">
                                <div className="mb-1 md:mb-2">
                                    <img 
                                        src="/images/Modo examen.png" 
                                        alt="Modo Examen" 
                                        className="w-18 h-18 md:w-20 md:h-20 object-contain"
                                    />
                                </div>
                                <span className="text-xs md:text-sm font-extrabold text-slate-100 leading-tight">
                                    <span className="block">Modo</span>
                                    <span className="block">Examen</span>
                                </span>
                            </div>
                        </button>
                        <button
                            onClick={() => onNavigate('shop')}
                            disabled={!isReadyForInput}
                            className={`${modeButtonClasses(!isReadyForInput)} aspect-[4/5] group`}
                        >
                            <div className="rounded-2xl bg-black w-full h-full flex flex-col items-center justify-center text-center ring-4 ring-white/60 transition-[box-shadow,transform,ring] duration-200 group-hover:ring-white group-hover:shadow-[0_0_28px_rgba(255,255,255,0.5)] group-active:scale-95 group-active:-translate-y-0.5 group-active:shadow-[0_0_18px_rgba(255,255,255,0.4)]">
                                <div className="mb-1 md:mb-2">
                                    <img 
                                        src="/images/Tienda.png" 
                                        alt="Tienda" 
                                        className="w-18 h-18 md:w-20 md:h-20 object-contain"
                                    />
                                </div>
                                <span className="text-xs md:text-sm font-extrabold text-slate-100">Tienda</span>
                            </div>
                        </button>
                        <button
                            onClick={() => onNavigate('achievements')}
                            disabled={!isReadyForInput}
                            className={`${modeButtonClasses(!isReadyForInput)} aspect-[4/5] group`}
                        >
                            <div className="rounded-2xl bg-black w-full h-full flex flex-col items-center justify-center text-center ring-4 ring-white/60 transition-[box-shadow,transform,ring] duration-200 group-hover:ring-white group-hover:shadow-[0_0_28px_rgba(255,255,255,0.5)] group-active:scale-95 group-active:-translate-y-0.5 group-active:shadow-[0_0_18px_rgba(255,255,255,0.4)]">
                                <div className="mb-1 md:mb-2">
                                    <img 
                                        src="/images/Logros.png" 
                                        alt="Logros" 
                                        className="w-18 h-18 md:w-20 md:h-20 object-contain"
                                    />
                                </div>
                                <span className="text-xs md:text-sm font-extrabold text-slate-100">Logros</span>
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