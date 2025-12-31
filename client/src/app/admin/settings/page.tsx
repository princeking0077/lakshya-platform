'use client';

import React from 'react';
import { Save, Lock, Bell, Globe } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-gray-400 mt-1">Manage platform preferences</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm space-y-8">
                {/* Profile Settings */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Lock size={20} className="text-blue-400" />
                        Security
                    </h3>
                    <div className="grid gap-4 max-w-xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                            <input type="password" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                            <input type="password" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white" />
                        </div>
                        <button className="w-fit bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-medium transition-colors">
                            Update Password
                        </button>
                    </div>
                </div>

                <div className="border-t border-zinc-800 pt-8 space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Globe size={20} className="text-green-400" />
                        General
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
                        <div>
                            <p className="font-medium text-white">Maintenance Mode</p>
                            <p className="text-sm text-gray-500">Disable access for students temporarily</p>
                        </div>
                        <div className="w-12 h-6 bg-zinc-800 rounded-full relative cursor-pointer">
                            <div className="absolute left-1 top-1 w-4 h-4 bg-gray-500 rounded-full transition-all"></div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-zinc-800 pt-8 space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Globe size={20} className="text-green-400" />
                        System Diagnostics
                    </h3>
                    <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-4">
                        <p className="text-sm text-gray-500">
                            Use this tool to check if the server is connected correctly.
                        </p>
                        <ConnectionTester />
                    </div>
                </div>
            </div>
        </div>
    );
}

const ConnectionTester = () => {
    const [status, setStatus] = React.useState('idle');
    const [log, setLog] = React.useState('');

    const runTest = async () => {
        setStatus('testing');
        setLog('Starting test...\nFetching /api/users...');
        try {
            // Using relative path to force use of same domain
            const res = await fetch('/api/users');
            setLog(prev => prev + `\nStatus: ${res.status} ${res.statusText}`);

            const text = await res.text();
            setLog(prev => prev + `\nResponse Preview (First 100 chars):\n${text.substring(0, 100)}...`);

            if (res.ok) {
                try {
                    const json = JSON.parse(text);
                    setLog(prev => prev + `\n✅ valid JSON received. Array length: ${Array.isArray(json) ? json.length : 'Not Array'}`);
                    setStatus('success');
                } catch (e) {
                    setLog(prev => prev + `\n❌ Invalid JSON. Server returned HTML?`);
                    setStatus('error');
                }
            } else {
                setStatus('error');
            }
        } catch (error: any) {
            setLog(prev => prev + `\n❌ Fetch failed: ${error.message}`);
            setStatus('error');
        }
    };

    return (
        <div className="space-y-3">
            <button
                onClick={runTest}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-sm"
            >
                {status === 'testing' ? 'Testing...' : 'Run System Check'}
            </button>
            {log && (
                <pre className="p-3 bg-black rounded-lg text-xs font-mono text-green-400 overflow-x-auto border border-zinc-800">
                    {log}
                </pre>
            )}
        </div>
    );
};
