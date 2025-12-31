'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Globe, BookOpen, PlayCircle, Lock, CheckCircle, Award } from 'lucide-react';
import Link from 'next/link';

// Move courseData inside or pass as props. 
// For simplicity, we can keep it here or fetch it.
// Given the current architecture, passing data as props is best if fetched on server, 
// but since we are static exporting, hardcoding here is fine for now, or importing.

const courseData = {
    title: "GPAT 2026 Complete Course",
    description: "The ultimate preparation course for GPAT 2026 aspirants. Covers the entire syllabus with live classes, regular tests, and personal mentorship.",
    rating: 4.8,
    reviews: 124,
    price: "₹4999",
    originalPrice: "₹9999",
    duration: "120+ Hours",
    language: "English + Hindi",
    lastUpdated: "January 2025",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    overview: [
        "Complete coverage of Pharmaceutics, Pharmacology, Chemistry, and Pharmacognosy.",
        "Daily live classes with unlimited recording access.",
        "Weekly topic-wise tests and monthly grand mocks.",
        "Dedicated doubt clearing sessions every Sunday."
    ],
    curriculum: [
        {
            title: "Module 1: Pharmaceutics",
            duration: "24h 15m",
            lessons: [
                { title: "Introduction to Dosage Forms", duration: "1h 30m", locked: false },
                { title: "Preformulation Studies", duration: "2h 15m", locked: true },
                { title: "Tablets and Capsules", duration: "3h 00m", locked: true },
            ]
        },
        {
            title: "Module 2: Pharmacology",
            duration: "30h 00m",
            lessons: [
                { title: "General Pharmacology", duration: "2h 00m", locked: true },
                { title: "ANS Pharmacology", duration: "4h 30m", locked: true },
            ]
        }
    ]
};

