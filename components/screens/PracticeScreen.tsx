import React, { memo } from 'react';
import { UserData } from '../../types';
import { BrainCircuit } from '../icons';

interface PracticeScreenProps {
    userData: UserData;
    onStartPractice: () => void;
}

const PracticeScreen: React.FC<PracticeScreenProps> = ({ userData, onStartPractice }) => {
    const weakPointsCount = userData.weakPoints.length;
    const canPractice = weakPointsCount > 0;

    return (
        <div className="p-4 md:p-6 flex flex-col items-center justify-center text-center h-full bg-gray-50 dark:bg-gray-900">
            <div className="animate-fade-in space-y-4 max-w-lg">
                <div className="relative inline-block">
                    <BrainCircuit className="w-32 h-32 text-gray-500 dark:text-gray-400" />
                    <div className="absolute inset-0 bg-gray-500 rounded-full -z-10 opacity-10 animate-ping-slow" style={{animationDelay: '1s'}}></div>
                </div>

                <h2 className="text-5xl font-black text-gray-800 dark:text-white tracking-tight">Zona de Práctica</h2>
                
                {canPractice ? (
                    <>
                        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-md mx-auto">
                            Tienes <strong className="text-gray-700 dark:text-gray-100">{weakPointsCount}</strong> pregunta{weakPointsCount === 1 ? '' : 's'} que has fallado. ¡Es hora de repasarlas y fortalecer tu conocimiento!
                        </p>
                        <button
                            onClick={onStartPractice}
                            className="w-full bg-gray-800 dark:bg-gray-200 text-white dark:text-black font-bold py-4 px-8 rounded-xl text-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                        >
                            <BrainCircuit className="w-6 h-6" />
                            Empezar Repaso
                        </button>
                    </>
                ) : (
                    <>
                         <p className="text-gray-600 dark:text-gray-300 text-lg max-w-md mx-auto">
                            ¡Felicidades! No tienes puntos débiles por ahora. Has respondido todo correctamente.
                        </p>
                        <button
                            disabled
                            className="w-full bg-gray-400 dark:bg-gray-700 text-white font-bold py-4 px-8 rounded-xl text-xl shadow-lg cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            <BrainCircuit className="w-6 h-6" />
                            Todo Repasado
                        </button>
                    </>
                )}

            </div>
             <style>{`
                @keyframes ping-slow {
                    75%, 100% {
                        transform: scale(1.8);
                        opacity: 0;
                    }
                }
                .animate-ping-slow {
                    animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default memo(PracticeScreen);