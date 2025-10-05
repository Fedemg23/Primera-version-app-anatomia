import React, { useState, useEffect, memo } from 'react';
import { UserData } from '../types';

export type AtlasExpression = 'happy' | 'excited' | 'thinking' | 'celebrating' | 'encouraging' | 'neutral';

interface AtlasProps {
    expression?: AtlasExpression;
    size?: 'small' | 'medium' | 'large';
    message?: string;
    userData?: UserData;
    className?: string;
    showMessage?: boolean;
    onMessageDismiss?: () => void;
    useImage?: boolean; // Nueva opción para usar imagen PNG
}

// SVG de Atlas - un personaje amigable estilo mapache/explorador con tema anatómico
const AtlasSVG: React.FC<{ expression: AtlasExpression; size: string }> = ({ expression, size }) => {
    const sizeMap = {
        small: 'w-16 h-16',
        medium: 'w-24 h-24',
        large: 'w-32 h-32'
    };

    // Ojos según expresión
    const getEyes = () => {
        switch (expression) {
            case 'happy':
                return { left: 'M35,45 Q40,50 45,45', right: 'M55,45 Q60,50 65,45' }; // Ojos sonrientes
            case 'excited':
                return { left: 'M38,45 L38,52 M42,45 L42,52', right: 'M58,45 L58,52 M62,45 L62,52' }; // Ojos brillantes
            case 'celebrating':
                return { left: 'M35,42 L45,42 M35,50 L45,50', right: 'M55,42 L65,42 M55,50 L65,50' }; // Ojos cerrados felices
            case 'encouraging':
                return { left: 'M37,45 Q40,48 43,45', right: 'M57,45 Q60,48 63,45' }; // Guiño amigable
            case 'thinking':
                return { left: 'M38,45 L42,45 M38,50 L42,50', right: 'M58,48 A4,4 0 1,1 58,47.9' }; // Un ojo normal, otro pensativo
            default:
                return { left: 'M38,48 A4,4 0 1,1 38,47.9', right: 'M58,48 A4,4 0 1,1 58,47.9' }; // Ojos normales
        }
    };

    // Boca según expresión
    const getMouth = () => {
        switch (expression) {
            case 'happy':
                return 'M35,65 Q50,75 65,65'; // Sonrisa
            case 'excited':
                return 'M40,65 Q50,80 60,65'; // Sonrisa grande
            case 'celebrating':
                return 'M35,68 Q50,78 65,68'; // Sonrisa amplia
            case 'encouraging':
                return 'M38,65 Q50,72 62,65'; // Sonrisa cálida
            case 'thinking':
                return 'M42,68 L58,68'; // Boca pensativa
            default:
                return 'M40,68 Q50,72 60,68'; // Sonrisa suave
        }
    };

    const eyes = getEyes();
    const mouth = getMouth();

    return (
        <svg 
            viewBox="0 0 100 100" 
            className={`${sizeMap[size]} transition-all duration-300`}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Cuerpo/Cabeza principal - forma de cerebro estilizado */}
            <ellipse cx="50" cy="50" rx="40" ry="45" fill="#6366f1" opacity="0.9"/>
            
            {/* Detalles anatómicos sutiles (líneas de cerebro) */}
            <path 
                d="M20,35 Q30,30 40,35 M60,35 Q70,30 80,35 M15,50 Q25,45 35,50 M65,50 Q75,45 85,50" 
                stroke="#818cf8" 
                strokeWidth="2" 
                fill="none" 
                opacity="0.6"
            />
            
            {/* Orejas pequeñas */}
            <ellipse cx="15" cy="50" rx="8" ry="12" fill="#6366f1"/>
            <ellipse cx="85" cy="50" rx="8" ry="12" fill="#6366f1"/>
            
            {/* Fondo de ojos (blanco) */}
            <ellipse cx="40" cy="48" rx="8" ry="10" fill="white"/>
            <ellipse cx="60" cy="48" rx="8" ry="10" fill="white"/>
            
            {/* Ojos según expresión */}
            <path d={eyes.left} stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d={eyes.right} stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round"/>
            
            {/* Nariz pequeña */}
            <circle cx="50" cy="60" r="3" fill="#1e293b"/>
            
            {/* Boca según expresión */}
            <path d={mouth} stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round"/>
            
            {/* Mejillas sonrojadas */}
            {(expression === 'happy' || expression === 'excited' || expression === 'celebrating') && (
                <>
                    <ellipse cx="25" cy="55" rx="6" ry="4" fill="#f87171" opacity="0.5"/>
                    <ellipse cx="75" cy="55" rx="6" ry="4" fill="#f87171" opacity="0.5"/>
                </>
            )}
            
            {/* Accesorio: gorro de anatomista */}
            <path 
                d="M15,30 Q50,15 85,30 L85,35 Q50,20 15,35 Z" 
                fill="#334155" 
                opacity="0.8"
            />
            <circle cx="50" cy="20" r="4" fill="#cbd5e1"/>
            
            {/* Símbolo médico en el gorro */}
            <text x="50" y="32" fontSize="12" textAnchor="middle" fill="#cbd5e1" fontWeight="bold">+</text>
        </svg>
    );
};

