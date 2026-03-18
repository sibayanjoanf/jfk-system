"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ArrowUpCircle,
  ArrowDownCircle,
  RotateCcw,
  X,
  Loader2,
} from "lucide-react";
import { MovementRow } from "../types";
import Pagination from "./Pagination";

interface AuditLogTableProps {
  rows: MovementRow[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({
  rows,
  loading,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const [search, setSearch] = useState("");
  const [movFilter, setMovFilter] = useState("All");
  const [movFilterOpen, setMovFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("");

  const filtered = useMemo(
    () =>
      rows.filter((h) => {
        const q = search.toLowerCase();
        const matchesSearch =
          h.product_name.toLowerCase().includes(q) ||
          h.sku.toLowerCase().includes(q);
        const matchesMovement =
          movFilter === "All" ||
          h.movement_type.toLowerCase() === movFilter.toLowerCase();
        const matchesDate =
          !dateFilter || (h.created_at ?? "").includes(dateFilter);
        return matchesSearch && matchesMovement && matchesDate;
      }),
    [rows, search, movFilter, dateFilter],
  );

  const formatReference = (ref: string | null) => {
    if (!ref) return "—";
    switch (ref) {
      case "InboundBatch":
        return "Inbound";
      case "StockAdjustment":
        return "Adjustment";
      default:
        return ref;
    }
  };

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const getMovementStyles = (movement: string) => {
    switch (movement.toLowerCase()) {
      case "inbound":
        return "text-green-600 bg-green-50";
      case "adjustment":
        return "text-blue-600 bg-blue-50";
      case "consumed":
        return "text-orange-500 bg-orange-50";
      case "returned":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const getMovementIcon = (movement: string) => {
    switch (movement.toLowerCase()) {
      case "inbound":
        return <ArrowUpCircle size={13} className="text-green-500" />;
      case "adjustment":
        return <RotateCcw size={13} className="text-blue-500" />;
      case "consumed":
        return <ArrowDownCircle size={13} className="text-orange-500" />;
      case "returned":
        return <ArrowUpCircle size={13} className="text-purple-500" />;
      default:
        return null;
    }
  };

  const filterBtnClass = (active: boolean) =>
    `flex items-center gap-2 px-3 py-2 text-xs border rounded-lg font-medium transition-colors ${active ? "bg-red-600 text-white border-red-600" : "border-red-200 text-red-600 hover:bg-red-50"}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Audit Log</h2>
          <p className="text-xs text-gray-400 mt-1">
            Complete history of all stock movements — inbound, adjustments,
            consumption, and returns.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          <div className="relative group">
            <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none group-focus-within:text-red-600 transition-colors">
              <Search size={13} />
            </span>
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                onPageChange(1);
              }}
              className="pr-8 pl-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all w-48"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setMovFilterOpen(!movFilterOpen)}
              className={filterBtnClass(movFilterOpen)}
            >
              {movFilter} <ChevronDown size={13} />
            </button>
            {movFilterOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                {["All", "Inbound", "Adjustment", "Consumed", "Returned"].map(
                  (f) => (
                    <button
                      key={f}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${f === movFilter ? "text-red-600 font-medium" : "text-gray-600"}`}
                      onClick={() => {
                        setMovFilter(f);
                        setMovFilterOpen(false);
                        onPageChange(1);
                      }}
                    >
                      {f}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
          <input
            type="month"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              onPageChange(1);
            }}
            className="px-3 py-2 text-xs border border-red-200 text-red-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-white transition-all"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
            <Loader2 className="animate-spin" size={20} />
            <p className="text-sm">Loading audit log...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="py-3 pl-5 font-semibold">Movement</th>
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold text-center">
                  Qty Change
                </th>
                <th className="py-3 px-4 font-semibold text-center">Before</th>
                <th className="py-3 px-4 font-semibold text-center">After</th>
                <th className="py-3 px-4 font-semibold">Reference</th>
                <th className="py-3 pr-5 font-semibold text-center">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-xs text-gray-400"
                  >
                    No history found.
                  </td>
                </tr>
              ) : (
                paginated.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="py-3.5 pl-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getMovementStyles(entry.movement_type)}`}
                      >
                        {getMovementIcon(entry.movement_type)}
                        {entry.movement_type.charAt(0).toUpperCase() +
                          entry.movement_type.slice(1)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-sm font-medium text-gray-900">
                        {entry.product_name}
                      </p>
                      <p className="text-xs text-gray-400">{entry.sku}</p>
                    </td>
                    <td
                      className={`py-3.5 px-4 text-sm font-semibold text-center ${entry.quantity_change > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {entry.quantity_change > 0
                        ? `+${entry.quantity_change}`
                        : entry.quantity_change}
                    </td>
                    <td className="py-3.5 px-4 text-sm text-gray-500 text-center">
                      {entry.quantity_before}
                    </td>
                    <td className="py-3.5 px-4 text-sm font-semibold text-gray-900 text-center">
                      {entry.quantity_after}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-gray-500">
                      {formatReference(entry.reference_type) ?? "—"}
                    </td>
                    <td className="py-3.5 pr-5 text-xs text-gray-400 text-center whitespace-nowrap">
                      {new Date(entry.created_at).toLocaleDateString("en-PH", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

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
  );
};

export default AuditLogTable;
