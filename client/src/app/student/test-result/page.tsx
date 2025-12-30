'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, BarChart2, Home, RotateCcw } from 'lucide-react';
import Link from 'next/link';

const ResultPageContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    // const params = useParams();

    const score = Number(searchParams.get('score'));
    const total = Number(searchParams.get('total'));
    const correct = Number(searchParams.get('correct'));
    const incorrect = Number(searchParams.get('incorrect'));

    const percentage = Math.round((score / total) * 100);

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-2xl w-full relative z-10 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex p-4 rounded-full bg-zinc-950 border border-zinc-800 mb-6 shadow-inner">
                        <div className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-4 ${percentage >= 50 ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}>
                            <span className="text-3xl font-black">{percentage}%</span>
                            <span className="text-xs font-medium uppercase tracking-wider text-gray-400">Accuracy</span>
                        </div>
                    </div>

                    <h1 className="text-3xl font-black mb-2">Test Completed!</h1>
                    <p className="text-gray-400">Here is a breakdown of your performance.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex items-center gap-4">
                        <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Correct Answers</p>
                            <p className="text-2xl font-bold text-white">{correct}</p>
                        </div>
                    </div>
                    <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
                            <XCircle size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Incorrect Answers</p>
                            <p className="text-2xl font-bold text-white">{incorrect}</p>
                        </div>
                    </div>
                    <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 flex items-center gap-4 col-span-2">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                            <BarChart2 size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Score</p>
                            <p className="text-3xl font-black text-white">{score} <span className="text-gray-500 text-lg font-medium">/ {total}</span></p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Link href="/student/dashboard" className="flex-1 py-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-center transition-colors flex items-center justify-center gap-2">
                        <Home size={18} /> Dashboard
                    </Link>
                    <button onClick={() => window.location.reload()} className="flex-1 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors flex items-center justify-center gap-2">
                        <RotateCcw size={18} /> Retake Test
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const ResultPage = () => (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Result...</div>}>
        <ResultPageContent />
    </Suspense>
);

export default ResultPage;
