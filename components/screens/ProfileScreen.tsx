


import React, { useState, useMemo, memo, useEffect } from 'react';
import { ProfileScreenProps, Avatar } from '../../types';
import { AVATAR_DATA } from '../../constants';
import { iconMap, CheckSquare, Target, Lock, CheckCircle, Edit, XCircle, LogOut } from '../icons';

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; colorClass: string; }> = memo(({ icon, label, value, colorClass }) => (
	<div className="bg-slate-800/40 backdrop-blur-sm p-4 rounded-xl flex items-center space-x-4 border border-slate-700/50">
		<div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
			{icon}
		</div>
		<div>
			<p className="text-slate-400 text-sm font-semibold">{label}</p>
			<p className="text-2xl font-bold text-slate-100">{value}</p>
		</div>
	</div>
));

const ProfileScreen: React.FC<ProfileScreenProps> = ({ userData, onAvatarChange, onNameChange, xpInCurrentLevel, xpNeededForNextLevel, onSignOut }) => {
	const [isEditingName, setIsEditingName] = useState(false);
	const [nameInput, setNameInput] = useState(userData.name);
	const [isReadyForInput, setIsReadyForInput] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setIsReadyForInput(true), 100);
		return () => clearTimeout(timer);
	}, []);

	const handleSaveName = () => {
		if (nameInput.trim()) {
			onNameChange(nameInput.trim());
			setIsEditingName(false);
		}
	};

	const { accuracy, progressPercentage } = useMemo(() => {
		const accuracyValue = userData.totalQuestionsAnswered > 0 ? ((userData.totalCorrectAnswers / userData.totalQuestionsAnswered) * 100).toFixed(1) : "0.0";
		const progressPercentageValue = xpNeededForNextLevel > 0 ? (xpInCurrentLevel / xpNeededForNextLevel) * 100 : 0;
		return { accuracy: accuracyValue, progressPercentage: progressPercentageValue };
	}, [userData.totalQuestionsAnswered, userData.totalCorrectAnswers, xpInCurrentLevel, xpNeededForNextLevel]);
	
	const isAvatarUnlocked = (avatar: Avatar): boolean => {
		return userData.unlockedAvatars.includes(avatar.id);
	}

	return (
		<div className="p-4 md:p-6 space-y-6">
			{/* Profile Header Card */}
			<div className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-slate-700/50 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
				<div className="relative">
					<div className="w-32 h-32 rounded-full flex items-center justify-center bg-slate-700 ring-4 ring-slate-800/50 shadow-inner overflow-hidden">
						{typeof userData.avatar === 'string' && /(png|webp|jpg|jpeg|svg)$/i.test(userData.avatar) ? (
							<img src={userData.avatar} alt="Avatar" className="w-28 h-28 object-contain" />
						) : (
							<span className="text-7xl">{userData.avatar}</span>
						)}
					</div>
				</div>
				<div className="flex-grow w-full">
					{isEditingName ? (
						<div className="flex items-center gap-2">
							<input
								type="text"
								value={nameInput}
								onChange={(e) => setNameInput(e.target.value)}
								className="w-full text-3xl font-black bg-slate-700 rounded-lg px-2 py-1 text-white focus:ring-2 focus:ring-blue-500 outline-none"
								autoFocus
								onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
							/>
							<button onClick={handleSaveName} className="p-2 rounded-full active:bg-green-900/50 transition-colors touch-manipulation">
								<CheckCircle className="w-6 h-6 text-green-500" />
							</button>
							<button onClick={() => { setIsEditingName(false); setNameInput(userData.name); }} className="p-2 rounded-full active:bg-red-900/50 transition-colors touch-manipulation">
								<XCircle className="w-6 h-6 text-red-500" />
							</button>
						</div>
					) : (
						<div className="flex items-center gap-3">
							<h2 className="text-3xl font-black text-white">{userData.name}</h2>
							<button onClick={() => setIsEditingName(true)} disabled={!isReadyForInput} className="p-1 rounded-full active:bg-slate-700 transition-colors disabled:cursor-wait touch-manipulation">
								<Edit className="w-5 h-5 text-slate-400" />
							</button>
						</div>
					)}
					<p className="text-blue-400 font-bold text-lg">Nivel {userData.level}</p>
					<div className="mt-2">
						<div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
							<span>{userData.xp.toLocaleString()} XP</span>
							<span>Siguiente Nivel</span>
						</div>
						<div className="w-full bg-slate-700 rounded-full h-2.5">
							<div className="bg-gradient-to-r from-blue-500 to-sky-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
						</div>
					</div>
				</div>
			</div>

			{/* Main Stats in a grid */}
			<div className="grid grid-cols-2 gap-4">
				<StatCard icon={(() => { const L = iconMap['llama']; return <L className="w-8 h-8" /> })()} label="Racha" value={userData.streak} colorClass="bg-orange-500" />
				<StatCard icon={(() => { const B = iconMap['bones']; return <B className="w-8 h-8" /> })()} label="Huesitos" value={userData.bones.toLocaleString()} colorClass="bg-amber-500" />
			</div>
			
			{/* Avatar Selection */}
			<div className="bg-slate-800/40 backdrop-blur-sm p-4 rounded-xl shadow-md border border-slate-700/50">
				<h3 className="text-xl font-bold text-slate-100 mb-4">Elige tu Avatar</h3>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{AVATAR_DATA.map(avatar => {
						const unlocked = isAvatarUnlocked(avatar);
						const isSelected = userData.avatar === avatar.emoji;

						return (
							<button 
								key={avatar.id} 
								onClick={() => unlocked && onAvatarChange(avatar.emoji)}
								disabled={!isReadyForInput || !unlocked}
								className={`relative p-3 rounded-xl text-center transition-all duration-200 border-2 ${isSelected ? 'border-blue-500 bg-slate-600/50' : 'border-transparent bg-slate-700/50 hover:bg-slate-600/50'} ${unlocked ? 'cursor-pointer active:transform active:-translate-y-1' : 'cursor-not-allowed'} ${!isReadyForInput ? 'cursor-wait' : ''} touch-manipulation`}
							>
								{isSelected && <div className="absolute -inset-px rounded-xl bg-blue-500/30 blur-md -z-10"></div>}
								<div className="relative w-16 h-16 mx-auto flex items-center justify-center overflow-hidden rounded-md bg-slate-800/30">
									{typeof avatar.emoji === 'string' && /(png|webp|jpg|jpeg|svg)$/i.test(avatar.emoji) ? (
										<img src={avatar.emoji} alt={avatar.name} className={`w-full h-full object-contain ${unlocked ? '' : 'filter grayscale opacity-60'}`} />
									) : (
										<span className={`text-4xl transition-all duration-300 ${unlocked ? '' : 'filter grayscale opacity-60'}`}>{avatar.emoji}</span>
									)}
									{!unlocked && <div className="absolute bottom-0 right-0 w-6 h-6 bg-slate-600 text-white rounded-full flex items-center justify-center"><Lock className="w-3 h-3"/></div>}
								</div>
								<h4 className={`font-bold mt-2 text-sm ${unlocked ? 'text-slate-200' : 'text-slate-400'}`}>{avatar.name}</h4>
								<div className="h-4 mt-0.5">
									{!unlocked && (
										<p className="text-xs font-semibold text-slate-400">
											{avatar.unlockCondition.description}
										</p>
									)}
								</div>
							</button>
						)
					})}
				</div>
			</div>

			{/* Other stats */}
			<div className="bg-slate-800/40 backdrop-blur-sm p-4 rounded-xl shadow-md border border-slate-700/50">
				<h3 className="text-xl font-bold text-slate-100 mb-4">Otras Estadísticas</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-lg">
						<Target className="w-6 h-6 text-slate-400"/>
						<p className="text-slate-300">Tasa de Aciertos: <span className="font-bold text-slate-100">{accuracy}%</span></p>
					</div>
					<div className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-lg">
						<CheckSquare className="w-6 h-6 text-slate-400"/>
						<p className="text-slate-300">Tests Completados: <span className="font-bold text-slate-100">{userData.totalQuizzesCompleted}</span></p>
					</div>
				</div>
			</div>
			
			{/* Sign Out Button */}
			<div className="pt-4">
				<button 
					onClick={onSignOut}
					className="w-full flex items-center justify-center gap-2 bg-red-900/40 active:bg-red-900/60 text-red-300 font-bold px-4 py-3 rounded-xl transition-colors active:scale-95 touch-manipulation"
				>
					<LogOut className="w-5 h-5"/>
					<span>Cerrar Sesión</span>
				</button>
			</div>
		</div>
	);
};

export default memo(ProfileScreen);