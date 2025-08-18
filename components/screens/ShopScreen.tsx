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

	const getItemCount = (id: ShopItem['id']): number | null => {
		if (id === 'buy_one_heart') return Math.max(0, Math.min(5, userData.hearts));
		return null;
	};

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

	// Botón estilo "Regalo del Día"
	let buttonClass = 'w-full md:w-auto px-6 py-3 rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all transform enabled:active:-translate-y-0.5 enabled:active:scale-95 touch-manipulation';
	buttonClass += finalIsDisabled
		? ' bg-slate-600 text-slate-400 cursor-not-allowed'
		: ' bg-gradient-to-r from-blue-500 to-sky-500 text-white hover:shadow-blue-500/20';

	return (
		<div className="group relative rounded-3xl border border-slate-700/60 overflow-hidden transition-all duration-500 bg-black hover:bg-white hover:text-black hover:border-white">
			{/* Badge de cantidad (si aplica) */}
			{(() => { const count = getItemCount(item.id); return (count !== null) ? (
				<div className="absolute top-3 left-3 z-20">
					<span className="min-w-[1.75rem] h-7 px-2 flex items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-extrabold shadow ring-2 ring-emerald-300">
						{count}
					</span>
				</div>
			) : null; })()}
			<div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-[radial-gradient(120px_60px_at_20%_20%,rgba(59,130,246,.5),transparent)]"/>
			<div className="relative z-10 rounded-[20px] h-full flex flex-col p-5 text-center transition-all duration-300">
				{Icon && (
					<div className="h-48 md:h-56 mx-auto mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
						<Icon className="w-44 h-44 md:w-52 md:h-52 object-contain object-center" />
					</div>
				)}
				<div className="flex-grow">
					<h3 className="text-xl font-extrabold text-slate-100 group-hover:text-black">{item.name}</h3>
					<p className="text-sm text-slate-400 mt-1 min-h-8 group-hover:text-slate-700">{item.description}</p>
				</div>
				<div className="mt-auto pt-4">
					<button onClick={(e) => onPurchase(item.id, e.currentTarget)} disabled={finalIsDisabled} className={buttonClass}>
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
	const [flipped, setFlipped] = useState<Record<string, boolean>>({});

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
		<div className="bg-black overflow-x-hidden">
			<div className="max-w-4xl mx-auto p-4 md:p-6 space-y-20 md:space-y-24">
				<div className="text-center mb-4">
					<div className="inline-flex items-center gap-3">
						<h2 className="inline-block font-graffiti font-black text-4xl md:text-5xl tracking-wide -rotate-1 title-white-clean transform scale-100 md:scale-105">
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

				{/* Featured Item: Mystery Box */}
				{/* Contenedor y layout parecidos al de "Regalo del Día" */}
				<div>
					<div className="relative mb-3">
						<div className="absolute -top-2 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 rounded-full shadow-[0_0_18px_rgba(245,158,11,0.5)]"></div>
						<h3 className="text-3xl md:text-4xl font-black section-amber-glow amber-pulse">Caja Misteriosa</h3>
					</div>
					<div className={`group relative w-full rounded-3xl border overflow-hidden transition-all duration-700 ease-out text-left hover:backdrop-blur-sm bg-black border-slate-700 ring-2 ring-amber-400/50 hover:ring-4 hover:ring-amber-300/80 hover:bg-white hover:text-black hover:border-white hover:[filter:drop-shadow(0_0_22px_rgba(245,158,11,0.5))]`}>
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

				{/* Botiquín (antes: Comodines) */}
				<div>
					<div className="relative mb-3">
						<div className="absolute -top-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-blue-600 rounded-full shadow-[0_0_18px_rgba(59,130,246,0.5)]"></div>
						<h3 className="text-3xl md:text-4xl font-black botiquin-outline-glow botiquin-pulse">
							Botiquín
						</h3>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-6">
						{lifelineItems.map(item => (
							<div key={item.id} className="group relative rounded-3xl border overflow-hidden bg-black text-slate-100 border-slate-700 hover:bg-white hover:text-slate-900 hover:border-white transition-all duration-500 ring-2 ring-blue-500/50 hover:ring-4 hover:ring-blue-400/80 hover:[filter:drop-shadow(0_0_22px_rgba(59,130,246,0.5))]">
								{/* Badge de cantidad del Botiquín */}
								{(() => {
									const count = (() => {
										switch (item.id) {
											case 'lifeline_fifty_fifty': return userData.lifelineData.fiftyFifty;
											case 'lifeline_quick_review': return userData.lifelineData.quickReview;
											case 'lifeline_second_chance': return userData.lifelineData.secondChance;
											case 'lifeline_adrenaline': return userData.lifelineData.adrenaline;
											case 'lifeline_skip': return userData.lifelineData.skip;
											case 'lifeline_double': return userData.lifelineData.double;
											case 'lifeline_immunity': return userData.lifelineData.immunity;
											default: return 0;
										}
									})();
									return (
										<div className="absolute top-3 left-3 z-20">
											<span className="min-w-[1.75rem] h-7 px-2 flex items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-extrabold shadow ring-2 ring-emerald-300">
												{count}
											</span>
										</div>
									);
								})()}
								{!flipped[item.id] ? (
									<div className="p-5 flex flex-col items-center justify-between min-h-[22rem]">
										<button 
											className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/80 ring-1 ring-slate-300 text-slate-700 hover:text-blue-600 hover:ring-blue-400 transition"
											onClick={(e) => { e.stopPropagation(); setFlipped(prev => ({ ...prev, [item.id]: true })); }}
											title="Información"
										>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
										</button>
										<div className="flex-1 w-full flex items-center justify-center">
											<div className="h-48 md:h-56 w-full flex items-center justify-center">
												{item.imageUrl ? (
													<img src={item.imageUrl} alt={item.name} className="max-h-full w-auto object-contain" />
												) : (
													(() => { const I = iconMap[item.icon]; return I ? <I className="w-40 h-40 md:w-48 md:h-48" /> : null; })()
												)}
											</div>
										</div>
										{/* Nombre del ítem con glow sutil azul */}
										<div className="mt-2 w-full text-center">
											<div className="text-base md:text-lg font-bold botiquin-item-glow group-hover:botiquin-item-glow-dark">{item.name}</div>
										</div>
										<div className="pt-4 w-full">
											<button 
												onClick={(e) => onPurchase(item.id, e.currentTarget)} 
												disabled={!isReadyForInput || (item.id !== 'double_or_nothing' && userData.bones < item.price)} 
												className={`w-full px-6 py-3 rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all transform enabled:active:-translate-y-0.5 enabled:active:scale-95 touch-manipulation ${userData.bones < item.price ? ' bg-slate-200 text-slate-400 cursor-not-allowed' : ' bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-blue-500/30'}`}
											>
												{(() => { const B = iconMap['bones']; return <B className="w-5 h-5 -mt-0.5" /> })()}
												<span>{item.price}</span>
											</button>
										</div>
									</div>
								) : (
									<div className="p-5 bg-transparent text-slate-100 group-hover:text-slate-800 min-h-[22rem] flex flex-col">
										<button 
											className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/80 ring-1 ring-slate-300 text-slate-700 hover:text-blue-600 hover:ring-blue-400 transition"
											onClick={(e) => { e.stopPropagation(); setFlipped(prev => ({ ...prev, [item.id]: false })); }}
											title="Volver"
										>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M15 18l-6-6 6-6"/></svg>
										</button>
										<div className="flex-1">
											<h3 className="text-xl font-extrabold mb-2">{item.name}</h3>
											<p className="text-sm leading-relaxed">{item.description}</p>
											<p className="mt-3 text-xs opacity-80">Usa la flecha para volver a la imagen.</p>
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				</div>

				{/* General Items Section */}
				<div>
					<div className="relative mb-3">
						<div className="absolute -top-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-300 to-emerald-500 rounded-full shadow-[0_0_18px_rgba(16,185,129,0.5)]"></div>
						<h3 className="text-3xl md:text-4xl font-black section-emerald-glow emerald-pulse">Potenciadores y Vidas</h3>
					</div>
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