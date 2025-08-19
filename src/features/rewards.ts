import { MysteryReward } from '../types';
import { imageAvatars } from '../avatarLoader';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic';

export const epicRewards: MysteryReward[] = imageAvatars.map(avatar => ({
    type: 'avatar' as const, name: avatar.name, icon: avatar.url, avatarId: avatar.id
}));

export const rareRewards: MysteryReward[] = [
    { type: 'streak_freeze', name: 'Protector de Racha', icon: 'streak_freeze' },
    { type: 'bones', amount: 500, name: '500 Huesitos', icon: 'bones' }
];

export const uncommonRewards: MysteryReward[] = [
    { type: 'bones', amount: 250, name: '250 Huesitos', icon: 'bones' },
    { type: 'xp_boost', name: 'Boost de XP', icon: 'xp_boost'},
    { type: 'heart', name: '3 Vidas', icon: 'buy_one_heart', amount: 3 },
];

export const commonRewards: MysteryReward[] = [
    { type: 'bones', amount: 100, name: '100 Huesitos', icon: 'bones' },
    { type: 'lifeline_fifty_fifty', name: '50/50', icon: 'lifeline_fifty_fifty' },
    { type: 'lifeline_skip', name: 'Saltar', icon: 'lifeline_skip' },
    { type: 'lifeline_second_chance', name: 'Revivir', icon: 'lifeline_second_chance' },
    { type: 'lifeline_double', name: 'Duplicar', icon: 'lifeline_double' },
    { type: 'lifeline_immunity', name: 'Inmunidad', icon: 'lifeline_immunity' },
    { type: 'lifeline_adrenaline', name: 'Adrenalina', icon: 'lifeline_adrenaline' },
];

const isRewardInList = (reward: MysteryReward, list: MysteryReward[]): boolean => {
    return list.some(item => item.name === reward.name && item.type === reward.type && item.amount === reward.amount);
};

export const getRewardRarity = (reward: MysteryReward): Rarity => {
    if (reward.type === 'avatar') return 'epic';
    if (isRewardInList(reward, rareRewards)) return 'rare';
    if (isRewardInList(reward, uncommonRewards)) return 'uncommon';
    return 'common';
};

export const rarityColors: Record<Rarity, { border: string; shadow: string; text: string; bg: string; glow: string }> = {
    common: { border: 'border-slate-400', shadow: 'shadow-slate-400/20', text: 'text-slate-300', bg: 'bg-slate-700/80', glow: '' },
    uncommon: { border: 'border-green-400', shadow: 'shadow-green-400/30', text: 'text-green-400', bg: 'bg-green-900/50', glow: 'glow-uncommon' },
    rare: { border: 'border-blue-400', shadow: 'shadow-blue-400/40', text: 'text-blue-400', bg: 'bg-blue-900/50', glow: 'glow-rare' },
    epic: { border: 'border-purple-500', shadow: 'shadow-purple-500/50', text: 'text-purple-400', bg: 'bg-purple-900/50', glow: 'glow-epic' },
};

export const rarityPercentages: Record<Rarity, string> = {
    epic: '5%',
    rare: '10%',
    uncommon: '25%',
    common: '60%',
};

export function getWeightedReward(): MysteryReward {
    const randomNumber = Math.random();
    if (randomNumber < 0.05) { // 5% Epic
        return epicRewards[Math.floor(Math.random() * epicRewards.length)];
    } else if (randomNumber < 0.15) { // 10% Rare
        return rareRewards[Math.floor(Math.random() * rareRewards.length)];
    } else if (randomNumber < 0.40) { // 25% Uncommon
        return uncommonRewards[Math.floor(Math.random() * uncommonRewards.length)];
    } else { // 60% Common
        return commonRewards[Math.floor(Math.random() * commonRewards.length)];
    }
}
