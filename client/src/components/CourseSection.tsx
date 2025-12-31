'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Star, ArrowRight, Video, Book } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const courses = [
    {
        id: 1,
        title: "GPAT 2026 Complete Course",
        duration: "120+ Hrs",
        price: "₹4999",
        originalPrice: "₹9999",
        rating: 4.8,
        gradient: "from-blue-600 to-cyan-500",
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "NIPER Entrance Mastery",
        duration: "80+ Hrs",
        price: "₹3999",
        originalPrice: "₹7999",
        rating: 4.7,
        gradient: "from-purple-600 to-pink-500",
        image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "MPSC Drug Inspector Test Series",
        duration: "30 Days",
        price: "₹999",
        originalPrice: "₹1999",
        rating: 4.6,
        gradient: "from-amber-600 to-orange-500",
        image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        link: "https://forms.gle/BgrejR14F9jmB4FJ7",
        isExternal: true
    },
    {
        id: 4,
        title: "DPEE Complete Preparation",
        duration: "100+ Hrs",
        price: "₹2999",
        originalPrice: "₹5999",
        rating: 4.9,
        gradient: "from-emerald-600 to-green-500",
        image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

const CourseSection = () => {
    return (
        <section id="courses" className="py-24 bg-black text-white relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-[20%] right-[0%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                        Popular Courses
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Explore our most enrolled and high-rated pharmacy learning programs.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {courses.map((course, idx) => (
                        <CourseCard key={course.id} course={course} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const CourseCard = ({ course, index }: { course: any, index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col"
        >
            <Link
                href={course.link || `/courses/${course.id}`}
                target={course.isExternal ? "_blank" : "_self"}
                className="flex flex-col h-full"
            >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10`} />
                    <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold text-white">{course.rating}</span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-400 transition-colors">
                        {course.title}
                    </h3>

                    <div className="flex items-center gap-4 text-gray-400 text-sm mb-6">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>{course.duration}</span>
                        </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                        <div>
                            <span className="text-xs text-gray-500 line-through block">{course.originalPrice}</span>
                            <span className="text-2xl font-bold text-white">{course.price}</span>
                        </div>
                        <button className={`px-4 py-2 rounded-lg bg-white text-black font-bold text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2`}>
                            {course.isExternal ? 'Apply Now' : 'Buy Now'}
                        </button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default CourseSection;
