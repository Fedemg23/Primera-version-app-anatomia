import React, { memo, useState, useEffect } from 'react';
import { Heart, iconMap } from './icons';
import { HEART_REGEN_TIME } from '../constants';

type InfoType = 'streak' | 'bones' | 'hearts' | null;

interface InfoTooltipProps {
    isOpen: boolean;
    onClose: () => void;
    type: InfoType;
    hearts: number;
    nextHeartAt: number;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ isOpen, onClose, type, hearts, nextHeartAt }) => {
    const [timeLeftString, setTimeLeftString] = useState('');

    useEffect(() => {
        if (!isOpen || type !== 'hearts' || hearts >= 5 || !nextHeartAt || nextHeartAt === 0) {
            return;
        }

        const updateTimer = () => {
            const now = Date.now();
            const timeLeft = Math.max(0, nextHeartAt - now);
            
            if (timeLeft === 0) {
                setTimeLeftString('¡Listo!');
                // The main app logic will handle adding the heart, and this component will re-render.
                return;
            }

            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            setTimeLeftString(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
        };

        updateTimer();
        const intervalId = setInterval(updateTimer, 1000);

        return () => clearInterval(intervalId);

    }, [isOpen, type, hearts, nextHeartAt]);

    if (!isOpen || !type) return null;

    let icon: React.ReactNode, title: string, description: React.ReactNode, details: React.ReactNode | null = null;
    
    if (type === 'hearts') {
        const regenMinutes = HEART_REGEN_TIME / 60000;
        const HImg = iconMap['heart_img'];
        icon = <HImg className="w-16 h-16 [filter:drop-shadow(0_0_8px_#ef4444)]" />;
        title = "Vidas";
        description = (
            <p className="text-gray-600 dark:text-gray-300 text-base">
                Necesitas vidas para empezar los quizzes en el Modo Estudio y Atlas. Se recargan con el tiempo, o puedes comprarlas en la Tienda si te quedas sin ellas.
            </p>
        );

        if (hearts >= 5) {
            details = (
                <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-lg text-green-800 dark:text-green-300 text-sm font-semibold">
                    <p>¡Vidas al máximo! Úsalas para seguir aprendiendo.</p>
                    <p className="mt-1">Si gastas una, la siguiente se regenera en {regenMinutes} minutos.</p>
                </div>
            );
        } else {
            details = (
                 <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg text-blue-800 dark:text-blue-300 text-sm font-semibold">
                    Próxima vida en: <strong className="text-lg ml-2">{timeLeftString}</strong>
                </div>
            );
        }
    } else {
        const Bones = iconMap['bones'];
        const contentMap = {
            streak: {
                icon: (() => { const L = iconMap['llama']; return <L className="w-20 h-20 [filter:drop-shadow(0_0_8px_rgba(249,115,22,0.8))]" /> })(),
                title: "Racha de Días",
                description: <p className="text-gray-600 dark:text-gray-300 text-base">Mantén tu racha iniciando sesión cada día. Una racha más alta te da más Huesitos y XP en los quizzes. ¡No la pierdas!</p>,
            },
            bones: {
                icon: <Bones className="w-20 h-20 [filter:drop-shadow(0_0_8px_#f59e0b)]" />,
                title: "Huesitos",
                description: <p className="text-gray-600 dark:text-gray-300 text-base">Son la moneda del juego. Gánalos completando quizzes y desafíos. Úsalos en la Tienda para comprar vidas, comodines y otros objetos útiles.</p>,
            },
        } as const;
        const selectedContent = contentMap[type];
        icon = selectedContent.icon;
        title = selectedContent.title;
        description = selectedContent.description;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
            <div 
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-auto transform animate-scale-in w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mx-auto mb-4 w-20 h-20 flex items-center justify-center">
                    {icon}
                </div>
                <h2 className="text-3xl font-black tracking-tighter text-gray-800 dark:text-gray-100 mb-2">{title}</h2>
                <div className="mb-8">
                    {description}
                    {details && <div className="mt-4">{details}</div>}
                </div>
                <button 
                    onClick={onClose} 
                    className="w-full bg-slate-800 dark:bg-slate-200 text-white dark:text-black font-bold py-3 px-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-shadow active:scale-95 touch-manipulation"
                >
                    Entendido
                </button>
            </div>
        </div>
    );
};

export default memo(InfoTooltip);