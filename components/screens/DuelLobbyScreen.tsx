import React, { memo, useState } from 'react';
import { DuelLobbyScreenProps, AIOpponent } from '../../types';
import { aiOpponentsData } from '../../constants';
import { Lock, Swords, QuestionMarkCircle, Star } from '../icons';
import HelpIcon from '../HelpIcon';

const OpponentCard: React.FC<{
    opponent: AIOpponent;
    isLocked: boolean;
    onSelect: () => void;
}> = memo(({ opponent, isLocked, onSelect }) => {
    
    return (
        <button
            onClick={onSelect}
            disabled={isLocked}
            className="relative w-full bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 text-center border-2 border-slate-700/50 shadow-lg transition-all duration-300 transform-gpu hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20 active:scale-95 disabled:transform-none disabled:opacity-60 disabled:cursor-not-allowed touch-manipulation"
        >
            {isLocked && (
                <div className="absolute inset-0 bg-black/50 rounded-[14px] z-10 flex flex-col items-center justify-center">
                    <Lock className="w-8 h-8 text-slate-400" />
                    <p className="text-sm font-bold text-slate-300 mt-2">Nivel {opponent.unlockLevel} requerido</p>
                </div>
            )}
            <div className="w-24 h-24 mx-auto rounded-full bg-slate-700/50 flex items-center justify-center mb-4 shadow-inner">
                <span className="text-6xl">{opponent.avatar}</span>
            </div>
            <h3 className="text-2xl font-black text-white">{opponent.name}</h3>
            <p className="text-sm text-slate-400 mt-1 h-12">{opponent.bio}</p>
            <div className="mt-4">
                <span className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-full bg-blue-600`}>
                    {opponent.specialty}
                </span>
            </div>
        </button>
    );
});

const InfoModal: React.FC<{ onClose: () => void }> = memo(({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose}>
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md mx-auto transform animate-scale-in w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-black tracking-tighter text-gray-100 mb-4 text-center">Cómo Funciona el Duelo</h2>
            <div className="space-y-4 text-left text-gray-300 text-sm">
                <div>
                    <h3 className="font-bold text-lg text-blue-300 flex items-center gap-2">🎯 El Objetivo</h3>
                    <p className="mt-1">Derrota a un Maestro de la IA para que escriba un **Apunte de Maestro** para tu colección personal. ¡El conocimiento es la recompensa definitiva!</p>
                </div>
                <div>
                    <h3 className="font-bold text-lg text-amber-300 flex items-center gap-2">⭐ Sistema de Estrellas</h3>
                    <p className="mt-1">Tu desempeño en el duelo se mide en estrellas. Cuanto mejor lo hagas (respuestas correctas y rapidez), más estrellas ganarás.</p>
                    <div className="flex justify-around mt-2">
                       <Star className="w-6 h-6 text-yellow-500/50"/>
                       <Star className="w-6 h-6 text-yellow-500/50"/>
                       <Star className="w-6 h-6 text-yellow-500/50"/>
                    </div>
                </div>
                 <div>
                    <h3 className="font-bold text-lg text-green-300 flex items-center gap-2">📝 Calidad del Apunte</h3>
                    <p className="mt-1">La calidad y profundidad del apunte que el Maestro escriba para ti **depende directamente de tu número de estrellas**. ¡Una victoria de 3 estrellas te dará un apunte excepcional!</p>
                </div>
                 <div>
                    <h3 className="font-bold text-lg text-fuchsia-300 flex items-center gap-2">📚 Mis Apuntes</h3>
                    <p className="mt-1">Todas las notas que ganes se guardarán en la sección "Mis Apuntes", accesible desde la pantalla de inicio. ¡Crea tu propio compendio de anatomía!</p>
                </div>
            </div>
            <button onClick={onClose} className="mt-8 w-full bg-slate-200 text-black font-bold py-3 px-4 rounded-xl text-lg shadow-lg active:shadow-xl transition-shadow active:scale-95 touch-manipulation">
                ¡A luchar!
            </button>
        </div>
    </div>
));


const DuelLobbyScreen: React.FC<DuelLobbyScreenProps> = ({ userData, onSelectOpponent }) => {
    const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
    return (
        <div className="p-4 md:p-6 min-h-full">
            <div className="text-center mb-8">
                <Swords className="w-24 h-24 mx-auto text-blue-500 [filter:drop-shadow(0_0_10px_rgba(59,130,246,0.6))]" />
                <div className="flex justify-center items-center gap-2">
                    <h2 className="text-4xl font-black text-white mt-4">Elige un Maestro</h2>
                    <HelpIcon modalTitle="Cómo funciona el Duelo" ariaLabel="Cómo funciona el Duelo">
                        <p>Gana estrellas respondiendo <strong>correcto</strong> y <strong>rápido</strong>. A más estrellas, mejor apunte desbloqueas al final.</p>
                    </HelpIcon>
                </div>
                <p className="text-slate-400 mt-1">Cada victoria forjará un nuevo apunte para tu colección.</p>
            </div>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiOpponentsData.map(opponent => (
                    <OpponentCard
                        key={opponent.id}
                        opponent={opponent}
                        isLocked={userData.level < opponent.unlockLevel}
                        onSelect={() => onSelectOpponent(opponent)}
                    />
                ))}
            </div>
            {isInfoModalVisible && <InfoModal onClose={() => setIsInfoModalVisible(false)} />}
        </div>
    );
};

export default memo(DuelLobbyScreen);