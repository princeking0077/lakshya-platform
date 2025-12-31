'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, User, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Courses', href: '#courses' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'
                    }`}
            >
                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Brand */}
                    <Link href="/" className="flex items-center gap-2 z-50">
                        <span className="text-2xl font-bold tracking-tighter text-white">
                            Enlighten<span className="text-blue-500">Pharma</span>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="/login"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        >
                            <User size={16} />
                            Student Login
                        </Link>
                        <Link
                            href="/login"
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-white text-black rounded-full hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
                        >
                            <ShieldCheck size={16} />
                            Admin
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white z-50"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-black pt-24 px-6 md:hidden"
                    >
                        <div className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-2xl font-bold text-gray-300 hover:text-white"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <hr className="border-gray-800" />
                            <Link href="/login" className="text-xl font-medium text-blue-400">
                                Student Login
                            </Link>
                            <Link href="/login" className="text-xl font-medium text-purple-400">
                                Admin Login
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
