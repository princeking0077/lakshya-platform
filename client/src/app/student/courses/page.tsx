'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import Link from 'next/link';

const StudentCourses = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/courses`);
                // In a real app, this would be "my-courses" endpoint
                setCourses(res.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white">My Courses</h1>
                    <p className="text-gray-400">Access your learning materials and lectures</p>
                </div>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        className="bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-white w-full md:w-64 focus:outline-none focus:border-blue-500"
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, idx) => (
                    <motion.div
                        key={course._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-zinc-700 transition-all cursor-pointer"
                    >
                        <Link href={`/student/course-player?id=${course._id}`}>
                            <div className="h-40 bg-zinc-800 relative">
                                {/* Placeholder Thumbnail */}
                                <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
                                    <BookOpen size={48} />
                                </div>
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white">
                                    {course.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{course.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">{course.description}</p>

                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-xs text-blue-400 font-medium">Access Content</span>
                                    <button className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors">
                                        Open
                                    </button>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {!loading && courses.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500">You are not enrolled in any courses yet.</p>
                </div>
            )}
        </div>
    );
};

export default StudentCourses;
