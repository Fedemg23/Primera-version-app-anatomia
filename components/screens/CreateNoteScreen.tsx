
import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { CreateNoteScreenProps } from '../../types';
import { Save, ArrowLeft, Undo2, Eraser, Pencil, Trash2 } from '../icons';

const colors = ['#FFFFFF', '#EF4444', '#F59E0B', '#22C55E', '#3B82F6', '#A855F7'];
const strokeWidths = [2, 5, 10, 20];
const CANVAS_BG_COLOR = '#1f2937'; // slate-800

const CreateNoteScreen: React.FC<CreateNoteScreenProps> = ({ onSave, onBack }) => {
    // State for note content
    const [title, setTitle] = useState('');
    const [textContent, setTextContent] = useState('');

    // State for canvas drawing
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState(colors[0]);
    const [lineWidth, setLineWidth] = useState(strokeWidths[1]);
    const [isErasing, setIsErasing] = useState(false);
    const history = useRef<string[]>([]);
    const historyIndex = useRef(-1);

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        const context = canvas.getContext('2d');
        if (!context) return;
        
        context.scale(dpr, dpr);
        context.lineCap = 'round';
        context.lineJoin = 'round';
        
        context.fillStyle = CANVAS_BG_COLOR;
        context.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        
        contextRef.current = context;
        
        saveToHistory();
    }, []);

    const saveToHistory = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        if (historyIndex.current < history.current.length - 1) {
            history.current.splice(historyIndex.current + 1);
        }
        
        history.current.push(canvas.toDataURL());
        historyIndex.current = history.current.length - 1;
    }, []);

    const handleUndo = useCallback(() => {
        if (historyIndex.current <= 0) return;
        
        historyIndex.current--;
        const canvas = canvasRef.current;
        const context = contextRef.current;
        if (!canvas || !context) return;
        
        const img = new Image();
        img.src = history.current[historyIndex.current];
        img.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
        };
    }, []);
    
    const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { offsetX: 0, offsetY: 0 };
    
        if ('touches' in e) {
            // For touch events, the existing logic is generally fine
            const rect = canvas.getBoundingClientRect();
            return {
                offsetX: e.touches[0].clientX - rect.left,
                offsetY: e.touches[0].clientY - rect.top,
            };
        }
        
        // For mouse events, use nativeEvent properties which are more reliable
        // and correct for offsets within the target element.
        const mouseEvent = e as React.MouseEvent;
        return {
            offsetX: mouseEvent.nativeEvent.offsetX,
            offsetY: mouseEvent.nativeEvent.offsetY,
        };
    };

    const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const context = contextRef.current;
        if (!context) return;
        
        const { offsetX, offsetY } = getCoords(e);
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        context.strokeStyle = isErasing ? CANVAS_BG_COLOR : color;
        context.lineWidth = lineWidth;
        setIsDrawing(true);
        e.preventDefault();
    }, [color, isErasing, lineWidth]);

    const finishDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if(!isDrawing) return;
        const context = contextRef.current;
        if (!context) return;
        context.closePath();
        setIsDrawing(false);
        saveToHistory();
        e.preventDefault();
    }, [isDrawing, saveToHistory]);

    const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const context = contextRef.current;
        if (!context) return;

        const { offsetX, offsetY } = getCoords(e);
        context.lineTo(offsetX, offsetY);
        context.stroke();
        e.preventDefault();
    }, [isDrawing]);

    const handleClearCanvas = () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        if (!canvas || !context) return;
        
        const dpr = window.devicePixelRatio || 1;
        context.fillStyle = CANVAS_BG_COLOR;
        context.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        saveToHistory();
    };
    
    const isCanvasBlank = (canvas: HTMLCanvasElement | null): boolean => {
        if (!canvas) return true;
        // A simple check: if history has more than the initial state, it's not blank.
        return history.current.length <= 1;
    };

    const handleSaveNote = () => {
        const canvas = canvasRef.current;
        const drawingContent = !isCanvasBlank(canvas) ? canvas!.toDataURL('image/png') : '';
        onSave({ title: title || 'Sin Título', textContent, drawingContent });
    };

    return (
        <div className="flex flex-col h-full bg-slate-900">
            {/* Header */}
            <header className="flex-shrink-0 bg-slate-950/50 backdrop-blur-sm p-3 border-b border-slate-700 z-10 flex items-center justify-between">
                <button onClick={onBack} className="p-2 rounded-full active:bg-slate-800 transition-colors">
                    <ArrowLeft className="w-6 h-6 text-slate-200" />
                </button>
                <h2 className="font-bold text-lg text-white">Crear Nota</h2>
                <button onClick={handleSaveNote} className="font-bold text-lg text-blue-400 p-2 rounded-lg active:bg-blue-900/50 transition-colors flex items-center gap-2">
                    <Save className="w-6 h-6"/> Guardar
                </button>
            </header>

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                <input
                    type="text"
                    placeholder="Título de la nota..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent text-2xl font-bold text-white placeholder-slate-500 focus:outline-none"
                />
                <textarea
                    placeholder="Escribe algo aquí..."
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    className="w-full h-24 bg-transparent text-slate-300 placeholder-slate-500 focus:outline-none resize-none"
                />

                {/* Canvas */}
                <div className="relative aspect-video w-full">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={startDrawing}
                        onMouseUp={finishDrawing}
                        onMouseLeave={finishDrawing}
                        onMouseMove={draw}
                        onTouchStart={startDrawing}
                        onTouchEnd={finishDrawing}
                        onTouchMove={draw}
                        className="w-full h-full rounded-lg bg-slate-800 touch-none"
                    />
                </div>
            </div>

            {/* Toolbar */}
            <footer className="flex-shrink-0 p-3 bg-slate-950/50 backdrop-blur-sm border-t border-slate-700 z-10">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                    <button onClick={() => setIsErasing(false)} className={`p-2 rounded-full transition-colors ${!isErasing ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-slate-700'}`}>
                        <Pencil className="w-6 h-6" />
                    </button>
                    <button onClick={() => setIsErasing(true)} className={`p-2 rounded-full transition-colors ${isErasing ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-slate-700'}`}>
                        <Eraser className="w-6 h-6" />
                    </button>
                    <div className="h-6 w-px bg-slate-700 mx-2"></div>
                    
                    {colors.map(c => (
                        <button key={c} onClick={() => { setColor(c); setIsErasing(false); }} className={`w-8 h-8 rounded-full border-2 transition-transform active:scale-95 ${color === c && !isErasing ? 'border-blue-400 scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                    ))}
                    <div className="h-6 w-px bg-slate-700 mx-2"></div>
                    
                    {strokeWidths.map(w => (
                        <button key={w} onClick={() => setLineWidth(w)} className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${lineWidth === w ? 'bg-slate-600' : 'hover:bg-slate-700'}`}>
                            <div className="bg-slate-400 rounded-full" style={{ width: `${w+2}px`, height: `${w+2}px` }}></div>
                        </button>
                    ))}
                    <div className="h-6 w-px bg-slate-700 mx-2"></div>
                    
                    <button onClick={handleUndo} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 transition-colors">
                        <Undo2 className="w-6 h-6" />
                    </button>
                    <button onClick={handleClearCanvas} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 transition-colors">
                        <Trash2 className="w-6 h-6" />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default memo(CreateNoteScreen);