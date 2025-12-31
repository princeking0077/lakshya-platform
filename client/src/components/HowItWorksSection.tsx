'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, ArrowRight, Play, FileCheck, Trophy, Sparkles } from 'lucide-react';

const steps = [
    {
        id: "01",
        title: "Registration",
        description: "Complete your profile and upload payment proof securely.",
        icon: <UserPlus className="w-6 h-6 text-white" />,
        color: "bg-blue-500"
    },
    {
        id: "02",
        title: "Instant Access",
        description: "Receive your credentials and access the learning portal immediately.",
        icon: <Sparkles className="w-6 h-6 text-white" />,
        color: "bg-purple-500"
    },
    {
        id: "03",
        title: "Start Learning",
        description: "Join live sessions or watch high-quality recorded lectures.",
        icon: <Play className="w-6 h-6 text-white" />,
        color: "bg-pink-500"
    },
    {
        id: "04",
        title: "Daily Testing",
        description: "Attempt time-bound DPPs and track your daily progress.",
        icon: <FileCheck className="w-6 h-6 text-white" />,
        color: "bg-orange-500"
    },
    {
        id: "05",
        title: "Achieve Success",
        description: "Master the syllabus and crack the exam with top rank.",
        icon: <Trophy className="w-6 h-6 text-white" />,
        color: "bg-green-500"
    }
];

const HowItWorksSection = () => {
    return (
        <section id="how-it-works" className="py-32 bg-black text-white relative">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <span className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-2 block">Process</span>
                    <h2 className="text-4xl md:text-5xl font-black mb-6">How LAKSHYA Works</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        A seamless journey engineered for your success. Five simple steps to your dream career.
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-[50px] left-0 w-full h-[2px] bg-zinc-800">
                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 origin-left"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.2, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="relative group pt-8 md:pt-0"
                            >
                                {/* Step Node */}
                                <div className={`relative w-24 h-5 md:mt-[40px] mb-8 mx-auto md:mx-0 flex justify-center`}>
                                    <div className={`absolute top-0 w-5 h-5 rounded-full ${step.color} shadow-[0_0_20px_currentColor] z-20 group-hover:scale-150 transition-transform duration-300`} />
                                </div>

                                {/* Card */}
                                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:bg-zinc-800/80 transition-all duration-300 hover:-translate-y-2">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-3 rounded-xl ${step.color} bg-opacity-20`}>
                                            {step.icon}
                                        </div>
                                        <span className="text-3xl font-black text-zinc-800 group-hover:text-zinc-700 transition-colors">
                                            {step.id}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-white">{step.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
