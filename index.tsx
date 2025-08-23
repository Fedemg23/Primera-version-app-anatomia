import React from 'react';
import ReactDOM from 'react-dom/client';
import AppContainer from './App';
import './global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppContainer />
  </React.StrictMode>
);

// Bloquear contexto/arrastre/selección en imágenes y SVG (escritorio y móviles)
(() => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const isImageLike = (el: EventTarget | null): boolean => {
    if (!el) return false;
    // Algunos targets pueden ser nodos de texto u otros sin closest/tagName
    const node = el as any;
    const tag = (node?.tagName || '').toUpperCase();
    if (tag === 'IMG' || tag === 'SVG') return true;
    try {
      return typeof node.closest === 'function' && !!node.closest('img, svg');
    } catch {
      return false;
    }
  };

  const blockContextMenu = (e: Event) => {
    const target = e.target as HTMLElement | null;
    if (isImageLike(target)) e.preventDefault();
  };

  const blockDragStart = (e: DragEvent) => {
    const target = e.target as HTMLElement | null;
    if (isImageLike(target)) e.preventDefault();
  };

  const blockSelectStart = (e: Event) => {
    const target = e.target as HTMLElement | null;
    if (isImageLike(target)) e.preventDefault();
  };

  document.addEventListener('contextmenu', blockContextMenu, { passive: false });
  document.addEventListener('dragstart', blockDragStart as EventListener, { passive: false });
  document.addEventListener('selectstart', blockSelectStart, { passive: false });
})();