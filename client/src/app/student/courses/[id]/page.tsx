'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, FileText, Download, Lock } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

const CoursePlayer = () => {
    const params = useParams();
    const router = useRouter();
    const [course, setCourse] = useState<any>(null);
    const [activeContent, setActiveContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/courses/${params.id}`);
                setCourse(res.data.data);
                if (res.data.data.content && res.data.data.content.length > 0) {
                    setActiveContent(res.data.data.content[0]);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [params.id]);

    if (loading) return <div className="p-10 text-white">Loading...</div>;
    if (!course) return <div className="p-10 text-white">Course not found</div>;

    const isVideo = activeContent?.type === 'video' || activeContent?.type === 'live';

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
                </div>
            </div>

            {/* Sidebar (Playlist) */}
            <div className="w-full md:w-96 bg-zinc-900 border-l border-zinc-800 flex flex-col h-[40vh] md:h-full overflow-y-auto">
                <div className="p-6 border-b border-zinc-800">
                    <h2 className="font-bold text-white">Course Content</h2>
                    <p className="text-xs text-gray-400">{course.content?.length || 0} Lessons</p>
                </div>
                <div>
                    {course.content?.map((item: any, idx: number) => (
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
                    {(!course.content || course.content.length === 0) && (
                        <div className="p-4 text-sm text-gray-500 text-center">No content available</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoursePlayer;
