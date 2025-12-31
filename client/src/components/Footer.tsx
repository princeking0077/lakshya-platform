'use client';

import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Send } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-zinc-950 text-gray-300 pt-16 border-t border-zinc-900">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">Enlighten<span className="text-blue-500">Pharma</span></h2>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                            India’s leading platform for pharmacy exam preparation. Empowering students to achieve academic and professional excellence.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Instagram, Youtube, Send].map((Icon, idx) => (
                                <a key={idx} href="#" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Explore</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Home</a></li>
                            <li><a href="#courses" className="hover:text-blue-400 transition-colors">All Courses</a></li>
                            <li><a href="#about" className="hover:text-blue-400 transition-colors">About Us</a></li>
                            <li><a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Contact Us</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>Kranti Nagar, Near Nanded Railway Gate, Purna, Dist. Parbhani – 431511</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                                <span>+91-9975900664</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                                <span className="break-all">enlightenpharmaacademy@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Legal</h3>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Terms & Conditions</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Refund Policy</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Copyright Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-zinc-900 py-8 text-center text-sm text-gray-600 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>© 2024 Enlighten Pharma Academy. All rights reserved.</p>
                    <p>Made with ❤️ for Pharmacy Students</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
