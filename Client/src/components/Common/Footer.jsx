import React from 'react';
import {
    Facebook, Twitter, Instagram, Linkedin, Youtube,
    MapPin, Phone, Mail,
    Home,Contact,
    HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-green-400">GreenBasket</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                        Your trusted destination for fresh groceries and household essentials. Fast delivery & unbeatable quality.
                    </p>
                    <div className="flex space-x-4 pt-2">
                        <Link to="https://facebook.com" className="text-gray-300 hover:text-green-400 transition-colors duration-300">
                            <Facebook size={20} />
                        </Link>
                        <Link to="https://instagram.com" className="text-gray-300 hover:text-green-400 transition-colors duration-300">
                            <Instagram size={20} />
                        </Link>
                        <Link to="https://linkedin.com" className="text-gray-300 hover:text-green-400 transition-colors duration-300">
                            <Linkedin size={20} />
                        </Link>
                        <Link to="https://youtube.com" className="text-gray-300 hover:text-green-400 transition-colors duration-300">
                            <Youtube size={20} />
                        </Link>
                    </div>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-4 text-green-400 flex items-center">
                        <Home className="mr-2 h-5 w-5" /> Quick Links
                    </h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            Home</Link></li>
                        <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            Shop</Link></li>
                        <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            Categories</Link></li>
                        <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            About Us</Link></li>
                        <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-lg font-semibold mb-4 text-green-400 flex items-center">
                        <HelpCircle className="mr-2 h-5 w-5" /> Customer Service
                    </h4>
                    <ul className="space-y-3 text-sm">
                        <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            FAQs</Link></li>
                        <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            Return Policy</Link></li>
                        <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            Shipping Info</Link></li>
                        <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            Privacy Policy</Link></li>
                        <li><Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            Terms & Conditions</Link></li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-green-400 flex items-center">
                            <Contact className="mr-2 h-5 w-5" /> Contact Us
                        </h4>
                        <div className="space-y-3 text-sm text-gray-300">
                            <p className="flex items-start">
                                <MapPin className="w-4 h-4 mt-1 mr-2 text-green-400" />
                                <span>123 Main Street, Kolkata, WB</span>
                            </p>
                            <p className="flex items-center">
                                <Phone className="w-4 h-4 mr-2 text-green-400" />
                                +91 1234567890
                            </p>
                            <p className="flex items-center">
                                <Mail className="w-4 h-4 mr-2 text-green-400" />
                                help@greenbusket.com
                            </p>
                        </div>
                    </div>

                    
                </div>
            </div>

            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p>© {new Date().getFullYear()} GreenBasket. All rights reserved.</p>
                    <p className="mt-2">Designed By ~Avijit</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;