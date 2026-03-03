'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, Package, List, Layout, TrendingUp, 
  MessageSquare, Users, Settings, Menu, X 
} from 'lucide-react';

const logo = "https://zdahzxsipjtwxbraslvb.supabase.co/storage/v1/object/public/JFK%20Assets/logo/jfk_logo.png";

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { icon: <Home size={24} />, label: 'Dashboard', path: '/admin' },
    { icon: <Package size={24} />, label: 'Order', path: '/admin/order-management' },
    { icon: <List size={24} />, label: 'Products', path: '/admin/product-management' },
    { icon: <Layout size={24} />, label: 'Inventory', path: '/admin/inventory-management' },
    { icon: <TrendingUp size={24} />, label: 'Reports', path: '/admin/sales-report' },
    { icon: <MessageSquare size={24} />, label: 'Inquiries', path: '/admin/inquiry-management' },
    { icon: <Users size={24} />, label: 'Users', path: '/admin/user-management' },
    { icon: <Settings size={24} />, label: 'Settings', path: '/admin/system-settings' },
  ];

  return (
    <>
      {/* --- MOBILE OVERLAY --- */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* --- MOBILE TOP BAR --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-white border-b flex items-center px-4 z-[55] justify-between">
        <div className="flex items-center gap-2">
           <img src={logo} alt="Logo" className="h-12 w-12 object-contain" />
           <div className="flex flex-col">
            <span className="font-semibold text-sm">Tile and</span>
            <span className="font-semibold text-sm">Stone Builders</span>
           </div>
        </div>
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-[#050F24]">
          {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* --- SIDEBAR --- */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white transition-all duration-300 ease-in-out z-[65] shadow-lg overflow-hidden
          ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
          ${isExpanded ? 'lg:w-64' : 'lg:w-20'}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex items-center h-24 w-full px-4 shrink-0">
          <img src={logo} alt="Logo" className="h-12 w-12 object-contain shrink-0" />
          <div className={`ml-3 flex flex-col leading-none transition-opacity duration-300 ${isExpanded || isMobileOpen ? 'opacity-100' : 'lg:opacity-0'}`}>
            <span className="font-semibold text-[#050F24] text-md whitespace-nowrap mb-1">Tile and</span>
            <span className="font-semibold text-[#050F24] text-md whitespace-nowrap">Stone Builders</span>
          </div>
        </div>

        <nav className="flex flex-col w-full h-[calc(100vh-6rem)]">
          {menuItems.map((item, idx) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={idx}
                href={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center transition-all duration-200 w-full h-14 lg:h-16
                  ${isActive ? 'bg-[#DF2025] text-white' : 'text-[#050F24] hover:bg-gray-100'}`}
              >
                <div className="w-20 min-w-[80px] flex justify-center items-center shrink-0">
                  {item.icon}
                </div>
                <span className={`font-semibold text-md whitespace-nowrap transition-opacity duration-300 ${isExpanded || isMobileOpen ? 'opacity-100' : 'lg:opacity-0'}`}>
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