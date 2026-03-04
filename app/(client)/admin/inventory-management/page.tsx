'use client';

import React from "react";
import MetricCard from '@/components/admin/dashboard/MetricCard';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { Search, BookMarked, AlertTriangle, CircleSlash2, Calendar } from 'lucide-react';
import 'react-day-picker/dist/style.css';
import HeaderUser from "@/components/admin/HeaderUser";
import HeaderNotifications from "@/components/admin/HeaderNotif";

const InventoryManagement: React.FC = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const products = [
    { id: 1, name: "Product Name", type: "Product Type", quantity: 150, latestInbound: "Mar 25, 2025" },
    { id: 2, name: "Product Name", type: "Product Type", quantity: 80, latestInbound: "Jan 17, 2025" },
    { id: 3, name: "Product Name", type: "Product Type", quantity: 96, latestInbound: "Jan 06, 2025" },
    { id: 4, name: "Product Name", type: "Product Type", quantity: 100, latestInbound: "Feb 18, 2025" },
    { id: 5, name: "Product Name", type: "Product Type", quantity: 125, latestInbound: "Apr 01, 2025" },
    { id: 6, name: "Product Name", type: "Product Type", quantity: 103, latestInbound: "Mar 19, 2025" },
    { id: 7, name: "Product Name", type: "Product Type", quantity: 78, latestInbound: "May 09, 2025" },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full gap-4">
        <div className="flex items-center gap-6 flex-1">

          {/* Gap between title and search bar */}
          <div className="shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Management</p>
            <h1 className="text-lg font-semibold text-gray-900">Inventory</h1>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-sm group">
            <span className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 pointer-events-none group-focus-within:text-red-600 transition-colors">
              <Search size={15} strokeWidth={2} />
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pr-9 pl-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1">
          <HeaderNotifications />
          <HeaderUser />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
        <MetricCard
          title="Total Products"
          value="287"
          color="bg-green-500"
          icon={BookMarked}
          date="Oct 2025"
          showView={true}
          viewPath="/admin/product-management"
        />
        <MetricCard
          title="Low Stock Items"
          value="25"
          color="bg-orange-500"
          icon={AlertTriangle}
          date="Oct 2025"
          showView={false}
        />
        <MetricCard
          title="Out of Stock Items"
          value="38"
          color="bg-red-500"
          icon={CircleSlash2}
          date="Oct 2025"
          showView={false}
        />
      </div>

      {/* Table Section */}
      <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Stock Activity Log</h2>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              View and manage all product stock adjustments. Click{" "}
              <span className="text-red-600 cursor-pointer hover:underline">here</span>{" "}
              to export the adjustment history for record-keeping.
            </p>
          </div>

          <div className="relative" ref={calendarRef}>
            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className={`flex items-center gap-2 p-2 border rounded-lg transition-colors ${
                isCalendarOpen ? 'bg-red-600 text-white border-red-600' : 'border-red-200 text-red-600 hover:bg-red-50'
              }`}
            >
              <Calendar size={16} />
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="py-3 pl-6 font-semibold text-left">Product</th>
                <th className="py-3 px-4 font-semibold text-center">Total Quantity</th>
                <th className="py-3 px-4 font-semibold text-center">Latest Inbound Date</th>
                <th className="py-3 pr-6 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr
                  key={product.id}
                  onClick={() => router.push(`/admin/inventory-management/${product.id}`)}
                  className="hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 pl-6">
                    <div className="flex items-center gap-3">
                      {/* circle image */}
                      <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden shrink-0">
                        <img src="/product-icon.png" alt="Product" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-400">{product.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-gray-500 text-center">{product.quantity}</td>
                  <td className="py-3.5 px-4 text-sm text-gray-500 text-center">{product.latestInbound}</td>
                  <td className="py-3.5 pr-6 text-center">
                    <span className="text-xs font-medium text-red-600 hover:underline cursor-pointer">
                      View Batches
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-100 gap-4">
            <span className="text-xs text-gray-400">Showing 7 of 15 products</span>
            <div className="flex items-center gap-1.5">
              <button className="px-3 py-1.5 text-xs text-gray-400 hover:text-red-600 transition-colors">Prev</button>
              <button className="w-7 h-7 rounded-lg bg-red-600 text-white text-xs font-semibold shadow-sm">1</button>
              <button className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 text-xs hover:bg-gray-200 transition-colors">2</button>
              <button className="px-3 py-1.5 text-xs text-red-600 hover:underline transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;