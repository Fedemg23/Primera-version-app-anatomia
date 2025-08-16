import React, { memo, useRef, useEffect, useState } from 'react';
import { DuelScreenProps, DuelMessage } from '../../types';
import { Send } from '../icons';

const isImageAvatar = (value: string) => typeof value === 'string' && /\.(png|webp|jpg|jpeg|svg)$/i.test(value);

const AIMessage: React.FC<{ message: DuelMessage; avatar: string }> = memo(({ message, avatar }) => (
	<div className="flex items-end gap-2.5 animate-slide-up-fade">
		<div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
			{isImageAvatar(avatar) ? (
				<img src={avatar} alt="Avatar" className="w-8 h-8 object-contain" />
			) : (
				<span>{avatar}</span>
			)}
		</div>
		<div className="relative bg-slate-700 p-3 rounded-lg rounded-bl-none max-w-xs md:max-w-md">
			<p className="text-white text-sm whitespace-pre-wrap">{message.text}</p>
		</div>
	</div>
));

const PlayerMessage: React.FC<{ message: DuelMessage; playerAvatar: string }> = memo(({ message, playerAvatar }) => (
	<div className="flex items-end gap-2.5 justify-end animate-slide-up-fade">
		<div className="relative bg-blue-600 p-3 rounded-lg rounded-br-none max-w-xs md:max-w-md">
			<p className="text-white text-sm font-semibold">{message.text}</p>
		</div>
		<div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
			{isImageAvatar(playerAvatar) ? (
				<img src={playerAvatar} alt="Avatar" className="w-8 h-8 object-contain" />
			) : (
				<span>{playerAvatar}</span>
			)}
		</div>
	</div>
));

const DuelScreen: React.FC<DuelScreenProps> = ({ duelState, playerAvatar, onSendMessage }) => {
	const { maestro, messages, status } = duelState;
	const [inputValue, setInputValue] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const isPlayerTurn = status === 'player_turn';

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSend = () => {
		if (inputValue.trim() && isPlayerTurn) {
			onSendMessage(inputValue.trim());
			setInputValue('');
		}
	};

	return (
		<div className="flex flex-col h-full bg-slate-900">
			{/* Header */}
			<div className="flex-shrink-0 bg-slate-800/50 backdrop-blur-sm p-3 border-b border-slate-700 z-10">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-3xl overflow-hidden">
							{isImageAvatar(playerAvatar) ? (
								<img src={playerAvatar} alt="Avatar" className="w-10 h-10 object-contain" />
							) : (
								<span>{playerAvatar}</span>
							)}
						</div>
						<p className="font-bold text-white">Tú</p>
					</div>
					<div className="text-2xl font-bold text-slate-500">VS</div>
					<div className="flex items-center gap-3 flex-row-reverse">
						<div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-3xl overflow-hidden">
							{isImageAvatar(maestro.avatar) ? (
								<img src={maestro.avatar} alt="Avatar" className="w-10 h-10 object-contain" />
							) : (
								<span>{maestro.avatar}</span>
							)}
						</div>
						<p className="font-bold text-white text-right">{maestro.name}</p>
					</div>
				</div>
			</div>

			{/* Messages */}
			<div className="flex-grow overflow-y-auto p-4 space-y-4">
				{messages.map((msg) => {
					if (msg.sender === 'ai') return <AIMessage key={msg.id} message={msg} avatar={maestro.avatar} />;
					if (msg.sender === 'player') return <PlayerMessage key={msg.id} message={msg} playerAvatar={playerAvatar} />;
					return null;
				})}
				{status === 'ai_thinking' && (
					<div className="flex items-end gap-2.5 animate-slide-up-fade">
						<div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
							{isImageAvatar(maestro.avatar) ? (
								<img src={maestro.avatar} alt="Avatar" className="w-8 h-8 object-contain" />
							) : (
								<span>{maestro.avatar}</span>
							)}
						</div>
						<div className="relative bg-slate-700 p-3 rounded-lg rounded-bl-none">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
								<div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
								<div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
							</div>
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>
			
			{/* Input Area */}
			<div className="flex-shrink-0 p-2 border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm">
				<div className="flex items-center gap-2">
					<input
						type="text"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleSend()}
						placeholder={isPlayerTurn ? 'Escribe tu respuesta...' : 'Esperando al Maestro...'}
						disabled={!isPlayerTurn}
						className="w-full bg-slate-800 border-2 border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors disabled:bg-slate-800/50"
					/>
					<button
						onClick={handleSend}
						disabled={!isPlayerTurn || !inputValue.trim()}
						className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-blue-600 rounded-lg text-white transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed active:bg-blue-700"
					>
						<Send className="w-6 h-6" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default memo(DuelScreen);