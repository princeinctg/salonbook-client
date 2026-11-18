"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[80vh] py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-[#E8C5A8]/50 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm">
          <AlertCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-bold text-[#201C1B]">
            Payment Cancelled
          </h1>
          <p className="text-xs text-gray-500">
            You were not charged. Your confirmed appointment remains held in your dashboard, ready for payment whenever you wish.
          </p>
        </div>

        <div className="pt-2 flex flex-col space-y-2">
          <Link
            href="/dashboard/customer/appointments"
            className="w-full bg-[#C98573] hover:bg-[#B86B57] text-white py-3 rounded-full text-xs font-semibold shadow-md transition-all flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Return to My Appointments</span>
          </Link>
          <Link
            href="/"
            className="w-full py-2.5 text-xs text-gray-500 hover:text-gray-700"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
