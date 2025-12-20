'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Video, FileText, Clock, Award, Book, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

const CourseSection = () => {
    return (
        <section id="courses" className="py-24 bg-zinc-950 text-white relative overflow-hidden">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                        Our Premium Courses
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Choose your path to success with our specialized batches designed for top-tier results.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
                    {/* GPAT Card */}
                    <CourseCard
                        title="LAKSHYA BATCH"
                        subtitle="GPAT - 2026"
                        gradient="from-blue-600 to-cyan-500"
                        icon={<Award className="w-12 h-12 text-white mb-4" />}
                        features={[
                            { icon: <Video className="w-5 h-5 text-blue-300" />, text: "Live Classes with Recording" },
                            { icon: <Clock className="w-5 h-5 text-blue-300" />, text: "Daily Practice Papers (24h Lock)" },
                            { icon: <FileText className="w-5 h-5 text-blue-300" />, text: "Weekly Tests & Analytics" },
                            { icon: <Book className="w-5 h-5 text-blue-300" />, text: "Comprehensive Study Material" },
                        ]}
                    />

                    {/* MPSC Card */}
                    <CourseCard
                        title="MAHARASHTRA MPSC"
                        subtitle="Drug Inspector"
                        gradient="from-purple-600 to-pink-500"
                        icon={<CheckCircle className="w-12 h-12 text-white mb-4" />}
                        features={[
                            { icon: <FileText className="w-5 h-5 text-purple-300" />, text: "Exclusive Test Series Focus" },
                            { icon: <Book className="w-5 h-5 text-purple-300" />, text: "Subject-Wise Structure" },
                            { icon: <AlertCircle className="w-5 h-5 text-purple-300" />, text: "Negative Marking (+1 / -0.33)" },
                            { icon: <Clock className="w-5 h-5 text-purple-300" />, text: "Timed Exams & Instant Results" },
                        ]}
                    />
                </div>
            </div>
        </section>
    );
};

const CourseCard = ({ title, subtitle, gradient, icon, features }: { title: string, subtitle: string, gradient: string, icon: any, features: any[] }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -15, scale: 1.03 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative group rounded-[2rem] p-[3px] bg-gradient-to-br from-gray-800 to-gray-900 hover:from-blue-500 hover:to-purple-500 transition-all duration-500"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative h-full bg-zinc-950/90 backdrop-blur-xl rounded-[1.8rem] p-8 flex flex-col items-start border border-white/5">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg mb-8 group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>

                <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">{title}</h3>
                <p className={`text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r ${gradient} mb-8`}>
                    {subtitle}
                </p>

                <ul className="space-y-5 mb-10 flex-grow w-full">
                    {features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-4 text-gray-300 group-hover:text-white transition-colors">
                            <div className="p-1 rounded-full bg-white/5">
                                {feature.icon}
                            </div>
                            <span className="font-medium text-sm">{feature.text}</span>
                        </li>
                    ))}
                </ul>

                <button className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r ${gradient} opacity-90 hover:opacity-100 shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transform transition-all active:scale-95 flex items-center justify-center gap-2 group-hover:tracking-wide`}>
                    Enroll Now <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}

export default CourseSection;
