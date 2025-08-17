

import React, { useState, useMemo, memo, useEffect } from 'react';
import { Target, ChevronDown } from '../icons';
import HelpIcon from '../HelpIcon';
import { navigationData, questionBank } from '../../constants';
import { ExamConfigSelection } from '../../types';

interface ExamConfigScreenProps {
    onStartExam: (questionIds: string[]) => void;
    onBack: () => void;
    numQuestions: number;
    onNumQuestionsChange: (n: number) => void;
    selection: ExamConfigSelection;
    onSelectionChange: (s: ExamConfigSelection) => void;
}

const ExamConfigScreen: React.FC<ExamConfigScreenProps> = ({ 
    onStartExam, onBack,
    numQuestions, onNumQuestionsChange,
    selection, onSelectionChange
}) => {
    const [expandedRegions, setExpandedRegions] = useState<string[]>([]);
    const [isReadyForInput, setIsReadyForInput] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsReadyForInput(true), 100);
        return () => clearTimeout(timer);
    }, []);
    
    const availableQuestions = useMemo(() => {
        return questionBank.filter(q => {
            const regionSelection = selection[q.tags.regionId];
            if (!regionSelection) return false;
            
            const temaId = `${q.tags.regionId}-${q.tags.tema.replace(/\s+/g, '_')}`;
            return regionSelection.temas[temaId];
        });
    }, [selection]);

    const handleStart = () => {
        const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
        const maxQuestions = Math.min(numQuestions, shuffled.length);
        const selectedQuestionIds = shuffled.slice(0, maxQuestions).map(q => q.id);
        if (selectedQuestionIds.length > 0) {
            onStartExam(selectedQuestionIds);
        }
    };

    const handleRegionToggle = (regionId: string) => {
        const newSelection = JSON.parse(JSON.stringify(selection));
        const newRegionState = !newSelection[regionId].selected;
        newSelection[regionId].selected = newRegionState;
        Object.keys(newSelection[regionId].temas).forEach(temaId => {
            newSelection[regionId].temas[temaId] = newRegionState;
        });
        onSelectionChange(newSelection);
    };

    const handleTemaToggle = (regionId: string, temaId: string) => {
        const newSelection = JSON.parse(JSON.stringify(selection));
        newSelection[regionId].temas[temaId] = !newSelection[regionId].temas[temaId];

        const allTemasForRegionSelected = navigationData
            .find(r => r.id === regionId)?.temas
            .every(t => newSelection[regionId].temas[t.id]);
        
        newSelection[regionId].selected = !!allTemasForRegionSelected;
        onSelectionChange(newSelection);
    };

    const toggleRegionExpansion = (regionId: string) => {
        setExpandedRegions(prev => 
            prev.includes(regionId) ? prev.filter(id => id !== regionId) : [...prev, regionId]
        );
    };
    
    const totalSelectedQuestions = availableQuestions.length;

    return (
        <div className="bg-black min-h-screen p-4 md:p-6">
            <div className="text-center mb-8">
                <Target className="w-24 h-24 mx-auto text-blue-500" />
                <div className="flex items-center justify-center gap-2">
                    <h2 className="text-4xl font-black text-white mt-4">Configurar Examen</h2>
                    <HelpIcon modalTitle="Cómo configurar el examen" ariaLabel="Cómo configurar el examen">
                        <ul>
                            <li>Selecciona <strong>regiones y temas</strong> que quieras incluir.</li>
                            <li>Ajusta el <strong>número de preguntas</strong> con el deslizador.</li>
                            <li>En modo examen <strong>no hay feedback inmediato</strong>. Verás resultados al final.</li>
                            <li>El tiempo límite es de <strong>15s por pregunta</strong>.</li>
                        </ul>
                    </HelpIcon>
                </div>
                <p className="text-slate-400 mt-1">Elige los temas y el número de preguntas.</p>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-700/50 space-y-6">
                <div>
                    <label htmlFor="numQuestions" className="block text-lg font-bold text-slate-200">
                        Número de Preguntas: <span className="text-blue-400">{numQuestions}</span>
                    </label>
                    <input
                        data-tour="exam-slider"
                        id="numQuestions"
                        type="range"
                        min="5"
                        max="100"
                        step="5"
                        value={numQuestions}
                        onChange={(e) => onNumQuestionsChange(Number(e.target.value))}
                        disabled={!isReadyForInput}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer mt-2 disabled:cursor-wait"
                    />
                </div>

                <div>
                    <h3 className="text-lg font-bold text-slate-200 mb-2">Seleccionar Temas</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto p-2 bg-slate-900/50 rounded-lg">
                        {navigationData.map(region => (
                            <div key={region.id} className="bg-gray-800 rounded-lg border border-gray-700">
                                <div className="p-3 flex items-center justify-between cursor-pointer touch-manipulation" onClick={() => isReadyForInput && toggleRegionExpansion(region.id)}>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selection[region.id]?.selected ?? false}
                                            onChange={() => handleRegionToggle(region.id)}
                                            onClick={e => e.stopPropagation()}
                                            disabled={!isReadyForInput}
                                            className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:cursor-wait"
                                        />
                                        <label className="ml-3 font-semibold text-slate-200">{region.name}</label>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${expandedRegions.includes(region.id) ? 'rotate-180' : ''}`} />
                                </div>
                                {expandedRegions.includes(region.id) && (
                                    <div className="pl-8 pr-4 pb-3 space-y-2 border-t border-gray-700">
                                        {region.temas.map(tema => (
                                            <div key={tema.id} className="flex items-center mt-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selection[region.id]?.temas[tema.id] ?? false}
                                                    onChange={() => handleTemaToggle(region.id, tema.id)}
                                                    disabled={!isReadyForInput}
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-wait"
                                                />
                                                <label className="ml-3 text-sm text-gray-300">{tema.name}</label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="mt-8">
                <button
                    onClick={handleStart}
                    disabled={!isReadyForInput || totalSelectedQuestions === 0 || numQuestions === 0}
                    className="w-full font-bold py-4 px-4 rounded-xl text-xl shadow-lg hover:shadow-xl transition-shadow active:scale-95 bg-blue-600 text-white disabled:bg-slate-400 disabled:cursor-not-allowed touch-manipulation"
                >
                    Empezar Examen ({Math.min(numQuestions, totalSelectedQuestions)} Preguntas)
                </button>
            </div>
        </div>
    );
};

export default memo(ExamConfigScreen);