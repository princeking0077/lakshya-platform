'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Shield, Briefcase, FileCheck, BookOpen, Target } from 'lucide-react';

const featureData = [
    {
        id: 1,
        title: "National Level Entrance Exams",
        subCategories: "GPAT, NIPER, etc",
        description: "For PG admission preparation",
        icon: <Award className="w-8 h-8 text-blue-400" />,
        color: "from-blue-500/20 to-blue-600/5",
        border: "group-hover:border-blue-500/50",
        delay: 0.1,
        colSpan: "md:col-span-2"
    },
    {
        id: 2,
        title: "State-Level Exams (Maharashtra)",
        subCategories: "MPSC Drug Inspector, Assistant Commissioner",
        description: "State-level government jobs",
        icon: <Shield className="w-8 h-8 text-emerald-400" />,
        color: "from-emerald-500/20 to-emerald-600/5",
        border: "group-hover:border-emerald-500/50",
        delay: 0.2,
        colSpan: "md:col-span-2"
    },
    {
        id: 3,
        title: "Government Job Preparation",
        subCategories: "Pharmacist (Railways, AIIMS, ESIC, SSC), DI, FDA",
        description: "Job-oriented test prep",
        icon: <Briefcase className="w-8 h-8 text-purple-400" />,
        color: "from-purple-500/20 to-purple-600/5",
        border: "group-hover:border-purple-500/50",
        delay: 0.3,
        colSpan: "md:col-span-2"
    },
    {
        id: 4,
        title: "Pharmacy Exit Exams",
        subCategories: "DPEE (Diploma Pharmacy Exit Exam)",
        description: "Exit certification",
        icon: <FileCheck className="w-8 h-8 text-amber-400" />,
        color: "from-amber-500/20 to-amber-600/5",
        border: "group-hover:border-amber-500/50",
        delay: 0.4,
        colSpan: "md:col-span-1"
    },
    {
        id: 5,
        title: "University Exams Support",
        subCategories: "B.Pharm & D.Pharm Subjectwise",
        description: "Semester-wise learning aid",
        icon: <BookOpen className="w-8 h-8 text-pink-400" />,
        color: "from-pink-500/20 to-pink-600/5",
        border: "group-hover:border-pink-500/50",
        delay: 0.5,
        colSpan: "md:col-span-1"
    }
];

const FeatureSection = () => {
    return (
        <section id="features" className="py-32 bg-zinc-950 text-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-30 pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Course Categories</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-lg">
                            Comprehensive preparation materials for every stage of your pharmacy career.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {featureData.map((feature) => (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: feature.delay }}
                            className={`group relative p-8 rounded-3xl border border-white/5 bg-zinc-900/50 backdrop-blur-xl hover:bg-zinc-900/80 transition-all duration-500 ${feature.colSpan}`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />

                            <div className="relative z-10 h-full flex flex-col">
                                <div className={`w-14 h-14 rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-white/5 mb-6 group-hover:scale-110 transition-transform duration-500 ${feature.border}`}>
                                    {feature.icon}
                                </div>

                                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-sm font-semibold text-blue-400 mb-2">
                                    {feature.subCategories}
                                </p>
                                <p className="text-gray-400 text-sm group-hover:text-gray-300 leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Decorative Element */}
                                <div className="mt-auto pt-8 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-4 group-hover:translate-x-0">
                                    <div className="p-2 rounded-full bg-white/10">
                                        <Target className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
