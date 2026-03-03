import React from "react";
import MetricCard from "@/components/admin/dashboard/MetricCard";
import { useState } from 'react';
import { useRouter, useParams } from "next/navigation";
import { Search, Bell, CircleUserRound, BookMarked, AlertTriangle, CircleSlash2, Calendar, ArrowLeft, ChevronDown} from 'lucide-react';

const ViewAdjustment: React.FC  = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const adjustments = [
      { id: 1, productName: "Product Name", productType: "Product Type", date: "10 Oct, 2025", type: "Damaged", quantity: 13, batchId: "LOT-2025-MAR-03", before: 135, after: 120 },
      { id: 2, productName: "Product Name", productType: "Product Type", date: "10 Oct, 2025", type: "Damaged", quantity: 13, batchId: "LOT-2025-MAR-03", before: 135, after: 120 },
      { id: 3, productName: "Product Name", productType: "Product Type", date: "10 Oct, 2025", type: "Damaged", quantity: 13, batchId: "LOT-2025-MAR-03", before: 135, after: 120 },
      { id: 4, productName: "Product Name", productType: "Product Type", date: "10 Oct, 2025", type: "Damaged", quantity: 13, batchId: "LOT-2025-MAR-03", before: 135, after: 120 },
      { id: 5, productName: "Product Name", productType: "Product Type", date: "10 Oct, 2025", type: "Damaged", quantity: 13, batchId: "LOT-2025-MAR-03", before: 135, after: 120 },
      { id :6, productName: "Product Name", productType: "Product Type", date: "10 Oct, 2025", type: "Damaged", quantity: 13, batchId: "LOT-2025-MAR-03", before: 135, after: 120 },
      { id :7, productName: "Product Name", productType: "Product Type", date: "10 Oct, 2025", type: "Damaged", quantity: 13, batchId: "LOT-2025-MAR-03", before: 135, after: 120 },
    ];
  
    const [isBellActive, setIsBellActive] = useState(false);
    const [isCalendarActive, setIsCalendarActive] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const router = useRouter();
    const { id } = useParams();
    
    return (
      <div className="p-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 w-full">
          <div className="flex items-center flex-1">
            <button onClick={() => router.push(`/inventory/${id}/adjustment`)}
                      className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-[#050F24]" />
                      </button>
            {/* Gap between title and search bar */}
            <div className="w-35 pl-5 shrink-0">
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
        <div className="flex gap-6 mt-6">
    
        <MetricCard
        title="Total Products"
        value="287"
        color="bg-green-500"
        icon={BookMarked}
        date="Oct 2025"
        showView={true}
        viewPath="/products"
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
  {/* Left Side */}
  <div>
    <h2 className="text-lg font-semibold text-[#0F172A]">
      Adjustments
    </h2>
    <p className="text-sm text-gray-400 mt-1">
        View and manage all product stock adjustments. Click{" "}
        <span className="text-[#DF2025] cursor-pointer hover:underline">here</span>{" "}
        to export the adjustment history for record-keeping.
    </p>
  </div>

  {/* Right Side: Calendar + Dropdown */}
  <div className="flex items-center gap-4">

    {/* Calendar */}
    <button
      onClick={() => setIsCalendarActive(!isCalendarActive)}
      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200
      ${isCalendarActive 
        ? "bg-[#DF2025] text-white border border-[#DF2025]" 
        : "border border-[#DF2025] text-[#DF2025] hover:bg-red-50"
      }`}
    >
      <Calendar size={18} />
    </button>

    {/* Stock Status Dropdown */}
    <div className="relative">
      <button
        onClick={() => setIsStatusOpen(!isStatusOpen)}
        className="flex items-center justify-between gap-2 px-4 py-2 border border-[#DF2025] text-[#DF2025] rounded-full font-medium min-w-[140px]"
      >
        {statusFilter}
        <ChevronDown
          size={18}
          className={`transition-transform ${isStatusOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isStatusOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
          {["All", "Damaged", "Broken", "Returned", "Lost", "Correction", "Supplier Return", "Other"].map((status) => (
            <button
              key={status}
              className={`w-full text-left px-6 py-3 text-sm hover:bg-gray-50 ${
                status === statusFilter
                  ? "text-[#DF2025]"
                  : "text-[#6F757E]"
              }`}
              onClick={() => {
                setStatusFilter(status);
                setIsStatusOpen(false);
              }}
            >
              {status}
            </button>
          ))}
        </div>
      )}
        </div>

        </div>
    </div>
    
      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white text-[#0F172A]">
            <tr className="border-b border-gray-200">
              <th className="py-4 px-6 font-medium ">Product</th>
              <th className="font-medium text-center">Date</th>
              <th className="font-medium text-center">Type</th>
                <th className="font-medium text-center">Quantity</th>
              <th className="font-medium text-center">Batch ID</th>
              <th className="font-medium text-center">Before</th>
              <th className="font-medium text-center">After</th>
            </tr>
          </thead>
    
          <tbody>
  {adjustments.map((item) => (
    <tr key={item.id} className="hover:bg-gray-50 transition">

      {/* Product column with icon + type */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          
      {/* circle image */}
      <img
       src="/product-icon.png"
       alt="Product"
       className="w-9 h-9 rounded-full object-cover"
      />

          {/* name + type */}
          <div>
            <div className="font-medium text-[#0F172A]">
              {item.productName}
            </div>
            <div className="text-xs text-gray-400">
              {item.productType}
            </div>
          </div>

        </div>
      </td>

      <td className="text-center text-gray-400">
        {item.date}
      </td>

      <td className="text-center text-gray-400">
        {item.type}
      </td>

      <td className="text-center text-gray-400">
        {item.quantity}
      </td>

      <td className="text-center text-gray-400">
        {item.batchId}
      </td>

      <td className="text-center text-gray-400">
        {item.before}
      </td>

      <td className="text-center text-gray-400">
        {item.after}
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
    
export default ViewAdjustment;