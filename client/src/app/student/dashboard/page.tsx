'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Clock, BookOpen, ChevronRight, FileText } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

const StudentDashboard = () => {
    const [recentTests, setRecentTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch available tests as a placeholder for "Recent Activity" for now
        // In real app, this would fetch user specific enrolled courses/tests
        const fetchContent = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/tests`);
                setRecentTests(res.data.data.slice(0, 3));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <header>
                <h1 className="text-3xl font-black text-white mb-2">My Progress</h1>
                <p className="text-gray-400">Track your journey to MPSE/GPAT success</p>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-3xl p-6 relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-500 rounded-lg text-white">
                                <TrendingUp size={20} />
                            </div>
                            <span className="text-blue-200 font-medium">Average Score</span>
                        </div>
                        <h3 className="text-4xl font-black text-white mb-1">78%</h3>
                        <p className="text-sm text-blue-200/60">+12% from last week</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                            <Clock size={20} />
                        </div>
                        <span className="text-gray-300 font-medium">Hours Studied</span>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-1">45h</h3>
                    <p className="text-sm text-gray-500">This Month</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                            <BookOpen size={20} />
                        </div>
                        <span className="text-gray-300 font-medium">Tests Taken</span>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-1">12</h3>
                    <p className="text-sm text-gray-500">Total Attempts</p>
                </motion.div>
            </div>

            {/* Quick Actions & Recent Tests */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Recommended Tests</h2>
                        <Link href="/student/tests" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            View All <ChevronRight size={16} />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-gray-500 text-center py-8">Loading tests...</div>
                        ) : recentTests.map((test, idx) => (
                            <motion.div
                                key={test._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 rounded-2xl p-5 transition-all flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors text-gray-400">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white mb-1">{test.title}</h4>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><Clock size={12} /> {test.duration} mins</span>
                                            <span>{test.questions?.length || 0} Questions</span>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href={`/student/test/${test._id}`}
                                    className="px-6 py-2 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2"
                                >
                                    Start <Play size={14} fill="currentColor" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-3xl p-6">
                        <h3 className="font-bold text-white mb-2">Weekly Goal</h3>
                        <p className="text-sm text-gray-400 mb-4">You've completed 3/5 tests this week. Keep it up!</p>
                        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="w-[60%] h-full bg-gradient-to-r from-purple-500 to-pink-500" />
                        </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                        <h3 className="font-bold text-white mb-4">Upcoming Live Class</h3>
                        <div className="flex items-start gap-4 mb-4">
                            <div className="flex flex-col items-center bg-zinc-800 rounded-xl p-2 min-w-[60px]">
                                <span className="text-xs text-gray-400 uppercase">Dec</span>
                                <span className="text-xl font-bold text-white">22</span>
                            </div>
                            <div>
                                <h4 className="font-medium text-white line-clamp-2">Pharmacology: Mechanism of Action Deep Dive</h4>
                                <p className="text-xs text-gray-500 mt-1">10:00 AM - 12:00 PM</p>
                            </div>
                        </div>
                        <button className="w-full py-3 rounded-xl bg-zinc-800 text-gray-300 hover:bg-zinc-700 hover:text-white text-sm font-medium transition-colors">
                            Set Reminder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
