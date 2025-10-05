import React, { useState } from 'react';
import Atlas, { AtlasExpression } from './Atlas';

interface AtlasHelperProps {
    message: string;
    expression?: AtlasExpression;
    buttonPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    className?: string;
}

/**
 * AtlasHelper - Un botón de ayuda con Atlas que muestra consejos contextuales
 * Úsalo en pantallas donde quieras dar tips específicos al usuario
 */
const AtlasHelper: React.FC<AtlasHelperProps> = ({ 
    message, 
    expression = 'thinking',
    buttonPosition = 'top-right',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const positionClasses = {
        'top-left': 'top-4 left-4',
        'top-right': 'top-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'bottom-right': 'bottom-4 right-4'
    };

    return (
        <div className={`fixed ${positionClasses[buttonPosition]} z-30 ${className}`}>
            {isOpen ? (
                <div className="animate-slide-up-fade">
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-4 max-w-xs">
                        <div className="flex justify-end mb-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-red-400 transition-colors"
                                aria-label="Cerrar consejo"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="flex flex-col items-center gap-3">
                            <Atlas 
                                expression={expression}
                                size="medium"
                            />
                            <p className="text-sm text-slate-200 text-center leading-relaxed">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gradient-to-br from-indigo-500 to-purple-600 
                               rounded-full p-2 shadow-lg 
                               hover:scale-110 active:scale-95 
                               transition-transform duration-200
                               border-2 border-white/30
                               group relative"
                    aria-label="Ver consejo de Atlas"
                >
                    <Atlas expression="happy" size="small" />
                    
                    {/* Efecto de pulso para llamar la atención */}
                    <span className="absolute inset-0 rounded-full bg-indigo-400 opacity-0 group-hover:opacity-30 animate-ping"></span>
                </button>
            )}
        </div>
    );
};

export default AtlasHelper;


