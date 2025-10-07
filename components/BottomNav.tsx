




import React, { memo } from 'react';
import { Home, UserCircle, Store, Award, ListCheck, Trophy, Settings } from './icons';
import { View } from '../types';

interface BottomNavProps {
    activeTab: View;
    onTabChange: (tab: View) => void;
    onOpenSettings: () => void;
    notifications: {
        shop: boolean;
        achievements: boolean;
        challenges: boolean;
        study: boolean;
        levelRewards: boolean;
    };
}

const NavButton = memo(({
    label,
    icon,
    isActive,
    onClick,
    hasNotification,
}: {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
    hasNotification?: boolean;
}) => (
    <button
        onClick={onClick}
        className={`flex-1 flex flex-col items-center justify-center py-2.5 px-1 rounded-xl relative group transition-all duration-200 z-10 touch-manipulation ${
            isActive 
                ? 'text-white bg-gradient-to-br from-slate-700 to-slate-800 shadow-lg scale-105' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`}
    >
        <div className={`relative flex items-center justify-center h-7 w-7 mb-1`}>
           {icon}
           {hasNotification && (
               <span className="absolute -top-1 -right-1 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-[#121212] animate-notification-pulse"></span>
           )}
        </div>
        <span className="text-[10px] font-bold tracking-tight uppercase">{label}</span>
    </button>
));

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onOpenSettings, notifications }) => {
    
    const tabsConfig: {id: View, label: string, icon: React.ReactNode, notification?: boolean}[] = [
        { id: 'home', label: "Inicio", icon: <Home className="w-6 h-6"/> },
        { id: 'challenges', label: "Desafíos", icon: <ListCheck className="w-6 h-6"/>, notification: notifications.challenges },
        { id: 'shop', label: "Tienda", icon: <Store className="w-6 h-6"/>, notification: notifications.shop },
        { id: 'achievements', label: "Logros", icon: <Award className="w-6 h-6"/>, notification: notifications.achievements },
        { id: 'leaderboard', label: "Ranking", icon: <Trophy className="w-6 h-6"/> },
        { id: 'profile', label: "Perfil", icon: <UserCircle className="w-6 h-6"/>, notification: notifications.levelRewards },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-700/50 bg-[#121212]/95 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
            <div className="max-w-4xl mx-auto flex items-stretch justify-around gap-1 px-2 py-1.5" style={{ paddingBottom: 'calc(0.375rem + env(safe-area-inset-bottom))' }}>
                {tabsConfig.map((tab) => (
                     <NavButton
                        key={tab.id}
                        label={tab.label}
                        icon={tab.icon}
                        isActive={activeTab === tab.id}
                        onClick={() => onTabChange(tab.id)}
                        hasNotification={tab.notification}
                    />
                ))}
                {/* Botón de Configuración */}
                <button
                    onClick={onOpenSettings}
                    className="flex-1 flex flex-col items-center justify-center py-2.5 px-1 rounded-xl relative group transition-all duration-200 z-10 touch-manipulation text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                >
                    <div className="relative flex items-center justify-center h-7 w-7 mb-1">
                        <Settings className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold tracking-tight uppercase">Config</span>
                </button>
            </div>
        </nav>
    );
};

export default memo(BottomNav);