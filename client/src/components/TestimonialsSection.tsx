'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, TrendingUp, Users, Video, BookOpen } from 'lucide-react';

const testimonials = [
    {
        name: "Aditi S.",
        role: "GPAT 2024 - AIR 12",
        text: "The discipline that LAKSHYA's 24-hour lock system forces on you is incredible. I never missed a single day of study.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditi",
        initial: "AS"
    },
    {
        name: "Rahul M.",
        role: "MPSC Drug Inspector",
        text: "MPSC requires a different approach than GPAT. The subject-wise test series was exactly what I needed to clear the exam.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
        initial: "RM"
    },
    {
        name: "Sneha P.",
        role: "NIPER JEE - AIR 45",
        text: "Best investment for my career. The live classes are interactive and the teachers are always available for doubts.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
        initial: "SP"
    }
];

const stats = [
    { label: "Active Students", value: 5000, suffix: "+", icon: <Users className="w-5 h-5 text-blue-400" /> },
    { label: "Selections", value: 450, suffix: "+", icon: <TrendingUp className="w-5 h-5 text-green-400" /> },
    { label: "Video Hours", value: 1200, suffix: "+", icon: <Video className="w-5 h-5 text-purple-400" /> },
    { label: "Tests Conducted", value: 15000, suffix: "+", icon: <BookOpen className="w-5 h-5 text-orange-400" /> }
];

const AnimatedCounter = ({ value, duration = 2 }: { value: number, duration?: number }) => {
    const [count, setCount] = React.useState(0);
    const nodeRef = React.useRef(null);
    const isInView = React.useRef(false);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isInView.current) {
                    isInView.current = true;
                    let startTime: number;
                    const startValue = 0;

                    const step = (timestamp: number) => {
                        if (!startTime) startTime = timestamp;
                        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
                        setCount(Math.floor(progress * (value - startValue) + startValue));

                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        }
                    };
                    window.requestAnimationFrame(step);
                }
            },
            { threshold: 0.1 }
        );

        if (nodeRef.current) observer.observe(nodeRef.current);
        return () => observer.disconnect();
    }, [value, duration]);

    return <span ref={nodeRef}>{count.toLocaleString()}</span>;
};

const TestimonialsSection = () => {
    return (
        <section id="testimonials" className="py-32 bg-zinc-950/50 text-white relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Success Stories</h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg"
                    >
                        Hear from those who transformed their dreams into reality.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl relative group hover:border-zinc-700 hover:bg-zinc-800/50 transition-all duration-300"
                        >
                            <Quote className="absolute top-8 right-8 w-10 h-10 text-zinc-800 group-hover:text-blue-500/20 transition-colors" />

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[2px]">
                                    <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-xl font-bold">
                                        {t.initial}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">{t.name}</h4>
                                    <span className="text-blue-400 text-sm font-medium">{t.role}</span>
                                </div>
                            </div>

                            <div className="flex gap-1 mb-4 text-yellow-500">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>

                            <p className="text-gray-300 leading-relaxed italic">
                                "{t.text}"
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Stats Section Bar */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-12 backdrop-blur-xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center border-r last:border-r-0 border-zinc-800 px-4">
                                <div className="mb-3 p-3 bg-white/5 rounded-full">
                                    {stat.icon}
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black text-white mb-2 flex items-center gap-1 justify-center">
                                    <AnimatedCounter value={stat.value} />
                                    <span>{stat.suffix}</span>
                                </h3>
                                <p className="text-gray-500 font-medium tracking-wide uppercase text-xs">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
