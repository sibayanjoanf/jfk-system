import React from "react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MetricCard from "@/components/admin/dashboard/MetricCard";
import {
  Search,
  Bell,
  CircleUserRound,
  BookMarked,
  AlertTriangle,
  CircleSlash2,
  Calendar,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";

const ProductLog: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isCalendarActive, setIsCalendarActive] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  const batches = [
    {
      id: 1,
      batchId: "LOT-2025-JAN-001",
      inbound: "Jan 15, 2025",
      initial: 100,
      remaining: 0,
      status: "Depleted",
    },
    {
      id: 2,
      batchId: "LOT-2025-FEB-002",
      inbound: "Feb 20, 2025",
      initial: 150,
      remaining: 0,
      status: "Depleted",
    },
    {
      id: 3,
      batchId: "LOT-2025-MAR-003",
      inbound: "Mar 25, 2025",
      initial: 80,
      remaining: 0,
      status: "Depleted",
    },
    {
      id: 4,
      batchId: "LOT-2025-APR-004",
      inbound: "Apr 01, 2025",
      initial: 125,
      remaining: 80,
      status: "In Use",
    },
    {
      id: 5,
      batchId: "LOT-2025-MAY-005",
      inbound: "May 10, 2025",
      initial: 90,
      remaining: 90,
      status: "Future",
    },
    {
      id: 6,
      batchId: "LOT-2025-JUN-006",
      inbound: "Jun 12, 2025",
      initial: 105,
      remaining: 105,
      status: "Future",
    },
    {
      id: 7,
      batchId: "LOT-2025-JLU-007",
      inbound: "Jul 18, 2025",
      initial: 55,
      remaining: 55,
      status: "Future",
    },
    {
      id: 8,
      batchId: "LOT-2025-AUG-008",
      inbound: "Aug 19, 2025",
      initial: 80,
      remaining: 80,
      status: "Future",
    },
    {
      id: 9,
      batchId: "LOT-2025-SEP-009",
      inbound: "Sep 05, 2025",
      initial: 60,
      remaining: 60,
      status: "Future",
    },
  ];

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full">
        <div className="flex items-center flex-1">
          <button
            onClick={() => router.push("/inventory")}
            className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
          >
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
            onClick={() =>
              setActiveButton(activeButton === "bell" ? null : "bell")
            }
            className={`p-1.5 rounded-full transition-all overflow-hidden ${
              activeButton === "bell"
                ? "bg-[#DF2025] text-white"
                : "text-[#050F24] hover:bg-gray-200"
            }`}
          >
            <Bell size={24} />
          </button>

          {/* User Button */}
          <button
            onClick={() =>
              setActiveButton(activeButton === "user" ? null : "user")
            }
            className={`p-1.5 rounded-full transition-all overflow-hidden ${
              activeButton === "user"
                ? "bg-[#DF2025] text-white"
                : "text-[#050F24] hover:bg-gray-200"
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
          showView
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

      {/* Stock Activity Log + Controls */}
      <div className="mt-8 bg-[#FFFFFF] rounded-2xl p-6 border border-gray-200">
        <div className="flex justify-between items-start mb-6">
          {/* Left: Title + Description */}
          <div>
            <h2 className="text-lg font-semibold text-[#0F172A]">
              Stock Activity Log
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              View and manage all product stock adjustments. Click{" "}
              <span className="text-[#DF2025] cursor-pointer hover:underline">
                here
              </span>{" "}
              to export the adjustment history for record-keeping.
            </p>
          </div>

          {/* Right: Calendar + Dropdown + Buttons */}
          <div className="flex items-center gap-3">
            {/* Calendar */}
            <button
              onClick={() => setIsCalendarActive(!isCalendarActive)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${isCalendarActive ? "bg-[#DF2025] text-white border border-[#DF2025]" : "border border-[#DF2025] text-[#DF2025] hover:bg-red-50"}`}
            >
              <Calendar size={18} />
            </button>

            {/* Stock Status Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsStatusOpen(!isStatusOpen)}
                className="flex items-center justify-between gap-2 px-4 py-2 border border-[#DF2025] text-[#DF2025] rounded-full font-medium min-w-[140px]"
              >
                {statusFilter}{" "}
                <ChevronDown
                  size={18}
                  className={isStatusOpen ? "rotate-180" : ""}
                />
              </button>
              {isStatusOpen && (
                <div className="absolute mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                  {["All", "Depleted", "In Use", "Future"].map((status) => (
                    <button
                      key={status}
                      className={`w-full text-left px-6 py-3 text-sm hover:bg-gray-50 ${status === statusFilter ? "text-[#DF2025]" : "text-[#6F757E]"}`}
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

            {/* Adjustment Form Button */}
            <button
              onClick={() => router.push(`/inventory/${id}/adjustment`)}
              className="flex items-center gap-2 bg-[#DF2025] text-white px-4 py-2 rounded-2xl font-semibold hover:bg-[#b3191d] transition-colors"
            >
              Adjustment Form
            </button>

            {/* Batch Consumption Button */}
            <button
              onClick={() => router.push(`/inventory/${id}/batch-consumption`)}
              className="flex items-center gap-2 bg-[#DF2025] text-white px-4 py-2 rounded-2xl font-semibold hover:bg-[#b3191d] transition-colors"
            >
              Batch Consumption
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-[#0F172A]">
              <tr className="border-b border-gray-200">
                <th className="py-4 px-6 font-medium">Batch ID</th>
                <th className="font-medium text-center">Inbound Date</th>
                <th className="font-medium text-center">Initial Qty</th>
                <th className="font-medium text-center">Qty Remaining</th>
                <th className="font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-6 font-medium text-[#0F172A]">
                    {batch.batchId}
                  </td>
                  <td className="text-gray-400 text-center">{batch.inbound}</td>
                  <td className="text-gray-400 text-center">{batch.initial}</td>
                  <td className="text-gray-400 text-center">
                    {batch.remaining}
                  </td>
                  <td className="text-gray-400 text-center">{batch.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 text-sm">
            <span className="text-gray-400">Showing 7 of 15 products</span>
            <div className="flex items-center gap-3">
              <button className="text-gray-400 hover:text-black">Prev</button>
              <button className="w-8 h-8 rounded-full bg-[#DF2025] text-white flex items-center justify-center text-xs">
                1
              </button>
              <button className="w-8 h-8 rounded-full bg-gray-100 text-[#DF2025] text-xs hover:bg-[#DF2025] hover:text-white transition-colors duration-200">
                2
              </button>
              <button className="text-[#DF2025] hover:underline">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductLog;
