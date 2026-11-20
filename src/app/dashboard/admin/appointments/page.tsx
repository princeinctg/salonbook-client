"use client";

import { getApiBaseUrl } from "@/lib/config";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Calendar, Clock, Check, X, ShieldCheck, User } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadAppointments = async () => {
    try {
      const token = localStorage.getItem("salonbook_token");
      const res = await fetch(`${getApiBaseUrl()}/appointments/admin/all`, {
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

  const handleUpdateStatus = async (id: string, status: "Confirmed" | "Cancelled") => {
    setActionLoading(id);
    try {
      const token = localStorage.getItem("salonbook_token");
      const res = await fetch(`${getApiBaseUrl()}/appointments/admin/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to set status to ${status}`);

      toast.success(`Appointment marked as ${status}`);
      loadAppointments();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#201C1B]">Manage Appointments</h1>
          <p className="text-xs text-gray-500 mt-1">
            Review customer bookings, confirm available slots, or cancel requests.
          </p>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-[#E8C5A8] text-gray-500">
            No customer appointments submitted yet.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8C5A8]/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF6F2] border-b border-[#E8C5A8]/40 uppercase text-gray-500 font-bold tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Service</th>
                    <th className="py-4 px-6">Date & Slot</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Appt Status</th>
                    <th className="py-4 px-6">Payment</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {appointments.map((appt) => {
                    const customer = appt.customerId || {};
                    const service = appt.serviceId || {};
                    const isPending = appt.status === "Pending";
                    const isConfirmed = appt.status === "Confirmed";

                    return (
                      <tr key={appt._id} className="hover:bg-[#FAF6F2]/30 transition-colors">
                        {/* Customer */}
                        <td className="py-4 px-6">
                          <div className="font-semibold text-gray-900">{customer.name || "Customer"}</div>
                          <div className="text-[10px] text-gray-400">{customer.email}</div>
                          {customer.phone && (
                            <div className="text-[10px] text-gray-400">{customer.phone}</div>
                          )}
                        </td>

                        {/* Service */}
                        <td className="py-4 px-6">
                          <span className="font-semibold text-[#201C1B]">
                            {service.serviceName || "Salon Service"}
                          </span>
                          <div className="text-[10px] text-[#C98573]">{service.category}</div>
                        </td>

                        {/* Date & Slot */}
                        <td className="py-4 px-6">
                          <div className="flex items-center text-gray-700 font-medium">
                            <Calendar className="w-3.5 h-3.5 mr-1 text-[#C98573]" />
                            {appt.appointmentDate}
                          </div>
                          <div className="flex items-center text-gray-400 text-[11px] mt-0.5">
                            <Clock className="w-3 h-3 mr-1" />
                            {appt.timeSlot}
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-6 font-bold text-[#C98573]">
                          {formatPrice(appt.servicePrice)}
                        </td>

                        {/* Appointment Status */}
                        <td className="py-4 px-6">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                              isConfirmed
                                ? "bg-emerald-50 text-emerald-700"
                                : isPending
                                ? "bg-amber-50 text-amber-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {appt.status}
                          </span>
                        </td>

                        {/* Payment */}
                        <td className="py-4 px-6">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              appt.paymentStatus === "Paid"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {appt.paymentStatus}
                          </span>
                        </td>

                        {/* Actions: Confirm (Only if Pending), Cancel */}
                        <td className="py-4 px-6 text-right space-x-1.5">
                          {isPending && (
                            <button
                              onClick={() => handleUpdateStatus(appt._id, "Confirmed")}
                              disabled={actionLoading === appt._id}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
                            >
                              Confirm
                            </button>
                          )}
                          {appt.status !== "Cancelled" && (
                            <button
                              onClick={() => handleUpdateStatus(appt._id, "Cancelled")}
                              disabled={actionLoading === appt._id}
                              className="px-2.5 py-1 rounded-lg border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
