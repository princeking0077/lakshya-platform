import React from 'react';
import { notFound } from 'next/navigation';

const legalContent: Record<string, { title: string; content: React.ReactNode }> = {
    'terms': {
        title: "Terms & Conditions",
        content: (
            <div className="space-y-4">
                <p>Welcome to Enlighten Pharma Academy. By accessing our platform, you agree to these terms.</p>
                <h3 className="text-xl font-bold text-white mt-6">1. Course Enrollment</h3>
                <p>Enrollment in our courses is personal and non-transferable. You agree not to share your login credentials.</p>
                <h3 className="text-xl font-bold text-white mt-6">2. Intellectual Property</h3>
                <p>All materials provided are the intellectual property of Enlighten Pharma Academy. Unauthorized distribution is prohibited.</p>
            </div>
        )
    },
    'privacy': {
        title: "Privacy Policy",
        content: (
            <div className="space-y-4">
                <p>Your privacy is important to us. This policy outlines how we collect and use your data.</p>
                <h3 className="text-xl font-bold text-white mt-6">Data Collection</h3>
                <p>We collect basic information like name, email, and phone number for course registration purposes.</p>
            </div>
        )
    },
    'refund': {
        title: "Refund & Cancellation Policy",
        content: (
            <div className="space-y-4">
                <p>We follow a strictly defined refund policy to ensure fairness.</p>
                <h3 className="text-xl font-bold text-white mt-6">No Refund Policy</h3>
                <p>Once a course is purchased and content access is granted, we do not offer any refunds. Please review the course details carefully before purchasing.</p>
            </div>
        )
    },
    'copyright': {
        title: "Copyright Policy",
        content: (
            <div className="space-y-4">
                <p>Enlighten Pharma Academy reserves all rights to the content on this platform.</p>
                <p>Any reproduction or redistribution of materials without permission is strictly prohibited and legal action may be taken.</p>
            </div>
        )
    },
    'data-policy': {
        title: "User Data Policy",
        content: (
            <div className="space-y-4">
                <p>Compliant with the Information Technology Act, 2000 (India).</p>
                <p>We implement reasonable security practices to protect your sensitive personal data.</p>
            </div>
        )
    }
};

// Generate static params for export
export async function generateStaticParams() {
    return Object.keys(legalContent).map((slug) => ({
        slug: slug,
    }));
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const data = legalContent[slug];

    if (!data) {
        return notFound();
    }

    return (
        <main className="min-h-screen bg-black text-white pt-24 pb-16">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-12 text-blue-500">{data.title}</h1>
                <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                    {data.content}
                </div>
            </div>
        </main>
    );
}
