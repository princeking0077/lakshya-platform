'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { useAuthStore } from '../../store/auth-store';

const LoginPage = () => {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Updated API URL to ensure no double slashes
            const API_URL = `${API_BASE_URL}/api/auth/login`;

            console.log("Attempting login to:", API_URL); // Debug log

            const res = await axios.post(API_URL, formData);

            console.log("Login Response:", res.data); // Debug log

            if (res.data.success && res.data.token) {
                const userData = res.data.data;
                setAuth(userData, res.data.token);

                // Role-Based Redirect
                if (userData.role === 'admin') {
                    router.push('/admin/courses');
                } else {
                    router.push('/student/dashboard');
                }
            } else {
                setError(res.data.message || 'Login failed');
            }
        } catch (err: any) {
            console.error("Login Error:", err);
            setError(err.response?.data?.message || 'Login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black mb-2 tracking-tight">Welcome Back</h2>
                    <p className="text-gray-400">Sign in to continue your preparation</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6 flex items-center gap-3 text-sm"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                                placeholder="student@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-5 h-5" /></>}
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-400 text-sm">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-white hover:text-blue-400 font-medium transition-colors underline decoration-blue-500/30 hover:decoration-blue-500 underline-offset-4">
                        Create Account
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
