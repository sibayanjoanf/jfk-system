"use client";

import React, { useMemo, useState } from "react";
import { FileText, ShoppingCart, Search } from "lucide-react";
import HeaderUser from "@/components/admin/HeaderUser";
import HeaderNotifications from "@/components/admin/HeaderNotif";
import { useOrderData } from "./hooks/useOrderData";
import OrderTable from "./components/OrderTable";
import CreateOrderModal from "./components/CreateOrderModal";
import InvoiceTemplate from "./components/InvoiceTemplate";

type TabType = "orders" | "invoice";

const tabs: { key: TabType; label: string; icon: React.ElementType }[] = [
  { key: "orders", label: "Orders", icon: ShoppingCart },
  { key: "invoice", label: "Invoice Template", icon: FileText },
];

const OrderManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("orders");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState("");
  const { rows, loading, fetchOrders } = useOrderData();
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

      if (typeof valA === "number" && typeof valB === "number") {
        return (valA - valB) * dir;
      }

      const strA = String(valA || "").toLowerCase();
      const strB = String(valB || "").toLowerCase();
      return strA.localeCompare(strB) * dir;
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

          {/* Search */}
          {activeTab === "orders" && (
            <div className="relative group max-w-sm flex-1">
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none group-focus-within:text-red-600 transition-colors">
                <Search size={13} />
              </span>
              <input
                type="text"
                placeholder="Search by order ID, name, email, phone..."
                value={search}
                maxLength={50}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pr-8 pl-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
              />
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-1">
          <HeaderNotifications />
          <HeaderUser />
        </div>
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

      {/* Tab Content */}
      {activeTab === "orders" && (
        <OrderTable
          rows={sortedRows}
          loading={loading}
          onRefresh={fetchOrders}
          onCreateOrder={() => setShowCreateModal(true)}
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
        />
      )}

      {activeTab === "invoice" && <InvoiceTemplate />}

      {showCreateModal && (
        <CreateOrderModal
          onClose={() => setShowCreateModal(false)}
          onSaved={() => {
            fetchOrders();
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

export default OrderManagement;
