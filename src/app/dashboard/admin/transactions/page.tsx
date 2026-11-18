"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { CreditCard, Calendar, CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const token = localStorage.getItem("salonbook_token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/dashboard/admin/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          setTransactions(json.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#201C1B]">Stripe Payment Transactions</h1>
          <p className="text-xs text-gray-500 mt-1">
            Audit verified Stripe Checkout sessions and transaction ledgers.
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-[#E8C5A8] text-gray-500">
            No completed Stripe transactions recorded yet.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E8C5A8]/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF6F2] border-b border-[#E8C5A8]/40 uppercase text-gray-500 font-bold tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Related Service</th>
                    <th className="py-4 px-6">Amount</th>
                    <th className="py-4 px-6">Stripe Session ID</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => {
                    const customer = tx.customerId || {};
                    const appt = tx.appointmentId || {};
                    const service = appt.serviceId || {};

                    return (
                      <tr key={tx._id} className="hover:bg-[#FAF6F2]/30 transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-semibold text-gray-900">{customer.name || "Customer"}</span>
                          <div className="text-[10px] text-gray-400">{customer.email}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-medium text-[#201C1B]">
                            {service.serviceName || "Salon Treatment"}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-[#C98573]">
                          {formatPrice(tx.amount)}
                        </td>
                        <td className="py-4 px-6 font-mono text-[10px] text-gray-500 max-w-[180px] truncate">
                          {tx.stripeSessionId}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right text-gray-500">
                          {new Date(tx.createdAt).toLocaleDateString()}
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
