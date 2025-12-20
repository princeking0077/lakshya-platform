'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Save, ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

const CreateTestPage = () => {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    // Test Metadata
    const [testData, setTestData] = useState({
        title: '',
        duration: 180, // Default 3 hours
        negativeMarks: 1, // Default -1
        totalMarks: 0
    });

    // Questions Array
    const [questions, setQuestions] = useState([
        { questionText: '', options: ['', '', '', ''], correctOption: 0, marks: 4 }
    ]);

    const handleTestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTestData({ ...testData, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (index: number, field: string, value: any) => {
        const newQuestions: any = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions: any = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    // Bulk Import Logic
    const [bulkText, setBulkText] = useState('');
    const [importMode, setImportMode] = useState(false);

    const parseBulkText = () => {
        try {
            const blocks = bulkText.split(/\n\s*\n/);
            const parsedQuestions: any[] = [];

            blocks.forEach(block => {
                const lines = block.trim().split('\n');
                if (lines.length < 5) return;

                const questionText = lines[0].replace(/^\d+\.\s*/, '').trim();
                const options: string[] = [];
                let correctOption = 0;

                lines.forEach(line => {
                    if (line.match(/^[A-Da-d][).]\s/)) {
                        options.push(line.replace(/^[A-Da-d][).]\s/, '').trim());
                    }
                    if (line.toLowerCase().startsWith('answer:') || line.toLowerCase().startsWith('ans:')) {
                        const ansChar = line.split(':')[1].trim().toLowerCase();
                        correctOption = ansChar.charCodeAt(0) - 97;
                    }
                });

                if (options.length === 4) {
                    parsedQuestions.push({
                        questionText,
                        options,
                        correctOption: Math.max(0, Math.min(3, correctOption)),
                        marks: 4
                    });
                }
            });

            if (parsedQuestions.length > 0) {
                setQuestions([...questions, ...parsedQuestions]);
                setBulkText('');
                setImportMode(false);
                alert(`Successfully imported ${parsedQuestions.length} questions`);
            } else {
                alert('Could not parse any questions. Check format.');
            }
        } catch (e) {
            alert('Error parsing text');
        }
    };

    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctOption: 0, marks: 4 }]);
    };

    const removeQuestion = (index: number) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const totalMarks = questions.reduce((sum, q) => sum + Number(q.marks), 0);
            const payload = {
                ...testData,
                totalMarks,
                questions
            };
            await axios.post(`${API_BASE_URL}/api/tests`, payload);
            router.push('/admin/tests');
        } catch (error) {
            alert('Error creating test');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => router.back()} className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
                    <ArrowLeft className="text-gray-400" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white">Create New Test</h1>
                    <p className="text-gray-400 text-sm">Design your test structure and questions</p>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-white mb-4">Test Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Test Title</label>
                        <input
                            type="text"
                            name="title"
                            value={testData.title}
                            onChange={handleTestChange}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
                            placeholder="e.g. GPAT 2024 Mock Test 1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Duration (Minutes)</label>
                        <input
                            type="number"
                            name="duration"
                            value={testData.duration}
                            onChange={handleTestChange}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Negative Marks (per wrong answer)</label>
                    <input
                        type="number"
                        name="negativeMarks"
                        value={testData.negativeMarks}
                        onChange={handleTestChange}
                        step="0.25"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
                        placeholder="e.g. 1 or 0.25"
                    />
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Questions ({questions.length})</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setImportMode(!importMode)}
                            className="text-sm font-medium text-purple-400 hover:text-purple-300 bg-purple-500/10 px-4 py-2 rounded-lg transition-colors"
                        >
                            {importMode ? 'Manual Entry' : 'Bulk Import'}
                        </button>
                        <button
                            onClick={addQuestion}
                            className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 px-4 py-2 rounded-lg transition-colors"
                        >
                            <Plus size={16} /> Add Question
                        </button>
                    </div>
                </div>

                {importMode ? (
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <div className="mb-4 text-sm text-gray-400">
                            <p className="font-bold text-white mb-2">Paste your questions below. Format:</p>
                            <pre className="bg-black p-3 rounded-lg overflow-x-auto text-xs font-mono text-zinc-400">
                                {`1. What is the PH of blood?
A) 7.4
B) 6.4
C) 8.4
D) 5.4
Ans: A

2. Next question...`}
                            </pre>
                        </div>
                        <textarea
                            value={bulkText}
                            onChange={(e) => setBulkText(e.target.value)}
                            className="w-full h-64 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white text-sm font-mono focus:outline-none focus:border-purple-500"
                            placeholder="Paste questions here..."
                        />
                        <button
                            onClick={parseBulkText}
                            className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors"
                        >
                            Process Import
                        </button>
                    </div>
                ) : (
                    questions.map((q, qIndex) => (
                        <motion.div
                            key={qIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative group"
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => removeQuestion(qIndex)}
                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="mb-4 pr-10">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Question {qIndex + 1}</label>
                                <textarea
                                    value={q.questionText}
                                    onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 min-h-[80px]"
                                    placeholder="Enter your question here..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options.map((opt, oIndex) => (
                                    <div key={oIndex} className="relative">
                                        <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer ${q.correctOption === oIndex ? 'border-green-500 bg-green-500/20 text-green-500' : 'border-zinc-700 text-zinc-700'}`}
                                            onClick={() => handleQuestionChange(qIndex, 'correctOption', oIndex)}
                                        >
                                            {q.correctOption === oIndex && <CheckCircle2 size={14} />}
                                        </div>
                                        <input
                                            type="text"
                                            value={opt}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                            className={`w-full bg-zinc-950 border rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none transition-colors ${q.correctOption === oIndex ? 'border-green-500/50' : 'border-zinc-800 focus:border-blue-500'}`}
                                            placeholder={`Option ${oIndex + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-full shadow-2xl hover:shadow-green-500/25 transition-all transform hover:-translate-y-1 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? <Loader2 className="animate-spin" /> : <Save />}
                    <span>Save Test ({questions.length})</span>
                </button>
            </div>
        </div>
    );
};

export default CreateTestPage;
