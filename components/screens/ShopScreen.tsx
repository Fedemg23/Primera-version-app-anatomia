import React, { memo, useState, useEffect } from 'react';
import { UserData, ShopItem, ShopScreenProps } from '../../types';
import { shopItems } from '../../constants';
import { iconMap, Gift, ShopCartBold } from '../icons';
import HelpIcon from '../HelpIcon';

const toLocalDateString = (date: Date): string => {
	if (!date || isNaN(new Date(date).getTime())) {
		// Return a date string that will never match today
		return new Date(0).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
	}
	return new Date(date).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
};


const ShopItemCard: React.FC<{
	item: ShopItem;
	userData: UserData;
	onPurchase: (itemId: ShopItem['id'], startElement: HTMLElement) => void;
	isReadyForInput: boolean;
}> = memo(({ item, userData, onPurchase, isReadyForInput }) => {
	const Icon = iconMap[item.icon];

	const isHeartItem = item.id === 'buy_one_heart';
	const isStreakItem = item.id === 'streak_freeze';
	const isXpBoostItem = item.id === 'xp_boost';
	const isDoubleOrNothingItem = item.id === 'double_or_nothing';

	const isHeartDisabled = isHeartItem && userData.hearts >= 5;
	const isStreakDisabled = isStreakItem && userData.streakFreezeActive;
	const isXpBoostDisabled = isXpBoostItem && userData.xpBoostUntil > Date.now();
	const isDoubleOrNothingDisabled = isDoubleOrNothingItem && userData.doubleOrNothingActive;
	
	const isUnaffordable = item.id !== 'double_or_nothing' && userData.bones < item.price;
	const isDoubleOrNothingUnaffordable = isDoubleOrNothingItem && userData.bones < 50;

	const isDisabledByState = isHeartDisabled || isStreakDisabled || isXpBoostDisabled || isDoubleOrNothingDisabled;
	const isUnaffordableFinal = isUnaffordable || isDoubleOrNothingUnaffordable;
	
	const finalIsDisabled = !isReadyForInput || isDisabledByState || isUnaffordableFinal;

	let buttonText: React.ReactNode;
	if (isHeartDisabled) buttonText = 'Vidas Llenas';
	else if (isStreakDisabled) buttonText = 'Activado';
	else if (isXpBoostDisabled) buttonText = 'Activado';
	else if (isDoubleOrNothingDisabled) buttonText = 'Apuesta Activa';
	else if (isDoubleOrNothingItem) buttonText = (
		<div className="flex items-center justify-center gap-1">
			Apostar {(() => { const B = iconMap['bones']; return <B className="w-5 h-5 -mt-0.5" /> })()} 50
		</div>
	);
	else buttonText = (
		<div className="flex items-center justify-center gap-1">
			{(() => { const B = iconMap['bones']; return <B className="w-5 h-5 -mt-0.5" /> })()}
			<span>{item.price}</span>
		</div>
	);

	// Botón estilo "Regalo del Día" (coherente, sin invertir colores del contenedor)
	let buttonClass = 'w-full md:w-auto px-6 py-3 rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all transform enabled:active:-translate-y-0.5 enabled:active:scale-95 touch-manipulation';
	buttonClass += finalIsDisabled
		? ' bg-slate-600 text-slate-400 cursor-not-allowed'
		: ' bg-gradient-to-r from-blue-500 to-sky-500 text-white hover:shadow-blue-500/20';

	return (
		<div className="group relative rounded-3xl border border-slate-700/60 overflow-hidden transition-all duration-500 bg-black hover:bg-white hover:text-black hover:border-white">
			{/* halo sutil como en regalo diario */}
			<div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-[radial-gradient(120px_60px_at_20%_20%,rgba(59,130,246,.5),transparent)]"/>
			<div className="relative z-10 rounded-[20px] h-full flex flex-col p-5 text-center transition-all duration-300">
				<div className="w-28 h-28 mx-auto mb-4 flex items-center justify-center bg-slate-900 rounded-2xl transition-transform duration-300 shadow-inner group-hover:scale-105 overflow-hidden p-1">
					{Icon && <Icon className="w-full h-full" />}
				</div>
				<div className="flex-grow">
					<h3 className="text-xl font-extrabold text-slate-100 group-hover:text-black">{item.name}</h3>
					<p className="text-sm text-slate-400 mt-1 min-h-8 group-hover:text-slate-700">{item.description}</p>
				</div>
				<div className="mt-auto pt-4">
					<button 
						onClick={(e) => onPurchase(item.id, e.currentTarget)} 
						disabled={finalIsDisabled} 
						className={buttonClass}
					>
						{buttonText}
					</button>
				</div>
			</div>
		</div>
	);
});

