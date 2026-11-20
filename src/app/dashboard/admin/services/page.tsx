"use client";

import { getApiBaseUrl } from "@/lib/config";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Edit, Trash2, Power, Clock, Search } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadServices = async () => {
    try {
      const token = localStorage.getItem("salonbook_token");
      const res = await fetch(`${getApiBaseUrl()}/services/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setServices(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const token = localStorage.getItem("salonbook_token");
      const res = await fetch(`${getApiBaseUrl()}/services/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      toast.success(`Service marked as ${newStatus}`);
      loadServices();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this service?")) return;
    try {
      const token = localStorage.getItem("salonbook_token");
      const res = await fetch(`${getApiBaseUrl()}/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete service");
      toast.success("Service deleted successfully");
      loadServices();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const filtered = services.filter((s) =>
    s.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
    s.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#201C1B]">Manage Services</h1>
            <p className="text-xs text-gray-500 mt-1">
              Add, update, activate, or remove salon services from the live catalog.
            </p>
          </div>
          <Link
            href="/dashboard/admin/services/add"
            className="inline-flex items-center space-x-2 bg-[#C98573] hover:bg-[#B86B57] text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm text-center"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </Link>
        </div>

        {/* Filter Input */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8C5A8]/50 shadow-sm flex items-center">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search salon catalog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm bg-transparent focus:outline-none"
          />
        </div>

        {/* Table / Cards */}
        <div className="bg-white rounded-2xl border border-[#E8C5A8]/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6F2] border-b border-[#E8C5A8]/40 uppercase text-gray-500 font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6">Service</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Duration</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((service) => (
                  <tr key={service._id} className="hover:bg-[#FAF6F2]/30 transition-colors">
                    <td className="py-4 px-6 flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={service.image}
                          alt={service.serviceName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-semibold text-[#201C1B] max-w-[200px] truncate">
                        {service.serviceName}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{service.category}</td>
                    <td className="py-4 px-6 font-bold text-[#C98573]">
                      {formatPrice(service.price)}
                    </td>
                    <td className="py-4 px-6 text-gray-500">{service.duration} mins</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(service._id, service.status)}
                        className={`inline-flex items-center text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                          service.status === "active"
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        <Power className="w-3 h-3 mr-1" />
                        {service.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        href={`/dashboard/admin/services/${service._id}/edit`}
                        className="inline-flex p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
