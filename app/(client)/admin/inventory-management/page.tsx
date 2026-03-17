"use client";

import React, { useState } from "react";
import {
  Search,
  BookMarked,
  AlertTriangle,
  CircleSlash2,
  Plus,
  ChevronDown,
  ArrowUpCircle,
  ArrowDownCircle,
  RotateCcw,
  FileText,
  Package,
  Layers,
  X,
} from "lucide-react";
import MetricCard from "@/components/admin/dashboard/MetricCard";
import HeaderUser from "@/components/admin/HeaderUser";
import HeaderNotifications from "@/components/admin/HeaderNotif";

type Tab = "overview" | "inbound" | "adjustments" | "history";

interface StockItem {
  id: number;
  sku: string;
  name: string;
  type: string;
  quantity: number;
  reserved: number;
  reorderLevel: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

interface Batch {
  id: string;
  sku: string;
  product: string;
  quantity: number;
  supplier: string;
  receivedBy: string;
  date: string;
  notes: string;
}

interface Adjustment {
  id: string;
  sku: string;
  product: string;
  type: "Add" | "Deduct" | "Set";
  quantity: number;
  reason: string;
  adjustedBy: string;
  date: string;
}

interface HistoryEntry {
  id: string;
  sku: string;
  product: string;
  movement: "Inbound" | "Adjustment" | "Consumed" | "Returned";
  quantity: number;
  before: number;
  after: number;
  reference: string;
  date: string;
}

const InventoryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Overview filters
  const [overviewSearch, setOverviewSearch] = useState("");
  const [overviewStatusFilter, setOverviewStatusFilter] = useState("All");
  const [overviewStatusOpen, setOverviewStatusOpen] = useState(false);

  // Inbound filters
  const [inboundSearch, setInboundSearch] = useState("");
  const [inboundDateFilter, setInboundDateFilter] = useState("");
  const [showInboundForm, setShowInboundForm] = useState(false);
  const [inboundForm, setInboundForm] = useState({
    sku: "",
    product: "",
    quantity: "",
    supplier: "",
    notes: "",
  });

  // Adjustment filters
  const [adjustSearch, setAdjustSearch] = useState("");
  const [adjustDateFilter, setAdjustDateFilter] = useState("");
  const [adjustTypeFilter, setAdjustTypeFilter] = useState("All");
  const [adjustTypeOpen, setAdjustTypeOpen] = useState(false);
  const [showAdjustForm, setShowAdjustForm] = useState(false);
  const [adjustForm, setAdjustForm] = useState({
    sku: "",
    product: "",
    type: "Add",
    quantity: "",
    reason: "",
    notes: "",
  });

  // History filters
  const [historySearch, setHistorySearch] = useState("");
  const [historyFilter, setHistoryFilter] = useState("All");
  const [historyFilterOpen, setHistoryFilterOpen] = useState(false);
  const [historyDateFilter, setHistoryDateFilter] = useState("");

  const stockItems: StockItem[] = [
    {
      id: 1,
      sku: "ACOEL222LED",
      name: "ACO Emergency Light",
      type: "Fixtures",
      quantity: 125,
      reserved: 20,
      reorderLevel: 50,
      status: "In Stock",
    },
    {
      id: 2,
      sku: "ARGC6104",
      name: "ARGO Electric Drill",
      type: "Fixtures",
      quantity: 192,
      reserved: 0,
      reorderLevel: 15,
      status: "In Stock",
    },
    {
      id: 3,
      sku: "BMD65003",
      name: "BMD65003",
      type: "Tiles",
      quantity: 190,
      reserved: 10,
      reorderLevel: 30,
      status: "In Stock",
    },
    {
      id: 4,
      sku: "GBY66018",
      name: "GBY66018",
      type: "Tiles",
      quantity: 192,
      reserved: 5,
      reorderLevel: 20,
      status: "In Stock",
    },
    {
      id: 5,
      sku: "GBY66038 40",
      name: "GBY66038 40",
      type: "Tiles",
      quantity: 153,
      reserved: 80,
      reorderLevel: 100,
      status: "In Stock",
    },
    {
      id: 6,
      sku: "ST14318",
      name: "Stanley Bolt Cutter",
      type: "Fixtures",
      quantity: 4,
      reserved: 0,
      reorderLevel: 10,
      status: "Low Stock",
    },
    {
      id: 7,
      sku: "STSCD711D2K",
      name: "Stanley Cordless Hammer Drill",
      type: "Fixtures",
      quantity: 0,
      reserved: 0,
      reorderLevel: 8,
      status: "Out of Stock",
    },
  ];