const ShopScreen: React.FC<ShopScreenProps> = ({ userData, onPurchase, onClaimDailyReward }) => {
	const [isReadyForInput, setIsReadyForInput] = useState(false);
	const [mysteryImgError, setMysteryImgError] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setIsReadyForInput(true), 100);
		return () => clearTimeout(timer);
	}, []);

	const mysteryBoxItem = shopItems.find(item => item.id === 'mystery_box')!;
	const lifelineItems = shopItems.filter(item => item.id.startsWith('lifeline'));
	const generalItems = shopItems.filter(item => !item.id.startsWith('lifeline') && item.id !== 'mystery_box');
	
	const isMysteryBoxAffordable = userData.bones >= mysteryBoxItem.price;

	const today = toLocalDateString(new Date());
	const lastClaimDate = userData.lastDailyShopRewardClaim ? toLocalDateString(new Date(userData.lastDailyShopRewardClaim)) : today;
	const canClaimDailyReward = today !== lastClaimDate;

	return (
		<div className="bg-black">
			<div className="max-w-4xl mx-auto p-4 md:p-6 space-y-10">
				<div className="text-center mb-4">
					<div className="inline-flex items-center gap-3">
						<h2 className="inline-block font-graffiti text-4xl md:text-5xl tracking-wide -rotate-1 title-white-clean transform scale-100 md:scale-105">
							Tienda
						</h2>
						<HelpIcon modalTitle="Cómo funciona la Tienda" ariaLabel="Cómo funciona la Tienda" className="ml-1">
							<ul>
								<li><strong>Huesitos</strong>: moneda del juego. Gánalos en quizzes y desafíos.</li>
								<li><strong>Vidas</strong>: máximo 5. Se regeneran con el tiempo o comprándolas.</li>
								<li><strong>Comodines</strong>: 50/50, Repaso Rápido y Segunda Oportunidad. Se consumen al usarlos.</li>
								<li><strong>Boost de XP</strong>: duplica la XP durante 15 min.</li>
								<li><strong>Doble o Nada</strong>: apuesta 50 {(() => { const B = iconMap['bones']; return <B className="w-5 h-5 inline-block align-[-2px]" /> })()}; si haces un test perfecto, ganas 100 {(() => { const B = iconMap['bones']; return <B className="w-5 h-5 inline-block align-[-2px]" /> })()}.</li>
								<li><strong>Caja Misteriosa</strong>: recompensa aleatoria (huesitos, boost, vida o avatar).</li>
							</ul>
						</HelpIcon>
					</div>
				</div>
				
				{/* Daily Reward Section (hero image as primary button) */}
				<div>
					<h3 className="text-2xl font-bold text-slate-100 mb-5">Recompensa Diaria Gratuita</h3>
					<button
						onClick={(e) => onClaimDailyReward(e.currentTarget)}
						disabled={!isReadyForInput || !canClaimDailyReward}
						className={`group relative w-full rounded-3xl border overflow-hidden transition-all duration-700 ease-out text-left hover:backdrop-blur-sm ${canClaimDailyReward ? 'bg-black border-slate-700 hover:bg-white hover:text-black hover:border-white hover:[filter:brightness(0.98)]' : 'bg-slate-950 border-slate-800 text-slate-500 cursor-not-allowed'}`}
					>
						<div className="w-full h-72 md:h-96 flex items-center justify-center p-0 md:p-1 overflow-visible">
							{(() => { const DG = iconMap['daily_gift']; return (
								<DG className={`h-full w-full transition-all duration-300 scale-125 md:scale-150 translate-y-6 md:translate-y-10 ${canClaimDailyReward ? '' : 'opacity-50 [filter:grayscale(1)]'}`} />
							); })()}
						</div>
						<div className="pl-4 pr-6 pb-6 md:px-6">
							<div className={`text-xl md:text-2xl font-black tracking-tight transition-colors duration-700 ${canClaimDailyReward ? 'text-slate-100 group-hover:text-black' : 'text-slate-300'}`}>
								Regalo del Día
							</div>
							<div className={`mt-1 text-xs md:text-sm transition-colors duration-700 ${canClaimDailyReward ? 'text-slate-300 group-hover:text-slate-700' : 'text-slate-500'}`}>
								{canClaimDailyReward ? 'Toca para reclamar tu recompensa gratis.' : 'Ya has reclamado el regalo de hoy.'}
							</div>
						</div>
					</button>
				</div>

				{/* Featured Item: Mystery Box */
				/* Contenedor y layout parecidos al de "Regalo del Día" */}
				<div>
					<h3 className="text-2xl font-bold text-slate-100 mb-5">Caja Misteriosa</h3>
					<div className={`group relative w-full rounded-3xl border overflow-hidden transition-all duration-700 ease-out text-left hover:backdrop-blur-sm bg-black border-slate-700 hover:bg-white hover:text-black hover:border-white hover:[filter:brightness(0.98)]`}>
						<div className="w-full h-72 md:h-96 flex items-center justify-center p-0 md:p-1 overflow-visible">
							{!mysteryImgError ? (
								<img
									src="/images/Mistery Box.png"
									alt="Caja Misteriosa"
									className="h-full w-full object-contain transition-all duration-300 scale-125 md:scale-150 translate-y-6 md:translate-y-10 animate-fade-in"
									onError={() => setMysteryImgError(true)}
								/>
							) : (
								(() => { const M = iconMap['mystery_box']; return <M className="h-full w-full transition-all duration-300 scale-125 md:scale-150 translate-y-6 md:translate-y-10"/> })()
							)}
						</div>
						<div className="pl-4 pr-6 pb-6 md:px-6">
							<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
								<div>
									<div className="text-xl md:text-2xl font-black tracking-tight transition-colors duration-700 text-slate-100 group-hover:text-black">Caja Misteriosa</div>
									<div className="mt-1 text-xs md:text-sm transition-colors duration-700 text-purple-200/90 group-hover:text-slate-700">Contiene una recompensa aleatoria. ¡Podría ser un avatar exclusivo, potenciadores o un montón de Huesitos!</div>
								</div>
								<div className="w-full md:w-auto">
									<button 
										onClick={(e) => onPurchase(mysteryBoxItem.id, e.currentTarget)} 
										disabled={!isReadyForInput || !isMysteryBoxAffordable}
										className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all transform enabled:active:-translate-y-0.5 enabled:active:scale-95 touch-manipulation ${isMysteryBoxAffordable ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-900' : 'bg-slate-600 text-slate-400 cursor-not-allowed'}`}
									>
										{(() => { const B = iconMap['bones']; return <B className="w-6 h-6" /> })()}
										<span>{mysteryBoxItem.price}</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Lifelines Section */}
				<div>
					<h3 className="text-2xl font-bold text-slate-100 mb-5">Comodines para el Quiz</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{lifelineItems.map(item => (
							<ShopItemCard 
								key={item.id} 
								item={item} 
								userData={userData} 
								onPurchase={onPurchase} 
								isReadyForInput={isReadyForInput} 
							/>
						))}
					</div>
				</div>

				{/* General Items Section */}
				<div>
					<h3 className="text-2xl font-bold text-slate-100 mb-5">Potenciadores y Vidas</h3>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-5">
						{generalItems.map(item => (
							<ShopItemCard 
								key={item.id} 
								item={item} 
								userData={userData} 
								onPurchase={onPurchase} 
								isReadyForInput={isReadyForInput} 
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(ShopScreen);