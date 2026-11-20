"use client";

import { getApiBaseUrl } from "@/lib/config";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Calendar, Clock, ArrowRight, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const appointmentId = searchParams.get("appointment_id");

  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyAndLoad() {
      if (!appointmentId) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("salonbook_token");

        // If mock session, trigger simulated webhook/success verification
        if (sessionId && sessionId.startsWith("cs_test_mock")) {
          await fetch(`${getApiBaseUrl()}/payments/simulate-success`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ appointmentId, sessionId }),
          });
        }

        // Fetch refreshed appointment
        const res = await fetch(`${getApiBaseUrl()}/appointments/${appointmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const json = await res.json();
          setAppointment(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    verifyAndLoad();
  }, [appointmentId, sessionId]);

  const service = appointment?.serviceId || {};

  return (
    <div className="min-h-[80vh] py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-[#E8C5A8]/50 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C98573]">
            Transaction Complete
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#201C1B]">
            Payment Confirmed!
          </h1>
          <p className="text-xs text-gray-500">
            Your appointment has been officially confirmed and secured in our salon calendar.
          </p>
        </div>

        {appointment && (
          <div className="bg-[#FAF6F2] p-5 rounded-2xl border border-[#E8C5A8]/40 text-left space-y-3">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>Appointment ID</span>
              <span className="font-mono">{appointment._id}</span>
            </div>
            <div className="border-t border-[#E8C5A8]/30 pt-2">
              <h4 className="font-bold text-sm text-[#201C1B]">{service.serviceName}</h4>
              <p className="text-xs text-gray-500">{service.category}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-700 pt-1">
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-[#C98573]" />
                {appointment.appointmentDate} at {appointment.timeSlot}
              </span>
              <span className="font-bold text-sm text-[#C98573]">
                {formatPrice(appointment.servicePrice)}
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard/customer/appointments"
            className="w-full sm:w-auto bg-[#C98573] hover:bg-[#B86B57] text-white px-6 py-3 rounded-full text-xs font-semibold shadow-md transition-all flex items-center justify-center"
          >
            <span>View My Appointments</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-[#201C1B] px-6 py-3 rounded-full text-xs font-semibold transition-all"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Verifying payment...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