// Mensajes contextuales de Atlas
const getAtlasMessage = (userData?: UserData): { text: string; expression: AtlasExpression } => {
    if (!userData) {
        return { 
            text: '¡Hola! Soy Atlas, tu compañero de anatomía. Estoy aquí para ayudarte en tu viaje de aprendizaje.', 
            expression: 'happy' 
        };
    }

    // Mensajes basados en el estado del usuario
    if (userData.streak >= 7) {
        return { 
            text: `¡Increíble! Llevas ${userData.streak} días de racha. ¡Tu dedicación es admirable! 🔥`, 
            expression: 'celebrating' 
        };
    }

    if (userData.hearts <= 1) {
        return { 
            text: '¡Ten cuidado! Te quedan pocos corazones. Recuerda que puedes conseguir más en la tienda.', 
            expression: 'encouraging' 
        };
    }

    if (userData.level >= 10) {
        return { 
            text: `Nivel ${userData.level}... ¡Eres todo un experto en anatomía! Sigue así.`, 
            expression: 'excited' 
        };
    }

    if (userData.totalPerfectQuizzes > 0) {
        return { 
            text: `Has completado ${userData.totalPerfectQuizzes} quiz perfectos. ¡Dominio total! 🌟`, 
            expression: 'celebrating' 
        };
    }

    const messages = [
        { text: '¿Listo para explorar el cuerpo humano? ¡Vamos a aprender juntos!', expression: 'happy' as AtlasExpression },
        { text: 'Cada pregunta es una oportunidad para crecer. ¡Tú puedes!', expression: 'encouraging' as AtlasExpression },
        { text: 'El conocimiento anatómico se construye paso a paso. ¡Sigue adelante!', expression: 'thinking' as AtlasExpression },
        { text: '¡Me encanta ver tu progreso! Cada día aprendes algo nuevo.', expression: 'happy' as AtlasExpression },
    ];

    return messages[Math.floor(Math.random() * messages.length)];
};

const Atlas: React.FC<AtlasProps> = ({ 
    expression = 'happy', 
    size = 'medium', 
    message, 
    userData,
    className = '',
    showMessage = false,
    onMessageDismiss,
    useImage = true // Por defecto, usar la imagen PNG
}) => {
    const [displayMessage, setDisplayMessage] = useState<string>('');
    const [displayExpression, setDisplayExpression] = useState<AtlasExpression>(expression);
    const [isMessageVisible, setIsMessageVisible] = useState(showMessage);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (showMessage && !message) {
            const atlasMessage = getAtlasMessage(userData);
            setDisplayMessage(atlasMessage.text);
            setDisplayExpression(atlasMessage.expression);
        } else if (message) {
            setDisplayMessage(message);
            setDisplayExpression(expression);
        }
        setIsMessageVisible(showMessage);
    }, [showMessage, message, userData, expression]);

    const handleDismiss = () => {
        setIsMessageVisible(false);
        if (onMessageDismiss) {
            onMessageDismiss();
        }
    };

    const sizeClasses = {
        small: 'w-16 h-16',
        medium: 'w-24 h-24',
        large: 'w-32 h-32'
    };

    return (
        <div className={`flex flex-col items-center gap-3 ${className}`}>
            <div className="relative group">
                {useImage && !imageError ? (
                    // Usar imagen PNG de Atlas
                    <div className="relative">
                        <img 
                            src="/images/Atlas.png" 
                            alt="Atlas - La vértebra C1, base del conocimiento"
                            className={`${sizeClasses[size]} object-contain transition-all duration-300 group-hover:scale-110 drop-shadow-lg`}
                            onError={() => setImageError(true)}
                            title="Atlas (C1) - Sostiene todo el conocimiento"
                        />
                        {/* Efecto de brillo sutil alrededor de Atlas */}
                        <div className="absolute inset-0 bg-gradient-radial from-blue-400/0 via-blue-400/0 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl -z-10"></div>
                    </div>
                ) : (
                    // Fallback al SVG si no hay imagen
                    <AtlasSVG expression={displayExpression} size={size} />
                )}
            </div>
            
            {isMessageVisible && displayMessage && (
                <div className="relative max-w-xs animate-fade-in">
                    <div className="bg-slate-800/95 backdrop-blur-sm text-white px-4 py-3 rounded-2xl shadow-lg border border-slate-700 relative">
                        {/* Flecha hacia Atlas */}
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-800 border-l border-t border-slate-700 rotate-45"></div>
                        
                        <p className="text-sm leading-relaxed relative z-10">{displayMessage}</p>
                        
                        {onMessageDismiss && (
                            <button 
                                onClick={handleDismiss}
                                className="absolute -top-2 -right-2 bg-slate-700 hover:bg-slate-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors shadow-md"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(Atlas);

