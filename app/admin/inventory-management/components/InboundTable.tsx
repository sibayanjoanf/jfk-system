"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  Plus,
  RotateCcw,
  Loader2,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { AdjustmentRow } from "../types";
import Pagination from "./Pagination";
import CalendarPicker, { DateFilter } from "@/components/admin/CalendarPicker";

interface VariantOption {
  id: string;
  sku: string;
  name: string;
  image_url: string | null;
  stock_qty: number;
  category: string;
}

interface AdjustmentTableProps {
  rows: AdjustmentRow[];
  loading: boolean;
  onSaved: () => void;
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

const AdjustmentTable: React.FC<AdjustmentTableProps> = ({
  rows,
  loading,
  onSaved,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  sortConfig,
  onSort,
}) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [typeOpen, setTypeOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [variantSearch, setVariantSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [quantityError, setQuantityError] = useState("");
  const [productError, setProductError] = useState("");
  const [reasonError, setReasonError] = useState("");
  
  const typeRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    variant_id: "",
    sku: "",
    product: "",
    image_url: null as string | null,
    stock_qty: 0,
    type: "Add" as "Add" | "Deduct" | "Set",
    quantity: "",
    reason: "",
  });

  const filtered = useMemo(
    () =>
      rows.filter((a) => {
        const q = search.toLowerCase();
        const matchesSearch =
          a.product_name.toLowerCase().includes(q) ||
          a.sku.toLowerCase().includes(q);
        const matchesType =
          typeFilter === "All" ||
          a.adjustment_type.toLowerCase() === typeFilter.toLowerCase();
        const matchesDate =
          !dateFilter ||
          (() => {
            const d = new Date(a.created_at ?? "");
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
        return matchesSearch && matchesType && matchesDate;
      }),
    [rows, search, typeFilter, dateFilter, sortConfig],
  );

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) {
        setTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchVariants = async () => {
    const { data } = await supabase
      .from("product_variants")
      .select(
        `
        id, sku, stock_qty, image_url,
        products (
          name,
          sub_categories ( name, categories ( name ) )
        )
      `,
      )
      .order("sku");
    if (data) {
      setVariantOptions(
        (
          data as unknown as {
            id: string;
            sku: string;
            stock_qty: number;
            image_url: string | null;
            products: {
              name: string;
              sub_categories: {
                name: string;
                categories: { name: string } | null;
              } | null;
            } | null;
          }[]
        ).map((v) => ({
          id: v.id,
          sku: v.sku,
          name: v.products?.name ?? "—",
          image_url: v.image_url,
          stock_qty: v.stock_qty,
          category: v.products?.sub_categories?.categories?.name ?? "—",
        })),
      );
    }
  };

  const handleOpenForm = () => {
    fetchVariants();
    setShowForm(true);
    setDropdownOpen(false);
    setVariantSearch("");
    setProductError("");
    setQuantityError("");
    setReasonError("");
  };

  const handleSelectVariant = (v: VariantOption) => {
    setForm((prev) => ({
      ...prev,
      variant_id: v.id,
      sku: v.sku,
      product: v.name,
      image_url: v.image_url,
      stock_qty: v.stock_qty,
    }));
    setProductError("");
    setDropdownOpen(false);
    setVariantSearch("");
  };

  const filteredVariants = variantOptions.filter(
    (v) =>
      v.sku.toLowerCase().includes(variantSearch.toLowerCase()) ||
      v.name.toLowerCase().includes(variantSearch.toLowerCase()),
  );

  const handleSave = async () => {
    let hasError = false;

    if (!form.variant_id) {
      setProductError("Please select a product");
      hasError = true;
    } else {
      setProductError("");
    }

    if (!form.quantity || Number(form.quantity) <= 0) {
      setQuantityError("Quantity must be greater than 0");
      hasError = true;
    }

    if (!form.reason) {
      setReasonError("Please select a reason");
      hasError = true;
    } else {
      setReasonError("");
    }

    if (hasError) return;

    if (form.type === "Deduct" && Number(form.quantity) > form.stock_qty) {
      setQuantityError(
        `Cannot deduct ${form.quantity} units. Only ${form.stock_qty} in stock.`,
      );
      return;
    }

    if (form.type === "Set" && Number(form.quantity) < 0) {
      setQuantityError("Stock cannot be set to a negative value.");
      return;
    }

    setSaving(true);
    const { error } = await supabase.rpc("record_adjustment", {
      p_variant_id: form.variant_id,
      p_quantity: Number(form.quantity),
      p_adjustment_type: form.type.toLowerCase(),
      p_notes: form.reason || null,
      p_adjusted_by: null,
    });
    if (error) {
      alert(`Error: ${error.message}`);
      setSaving(false);
      return;
    }
    setQuantityError("");
    setForm({
      variant_id: "",
      sku: "",
      product: "",
      image_url: null,
      stock_qty: 0,
      type: "Add",
      quantity: "",
      reason: "",
    });
    setShowForm(false);
    setSaving(false);
    onSaved();
  };

  const filterBtnClass = (active: boolean) =>
    `flex items-center gap-2 px-3 py-2 text-xs border rounded-lg font-medium transition-colors ${active ? "bg-red-600 text-white border-red-600" : "border-red-200 text-red-600 hover:bg-red-50"}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Stock Adjustments
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Manually correct stock levels due to damage, returns, showroom use,
            or counting discrepancies.
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
          <div className="relative" ref={typeRef}>
            <button
              onClick={() => setTypeOpen(!typeOpen)}
              className={filterBtnClass(typeOpen)}
            >
              {typeFilter} <ChevronDown size={13} />
            </button>
            {typeOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                {["All", "Add", "Deduct", "Set"].map((f) => (
                  <button
                    key={f}
                    className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${f === typeFilter ? "text-red-600 font-medium" : "text-gray-600"}`}
                    onClick={() => {
                      setTypeFilter(f);
                      setTypeOpen(false);
                      onPageChange(1);
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          <CalendarPicker
            value={dateFilter}
            onChange={(f) => {
              setDateFilter(f);
              onPageChange(1);
            }}
          />

          <button
            onClick={handleOpenForm}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Plus size={14} />
            New Adjustment
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6 p-5 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <RotateCcw size={15} className="text-red-600" />
            Adjustment Form
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {/* ── Product picker ── */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Product / SKU <span className="text-red-600">*</span>
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 bg-white border rounded-lg hover:border-red-300 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all text-left ${productError ? "border-red-400" : "border-gray-200"}`}
                >
                  {form.variant_id ? (
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        {form.image_url ? (
                          <Image
                            src={form.image_url}
                            alt={form.product}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-lg" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {form.product}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          {form.sku} · {form.stock_qty} in stock
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      Select a product...
                    </span>
                  )}
                  <ChevronDown size={14} className="text-gray-400 shrink-0" />
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-2.5 border-b border-gray-100">
                      <div className="relative">
                        <Search
                          size={13}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                        <input
                          type="text"
                          placeholder="Search SKU or product name..."
                          value={variantSearch}
                          onChange={(e) => setVariantSearch(e.target.value)}
                          autoFocus
                          className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {filteredVariants.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-6">
                          No products found.
                        </p>
                      ) : (
                        filteredVariants.map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => handleSelectVariant(v)}
                            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0 ${v.id === form.variant_id ? "bg-red-50" : ""}`}
                          >
                            <div className="relative w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                              {v.image_url ? (
                                <Image
                                  src={v.image_url}
                                  alt={v.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 rounded-lg" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm font-medium truncate ${v.id === form.variant_id ? "text-red-600" : "text-gray-900"}`}
                              >
                                {v.name}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-mono text-gray-400">
                                  {v.sku}
                                </span>
                                <span className="text-gray-300">·</span>
                                <span className="text-xs text-gray-400">
                                  {v.category}
                                </span>
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <p
                                className={`text-xs font-semibold ${v.stock_qty <= 0 ? "text-red-500" : v.stock_qty <= 10 ? "text-orange-500" : "text-gray-700"}`}
                              >
                                {v.stock_qty}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                in stock
                              </p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              {productError && (
                <p className="text-xs text-red-500 mt-1">{productError}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Adjustment Type <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value as "Add" | "Deduct" | "Set",
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all appearance-none"
                >
                  <option value="Add">Add (increase stock)</option>
                  <option value="Deduct">Deduct (decrease stock)</option>
                  <option value="Set">Set (override to exact value)</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Quantity <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={15}
                placeholder="0"
                value={form.quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) setForm({ ...form, quantity: val });
                  setQuantityError("");
                }}
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all ${quantityError ? "border-red-400" : "border-gray-200"}`}
              />
              {quantityError && (
                <p className="text-xs text-red-500 mt-1">{quantityError}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Reason <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.reason}
                  onChange={(e) => {
                    setForm({ ...form, reason: e.target.value });
                    setReasonError("");
                  }}
                  className={`appearance-none w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all ${reasonError ? "border-red-400" : "border-gray-200"}`}
                >
                  <option value="" disabled hidden>
                    Select a reason
                  </option>
                  <option value="Damaged goods">Damaged goods</option>
                  <option value="Consumed in showroom">Consumed in showroom</option>
                  <option value="Returned by customer">Returned by customer</option>
                  <option value="Counting discrepancy">Counting discrepancy</option>
                  <option value="Theft / Loss">Theft / Loss</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
              {reasonError && (
                <p className="text-xs text-red-500 mt-1">{reasonError}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Apply Adjustment"
              )}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
            <Loader2 className="animate-spin" size={20} />
            <p className="text-sm">Loading adjustments...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th
                  className="py-3 pl-5 font-semibold cursor-pointer select-none hover:text-gray-600 transition-colors"
                  onClick={() => onSort("adjustment_code")}
                >
                  <span className="inline-flex items-center gap-1">
                    Ref ID
                    <SortArrows field="adjustment_code" current={sortConfig} />
                  </span>
                </th>
                <th
                  className="py-3 pl-5 font-semibold cursor-pointer select-none hover:text-gray-600 transition-colors"
                  onClick={() => onSort("product_name")}
                >
                  <span className="inline-flex items-center gap-1">
                    Product
                    <SortArrows field="product_name" current={sortConfig} />
                  </span>
                </th>
                <th className="py-3 px-4 font-semibold text-center">Type</th>
                <th
                  className="py-3 pl-5 font-semibold cursor-pointer select-none hover:text-gray-600 transition-colors"
                  onClick={() => onSort("quantity")}
                >
                  <span className="inline-flex items-center gap-1">
                    Quantity
                    <SortArrows field="quantity" current={sortConfig} />
                  </span>
                </th>
                <th className="py-3 px-4 font-semibold">Reason</th>
                <th className="py-3 px-4 font-semibold">Adjusted By</th>
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
                    No adjustments found.
                  </td>
                </tr>
              ) : (
                paginated.map((adj) => (
                  <tr
                    key={adj.id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="py-3.5 pl-5 text-xs font-mono text-blue-600 font-medium">
                      {adj.adjustment_code}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-sm font-medium text-gray-900">
                        {adj.product_name}
                      </p>
                      <p className="text-xs text-gray-400">{adj.sku}</p>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${adj.adjustment_type === "add" ? "text-green-600 bg-green-50" : adj.adjustment_type === "deduct" ? "text-red-600 bg-red-50" : "text-blue-600 bg-blue-50"}`}
                      >
                        {adj.adjustment_type.charAt(0).toUpperCase() +
                          adj.adjustment_type.slice(1)}
                      </span>
                    </td>
                    <td
                      className={`py-3.5 px-4 text-sm font-semibold text-center ${
                        adj.adjustment_type === "add"
                          ? "text-green-600"
                          : adj.adjustment_type === "deduct"
                            ? "text-red-600"
                            : "text-blue-600"
                      }`}
                    >
                      {adj.adjustment_type === "add"
                        ? "+"
                        : adj.adjustment_type === "deduct"
                          ? "-"
                          : "="}
                      {adj.quantity}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      {adj.notes ?? "—"}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      {adj.adjusted_by ?? "—"}
                    </td>
                    <td className="py-3.5 pr-5 text-xs text-gray-500 text-center whitespace-nowrap">
                      <p>
                        {new Date(adj.created_at).toLocaleDateString("en-PH", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(adj.created_at).toLocaleTimeString("en-PH", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
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

export default AdjustmentTable;