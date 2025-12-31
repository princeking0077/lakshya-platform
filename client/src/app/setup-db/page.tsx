'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function SetupDBPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSetup = async () => {
        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/setup-db', {
                method: 'GET',
            });

            const data = await res.json();

            if (data.success) {
                setStatus('success');
                setMessage(data.message);
            } else {
                setStatus('error');
                setMessage(data.message || 'Setup failed');
            }
        } catch (error: any) {
            setStatus('error');
            setMessage('Failed to connect to server: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/10 rounded-2xl mb-4">
                        <Database className="w-8 h-8 text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-black mb-2 tracking-tight">Database Setup</h2>
                    <p className="text-gray-400">Initialize database tables and admin user</p>
                </div>

                {status === 'idle' && (
                    <button
                        onClick={handleSetup}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        Initialize Database
                    </button>
                )}

                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4 py-8">
                        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
                        <p className="text-gray-400">Setting up database...</p>
                    </div>
                )}

                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-500/10 border border-green-500/50 text-green-200 p-6 rounded-xl text-center"
                    >
                        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
                        <h3 className="font-bold text-lg mb-2">Success!</h3>
                        <p className="text-sm mb-4">{message}</p>
                        <div className="text-left bg-zinc-950/50 p-4 rounded-lg border border-zinc-800 mt-4">
                            <p className="text-xs text-gray-400 mb-2">Admin Credentials:</p>
                            <p className="text-sm font-mono">
                                Email: <span className="text-blue-400">shoaib.ss300@gmail.com</span>
                            </p>
                            <p className="text-sm font-mono">
                                Password: <span className="text-blue-400">Shaikh@#$001</span>
                            </p>
                        </div>
                        <a
                            href="/login"
                            className="mt-6 inline-block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors"
                        >
                            Go to Login
                        </a>
                    </motion.div>
                )}

                {status === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/50 text-red-200 p-6 rounded-xl text-center"
                    >
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-400" />
                        <h3 className="font-bold text-lg mb-2">Setup Failed</h3>
                        <p className="text-sm mb-4">{message}</p>
                        <button
                            onClick={handleSetup}
                            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-xl transition-colors"
                        >
                            Try Again
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
