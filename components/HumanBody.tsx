

import React, { memo } from 'react';

interface HumanBodyProps {
    selectedRegion: string | null;
    onSelectRegion: (regionId: string) => void;
    regionsProgress: { [key: string]: number };
    idPrefix?: string;
}

const BodyPart: React.FC<{
    gradientId: string;
    d: string;
    isSelected: boolean;
    onClick: () => void;
    title: string;
    progress: number;
}> = memo(({ gradientId, d, isSelected, onClick, title, progress }) => {
    const isMastered = progress >= 100;

    return (
        <path
            d={d}
            onClick={onClick}
            fill={`url(#${gradientId})`}
            className={`
                stroke-slate-500/50 stroke-[1.5]
                transition-all duration-300 ease-in-out cursor-pointer
                hover:[filter:drop-shadow(0_0_8px_rgba(96,165,250,0.8))]
                ${isSelected 
                    ? 'stroke-blue-400 stroke-[2.5] [filter:drop-shadow(0_0_12px_rgba(96,165,250,1))]'
                    : isMastered
                        ? 'stroke-cyan-400/80 [filter:drop-shadow(0_0_12px_rgba(34,211,238,0.8))]'
                        : ''
                }
            `}
        >
            <title>{title}</title>
        </path>
    );
});


const HumanBody: React.FC<HumanBodyProps> = ({ selectedRegion, onSelectRegion, regionsProgress, idPrefix = 'main' }) => {

    const bodyPartsConfig = [
        { id: 'miembro-superior', name: 'Miembro Superior', d: "M30,51 C28,60 22,95 24,115 L34,115 L36,75 Z M70,51 C72,60 78,95 76,115 L66,115 L64,75 Z" },
        { id: 'miembro-inferior', name: 'Miembro Inferior', d: "M40,102 L34,175 L47,175 L48,102 Z M60,102 L66,175 L53,175 L52,102 Z" },
        { id: 'pelvis-perine', name: 'Pelvis y Periné', d: "M38,90 L62,90 L60,102 L40,102 Z" },
        { id: 'abdomen', name: 'Abdomen', d: "M37,75 L63,75 L62,90 L38,90 Z" },
        { id: 'torax', name: 'Tórax', d: "M44,42 L56,42 L69,50 L63,75 L37,75 L31,50 Z" },
        { id: 'cabeza-cuello', name: 'Cabeza y Cuello', d: "M50,6 C43,6 38,12 38,20 C38,30 42,33 50,33 C58,33 62,30 62,20 C62,12 57,6 50,6 Z M44,33 L44,42 L56,42 L56,33 Z"},
        { id: 'neuroanatomia', name: 'Neuroanatomía', d: "M50,14 C47.5,14 46,15.5 46,18 C46,20.5 47.5,22 50,22 C52.5,22 54,20.5 54,18 C54,15.5 52.5,14 50,14 M50,14 V25 M48,16 C47,18 47,20 48,22 M52,16 C53,18 53,20 52,22" },
    ];

    const selectedPart = bodyPartsConfig.find(part => part.id === selectedRegion);
    const otherParts = bodyPartsConfig.filter(part => part.id !== selectedRegion);
    
    const renderPart = (part: typeof bodyPartsConfig[0]) => (
        <BodyPart
            key={`${idPrefix}-${part.id}`}
            gradientId={`gradient-${idPrefix}-${part.id}`}
            d={part.d}
            isSelected={selectedRegion === part.id}
            onClick={() => onSelectRegion(part.id)}
            title={part.name}
            progress={regionsProgress[part.id] || 0}
        />
    );

    return (
        <svg viewBox="0 0 100 185" className="w-full h-full max-h-[60vh] drop-shadow-lg">
            <defs>
                {bodyPartsConfig.map(part => {
                    const progress = regionsProgress[part.id] || 0;
                    const isMastered = progress >= 100;
                    return (
                        <linearGradient key={`grad-${idPrefix}-${part.id}`} id={`gradient-${idPrefix}-${part.id}`} x1="0" y1="1" x2="0" y2="0">
                            <stop offset={`${progress}%`} stopColor={isMastered ? '#22d3ee' : '#3b82f6'} stopOpacity="1" />
                            <stop offset={`${progress}%`} stopColor="rgba(51, 65, 85, 0.4)" stopOpacity="1" />
                            <stop offset="100%" stopColor="rgba(51, 65, 85, 0.5)" stopOpacity="1" />
                        </linearGradient>
                    )
                })}
            </defs>
            {otherParts.map(renderPart)}
            {selectedPart && renderPart(selectedPart)}
        </svg>
    );
};

export default memo(HumanBody);