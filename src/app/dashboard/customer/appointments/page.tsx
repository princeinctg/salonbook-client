"use client";

import { getApiBaseUrl } from "@/lib/config";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Clock, Calendar, CreditCard, Ban, CheckCircle2, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function CustomerAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadAppointments = async () => {
    try {
      const token = localStorage.getItem("salonbook_token");
      const res = await fetch(`${getApiBaseUrl()}/appointments/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setAppointments(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // Cancel Pending Appointment
  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this pending appointment?")) return;

    setActionLoading(id);
    try {
      const token = localStorage.getItem("salonbook_token");
      const res = await fetch(`${getApiBaseUrl()}/appointments/${id}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to cancel");
      toast.success("Appointment cancelled successfully");
      loadAppointments();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Pay For Confirmed Appointment via Stripe Checkout
  const handlePayNow = async (id: string) => {
    setActionLoading(id);
    try {
      const token = localStorage.getItem("salonbook_token");
      const res = await fetch(`${getApiBaseUrl()}/payments/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ appointmentId: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Payment initiation failed");

      if (data.url) {
        toast.info("Redirecting to secure Stripe Checkout...");
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout role="customer">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#201C1B]">My Appointments</h1>
            <p className="text-xs text-gray-500 mt-1">
              Review your requested dates, confirm status, and complete Stripe payments.
            </p>
          </div>
          <Link
            href="/services"
            className="bg-[#C98573] hover:bg-[#B86B57] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm text-center"
          >
            + Book Another Service
          </Link>
        </div>

        {/* Appointment Cards */}
        {appointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-[#E8C5A8] space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF3F1] text-[#C98573] flex items-center justify-center text-xl">
              📅
            </div>
            <h3 className="text-lg font-bold text-[#201C1B]">No Appointments Yet</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              You haven't booked any salon appointments yet. Explore our luxury menu to reserve a slot.
            </p>
            <Link
              href="/services"
              className="inline-block bg-[#C98573] text-white px-5 py-2 rounded-full text-xs font-semibold"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {appointments.map((appt) => {
              const service = appt.serviceId || {};
              const isPending = appt.status === "Pending";
              const isConfirmed = appt.status === "Confirmed";
              const isCancelled = appt.status === "Cancelled";
              const isPaid = appt.paymentStatus === "Paid";

              return (
                <div
                  key={appt._id}
                  className="bg-white rounded-2xl p-6 border border-[#E8C5A8]/50 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
                >
                  {/* Service info */}
                  <div className="flex items-start space-x-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.serviceName || "Service"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">✂️</div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C98573] bg-[#FAF3F1] px-2 py-0.5 rounded-full">
                        {service.category || "Salon Service"}
                      </span>
                      <h3 className="font-bold text-base text-[#201C1B]">{service.serviceName}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-1">
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-[#C98573]" />
                          {appt.appointmentDate}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-[#C98573]" />
                          {appt.timeSlot}
                        </span>
                        <span className="font-semibold text-[#201C1B]">
                          {formatPrice(appt.servicePrice)}
                        </span>
                      </div>
                      {appt.message && (
                        <p className="text-[11px] text-gray-400 italic pt-1">
                          "{appt.message}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Badges & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0">
                    {/* Status labels */}
                    <div className="flex flex-col items-start sm:items-end space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">Appointment:</span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            isConfirmed
                              ? "bg-emerald-50 text-emerald-700"
                              : isPending
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-400">Payment:</span>
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            isPaid ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {appt.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* Customer Action Buttons */}
                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                      {/* Cancel button: Allowed ONLY for Pending appointments */}
                      {isPending && (
                        <button
                          onClick={() => handleCancel(appt._id)}
                          disabled={actionLoading === appt._id}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors flex items-center"
                        >
                          <Ban className="w-3.5 h-3.5 mr-1" />
                          Cancel
                        </button>
                      )}

                      {/* Pay button: Allowed ONLY for Confirmed & Unpaid appointments */}
                      {isConfirmed && !isPaid && (
                        <button
                          onClick={() => handlePayNow(appt._id)}
                          disabled={actionLoading === appt._id}
                          className="bg-[#C98573] hover:bg-[#B86B57] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center"
                        >
                          <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                          Pay Now
                        </button>
                      )}

                      {isPaid && (
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Booking Secured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
