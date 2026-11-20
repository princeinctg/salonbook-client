"use client";

import { getApiBaseUrl } from "@/lib/config";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Calendar, Clock, CheckCircle2, XCircle, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    cancelledAppointments: 0,
    paidAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const token = localStorage.getItem("salonbook_token");
        const res = await fetch(`${getApiBaseUrl()}/dashboard/customer`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          setStats(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <DashboardLayout role="customer">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#201C1B] to-[#302522] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10 space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E8C5A8]">
              Customer Sanctuary
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold">
              Welcome Back, {user?.name}
            </h1>
            <p className="text-sm text-[#F8F1E8]/80">
              Manage your upcoming bookings, complete secure payments for confirmed slots, and curate your salon experience.
            </p>
            <div className="pt-4">
              <Link
                href="/services"
                className="inline-flex items-center space-x-2 bg-[#C98573] hover:bg-[#B86B57] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-md transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Book New Salon Treatment</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Stat Overview Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8C5A8]/50 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Total Requests</p>
              <h3 className="text-2xl font-bold text-[#201C1B] mt-1">{stats.totalRequests}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#F8F1E8] text-[#C98573] flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8C5A8]/50 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Pending Review</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">{stats.pendingAppointments}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8C5A8]/50 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Confirmed</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{stats.confirmedAppointments}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8C5A8]/50 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Cancelled</p>
              <h3 className="text-2xl font-bold text-gray-500 mt-1">{stats.cancelledAppointments}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8C5A8]/50 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-[#201C1B]">View Appointment Schedule</h4>
            <p className="text-xs text-gray-500 mt-0.5">Track status, cancel pending requests, or pay with Stripe.</p>
          </div>
          <Link
            href="/dashboard/customer/appointments"
            className="inline-flex items-center text-xs font-semibold text-[#C98573] hover:text-[#B86B57]"
          >
            <span>Go to My Appointments</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
