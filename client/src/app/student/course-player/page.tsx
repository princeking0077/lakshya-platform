'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, FileText, Download, Lock, ChevronDown, ChevronRight, Folder } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

const CoursePlayerContent = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();
    const [course, setCourse] = useState<any>(null);
    const [activeContent, setActiveContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!id) return;
        const fetchCourse = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/courses/${id}`);
                setCourse(res.data.data);
                if (res.data.data.content && Array.isArray(res.data.data.content) && res.data.data.content.length > 0) {
                    const firstItem = res.data.data.content[0];
                    if (firstItem) {
                        setActiveContent(firstItem);
                        const firstFolder = firstItem.folder || 'Uncategorized';
                        setExpandedFolders({ [firstFolder]: true });
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const toggleFolder = (folder: string) => {
        setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
    };

    if (loading) return <div className="p-10 text-white">Loading...</div>;
    if (!course) return <div className="p-10 text-white">Course not found</div>;

    const isVideo = activeContent?.type === 'video' || activeContent?.type === 'live';

    // Group Content by Folder
    const groupedContent = course.content?.reduce((acc: any, item: any) => {
        const folder = item.folder || 'Uncategorized';
        if (!acc[folder]) acc[folder] = [];
        acc[folder].push(item);
        return acc;
    }, {});

    const folders = Object.keys(groupedContent || {}).sort((a, b) => {
        if (a === 'Uncategorized') return 1;
        if (b === 'Uncategorized') return -1;
        return a.localeCompare(b);
    });

    return (
        <div className="flex flex-col md:flex-row h-screen bg-black overflow-hidden">
            {/* Main Content Area (Player) */}
            <div className="flex-1 flex flex-col pt-16 md:pt-0 relative">
                <button
                    onClick={() => router.back()}
                    className="absolute top-4 left-4 z-50 p-2 bg-black/50 rounded-full text-white md:hidden"
                >
                    <ArrowLeft size={20} />
                </button>

                {activeContent ? (
                    <div className="flex-1 bg-zinc-900 flex items-center justify-center relative">
                        {isVideo ? (
                            activeContent.url.includes('youtube') || activeContent.url.includes('youtu.be') ? (
                                <iframe
                                    src={activeContent.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                    className="w-full h-full"
                                    title={activeContent.title}
                                    allowFullScreen
                                />
                            ) : (
                                <div className="text-center">
                                    <p className="mb-4 text-gray-400">Direct Link / Live Class</p>
                                    <a href={activeContent.url} target="_blank" className="px-6 py-3 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-500">
                                        Open Link
                                    </a>
                                </div>
                            )
                        ) : (
                            <div className="text-center p-10">
                                <FileText size={64} className="mx-auto text-gray-500 mb-4" />
                                <h2 className="text-2xl font-bold text-white mb-2">{activeContent.title}</h2>
                                <p className="text-gray-400 mb-6">Downloadable Resource</p>
                                <a href={`${API_BASE_URL}${activeContent.url}`} target="_blank" download className="px-6 py-3 bg-green-600 rounded-xl text-white font-bold hover:bg-green-500 flex items-center gap-2 mx-auto w-fit">
                                    <Download size={20} /> Download PDF
                                </a>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 bg-zinc-900 flex items-center justify-center text-gray-500">
                        Select a lesson to start learning
                    </div>
                )}

                <div className="p-6 bg-zinc-950 border-t border-zinc-800">
                    <h1 className="text-xl md:text-2xl font-bold text-white max-w-4xl">{activeContent?.title || course.title}</h1>
                    <div className="mt-2 text-sm text-gray-400 flex items-center gap-2">
                        {activeContent?.folder && <span className="bg-zinc-800 px-2 py-1 rounded text-xs">{activeContent.folder}</span>}
                    </div>
                </div>
            </div>

            {/* Sidebar (Playlist) */}
            <div className="w-full md:w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col h-[40vh] md:h-full overflow-y-auto">
                <div className="p-6 border-b border-zinc-800">
                    <h2 className="font-bold text-white">Course Content</h2>
                    <p className="text-xs text-gray-400">{course.content?.length || 0} Lessons</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {/* Check if we only have Uncategorized items (Legacy/Flat Course) */}
                    {folders.length === 1 && folders[0] === 'Uncategorized' ? (
                        <div className="bg-zinc-950/30">
                            {groupedContent['Uncategorized'].map((item: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveContent(item)}
                                    className={`w-full text-left p-4 border-b border-zinc-800 hover:bg-zinc-800 transition-colors flex items-start gap-3 ${activeContent === item ? 'bg-zinc-800 border-l-4 border-l-blue-500' : ''}`}
                                >
                                    <div className="mt-1">
                                        {item.type === 'video' ? <Play size={16} className={activeContent === item ? 'text-blue-400' : 'text-gray-500'} /> : <FileText size={16} className="text-gray-500" />}
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-medium ${activeContent === item ? 'text-white' : 'text-gray-400'}`}>
                                            {item.title}
                                        </h4>
                                        <span className="text-[10px] uppercase text-gray-600 font-bold">{item.type}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        // Folder View
                        folders.map(folder => (
                            <div key={folder} className="border-b border-zinc-800/50">
                                <button
                                    onClick={() => toggleFolder(folder)}
                                    className="w-full px-4 py-3 bg-zinc-900 hover:bg-zinc-800/50 flex items-center justify-between text-left transition-colors"
                                >
                                    <span className="font-bold text-gray-300 text-sm flex items-center gap-2">
                                        <Folder size={14} className="text-blue-500" /> {folder === 'Uncategorized' ? 'General Resources' : folder}
                                    </span>
                                    {expandedFolders[folder] ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
                                </button>

                                {expandedFolders[folder] && (
                                    <div className="bg-zinc-950/30">
                                        {groupedContent[folder].map((item: any, idx: number) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActiveContent(item)}
                                                className={`w-full text-left p-3 pl-8 border-b border-zinc-800/30 hover:bg-zinc-800 transition-colors flex items-start gap-3 ${activeContent === item ? 'bg-zinc-800 border-l-4 border-l-blue-500' : ''}`}
                                            >
                                                <div className="mt-1">
                                                    {item.type === 'video' ? <Play size={14} className={activeContent === item ? 'text-blue-400' : 'text-gray-500'} /> : <FileText size={14} className="text-gray-500" />}
                                                </div>
                                                <div>
                                                    <h4 className={`text-sm font-medium ${activeContent === item ? 'text-white' : 'text-gray-400'}`}>
                                                        {item.title}
                                                    </h4>
                                                    <span className="text-[10px] uppercase text-gray-600 font-bold">{item.type}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}

                    {(!course.content || course.content.length === 0) && (
                        <div className="p-4 text-sm text-gray-500 text-center">No content available</div>
                    )}
                </div>
            </div>
        </div>
    );
};

const CoursePlayer = () => (
    <Suspense fallback={<div className="p-10 text-white">Loading Player...</div>}>
        <CoursePlayerContent />
    </Suspense>
);

export default CoursePlayer;
