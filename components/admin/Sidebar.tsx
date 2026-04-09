"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Package,
  List,
  Layout,
  TrendingUp,
  MessageSquare,
  Users,
  Settings,
  Menu,
  X,
} from "lucide-react";
import HeaderUser from "./HeaderUser";
import HeaderNotifications from "./HeaderNotif";

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [logo, setLogo] = useState(
    "https://zdahzxsipjtwxbraslvb.supabase.co/storage/v1/object/public/JFK%20Assets/logo/jfk_logo.png",
  );

  useEffect(() => {
    fetch("/api/company")
      .then((res) => res.json())
      .then((data) => {
        if (data.company_logo) setLogo(data.company_logo);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsMobileOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const menuItems = [
    { icon: <Home size={18} />, label: "Dashboard", path: "/admin/dashboard" },
    {
      icon: <Package size={18} />,
      label: "Order",
      path: "/admin/order-management",
    },
    {
      icon: <List size={18} />,
      label: "Products",
      path: "/admin/product-management",
    },
    {
      icon: <Layout size={18} />,
      label: "Inventory",
      path: "/admin/inventory-management",
    },
    {
      icon: <TrendingUp size={18} />,
      label: "Reports",
      path: "/admin/sales-report",
    },
    {
      icon: <MessageSquare size={18} />,
      label: "Inquiries",
      path: "/admin/inquiry-management",
    },
    {
      icon: <Users size={18} />,
      label: "Users",
      path: "/admin/user-management",
    },
    {
      icon: <Settings size={18} />,
      label: "Settings",
      path: "/admin/system-settings",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center px-4 z-[55] justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="Logo" className="h-8 w-8 object-contain" />
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-xs text-gray-900">
              Tile and
            </span>
            <span className="font-semibold text-xs text-gray-900">
              Stone Builders
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <HeaderNotifications />
          <HeaderUser />

          {/* Burger */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-900"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-gray-100 transition-all duration-300 ease-in-out z-[65] overflow-hidden shadow-sm flex flex-col
          ${isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
          ${isExpanded ? "lg:w-64" : "lg:w-[68px]"}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-gray-100 shrink-0 ml-1">
          <img
            src={logo}
            alt="Logo"
            className="h-8 w-8 object-contain shrink-0"
          />
          <div
            className={`ml-3 flex flex-col leading-tight transition-all duration-300 overflow-hidden ${isExpanded || isMobileOpen ? "opacity-100 w-40" : "lg:opacity-0 lg:w-0"}`}
          >
            <span className="font-semibold text-xs text-gray-900 whitespace-nowrap">
              Tile and
            </span>
            <span className="font-semibold text-xs text-gray-900 whitespace-nowrap">
              Stone Builders
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col py-3 gap-0.5 px-2 flex-1">
          {menuItems.map((item, idx) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={idx}
                href={item.path}
                className={`flex items-center h-11 rounded-lg transition-all duration-150
                  ${
                    isActive
                      ? "bg-red-600 text-white shadow-sm"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
              >
                <div className="w-[44px] min-w-[44px] flex justify-center items-center shrink-0 pl-2">
                  {item.icon}
                </div>
                <span
                  className={`ml-2 text-sm font-medium whitespace-nowrap transition-all duration-300 ${isExpanded || isMobileOpen ? "opacity-100" : "lg:opacity-0"}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
