'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, ChevronRight, Play } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import Link from 'next/link';

const StudentTests = () => {
    const [tests, setTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/tests`);
                setTests(res.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-black text-white">All Tests</h1>
                <p className="text-gray-400">Practice tests and scheduled exams</p>
            </header>

            <div className="space-y-4">
                {tests.map((test, idx) => (
                    <motion.div
                        key={test._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 group hover:border-zinc-700 transition-all"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                            <FileText size={28} />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-lg font-bold text-white mb-1">{test.title}</h3>
                            <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1"><Clock size={14} /> {test.duration} mins</span>
                                <span>•</span>
                                <span>{test.questions.length} Questions</span>
                                <span>•</span>
                                <span>{test.totalMarks} Marks</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Link
                                href={`/student/test/${test._id}`}
                                className="flex-1 md:flex-none py-3 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors flex items-center justify-center gap-2"
                            >
                                Start Test <Play size={16} fill="currentColor" />
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>

            {!loading && tests.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500">No active tests available at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default StudentTests;
