import React, { memo, useState, useMemo } from 'react';
import { UserData, MasterNote, AIOpponent, UserNote } from '../../types';
import { ChevronDown, BookOpen, Trash2, PlusCircle, Save as SaveIcon, Copy as CopyIcon } from '../icons';
import { aiOpponentsData } from '../../constants';

interface MasterNotesScreenProps {
    userData: UserData;
    onDeleteUserNote: (noteId: string) => void;
    onCreateNote: () => void;
}

const MasterNoteCard: React.FC<{ note: MasterNote }> = memo(({ note }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const date = new Date(note.timestamp).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700/50 transition-all duration-300">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex justify-between items-center text-left touch-manipulation"
            >
                <div className="flex-grow overflow-hidden">
                    <h4 className="font-bold text-md text-slate-100 truncate">{note.title}</h4>
                    <p className="text-xs text-slate-400">{date}</p>
                </div>
                <ChevronDown className={`w-6 h-6 text-slate-400 flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[500px]' : 'max-h-0'}`}
            >
                <div className="p-4 pt-2 border-t border-slate-700/50">
                    <p className="text-sm text-slate-300 whitespace-pre-wrap">{note.content}</p>
                </div>
            </div>
        </div>
    );
});

const UserNoteCard: React.FC<{ note: UserNote, onDelete: (noteId: string) => void }> = memo(({ note, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const date = new Date(note.timestamp).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-lg border border-slate-700/50 transition-all duration-300">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex justify-between items-center text-left touch-manipulation"
            >
                <div className="flex-grow overflow-hidden">
                    <h4 className="font-bold text-md text-slate-100 truncate">{note.title}</h4>
                    <p className="text-xs text-slate-400">{date}</p>
                </div>
                <div className="flex items-center gap-2">
                     <button onClick={(e) => { e.stopPropagation(); onDelete(note.id); }} className="p-2 rounded-full text-slate-400 hover:bg-red-900/50 hover:text-red-300 transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronDown className={`w-6 h-6 text-slate-400 flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </button>
            <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px]' : 'max-h-0'}`}
            >
                <div className="p-4 pt-2 border-t border-slate-700/50 space-y-4">
                    {note.textContent && <p className="text-sm text-slate-300 whitespace-pre-wrap">{note.textContent}</p>}
                    {note.drawingContent && <img src={note.drawingContent} alt="Dibujo del usuario" className="rounded-lg border border-slate-600 w-full" />}
                </div>
            </div>
        </div>
    );
});


const MaestroGroup: React.FC<{ maestro: AIOpponent; notes: MasterNote[] }> = memo(({ maestro, notes }) => {
    return (
        <div>
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-2xl">{maestro.avatar}</div>
                <div>
                    <h3 className="text-xl font-bold text-white">{maestro.name}</h3>
                    <p className="text-sm text-slate-400">{maestro.specialty}</p>
                </div>
            </div>
            <div className="space-y-3">
                {notes.length > 0 ? (
                    notes.map(note => <MasterNoteCard key={note.id} note={note} />)
                ) : (
                    <p className="text-center text-slate-500 py-4">Aún no has ganado ningún apunte de este maestro.</p>
                )}
            </div>
        </div>
    );
});

type ActiveTab = 'maestros' | 'personales';

