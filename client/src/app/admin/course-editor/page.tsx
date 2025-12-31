'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Video, FileText, Trash2, ExternalLink, Save } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

const CourseManagerContent = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [newContent, setNewContent] = useState<any>({ title: '', type: 'video', url: '', folder: '' });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (id) fetchCourse();
    }, [id]);

    const fetchCourse = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/courses/${id}`);
            setCourse(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setNewContent({ ...newContent, url: res.data.data }); // Store relative path
        } catch (error) {
            alert('File upload failed');
        } finally {
            setUploading(false);
        }
    };

    const addContent = async () => {
        if (!newContent.title || !newContent.url) return alert('Please fill all fields');

        try {
            const updatedContent = [...(course.content || []), newContent];

            await axios.put(`${API_BASE_URL}/api/courses/${id}`, {
                content: updatedContent
            });

            setCourse({ ...course, content: updatedContent });
            setNewContent({ title: '', type: 'video', url: '', folder: '' });
            alert('Content Added');
        } catch (error) {
            console.error(error);
            alert('Failed to add content');
        }
    };

    const deleteContent = async (index: number) => {
        if (!confirm('Remove this item?')) return;
        const currentContent = course.content || [];
        const updatedContent = currentContent.filter((_: any, i: number) => i !== index);
        try {
            await axios.put(`${API_BASE_URL}/api/courses/${id}`, {
                content: updatedContent
            });
            setCourse({ ...course, content: updatedContent });
        } catch (error) {
            alert('Failed to delete');
        }
    };

    if (loading) return <div className="p-10 text-white">Loading...</div>;
    if (!course) return <div className="p-10 text-red-400">Error loading course.</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors">
                    <ArrowLeft className="text-gray-400" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white">Manage Content</h1>
                    <p className="text-gray-400 text-sm">{course.title}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Content List */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold text-white">Course Materials</h3>
                    {course.content?.length === 0 && <p className="text-gray-500">No content added yet.</p>}

                    {course.content?.map((item: any, idx: number) => (
                        <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === 'video' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                    {item.type === 'video' ? <Video size={20} /> : <FileText size={20} />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-200">{item.title}</h4>
                                    <a href={item.url} target="_blank" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                                        {item.url} <ExternalLink size={10} />
                                    </a>
                                </div>
                            </div>
                            <button onClick={() => deleteContent(idx)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add New Content Form */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-fit">
                    <h3 className="text-lg font-bold text-white mb-4">Add New Item</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Folder / Subject</label>
                            <input
                                type="text"
                                value={newContent.folder || ''}
                                onChange={(e) => setNewContent({ ...newContent, folder: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                placeholder="e.g. Pharmacology, Anatomy"
                                list="folder-suggestions"
                            />
                            <datalist id="folder-suggestions">
                                {Array.from(new Set((course.content || []).map((c: any) => c.folder).filter(Boolean))).map((f: any) => (
                                    <option key={f} value={f} />
                                ))}
                            </datalist>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Title</label>
                            <input
                                type="text"
                                value={newContent.title}
                                onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                placeholder="Lecture Title"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Type</label>
                            <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800">
                                <button
                                    onClick={() => setNewContent({ ...newContent, type: 'video' })}
                                    className={`flex-1 py-1 text-sm font-medium rounded ${newContent.type === 'video' ? 'bg-zinc-800 text-white' : 'text-gray-500'}`}
                                >
                                    Video
                                </button>
                                <button
                                    onClick={() => setNewContent({ ...newContent, type: 'note' })}
                                    className={`flex-1 py-1 text-sm font-medium rounded ${newContent.type === 'note' ? 'bg-zinc-800 text-white' : 'text-gray-500'}`}
                                >
                                    Note (PDF)
                                </button>
                                <button
                                    onClick={() => setNewContent({ ...newContent, type: 'live' })}
                                    className={`flex-1 py-1 text-sm font-medium rounded ${newContent.type === 'live' ? 'bg-zinc-800 text-white' : 'text-gray-500'}`}
                                >
                                    Live
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Resource</label>

                            {newContent.type === 'note' ? (
                                <div>
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700"
                                    />
                                    {uploading && <p className="text-xs text-yellow-500 mt-1">Uploading...</p>}
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    value={newContent.url}
                                    onChange={(e) => setNewContent({ ...newContent, url: e.target.value })}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    placeholder={newContent.type === 'live' ? "Zoom/Meet Link" : "YouTube URL"}
                                />
                            )}
                        </div>

                        <button
                            onClick={addContent}
                            disabled={!newContent.url || uploading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                        >
                            Add to Course
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CourseManager = () => (
    <Suspense fallback={<div className="p-10 text-white">Loading Editor...</div>}>
        <CourseManagerContent />
    </Suspense>
);

export default CourseManager;
