'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, Flag, Save, AlertCircle, Maximize2, Minimize2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

const TestInterfaceContent = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    const [test, setTest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({}); // { questionIndex: optionIndex }
    const [markedForReview, setMarkedForReview] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Timer Ref for auto-submit
    const timerRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        if (id) fetchTest();
        return () => clearInterval(timerRef.current!);
    }, [id]);

    useEffect(() => {
        if (timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current!);
                        handleSubmit(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current!);
    }, [timeLeft]);

    const fetchTest = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/tests/${id}`);
            const data = res.data.data;
            setTest(data);
            setTimeLeft(data.duration * 60);
        } catch (error) {
            alert('Error loading test');
        } finally {
            setLoading(false);
        }
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullScreen(false);
            }
        }
    };

    const handleAnswer = (optionIndex: number) => {
        setAnswers({ ...answers, [currentQuestionIndex]: optionIndex });
    };

    const toggleReview = () => {
        if (markedForReview.includes(currentQuestionIndex)) {
            setMarkedForReview(markedForReview.filter(i => i !== currentQuestionIndex));
        } else {
            setMarkedForReview([...markedForReview, currentQuestionIndex]);
        }
    };

    const handleSubmit = async (auto = false) => {
        if (!auto && !confirm('Are you sure you want to submit the test?')) return;

        setSubmitting(true);
        try {
            // Retrieve student ID from auth store (if user was logged in properly)
            // For now, let backend handle fallback
            let studentId = null;
            if (typeof window !== 'undefined') {
                const userStr = localStorage.getItem('auth-storage');
                if (userStr) {
                    const parsed = JSON.parse(userStr);
                    studentId = parsed.state?.user?._id;
                }
            }

            const payload = {
                testId: id,
                answers: answers,
                studentId: studentId
            };

            const res = await axios.post(`${API_BASE_URL}/api/results/submit`, payload);
            const result = res.data.data;

            // Navigate to Result Page with server-calculated data
            router.push(`/student/test-result?id=${id}&score=${result.score}&total=${result.totalMarks}&correct=${result.correctAnswers}&incorrect=${result.incorrectAnswers}`);
        } catch (error) {
            console.error(error);
            alert('Error submitting test');
            setSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Test...</div>;

    const currentQuestion = test?.questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between px-6 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <h1 className="font-bold text-lg truncate max-w-[200px] sm:max-w-md">{test.title}</h1>
                    <span className="text-xs font-medium bg-zinc-800 px-2 py-1 rounded text-gray-400">
                        Q {currentQuestionIndex + 1} / {test.questions.length}
                    </span>
                </div>

                <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-green-400'}`}>
                        <Clock size={20} />
                        {formatTime(timeLeft)}
                    </div>
                    <button onClick={toggleFullScreen} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors hidden sm:block">
                        {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                    <button
                        onClick={() => handleSubmit(false)}
                        disabled={submitting}
                        className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
                    >
                        {submitting ? 'Submitting...' : 'Submit Test'}
                    </button>
                </div>
            </header>

            {/* Main Interface */}
            <main className="flex-1 flex overflow-hidden">
                {/* Question Area */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8">
                            <h2 className="text-xl font-medium leading-relaxed mb-8">
                                {currentQuestion.questionText}
                            </h2>

                            <div className="space-y-4">
                                {currentQuestion.options.map((opt: string, idx: number) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleAnswer(idx)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${answers[currentQuestionIndex] === idx
                                            ? 'bg-blue-600/20 border-blue-500'
                                            : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-800'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${answers[currentQuestionIndex] === idx ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-500 text-gray-500'
                                            }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className="text-gray-200">{opt}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestionIndex === 0}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium border border-zinc-700"
                            >
                                <ChevronLeft size={20} /> Previous
                            </button>

                            <div className="flex gap-3">
                                <button
                                    onClick={toggleReview}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-colors font-medium ${markedForReview.includes(currentQuestionIndex)
                                        ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                                        : 'bg-zinc-800 border-zinc-700 text-gray-300 hover:bg-zinc-700'
                                        }`}
                                >
                                    <Flag size={18} /> {markedForReview.includes(currentQuestionIndex) ? 'Unmark' : 'Mark Review'}
                                </button>
                                <button
                                    onClick={() => setAnswers({ ...answers, [currentQuestionIndex]: undefined as any })} // Clear answer
                                    className="px-6 py-3 rounded-xl bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-gray-300 transition-colors font-medium"
                                >
                                    Clear
                                </button>
                            </div>

                            <button
                                onClick={() => setCurrentQuestionIndex(prev => Math.min(test.questions.length - 1, prev + 1))}
                                disabled={currentQuestionIndex === test.questions.length - 1}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-white"
                            >
                                Next <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Question Palette Sidebar */}
                <div className="w-80 bg-zinc-900 border-l border-zinc-800 p-6 hidden lg:flex flex-col">
                    <h3 className="font-bold text-gray-300 mb-6">Question Palette</h3>

                    <div className="grid grid-cols-5 gap-3 mb-8 max-h-[60vh] overflow-y-auto content-start">
                        {test.questions.map((_: any, idx: number) => {
                            let statusClass = 'bg-zinc-800 text-gray-400 border-zinc-700'; // Not Visited
                            if (currentQuestionIndex === idx) statusClass = 'ring-2 ring-white bg-zinc-800 border-zinc-600'; // Current
                            else if (markedForReview.includes(idx)) statusClass = 'bg-orange-500 text-white border-orange-600'; // Review
                            else if (answers[idx] !== undefined) statusClass = 'bg-green-600 text-white border-green-700'; // Answered

                            return (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentQuestionIndex(idx)}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border transition-all ${statusClass}`}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-auto space-y-3 p-4 bg-zinc-950/50 rounded-xl border border-zinc-800 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-600" /> <span className="text-gray-400">Answered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500" /> <span className="text-gray-400">Marked for Review</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700" /> <span className="text-gray-400">Not Visited</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};



const TestInterface = () => (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Test Interface...</div>}>
        <TestInterfaceContent />
    </Suspense>
);

export default TestInterface;
