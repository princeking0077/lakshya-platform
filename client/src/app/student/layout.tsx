'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    Award,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useAuthStore } from '../../store/auth-store';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/student/dashboard' },
    { icon: BookOpen, label: 'My Courses', href: '/student/courses' },
    { icon: FileText, label: 'All Tests', href: '/student/tests' },
    { icon: Award, label: 'My Results', href: '/student/results' },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900/80 backdrop-blur-xl border-r border-zinc-800 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:relative lg:translate-x-0`}
            >
                <div className="h-full flex flex-col p-4">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                            LAKSHYA
                        </h1>
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="mb-8 px-2 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 p-[1px]">
                            <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center font-bold text-sm">
                                {user?.name.charAt(0).toUpperCase() || 'S'}
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold truncate">{user?.name || 'Student'}</p>
                            <p className="text-xs text-gray-400 truncate">GPAT Aspirant</p>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-1">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                            ? 'bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white border border-green-500/20 shadow-lg shadow-green-900/20'
                                            : 'text-gray-400 hover:bg-zinc-800 hover:text-white'
                                        }`}
                                >
                                    <Icon size={20} className={isActive ? 'text-green-400' : ''} />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="mt-auto border-t border-zinc-800 pt-4">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut size={20} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen relative">
                {/* Background noise for consistency */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none z-0" />

                <header className="h-16 border-b border-zinc-800 bg-black/50 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-zinc-800"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="ml-auto flex items-center gap-4">
                        {/* Add notifications or other header items here */}
                        <span className="text-xs font-medium text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                            Premium Member
                        </span>
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto relative z-10">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                />
            )}
        </div>
    );
}
