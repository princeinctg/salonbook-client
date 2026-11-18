"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Filter, Clock, ArrowRight, ArrowUpDown, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { INITIAL_SERVICES } from "@/data/initialServices";

const CATEGORIES = [
  "All",
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
];

function BrowseServicesContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("category") || "All";

  const [services, setServices] = useState<any[]>(INITIAL_SERVICES);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [sortOrder, setSortOrder] = useState<"default" | "low-to-high" | "high-to-low">("default");

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/services`);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            setServices(json.data);
          }
        }
      } catch (e) {
        // Fallback to static services
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  // Filter and sort calculation
  const filteredServices = useMemo(() => {
    return services
      .filter((service) => {
        const matchesCategory =
          selectedCategory === "All" || service.category.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch =
          !searchTerm ||
          service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortOrder === "low-to-high") return a.price - b.price;
        if (sortOrder === "high-to-low") return b.price - a.price;
        return 0;
      });
  }, [services, searchTerm, selectedCategory, sortOrder]);

  return (
    <div className="min-h-screen py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C98573]">
          Signature Salon Menu
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#201C1B]">
          Browse Our Services
        </h1>
        <p className="text-[#201C1B]/70 text-sm sm:text-base">
          Filter by category, search by specific treatment, or sort by pricing to curate your visit.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8C5A8]/40 mb-10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="relative md:col-span-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search services (e.g., Haircut, Facial, Balayage)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#C98573] transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="relative md:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#C98573] transition-colors cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div className="relative md:col-span-3">
            <select
              value={sortOrder}
              onChange={(e: any) => setSortOrder(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#C98573] transition-colors cursor-pointer"
            >
              <option value="default">Sort by: Default</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-2 pb-1 text-xs no-scrollbar">
          <span className="text-gray-400 shrink-0 font-medium mr-1">Quick Filter:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full shrink-0 transition-colors font-medium ${
                selectedCategory === cat
                  ? "bg-[#C98573] text-white shadow-sm"
                  : "bg-[#F8F1E8] text-[#201C1B] hover:bg-[#E8C5A8]/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid or Empty State */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#E8C5A8] p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF3F1] flex items-center justify-center text-2xl mb-4">
            🔍
          </div>
          <h3 className="text-lg font-bold text-[#201C1B]">No Services Found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-6">
            We couldn't find any services matching "{searchTerm}". Try clearing your filters or search keywords.
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
              setSortOrder("default");
            }}
            className="bg-[#C98573] text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-[#B86B57]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service._id || index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-[#E8C5A8]/40 transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                <img
                  src={service.image}
                  alt={service.serviceName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 right-3 bg-[#201C1B]/80 backdrop-blur-md text-[#E8C5A8] text-xs font-semibold px-3 py-1 rounded-full border border-[#E8C5A8]/30">
                  {service.category}
                </span>
              </div>

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
                  href={`/services/${service._id || "item-" + index}`}
                  className="w-full mt-4 bg-[#F8F1E8] hover:bg-[#C98573] text-[#201C1B] hover:text-white py-2.5 rounded-xl font-medium text-sm transition-all duration-200 text-center flex items-center justify-center group/btn border border-[#E8C5A8]/50"
                >
                  <span>View Details & Book</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BrowseServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Loading salon services...</div>}>
      <BrowseServicesContent />
    </Suspense>
  );
}
