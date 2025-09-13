import React, { memo } from 'react';
import { ArrowLeft, Award, Zap, Shield, Heart, Star } from '../icons';
import { LEVEL_REWARDS, MAX_LEVEL, AVATAR_DATA } from '../../constants';
import { UserData } from '../../types';
import { useAudio } from '../../src/contexts/AudioProvider';

interface LevelRewardsScreenProps {
    userData: UserData;
    onBack: () => void;
    onClaimReward: (level: number, startElement: HTMLElement) => void;
}

const LevelRewardsScreen: React.FC<LevelRewardsScreenProps> = ({ userData, onBack, onClaimReward }) => {
    const { playSound } = useAudio();

    const handleBack = () => {
        playSound('button-click');
        onBack();
    };

    const handleClaimReward = (level: number, event: React.MouseEvent) => {
        playSound('button-click');
        onClaimReward(level, event.currentTarget as HTMLElement);
    };

    const getRewardIcon = (level: number) => {
        const reward = LEVEL_REWARDS.find(r => r.level === level);
        if (!reward) return null;

        if (reward.avatarId) {
            // Si hay avatar, mostrar la imagen real del avatar
            const avatar = AVATAR_DATA.find(a => a.id === reward.avatarId);
            if (avatar && typeof avatar.emoji === 'string' && avatar.emoji.startsWith('/')) {
                // Es una imagen
                return (
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400 shadow-lg bg-black/20">
                        <img 
                            src={avatar.emoji} 
                            alt={avatar.name} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                );
            } else if (avatar) {
                // Es un emoji
                return (
                    <div className="w-16 h-16 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center shadow-lg">
                        <span className="text-4xl">{avatar.emoji}</span>
                    </div>
                );
            }
        } else if (reward.bones > 0 && reward.xp > 0) {
            // Si hay bones y XP, mostrar ambos iconos
            return (
                <div className="flex items-center gap-2">
                    <img 
                        src="/images/Emoji hueso png.png" 
                        alt="Huesitos" 
                        className="w-8 h-8 object-contain"
                    />
                    <Zap className="w-8 h-8 text-blue-400" />
                </div>
            );
        } else if (reward.bones > 0) {
            // Si solo hay bones, mostrar imagen real de huesitos
            return (
                <div className="w-16 h-16 flex items-center justify-center">
                    <img 
                        src="/images/Emoji hueso png.png" 
                        alt="Huesitos" 
                        className="w-12 h-12 object-contain"
                    />
                </div>
            );
        } else if (reward.xp > 0) {
            // Si solo hay XP, mostrar icono de rayo
            return <Zap className="w-12 h-12 text-blue-400" />;
        } else if (reward.lifelines) {
            // Si hay lifelines, mostrar icono de escudo
            return <Shield className="w-12 h-12 text-green-400" />;
        }
        
        return <Award className="w-12 h-12 text-gray-400" />;
    };

    const getRewardDescription = (level: number) => {
        const reward = LEVEL_REWARDS.find(r => r.level === level);
        if (!reward) return '';

        const parts = [];
        if (reward.bones > 0) parts.push(`${reward.bones} Huesitos`);
        if (reward.xp > 0) parts.push(`${reward.xp} XP`);
        if (reward.avatarId) {
            const avatar = AVATAR_DATA.find(a => a.id === reward.avatarId);
            if (avatar) {
                parts.push(`Avatar: ${avatar.name}`);
            }
        }
        if (reward.lifelines) {
            const lifelineParts = [];
            if (reward.lifelines.fiftyFifty) lifelineParts.push(`${reward.lifelines.fiftyFifty} Descarte`);
            if (reward.lifelines.quickReview) lifelineParts.push(`${reward.lifelines.quickReview} Pista`);
            if (reward.lifelines.secondChance) lifelineParts.push(`${reward.lifelines.secondChance} Revivir`);
            if (reward.lifelines.adrenaline) lifelineParts.push(`${reward.lifelines.adrenaline} Adrenalina`);
            if (reward.lifelines.skip) lifelineParts.push(`${reward.lifelines.skip} Salto`);
            if (reward.lifelines.double) lifelineParts.push(`${reward.lifelines.double} Duplica`);
            if (reward.lifelines.immunity) lifelineParts.push(`${reward.lifelines.immunity} Inmunidad`);
            if (lifelineParts.length > 0) parts.push(lifelineParts.join(', '));
        }
        
        return parts.join(' • ');
    };

    const getRewardSummary = (level: number) => {
        const reward = LEVEL_REWARDS.find(r => r.level === level);
        if (!reward) return null;

        const rewards = [];

        // Huesitos
        if (reward.bones > 0) {
            rewards.push(
                <div key="bones" className="flex items-center gap-1 bg-amber-900/30 rounded-lg px-2 py-1 border border-amber-500/30">
                    <span className="text-sm font-bold text-amber-300">{reward.bones}</span>
                    <img src="/images/Emoji hueso png.png" alt="Huesitos" className="w-5 h-5 object-contain" />
                </div>
            );
        }

        // XP
        if (reward.xp > 0) {
            rewards.push(
                <div key="xp" className="flex items-center gap-1 bg-blue-900/30 rounded-lg px-2 py-1 border border-blue-500/30">
                    <span className="text-sm font-bold text-blue-300">{reward.xp}</span>
                    <Zap className="w-5 h-5 text-blue-400" />
                </div>
            );
        }

        // Avatar
        if (reward.avatarId) {
            const avatar = AVATAR_DATA.find(a => a.id === reward.avatarId);
            if (avatar) {
                rewards.push(
                    <div key="avatar" className="flex items-center gap-1 bg-purple-900/30 rounded-lg px-2 py-1 border border-purple-500/30">
                        <span className="text-sm font-bold text-purple-300">1</span>
                        {typeof avatar.emoji === 'string' && avatar.emoji.startsWith('/') ? (
                            <img src={avatar.emoji} alt={avatar.name} className="w-5 h-5 object-cover rounded-full" />
                        ) : (
                            <span className="text-lg">{avatar.emoji}</span>
                        )}
                    </div>
                );
            }
        }

        // Lifelines
        if (reward.lifelines) {
            const lifelineImages = {
                fiftyFifty: '/images/Descarte.png',
                quickReview: '/images/Pista.png',
                secondChance: '/images/Revivir.png',
                adrenaline: '/images/Adrenalina.png',
                skip: '/images/Saltar.png',
                double: '/images/Duplicar.png',
                immunity: '/images/Inmunidad.png'
            };

            Object.entries(reward.lifelines).forEach(([key, count]) => {
                if (count > 0) {
                    rewards.push(
                        <div key={key} className="flex items-center gap-1 bg-green-900/30 rounded-lg px-2 py-1 border border-green-500/30">
                            <span className="text-sm font-bold text-green-300">{count}</span>
                            <img src={lifelineImages[key as keyof typeof lifelineImages]} alt={key} className="w-5 h-5 object-contain" />
                        </div>
                    );
                }
            });
        }

        if (rewards.length === 0) return null;

        return (
            <div className="flex flex-wrap gap-2 justify-center">
                {rewards}
            </div>
        );
    };

    const getLifelineIcons = (level: number) => {
        const reward = LEVEL_REWARDS.find(r => r.level === level);
        if (!reward?.lifelines) return null;

        const lifelineImages = {
            fiftyFifty: '/images/Descarte.png',
            quickReview: '/images/Pista.png',
            secondChance: '/images/Revivir.png',
            adrenaline: '/images/Adrenalina.png',
            skip: '/images/Saltar.png',
            double: '/images/Duplicar.png',
            immunity: '/images/Inmunidad.png'
        };

        const lifelineNames = {
            fiftyFifty: 'Descarte',
            quickReview: 'Pista',
            secondChance: 'Revivir',
            adrenaline: 'Adrenalina',
            skip: 'Salto',
            double: 'Duplica',
            immunity: 'Inmunidad'
        };

        const activeLifelines = Object.entries(reward.lifelines)
            .filter(([_, count]) => count > 0)
            .map(([key, count]) => ({ 
                key, 
                count, 
                image: lifelineImages[key as keyof typeof lifelineImages],
                name: lifelineNames[key as keyof typeof lifelineNames]
            }));

        if (activeLifelines.length === 0) return null;

        return (
            <div className="flex flex-wrap gap-2 justify-center">
                {activeLifelines.map(({ key, count, image, name }) => (
                    <div key={key} className="flex items-center gap-1 bg-black/30 rounded-lg px-2 py-1 border border-white/20">
                        <img src={image} alt={name} className="w-5 h-5 object-contain" />
                        <span className="text-xs text-white font-semibold">{count}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-transparent text-white p-4">
            {/* Título */}
            <div className="text-center mb-4">
                <h1 className="text-3xl font-black">Recompensas de Nivel</h1>
            </div>

            {/* Nivel actual del usuario */}
            <div className="text-center mb-8">
                <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 rounded-full">
                    <span className="text-white font-bold text-lg">
                        Nivel Actual: {userData.level}
                    </span>
                </div>
            </div>

            {/* Contenedor horizontal de niveles */}
            <div className="overflow-x-auto pb-8 px-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
                    {LEVEL_REWARDS.map((levelReward) => {
                        const isUnlocked = userData.level >= levelReward.level;
                        const isClaimed = userData.claimedLevelRewards.includes(levelReward.level);
                        const canClaim = isUnlocked && !isClaimed;
                        
                        return (
                            <div
                                key={levelReward.level}
                                className={`flex flex-col items-center min-w-[280px] p-6 rounded-2xl border-2 transition-all duration-300 ${
                                    isUnlocked 
                                        ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-600 shadow-lg hover:shadow-xl hover:scale-[1.02]' 
                                        : 'bg-slate-900/40 border-slate-700 opacity-40'
                                } ${canClaim ? 'ring-2 ring-yellow-400/50 ring-offset-2 ring-offset-black' : ''}`}
                            >
                                {/* Nivel */}
                                <div className={`text-center mb-4 ${
                                    isUnlocked ? 'text-white' : 'text-gray-500'
                                }`}>
                                    <div className="text-5xl font-black mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                        Nivel {levelReward.level}
                                    </div>
                                    <div className="text-sm text-gray-400 bg-black/20 px-3 py-1 rounded-full">
                                        {levelReward.xp} XP requerido
                                    </div>
                                </div>

                                {/* Resumen visual de recompensas */}
                                <div className="mb-6">
                                    {getRewardSummary(levelReward.level)}
                                </div>

                                {/* Estado del nivel */}
                                <div className="text-center mb-6">
                                    {!isUnlocked ? (
                                        <div className="text-gray-500 text-sm bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
                                            🔒 Bloqueado
                                        </div>
                                    ) : isClaimed ? (
                                        <div className="text-green-400 text-sm font-semibold bg-green-900/20 px-4 py-2 rounded-lg border border-green-700">
                                            ✅ Reclamado
                                        </div>
                                    ) : (
                                        <div className="text-yellow-400 text-sm font-semibold bg-yellow-900/20 px-4 py-2 rounded-lg border border-yellow-700 animate-pulse">
                                            🎁 Disponible
                                        </div>
                                    )}
                                </div>

                                {/* Botón de acción */}
                                {canClaim ? (
                                    <button
                                        onClick={(e) => handleClaimReward(levelReward.level, e)}
                                        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold py-3 px-6 rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-all duration-200 active:scale-95 shadow-lg"
                                    >
                                        ¡Reclamar!
                                    </button>
                                ) : isClaimed ? (
                                    <div className="bg-gray-700 text-gray-300 font-semibold py-3 px-6 rounded-lg">
                                        Ya Reclamado
                                    </div>
                                ) : (
                                    <div className="bg-gray-800 text-gray-500 font-semibold py-3 px-6 rounded-lg">
                                        Bloqueado
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Indicador de scroll horizontal */}
            <div className="text-center text-gray-500 text-sm mt-8">
                📱 Los niveles se muestran en una cuadrícula responsive
            </div>
        </div>
    );
};

export default memo(LevelRewardsScreen);
