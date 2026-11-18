"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User as UserIcon, LogOut, LayoutDashboard, Menu, X, Scissors } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Hide Navbar in dashboards if desired, or keep consistent
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-50 bg-[#F7F3EE]/95 backdrop-blur-md border-b border-[#E8C5A8]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* SalonBook Transparent Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative h-12 w-48 transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/salonbook-logo.png"
              alt="SalonBook Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className={`text-sm font-medium tracking-wide transition-colors ${
              pathname === "/" ? "text-[#C98573] font-semibold" : "text-[#201C1B] hover:text-[#C98573]"
            }`}
          >
            Home
          </Link>
          <Link
            href="/services"
            className={`text-sm font-medium tracking-wide transition-colors ${
              pathname.startsWith("/services") ? "text-[#C98573] font-semibold" : "text-[#201C1B] hover:text-[#C98573]"
            }`}
          >
            Browse Services
          </Link>

          {/* User authenticated vs unauthenticated */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-[#F8F1E8] border border-[#E8C5A8] px-3.5 py-1.5 rounded-full hover:border-[#C98573] transition-all"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-[#E8C5A8]/50 flex items-center justify-center text-[#201C1B] font-semibold text-xs">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-sm font-medium text-[#201C1B] max-w-[120px] truncate">{user.name}</span>
              </button>

              {/* Profile Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-[#E8C5A8]/40 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-[#F7F3EE]">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="text-sm font-semibold text-[#201C1B] truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF3F1] text-[#C98573]">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    href={user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer"}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-[#201C1B] hover:bg-[#FAF3F1] hover:text-[#C98573] transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>

                  <Link
                    href={user.role === "admin" ? "/dashboard/admin/profile" : "/dashboard/customer/profile"}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-[#201C1B] hover:bg-[#FAF3F1] hover:text-[#C98573] transition-colors"
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-[#201C1B] hover:text-[#C98573] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-[#C98573] hover:bg-[#B86B57] text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm hover:shadow"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-[#201C1B] hover:text-[#C98573]"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E8C5A8]/30 bg-white/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#201C1B] hover:text-[#C98573]"
          >
            Home
          </Link>
          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#201C1B] hover:text-[#C98573]"
          >
            Browse Services
          </Link>

          {user ? (
            <div className="pt-4 border-t border-gray-100 space-y-2">
              <div className="text-xs text-gray-500">Signed in as {user.name} ({user.role})</div>
              <Link
                href={user.role === "admin" ? "/dashboard/admin" : "/dashboard/customer"}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-[#C98573]"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="block text-base font-medium text-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-gray-100 flex flex-col space-y-2">
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 text-sm font-medium text-[#201C1B]"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center bg-[#C98573] text-white py-2.5 rounded-full text-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
