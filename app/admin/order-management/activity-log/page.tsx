"use client";

import React, { useState, useMemo } from "react";
import { Search, ShoppingCart, Archive, Activity } from "lucide-react";
import Link from "next/link";
import HeaderUser from "@/components/admin/HeaderUser";
import HeaderNotifications from "@/components/admin/HeaderNotif";
import { useActivityLogData } from "../hooks/useActivityLogData";
import ActivityLogTable from "../components/ActivityLogTable";
import { useCurrentUser } from "../hooks/useCurrentUser";

const ActivityLogPage: React.FC = () => {
  const { rows, loading } = useActivityLogData();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { currentUser } = useCurrentUser();
  const permissions = currentUser?.permissions;
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    dir: "asc" | "desc";
  }>({ field: "changed_at", dir: "desc" });

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
              placeholder="Search by order ID or user..."
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
        {permissions?.orders.archive && (
          <Link
            href="/admin/order-management/archived"
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors text-gray-500 hover:bg-gray-100"
          >
            <Archive size={13} />
            Archived
          </Link>
        )}
        <Link
          href="/admin/order-management/activity-log"
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors bg-red-600 text-white shadow-sm"
        >
          <Activity size={13} />
          Activity Log
        </Link>
      </div>

      <ActivityLogTable
        rows={sortedRows}
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
    </div>
  );
};

export default ActivityLogPage;
