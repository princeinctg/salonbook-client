"use client";

import { getApiBaseUrl } from "@/lib/config";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Users, Shield, ShieldAlert, CheckCircle, Ban, Search } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("salonbook_token");
      const res = await fetch(`${getApiBaseUrl()}/dashboard/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setUsers(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleBlock = async (id: string, currentBlocked: boolean) => {
    const action = currentBlocked ? "unblock" : "block";
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      const token = localStorage.getItem("salonbook_token");
      const res = await fetch(`${getApiBaseUrl()}/dashboard/admin/users/${id}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isBlocked: !currentBlocked }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Failed to ${action} user`);

      toast.success(`User has been ${!currentBlocked ? "blocked" : "unblocked"}`);
      loadUsers();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#201C1B]">Manage Customers</h1>
          <p className="text-xs text-gray-500 mt-1">
            Audit registered accounts, check booking compliance, and enforce user access control.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8C5A8]/50 shadow-sm flex items-center">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm bg-transparent focus:outline-none"
          />
        </div>

        <div className="bg-white rounded-2xl border border-[#E8C5A8]/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6F2] border-b border-[#E8C5A8]/40 uppercase text-gray-500 font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((user) => (
                  <tr key={user._id} className="hover:bg-[#FAF6F2]/30 transition-colors">
                    <td className="py-4 px-6 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-[#FAF3F1] border border-[#E8C5A8] flex items-center justify-center font-bold text-xs text-[#C98573]">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>
                      <span className="font-semibold text-gray-900">{user.name}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                    <td className="py-4 px-6 text-gray-500">{user.phone || "—"}</td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          user.isBlocked ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {user.isBlocked ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          user.isBlocked
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "border border-red-200 text-red-600 hover:bg-red-50"
                        }`}
                      >
                        {user.isBlocked ? "Unblock User" : "Block User"}
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
