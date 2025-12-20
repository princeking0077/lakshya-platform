'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, BookOpen, Clock, Tag } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

const CoursesPage = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ title: '', description: '', category: 'GPAT', price: 0 });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/courses`);
            setCourses(res.data.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this course?')) {
            try {
                await axios.delete(`${API_BASE_URL}/api/courses/${id}`);
                setCourses(courses.filter(c => c._id !== id));
            } catch (error) {
                alert('Error deleting course');
            }
        }
    };

    const handleAddCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/courses`, formData);
            setCourses([...courses, res.data.data]);
            setShowAddModal(false);
            setFormData({ title: '', description: '', category: 'GPAT', price: 0 });
        } catch (error) {
            alert('Error adding course');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Courses</h1>
                    <p className="text-gray-400 mt-1">Manage platform courses and content</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                >
                    <Plus size={20} />
                    Create Course
                </button>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                    <motion.div
                        key={course._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors group"
                    >
                        <div className="h-40 bg-zinc-800 flex items-center justify-center relative">
                            <BookOpen className="w-12 h-12 text-zinc-700" />
                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white">
                                {course.category}
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{course.title}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                                {course.description}
                            </p>

                            <div className="flex items-center justify-between mt-4 text-sm">
                                <span className="font-bold text-green-400">₹{course.price}</span>
                                <div className="flex gap-2">
                                    <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course._id)}
                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {!loading && courses.length === 0 && (
                <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed">
                    <BookOpen className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-400">No Courses Found</h3>
                    <p className="text-gray-500 mt-2">Get started by creating your first course.</p>
                </div>
            )}

            {/* Add Course Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl"
                    >
                        <h2 className="text-xl font-bold text-white mb-6">Create New Course</h2>
                        <form onSubmit={handleAddCourse} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Course Title</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea
                                    required
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500 min-h-[100px]"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                    <select
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="GPAT">GPAT</option>
                                        <option value="MPSC">MPSC</option>
                                        <option value="NIPER">NIPER</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-2 rounded-xl bg-zinc-800 text-gray-300 hover:bg-zinc-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-2 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-500 transition-colors disabled:opacity-50"
                                >
                                    {submitting ? 'Creating...' : 'Create Course'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default CoursesPage;
