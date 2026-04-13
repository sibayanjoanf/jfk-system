"use client";


import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  Trash2,
  RotateCcw,
  Loader2,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  OrderRow,
  OrderStatus,
  ORDER_STATUSES,
  ALLOWED_TRANSITIONS,
} from "../types";
import StatusBadge from "./StatusBadge";
import CalendarPicker, { DateFilter } from "@/components/admin/CalendarPicker";
import Pagination from "@/app/admin/inventory-management/components/Pagination";
import { useOrderMutations } from "../hooks/useOrderMutations";


interface OrderTableProps {
  rows: OrderRow[];
  loading: boolean;
  onRefresh: () => void;
  onCreateOrder: () => void;
  search: string;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortConfig: { field: string; dir: "asc" | "desc" };
  onSort: (field: string) => void;
}


const SortArrows = ({
  field,
  current,
}: {
  field: string;
  current: { field: string; dir: string };
}) => {
  const isActive = current.field === field;
  return (
    <span className="flex flex-col -space-y-1">
      <ChevronUp
        size={12}
        strokeWidth={2}
        className={
          isActive && current.dir === "asc" ? "text-gray-400" : "text-gray-200"
        }
      />
      <ChevronDown
        size={12}
        strokeWidth={2}
        className={
          isActive && current.dir === "desc" ? "text-gray-400" : "text-gray-200"
        }
      />
    </span>
  );
};


