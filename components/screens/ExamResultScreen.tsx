import React, { useState, memo } from 'react';
import { QuestionData, ExamResult } from '../../types';
import { Target, CheckCircle, XCircle, ChevronDown } from '../icons';
import { bibliographyData } from '../../constants';

const formatExplanation = (explanation: string) => {
    if (!explanation) return '';
    const parts = explanation.split(/(\[CITA:[\w-]+\])/g);

    return parts.map((part, index) => {
        const match = part.match(/\[CITA:([\w-]+)\]/);
        if (match) {
            const key = match[1];
            const entry = bibliographyData.find(b => b.key === key);
            if (entry) {
                const mainAuthor = entry.author.split(',')[0];
                const etAl = entry.author.includes('&') || entry.author.split(',').length > 3 ? ' et al.' : '';
                return (
                    <strong key={index} className="text-sky-400 font-semibold mx-1 cursor-help" title={`${entry.title} (${entry.year})`}>
                        ({mainAuthor}{etAl}, {entry.year})
                    </strong>
                );
            }
        }
        return part;
    });
};

const QuestionReview: React.FC<{
    question: QuestionData;
    userAnswer: number | string;
}> = memo(({ question, userAnswer }) => {
    const isFillInTheBlank = question.textoPregunta.includes('____');
    const correctAnswer = isFillInTheBlank ? question.opciones[question.indiceRespuestaCorrecta] : question.indiceRespuestaCorrecta;
    const isCorrect = isFillInTheBlank
        ? (userAnswer as string)?.trim().toLowerCase() === (correctAnswer as string).trim().toLowerCase()
        : userAnswer === correctAnswer;
    
    const userAnswerText = isFillInTheBlank ? userAnswer : (question.opciones[userAnswer as number] || 'No respondida');
    const correctAnswerText = isFillInTheBlank ? correctAnswer : question.opciones[question.indiceRespuestaCorrecta];

    return (
        <div className="p-4 rounded-lg bg-slate-800/40 backdrop-blur-sm border-l-4" style={{borderColor: isCorrect ? '#22c55e' : '#ef4444'}}>
            <p className="font-semibold text-slate-200 mb-2">{question.textoPregunta}</p>
            <div className="text-sm space-y-1">
                <p className={`flex items-center gap-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    Tu respuesta: <span className="font-bold">{userAnswerText}</span>
                </p>
                {!isCorrect && (
                    <p className="flex items-center gap-2 text-slate-300">
                        <span className="w-4 h-4 inline-block"></span>
                        Correcta: <span className="font-bold">{correctAnswerText}</span>
                    </p>
                )}
                {question.explicacion && <p className="text-xs text-slate-400 pt-1 mt-1 border-t border-slate-700">{formatExplanation(question.explicacion)}</p>}
            </div>
        </div>
    );
});

const ExamResultScreen: React.FC<{ result: ExamResult; onContinue: () => void }> = ({ result, onContinue }) => {
    const [showReview, setShowReview] = useState(false);
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 animate-fade-in p-4 flex items-center justify-center" onClick={(e) => { e.stopPropagation(); }}>
            <div 
                className="bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-700 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 text-center flex-shrink-0 border-b border-slate-800">
                    <Target className="w-16 h-16 mx-auto text-blue-500" />
                    <h2 className="text-3xl font-black text-white mt-2">Resultados del Examen</h2>
                    <p className="text-slate-400 mt-1">Este es un resumen de tu rendimiento.</p>
                </div>
                
                {/* Scrollable Body */}
                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="bg-slate-800/40 backdrop-blur-sm p-4 rounded-xl shadow">
                            <p className="text-sm font-bold text-slate-400">PUNTUACIÓN</p>
                            <p className="text-4xl font-black text-slate-100">{result.score}/{result.total}</p>
                        </div>
                        <div className="bg-slate-800/40 backdrop-blur-sm p-4 rounded-xl shadow">
                            <p className="text-sm font-bold text-slate-400">PORCENTAJE</p>
                            <p className="text-4xl font-black text-blue-400">{result.percentage.toFixed(1)}%</p>
                        </div>
                         <div className="bg-slate-800/40 backdrop-blur-sm p-4 rounded-xl shadow">
                            <p className="text-sm font-bold text-slate-400">TIEMPO</p>
                            <p className="text-4xl font-black text-slate-100">{result.time}s</p>
                        </div>
                    </div>

                    <div className="bg-slate-800/40 backdrop-blur-sm p-4 rounded-xl shadow">
                        <h3 className="text-xl font-bold text-slate-200 mb-3">Desglose por Tema</h3>
                        <div className="space-y-3">
                            {Object.entries(result.breakdown).map(([tema, stats]) => (
                                <div key={tema}>
                                    <div className="flex justify-between items-center text-sm font-semibold mb-1">
                                        <span className="text-slate-300">{tema}</span>
                                        <span className="text-slate-400">{stats.correct}/{stats.total}</span>
                                    </div>
                                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(stats.correct / stats.total) * 100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                         <button
                            onClick={() => setShowReview(!showReview)}
                            className="w-full bg-slate-800/60 backdrop-blur-sm border border-slate-600 text-slate-300 font-bold py-3 px-4 rounded-xl text-lg active:bg-slate-700/60 transition-colors active:scale-95 flex items-center justify-center gap-2 touch-manipulation"
                        >
                            <span>{showReview ? 'Ocultar Revisión' : 'Revisar Preguntas'}</span>
                            <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${showReview ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                    
                    {showReview && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="text-xl font-bold text-slate-200">Revisión de Preguntas</h3>
                            {result.questions.map((q, index) => (
                                <QuestionReview key={q.id} question={q} userAnswer={result.userAnswers[index]} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 flex-shrink-0 border-t border-slate-800">
                     <button 
                        onClick={onContinue} 
                        className="w-full font-bold py-4 px-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-shadow active:scale-95 bg-slate-200 text-black touch-manipulation"
                    >
                        Finalizar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(ExamResultScreen);