import React, { useState, useEffect } from 'react';
import { RotateDevice } from './icons';

const OrientationLock: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            // Verificar si está en modo portrait (vertical)
            const isPortraitMode = window.innerHeight > window.innerWidth;
            setIsPortrait(isPortraitMode);
        };

        // Verificar al montar
        checkOrientation();

        // Escuchar cambios de orientación
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    if (isPortrait) {
        return (
            <div className="fixed inset-0 bg-[#121212] flex flex-col items-center justify-center z-[9999] p-8">
                <div className="text-center max-w-md">
                    <div className="mb-8 animate-bounce">
                        <RotateDevice className="w-32 h-32 text-white mx-auto" />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white mb-4">
                        ¡Rota tu dispositivo!
                    </h2>
                    
                    <p className="text-slate-300 text-lg leading-relaxed">
                        Esta aplicación está optimizada para orientación horizontal. 
                        Por favor, gira tu dispositivo para continuar.
                    </p>
                    
                    <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <p className="text-sm text-slate-400">
                            📱 Gira tu teléfono/tablet horizontalmente para la mejor experiencia
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default OrientationLock;

