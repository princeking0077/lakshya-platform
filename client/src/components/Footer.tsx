'use client';

import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-zinc-950 text-gray-300 pt-16 border-t border-zinc-900">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">LAKSHYA</h2>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            Empowering pharmacy students to achieve their dreams through structured learning, expert guidance, and consistent practice.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                                <a key={idx} href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Home</a></li>
                            <li><a href="#courses" className="hover:text-blue-400 transition-colors">Courses</a></li>
                            <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
                            <li><a href="#how-it-works" className="hover:text-blue-400 transition-colors">Success Stories</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>123 Education Hub, Pune, Maharashtra 411001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>support@lakshya.edu.in</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Newsletter</h3>
                        <p className="text-sm text-gray-500 mb-4">Subscribe to get updates on new batches and exam notifications.</p>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 rounded-md text-white hover:bg-blue-500 transition-transform group-focus-within:translate-x-1">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-zinc-900 py-8 text-center text-sm text-gray-600 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>© 2024 LAKSHYA Academy. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
