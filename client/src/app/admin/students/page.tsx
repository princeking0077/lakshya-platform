'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Trash2, Edit, MoreHorizontal, User, Mail, Phone, Loader2, BookOpen } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

const StudentsPage = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
    const [submitting, setSubmitting] = useState(false);

    // Assignment State
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedStudentForAssignment, setSelectedStudentForAssignment] = useState<any>(null);
    const [availableCourses, setAvailableCourses] = useState<any[]>([]);
    const [assignmentData, setAssignmentData] = useState({ course_id: '', expires_at: '' });

    useEffect(() => {
        fetchStudents();
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/courses`);
            if (res.data && Array.isArray(res.data.data)) {
                setAvailableCourses(res.data.data);
            }
        } catch (error) {
            console.error("Error fetching courses for assignment dropdown", error);
        }
    };

    const openAssignModal = (student: any) => {
        setSelectedStudentForAssignment(student);
        setAssignmentData({ course_id: '', expires_at: '' });
        setShowAssignModal(true);
    };

    const handleAssignSubmit = async () => {
        if (!selectedStudentForAssignment || !assignmentData.course_id) return;
        setSubmitting(true);
        try {
            await axios.post(`${API_BASE_URL}/api/assignments`, {
                user_id: selectedStudentForAssignment._id || selectedStudentForAssignment.id,
                course_id: assignmentData.course_id,
                expires_at: assignmentData.expires_at
            });
            alert("Course assigned successfully!");
            setShowAssignModal(false);
        } catch (error) {
            alert("Failed to assign course");
        } finally {
            setSubmitting(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/users`);
            if (Array.isArray(res.data)) {
                setStudents(res.data);
            } else {
                console.error("API Error or Invalid Format:", res.data);
                setStudents([]); // Default to empty to prevent crash
            }
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleToggleApproval = async (id: string, currentStatus: boolean) => {
        try {
            const newStatus = !currentStatus; // Toggle
            // Use PUT to update status
            await axios.put(`${API_BASE_URL}/api/users`, { id, is_approved: newStatus ? 1 : 0 });

            // Optimistic Update
            setStudents(students.map(s => s._id === id ? { ...s, is_approved: newStatus } : s));
        } catch (error) {
            console.error("Error updating status", error);
            alert("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this student?')) {
            try {
                await axios.delete(`${API_BASE_URL}/api/users/${id}`);
                setStudents(students.filter(s => s._id !== id));
            } catch (error) {
                alert('Error deleting student');
            }
        }
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/users`, formData);
            setStudents([res.data, ...students]);
            setShowAddModal(false);
            setFormData({ name: '', email: '', password: '', phone: '' });
        } catch (error) {
            alert('Error adding student');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredStudents = Array.isArray(students) ? students.filter(student =>
        (student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Students</h1>
                    <p className="text-gray-400 mt-1">Manage student enrollments and accounts</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                >
                    <Plus size={20} />
                    Add Student
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search students by name or email..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            {/* Students Table */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No students found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-900/80 border-b border-zinc-800 text-gray-400 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Name</th>
                                    <th className="px-6 py-4 font-semibold">Contact</th>
                                    <th className="px-6 py-4 font-semibold">Enrolled Date</th>
                                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {filteredStudents.map((student) => (
                                    <motion.tr
                                        key={student._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-zinc-800/30 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-gray-400 font-bold shrink-0">
                                                    {(student.name || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{student.name || 'Unknown'}</div>
                                                    <div className="text-sm text-gray-500">ID: {String(student._id || '').slice(-6)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 text-sm text-gray-300">
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} className="text-gray-500" />
                                                    {student.email}
                                                </div>
                                                {student.phone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={14} className="text-gray-500" />
                                                        {student.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {new Date(student.createdAt || student.created_at || Date.now()).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* STATUS BADGE/BUTTON */}
                                                <button
                                                    onClick={() => handleToggleApproval(student._id, student.is_approved)}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${student.is_approved
                                                        ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                                        : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                                                        }`}
                                                >
                                                    {student.is_approved ? 'Active' : 'Pending'}
                                                </button>

                                                <button
                                                    onClick={() => openAssignModal(student)}
                                                    className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                                                    title="Assign Course"
                                                >
                                                    <BookOpen size={16} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student._id)}
                                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Student Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl"
                    >
                        <h2 className="text-xl font-bold text-white mb-6">Add New Student</h2>
                        <form onSubmit={handleAddStudent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
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
                                    className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors disabled:opacity-50"
                                >
                                    {submitting ? 'Adding...' : 'Add Student'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Assign Course Modal */}
            {showAssignModal && selectedStudentForAssignment && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl"
                    >
                        <h2 className="text-xl font-bold text-white mb-2">Assign Course</h2>
                        <p className="text-gray-400 mb-6">Assign a course to <span className="text-white font-medium">{selectedStudentForAssignment.name}</span></p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Select Course</label>
                                <select
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                    onChange={(e) => setAssignmentData({ ...assignmentData, course_id: e.target.value })}
                                    value={assignmentData.course_id}
                                >
                                    <option value="">-- Choose a Course --</option>
                                    {availableCourses.map(c => (
                                        <option key={c.id || c._id} value={c.id || c._id}>
                                            {c.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Expiry Date (Optional)</label>
                                <input
                                    type="date"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 [color-scheme:dark]"
                                    value={assignmentData.expires_at}
                                    onChange={e => setAssignmentData({ ...assignmentData, expires_at: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1">Leave blank for lifetime access.</p>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAssignModal(false)}
                                    className="flex-1 py-2 rounded-xl bg-zinc-800 text-gray-300 hover:bg-zinc-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAssignSubmit}
                                    disabled={submitting || !assignmentData.course_id}
                                    className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors disabled:opacity-50"
                                >
                                    {submitting ? 'Assigning...' : 'Assign Course'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default StudentsPage;
