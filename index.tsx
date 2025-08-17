import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AnimationProvider } from './components/AnimationProvider';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AnimationProvider>
      <App />
    </AnimationProvider>
  </React.StrictMode>
);

// Bloquear contexto/arrastre/selección en imágenes y SVG (escritorio y móviles)
(() => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const isImageLike = (el: HTMLElement | null): boolean => {
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'IMG' || tag === 'SVG' || !!el.closest('img');
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