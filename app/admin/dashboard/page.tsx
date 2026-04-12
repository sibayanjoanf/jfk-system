"use client";

import React, { useMemo, useState } from "react";
import MetricCard from "@/components/admin/dashboard/MetricCard";
import RevenueChart from "@/components/admin/dashboard/RevenueChart";
import OrderStatusChart from "@/components/admin/dashboard/OrderStatusChart";
import {
  ShoppingCart,
  Clock,
  AlertTriangle,
  TrendingUp,
  Loader2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import HeaderUser from "@/components/admin/HeaderUser";
import HeaderNotifications from "@/components/admin/HeaderNotif";
import { useDashboard } from "./useDashboard";

const Dashboard: React.FC = () => {
  const { data, loading } = useDashboard();

  const [sortConfig, setSortConfig] = useState<{
    field: string;
    dir: "asc" | "desc";
  }>({
    field: "orders",
    dir: "desc",
  });

  const handleSort = (field: string) => {
    setSortConfig((prev) => ({
      field,
      dir: prev.field === field && prev.dir === "asc" ? "desc" : "asc",
    }));
  };

  const sortedProducts = useMemo(() => {
    const products = data?.topProducts ?? [];
    return [...products].sort((a, b) => {
      const dir = sortConfig.dir === "asc" ? 1 : -1;
      switch (sortConfig.field) {
        case "name":
          return a.name.localeCompare(b.name) * dir;
        case "orders":
          return (a.orders - b.orders) * dir;
        case "price":
          return (a.price - b.price) * dir;
        case "refunds":
          return a.refunds.localeCompare(b.refunds) * dir;
        default:
          return 0;
      }
    });
  }, [data?.topProducts, sortConfig]);

  const formatRevenue = (value: number) => {
    if (value >= 1_000_000) return `₱${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `₱${(value / 1_000).toFixed(1)}k`;
    return `₱${value}`;
  };

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full gap-4">
        <div className="flex items-center gap-6 flex-1">
          <div className="shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
              Overview
            </p>
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-1">
          <HeaderNotifications />
          <HeaderUser />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-400 gap-2">
          <Loader2 className="animate-spin" size={20} />
          <span className="text-sm">Loading dashboard...</span>
        </div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <MetricCard
              title="Total Orders"
              value={data?.totalOrders ?? 0}
              color="bg-[#4BD278]"
              icon={ShoppingCart}
              showView={true}
              viewPath="order-management"
            />
            <MetricCard
              title="Pending Orders"
              value={data?.pendingOrders ?? 0}
              color="bg-[#20B2DF]"
              icon={Clock}
              showView={true}
              viewPath="order-management"
            />
            <MetricCard
              title="Low Stock"
              value={data?.lowStockCount ?? 0}
              color="bg-[#FF8E29]"
              icon={AlertTriangle}
              showView={true}
              viewPath="inventory-management"
            />
            <MetricCard
              title="Revenue"
              value={formatRevenue(data?.totalRevenue ?? 0)}
              color="bg-[#DF2025]"
              icon={TrendingUp}
              showView={true}
              viewPath="sales-report"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <div className="xl:col-span-2">
              <RevenueChart data={data?.revenueByMonth ?? []} />
            </div>
            <div className="xl:col-span-1">
              <OrderStatusChart data={data?.orderStatusCounts ?? []} />
            </div>
          </div>

          {/* Products Table */}
          <div className="pb-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 pt-6 pb-4">
              <h2 className="text-base font-semibold text-gray-900">
                Top Selling Products
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-y border-gray-100">
                    {(
                      [
                        { label: "Product", field: "name", align: "left" },
                        { label: "Qty Sold", field: "orders", align: "center" },
                        { label: "Revenue", field: "price", align: "center" },
                        { label: "Refunds", field: "refunds", align: "center" },
                      ] as { label: string; field: string; align: string }[]
                    ).map(({ label, field, align }) => (
                      <th
                        key={field}
                        onClick={() => handleSort(field)}
                        className={`py-3 ${field === "name" ? "pl-6" : "px-4"} ${field === "refunds" ? "pr-6" : ""} font-semibold text-${align} cursor-pointer select-none hover:text-gray-600 transition-colors`}
                      >
                        <span
                          className={`inline-flex items-center gap-1 ${align === "center" ? "justify-center" : ""}`}
                        >
                          {label}
                          <span className="flex flex-col -space-y-1">
                            <ChevronUp
                              size={12}
                              strokeWidth={2}
                              className={
                                sortConfig.field === field &&
                                sortConfig.dir === "asc"
                                  ? "text-gray-400"
                                  : "text-gray-200"
                              }
                            />
                            <ChevronDown
                              size={12}
                              strokeWidth={2}
                              className={
                                sortConfig.field === field &&
                                sortConfig.dir === "desc"
                                  ? "text-gray-400"
                                  : "text-gray-200"
                              }
                            />
                          </span>
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sortedProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-10 text-center text-xs text-gray-400"
                      >
                        No completed orders yet.
                      </td>
                    </tr>
                  ) : (
                    sortedProducts.map((item, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-100 transition-colors"
                      >
                        <td className="py-3.5 pl-6">
                          <p className="text-sm font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400">{item.type}</p>
                        </td>
                        <td className="py-3.5 px-4 text-sm text-gray-500 text-center">
                          {item.orders.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-sm font-medium text-gray-700 text-center">
                          ₱
                          {item.price.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-3.5 pr-6 text-sm text-center">
                          <span
                            className={`font-medium ${item.refunds !== "< 1" ? "text-red-500" : "text-gray-400"}`}
                          >
                            {item.refunds}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
