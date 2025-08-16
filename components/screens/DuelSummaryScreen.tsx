import React, { memo } from 'react';
import { DuelSummaryScreenProps, MasterNote } from '../../types';
import { Star, Swords, BookOpen } from '../icons';
import { iconMap } from '../icons';

const DuelSummaryScreen: React.FC<DuelSummaryScreenProps> = ({
    unlockedNote,
    stars,
    maestro,
    reward,
    onPlayAgain,
    onContinue,
}) => {
    
    const playerWon = stars > 0;
    const bgColor = playerWon
        ? 'from-green-900/40 via-slate-900 to-slate-900'
        : 'from-red-900/40 via-slate-900 to-slate-900';
    const title = playerWon ? '¡Duelo Ganado!' : 'Fin del Duelo';
    const titleColor = playerWon ? 'text-green-400' : 'text-red-400';

    return (
        <div className={`fixed inset-0 bg-gradient-to-br ${bgColor} flex items-center justify-center z-50 animate-fade-in p-4`}>
            <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 p-6 text-center flex flex-col items-center rounded-2xl w-full max-w-lg animate-scale-in max-h-[95vh]">
                
                <div className="flex justify-center my-4">
                    {[1, 2, 3].map(i => (
                        <Star key={i} className={`w-12 h-12 transition-all duration-300 ${i <= stars ? 'text-yellow-400 fill-current' : 'text-slate-600'}`} style={{transitionDelay: `${i * 100}ms`}} />
                    ))}
                </div>

                <h2 className={`text-5xl font-black tracking-tighter mb-2 ${titleColor}`}>{title}</h2>
                <p className="text-slate-300 mb-4">{playerWon ? '¡Has forjado un nuevo apunte de maestro!' : '¡Mejor suerte la próxima vez!'}</p>
                
                {unlockedNote ? (
                    <div className="w-full bg-slate-900/50 p-4 rounded-lg border border-slate-700 my-4 text-left overflow-y-auto flex-grow">
                        <h3 className="text-lg font-bold text-amber-300">{unlockedNote.title}</h3>
                        <p className="text-sm text-slate-300 mt-2 whitespace-pre-wrap">{unlockedNote.content}</p>
                    </div>
                ) : (
                    <div className="flex-grow flex items-center justify-center">
                        <p className="text-slate-400">No se ha generado ningún apunte en este duelo.</p>
                    </div>
                )}
                
                {reward && (
                    <div className="flex items-center justify-center gap-8 my-4">
                        <div className="text-center">
                            <p className="text-2xl font-black text-white">+{reward.xp}</p>
                            <p className="text-slate-400 font-semibold text-sm">XP Ganados</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black text-amber-400 flex items-center justify-center">
                                {(() => { const B = iconMap['bones']; return (<><span>{`+${reward.bones}`}</span> <B className="w-5 h-5 ml-1 inline-block align-[-2px]" /></>); })()}
                            </p>
                            <p className="text-slate-400 font-semibold text-sm">Huesitos</p>
                        </div>
                    </div>
                )}

                <div className="w-full max-w-sm mt-auto space-y-3 flex-shrink-0 pt-4">
                     <button 
                        onClick={() => onContinue(unlockedNote)}
                        className="w-full font-bold py-3 px-4 rounded-xl text-lg shadow-md hover:shadow-lg transition-shadow active:scale-95 flex items-center justify-center gap-2 bg-slate-200 text-black touch-manipulation"
                    >
                        <BookOpen className="w-5 h-5"/>
                        {unlockedNote ? "Ir a Mis Apuntes" : "Continuar"}
                    </button>
                    <button 
                        onClick={onPlayAgain}
                        className="w-full font-bold py-3 px-4 rounded-xl text-lg flex items-center justify-center gap-2 bg-slate-700 text-slate-300 border border-slate-600 touch-manipulation active:scale-95"
                    >
                        <Swords className="w-5 h-5"/> Enfrentar a otro Maestro
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(DuelSummaryScreen);