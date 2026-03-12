import React from 'react';
import Logo from '../assets/icon/run_life.jpg';
import { Icon } from "@iconify/react";
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="bg-white border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-10 mt-auto">
            <div className="max-w-screen-2xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand Section */}
                    <div className="flex flex-col gap-4">
                        <div className="w-40 cursor-pointer" onClick={() => navigate('/')}>
                            <img src={Logo} alt="Logo" className="w-full object-contain" />
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Discover and join exciting running activities in your community. Track your progress and connect with fellow runners.
                        </p>
                    </div>

                    {/* Links Section */}
                    <div>
                        <h3 className="text-gray-800 font-bold mb-6 text-lg">Quick Links</h3>
                        <ul className="space-y-4">
                            <li>
                                <button onClick={() => navigate('/')} className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer text-sm">
                                    Home
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate('/myActivity')} className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer text-sm">
                                    My Activity
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate('/createActivity')} className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer text-sm">
                                    Create Activity
                                </button>
                            </li>
                            <li>
                                <button onClick={() => navigate('/myProfile')} className="text-gray-600 hover:text-blue-500 transition-colors cursor-pointer text-sm">
                                    My Profile
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Contact & Social Section */}
                    <div>
                        <h3 className="text-gray-800 font-bold mb-6 text-lg">Contact</h3>
                        <div className="flex flex-col gap-4 mb-6">
                            <div className="flex items-center gap-3 text-gray-600 text-sm">
                                <Icon icon="mdi:email-outline" className="text-xl text-blue-500" />
                                <span>bankok44man@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 text-sm">
                                <Icon icon="mdi:phone-outline" className="text-xl text-blue-500" />
                                <span>0991705151</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/narongrat.kaenmuaug/" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all duration-300">
                                <Icon icon="mdi:facebook" className="text-2xl" />
                            </a>
                            <a href="https://www.instagram.com/banknk_14/" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-pink-50 hover:text-pink-500 transition-all duration-300">
                                <Icon icon="mdi:instagram" className="text-2xl" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-xs text-center md:text-left">
                        © {new Date().getFullYear()} Activity Run. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
