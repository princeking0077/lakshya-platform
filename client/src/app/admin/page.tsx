'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, FileText, TrendingUp, DollarSign } from 'lucide-react';

const stats = [
    { label: 'Total Students', value: '150', change: '+12%', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
    { label: 'Active Courses', value: '4', change: '0%', icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
    { label: 'Tests Conducted', value: '32', change: '+5', icon: FileText, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
    { label: 'Revenue (₹)', value: '45,000', change: '+25%', icon: DollarSign, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Dashboard Overview</h1>
                <p className="text-gray-400 mt-1">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
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
                                <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">{stat.change}</span>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Recent Activity Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50">
                    <h3 className="text-xl font-bold mb-4">Recent Registrations</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-gray-400">
                                        JD
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">New Student {i}</p>
                                        <p className="text-xs text-gray-500">student{i}@example.com</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500">2 mins ago</span>
                            </div>
                        ))}
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
