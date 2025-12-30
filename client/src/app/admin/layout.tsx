'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    FileText,
    Settings,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { useAuthStore } from '../../store/auth-store';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
    { icon: Users, label: 'Students', href: '/admin/students' },
    { icon: BookOpen, label: 'Courses', href: '/admin/courses' },
    { icon: FileText, label: 'Tests', href: '/admin/tests' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const isHydrated = useAuthStore((state) => state.isHydrated);
    const logout = useAuthStore((state) => state.logout);
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const [authorized, setAuthorized] = React.useState(false);

    React.useEffect(() => {
        // Wait for store hydration before checking auth
        if (!isHydrated) return;

        // Protect Route
        if (!user || user.role !== 'admin') {
            router.push('/login');
        } else {
            setAuthorized(true);
        }
    }, [user, isHydrated, router]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!isHydrated || !authorized) return null; // Prevent flash of content

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900/50 backdrop-blur-xl border-r border-zinc-800 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:relative lg:translate-x-0`}
            >
                <div className="h-full flex flex-col p-4">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            LAKSHYA <span className="text-xs text-gray-500 font-mono">v3.0</span>
                        </h1>
                        <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
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
                                        ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                                        : 'text-gray-400 hover:bg-zinc-800 hover:text-white'
                                        }`}
                                >
                                    <Icon size={20} />
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
            <div className="flex-1 flex flex-col min-h-screen">
                <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-zinc-800"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-1.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-sm">
                                AD
                            </div>
                            <span className="text-sm font-medium text-gray-300 hidden sm:block">Admin User</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                />
            )}
        </div>
    );
}
