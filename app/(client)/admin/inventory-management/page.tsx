'use client';

import React from "react";
import MetricCard from '@/components/admin/dashboard/MetricCard';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { Search, Bell, CircleUserRound, BookMarked, AlertTriangle, CircleSlash2, Calendar} from 'lucide-react';

const InventoryManagement: React.FC = () => {
const [activeButton, setActiveButton] = useState<string | null>(null);
  const products = [
    { id: 1, name: "Product Name", type: "Product Type", quantity: 150, latestInbound: "Mar 25, 2025" },
    { id: 2, name: "Product Name", type: "Product Type", quantity: 80, latestInbound: "Jan 17, 2025" },
    { id: 3, name: "Product Name", type: "Product Type", quantity: 96, latestInbound: "Jan 06, 2025" },
    { id: 4, name: "Product Name", type: "Product Type", quantity: 100, latestInbound: "Feb 18, 2025" },
    { id: 5, name: "Product Name", type: "Product Type", quantity: 125, latestInbound: "Apr 01, 2025" },
    { id: 6, name: "Product Name", type: "Product Type", quantity: 103, latestInbound: "Mar 19, 2025" },
    { id: 7, name: "Product Name", type: "Product Type", quantity: 78, latestInbound: "May 09, 2025" },
  ];

  const [isBellActive, setIsBellActive] = useState(false);
  const [isCalendarActive, setIsCalendarActive] = useState(false);
  const router = useRouter();

  return (
      <div className="p-0">
          {/* Header */}
        <div className="flex justify-between items-center mb-8 w-full">
          <div className="flex items-center flex-1">
            
            {/* Gap between title and search bar */}
            <div className="w-35 shrink-0">
              <h1 className="text-xl font-semibold text-[#0f172a]">Inventory</h1>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-xl group">
              <span className="absolute inset-y-0 right-4 flex items-center text-[#6F757E] pointer-events-none group-focus-within:text-[#DF2025] transition-colors overflow-hidden">
                <Search size={18} strokeWidth={2.5} />
              </span>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pr-10 pl-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#DF2025] transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-8">
            {/* Bell Button */}
            <button 
              onClick={() => setActiveButton(activeButton === 'bell' ? null : 'bell')}
              className={`p-1.5 rounded-full transition-all overflow-hidden ${
                activeButton === 'bell' 
                  ? 'bg-[#DF2025] text-white' 
                  : 'text-[#050F24] hover:bg-gray-200'
              }`}
            >
              <Bell size={24} />
            </button>

            {/* User Button */}
            <button 
              onClick={() => setActiveButton(activeButton === 'user' ? null : 'user')}
              className={`p-1.5 rounded-full transition-all overflow-hidden ${
                activeButton === 'user' 
                  ? 'bg-[#DF2025] text-white' 
                  : 'text-[#050F24] hover:bg-gray-200'
              }`}
            >
              <CircleUserRound size={27} strokeWidth={1.75} />
            </button>
          </div>
        </div>

    {/* Stats Cards */}
    <div className="flex lg:flex-row flex-col mt-6 gap-6">
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
<div className="mt-8 bg-[#FFFFFF] rounded-2xl p-6 border border-gray-200">

  {/* Header */}
  <div className="flex justify-between items-start mb-6">
    <div>
      <h2 className="text-lg font-semibold text-[#0F172A]">
        Stock Activity Log
      </h2>
      <p className="text-sm text-gray-400 mt-1">
        View and manage all product stock adjustments. Click{" "}
        <span className="text-[#DF2025] cursor-pointer hover:underline">
          here
        </span>{" "}
        export the adjustment history for record-keeping.
      </p>
    </div>

    <button
        onClick={() => setIsCalendarActive(!isCalendarActive)}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200
        ${isCalendarActive ? "bg-[#DF2025] text-white border border-[#DF2025]": "border border-[#DF2025] text-[#DF2025] hover:bg-red-50"}`}>
        <Calendar size={18} />
    </button>
  </div>

  {/* Table Container */}
  <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
    <table className="w-full text-left text-sm">
      <thead className="bg-white text-[#0F172A]">
        <tr className="border-b border-gray-200">
          <th className="py-4 px-6 font-medium ">Product</th>
          <th className="font-medium text-center">Total Quantity</th>
          <th className="font-medium text-center">Latest Inbound Date</th>
          <th className="font-medium text-center">Action</th>
        </tr>
      </thead>

      <tbody>
        {products.map((product) => (
          <tr
            key={product.id}
            onClick={() => router.push(`/admin/inventory-management/${product.id}`)}
            className="hover:bg-gray-50 transition cursor-pointer"
          >
            <td className="py-4 px-6">
              <div className="flex items-center gap-3">
                {/* circle image */}
                <img
                src="/product-icon.png"
                alt="Product"
                className="w-9 h-9 rounded-full object-cover"
            />
                <div>
                  <div className="font-medium text-[#0F172A]">
                    {product.name}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {product.type}
                  </div>
                </div>
              </div>
            </td>

            <td className="text-gray-400 text-center">
              {product.quantity}
            </td>

            <td className="text-gray-400 text-center">
              {product.latestInbound}
            </td>
            <td className="text-gray-400 text-center hover:text-[#DF2025] cursor-pointer">
                View Batches
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Pagination */}
    <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 text-sm">
      <span className="text-gray-400">
        Showing 7 of 15 products
      </span>

      <div className="flex items-center gap-3">
        <button className="text-gray-400 hover:text-black">
          Prev
        </button>

        <button className="w-8 h-8 rounded-full bg-[#DF2025] text-white flex items-center justify-center text-xs">
          1
        </button>

        <button className="w-8 h-8 rounded-full bg-gray-100 text-[#DF2025] text-xs hover:bg-[#DF2025] hover:text-white transition-colors duration-200">
          2
        </button>

        <button className="text-[#DF2025] hover:underline">
          Next
        </button>
      </div>
    </div>
</div>
  </div>
</div>
  );
};

export default InventoryManagement;
