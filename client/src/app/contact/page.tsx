'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Send } from 'lucide-react';

const ContactPage = () => {
    return (
        <main className="min-h-screen bg-black text-white pt-24 pb-16">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center mb-20"
                >
                    <h1 className="text-5xl md:text-6xl font-black mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-gray-400">
                        Have questions? We're here to help you start your journey.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <h2 className="text-3xl font-bold mb-8">Contact Information</h2>

                        <div className="flex items-start gap-6 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                            <div className="p-4 rounded-xl bg-blue-500/10 text-blue-500">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Our Location</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Enlighten Pharma Academy,<br />
                                    Kranti Nagar, Near Nanded Railway Gate,<br />
                                    Purna, Dist. Parbhani – 431511
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                            <div className="p-4 rounded-xl bg-purple-500/10 text-purple-500">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Phone Number</h3>
                                <p className="text-gray-400">+91-9975900664</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                            <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-500">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-2">Email Address</h3>
                                <p className="text-gray-400 break-all">enlightenpharmaacademy@gmail.com</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-zinc-900/30 p-8 md:p-10 rounded-3xl border border-zinc-800"
                    >
                        <h2 className="text-3xl font-bold mb-8">Send us a Message</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                    <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="John Doe" />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                    <input type="email" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="john@example.com" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                                <input type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="Course Enquiry..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                                <textarea rows={4} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none" placeholder="Tell us more..." />
                            </div>
                            <button type="button" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                                Send Message
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </main>
    );
};

export default ContactPage;
