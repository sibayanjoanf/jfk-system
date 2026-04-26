"use client";

import React, { useState, useRef } from "react";
import {
  Printer,
  Download,
  ChevronDown,
  TrendingUp,
  ShoppingBag,
  XCircle,
  RotateCcw,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Tooltip as TooltipComponent,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import HeaderUser from "@/components/admin/HeaderUser";
import HeaderNotifications from "@/components/admin/HeaderNotif";
import { useSalesReport, TimeFilter } from "./useSalesReport";

const STATUS_COLORS: Record<string, string> = {
  Pending: "#F59E0B",
  Processing: "#3B82F6",
  Paid: "#8B5CF6",
  Completed: "#22C55E",
  Cancelled: "#EF4444",
  Refunded: "#EC4899",
};

const PRODUCTS_PER_PAGE = 5;

// Export to CSV
function exportToCSV(
  statPoints: { name: string; revenue: number; orders: number }[],
  timeFilter: string,
) {
  const rows = [
    ["Period", "Revenue (PHP)", "Orders"],
    ...statPoints.map((p) => [p.name, p.revenue.toFixed(2), p.orders]),
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sales-report-${timeFilter.toLowerCase()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const SalesReport: React.FC = () => {
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("Monthly");
  const [productPage, setProductPage] = useState(1);
  const printRef = useRef<HTMLDivElement>(null);

  const { data, loading } = useSalesReport(timeFilter);

  const handlePrint = () => window.print();

  const paginatedProducts =
    data?.topProducts.slice(
      (productPage - 1) * PRODUCTS_PER_PAGE,
      productPage * PRODUCTS_PER_PAGE,
    ) ?? [];

  const totalProductPages = Math.ceil(
    (data?.topProducts.length ?? 0) / PRODUCTS_PER_PAGE,
  );

  const pieData =
    data?.orderStatusCounts
      .filter((s) => s.count > 0)
      .map((s) => ({
        name: s.status,
        value: s.count,
        color: STATUS_COLORS[s.status] ?? "#94A3B8",
      })) ?? [];

  return (
    <div className="p-0 font-sans" ref={printRef}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full gap-4">
        <div className="flex items-center gap-6 flex-1">
          <div className="shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
              Reports
            </p>
            <h1 className="text-lg font-semibold text-gray-900">
              Sales Report
            </h1>
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
          <span className="text-sm">Loading report...</span>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          {/* Summary Cards */}
          <div className="col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400 font-medium">
                  Total Revenue
                </p>
                <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                  <TrendingUp size={16} className="text-white" />
                </div>
              </div>
              <p className="text-xl font-semibold text-gray-900">
                <span className="font-medium">₱</span>
                {data?.totalRevenue.toLocaleString("en-PH", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                From completed orders
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400 font-medium">
                  Total Orders
                </p>
                <div className="w-8 h-8 rounded-lg bg-blue-400 flex items-center justify-center">
                  <ShoppingBag size={16} className="text-white" />
                </div>
              </div>
              <p className="text-xl font-semibold text-gray-900">
                {data?.totalOrders.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {data?.completedOrders} completed
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400 font-medium">
                  Cancelled Rate
                </p>
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                  <XCircle size={16} className="text-white" />
                </div>
              </div>
              <p className="text-xl font-semibold text-gray-900">
                {data?.cancelledRate.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-400 mt-1">Of all orders</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400 font-medium">
                  Refunded Rate
                </p>
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                  <RotateCcw size={16} className="text-white" />
                </div>
              </div>
              <p className="text-xl font-semibold text-gray-900">
                {data?.refundedRate.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-400 mt-1">Of all orders</p>
            </div>
          </div>

          {/* Statistics Bar Chart */}
          <div className="col-span-12 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-semibold text-gray-900">
                Revenue Over Time
              </h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setIsTimeOpen(!isTimeOpen)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs border rounded-lg font-medium transition-colors ${
                      isTimeOpen
                        ? "bg-red-600 text-white border-red-600"
                        : "border-red-200 text-red-600 hover:bg-red-50"
                    }`}
                  >
                    {timeFilter}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200`}
                    />
                  </button>
                  {isTimeOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                      {(
                        ["Daily", "Weekly", "Monthly", "Yearly"] as TimeFilter[]
                      ).map((item) => (
                        <button
                          key={item}
                          className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${
                            item === timeFilter
                              ? "text-red-600 font-semibold"
                              : "text-gray-600"
                          }`}
                          onClick={() => {
                            setTimeFilter(item);
                            setIsTimeOpen(false);
                          }}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <TooltipProvider delayDuration={200}>
                    <TooltipComponent>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() =>
                            data && exportToCSV(data.statPoints, timeFilter)
                          }
                          className="p-2 rounded-lg text-red-600 border border-red-200 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Download size={16} className="text-red-600" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        sideOffset={5}
                        className="text-[10px] py-1 px-2 bg-red-600"
                      >
                        <p>Export to CSV</p>
                      </TooltipContent>
                    </TooltipComponent>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            <div className="w-full">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={data?.statPoints ?? []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F1F5F9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 11 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94A3B8", fontSize: 11 }}
                    tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    cursor={{ fill: "#F8FAFC" }}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      fontSize: "12px",
                    }}
                    formatter={(value: number | string | undefined) => [
                      `₱${Number(value ?? 0).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
                      "Revenue",
                    ]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#DF2025"
                    radius={[4, 4, 0, 0]}
                    barSize={10}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 pt-6 pb-4">
              <h2 className="text-base font-semibold text-gray-900">
                Top Selling Products
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Best performing products by quantity sold
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-y border-gray-100">
                    <th className="py-3 pl-6 font-semibold">Product</th>
                    <th className="py-3 px-4 font-semibold text-center">
                      Qty Sold
                    </th>
                    <th className="py-3 px-4 font-semibold text-center">
                      Revenue
                    </th>
                    <th className="py-3 pr-6 font-semibold text-center">
                      Refunds
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-10 text-center text-xs text-gray-400"
                      >
                        No completed orders yet.
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((item, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3.5 pl-6">
                          <p className="text-sm font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400">{item.sku}</p>
                        </td>
                        <td className="py-3.5 px-4 text-sm text-gray-500 text-center">
                          {item.quantity.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 text-sm font-medium text-gray-700 text-center">
                          ₱
                          {item.revenue.toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-3.5 pr-6 text-sm text-center">
                          <span
                            className={`font-medium ${item.refunds > 0 ? "text-red-500" : "text-gray-400"}`}
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
            {totalProductPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-100 gap-4">
                <span className="text-xs text-gray-400">
                  Showing {(productPage - 1) * PRODUCTS_PER_PAGE + 1}–
                  {Math.min(
                    productPage * PRODUCTS_PER_PAGE,
                    data?.topProducts.length ?? 0,
                  )}{" "}
                  of {data?.topProducts.length} products
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setProductPage((p) => Math.max(1, p - 1))}
                    disabled={productPage === 1}
                    className="px-3 py-1.5 text-xs text-gray-400 hover:text-red-600 transition-colors disabled:opacity-40"
                  >
                    Prev
                  </button>
                  {Array.from(
                    { length: totalProductPages },
                    (_, i) => i + 1,
                  ).map((p) => (
                    <button
                      key={p}
                      onClick={() => setProductPage(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                        p === productPage
                          ? "bg-red-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setProductPage((p) => Math.min(totalProductPages, p + 1))
                    }
                    disabled={productPage === totalProductPages}
                    className="px-3 py-1.5 text-xs text-red-600 hover:underline transition-colors disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Orders by Status Donut */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col">
            <h2 className="text-base font-semibold text-gray-900 mb-2">
              Orders by Status
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Distribution of all orders
            </p>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    cornerRadius={10}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1">
              {pieData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between py-2.5 border-t border-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-500">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
