import React, { memo, useState } from 'react';
import { SettingsPopoverProps } from '../types';
import HelpIcon from './HelpIcon';
import { LogOut } from './icons';

const SettingsPopover: React.FC<SettingsPopoverProps> = ({ 
    isOpen, 
    onClose, 
    isDevMode, 
    onUnlockAll, 
    onSignOut,
    onToggleDevMode, 
    onResetData 
}) => {
    if (!isOpen) return null;

    const [devClicks, setDevClicks] = useState(0);

    const handleVersionClick = () => {
        const newClicks = devClicks + 1;
        setDevClicks(newClicks);
        if (newClicks >= 7) {
            onToggleDevMode();
            setDevClicks(0); // reset after toggle
        }
    };

    const handleUnlock = () => {
        onUnlockAll();
        onClose();
    };
    
    const handleLogout = () => {
        onSignOut();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-40" onClick={onClose}>
            <div 
                className="absolute top-[80px] right-4 w-64 bg-gray-800/80 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700 p-2 animate-scale-in"
                style={{ transformOrigin: 'top right' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="space-y-1">
                    <button
                        onClick={() => { (window as any).__OPEN_TOUR__?.(); onClose(); }}
                        className="w-full flex items-center gap-3 text-left text-blue-300 font-semibold px-3 py-2 rounded-md hover:bg-blue-900/30 transition-colors touch-manipulation"
                    >
                        <span className="text-lg">❓</span>
                        <span>Iniciar Tutorial</span>
                    </button>
                    {onResetData && (
                        <button
                            onClick={() => { onResetData(); onClose(); }}
                            className="w-full flex items-center gap-3 text-left text-slate-300 font-semibold px-3 py-2 rounded-md hover:bg-slate-700/40 transition-colors touch-manipulation"
                        >
                            <span className="text-lg">↺</span>
                            <span>Reiniciar Datos</span>
                        </button>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 text-left text-red-300 font-semibold px-3 py-2 rounded-md hover:bg-red-900/40 transition-colors touch-manipulation"
                    >
                        <LogOut className="w-5 h-5"/>
                        <span>Cerrar Sesión</span>
                    </button>
                </div>

                {isDevMode && (
                    <>
                        <div className="my-2 border-t border-gray-700"></div>
                        <p className="px-2 py-1 text-xs font-semibold text-red-400">Opciones de Desarrollador</p>
                        <div className="mt-1 space-y-1">
                            <button
                                onClick={handleUnlock}
                                className="w-full text-left bg-red-900/40 hover:bg-red-900/60 text-red-300 font-bold px-3 py-2 rounded-md transition-colors touch-manipulation"
                            >
                                Desbloquear Todo
                            </button>
                        </div>
                    </>
                )}

                <div className="mt-1 border-t border-gray-700"></div>
                <div 
                    onClick={handleVersionClick} 
                    className="px-3 py-2 text-xs text-center text-gray-500 cursor-pointer rounded-md hover:bg-slate-700/50 transition-colors"
                    title="Haz clic 7 veces para el modo desarrollador"
                >
                    AnatomyGO v1.0.0
                </div>
            </div>
        </div>
    );
};

export default memo(SettingsPopover);
