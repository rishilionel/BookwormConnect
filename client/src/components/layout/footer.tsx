import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RiFireFill, RiMapPinLine, RiPhoneLine, RiMailLine, RiTimeLine, RiFacebookFill, RiInstagramLine, RiTwitterFill, RiPinterestFill, RiVisaLine, RiMastercardLine, RiPaypalLine, RiHeartFill } from 'react-icons/ri';

export function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would send this to a newsletter service
    alert(`Thank you for subscribing with ${email}! We'll send you updates soon.`);
    setEmail('');
  };

  return (
    <footer className="bg-neutral-dark text-white pt-12 pb-6 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/">
              <a className="flex items-center mb-4">
                <RiFireFill className="text-primary text-3xl mr-2" />
                <h2 className="font-heading font-bold text-2xl">Diwali<span className="text-primary">Delights</span></h2>
              </a>
            </Link>
            <p className="text-white/70 mb-4">Your one-stop shop for all Diwali decorations, gifts, and celebration essentials.</p>
            <div className="flex space-x-4">
              <a href="#" className="bg-white/10 hover:bg-primary w-10 h-10 rounded-full flex items-center justify-center transition duration-300">
                <RiFacebookFill />
              </a>
              <a href="#" className="bg-white/10 hover:bg-primary w-10 h-10 rounded-full flex items-center justify-center transition duration-300">
                <RiInstagramLine />
              </a>
              <a href="#" className="bg-white/10 hover:bg-primary w-10 h-10 rounded-full flex items-center justify-center transition duration-300">
                <RiTwitterFill />
              </a>
              <a href="#" className="bg-white/10 hover:bg-primary w-10 h-10 rounded-full flex items-center justify-center transition duration-300">
                <RiPinterestFill />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-white/70 hover:text-primary transition duration-200">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <a className="text-white/70 hover:text-primary transition duration-200">Shop</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-white/70 hover:text-primary transition duration-200">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-white/70 hover:text-primary transition duration-200">Contact</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-white/70 hover:text-primary transition duration-200">Blog</a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-white/70 hover:text-primary transition duration-200">FAQs</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/category/diyas-candles">
                  <a className="text-white/70 hover:text-primary transition duration-200">Diyas & Candles</a>
                </Link>
              </li>
              <li>
                <Link href="/products/category/home-decorations">
                  <a className="text-white/70 hover:text-primary transition duration-200">Decorative Lights</a>
                </Link>
              </li>
              <li>
                <Link href="/products/category/rangoli-colors">
                  <a className="text-white/70 hover:text-primary transition duration-200">Rangoli Designs</a>
                </Link>
              </li>
              <li>
                <Link href="/products/category/home-decorations">
                  <a className="text-white/70 hover:text-primary transition duration-200">Festive Decor</a>
                </Link>
              </li>
              <li>
                <Link href="/products/category/gift-boxes">
                  <a className="text-white/70 hover:text-primary transition duration-200">Gift Hampers</a>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <a className="text-white/70 hover:text-primary transition duration-200">Puja Essentials</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <RiMapPinLine className="text-primary mt-1 mr-3" />
                <span className="text-white/70">123 Festival Street, Mumbai, Maharashtra, India - 400001</span>
              </li>
              <li className="flex items-center">
                <RiPhoneLine className="text-primary mr-3" />
                <span className="text-white/70">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <RiMailLine className="text-primary mr-3" />
                <span className="text-white/70">info@diwalidelights.com</span>
              </li>
              <li className="flex items-center">
                <RiTimeLine className="text-primary mr-3" />
                <span className="text-white/70">Mon-Sat: 9:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/20 text-center text-white/60 text-sm">
          <div className="mb-4">
            <span>We Accept</span>
            <div className="flex justify-center space-x-3 mt-2">
              <RiVisaLine className="text-2xl" />
              <RiMastercardLine className="text-2xl" />
              <RiPaypalLine className="text-2xl" />
              <span className="text-2xl">Amazon</span>
              <span className="text-2xl">GPay</span>
            </div>
          </div>
          <p>&copy; {new Date().getFullYear()} DiwaliDelights. All rights reserved. Designed with <RiHeartFill className="inline text-primary" /> for the festival of lights.</p>
        </div>
      </div>
    </footer>
  );
}
