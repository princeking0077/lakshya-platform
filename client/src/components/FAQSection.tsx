'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        question: "Do I need prior experience to take your courses?",
        answer: "Not at all! Our pharmacy courses are designed for beginners as well as advanced learners. We start from the basics and build up to complex concepts."
    },
    {
        question: "How long do I have access to the course materials?",
        answer: "Access duration depends on the specific course — available till course completion or as per the plan (regular, extended, or lifetime). You can check the specific course details for validity."
    },
    {
        question: "Can I ask questions or get live support during the course?",
        answer: "Yes, live doubt sessions and discussion groups are available. Our expert tutors are always ready to help you clear your concepts."
    },
    {
        question: "Can I get a refund after enrolling?",
        answer: "We follow a no-refund policy once a course is purchased, as all study materials and content are instantly accessible after enrollment. We recommend checking the course preview before purchasing."
    }
];

const FAQSection = () => {
    return (
        <section className="py-24 bg-zinc-950 text-white relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        Frequently Asked <span className="text-blue-500">Questions</span>
                    </h2>
                    <p className="text-gray-400">
                        Everything you need to know about the product and billing.
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <FAQItem key={idx} faq={faq} index={idx} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const FAQItem = ({ faq, index }: { faq: any, index: number }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`border border-zinc-800 rounded-2xl bg-zinc-900/30 overflow-hidden ${isOpen ? 'border-blue-500/50 bg-zinc-900/50' : 'hover:border-zinc-700'}`}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-6 flex items-center justify-between text-left focus:outline-none"
            >
                <span className={`text-lg font-medium pr-8 transition-colors ${isOpen ? 'text-blue-400' : 'text-gray-200'}`}>
                    {faq.question}
                </span>
                <span className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-gray-400'}`}>
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-zinc-800/50 pt-4">
                            {faq.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default FAQSection;
