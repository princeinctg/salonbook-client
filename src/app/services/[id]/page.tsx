"use client";

import { getApiBaseUrl } from "@/lib/config";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Clock, Calendar, ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import { INITIAL_SERVICES } from "@/data/initialServices";

const TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Form fields
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");

  // Min date today
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    async function loadService() {
      try {
        const res = await fetch(`${getApiBaseUrl()}/services/${id}`);
        if (res.ok) {
          const json = await res.json();
          setService(json.data);
        } else {
          // Fallback to initial services if matched or mock
          const matched = INITIAL_SERVICES.find((s, idx) => (s as any)._id === id || `featured-${idx}` === id || `item-${idx}` === id);
          if (matched) {
            setService(matched);
          } else {
            setService(INITIAL_SERVICES[0]);
          }
        }
      } catch (e) {
        setService(INITIAL_SERVICES[0]);
      } finally {
        setLoading(false);
      }
    }
    loadService();
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in as a customer to book an appointment");
      router.push(`/sign-in?redirect=/services/${id}`);
      return;
    }

    if (user.role === "admin") {
      toast.error("Administrators cannot book customer appointments. Please use a customer account.");
      return;
    }

    if (!appointmentDate) {
      toast.error("Please select an appointment date");
      return;
    }

    if (!timeSlot) {
      toast.error("Please select an available time slot");
      return;
    }

    setBookingLoading(true);

    try {
      const res = await fetch(`${getApiBaseUrl()}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("salonbook_token")}`,
        },
        body: JSON.stringify({
          serviceId: service._id || "6afd2ffa6c1c0387b5ba26ec", // fallback valid ObjectId if mock
          appointmentDate,
          timeSlot,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to book appointment");
      }

      toast.success("Appointment request placed successfully! Pending admin confirmation.");
      router.push("/dashboard/customer/appointments");
    } catch (err: any) {
      toast.error(err.message || "Could not book slot");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        Loading service details...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Service Not Found</h2>
        <Link href="/services" className="text-[#C98573] underline">
          Return to Browse Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        href="/services"
        className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-[#C98573] mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Services
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Service Details View */}
        <div className="lg:col-span-7 space-y-8">
          <div className="relative h-[420px] w-full rounded-3xl overflow-hidden shadow-lg border border-[#E8C5A8]/40">
            <img
              src={service.image}
              alt={service.serviceName}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-[#201C1B]/80 backdrop-blur-md text-[#E8C5A8] text-xs font-semibold px-4 py-1.5 rounded-full border border-[#E8C5A8]/30">
              {service.category}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center text-xs font-medium text-gray-500 bg-[#F8F1E8] px-3 py-1 rounded-full border border-[#E8C5A8]/50">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-[#C98573]" />
                Estimated Duration: {service.duration} Minutes
              </span>
              <span className="text-3xl font-serif font-bold text-[#C98573]">
                {formatPrice(service.price)}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#201C1B]">
              {service.serviceName}
            </h1>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {service.description}
            </p>
          </div>

          {/* Luxury Inclusions */}
          <div className="p-6 rounded-2xl bg-white border border-[#E8C5A8]/50 space-y-3">
            <h4 className="text-sm font-bold text-[#201C1B] uppercase tracking-wider">
              Experience Inclusions
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-[#C98573] mr-2 shrink-0" />
                Personalized Consultation with Stylist
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-[#C98573] mr-2 shrink-0" />
                Organic Botanical Scalp or Skin Prep
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-[#C98573] mr-2 shrink-0" />
                Complimentary Herbal Infusion Beverage
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-[#C98573] mr-2 shrink-0" />
                Professional Finishing & Maintenance Advice
              </li>
            </ul>
          </div>
        </div>

        {/* Appointment Booking Panel */}
        <div className="lg:col-span-5">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-[#E8C5A8]/50 sticky top-28 space-y-6">
            <div>
              <h3 className="text-xl font-serif font-bold text-[#201C1B]">Book Your Appointment</h3>
              <p className="text-xs text-gray-500 mt-1">
                Select your preferred date and time slot. No payment is required until confirmed.
              </p>
            </div>

            <form onSubmit={handleBooking} className="space-y-5">
              {/* Date Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                  Appointment Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={today}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#C98573] transition-colors bg-[#FAF6F2]/40"
                  />
                </div>
              </div>

              {/* Predefined Time Slots */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                  Select Time Slot
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setTimeSlot(slot)}
                      className={`py-2 px-1 text-xs font-medium rounded-lg border transition-all text-center ${
                        timeSlot === slot
                          ? "bg-[#C98573] text-white border-[#C98573] shadow-sm"
                          : "bg-white border-gray-200 text-[#201C1B] hover:border-[#C98573]"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Message */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                  Special Notes / Preferences (Optional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g., Specific styling reference, allergies, or request..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#C98573] transition-colors"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full bg-[#C98573] hover:bg-[#B86B57] text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60"
              >
                {bookingLoading ? "Reserving Slot..." : "Request Appointment"}
              </button>

              <div className="flex items-center justify-center text-[11px] text-gray-500 space-x-1.5 pt-2">
                <ShieldCheck className="w-4 h-4 text-[#C98573]" />
                <span>Zero upfront charge. Pay securely with Stripe after confirmation.</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
