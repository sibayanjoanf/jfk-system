"use client";


import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, ChevronDown, Loader2, ChevronUp } from "lucide-react";
import { StockRow } from "../types";
import Pagination from "./Pagination";
import Image from "next/image";


interface StockTableProps {
  rows: StockRow[];
  loading: boolean;
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


const StockTable: React.FC<StockTableProps> = ({
  rows,
  loading,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  sortConfig,
  onSort,
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [statusOpen, setStatusOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  const filtered = useMemo(
    () =>
      rows.filter((i) => {
        const matchesSearch =
          i.product_name.toLowerCase().includes(search.toLowerCase()) ||
          i.sku.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
          statusFilter === "All" || i.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [rows, search, statusFilter, sortConfig],
  );


  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );


  const getStatusStyles = (status: string) => {
    switch (status) {
      case "In Stock":
        return "text-green-600";
      case "Low Stock":
        return "text-orange-500";
      case "Out of Stock":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };


  const getStatusBg = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-green-600/10";
      case "Low Stock":
        return "bg-orange-500/10";
      case "Out of Stock":
        return "bg-red-600/10";
      default:
        return "bg-gray-500/10";
    }
  };


  const filterBtnClass = (active: boolean) =>
    `flex items-center gap-2 px-3 py-2 text-xs border rounded-lg font-medium transition-colors ${active ? "bg-red-600 text-white border-red-600" : "border-red-200 text-red-600 hover:bg-red-50"}`;


  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 pt-5 pb-4 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Current Stock Levels
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Live view of all product quantities, reserved stock, and reorder
            thresholds.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:justify-end w-full sm:w-auto">
          <div className="relative group flex-1 sm:flex-none">
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
              className="pr-8 pl-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all w-full sm:w-48"
            />
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className={filterBtnClass(statusOpen)}
            >
              {statusFilter} <ChevronDown size={13} />
            </button>
            {statusOpen && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-150 absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                {["All", "In Stock", "Low Stock", "Out of Stock"].map((f) => (
                  <button
                    key={f}
                    className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${f === statusFilter ? "text-red-600 font-semibold" : "text-gray-600"}`}
                    onClick={() => {
                      setStatusFilter(f);
                      setStatusOpen(false);
                      onPageChange(1);
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>


      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
            <Loader2 className="animate-spin" size={20} />
            <p className="text-sm">Loading stock...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-y border-gray-100">
                <th
                  className="py-3 pl-6 font-semibold cursor-pointer select-none hover:text-gray-600 transition-colors"
                  onClick={() => onSort("product_name")}
                >
                  <span className="inline-flex items-center gap-1">
                    Product
                    <SortArrows field="product_name" current={sortConfig} />
                  </span>
                </th>
                <th
                  className="py-3 px-4 font-semibold text-center cursor-pointer select-none hover:text-gray-600 transition-colors"
                  onClick={() => onSort("sku")}
                >
                  <span className="inline-flex items-center gap-1 justify-center">
                    SKU
                    <SortArrows field="sku" current={sortConfig} />
                  </span>
                </th>
                <th
                  className="py-3 px-4 font-semibold text-center cursor-pointer select-none hover:text-gray-600 transition-colors"
                  onClick={() => onSort("stock_qty")}
                >
                  <span className="inline-flex items-center gap-1 justify-center">
                    On Hand
                    <SortArrows field="stock_qty" current={sortConfig} />
                  </span>
                </th>
                <th
                  className="py-3 px-4 font-semibold text-center cursor-pointer select-none hover:text-gray-600 transition-colors"
                  onClick={() => onSort("reserved_qty")}
                >
                  <span className="inline-flex items-center gap-1 justify-center">
                    Reserved
                    <SortArrows field="reserved_qty" current={sortConfig} />
                  </span>
                </th>
                <th
                  className="py-3 px-4 font-semibold text-center cursor-pointer select-none hover:text-gray-600 transition-colors"
                  onClick={() => onSort("available_qty")}
                >
                  <span className="inline-flex items-center gap-1 justify-center">
                    Available
                    <SortArrows field="available_qty" current={sortConfig} />
                  </span>
                </th>
                <th className="py-3 px-4 font-semibold text-center">
                  Reorder At
                </th>
                <th className="py-3 pr-6 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-10 text-center text-xs text-gray-400"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="py-3.5 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                          <Image
                            src={item.image_url}
                            alt={item.product_name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.product_name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {item.sub_category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500 text-center font-mono">
                      {item.sku}
                    </td>
                    <td className="py-3.5 px-4 text-sm font-semibold text-gray-900 text-center">
                      {item.stock_qty}
                    </td>
                    <td className="py-3.5 px-4 text-sm text-gray-500 text-center">
                      {item.reserved_qty > 0 ? (
                        <span className="text-orange-500 font-medium">
                          {item.reserved_qty}
                        </span>
                      ) : (
                        0
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-sm font-medium text-center">
                      <span
                        className={
                          item.available_qty <= 0
                            ? "text-red-600"
                            : "text-gray-900"
                        }
                      >
                        {item.available_qty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-sm text-gray-500 text-center">
                      10
                    </td>
                    <td className="py-3.5 pr-6 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(item.status)} ${getStatusBg(item.status)}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${item.status === "In Stock" ? "bg-green-500" : item.status === "Low Stock" ? "bg-orange-400" : "bg-red-500"}`}
                        />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>


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


export default StockTable;