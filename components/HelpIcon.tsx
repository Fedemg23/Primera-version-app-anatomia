import React, { useState, memo } from 'react';
import { QuestionMarkCircle } from './icons';

interface HelpIconProps {
  modalTitle: string;
  ariaLabel?: string;
  className?: string;
  children: React.ReactNode; // contenido del modal
}

const HelpIcon: React.FC<HelpIconProps> = ({ modalTitle, ariaLabel = 'Ayuda', className, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={() => setOpen(true)}
        className={`text-slate-400 hover:text-slate-200 active:scale-95 transition-colors touch-manipulation ${className || ''}`}
      >
        <QuestionMarkCircle className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/70" />
          <div
            className="relative w-full max-w-md bg-slate-900/95 border border-slate-700 rounded-2xl shadow-2xl p-5 text-slate-200 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={modalTitle}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-black tracking-tight">{modalTitle}</h3>
              <button className="text-slate-400 hover:text-white active:scale-95" onClick={() => setOpen(false)} aria-label="Cerrar">
                ✕
              </button>
            </div>
            <div className="prose prose-invert prose-sm max-w-none text-slate-300">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(HelpIcon);