  const batches: Batch[] = [
    {
      id: "B-001",
      sku: "ACOEL222LED",
      product: "ACO Emergency Light",
      quantity: 25,
      supplier: "Supplier A",
      receivedBy: "Admin",
      date: "Feb 25, 2026",
      notes: "Regular restock",
    },
    {
      id: "B-002",
      sku: "BMD65003",
      product: "BMD65003",
      quantity: 50,
      supplier: "Supplier B",
      receivedBy: "Admin",
      date: "Jan 17, 2026",
      notes: "",
    },
    {
      id: "B-003",
      sku: "ST14318",
      product: "Stanley Bolt Cutter",
      quantity: 50,
      supplier: "Supplier A",
      receivedBy: "Manager",
      date: "Feb 18, 2026",
      notes: "Urgent reorder",
    },
  ];

  const adjustments: Adjustment[] = [
    {
      id: "ADJ-001",
      sku: "ARGC6104",
      product: "ARGO Electric Drill",
      type: "Deduct",
      quantity: 3,
      reason: "Damaged goods",
      adjustedBy: "Admin",
      date: "Mar 01, 2026",
    },
    {
      id: "ADJ-002",
      sku: "GBY66018",
      product: "GBY66018",
      type: "Deduct",
      quantity: 5,
      reason: "Consumed in showroom",
      adjustedBy: "Manager",
      date: "Feb 19, 2026",
    },
    {
      id: "ADJ-003",
      sku: "ST14318",
      product: "Stanley Bolt Cutter",
      type: "Add",
      quantity: 4,
      reason: "Returned by customer",
      adjustedBy: "Admin",
      date: "Jan 09, 2026",
    },
  ];

  const history: HistoryEntry[] = [
    {
      id: "H-001",
      sku: "ACOEL222LED",
      product: "ACO Emergency Light",
      movement: "Inbound",
      quantity: 25,
      before: 100,
      after: 125,
      reference: "B-001",
      date: "Feb 25, 2026",
    },
    {
      id: "H-002",
      sku: "ARGC6104",
      product: "ARGO Electric Drill",
      movement: "Adjustment",
      quantity: -3,
      before: 195,
      after: 192,
      reference: "ADJ-001",
      date: "Mar 01, 2026",
    },
    {
      id: "H-003",
      sku: "GBY66018",
      product: "GBY66018",
      movement: "Consumed",
      quantity: -5,
      before: 197,
      after: 192,
      reference: "ADJ-002",
      date: "Feb 19, 2026",
    },
    {
      id: "H-004",
      sku: "BMD65003",
      product: "BMD65003",
      movement: "Inbound",
      quantity: 50,
      before: 140,
      after: 190,
      reference: "B-002",
      date: "Jan 17, 2026",
    },
    {
      id: "H-005",
      sku: "ST14318",
      product: "Stanley Bolt Cutter",
      movement: "Returned",
      quantity: 4,
      before: 0,
      after: 4,
      reference: "ADJ-003",
      date: "Jan 09, 2026",
    },
  ];

  const filteredStock = stockItems.filter((i) => {
    const matchesSearch =
      i.name.toLowerCase().includes(overviewSearch.toLowerCase()) ||
      i.sku.toLowerCase().includes(overviewSearch.toLowerCase());
    const matchesStatus =
      overviewStatusFilter === "All" || i.status === overviewStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.product.toLowerCase().includes(inboundSearch.toLowerCase()) ||
      b.sku.toLowerCase().includes(inboundSearch.toLowerCase()) ||
      b.supplier.toLowerCase().includes(inboundSearch.toLowerCase());
    const matchesDate =
      !inboundDateFilter || b.date.includes(inboundDateFilter);
    return matchesSearch && matchesDate;
  });