const MasterNotesScreen: React.FC<MasterNotesScreenProps> = ({ userData, onDeleteUserNote, onCreateNote }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('maestros');
    const [isExporting, setIsExporting] = useState(false);

    const exportLastPersonalNoteAsImage = async () => {
        if (!userData.userNotes || userData.userNotes.length === 0) return;
        try {
            setIsExporting(true);
            const last = [...userData.userNotes].sort((a,b)=>b.timestamp-a.timestamp)[0];
            const blob = await fetch(last.drawingContent || 'data:image/png;base64,').then(r=>r.blob());
            const item = new ClipboardItem({ [blob.type]: blob });
            await navigator.clipboard.write([item]);
            alert('¡Dibujo copiado al portapapeles como imagen!');
        } catch (e) {
            console.error(e);
            alert('No se pudo copiar la imagen.');
        } finally {
            setIsExporting(false);
        }
    };

    const notesByMaestro = useMemo(() => {
        const grouped: { [key: string]: MasterNote[] } = {
            cartografo: [],
            clinico: [],
            disector: [],
        };

        (userData.masterNotes || []).forEach(note => {
            if (grouped[note.maestroId]) {
                grouped[note.maestroId].push(note);
            }
        });
        
        for (const key in grouped) {
            grouped[key].sort((a, b) => b.timestamp - a.timestamp);
        }

        return grouped;
    }, [userData.masterNotes]);
    
    const sortedUserNotes = useMemo(() => {
        return [...(userData.userNotes || [])].sort((a, b) => b.timestamp - a.timestamp);
    }, [userData.userNotes]);

    const TabButton: React.FC<{tabId: ActiveTab, children: React.ReactNode}> = ({ tabId, children }) => (
        <button 
            onClick={() => setActiveTab(tabId)}
            className={`flex-1 py-2.5 font-bold text-sm rounded-md transition-colors duration-300 ${activeTab === tabId ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800/50'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-center items-center gap-4 mb-8 text-center">
                <h2 className="font-graffiti text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-cyan-300 tracking-wide title-glow-cyan -rotate-2">
                    Mis Apuntes
                </h2>
            </div>
            
            <div className="max-w-2xl mx-auto">
                <div className="p-1 bg-slate-800 rounded-lg flex gap-1 mb-6 items-center">
                    <TabButton tabId="maestros">Apuntes de Maestros</TabButton>
                    <TabButton tabId="personales">Notas Personales</TabButton>
                    {activeTab === 'personales' && userData.userNotes?.length > 0 && (
                        <div className="ml-auto flex items-center gap-2 pr-1">
                            <button onClick={onCreateNote} className="px-3 py-2 rounded-md bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 active:scale-95 flex items-center gap-2">
                                <PlusCircle className="w-4 h-4" /> Nueva
                            </button>
                            <button disabled={isExporting} onClick={exportLastPersonalNoteAsImage} className="px-3 py-2 rounded-md bg-slate-700 text-slate-200 text-sm font-bold hover:bg-slate-600 active:scale-95 flex items-center gap-2 disabled:opacity-50">
                                <CopyIcon className="w-4 h-4" /> Copiar dibujo
                            </button>
                        </div>
                    )}
                </div>

                {activeTab === 'maestros' && (
                    <div className="space-y-8 animate-fade-in">
                        <p className="text-slate-400 mb-2 text-center text-sm">
                            Apuntes de estudio que has ganado en tus duelos con los Maestros de la Anatomía.
                        </p>
                        {aiOpponentsData.map(maestro => (
                            <MaestroGroup key={maestro.id} maestro={maestro} notes={notesByMaestro[maestro.id]} />
                        ))}
                    </div>
                )}
                
                {activeTab === 'personales' && (
                    <div className="space-y-4 animate-fade-in">
                        <p className="text-slate-400 mb-2 text-center text-sm">
                            Tus propias notas y dibujos. ¡Crea tus propios resúmenes!
                        </p>
                        <button onClick={onCreateNote} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-blue-500 transition-colors active:scale-95">
                            <PlusCircle className="w-6 h-6" />
                            <span>Crear Nota Nueva</span>
                        </button>
                        <div className="space-y-3">
                             {sortedUserNotes.length > 0 ? (
                                sortedUserNotes.map(note => <UserNoteCard key={note.id} note={note} onDelete={onDeleteUserNote}/>)
                             ) : (
                                <div className="text-center py-8">
                                    <BookOpen className="w-12 h-12 mx-auto text-slate-600"/>
                                    <p className="mt-2 text-slate-500">Aún no has creado ninguna nota personal.</p>
                                </div>
                             )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


export default memo(MasterNotesScreen);