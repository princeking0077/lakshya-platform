'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Clock, Play, Folder, ChevronRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const TestsContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const category = searchParams.get('category'); // subject, dpp, weekly, mock

    const [view, setView] = useState<'root' | 'folder' | 'list'>('root');
    const [currentFolder, setCurrentFolder] = useState<string | null>(null);
    const [tests, setTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock Folders for "subject" category
    const subjectFolders = [
        { id: 'pharmaceutics', name: 'Pharmaceutics', count: 12 },
        { id: 'pharmacology', name: 'Pharmacology', count: 18 },
        { id: 'chemistry', name: 'Pharmaceutical Chemistry', count: 10 },
        { id: 'pharmacognosy', name: 'Pharmacognosy', count: 8 },
    ];

    useEffect(() => {
        if (!category) {
            setView('list'); // Default to all tests list
            fetchTests();
        } else if (category === 'subject') {
            setView('root');
        } else {
            setView('list');
            fetchTests(category);
        }
    }, [category]);

    const fetchTests = async (filterCategory?: string) => {
        setLoading(true);
        try {
            // In a real app, pass category param to API
            const res = await axios.get(`${API_BASE_URL}/api/tests`);
            if (res.data && Array.isArray(res.data.data)) {
                // Client-side filter for demo if API doesn't support it yet
                let data = res.data.data;
                if (filterCategory === 'dpp') {
                    data = data.filter((t: any) => t.title.toLowerCase().includes('dpp') || t.title.includes('Daily'));
                } else if (filterCategory === 'weekly') {
                    data = data.filter((t: any) => t.title.toLowerCase().includes('weekly'));
                } else if (filterCategory === 'mock') {
                    data = data.filter((t: any) => t.title.toLowerCase().includes('mock'));
                }
                setTests(data);
            } else {
                setTests([]);
            }
        } catch (error) {
            console.error(error);
            setTests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFolderClick = (folderId: string) => {
        setCurrentFolder(folderId);
        setView('folder');
        // Fetch tests for this folder
        fetchTests(); // Mock fetch
    };

    const getTitle = () => {
        if (view === 'folder' && currentFolder) {
            return dictionary[currentFolder as keyof typeof dictionary] || currentFolder;
        }
        switch (category) {
            case 'subject': return 'Subject-wise Tests';
            case 'dpp': return 'Daily Practice Papers';
            case 'weekly': return 'Weekly Tests';
            case 'mock': return 'Mock Tests';
            default: return 'All Tests';
        }
    };

    const dictionary = {
        'pharmaceutics': 'Pharmaceutics',
        'pharmacology': 'Pharmacology',
        'chemistry': 'Pharma Chemistry',
        'pharmacognosy': 'Pharmacognosy'
    };

    return (
        <div className="space-y-6">
            <header className="flex items-center gap-4">
                {view === 'folder' && (
                    <button
                        onClick={() => setView('root')}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-300 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                )}
                <div>
                    <h1 className="text-3xl font-black text-white capitalize">{getTitle()}</h1>
                    <p className="text-gray-400">
                        {category === 'subject' && view === 'root' ? 'Select a subject folder' : 'Practice tests and exams'}
                    </p>
                </div>
            </header>

            {category === 'subject' && view === 'root' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {subjectFolders.map((folder, idx) => (
                        <motion.div
                            key={folder.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => handleFolderClick(folder.id)}
                            className="bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 p-6 rounded-2xl cursor-pointer group transition-all"
                        >
                            <Folder size={48} className="text-blue-500/20 group-hover:text-blue-500 transition-colors mb-4 fill-current" />
                            <h3 className="text-xl font-bold text-white mb-1">{folder.name}</h3>
                            <div className="flex items-center justify-between text-gray-500 text-sm">
                                <span>{folder.count} Tests</span>
                                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {(view === 'list' || view === 'folder') && (
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-20 text-gray-500">Loading tests...</div>
                    ) : tests.length === 0 ? (
                        <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
                            <FileText size={48} className="mx-auto text-gray-700 mb-4" />
                            <p className="text-gray-500">No tests found in this category.</p>
                        </div>
                    ) : (
                        tests.map((test, idx) => (
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
                                        <span>{test.questions?.length || 0} Questions</span>
                                        <span>•</span>
                                        <span>{test.totalMarks} Marks</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <Link
                                        href={`/student/test-room?id=${test._id}`}
                                        className="flex-1 md:flex-none py-3 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors flex items-center justify-center gap-2"
                                    >
                                        Start Test <Play size={16} fill="currentColor" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

const StudentTests = () => {
    return (
        <Suspense fallback={<div className="text-center py-20 text-white">Loading...</div>}>
            <TestsContent />
        </Suspense>
    );
};

export default StudentTests;
