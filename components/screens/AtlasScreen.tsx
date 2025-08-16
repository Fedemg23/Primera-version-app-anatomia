

import React, { useState, useMemo, memo, useEffect } from 'react';
import { UserData } from '../../types';
import { navigationData } from '../../constants';
import HumanBody from '../HumanBody';
import { Body, BookOpen, PlayCircleIcon, QuestionMarkCircle } from '../icons';

interface AtlasScreenProps {
    userData: UserData;
    onStartQuiz: (regionId: string) => void;
    onNavigateToStudy: (regionId: string) => void;
}

const PreviewModal: React.FC<{ onClose: () => void }> = memo(({ onClose }) => {
    const exampleProgress = {
        'cabeza-cuello': 80,
        'torax': 100,
        'abdomen': 45,
        'miembro-superior': 100,
        'miembro-inferior': 25,
        'pelvis-perine': 10,
        'neuroanatomia': 0,
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md mx-auto transform animate-scale-in w-full text-center" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-black tracking-tighter text-gray-100 mb-2">¡Visualiza tu Dominio!</h2>
                <p className="text-sm text-gray-300 mb-4">Así se ve tu progreso. Las regiones completadas al 100% emiten un aura de maestría.</p>
                <div className="h-64 my-4">
                    <HumanBody 
                        idPrefix="preview-atlas"
                        selectedRegion={null}
                        onSelectRegion={() => {}}
                        regionsProgress={exampleProgress}
                    />
                </div>
                <button onClick={onClose} className="mt-4 w-full bg-slate-200 text-black font-bold py-3 px-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-shadow active:scale-95 touch-manipulation">
                    ¡Entendido!
                </button>
            </div>
        </div>
    );
});


const AtlasScreen: React.FC<AtlasScreenProps> = ({ userData, onStartQuiz, onNavigateToStudy }) => {
    const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [isReadyForInput, setIsReadyForInput] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsReadyForInput(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isPreviewModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isPreviewModalOpen]);

    const regionsProgress = useMemo(() => {
        const progressMap: { [key: string]: number } = {};
        navigationData.forEach(region => {
            const subtemas = region.temas.flatMap(t => t.subtemas);
            if (subtemas.length === 0) {
                progressMap[region.id] = 0;
                return;
            }
            const completedCount = subtemas.filter(st => userData.progress[st.id]?.passed).length;
            progressMap[region.id] = (completedCount / subtemas.length) * 100;
        });
        return progressMap;
    }, [userData.progress]);

    const selectedRegion = useMemo(() => {
        return selectedRegionId ? navigationData.find(r => r.id === selectedRegionId) : null;
    }, [selectedRegionId]);

    const selectedRegionProgress = useMemo(() => {
        if (!selectedRegionId) return null;
        return regionsProgress[selectedRegionId] ?? 0;
    }, [selectedRegionId, regionsProgress]);

    const handleSelectRegion = (regionId: string) => {
        if (!isReadyForInput) return;
        setSelectedRegionId(prev => prev === regionId ? null : regionId);
    };

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-center items-center gap-4 mb-8 text-center">
                 <h2 className="font-graffiti text-4xl md:text-5xl tracking-wide -rotate-1 title-white-clean inline-block transform scale-105">
                    Mapa de Progreso
                </h2>
                 <button onClick={() => isReadyForInput && setIsPreviewModalOpen(true)} disabled={!isReadyForInput} className="text-slate-400 hover:text-slate-200 transition-colors disabled:cursor-wait -rotate-2 touch-manipulation">
                    <QuestionMarkCircle className="w-9 h-9"/>
                </button>
            </div>
            <p className="text-slate-400 mb-6 text-center max-w-xl mx-auto">Selecciona una región en el modelo para explorarla, ver tu progreso y empezar un quiz.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className={`md:col-span-2 bg-slate-800/30 backdrop-blur-sm p-4 rounded-2xl shadow-md border border-slate-700/50 ${!isReadyForInput ? 'pointer-events-none opacity-60' : ''}`}>
                    <HumanBody 
                        idPrefix="main-atlas"
                        selectedRegion={selectedRegionId} 
                        onSelectRegion={handleSelectRegion}
                        regionsProgress={regionsProgress}
                    />
                </div>

                <div className="md:col-span-1 sticky top-24">
                     {selectedRegion && selectedRegionProgress !== null ? (
                        <div className="bg-slate-800/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-slate-700/50 animate-gentle-slide-up-fade">
                            <h3 className="text-2xl font-black text-white mb-2">{selectedRegion.name}</h3>
                            <p className="text-slate-300 mb-4 text-sm">{selectedRegion.description}</p>

                            <div>
                                <div className="flex justify-between text-sm font-semibold mb-1">
                                    <span className="text-slate-300">Progreso</span>
                                    <span className="text-slate-100">{Math.floor(selectedRegionProgress)}%</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-3 shadow-inner">
                                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-300" style={{ width: `${selectedRegionProgress}%` }}></div>
                                </div>
                            </div>
                            
                            <div className="mt-6 space-y-3">
                                <button 
                                    onClick={() => onStartQuiz(selectedRegion.id)}
                                    disabled={!isReadyForInput}
                                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-shadow active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait touch-manipulation">
                                    <PlayCircleIcon className="w-6 h-6" />
                                    <span>Quiz de Región</span>
                                </button>
                                <button
                                    onClick={() => onNavigateToStudy(selectedRegion.id)}
                                    disabled={!isReadyForInput}
                                    className="w-full bg-slate-700 text-slate-200 font-bold py-3 px-4 rounded-xl text-lg shadow-md hover:shadow-lg transition-shadow active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait touch-manipulation">
                                    <BookOpen className="w-5 h-5" />
                                    <span>Modo Estudio</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl text-center border border-dashed border-slate-600 animate-fade-in">
                            <Body className="w-16 h-16 text-slate-500 mx-auto" />
                            <p className="mt-4 text-slate-400 font-semibold">Selecciona una parte del cuerpo para ver los detalles y las opciones de estudio.</p>
                        </div>
                    )}
                </div>
            </div>
            {isPreviewModalOpen && <PreviewModal onClose={() => setIsPreviewModalOpen(false)} />}
        </div>
    );
};

export default memo(AtlasScreen);