const OrderTable: React.FC<OrderTableProps> = ({
  rows,
  loading,
  onRefresh,
  onCreateOrder,
  search,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  sortConfig,
  onSort,
}) => {
  const router = useRouter();
  const { deleteOrders, bulkUpdateStatus } = useOrderMutations();
  const [statusFilter, setStatusFilter] = useState("All");
  const [statusOpen, setStatusOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkStatusOpen, setBulkStatusOpen] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);


  const statusRef = useRef<HTMLDivElement>(null);
  const bulkRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node))
        setStatusOpen(false);
      if (bulkRef.current && !bulkRef.current.contains(e.target as Node))
        setBulkStatusOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  const filtered = useMemo(
    () =>
      rows.filter((o) => {
        const q = search.toLowerCase();
        const matchesSearch =
          o.customer_name.toLowerCase().includes(q) ||
          o.order_number.toLowerCase().includes(q) ||
          (o.email ?? "").toLowerCase().includes(q) ||
          o.phone.toLowerCase().includes(q);
        const matchesStatus =
          statusFilter === "All" || o.status === statusFilter;
        const matchesDate =
          !dateFilter ||
          (() => {
            const d = new Date(o.created_at);
            if (dateFilter.type === "year")
              return d.getFullYear() === dateFilter.year;
            if (dateFilter.type === "month")
              return (
                d.getFullYear() === dateFilter.year &&
                d.getMonth() === dateFilter.month
              );
            if (dateFilter.type === "day") {
              const f = dateFilter.date;
              return (
                d.getFullYear() === f.getFullYear() &&
                d.getMonth() === f.getMonth() &&
                d.getDate() === f.getDate()
              );
            }
            return true;
          })();
        return matchesSearch && matchesStatus && matchesDate;
      }),
    [rows, search, statusFilter, dateFilter, sortConfig],
  );


  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );


  const allSelected =
    paginated.length > 0 && paginated.every((o) => selectedIds.includes(o.id));
  const someSelected = selectedIds.length > 0;


  const toggleAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(paginated.map((o) => o.id));
  };


  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };


  const handleDelete = async () => {
    if (
      !confirm(`Delete ${selectedIds.length} order(s)? This cannot be undone.`)
    )
      return;
    setBulkLoading(true);
    await deleteOrders(selectedIds);
    setSelectedIds([]);
    onRefresh();
    setBulkLoading(false);
  };


  const handleBulkStatus = async (status: OrderStatus) => {
    setBulkLoading(true);
    const { error } = await bulkUpdateStatus(selectedIds, status);
    if (error) alert(`Error: ${error}`);
    else {
      setSelectedIds([]);
      onRefresh();
    }
    setBulkStatusOpen(false);
    setBulkLoading(false);
  };


  const selectedOrders = rows.filter((o) => selectedIds.includes(o.id));
  const commonTransitions = ORDER_STATUSES.filter((status) =>
    selectedOrders.every((o) => ALLOWED_TRANSITIONS[o.status].includes(status)),
  );


  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Order Management
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            All orders placed by customers. Click a row to view full details.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:justify-end w-full sm:w-auto">
          {/* Date filter */}
          <CalendarPicker
            value={dateFilter}
            onChange={(f) => {
              setDateFilter(f);
              onPageChange(1);
            }}
          />


          {/* Status filter */}
          <div className="relative" ref={statusRef}>
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className={`flex items-center gap-2 px-3 py-2 text-xs border rounded-lg font-medium transition-colors ${statusOpen ? "bg-red-600 text-white border-red-600" : "border-red-200 text-red-600 hover:bg-red-50"}`}
            >
              {statusFilter} <ChevronDown size={13} />
            </button>
            {statusOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                {["All", ...ORDER_STATUSES].map((s) => (
                  <button
                    key={s}
                    className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${s === statusFilter ? "text-red-600 font-semibold" : "text-gray-600"}`}
                    onClick={() => {
                      setStatusFilter(s);
                      setStatusOpen(false);
                      onPageChange(1);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>


          {/* Bulk actions */}
          {someSelected && (
            <div className="flex items-center gap-2 animate-in fade-in duration-150">
              <div className="relative" ref={bulkRef}>
                <button
                  onClick={() => setBulkStatusOpen(!bulkStatusOpen)}
                  disabled={bulkLoading || commonTransitions.length === 0}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw size={13} />
                  Status ({selectedIds.length}) <ChevronDown size={12} />
                </button>
                {bulkStatusOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {commonTransitions.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-3 px-4">
                        No valid transitions for selected orders
                      </p>
                    ) : (
                      commonTransitions.map((s) => (
                        <button
                          key={s}
                          className="w-full text-left px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
                          onClick={() => handleBulkStatus(s)}
                        >
                          <StatusBadge status={s} />
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={handleDelete}
                disabled={bulkLoading}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <Trash2 size={13} />
                Delete ({selectedIds.length})
              </button>
            </div>
          )}


          {/* Create order */}
          <button
            onClick={onCreateOrder}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Plus size={14} />
            New Order
          </button>
        </div>
      </div>


      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
            <Loader2 className="animate-spin" size={20} />
            <p className="text-sm">Loading orders...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-y border-gray-100">
                <th className="py-3 pl-5 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-3.5 h-3.5 rounded border-gray-300 accent-red-600 cursor-pointer"
                  />
                </th>
                <th
                  className="py-3 px-4 font-semibold cursor-pointer select-none hover:text-gray-600 transition-colors"
                  onClick={() => onSort("order_number")}
                >
                  <span className="inline-flex items-center gap-1">
                    Order ID
                    <SortArrows field="order_number" current={sortConfig} />
                  </span>
                </th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th
                  className="py-3 px-4 font-semibold cursor-pointer select-none hover:text-gray-600 transition-colors"
                  onClick={() => onSort("customer_name")}
                >
                  <span className="inline-flex items-center gap-1">
                    Customer
                    <SortArrows field="customer_name" current={sortConfig} />
                  </span>
                </th>
                <th className="py-3 px-4 font-semibold text-center">Type</th>
                <th
                  className="py-3 px-4 font-semibold text-center cursor-pointer select-none hover:text-gray-600 transition-colors"
                  onClick={() => onSort("item_count")}
                >
                  <span className="inline-flex items-center gap-1 justify-center">
                    Items
                    <SortArrows field="item_count" current={sortConfig} />
                  </span>
                </th>
                <th
                  className="py-3 px-4 font-semibold text-center cursor-pointer select-none hover:text-gray-600 transition-colors"
                  onClick={() => onSort("total_amount")}
                >
                  <span className="inline-flex items-center gap-1 justify-center">
                    Total
                    <SortArrows field="total_amount" current={sortConfig} />
                  </span>
                </th>
                <th className="py-3 pr-6 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-10 text-center text-xs text-gray-400"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                paginated.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() =>
                      router.push(`/admin/order-management/${order.id}`)
                    }
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedIds.includes(order.id) ? "bg-red-50/60" : ""}`}
                  >
                    <td
                      className="py-3.5 pl-5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(order.id)}
                        onChange={() => toggleOne(order.id)}
                        className="w-3.5 h-3.5 rounded border-gray-300 accent-red-600 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-sm font-medium text-gray-700 font-mono">
                      {order.order_number}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500 whitespace-nowrap">
                      <p>
                        {new Date(order.created_at).toLocaleDateString(
                          "en-PH",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </p>
                      <p className="text-gray-400 text-[10px]">
                        {new Date(order.created_at).toLocaleTimeString(
                          "en-PH",
                          { hour: "numeric", minute: "2-digit", hour12: true },
                        )}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-sm font-medium text-gray-900">
                        {order.customer_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.email ?? order.phone}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-xs text-gray-500 font-normal px-2 py-0.5 rounded-full`}
                      >
                        {order.order_type === "walk-in" ? "Walk-in" : "Online"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-normal text-gray-500 text-center">
                      {order.item_count}
                    </td>
                    <td className="py-3.5 px-4 text-sm font-medium text-gray-800 text-center">
                      <span>₱</span>
                      {order.total_amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-3.5 pr-6 text-center">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>


      {/* Pagination */}
      <div className="p-5">
        {!loading && filtered.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filtered.length}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        )}
      </div>
    </div>
  );
};


export default OrderTable;
