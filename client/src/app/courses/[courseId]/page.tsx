import React from 'react';
import CourseDetailsClient from './CourseDetailsClient';

// Generate static params to statically generate pages for known courses
export async function generateStaticParams() {
    return [
        { courseId: '1' },
        { courseId: '2' },
        { courseId: '3' },
        { courseId: '4' },
        { courseId: 'demo' }
    ];
}

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;

    return <CourseDetailsClient courseId={courseId} />;
}
