'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, FileText, Clock, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

const TestsPage = () => {
    const [tests, setTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/tests`);
            if (res.data && Array.isArray(res.data.data)) {
                setTests(res.data.data);
            } else {
                setTests([]);
            }
        } catch (error) {
            console.error('Error fetching tests:', error);
            setTests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this test?')) {
            try {
                await axios.delete(`${API_BASE_URL}/api/tests/${id}`);
                const currentTests = Array.isArray(tests) ? tests : [];
                setTests(currentTests.filter(t => t._id !== id));
            } catch (error) {
                alert('Error deleting test');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Test Management</h1>
                    <p className="text-gray-400 mt-1">Create and manage online tests and quizzes</p>
                </div>
                <Link
                    href="/admin/tests/create"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                >
                    <Plus size={20} />
                    Create New Test
                </Link>
            </div>

            {/* Tests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((test) => (
                    <motion.div
                        key={test._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-green-500/10 rounded-xl">
                                <FileText className="w-8 h-8 text-green-500" />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDelete(test._id)}
                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{test.title}</h3>

                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                            <div className="flex items-center gap-1">
                                <Clock size={14} />
                                {test.duration} mins
                            </div>
                            <div className="flex items-center gap-1">
                                <AlertCircle size={14} />
                                {test.questions?.length || 0} Questions
                            </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {new Date(test.createdAt).toLocaleDateString()}
                            </span>
                            <button className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                View Details
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {!loading && tests.length === 0 && (
                <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed">
                    <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-400">No Tests Found</h3>
                    <p className="text-gray-500 mt-2">Start by creating your first test with questions.</p>
                </div>
            )}
        </div>
    );
};

export default TestsPage;
