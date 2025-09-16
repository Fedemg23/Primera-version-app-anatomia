import React, { useState, useCallback } from 'react';
import { UserData } from '../types';

interface WelcomeModalProps {
    isOpen: boolean;
    onComplete: (name: string) => void;
    userEmail?: string;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onComplete, userEmail }) => {
    const [step, setStep] = useState<'welcome' | 'name-selection'>('welcome');
    const [userName, setUserName] = useState('');

    const handleContinueToNameSelection = useCallback(() => {
        setStep('name-selection');
    }, []);

    const handleCompleteName = useCallback(() => {
        if (userName.trim()) {
            onComplete(userName.trim());
        }
    }, [userName, onComplete]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && userName.trim()) {
            handleCompleteName();
        }
    }, [userName, handleCompleteName]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-600/50 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-scale-in">
                {step === 'welcome' ? (
                    <div className="p-8 text-center">
                        {/* Icono de bienvenida */}
                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl">
                            🎉
                        </div>
                        
                        <h1 className="text-3xl font-bold text-white mb-4">
                            ¡Bienvenido a AnatomyGO!
                        </h1>
                        
                        <p className="text-slate-300 text-lg mb-2">
                            ¡Qué emocionante tenerte aquí!
                        </p>
                        
                        <p className="text-slate-400 mb-6">
                            Estás a punto de embarcarte en una increíble aventura de aprendizaje donde la anatomía cobra vida.
                        </p>

                        {userEmail && (
                            <div className="bg-slate-700/50 rounded-lg p-3 mb-6">
                                <p className="text-sm text-slate-400 mb-1">Cuenta conectada:</p>
                                <p className="text-slate-200 font-medium">{userEmail}</p>
                            </div>
                        )}

                        <div className="space-y-3 text-left mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-slate-300">Aprende anatomía de forma interactiva</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span className="text-slate-300">Gana puntos y desbloquea logros</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                <span className="text-slate-300">Compite con amigos y estudia juntos</span>
                            </div>
                        </div>

                        <button
                            onClick={handleContinueToNameSelection}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                        >
                            ¡Comencemos! 🚀
                        </button>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        {/* Icono de perfil */}
                        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-3xl">
                            👤
                        </div>
                        
                        <h2 className="text-2xl font-bold text-white mb-4">
                            ¿Cómo te gustaría que te llamemos?
                        </h2>
                        
                        <p className="text-slate-400 mb-6">
                            Elige un nombre que aparecerá en tu perfil y en las tablas de clasificación.
                        </p>

                        <div className="mb-6">
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Escribe tu nombre aquí..."
                                className="w-full bg-slate-700/70 border border-slate-600 rounded-lg px-4 py-3 text-white text-lg text-center placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                maxLength={20}
                                autoFocus
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                Máximo 20 caracteres
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleCompleteName}
                                disabled={!userName.trim()}
                                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                Continuar
                            </button>
                            
                            <button
                                onClick={() => setStep('welcome')}
                                className="w-full text-slate-400 hover:text-slate-300 py-2 text-sm transition-colors"
                            >
                                ← Volver
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WelcomeModal;
