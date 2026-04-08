"use client";

import React, { useMemo, useState } from "react";
import {
  BookMarked,
  AlertTriangle,
  CircleSlash2,
  ArrowUpCircle,
  RotateCcw,
  FileText,
  Package,
} from "lucide-react";
import MetricCard from "@/components/admin/dashboard/MetricCard";
import HeaderUser from "@/components/admin/HeaderUser";
import HeaderNotifications from "@/components/admin/HeaderNotif";
import { useStockData } from "./hooks/useStockData";
import { useInboundData } from "./hooks/useInboundData";
import { useAdjustmentData } from "./hooks/useAdjustmentData";
import { useMovementData } from "./hooks/useMovementData";
import { useInventoryParams } from "./hooks/useInventoryParams";
import { AdjustmentRow, InboundRow, MovementRow, TabType } from "./types";
import StockTable from "./components/StockTable";
import InboundTable from "./components/InboundTable";
import AdjustmentTable from "./components/AdjustmentTable";
import AuditLogTable from "./components/AuditLogTable";

const tabs: { key: TabType; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Stock Overview", icon: Package },
  { key: "inbound", label: "Inbound / Receiving", icon: ArrowUpCircle },
  { key: "adjustments", label: "Adjustments", icon: RotateCcw },
  { key: "audit", label: "Audit Log", icon: FileText },
];

const InventoryManagement: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
  } = useInventoryParams();

  const {
    rows: stockRows,
    loading: stockLoading,
    fetchStockData,
  } = useStockData();
  const {
    rows: inboundRows,
    loading: inboundLoading,
    fetchInboundData,
  } = useInboundData();
  const {
    rows: adjustmentRows,
    loading: adjustmentLoading,
    fetchAdjustmentData,
  } = useAdjustmentData();
  const {
    rows: movementRows,
    loading: movementLoading,
    fetchMovementData,
  } = useMovementData();

  const handleInboundSaved = () => {
    fetchInboundData();
    fetchStockData();
    fetchMovementData();
  };

  const handleAdjustmentSaved = () => {
    fetchAdjustmentData();
    fetchStockData();
    fetchMovementData();
  };

  const [sortConfig, setSortConfig] = useState<{
    field: string;
    dir: "asc" | "desc";
  }>({
    field: "product_name",
    dir: "asc",
  });

  const handleSort = (field: string) => {
    setSortConfig((prev) => ({
      field,
      dir: prev.field === field && prev.dir === "asc" ? "desc" : "asc",
    }));
  };

  const sortedStockRows = useMemo(() => {
    return [...stockRows].sort((a, b) => {
      const dir = sortConfig.dir === "asc" ? 1 : -1;
      const field = sortConfig.field as keyof typeof a;

      const valA = a[field];
      const valB = b[field];

      if (typeof valA === "number" && typeof valB === "number") {
        return (valA - valB) * dir;
      }
      return String(valA || "").localeCompare(String(valB || "")) * dir;
    });
  }, [stockRows, sortConfig]);

  const sortedInboundRows = useMemo(() => {
    return [...inboundRows].sort((a, b) => {
      const dir = sortConfig.dir === "asc" ? 1 : -1;
      const field = sortConfig.field as keyof InboundRow;

      const valA = a[field];
      const valB = b[field];

      if (typeof valA === "number" && typeof valB === "number") {
        return (valA - valB) * dir;
      }

      return (
        String(valA || "")
          .toLowerCase()
          .localeCompare(String(valB || "").toLowerCase()) * dir
      );
    });
  }, [inboundRows, sortConfig]);

  const sortedAdjustmentRows = useMemo(() => {
    return [...adjustmentRows].sort((a, b) => {
      const dir = sortConfig.dir === "asc" ? 1 : -1;
      const field = sortConfig.field as keyof AdjustmentRow;

      const valA = a[field];
      const valB = b[field];

      if (typeof valA === "number" && typeof valB === "number") {
        return (valA - valB) * dir;
      }

      return (
        String(valA || "")
          .toLowerCase()
          .localeCompare(String(valB || "").toLowerCase()) * dir
      );
    });
  }, [adjustmentRows, sortConfig]);

  const sortedMovementRows = useMemo(() => {
    return [...movementRows].sort((a, b) => {
      const dir = sortConfig.dir === "asc" ? 1 : -1;
      const field = sortConfig.field as keyof MovementRow;

      if (typeof a[field] === "number") {
        return ((a[field] as number) - (b[field] as number)) * dir;
      }

      return (
        String(a[field] || "")
          .toLowerCase()
          .localeCompare(String(b[field] || "").toLowerCase()) * dir
      );
    });
  }, [movementRows, sortConfig]);

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full gap-4">
        <div className="shrink-0">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
            Management
          </p>
          <h1 className="text-lg font-semibold text-gray-900">Inventory</h1>
        </div>
        <div className="hidden lg:flex items-center gap-1">
          <HeaderNotifications />
          <HeaderUser />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <MetricCard
          title="Total Products"
          value={String(stockRows.length)}
          color="bg-green-500"
          icon={BookMarked}
          showView={true}
          viewPath="/admin/product-management"
        />
        <MetricCard
          title="Low Stock Items"
          value={String(
            stockRows.filter(
              (r: { status: string }) => r.status === "Low Stock",
            ).length,
          )}
          color="bg-orange-500"
          icon={AlertTriangle}
          showView={false}
        />
        <MetricCard
          title="Out of Stock Items"
          value={String(
            stockRows.filter(
              (r: { status: string }) => r.status === "Out of Stock",
            ).length,
          )}
          color="bg-red-500"
          icon={CircleSlash2}
          showView={false}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-gray-100 shadow-sm p-1.5 mb-6 overflow-x-auto">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === key
                ? "bg-red-600 text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <StockTable
          rows={sortedStockRows}
          loading={stockLoading}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      )}
      {activeTab === "inbound" && (
        <InboundTable
          rows={sortedInboundRows}
          loading={inboundLoading}
          onSaved={handleInboundSaved}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      )}
      {activeTab === "adjustments" && (
        <AdjustmentTable
          rows={sortedAdjustmentRows}
          loading={adjustmentLoading}
          onSaved={handleAdjustmentSaved}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      )}
      {activeTab === "audit" && (
        <AuditLogTable
          rows={sortedMovementRows}
          loading={movementLoading}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      )}
    </div>
  );
};

export default InventoryManagement;
