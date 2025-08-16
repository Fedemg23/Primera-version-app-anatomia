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
            <div className="p-3 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-300 flex items-center justify-between transition-colors duration-300">
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
                        className="font-semibold text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300 active:bg-slate-600 transition-colors transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation">
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
            className="w-full p-3 rounded-xl flex items-center justify-between text-left transition-all duration-300 ease-in-out group
            bg-slate-800/40 backdrop-blur-sm hover:bg-slate-800/80
            shadow-md hover:shadow-lg hover:-translate-y-0.5
            border border-slate-700/50 hover:border-blue-500/50
            disabled:opacity-60 disabled:cursor-wait disabled:transform-none disabled:shadow-md disabled:active:border-slate-700/50
            touch-manipulation"
        >
            <div className="flex items-center gap-3 overflow-hidden">
                <PlayCircleIcon className="w-6 h-6 flex-shrink-0 text-slate-400 group-hover:text-blue-400 transition-colors duration-300" />
                <span className="font-bold text-sm text-slate-100 truncate">{subtema.name}</span>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
                <span className="text-xs font-semibold bg-blue-600 group-hover:bg-blue-500 text-white rounded-full px-3 py-1 transition-colors duration-300">
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
                 <div>
                    <div className="text-center mb-4">
                        <h2 className="font-graffiti text-4xl tracking-wide -rotate-1 title-white-clean inline-block transform scale-105">
                            {selectedTema.name}
                        </h2>
                    </div>
                    <p className="text-slate-400 mb-3 text-center text-sm">Elige un subtema para empezar a estudiar.</p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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
                <div>
                    <div className="text-center mb-4">
                        <h2 className="font-graffiti text-4xl tracking-wide -rotate-1 title-white-clean inline-block transform scale-105">
                            {selectedRegion.name}
                        </h2>
                    </div>
                    <p className="text-slate-400 mb-3 text-center text-sm">Elige un tema para explorar.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedRegion.temas.map((tema) => {
                            const completedCount = tema.subtemas.filter(st => userData.progress[st.id]?.passed).length;
                            const totalCount = tema.subtemas.length;
                            const isCompleted = completedCount === totalCount;
                            return (
                                <button key={tema.id} data-tour="study-tema-btn" onClick={() => onSelectTema(tema.id)} disabled={!isReadyForInput} className="w-full bg-slate-800/40 backdrop-blur-sm p-4 rounded-xl shadow-md border border-slate-700/50 flex items-center justify-between text-left transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-0.5 hover:border-blue-500/60 disabled:pointer-events-none disabled:opacity-60 disabled:transform-none touch-manipulation">
                                    <div className="flex items-center">
                                        <div>
                                            <h3 className="text-md font-bold text-slate-100">{tema.name}</h3>
                                            <p className="text-xs text-slate-400">{isCompleted ? 'Completado' : `${completedCount} / ${totalCount} completados`}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                         {isCompleted && <StarFilled className="w-5 h-5 text-amber-400" />}
                                        <ChevronRight className="w-6 h-6 text-slate-400 transition-transform duration-300 group-hover:translate-x-1" />
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
            <div>
                <div className="text-center mb-6">
                    <h2 className="font-graffiti text-5xl md:text-5xl tracking-wide -rotate-1 title-white-clean inline-block transform scale-105">
                        Elige una Región
                    </h2>
                    <div className="mt-2">
                        <HelpIcon modalTitle="Cómo estudiar por regiones">
                            <ul>
                                <li>Selecciona una <strong>región</strong> para ver sus <strong>temas</strong>.</li>
                                <li>Dentro de un tema, elige un <strong>subtema</strong> para hacer un quiz.</li>
                                <li>Si apruebas, marcarás el subtema como <strong>completado</strong>.</li>
                            </ul>
                        </HelpIcon>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {navigationData.map((region) => (
                        <div
                            key={region.id}
                            onClick={() => isReadyForInput && onSelectRegion(region.id)}
                            className={`
                                relative p-5 rounded-2xl overflow-hidden
                                flex flex-col justify-center items-center text-center h-40
                                transition-all duration-300 ease-in-out
                                bg-gradient-to-br ${region.visuals.gradient}
                                transform hover:-translate-y-1
                                shadow-lg hover:shadow-xl hover:shadow-[0_0_1.5rem_rgba(59,130,246,0.2)]
                                border border-slate-700/50 hover:border-white/20
                                text-white
                                ${!isReadyForInput ? 'pointer-events-none' : 'cursor-pointer'}
                                touch-manipulation
                            `}
                        >
                            <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-colors duration-300"></div>
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
        <div className="p-3 md:p-4">
            {renderContent()}
        </div>
    );
};

export default memo(RegionScreen);