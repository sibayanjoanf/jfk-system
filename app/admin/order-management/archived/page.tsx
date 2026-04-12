"use client";

import React, { useState, useMemo } from "react";
import { Search, ShoppingCart, Archive } from "lucide-react";
import Link from "next/link";
import HeaderUser from "@/components/admin/HeaderUser";
import HeaderNotifications from "@/components/admin/HeaderNotif";
import { useArchivedOrderData } from "../hooks/useArchivedOrderData";
import { useOrderMutations } from "../hooks/useOrderMutations";
import ArchivedOrderTable from "./components/ArchivedOrderTable";

const ArchivedOrderManagement: React.FC = () => {
  const { rows, loading, fetchArchivedOrders, restoreFromLocal } =
    useArchivedOrderData();
  const { restoreOrders } = useOrderMutations();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    dir: "asc" | "desc";
  }>({
    field: "order_number",
    dir: "desc",
  });

  const handleSort = (field: string) => {
    setSortConfig((prev) => ({
      field,
      dir: prev.field === field && prev.dir === "asc" ? "desc" : "asc",
    }));
  };

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const dir = sortConfig.dir === "asc" ? 1 : -1;
      const field = sortConfig.field as keyof typeof a;
      const valA = a[field];
      const valB = b[field];
      if (typeof valA === "number" && typeof valB === "number")
        return (valA - valB) * dir;
      return (
        String(valA || "")
          .toLowerCase()
          .localeCompare(String(valB || "").toLowerCase()) * dir
      );
    });
  }, [rows, sortConfig]);

  const handleRestore = async (ids: string[]) => {
    const { error } = await restoreOrders(ids);
    if (error) {
      alert(`Error: ${error}`);
      return;
    }
    restoreFromLocal(ids);
  };

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full gap-4">
        <div className="flex items-center gap-6 flex-1">
          <div className="shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
              Management
            </p>
            <h1 className="text-lg font-semibold text-gray-900">Orders</h1>
          </div>
          <div className="relative group max-w-sm flex-1">
            <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none group-focus-within:text-red-600 transition-colors">
              <Search size={13} />
            </span>
            <input
              type="text"
              placeholder="Search by order ID, name, email, phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pr-8 pl-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
            />
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-1">
          <HeaderNotifications />
          <HeaderUser />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-gray-100 shadow-sm p-1.5 mb-6 overflow-x-auto">
        <Link
          href="/admin/order-management"
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors text-gray-500 hover:bg-gray-100"
        >
          <ShoppingCart size={13} />
          Orders
        </Link>
        <Link
          href="/admin/order-management/archived"
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors bg-red-600 text-white shadow-sm"
        >
          <Archive size={13} />
          Archived
        </Link>
      </div>

      <ArchivedOrderTable
        rows={sortedRows}
        loading={loading}
        search={search}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        sortConfig={sortConfig}
        onSort={handleSort}
        onRestore={handleRestore}
        onRefresh={fetchArchivedOrders}
      />
    </div>
  );
};

export default ArchivedOrderManagement;
