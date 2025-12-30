'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Clock, BookOpen, ChevronRight, FileText } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { useAuthStore } from '@/store/auth-store';

const StudentDashboard = () => {
    const { user } = useAuthStore();
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (user?._id) {
                try {
                    const res = await axios.get(`${API_BASE_URL}/api/assignments?user_id=${user._id}`);
                    if (res.data && Array.isArray(res.data.data)) {
                        setAssignments(res.data.data);
                    } else {
                        setAssignments([]);
                    }
                } catch (error) {
                    console.error("Error fetching assignments:", error);
                    setAssignments([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user]);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <header>
                <h1 className="text-3xl font-black text-white mb-2">Welcome, {user?.name || 'Student'}</h1>
                <p className="text-gray-400">Track your courses and progress</p>
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
                            <span className="text-blue-200 font-medium">My Courses</span>
                        </div>
                        <h3 className="text-4xl font-black text-white mb-1">{assignments.length}</h3>
                        <p className="text-sm text-blue-200/60">Active Enrollments</p>
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
                    <h3 className="text-4xl font-black text-white mb-1">--</h3>
                    <p className="text-sm text-gray-500">Tracked automatically</p>
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
                    <h3 className="text-4xl font-black text-white mb-1">--</h3>
                    <p className="text-sm text-gray-500">Check Results Page</p>
                </motion.div>
            </div>

            {/* My Courses Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">My Enrolled Courses</h2>
                        <Link href="/student/courses" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            Browse All <ChevronRight size={16} />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-gray-500 text-center py-8">Loading courses...</div>
                        ) : assignments.length === 0 ? (
                            <div className="text-center py-12 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed">
                                <p className="text-gray-400 mb-4">You have not enrolled in any courses yet.</p>
                                <Link href="/student/courses" className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors inline-block">
                                    Browse Courses
                                </Link>
                            </div>
                        ) : (
                            assignments.map((assignment, idx) => (
                                <motion.div
                                    key={assignment.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 rounded-2xl p-5 transition-all flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors text-gray-400">
                                            <BookOpen size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">{assignment.course_title}</h4>
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1"><Clock size={12} /> Expires: {assignment.expires_at ? new Date(assignment.expires_at).toLocaleDateString() : 'Lifetime'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/student/course-player?id=${assignment.course_id}`}
                                        className="px-6 py-2 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2"
                                    >
                                        Continue <Play size={14} fill="currentColor" />
                                    </Link>
                                </motion.div>
                            )))}
                    </div>
                </div>

                {/* Sidebar Widgets - Removed Mock Data / Weekly Goal */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-3xl p-6">
                        <h3 className="font-bold text-white mb-2">Need Help?</h3>
                        <p className="text-sm text-gray-400 mb-4">Contact your administrator if you are missing any courses.</p>
                        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="w-[100%] h-full bg-gradient-to-r from-purple-500 to-pink-500" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
