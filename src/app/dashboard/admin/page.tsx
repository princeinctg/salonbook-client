"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Users,
  Scissors,
  Calendar,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Plus,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalActiveServices: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    cancelledAppointments: 0,
    totalPaidAppointments: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("salonbook_token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/dashboard/admin`, {
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
    fetchStats();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C98573]">
              Administrative Operations
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#201C1B]">
              SalonBook Executive Suite
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Live salon metrics, appointment approval queue, and customer management.
            </p>
          </div>
          <Link
            href="/dashboard/admin/services/add"
            className="inline-flex items-center space-x-2 bg-[#C98573] hover:bg-[#B86B57] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-md transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </Link>
        </div>

        {/* 6 Required Admin Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8C5A8]/50 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Registered Customers</p>
              <h3 className="text-2xl font-bold text-[#201C1B] mt-1">{stats.totalCustomers}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8C5A8]/50 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Active Menu Services</p>
              <h3 className="text-2xl font-bold text-[#201C1B] mt-1">{stats.totalActiveServices}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FAF3F1] text-[#C98573] flex items-center justify-center">
              <Scissors className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8C5A8]/50 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Total Booking Requests</p>
              <h3 className="text-2xl font-bold text-[#201C1B] mt-1">{stats.totalAppointments}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8C5A8]/50 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Pending Approvals</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1">{stats.pendingAppointments}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8C5A8]/50 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Confirmed Appointments</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{stats.confirmedAppointments}</h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8C5A8]/50 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Total Settled Revenue</p>
              <h3 className="text-2xl font-bold text-[#C98573] mt-1">
                {formatPrice(stats.totalRevenue)}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#F8F1E8] text-[#C98573] flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/admin/appointments"
            className="p-6 bg-white rounded-2xl border border-[#E8C5A8]/50 shadow-sm hover:border-[#C98573] transition-all group"
          >
            <h4 className="font-bold text-sm text-[#201C1B] group-hover:text-[#C98573] transition-colors">
              Manage Appointments
            </h4>
            <p className="text-xs text-gray-500 mt-1">Confirm pending requests or cancel scheduling conflicts.</p>
            <div className="mt-4 flex items-center text-xs font-semibold text-[#C98573]">
              <span>Review Queue</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/dashboard/admin/services"
            className="p-6 bg-white rounded-2xl border border-[#E8C5A8]/50 shadow-sm hover:border-[#C98573] transition-all group"
          >
            <h4 className="font-bold text-sm text-[#201C1B] group-hover:text-[#C98573] transition-colors">
              Service Catalog
            </h4>
            <p className="text-xs text-gray-500 mt-1">Add new offerings, update pricing, or toggle active status.</p>
            <div className="mt-4 flex items-center text-xs font-semibold text-[#C98573]">
              <span>Manage Services</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/dashboard/admin/users"
            className="p-6 bg-white rounded-2xl border border-[#E8C5A8]/50 shadow-sm hover:border-[#C98573] transition-all group"
          >
            <h4 className="font-bold text-sm text-[#201C1B] group-hover:text-[#C98573] transition-colors">
              User Access Control
            </h4>
            <p className="text-xs text-gray-500 mt-1">Audit customer list, check profiles, or block abusive accounts.</p>
            <div className="mt-4 flex items-center text-xs font-semibold text-[#C98573]">
              <span>View Users</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
