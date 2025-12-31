'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Award, Users, BookOpen } from 'lucide-react';

const AboutPage = () => {
    return (
        <main className="min-h-screen bg-black text-white pt-24 pb-16">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center mb-20"
                >
                    <h1 className="text-5xl md:text-6xl font-black mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                        About <span className="text-blue-500">Enlighten Pharma</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
                        India’s leading platform for pharmacy exam preparation.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl font-bold mb-6 text-white">Who We Are</h2>
                        <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                            We specialize in <span className="text-white font-semibold">GPAT, NIPER, DPEE, MPSC Drug Inspector</span>, and various national/state-level competitive exams.
                        </p>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            With expert faculties, structured test series, and live interactive classes, we aim to empower pharmacy students to achieve academic and professional excellence.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-2 gap-4"
                    >
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 flex flex-col items-center text-center">
                            <Award className="w-10 h-10 text-blue-500 mb-4" />
                            <h3 className="font-bold text-white mb-2">Top Results</h3>
                            <p className="text-sm text-gray-500">Consistent rankers in GPAT & NIPER</p>
                        </div>
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 flex flex-col items-center text-center">
                            <Users className="w-10 h-10 text-purple-500 mb-4" />
                            <h3 className="font-bold text-white mb-2">Expert Tutors</h3>
                            <p className="text-sm text-gray-500">Decades of combined experience</p>
                        </div>
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 flex flex-col items-center text-center">
                            <BookOpen className="w-10 h-10 text-emerald-500 mb-4" />
                            <h3 className="font-bold text-white mb-2">Structured Content</h3>
                            <p className="text-sm text-gray-500">Exam-focused study material</p>
                        </div>
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 flex flex-col items-center text-center">
                            <CheckCircle className="w-10 h-10 text-amber-500 mb-4" />
                            <h3 className="font-bold text-white mb-2">Daily Tests</h3>
                            <p className="text-sm text-gray-500">Consistent practice & analysis</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    );
};

export default AboutPage;
