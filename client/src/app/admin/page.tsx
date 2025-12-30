'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, FileText, TrendingUp, DollarSign, Activity } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        students: 0,
        courses: 0,
        tests: 0,
        results: 0
    });
    const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/dashboard`);
                if (res.data.success) {
                    setStats(res.data.stats);
                    setRecentUsers(res.data.recent_users);
                }
            } catch (error) {
                console.error("Error fetching dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Students', value: stats.students, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
        { label: 'Active Courses', value: stats.courses, icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
        { label: 'Tests Created', value: stats.tests, icon: FileText, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
        { label: 'Tests Taken', value: stats.results, icon: Activity, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Dashboard Overview</h1>
                <p className="text-gray-400 mt-1">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-6 rounded-2xl border ${stat.border} bg-zinc-900/50 backdrop-blur-sm`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                    <h3 className="text-xl font-bold mb-4">Recent Registrations</h3>
                    <div className="space-y-4">
                        {recentUsers.length === 0 ? (
                            <p className="text-gray-500 text-sm">No recent registrations.</p>
                        ) : (
                            recentUsers.map((user: any) => (
                                <div key={user.id || user._id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-gray-400">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {new Date(user.created_at || Date.now()).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                    <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-blue-500/50 transition-colors flex flex-col items-center justify-center gap-2 group">
                            <Users className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-gray-300">Add Student</span>
                        </button>
                        <button className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-purple-500/50 transition-colors flex flex-col items-center justify-center gap-2 group">
                            <FileText className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-gray-300">Create Test</span>
                        </button>
                        <button className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-green-500/50 transition-colors flex flex-col items-center justify-center gap-2 group">
                            <BookOpen className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-gray-300">Upload Content</span>
                        </button>
                        <button className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-orange-500/50 transition-colors flex flex-col items-center justify-center gap-2 group">
                            <TrendingUp className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium text-gray-300">View Analytics</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
