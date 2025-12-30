'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Calendar, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

const StudentResults = () => {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/results/my`);
                setResults(res.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-black text-white">My Results</h1>
                <p className="text-gray-400">Performance history and analytics</p>
            </header>

            <div className="space-y-4">
                {Array.isArray(results) && results.map((result, idx) => (
                    <motion.div
                        key={result._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
                    >
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-black text-sm ${(result.score / result.totalMarks) >= 0.5 ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'
                                    }`}>
                                    {Math.round((result.score / result.totalMarks) * 100)}%
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">{result.test?.title || 'Unknown Test'}</h3>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(result.completedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 mb-1">Score</p>
                                    <p className="font-bold text-white text-xl">{result.score} <span className="text-xs text-gray-600">/ {result.totalMarks}</span></p>
                                </div>
                                <div className="text-center hidden sm:block">
                                    <p className="text-xs text-gray-500 mb-1">Correct</p>
                                    <p className="font-bold text-green-500 text-xl">{result.correctAnswers}</p>
                                </div>
                                <div className="text-center hidden sm:block">
                                    <p className="text-xs text-gray-500 mb-1">Incorrect</p>
                                    <p className="font-bold text-red-500 text-xl">{result.incorrectAnswers}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {!loading && results.length === 0 && (
                <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed">
                    <Trophy className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-400">No Results Yet</h3>
                    <p className="text-gray-500 mt-2">Take your first test to see your analytics.</p>
                </div>
            )}
        </div>
    );
};

export default StudentResults;
