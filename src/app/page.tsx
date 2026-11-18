"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Scissors,
  Sparkles,
  CalendarCheck,
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
  HeartHandshake,
  Award,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { INITIAL_SERVICES } from "@/data/initialServices";

const CATEGORIES = [
  { name: "Haircut & Styling", icon: "✂️", desc: "Precision cuts, fades & styling" },
  { name: "Hair Coloring", icon: "🎨", desc: "Balayage, highlights & gloss" },
  { name: "Hair Treatment", icon: "✨", desc: "Keratin, collagen & deep masks" },
  { name: "Facial & Skincare", icon: "🌸", desc: "Hydrafacials, peels & glow" },
  { name: "Makeup", icon: "💄", desc: "Bridal, glam & photo-ready" },
  { name: "Manicure & Pedicure", icon: "💅", desc: "Gel polish & spa treatments" },
  { name: "Spa & Massage", icon: "🌿", desc: "Warm stone & aromatherapy" },
];

export default function HomePage() {
  const [services, setServices] = useState<any[]>(INITIAL_SERVICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/services`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            setServices(json.data);
          }
        }
      } catch (e) {
        // Fallback to rich initial services
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ================= ANIMATION 1: HERO REVEAL ================= */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-[#201C1B] text-white px-4 sm:px-6 lg:px-8">
        {/* Parallax / Subtle Zoom Background */}
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.38 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#E8C5A8]/20 border border-[#E8C5A8]/40 text-[#E8C5A8] text-xs font-semibold uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to the Epitome of Luxury Styling</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight text-white leading-tight"
          >
            Style That <span className="text-[#C98573] italic">Defines</span> You.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl text-[#F8F1E8]/85 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Discover premium grooming and salon experiences. Book your favorite services with ease.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/services"
              className="w-full sm:w-auto bg-[#C98573] hover:bg-[#B86B57] text-white px-8 py-4 rounded-full text-base font-semibold transition-all shadow-lg hover:shadow-[#C98573]/30 flex items-center justify-center group"
            >
              <span>Explore Salon Services</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/sign-up"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-[#F8F1E8] border border-white/20 px-8 py-4 rounded-full text-base font-semibold transition-all backdrop-blur-sm flex items-center justify-center"
            >
              Join SalonBook
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ================= DYNAMIC SECTION 1: FEATURED SERVICES ================= */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C98573]">
            Curated For Distinction
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#201C1B]">
            Featured Salon Services
          </h2>
          <p className="text-[#201C1B]/70 text-sm sm:text-base">
            Handcrafted treatments executed by certified master stylists and aesthetic artists.
          </p>
        </div>

        {/* Service Cards Grid (At least 6 services) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.slice(0, 6).map((service, index) => (
            /* ================= ANIMATION 2: SERVICE CARD HOVER ================= */
            <motion.div
              key={service._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-[#E8C5A8]/40 transition-all duration-300 flex flex-col group"
            >
              {/* Card Image with Zoom */}
              <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                <img
                  src={service.image}
                  alt={service.serviceName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute top-3 right-3 bg-[#201C1B]/80 backdrop-blur-md text-[#E8C5A8] text-xs font-semibold px-3 py-1 rounded-full border border-[#E8C5A8]/30">
                  {service.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-[#C98573]" />
                      {service.duration} mins
                    </span>
                    <span className="font-bold text-lg text-[#C98573]">
                      {formatPrice(service.price)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#201C1B] group-hover:text-[#C98573] transition-colors line-clamp-1">
                    {service.serviceName}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-2 mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <Link
                  href={`/services/${service._id || "featured-" + index}`}
                  className="w-full mt-4 bg-[#F8F1E8] hover:bg-[#C98573] text-[#201C1B] hover:text-white py-2.5 rounded-xl font-medium text-sm transition-all duration-200 text-center flex items-center justify-center group/btn border border-[#E8C5A8]/50"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center text-sm font-semibold text-[#C98573] hover:text-[#B86B57] group"
          >
            <span>View All Exclusive Services</span>
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* ================= DYNAMIC SECTION 2: SERVICE CATEGORIES ================= */}
      <section className="py-20 bg-[#F4ECE3]/50 border-y border-[#E8C5A8]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C98573]">
              Specialized Artistry
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#201C1B]">
              Explore by Service Category
            </h2>
            <p className="text-gray-600 text-sm">
              Discover curated luxury salon suites designed around specific grooming crafts.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {CATEGORIES.map((cat, idx) => (
              <Link
                key={cat.name}
                href={`/services?category=${encodeURIComponent(cat.name)}`}
                className="bg-white p-6 rounded-2xl border border-[#E8C5A8]/50 hover:border-[#C98573] hover:shadow-md transition-all group text-center flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#F8F1E8] group-hover:bg-[#FAF3F1] flex items-center justify-center text-2xl transition-transform group-hover:scale-110">
                  {cat.icon}
                </div>
                <h4 className="font-semibold text-sm text-[#201C1B] group-hover:text-[#C98573] transition-colors">
                  {cat.name}
                </h4>
                <p className="text-[11px] text-gray-500 line-clamp-1">{cat.desc}</p>
              </Link>
            ))}

            {/* Quick All Services Tile */}
            <Link
              href="/services"
              className="bg-[#C98573] p-6 rounded-2xl text-white hover:bg-[#B86B57] transition-all text-center flex flex-col items-center justify-center space-y-3 shadow-md"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
                ✨
              </div>
              <h4 className="font-semibold text-sm">Browse All</h4>
              <p className="text-[11px] text-white/80">View entire collection</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= ADDITIONAL SECTION: WHY CHOOSE SALONBOOK ================= */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C98573]">
              The SalonBook Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#201C1B] leading-snug">
              Elevating Personal Care Into A Refined Artform.
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              We eliminate the friction of salon bookings with real-time slot verification, licensed master stylists, and a dedicated high-touch concierge experience.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-[#FAF3F1] text-[#C98573] flex items-center justify-center shrink-0">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#201C1B] text-sm">Guaranteed Real-Time Slot Locking</h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    No double-bookings or waiting queues. Your selected slot is instantly reserved upon confirmation.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-[#FAF3F1] text-[#C98573] flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#201C1B] text-sm">Master Stylists & Organic Formulations</h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Every service card guarantees premium non-toxic, cruelty-free professional formulas.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-[#FAF3F1] text-[#C98573] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#201C1B] text-sm">Encrypted Stripe Checkout</h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Pay securely only after your appointment is confirmed by the salon administrator.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className="relative">
            <div className="relative h-[480px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1000&q=80"
                alt="Luxury Salon Atmosphere"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E8C5A8]/50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#201C1B]">Customer Rating</p>
                  <div className="flex items-center text-amber-500 text-xs mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="ml-1.5 font-bold text-[#201C1B]">4.98 / 5.0</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">Over 3,500+</span>
                  <p className="text-xs font-bold text-[#C98573]">Verified Bookings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
