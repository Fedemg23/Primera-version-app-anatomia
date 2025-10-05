import React, { useState, useEffect } from 'react';
import Atlas, { AtlasExpression } from './Atlas';
import { UserData } from '../types';

interface FloatingAtlasProps {
    userData: UserData;
    onClose?: () => void;
    autoShow?: boolean;
    autoHideDelay?: number; // en milisegundos
}

const FloatingAtlas: React.FC<FloatingAtlasProps> = ({ 
    userData, 
    onClose,
    autoShow = true,
    autoHideDelay = 8000
}) => {
    const [isVisible, setIsVisible] = useState(autoShow);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        if (autoShow && autoHideDelay > 0) {
            const timer = setTimeout(() => {
                setIsMinimized(true);
            }, autoHideDelay);

            return () => clearTimeout(timer);
        }
    }, [autoShow, autoHideDelay]);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) {
            onClose();
        }
    };

    const handleToggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Versión minimizada - botón flotante */}
            {isMinimized ? (
                <button
                    onClick={handleToggleMinimize}
                    className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40 
                               bg-gradient-to-br from-indigo-500 to-purple-600 
                               rounded-full p-3 shadow-2xl 
                               hover:scale-110 active:scale-95 
                               transition-transform duration-200
                               border-2 border-white/30
                               animate-bounce-gentle"
                    aria-label="Abrir Atlas"
                >
                    <Atlas expression="happy" size="small" />
                    {/* Indicador de mensaje disponible */}
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                </button>
            ) : (
                /* Versión expandida - card flotante */
                <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40 animate-slide-up-fade">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-4 max-w-xs">
                        {/* Botones de control */}
                        <div className="flex justify-end gap-2 mb-2">
                            <button
                                onClick={handleToggleMinimize}
                                className="text-slate-400 hover:text-slate-200 transition-colors p-1"
                                aria-label="Minimizar"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={handleClose}
                                className="text-slate-400 hover:text-red-400 transition-colors p-1"
                                aria-label="Cerrar"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Atlas con mensaje */}
                        <Atlas 
                            userData={userData}
                            size="medium"
                            showMessage={true}
                        />

                        {/* Estadísticas rápidas */}
                        <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-3 gap-2 text-center">
                            <div>
                                <div className="text-2xl font-bold text-indigo-400">{userData.level}</div>
                                <div className="text-xs text-slate-400">Nivel</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-orange-400">{userData.streak}</div>
                                <div className="text-xs text-slate-400">Racha</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-yellow-400">{userData.bones}</div>
                                <div className="text-xs text-slate-400">Huesos</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FloatingAtlas;


