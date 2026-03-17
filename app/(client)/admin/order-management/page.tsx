"use client";

import React, { useState } from "react";
import { Calendar, Search, Trash2, ChevronDown } from "lucide-react";
import HeaderUser from "@/components/admin/HeaderUser";
import HeaderNotifications from "@/components/admin/HeaderNotif";

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  orderId: string;
  product: string;
  date: string;
  status: "Pending" | "Paid" | "Processing" | "Completed" | "Refunded";
  revenue: number;
  itemCount: number;
}

const OrderManagement: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const orders: Order[] = [
    {
      id: "1",
      customerName: "Aliyah Segovia",
      customerEmail: "asegovia@gmail.com",
      orderId: "EL-00552",
      product: "Product",
      date: "28 Sep, 2025",
      status: "Pending",
      revenue: 3500,
      itemCount: 2,
    },
    {
      id: "2",
      customerName: "Maverick Verdida",
      customerEmail: "mverdida@gmail.com",
      orderId: "EL-00551",
      product: "Product",
      date: "28 Sep, 2025",
      status: "Paid",
      revenue: 20000,
      itemCount: 5,
    },
    {
      id: "3",
      customerName: "Russell Palcoto",
      customerEmail: "rpalcoto@gmail.com",
      orderId: "EL-00550",
      product: "Product",
      date: "28 Sep, 2025",
      status: "Processing",
      revenue: 500,
      itemCount: 1,
    },
    {
      id: "4",
      customerName: "Rose Pajarito",
      customerEmail: "rpajarito@gmail.com",
      orderId: "EL-00549",
      product: "Product",
      date: "28 Sep, 2025",
      status: "Pending",
      revenue: 3070,
      itemCount: 3,
    },
    {
      id: "5",
      customerName: "Venelyn Cordova",
      customerEmail: "vcordova@gmail.com",
      orderId: "EL-00548",
      product: "Product",
      date: "28 Sep, 2025",
      status: "Refunded",
      revenue: 23500,
      itemCount: 8,
    },
    {
      id: "6",
      customerName: "Joan Sibayan",
      customerEmail: "jsibayan@gmail.com",
      orderId: "EL-00547",
      product: "Product",
      date: "28 Sep, 2025",
      status: "Paid",
      revenue: 7000,
      itemCount: 4,
    },
    {
      id: "7",
      customerName: "Lindsay Mahusay",
      customerEmail: "lmahusay@gmail.com",
      orderId: "EL-00546",
      product: "Product",
      date: "28 Sep, 2025",
      status: "Completed",
      revenue: 10030,
      itemCount: 6,
    },
  ];

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const allSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((o) => selectedIds.includes(o.id));
  const someSelected = selectedIds.length > 0;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredOrders.map((o) => o.id));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const deleteSelected = () => {
    setSelectedIds([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "text-[#B427D0]";
      case "Pending":
        return "text-[#FF8E29]";
      case "Completed":
        return "text-[#27D095]";
      case "Processing":
        return "text-[#20B2DF]";
      case "Refunded":
        return "text-[#DF2025]";
      default:
        return "text-gray-500";
    }
  };

  const getDotColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-[#B427D0]";
      case "Pending":
        return "bg-[#FF8E29]";
      case "Completed":
        return "bg-[#27D095]";
      case "Processing":
        return "bg-[#20B2DF]";
      case "Refunded":
        return "bg-[#DF2025]";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full gap-4">
        <div className="flex items-center gap-6 flex-1">
          {/* Gap between title and search bar */}
          <div className="shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
              Management
            </p>
            <h1 className="text-lg font-semibold text-gray-900">Order List</h1>
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

      {/* Order Management Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Order Management
            </h2>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
              All orders placed by customers are listed below.
              <br />
              Click on an order to view its full details.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {someSelected && (
              <button
                onClick={deleteSelected}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors animate-in fade-in duration-150"
              >
                <Trash2 size={13} />
                Delete ({selectedIds.length})
              </button>
            )}

            {/* Calendar */}
            <button className="p-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              <Calendar size={16} />
            </button>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 text-xs border rounded-lg font-medium transition-colors ${
                  isFilterOpen
                    ? "bg-red-600 text-white border-red-600"
                    : "border-red-200 text-red-600 hover:bg-red-50"
                }`}
              >
                <span>{filterStatus}</span>
                <ChevronDown size={14} />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                  {[
                    "All",
                    "Pending",
                    "Processing",
                    "Paid",
                    "Completed",
                    "Refunded",
                  ].map((status) => (
                    <button
                      key={status}
                      className={`w-full text-left px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-100 transition-colors ${status === filterStatus ? "text-red-600 font-medium" : "text-gray-600"}`}
                      onClick={() => {
                        setFilterStatus(status);
                        setIsFilterOpen(false);
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

        {/* Order Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="py-3 pl-5 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-3.5 h-3.5 rounded border-gray-300 accent-red-600 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 font-semibold text-left">Order ID</th>
                <th className="py-3 px-4 font-semibold text-left">Date</th>
                <th className="py-3 px-4 font-semibold text-left">Customer</th>
                <th className="py-3 px-4 font-semibold text-center">Items</th>
                <th className="py-3 px-4 font-semibold text-center">Revenue</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className={`hover:bg-gray-100 transition-colors ${selectedIds.includes(order.id) ? "bg-red-50/80" : ""}`}
                >
                  <td className="py-3.5 pl-5">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(order.id)}
                      onChange={() => toggleOne(order.id)}
                      className="w-3.5 h-3.5 rounded border-gray-300 accent-red-600 cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-4 text-sm font-medium text-gray-700">
                    {order.orderId}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-gray-500 whitespace-nowrap">
                    {order.date}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div>
                        <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {order.customerEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-gray-500 text-center">
                    {order.itemCount}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-gray-700 font-medium text-center">
                    ₱{order.revenue.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                    >
                      {/* Yung bilog sa status */}
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${getDotColor(order.status)}`}
                      />
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 gap-4 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            Showing {filteredOrders.length} of {orders.length} orders
          </span>
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1.5 text-xs text-gray-400 hover:text-red-600 transition-colors">
              Prev
            </button>
            <button className="w-7 h-7 rounded-lg bg-red-600 text-white text-xs font-semibold shadow-sm">
              1
            </button>
            <button className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 text-xs hover:bg-gray-200 transition-colors">
              2
            </button>
            <button className="px-3 py-1.5 text-xs text-red-600 hover:underline transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
