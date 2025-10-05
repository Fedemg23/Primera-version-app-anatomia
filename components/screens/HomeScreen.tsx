
import React, { useState, memo, useEffect } from 'react';
import { HomeIconNotes, BookOpen, Target } from '../icons';
import { useAudio } from '../../src/contexts/AudioProvider';
import HelpIcon from '../HelpIcon';
import { HomeScreenProps, View } from '../../types';
import FloatingAtlas from '../FloatingAtlas';

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


// Función auxiliar para calcular XP por nivel (coincide con LEVEL_REWARDS en constants.ts)
const getXpForLevel = (level: number): number => {
    if (level <= 1) return 0;
    return Math.floor(150 * Math.pow(level - 1, 1.35));
};

const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectMode, userData, onNavigate, notifications }) => {
    const { playSound } = useAudio();
    const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
    const [isReadyForInput, setIsReadyForInput] = useState(false);
    const [showAtlas, setShowAtlas] = useState(true);

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
        <div className="relative flex flex-col min-h-[100vh] items-center p-4" style={{ paddingTop: '0rem' }}>
            
            <div className="flex flex-col justify-start items-center w-full max-w-4xl mx-auto min-h-full gap-6 pt-4">
                {/* Título de bienvenida */}
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg mb-2">
                        ¡Bienvenido a AnatomyGO!
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300">
                        Selecciona un modo de juego para comenzar
                    </p>
                </div>

                {/* Barra de Experiencia Delgada */}
                <div className="w-full max-w-3xl px-4">
                    <div 
                        className="relative group cursor-pointer"
                        onClick={() => onNavigate('level_rewards')}
                    >
                        {/* Info superior: Nivel y XP */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <span className="text-white text-xs font-black">{userData.level}</span>
                                </div>
                                <span className="text-white text-sm font-bold">Nivel {userData.level}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-300 text-xs font-semibold">
                                    {Math.floor(userData.xp - (userData.level > 1 ? getXpForLevel(userData.level) : 0)).toLocaleString()} / {Math.floor(getXpForLevel(userData.level + 1) - getXpForLevel(userData.level)).toLocaleString()} XP
                                </span>
                            </div>
                        </div>

                        {/* Barra de progreso delgada */}
                        <div className="relative w-full h-3 bg-slate-700/60 rounded-full overflow-hidden border border-slate-600/50 shadow-inner group-hover:border-purple-500/50 transition-all duration-300">
                            <div 
                                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full transition-all duration-700 ease-out relative overflow-hidden shadow-lg"
                                style={{ 
                                    width: `${Math.min(100, Math.max(0, ((userData.xp - (userData.level > 1 ? getXpForLevel(userData.level) : 0)) / (getXpForLevel(userData.level + 1) - getXpForLevel(userData.level))) * 100))}%` 
                                }}
                            >
                                {/* Efecto de brillo animado */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shimmer"></div>
                            </div>
                        </div>

                        {/* Indicador de hover */}
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-150 group-hover:shadow-lg group-hover:shadow-purple-400/50"></div>
                    </div>
                </div>

                {/* Modos de juego principales */}
                <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                    <div
                        data-tour="home-study-btn"
                        onClick={() => handleModeSelection('study')}
                        className="relative p-4 rounded-2xl overflow-hidden flex flex-col justify-center items-center text-center h-40 transition-all duration-300 bg-[#121212] ring-4 ring-blue-500/40 hover:ring-blue-500/70 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/20 text-white cursor-pointer touch-manipulation"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <img 
                            src="/images/Modo estudio.png" 
                            alt="Modo Estudio" 
                            className="w-20 h-20 object-contain drop-shadow-2xl mb-2"
                        />
                        <h3 className="text-xl font-black tracking-tight text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                            Modo Estudio
                        </h3>
                    </div>

                    <div
                        onClick={() => handleModeSelection('exam')}
                        className="relative p-4 rounded-2xl overflow-hidden flex flex-col justify-center items-center text-center h-40 transition-all duration-300 bg-[#121212] ring-4 ring-purple-500/40 hover:ring-purple-500/70 transform hover:-translate-y-1 shadow-lg hover:shadow-purple-500/20 text-white cursor-pointer touch-manipulation"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <img 
                            src="/images/Modo examen.png" 
                            alt="Modo Examen" 
                            className="w-20 h-20 object-contain drop-shadow-2xl mb-2"
                        />
                        <h3 className="text-xl font-black tracking-tight text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                            Modo Examen
                        </h3>
                    </div>
                </div>

                {/* Información adicional */}
                <div className="flex items-center gap-2 text-slate-400 hover:text-slate-200 cursor-pointer transition-colors"
                     onClick={() => setIsInfoModalVisible(true)}>
                    <HelpIcon />
                    <span className="text-sm font-medium">¿Necesitas ayuda? Toca aquí</span>
                </div>
            </div>
            
            {isInfoModalVisible && <InfoModal onClose={() => setIsInfoModalVisible(false)} />}
            
            {/* Atlas flotante */}
            {showAtlas && (
                <FloatingAtlas 
                    userData={userData}
                    onClose={() => setShowAtlas(false)}
                    autoShow={true}
                    autoHideDelay={10000}
                />
            )}
        </div>
    );
};

export default memo(HomeScreen);