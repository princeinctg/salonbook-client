"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  User as UserIcon,
  LogOut,
  Scissors,
  Users,
  CreditCard,
  PlusCircle,
  Home,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "customer" | "admin";
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(`/sign-in?redirect=${pathname}`);
      } else if (user.role !== role) {
        // Redirection based on actual role
        router.push(user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer");
      }
    }
  }, [user, isLoading, role, pathname, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F3EE] text-gray-500">
        Loading dashboard session...
      </div>
    );
  }

  // Navigation Links for Customer
  const customerNav = [
    { name: "Overview", href: "/dashboard/customer", icon: LayoutDashboard },
    { name: "My Appointments", href: "/dashboard/customer/appointments", icon: Calendar },
    { name: "My Profile", href: "/dashboard/customer/profile", icon: UserIcon },
  ];

  // Navigation Links for Admin
  const adminNav = [
    { name: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Services", href: "/dashboard/admin/services", icon: Scissors },
    { name: "Appointments", href: "/dashboard/admin/appointments", icon: Calendar },
    { name: "Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Transactions", href: "/dashboard/admin/transactions", icon: CreditCard },
    { name: "My Profile", href: "/dashboard/admin/profile", icon: UserIcon },
  ];

  const currentNav = role === "admin" ? adminNav : customerNav;

  return (
    <div className="min-h-screen flex bg-[#F7F3EE]">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-[#E8C5A8]/50 flex flex-col shrink-0">
        <div className="p-6 border-b border-[#E8C5A8]/30">
          <Link href="/" className="block">
            <div className="relative h-10 w-44">
              <Image
                src="/images/salonbook-logo.png"
                alt="SalonBook Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <div className="mt-3 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FAF3F1] text-[#C98573] border border-[#C98573]/20">
            {role === "admin" ? "Admin Portal" : "Customer Portal"}
          </div>
        </div>

        {/* Links */}
        <nav className="p-4 flex-grow space-y-1.5">
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#C98573] text-white shadow-sm"
                    : "text-gray-700 hover:bg-[#FAF3F1] hover:text-[#C98573]"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer profile & logout */}
        <div className="p-4 border-t border-[#E8C5A8]/30 space-y-2">
          <div className="flex items-center space-x-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#FAF3F1] border border-[#E8C5A8] flex items-center justify-center font-bold text-xs text-[#C98573]">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-xs font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
            </div>
          </div>

          <Link
            href="/"
            className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-gray-600 hover:text-[#C98573] rounded-lg hover:bg-gray-50"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Public Home</span>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 sm:p-10 max-w-7xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
