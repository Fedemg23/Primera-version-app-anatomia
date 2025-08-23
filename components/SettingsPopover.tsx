import React, { memo, useState, useEffect } from 'react';
import { SettingsPopoverProps } from '../types';
import { LogOut, Music, Sound, Muted, Volume1, Volume2, VolumeX } from './icons'; 
import { useAudio } from '../src/contexts/AudioProvider';

const SettingsPopover: React.FC<SettingsPopoverProps> = ({ 
    isOpen, 
    onClose, 
    isDevMode, 
    onUnlockAll, 
    onSignOut,
    onToggleDevMode, 
    onResetData 
}) => {
    const { 
        isMusicPlaying, 
        toggleMusic, 
        musicVolume,
        setMusicVolume,
        isSoundEnabled, 
        toggleSound,
        audioRef,
        currentTrackIndex
    } = useAudio();

    const [devClicks, setDevClicks] = useState(0);
    const [progress, setProgress] = useState({ currentTime: 0, duration: 0 });

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !isOpen) return;

        const updateProgress = () => {
            setProgress({
                currentTime: audio.currentTime,
                duration: audio.duration || 0,
            });
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', updateProgress);
        updateProgress(); // Initial update

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', updateProgress);
        };
    }, [isOpen, audioRef, currentTrackIndex]);


    if (!isOpen) return null;

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const parseTrackName = (filename: string = '') => {
        const cleaned = filename.replace('.mp3', '').replace(/-/g, ' ');
        // Capitalize first letter of each word
        return cleaned.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const playlist = (audioRef.current?.parentElement?.parentElement?.querySelector('audio[preload="auto"]') as any)?.playlist || [];
    const currentTrackName = playlist[currentTrackIndex] || '';

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
                    <div className="grid grid-cols-1 gap-1">
                        <div className="flex items-center gap-2 px-3 py-1">
                            <button onClick={() => setMusicVolume(musicVolume > 0 ? 0 : 0.5)}>
                                {musicVolume === 0 ? <VolumeX className="w-5 h-5 text-slate-300"/> : musicVolume < 0.5 ? <Volume1 className="w-5 h-5 text-slate-300"/> : <Volume2 className="w-5 h-5 text-slate-300"/>}
                            </button>
                            <input 
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={musicVolume}
                                onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-slate-200"
                            />
                        </div>
                        <button
                            onClick={toggleSound}
                            className={`w-full flex items-center justify-center gap-2 text-left font-semibold px-3 py-2 rounded-md transition-colors touch-manipulation ${
                                isSoundEnabled 
                                    ? 'bg-green-900/40 hover:bg-green-900/60 text-green-300' 
                                    : 'bg-slate-700/40 hover:bg-slate-700/60 text-slate-300'
                            }`}
                        >
                            {isSoundEnabled ? <Sound className="w-5 h-5"/> : <Muted className="w-5 h-5"/>}
                            <span>Efectos de Sonido</span>
                        </button>
                    </div>

                    {isMusicPlaying && (
                        <div className="!mt-2 pt-2 border-t border-gray-700">
                            <p className="px-2 text-xs font-bold text-slate-300 truncate">{parseTrackName(currentTrackName)}</p>
                            <p className="px-2 text-xs text-slate-400">Pripac</p>
                            <div className="px-2 mt-1">
                                <div className="w-full bg-slate-600 rounded-full h-1.5">
                                    <div 
                                        className="bg-slate-200 h-1.5 rounded-full" 
                                        style={{ width: `${progress.duration > 0 ? (progress.currentTime / progress.duration) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 mt-0.5">
                                    <span>{formatTime(progress.currentTime)}</span>
                                    <span>-{formatTime(progress.duration - progress.currentTime)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="!mt-2 border-t border-gray-700"></div>

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
