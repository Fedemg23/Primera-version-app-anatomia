import React, { useEffect, useState, memo } from 'react';

type TourStep = {
  id: string;
  title: string;
  description: string;
  anchorSelector?: string; // CSS selector para anclar el tooltip
  placement?: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click'; // para guiar acciones
};

interface TourGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

// Pasos en un orden lógico: Home → Tienda → Estudio/Atlas → Examen → Logros → Desafíos → Perfil → Duelo
const steps: TourStep[] = [
  {
    id: 'home',
    title: 'Pantalla Principal',
    description: 'Pulsa “Seleccionar” en Estudio para comenzar el recorrido guiado.',
    anchorSelector: '[data-tour="home-study-btn"]',
    placement: 'bottom',
    action: 'click',
  },
  {
    id: 'shop',
    title: 'Tienda',
    description: 'Compra vidas, comodines y potenciadores con Huesitos. Prueba la recompensa diaria gratuita.',
    anchorSelector: 'button[aria-label="Cómo funciona la Tienda"]',
    placement: 'bottom',
  },
  {
    id: 'study',
    title: 'Modo Estudio y Atlas',
    description: 'Selecciona un tema para ver sus subtemas y empezar un quiz.',
    anchorSelector: '[data-tour="study-tema-btn"]',
    placement: 'bottom',
    action: 'click',
  },
  {
    id: 'exam',
    title: 'Configurar Examen',
    description: 'Elige regiones/temas y el número de preguntas. Sin feedback inmediato; resultados al final.',
    anchorSelector: 'button[aria-label="Cómo configurar el examen"]',
    placement: 'bottom',
  },
  {
    id: 'achievements',
    title: 'Logros',
    description: 'Gana niveles por tus progresos. Reclama recompensas cuando estén disponibles.'
  },
  {
    id: 'challenges',
    title: 'Desafíos Diarios',
    description: 'Completa objetivos diarios para ganar Huesitos extra.'
  },
  {
    id: 'profile',
    title: 'Perfil',
    description: 'Cambia tu avatar y nombre. Observa tu progreso y nivel.'
  },
  {
    id: 'duel',
    title: 'Duelo IA',
    description: 'Enfréntate a un Maestro IA. Responde bien y rápido para ganar estrellas y recompensas.'
  }
];

const getAnchorRect = (selector?: string) => {
  if (!selector) return null;
  const el = document.querySelector(selector) as HTMLElement | null;
  if (!el) return null;
  return el.getBoundingClientRect();
};

const TourGuide: React.FC<TourGuideProps> = ({ isOpen, onClose }) => {
  const [index, setIndex] = useState(0);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  // Navegación automática por pantallas + foco en anchors
  useEffect(() => {
    if (!isOpen) return;
    (window as any).__TOUR_ACTIVE__ = true;
    const step = steps[index];
    const nav = (window as any).__NAVIGATE__ as undefined | ((v: any) => void);
    const scrollTo = (window as any).__SCROLL_TO__ as undefined | ((s: string) => void);

    // Mapa de ids de paso a vista de la app
    const idToView: any = {
      home: 'home',
      shop: 'shop',
      study: 'study',
      exam: 'exam',
      achievements: 'achievements',
      challenges: 'challenges',
      profile: 'profile',
      duel: 'duel_lobby',
    };
    nav?.(idToView[step.id] || 'home');
    // Espera un frame para render y calcula anchor
    const t = setTimeout(() => {
      if (step.anchorSelector) scrollTo?.(step.anchorSelector);
      const rect = getAnchorRect(step.anchorSelector);
      setAnchorRect(rect);
    }, 200);
    return () => { clearTimeout(t); };
  }, [isOpen, index]);
  
  useEffect(() => {
    return () => { delete (window as any).__TOUR_ACTIVE__; };
  }, []);

  if (!isOpen) return null;

  const step = steps[index];

  const next = () => setIndex(i => Math.min(i + 1, steps.length - 1));
  const prev = () => setIndex(i => Math.max(i - 1, 0));
  const isLast = index === steps.length - 1;
  const placement = step.placement || 'top';

  const tooltipStyle: React.CSSProperties = anchorRect
    ? {
        position: 'fixed',
        top:
          placement === 'top'
            ? anchorRect.top - 12
            : placement === 'bottom'
            ? anchorRect.bottom + 12
            : anchorRect.top + anchorRect.height / 2,
        left:
          placement === 'left'
            ? anchorRect.left - 12
            : placement === 'right'
            ? anchorRect.right + 12
            : anchorRect.left + anchorRect.width / 2,
        transform:
          placement === 'top' || placement === 'bottom'
            ? 'translate(-50%, -100%)'
            : 'translate(-100%, -50%)',
        zIndex: 60,
      }
    : { position: 'fixed', left: '50%', top: '15%', transform: 'translateX(-50%)', zIndex: 60 };

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Tooltip */}
      <div style={tooltipStyle} className="max-w-sm">
        <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 text-slate-100 animate-fade-in">
          {/* Flecha visual */}
          {anchorRect && (
            <div className="absolute -z-10" style={{
              left: placement === 'top' || placement === 'bottom' ? '50%' : undefined,
              top: placement === 'left' || placement === 'right' ? '50%' : undefined,
              transform: (placement === 'top' || placement === 'bottom') ? 'translateX(-50%)' : 'translateY(-50%)'
            }}>
              <div className="w-0 h-0 border-l-8 border-r-8 border-transparent"
                style={{
                  borderTop: placement === 'bottom' ? '8px solid #0f172a' : undefined,
                  borderBottom: placement === 'top' ? '8px solid #0f172a' : undefined,
                }} />
            </div>
          )}
          <h4 className="text-lg font-black mb-1">{step.title}</h4>
          <p className="text-sm text-slate-300">{step.description}</p>
          <div className="flex items-center justify-between mt-3 gap-2">
            <button onClick={prev} disabled={index === 0} className="px-3 py-2 rounded-lg bg-slate-800 text-slate-200 disabled:opacity-40">Atrás</button>
            <div className="text-xs text-slate-400">Paso {index + 1} / {steps.length}</div>
            {step.action === 'click' && anchorRect ? (
              <button
                onClick={() => {
                  const el = step.anchorSelector ? (document.querySelector(step.anchorSelector) as HTMLElement | null) : null;
                  el?.click();
                  next();
                }}
                className="px-3 py-2 rounded-lg bg-emerald-600 text-white"
              >
                Seleccionar
              </button>
            ) : (
              <button onClick={isLast ? onClose : next} className="px-3 py-2 rounded-lg bg-blue-600 text-white">{isLast ? 'Finalizar' : 'Siguiente'}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TourGuide);


