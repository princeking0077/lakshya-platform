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
        <section className="relative w-full min-h-screen overflow-hidden bg-black text-white flex items-center justify-center selection:bg-blue-500/30 pt-20">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1a1d29_0%,_#000000_100%)]" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-100 contrast-150 pointer-events-none" />

            {/* Animated Orbs */}
            <motion.div style={{ y: y1 }} className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
            <motion.div style={{ y: y2 }} className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Animated Background Shapes (Hexagons/Chemistry) */}
            <BackgroundShapes />

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center flex flex-col items-center justify-center h-full py-20">

                {/* Floating Badge */}
                <Link href="https://forms.gle/BgrejR14F9jmB4FJ7" target="_blank">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md text-blue-300 text-xs md:text-sm font-medium mb-8 hover:bg-blue-500/20 transition-colors cursor-pointer"
                    >
                        <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                        <span>Admissions Open for DI Batch - Apply Now</span>
                    </motion.div>
                </Link>

                {/* Main Heading */}
                <div className="relative mb-6 md:mb-8 flex justify-center max-w-5xl">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-400 drop-shadow-2xl select-none text-center">
                        Your Journey Begins Here
                    </h1>
                    {/* Glow behind text */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-3xl opacity-20 -z-10" />
                </div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-2xl md:text-4xl font-light text-blue-200 mb-6"
                >
                    Learn | Practice | Achieve
                </motion.p>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed"
                >
                    Start learning with top-rated pharmacy courses and expert instructors.
                    Take your preparation for <span className="text-white font-semibold">GPAT, NIPER, DI</span>, and other pharma exams to the next level.
                </motion.p>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="flex items-center justify-center gap-8 mb-12"
                >
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-white">10+</span>
                        <span className="text-sm text-gray-500 uppercase tracking-widest">Courses</span>
                    </div>
                    <div className="w-[1px] h-10 bg-gray-800" />
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-white">500+</span>
                        <span className="text-sm text-gray-500 uppercase tracking-widest">Students</span>
                    </div>
                    <div className="w-[1px] h-10 bg-gray-800" />
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-bold text-white">Expert</span>
                        <span className="text-sm text-gray-500 uppercase tracking-widest">Tutors</span>
                    </div>
                </motion.div>

                {/* CTA Buttons - Stacked on Mobile */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                    <Link href="#courses" className="relative w-full sm:w-auto px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        <span>Browse Courses</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link href="/login" className="relative w-full sm:w-auto px-8 py-4 bg-zinc-900/50 border border-zinc-700 text-white rounded-xl font-bold text-lg hover:bg-zinc-800 transition-all backdrop-blur-md flex items-center justify-center gap-2">
                        <User className="w-5 h-5 text-gray-400 group-hover:text-white" />
                        <span>Join Now</span>
                    </Link>
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
