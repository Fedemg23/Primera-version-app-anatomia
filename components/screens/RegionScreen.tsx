import React, { memo, useState, useEffect } from 'react';
import { UserData, NavigationRegion, NavigationTema, NavigationSubtema } from '../../types';
import { navigationData } from '../../constants';
import { Lock, StarFilled, CheckCircle, ChevronRight, iconMap, PlayCircleIcon } from '../icons';
import HelpIcon from '../HelpIcon';

// ==========================================================================================
// COMPONENTES DE LA UI
// ==========================================================================================

const SubtemaItem: React.FC<{
    subtema: NavigationSubtema;
    isPassed: boolean;
    bestScore: number;
    onPlay: () => void;
    disabled: boolean;
}> = memo(({ subtema, isPassed, bestScore, onPlay, disabled }) => {
    if (isPassed) {
        return (
            <div className="p-2 rounded-xl bg-black text-slate-300 flex items-center justify-between transition-[box-shadow,transform,ring] duration-200 ring-4 ring-white/60 hover:ring-white hover:shadow-[0_0_20px_rgba(255,255,255,0.35)]">
                <div className="flex items-center gap-3 overflow-hidden">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="font-semibold truncate text-sm">{subtema.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-bold flex items-center gap-1 text-yellow-400" title={`Mejor Puntuación: ${Math.round(bestScore * 100)}%`}>
                        <StarFilled className="w-4 h-4 text-amber-400" />
                        {Math.round(bestScore * 100)}%
                    </span>
                    <button 
                        onClick={onPlay} 
                        disabled={disabled}
                        className="font-semibold text-xs px-2 py-1 rounded-full text-slate-100 ring-1 ring-white/50 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation">
                        REPETIR
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={onPlay}
            disabled={disabled}
            className="w-full p-2 rounded-xl flex items-center justify-between text-left transition-[box-shadow,transform,ring] duration-200 ease-in-out group bg-black ring-4 ring-white/60 hover:ring-white hover:shadow-[0_0_20px_rgba(255,255,255,0.35)] shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-wait disabled:transform-none disabled:shadow-md touch-manipulation"
        >
            <div className="flex items-center gap-3 overflow-hidden">
                <PlayCircleIcon className="w-6 h-6 flex-shrink-0 text-slate-300 group-hover:text-white transition-colors duration-200" />
                <span className="font-bold text-sm text-slate-100 truncate">{subtema.name}</span>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
                <span className="text-xs font-semibold text-slate-100 ring-1 ring-white/50 rounded-full px-3 py-1 transition-colors duration-200">
                    JUGAR
                </span>
                <p className="text-xs text-slate-400 mt-1">{subtema.questionCount} preguntas</p>
            </div>
        </button>
    );
});

interface RegionScreenProps {
    onStartQuiz: (subtemaId: string) => void;
    onBack: () => void;
    userData: UserData;
    selectedRegionId: string | null;
    selectedTemaId: string | null;
    onSelectRegion: (id: string) => void;
    onSelectTema: (id: string) => void;
}

const RegionScreen: React.FC<RegionScreenProps> = ({ 
    onStartQuiz, onBack, userData, 
    selectedRegionId, selectedTemaId, onSelectRegion, onSelectTema 
}) => {
    const [isReadyForInput, setIsReadyForInput] = useState(false);
    
    useEffect(() => {
        setIsReadyForInput(false);
        const timer = setTimeout(() => setIsReadyForInput(true), 100); // Prevent click-through
        return () => clearTimeout(timer);
    }, [selectedRegionId, selectedTemaId]);

    const selectedRegion = selectedRegionId ? navigationData.find(r => r.id === selectedRegionId) : null;
    const selectedTema = selectedRegion && selectedTemaId ? selectedRegion.temas.find(t => t.id === selectedTemaId) : null;
    
    const renderContent = () => {
        // Nivel 3: Vista de Subtemas (Cuestionarios)
        if (selectedRegion && selectedTema) {
            return (
                 <div className="h-full flex flex-col">
                    <div className="text-center mb-2">
                        <h2 className="font-graffiti text-3xl md:text-4xl tracking-wide -rotate-1 title-white-clean inline-block transform scale-105">
                            {selectedTema.name}
                        </h2>
                    </div>
                    <p className="text-slate-400 mb-2 text-center text-sm">Elige un subtema para empezar a estudiar.</p>
                    <div className="flex-1 grid grid-cols-3 gap-2 content-start max-w-6xl mx-auto">
                        {selectedTema.subtemas.map((subtema) => {
                            const progress = userData.progress[subtema.id];
                            return (
                                 <div key={subtema.id}>
                                    <SubtemaItem
                                        subtema={subtema}
                                        isPassed={progress?.passed ?? false}
                                        bestScore={progress?.bestScore || 0}
                                        onPlay={() => onStartQuiz(subtema.id)}
                                        disabled={!isReadyForInput}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
    
        // Nivel 2: Vista de Temas
        if (selectedRegion) {
            return (
                <div className="h-full flex flex-col">
                    <div className="text-center mb-2">
                        <h2 className="font-graffiti text-3xl md:text-4xl tracking-wide -rotate-1 title-white-clean inline-block transform scale-105">
                            {selectedRegion.name}
                        </h2>
                    </div>
                    <p className="text-slate-400 mb-2 text-center text-sm">Elige un tema para explorar.</p>
                    <div className="flex-1 grid grid-cols-3 gap-2 content-start max-w-6xl mx-auto">
                        {selectedRegion.temas.map((tema) => {
                            const completedCount = tema.subtemas.filter(st => userData.progress[st.id]?.passed).length;
                            const totalCount = tema.subtemas.length;
                            const isCompleted = completedCount === totalCount;
                            return (
                                <button key={tema.id} data-tour="study-tema-btn" onClick={() => onSelectTema(tema.id)} disabled={!isReadyForInput} className="w-full bg-black p-3 rounded-xl shadow-md ring-4 ring-white/60 flex items-center justify-between text-left transition-[box-shadow,transform,ring] duration-200 ease-in-out hover:shadow-[0_0_20px_rgba(255,255,255,0.35)] hover:ring-white disabled:pointer-events-none disabled:opacity-60 disabled:transform-none touch-manipulation">
                                    <div className="flex items-center">
                                        <div>
                                            <h3 className="text-md font-bold text-slate-100">{tema.name}</h3>
                                            <p className="text-xs text-slate-400">{isCompleted ? 'Completado' : `${completedCount} / ${totalCount} completados`}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                         {isCompleted && <StarFilled className="w-5 h-5 text-amber-400" />}
                                        <ChevronRight className="w-6 h-6 text-slate-300 transition-transform duration-200 group-hover:translate-x-1" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            );
        }
    
        // Nivel 1: Vista de Regiones
        return (
            <div className="h-full flex flex-col">
                <div className="text-center mb-3">
                    <h2 className="font-graffiti text-4xl md:text-5xl tracking-wide -rotate-1 title-white-clean inline-block transform scale-105">
                        Elige una Región
                    </h2>
                    <div className="mt-1">
                        <HelpIcon modalTitle="Cómo estudiar por regiones">
                            <ul>
                                <li>Selecciona una <strong>región</strong> para ver sus <strong>temas</strong>.</li>
                                <li>Dentro de un tema, elige un <strong>subtema</strong> para hacer un quiz.</li>
                                <li>Si apruebas, marcarás el subtema como <strong>completado</strong>.</li>
                            </ul>
                        </HelpIcon>
                    </div>
                </div>
                <div className="flex-1 grid grid-cols-3 gap-3 content-start max-w-6xl mx-auto">
                    {navigationData.map((region) => (
                        <div
                            key={region.id}
                            onClick={() => isReadyForInput && onSelectRegion(region.id)}
                            className={`
                                relative p-4 rounded-2xl overflow-hidden
                                flex flex-col justify-center items-center text-center h-32
                                transition-[box-shadow,transform,ring] duration-200 ease-in-out
                                bg-black ring-4 ring-white/60 hover:ring-white
                                transform hover:-translate-y-1
                                shadow-lg hover:shadow-[0_0_24px_rgba(255,255,255,0.35)]
                                text-white
                                ${!isReadyForInput ? 'pointer-events-none' : 'cursor-pointer'}
                                touch-manipulation
                            `}
                        >
                            <div className="relative z-10 w-full flex flex-col items-center">
                                <h3 className="text-xl font-black tracking-tight text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] mb-1">{region.name}</h3>
                                <p className="text-white/90 text-xs max-w-xs mx-auto [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                                    {region.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-black h-screen overflow-hidden flex flex-col p-6 md:p-8">
            <div className="flex-1 overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};

export default memo(RegionScreen);