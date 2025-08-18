
import React, { useState, memo, useEffect } from 'react';
import { HomeIconStudy, HomeIconExam, HomeIconDuel, HomeIconProgress, HomeIconShop, HomeIconAchievements, HomeIconNotes, BookOpen, Target, Swords, iconMap } from '../icons';
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
                 <div>
                    <h3 className="font-bold text-lg text-gray-100 flex items-center gap-2"><Swords className="w-5 h-5"/> Modo Duelo</h3>
                    <p className="mt-1">Enfréntate a oponentes de IA con personalidades únicas. ¡Demuestra quién sabe más en un desafío cara a cara!</p>
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
        className="group flex flex-col items-center justify-center w-24 text-center gap-2 transition-all duration-300 ease-in-out disabled:opacity-60 disabled:cursor-wait touch-manipulation"
    >
        <div className="
            relative w-20 h-20 rounded-full
            flex items-center justify-center
            bg-slate-800/40 backdrop-blur-sm
            border border-slate-700/50
            shadow-lg group-hover:shadow-blue-500/20
            transition-all duration-300 ease-in-out
            group-active:scale-95 group-active:shadow-lg
        ">
            <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)]"></div>

            <div className="absolute -inset-px rounded-full bg-gradient-to-br from-blue-400 via-cyan-400 to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>

            <div className="relative text-slate-300 group-hover:text-white transition-all duration-300 [filter:drop-shadow(0_0_3px_rgba(255,255,255,0.3))] group-hover:[filter:drop-shadow(0_0_4px_rgba(255,255,255,0.5))_brightness(1.2)]">
                {icon}
            </div>

             {hasNotification && (
               <span className="absolute top-2 right-2 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-slate-900 animate-notification-pulse"></span>
           )}
        </div>
        <span className="
            font-semibold text-xs uppercase tracking-wider text-slate-400 group-hover:text-slate-200
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
        group relative
        rounded-3xl p-[2px] w-full max-w-xl mx-auto
        bg-gradient-to-br from-slate-600/40 via-slate-700/10 to-slate-800/40
        hover:from-blue-600/30 hover:via-cyan-500/10 hover:to-blue-800/30
        transition-all duration-300 ease-in-out
        ${disabled ? 'opacity-60 cursor-wait pointer-events-none' : 'shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 active:scale-[0.98]'}
    `;

    return (
        <div className="relative flex flex-col h-full items-center p-4">
            <img 
                src="/images/logo-bone.png" 
                alt="AnatomyGO" 
                className="absolute top-2 left-4 h-20 md:h-24 w-auto object-contain select-none pointer-events-none z-0" 
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} 
            />
            
            <div className="flex-grow lg:flex-none flex flex-col md:justify-center lg:justify-start w-full max-w-4xl mx-auto">
                {/* Top Group: Title and Mode Buttons */}
                <div className="flex flex-col items-center gap-6 md:gap-8 w-full">
                    <div className="relative w-full flex items-center justify-center text-center">
                        <h1 className="font-graffiti font-black text-5xl md:text-6xl tracking-wide -rotate-2 title-white-clean inline-block transform scale-110 md:scale-125">
                            Elige tu Modo
                        </h1>
                        <HelpIcon modalTitle="Ayuda de Inicio" ariaLabel="Ayuda de Inicio" className="absolute -right-14 md:-right-24 top-0 md:top-1 -rotate-2 z-10">
                            <ul>
                                <li><strong>Estudio</strong>: repasa por regiones/temas y recibe feedback inmediato.</li>
                                <li><strong>Examen</strong>: combina temas, establece nº de preguntas y tiempo fijo.</li>
                                <li><strong>Duelo IA</strong>: reta a un Maestro para ganar un Apunte exclusivo.</li>
                                <li>Abajo encuentras accesos a <strong>Progreso</strong>, <strong>Tienda</strong>, <strong>Logros</strong> y <strong>Desafíos</strong>.</li>
                            </ul>
                        </HelpIcon>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                        <button
                            data-tour="home-study-btn"
                            onClick={() => onSelectMode('study')}
                            disabled={!isReadyForInput}
                            className={`${modeButtonClasses(!isReadyForInput)}`}
                        >
                            <div className="rounded-[22px] bg-slate-900/70 backdrop-blur-md border border-slate-700/60 p-5 md:p-6 w-full flex items-center text-left relative overflow-hidden">
                                <div className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-20 transition-opacity bg-[radial-gradient(120px_60px_at_20%_20%,rgba(59,130,246,.5),transparent)]"/>
                                <div className="text-5xl text-blue-400/80 mr-6 w-14 transition-all duration-300 group-hover:text-blue-400 group-hover:scale-110">
                                    <HomeIconStudy />
                                </div>
                                <div>
                                    <span className="text-2xl font-extrabold block text-slate-100">Modo Estudio</span>
                                    <p className="text-sm text-slate-400 mt-1 font-normal">
                                        Aprende y repasa temas específicos a tu ritmo.
                                    </p>
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={() => onSelectMode('exam')}
                            disabled={!isReadyForInput}
                            className={`${modeButtonClasses(!isReadyForInput)}`}
                        >
                            <div className="rounded-[22px] bg-slate-900/70 backdrop-blur-md border border-slate-700/60 p-5 md:p-6 w-full flex items-center text-left relative overflow-hidden">
                                <div className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-20 transition-opacity bg-[radial-gradient(120px_60px_at_20%_20%,rgba(59,130,246,.5),transparent)]"/>
                                <div className="text-5xl text-sky-400/80 mr-6 w-14 transition-all duration-300 group-hover:text-sky-400 group-hover:scale-110">
                                    <HomeIconExam />
                                </div>
                                <div>
                                    <span className="text-2xl font-extrabold block text-slate-100">Modo Examen</span>
                                    <p className="text-sm text-slate-400 mt-1 font-normal">
                                        Ponte a prueba con quizzes aleatorios y contra el tiempo.
                                    </p>
                                </div>
                            </div>
                        </button>
                         <button
                            onClick={() => onSelectMode('duel')}
                            disabled={!isReadyForInput}
                            className={`${modeButtonClasses(!isReadyForInput)}`}
                        >
                            <div className="rounded-[22px] bg-slate-900/70 backdrop-blur-md border border-slate-700/60 p-5 md:p-6 w-full flex items-center text-left relative overflow-hidden">
                                <div className="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-20 transition-opacity bg-[radial-gradient(120px_60px_at_20%_20%,rgba(59,130,246,.5),transparent)]"/>
                                <div className="text-5xl text-cyan-400/80 mr-6 w-14 transition-all duration-300 group-hover:text-cyan-400 group-hover:scale-110">
                                    <HomeIconDuel />
                                </div>
                                <div>
                                    <span className="text-2xl font-extrabold block text-slate-100">Duelo IA</span>
                                    <p className="text-sm text-slate-400 mt-1 font-normal">
                                        Enfréntate a oponentes con personalidades únicas.
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Group: Secondary Navigation Hub */}
            <div className="flex-shrink-0 pt-6 md:pt-10 lg:pt-6">
                <div className="flex justify-center items-center gap-2 md:gap-4">
                    <NavItem 
                        label="PROGRESO"
                        icon={<HomeIconProgress className="w-9 h-9 text-slate-300"/>}
                        onClick={() => onNavigate('atlas')}
                        disabled={!isReadyForInput}
                    />
                    <NavItem 
                        label="TIENDA"
                        icon={(() => { const S = iconMap['store_img']; return <S className="w-14 h-14 opacity-80 [filter:grayscale(1)_brightness(1.05)_contrast(1.05)] group-hover:brightness-125" /> })()}
                        onClick={() => onNavigate('shop')}
                        disabled={!isReadyForInput}
                        hasNotification={notifications.shop}
                    />
                    <NavItem 
                        label="LOGROS"
                        icon={<HomeIconAchievements className="w-9 h-9 text-slate-300"/>}
                        onClick={() => onNavigate('achievements')}
                        disabled={!isReadyForInput}
                        hasNotification={notifications.achievements}
                    />
                    <NavItem 
                        label="DESAFÍOS"
                        icon={(() => { const Arch = iconMap['archery']; return <Arch className="w-14 h-14 opacity-80 [filter:grayscale(1)_brightness(1.05)_contrast(1.05)] group-hover:brightness-125" /> })()}
                        onClick={() => onNavigate('challenges')}
                        disabled={!isReadyForInput}
                        hasNotification={notifications.challenges}
                    />
                </div>
            </div>

            {isInfoModalVisible && <InfoModal onClose={() => setIsInfoModalVisible(false)} />}
        </div>
    );
};

export default memo(HomeScreen);