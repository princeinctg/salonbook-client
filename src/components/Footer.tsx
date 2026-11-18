import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Scissors, MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#201C1B] text-[#F8F1E8] pt-16 pb-12 border-t border-[#302522]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#302522]">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="relative h-12 w-48 bg-white/5 p-1 rounded-lg backdrop-blur-sm">
              <Image
                src="/images/salonbook-logo.png"
                alt="SalonBook Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-[#E8C5A8]/80 leading-relaxed">
              Experience modern luxury grooming and bespoke salon services curated to define your unique personal elegance.
            </p>
            <div className="flex space-x-4 pt-2 text-[#E8C5A8] text-sm">
              <span className="hover:text-[#C98573] cursor-pointer">Instagram</span>
              <span className="hover:text-[#C98573] cursor-pointer">Facebook</span>
              <span className="hover:text-[#C98573] cursor-pointer">Twitter</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold text-white tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-[#E8C5A8]/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">Browse Services</Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-white transition-colors">Sign In</Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-white transition-colors">Create Account</Link>
              </li>
            </ul>
          </div>

          {/* Service Categories */}
          <div>
            <h4 className="text-base font-semibold text-white tracking-wider uppercase mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm text-[#E8C5A8]/80">
              <li>Haircut & Styling</li>
              <li>Hair Coloring & Balayage</li>
              <li>Facial & Skincare</li>
              <li>Manicure & Pedicure</li>
              <li>Spa & Relaxing Massage</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-base font-semibold text-white tracking-wider uppercase mb-4">Contact & Hours</h4>
            <ul className="space-y-3 text-sm text-[#E8C5A8]/80">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#C98573] shrink-0 mt-0.5" />
                <span>450 Prestige Boulevard, Suite 100, Metropolitan District</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#C98573] shrink-0" />
                <span>+1 (800) 555-SALON</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#C98573] shrink-0" />
                <span>appointments@salonbook.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-[#C98573] shrink-0" />
                <span>Mon – Sun: 10:00 AM – 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E8C5A8]/60">
          <p>© {new Date().getFullYear()} SalonBook Platform. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed with Rose Gold & Ivory Elegance.</p>
        </div>
      </div>
    </footer>
  );
}
