'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BookOpen, Sparkles, User, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <section className="relative w-full min-h-screen overflow-hidden bg-black text-white flex items-center justify-center selection:bg-blue-500/30">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1a1d29_0%,_#000000_100%)]" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-100 contrast-150 pointer-events-none" />

            {/* Animated Orbs */}
            <motion.div style={{ y: y1 }} className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
            <motion.div style={{ y: y2 }} className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Animated Background Shapes (Hexagons/Chemistry) */}
            <BackgroundShapes />

            {/* Navigation Header */}
            <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12">
                <div className="flex items-center gap-2">
                    {/* Logo (if any) or Text */}
                    <span className="text-xl font-bold tracking-tighter text-white">LAKSHYA</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        <User size={16} />
                        Student Login
                    </Link>
                    <Link href="/login" className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-white text-black rounded-full hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
                        <ShieldCheck size={16} />
                        Admin Login
                    </Link>
                </div>
            </nav>

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center flex flex-col items-center justify-center h-full py-20">

                {/* Floating Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md text-blue-300 text-xs md:text-sm font-medium mb-8"
                >
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                    <span>Admissions Open for 2026 Batch</span>
                </motion.div>

                {/* Brand Name / Logo Redesign */}
                <div className="relative mb-6 md:mb-8 flex justify-center">
                    <h1 className="text-[12vw] md:text-[8vw] lg:text-[7vw] font-black tracking-[-0.05em] leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-400 drop-shadow-2xl select-none flex">
                        {Array.from("LAKSHYA").map((letter, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 50, rotateX: 90 }}
                                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                transition={{
                                    duration: 0.8,
                                    delay: i * 0.1 + 0.5,
                                    ease: [0.2, 0.65, 0.3, 0.9]
                                }}
                            >
                                {letter}
                            </motion.span>
                        ))}
                    </h1>
                    {/* Glow behind text */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-3xl opacity-20 -z-10" />
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-3xl lg:text-4xl font-light text-gray-300 mb-8 max-w-3xl leading-tight"
                >
                    Master <span className="text-white font-medium">GPAT</span> & <span className="text-white font-medium">Drug Inspector</span> Exams
                </motion.p>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="text-sm md:text-lg text-gray-400 max-w-xl mx-auto mb-10 md:mb-12 leading-relaxed"
                >
                    India's most advanced learning platform with 24/7 locked practice papers, live analytics, and expert mentorship.
                </motion.p>

                {/* CTA Buttons - Stacked on Mobile */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                    <button className="relative w-full sm:w-auto px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        <span>Explore GPAT Course</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button className="relative w-full sm:w-auto px-8 py-4 bg-zinc-900/50 border border-zinc-700 text-white rounded-xl font-bold text-lg hover:bg-zinc-800 transition-all backdrop-blur-md flex items-center justify-center gap-2">
                        <BookOpen className="w-5 h-5 text-gray-400 group-hover:text-white" />
                        <span>MPSC Batch Details</span>
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

const BackgroundShapes = () => {
    const [mounted, setMounted] = useState(false);
    const [shapes, setShapes] = useState<any[]>([]);

    useEffect(() => {
        setMounted(true);
        // Deterministic random generation for hydration match
        const newShapes = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 60 + 20, // Bigger shapes
            duration: Math.random() * 20 + 10,
            delay: Math.random() * 5,
            rotation: Math.random() * 360
        }));
        setShapes(newShapes);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {shapes.map((s) => (
                <motion.div
                    key={s.id}
                    className="absolute opacity-10 text-white/20"
                    initial={{
                        left: `${s.x}%`,
                        top: `${s.y}%`,
                        rotate: s.rotation,
                        scale: 0
                    }}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, 50, -50, 0],
                        rotate: [s.rotation, s.rotation + 180, s.rotation + 360],
                        opacity: [0, 0.2, 0],
                        scale: [0, 1, 0]
                    }}
                    transition={{
                        duration: s.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: s.delay,
                    }}
                >
                    {/* Hexagon SVG (Benzene Ring style for Pharmacy context) */}
                    <svg
                        width={s.size}
                        height={s.size}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                    >
                        <path d="M12 2L2 7L2 17L12 22L22 17L22 7L12 2Z" />
                    </svg>
                </motion.div>
            ))}
        </div>
    );
};

export default HeroSection;