const CourseDetailsClient = ({ courseId }: { courseId: string }) => {
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'curriculum', label: 'Curriculum' },
        { id: 'details', label: 'Details' },
        { id: 'reviews', label: 'Reviews' }
    ];

    return (
        <main className="min-h-screen bg-black text-white pt-24 pb-16">
            <div className="container mx-auto px-6">

                {/* Hero Section */}
                <div className="grid md:grid-cols-3 gap-12 mb-12">
                    <div className="md:col-span-2">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
                        >
                            {courseData.title}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-gray-400 mb-6 leading-relaxed"
                        >
                            {courseData.description}
                        </motion.p>

                        <div className="flex items-center gap-6 text-sm text-gray-400 mb-8">
                            <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="w-4 h-4 fill-yellow-500" />
                                <span className="font-bold text-white">{courseData.rating}</span>
                                <span className="text-gray-500">({courseData.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                <span>{courseData.language}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>Last updated {courseData.lastUpdated}</span>
                            </div>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex items-center gap-8 border-b border-zinc-800 mb-8">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-4 relative text-lg font-medium transition-colors ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="min-h-[400px]">
                            {activeTab === 'overview' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    <h3 className="text-2xl font-bold text-white">Course Highlights</h3>
                                    <ul className="space-y-4">
                                        {courseData.overview.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-4 text-gray-300">
                                                <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}

                            {activeTab === 'curriculum' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    {courseData.curriculum.map((module, idx) => (
                                        <div key={idx} className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30">
                                            <div className="px-6 py-4 bg-zinc-900/50 flex items-center justify-between border-b border-zinc-800">
                                                <h4 className="font-bold text-lg text-white">{module.title}</h4>
                                                <span className="text-sm text-gray-400">{module.duration}</span>
                                            </div>
                                            <div className="divide-y divide-zinc-800/50">
                                                {module.lessons.map((lesson, lIdx) => (
                                                    <div key={lIdx} className="px-6 py-4 flex items-center justify-between hover:bg-zinc-900/50 transition-colors">
                                                        <div className="flex items-center gap-4">
                                                            <PlayCircle className="w-5 h-5 text-blue-500" />
                                                            <span className="text-gray-300">{lesson.title}</span>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-sm text-gray-500">{lesson.duration}</span>
                                                            {lesson.locked ? (
                                                                <Lock className="w-4 h-4 text-gray-600" />
                                                            ) : (
                                                                <span className="text-xs text-green-500 border border-green-500/20 bg-green-500/10 px-2 py-0.5 rounded">Free</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === 'details' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-gray-300">
                                    <p>Comprehensive details about the course structure, validity, and certification.</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-zinc-900 rounded-xl">
                                            <span className="block text-sm text-gray-500 mb-1">Duration</span>
                                            <span className="font-bold text-white">{courseData.duration}</span>
                                        </div>
                                        <div className="p-4 bg-zinc-900 rounded-xl">
                                            <span className="block text-sm text-gray-500 mb-1">Validity</span>
                                            <span className="font-bold text-white">1 Year</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'reviews' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="text-5xl font-bold text-white">{courseData.rating}</div>
                                        <div>
                                            <div className="flex text-yellow-500 mb-1">
                                                <Star className="fill-yellow-500" />
                                                <Star className="fill-yellow-500" />
                                                <Star className="fill-yellow-500" />
                                                <Star className="fill-yellow-500" />
                                                <Star className="fill-yellow-500" />
                                            </div>
                                            <p className="text-sm text-gray-500">Based on {courseData.reviews} reviews</p>
                                        </div>
                                    </div>
                                    {/* Mock Review */}
                                    <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">JD</div>
                                            <div>
                                                <h5 className="font-bold text-white">John Doe</h5>
                                                <div className="flex text-yellow-500 w-3 h-3 gap-0.5">
                                                    <Star className="w-3 h-3 fill-yellow-500" />
                                                    <Star className="w-3 h-3 fill-yellow-500" />
                                                    <Star className="w-3 h-3 fill-yellow-500" />
                                                    <Star className="w-3 h-3 fill-yellow-500" />
                                                    <Star className="w-3 h-3 fill-yellow-500" />
                                                </div>
                                            </div>
                                            <span className="ml-auto text-sm text-gray-500">2 days ago</span>
                                        </div>
                                        <p className="text-gray-300">Excellent course! The live classes are very interactive and the daily tests help a lot in revision.</p>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                    </div>

                    {/* Sidebar / Enrolment Card */}
                    <div className="md:col-span-1">
                        <div className="sticky top-24 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 overflow-hidden">
                            <div className="relative h-48 -mx-6 -mt-6 mb-6">
                                <img src={courseData.image} alt={courseData.title} className="w-full h-full object-cover" />
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-3xl font-bold text-white">{courseData.price}</span>
                                    <span className="text-lg text-gray-500 line-through">{courseData.originalPrice}</span>
                                </div>
                                <span className="bg-green-500/20 text-green-400 text-sm px-3 py-1 rounded-full font-bold">50% OFF</span>
                            </div>

                            <div className="space-y-4 mb-8">
                                <a
                                    href="https://forms.gle/BgrejR14F9jmB4FJ7"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg shadow-white/10"
                                >
                                    Enroll Now
                                </a>
                                <div className="text-center text-xs text-gray-500">
                                    30-Day Money-Back Guarantee
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-zinc-800">
                                <h4 className="font-bold text-white mb-2">This Course Includes:</h4>
                                <ul className="space-y-3 text-sm text-gray-300">
                                    <li className="flex items-center gap-3">
                                        <PlayCircle className="w-5 h-5 text-blue-500" />
                                        <span>120+ Hours of Video</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <BookOpen className="w-5 h-5 text-blue-500" />
                                        <span>50+ Study Notes</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-blue-500" />
                                        <span>Full Lifetime Access</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Award className="w-5 h-5 text-blue-500" />
                                        <span>Completion Certificate</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CourseDetailsClient;