  const filteredAdjustments = adjustments.filter((a) => {
    const matchesSearch =
      a.product.toLowerCase().includes(adjustSearch.toLowerCase()) ||
      a.sku.toLowerCase().includes(adjustSearch.toLowerCase());
    const matchesType =
      adjustTypeFilter === "All" || a.type === adjustTypeFilter;
    const matchesDate = !adjustDateFilter || a.date.includes(adjustDateFilter);
    return matchesSearch && matchesType && matchesDate;
  });

  const filteredHistory = history.filter((h) => {
    const matchesSearch =
      h.product.toLowerCase().includes(historySearch.toLowerCase()) ||
      h.sku.toLowerCase().includes(historySearch.toLowerCase()) ||
      h.reference.toLowerCase().includes(historySearch.toLowerCase());
    const matchesMovement =
      historyFilter === "All" || h.movement === historyFilter;
    const matchesDate =
      !historyDateFilter || h.date.includes(historyDateFilter);
    return matchesSearch && matchesMovement && matchesDate;
  });

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

  const getMovementStyles = (movement: string) => {
    switch (movement) {
      case "Inbound":
        return "text-green-600 bg-green-50";
      case "Adjustment":
        return "text-blue-600 bg-blue-50";
      case "Consumed":
        return "text-orange-500 bg-orange-50";
      case "Returned":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const getMovementIcon = (movement: string) => {
    switch (movement) {
      case "Inbound":
        return <ArrowUpCircle size={13} className="text-green-500" />;
      case "Adjustment":
        return <RotateCcw size={13} className="text-blue-500" />;
      case "Consumed":
        return <ArrowDownCircle size={13} className="text-orange-500" />;
      case "Returned":
        return <ArrowUpCircle size={13} className="text-purple-500" />;
      default:
        return null;
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Stock Overview", icon: Package },
    { key: "inbound", label: "Inbound / Receiving", icon: ArrowUpCircle },
    { key: "adjustments", label: "Adjustments", icon: RotateCcw },
    { key: "history", label: "Audit Log", icon: FileText },
  ];

  const inputClass =
    "w-full pr-9 pl-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all";
  const filterBtnClass = (active: boolean) =>
    `flex items-center gap-2 px-3 py-2 text-xs border rounded-lg font-medium transition-colors ${active ? "bg-red-600 text-white border-red-600" : "border-red-200 text-red-600 hover:bg-red-50"}`;

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
          value="287"
          color="bg-green-500"
          icon={BookMarked}
          date="Oct 2025"
          showView={true}
          viewPath="/admin/product-management"
        />
        <MetricCard
          title="Low Stock Items"
          value="25"
          color="bg-orange-500"
          icon={AlertTriangle}
          date="Oct 2025"
          showView={false}
        />
        <MetricCard
          title="Out of Stock Items"
          value="38"
          color="bg-red-500"
          icon={CircleSlash2}
          date="Oct 2025"
          showView={false}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-gray-100 shadow-sm p-1.5 mb-6 overflow-x-auto">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${activeTab === key ? "bg-red-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* ── STOCK OVERVIEW ── */}
      {activeTab === "overview" && (
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
            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
              <span className="flex items-center gap-1.5 text-xs text-orange-500 bg-orange-50 px-2.5 py-1.5 rounded-lg font-medium">
                <AlertTriangle size={12} />
                {stockItems.filter((i) => i.status === "Low Stock").length} low
                stock
              </span>
              <span className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2.5 py-1.5 rounded-lg font-medium">
                <CircleSlash2 size={12} />
                {
                  stockItems.filter((i) => i.status === "Out of Stock").length
                }{" "}
                out of stock
              </span>

              {/* Search */}
              <div className="relative group">
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none group-focus-within:text-red-600 transition-colors">
                  <Search size={13} />
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  value={overviewSearch}
                  onChange={(e) => setOverviewSearch(e.target.value)}
                  className="pr-8 pl-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all w-48"
                />
              </div>

              {/* Status filter */}
              <div className="relative">
                <button
                  onClick={() => setOverviewStatusOpen(!overviewStatusOpen)}
                  className={filterBtnClass(overviewStatusOpen)}
                >
                  {overviewStatusFilter} <ChevronDown size={13} />
                </button>
                {overviewStatusOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                    {["All", "In Stock", "Low Stock", "Out of Stock"].map(
                      (f) => (
                        <button
                          key={f}
                          className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${f === overviewStatusFilter ? "text-red-600 font-medium" : "text-gray-600"}`}
                          onClick={() => {
                            setOverviewStatusFilter(f);
                            setOverviewStatusOpen(false);
                          }}
                        >
                          {f}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-y border-gray-100">
                  <th className="py-3 pl-6 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold text-center">SKU</th>
                  <th className="py-3 px-4 font-semibold text-center">
                    On Hand
                  </th>
                  <th className="py-3 px-4 font-semibold text-center">
                    Reserved
                  </th>
                  <th className="py-3 px-4 font-semibold text-center">
                    Available
                  </th>
                  <th className="py-3 px-4 font-semibold text-center">
                    Reorder At
                  </th>
                  <th className="py-3 pr-6 font-semibold text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStock.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-xs text-gray-400"
                    >
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredStock.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <td className="py-3.5 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-400">{item.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-500 text-center font-mono">
                        {item.sku}
                      </td>
                      <td className="py-3.5 px-4 text-sm font-semibold text-gray-900 text-center">
                        {item.quantity}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-500 text-center">
                        {item.reserved}
                      </td>
                      <td className="py-3.5 px-4 text-sm font-medium text-center">
                        <span
                          className={
                            item.quantity - item.reserved <= 0
                              ? "text-red-600"
                              : "text-gray-900"
                          }
                        >
                          {item.quantity - item.reserved}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-500 text-center">
                        {item.reorderLevel}
                      </td>
                      <td className="py-3.5 pr-6 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(item.status)}`}
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
          </div>

          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Showing {filteredStock.length} of {stockItems.length} products
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
      )}

      {/* ── INBOUND / RECEIVING ── */}
      {activeTab === "inbound" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Inbound Batches
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Record stock received from suppliers. Each entry creates a new
                batch and updates stock levels.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
              {/* Search */}
              <div className="relative group">
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none group-focus-within:text-red-600 transition-colors">
                  <Search size={13} />
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  value={inboundSearch}
                  onChange={(e) => setInboundSearch(e.target.value)}
                  className="pr-8 pl-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all w-52"
                />
              </div>

              {/* Month filter */}
              <input
                type="month"
                value={inboundDateFilter}
                onChange={(e) => setInboundDateFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-red-200 text-red-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-white transition-all"
              />
              {inboundDateFilter && (
                <button
                  onClick={() => setInboundDateFilter("")}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X size={13} />
                </button>
              )}

              <button
                onClick={() => setShowInboundForm(!showInboundForm)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Plus size={14} />
                Receive Stock
              </button>
            </div>
          </div>

          {showInboundForm && (
            <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Layers size={15} className="text-red-600" />
                New Inbound Entry
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    SKU
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. EL-00547"
                    value={inboundForm.sku}
                    onChange={(e) =>
                      setInboundForm({ ...inboundForm, sku: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="Product name"
                    value={inboundForm.product}
                    onChange={(e) =>
                      setInboundForm({
                        ...inboundForm,
                        product: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Quantity Received
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={inboundForm.quantity}
                    onChange={(e) =>
                      setInboundForm({
                        ...inboundForm,
                        quantity: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Supplier
                  </label>
                  <input
                    type="text"
                    placeholder="Supplier name"
                    value={inboundForm.supplier}
                    onChange={(e) =>
                      setInboundForm({
                        ...inboundForm,
                        supplier: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Notes (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Any notes about this batch"
                    value={inboundForm.notes}
                    onChange={(e) =>
                      setInboundForm({ ...inboundForm, notes: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => setShowInboundForm(false)}
                  className="px-4 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                  Confirm Receipt
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  <th className="py-3 pl-5 font-semibold">Batch ID</th>
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold text-center">Qty</th>
                  <th className="py-3 px-4 font-semibold">Supplier</th>
                  <th className="py-3 px-4 font-semibold">Received By</th>
                  <th className="py-3 pr-5 font-semibold text-center">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBatches.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-xs text-gray-400"
                    >
                      No batches found.
                    </td>
                  </tr>
                ) : (
                  filteredBatches.map((batch) => (
                    <tr
                      key={batch.id}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <td className="py-3.5 pl-5 text-xs font-mono text-red-600 font-medium">
                        {batch.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-sm font-medium text-gray-900">
                          {batch.product}
                        </p>
                        <p className="text-xs text-gray-400">{batch.sku}</p>
                      </td>
                      <td className="py-3.5 px-4 text-sm font-semibold text-green-600 text-center">
                        +{batch.quantity}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-500">
                        {batch.supplier}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-500">
                        {batch.receivedBy}
                      </td>
                      <td className="py-3.5 pr-5 text-xs text-gray-400 text-center whitespace-nowrap">
                        {batch.date}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Showing {filteredBatches.length} of {batches.length} batches
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
      )}

      {/* ── ADJUSTMENTS ── */}
      {activeTab === "adjustments" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Stock Adjustments
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Manually correct stock levels due to damage, returns, showroom
                use, or counting discrepancies.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
              {/* Search */}
              <div className="relative group">
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none group-focus-within:text-red-600 transition-colors">
                  <Search size={13} />
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  value={adjustSearch}
                  onChange={(e) => setAdjustSearch(e.target.value)}
                  className="pr-8 pl-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all w-48"
                />
              </div>

              {/* Type filter */}
              <div className="relative">
                <button
                  onClick={() => setAdjustTypeOpen(!adjustTypeOpen)}
                  className={filterBtnClass(adjustTypeOpen)}
                >
                  {adjustTypeFilter} <ChevronDown size={13} />
                </button>
                {adjustTypeOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                    {["All", "Add", "Deduct", "Set"].map((f) => (
                      <button
                        key={f}
                        className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${f === adjustTypeFilter ? "text-red-600 font-medium" : "text-gray-600"}`}
                        onClick={() => {
                          setAdjustTypeFilter(f);
                          setAdjustTypeOpen(false);
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Month filter */}
              <input
                type="month"
                value={adjustDateFilter}
                onChange={(e) => setAdjustDateFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-red-200 text-red-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-white transition-all"
              />
              {adjustDateFilter && (
                <button
                  onClick={() => setAdjustDateFilter("")}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X size={13} />
                </button>
              )}

              <button
                onClick={() => setShowAdjustForm(!showAdjustForm)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Plus size={14} />
                New Adjustment
              </button>
            </div>
          </div>

          {showAdjustForm && (
            <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <RotateCcw size={15} className="text-red-600" />
                Adjustment Form
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    SKU
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. EL-00547"
                    value={adjustForm.sku}
                    onChange={(e) =>
                      setAdjustForm({ ...adjustForm, sku: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="Product name"
                    value={adjustForm.product}
                    onChange={(e) =>
                      setAdjustForm({ ...adjustForm, product: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Adjustment Type
                  </label>
                  <select
                    value={adjustForm.type}
                    onChange={(e) =>
                      setAdjustForm({
                        ...adjustForm,
                        type: e.target.value as "Add" | "Deduct" | "Set",
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                  >
                    <option value="Add">Add — increase stock</option>
                    <option value="Deduct">Deduct — decrease stock</option>
                    <option value="Set">Set — override to exact value</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={adjustForm.quantity}
                    onChange={(e) =>
                      setAdjustForm({ ...adjustForm, quantity: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Reason
                  </label>
                  <select
                    value={adjustForm.reason}
                    onChange={(e) =>
                      setAdjustForm({ ...adjustForm, reason: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                  >
                    <option value="">Select a reason</option>
                    <option>Damaged goods</option>
                    <option>Consumed in showroom</option>
                    <option>Returned by customer</option>
                    <option>Counting discrepancy</option>
                    <option>Theft / Loss</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => setShowAdjustForm(false)}
                  className="px-4 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                  Apply Adjustment
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  <th className="py-3 pl-5 font-semibold">Ref ID</th>
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold text-center">Type</th>
                  <th className="py-3 px-4 font-semibold text-center">Qty</th>
                  <th className="py-3 px-4 font-semibold">Reason</th>
                  <th className="py-3 px-4 font-semibold">Adjusted By</th>
                  <th className="py-3 pr-5 font-semibold text-center">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAdjustments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-xs text-gray-400"
                    >
                      No adjustments found.
                    </td>
                  </tr>
                ) : (
                  filteredAdjustments.map((adj) => (
                    <tr
                      key={adj.id}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <td className="py-3.5 pl-5 text-xs font-mono text-blue-600 font-medium">
                        {adj.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-sm font-medium text-gray-900">
                          {adj.product}
                        </p>
                        <p className="text-xs text-gray-400">{adj.sku}</p>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${adj.type === "Add" ? "text-green-600 bg-green-50" : adj.type === "Deduct" ? "text-red-600 bg-red-50" : "text-blue-600 bg-blue-50"}`}
                        >
                          {adj.type}
                        </span>
                      </td>
                      <td
                        className={`py-3.5 px-4 text-sm font-semibold text-center ${adj.type === "Add" ? "text-green-600" : "text-red-600"}`}
                      >
                        {adj.type === "Add" ? "+" : "-"}
                        {adj.quantity}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-500">
                        {adj.reason}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-500">
                        {adj.adjustedBy}
                      </td>
                      <td className="py-3.5 pr-5 text-xs text-gray-400 text-center whitespace-nowrap">
                        {adj.date}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Showing {filteredAdjustments.length} of {adjustments.length}{" "}
              adjustments
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
      )}

      {/* ── AUDIT LOG ── */}
      {activeTab === "history" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Audit Log
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Complete history of all stock movements — inbound, adjustments,
                consumption, and returns.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
              {/* Search */}
              <div className="relative group">
                <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none group-focus-within:text-red-600 transition-colors">
                  <Search size={13} />
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="pr-8 pl-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all w-48"
                />
              </div>

              {/* Movement filter */}
              <div className="relative">
                <button
                  onClick={() => setHistoryFilterOpen(!historyFilterOpen)}
                  className={filterBtnClass(historyFilterOpen)}
                >
                  {historyFilter} <ChevronDown size={13} />
                </button>
                {historyFilterOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                    {[
                      "All",
                      "Inbound",
                      "Adjustment",
                      "Consumed",
                      "Returned",
                    ].map((f) => (
                      <button
                        key={f}
                        className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${f === historyFilter ? "text-red-600 font-medium" : "text-gray-600"}`}
                        onClick={() => {
                          setHistoryFilter(f);
                          setHistoryFilterOpen(false);
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Month filter */}
              <input
                type="month"
                value={historyDateFilter}
                onChange={(e) => setHistoryDateFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-red-200 text-red-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-white transition-all"
              />
              {historyDateFilter && (
                <button
                  onClick={() => setHistoryDateFilter("")}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  <th className="py-3 pl-5 font-semibold">Movement</th>
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold text-center">
                    Qty Change
                  </th>
                  <th className="py-3 px-4 font-semibold text-center">
                    Before
                  </th>
                  <th className="py-3 px-4 font-semibold text-center">After</th>
                  <th className="py-3 px-4 font-semibold">Reference</th>
                  <th className="py-3 pr-5 font-semibold text-center">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-xs text-gray-400"
                    >
                      No history found.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((entry) => (
                    <tr
                      key={entry.id}
                      className="hover:bg-gray-100 transition-colors"
                    >
                      <td className="py-3.5 pl-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getMovementStyles(entry.movement)}`}
                        >
                          {getMovementIcon(entry.movement)}
                          {entry.movement}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-sm font-medium text-gray-900">
                          {entry.product}
                        </p>
                        <p className="text-xs text-gray-400">{entry.sku}</p>
                      </td>
                      <td
                        className={`py-3.5 px-4 text-sm font-semibold text-center ${entry.quantity > 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {entry.quantity > 0
                          ? `+${entry.quantity}`
                          : entry.quantity}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-500 text-center">
                        {entry.before}
                      </td>
                      <td className="py-3.5 px-4 text-sm font-semibold text-gray-900 text-center">
                        {entry.after}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-gray-500">
                        {entry.reference}
                      </td>
                      <td className="py-3.5 pr-5 text-xs text-gray-400 text-center whitespace-nowrap">
                        {entry.date}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Showing {filteredHistory.length} of {history.length} entries
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
      )}
    </div>
  );
};

export default InventoryManagement;
