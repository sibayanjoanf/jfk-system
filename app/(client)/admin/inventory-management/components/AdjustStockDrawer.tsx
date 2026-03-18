"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdjustmentForm, emptyAdjustmentForm, StockRow } from "../types";

interface VariantOption {
  id: string;
  sku: string;
  product_name: string;
  stock_qty: number;
}

interface AdjustStockDrawerProps {
  open: boolean;
  prefillRow?: StockRow | null;
  onClose: () => void;
  onSaved: () => void;
}

const inputClass =
  "w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all";
const labelClass = "block text-xs font-medium text-gray-700 mb-1.5";
const errorClass = "text-xs text-red-500 mt-1";

const ADJUSTMENT_TYPES = [
  { value: "add", label: "Add — increase stock" },
  { value: "deduct", label: "Deduct — decrease stock" },
  { value: "set", label: "Set — override to exact value" },
];

const AdjustStockDrawer: React.FC<AdjustStockDrawerProps> = ({
  open,
  prefillRow,
  onClose,
  onSaved,
}) => {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<AdjustmentForm>(emptyAdjustmentForm());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [variants, setVariants] = useState<VariantOption[]>([]);
  const [variantSearch, setVariantSearch] = useState("");
  const [isVariantOpen, setIsVariantOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setVariantSearch("");

    if (prefillRow) {
      setForm({ ...emptyAdjustmentForm(), variant_id: prefillRow.id });
    } else {
      setForm(emptyAdjustmentForm());
    }
  }, [open, prefillRow]);

  useEffect(() => {
    const fetchVariants = async () => {
      const { data } = await supabase
        .from("product_variants")
        .select(`id, sku, stock_qty, products ( name )`)
        .order("sku");
      if (data) {
        setVariants(
          (
            data as unknown as {
              id: string;
              sku: string;
              stock_qty: number;
              products: { name: string } | null;
            }[]
          ).map((v) => ({
            id: v.id,
            sku: v.sku,
            product_name: v.products?.name ?? "—",
            stock_qty: v.stock_qty,
          })),
        );
      }
    };
    fetchVariants();
  }, []);

  const filteredVariants = variants.filter(
    (v) =>
      v.sku.toLowerCase().includes(variantSearch.toLowerCase()) ||
      v.product_name.toLowerCase().includes(variantSearch.toLowerCase()),
  );

  const selectedVariant = variants.find((v) => v.id === form.variant_id);
  const selectedType = ADJUSTMENT_TYPES.find(
    (t) => t.value === form.adjustment_type,
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.variant_id) e.variant_id = "Please select a product.";
    if (!form.adjustment_type)
      e.adjustment_type = "Please select an adjustment type.";
    if (!form.quantity || Number(form.quantity) < 0)
      e.quantity = "Please enter a valid quantity.";
    if (!form.notes.trim()) e.notes = "Notes are required for adjustments.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const { error } = await supabase.rpc("record_adjustment", {
        p_variant_id: form.variant_id,
        p_quantity: Number(form.quantity),
        p_adjustment_type: form.adjustment_type,
        p_notes: form.notes || null,
        p_adjusted_by: form.adjusted_by || null,
      });
      if (error) throw error;
      onSaved();
      onClose();
    } catch (err) {
      const error = err as Error;
      console.error("Error recording adjustment:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Record Adjustment
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Manually correct stock levels.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Variant selector */}
          <div>
            <label className={labelClass}>
              Product / SKU <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsVariantOpen(!isVariantOpen)}
                className={`${inputClass} flex items-center justify-between text-left ${!selectedVariant ? "text-gray-400" : "text-gray-900"}`}
              >
                <span>
                  {selectedVariant
                    ? `${selectedVariant.sku} — ${selectedVariant.product_name}`
                    : "Select a product..."}
                </span>
                <ChevronDown size={14} className="text-gray-400 shrink-0" />
              </button>
              {isVariantOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="p-2 border-b border-gray-100">
                    <input
                      type="text"
                      placeholder="Search SKU or product..."
                      value={variantSearch}
                      onChange={(e) => setVariantSearch(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto">
                    {filteredVariants.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-4">
                        No products found.
                      </p>
                    ) : (
                      filteredVariants.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${v.id === form.variant_id ? "text-red-600 font-medium bg-red-50" : "text-gray-700"}`}
                          onClick={() => {
                            setForm((prev) => ({ ...prev, variant_id: v.id }));
                            setIsVariantOpen(false);
                            setVariantSearch("");
                          }}
                        >
                          <span className="font-mono text-xs text-gray-400 mr-2">
                            {v.sku}
                          </span>
                          {v.product_name}
                          <span className="ml-2 text-xs text-gray-400">
                            ({v.stock_qty} in stock)
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {errors.variant_id && (
              <p className={errorClass}>{errors.variant_id}</p>
            )}
          </div>

          {/* Current stock preview */}
          {selectedVariant && (
            <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              <p className="text-xs text-gray-400">Current stock</p>
              <p className="text-lg font-semibold text-gray-900 mt-0.5">
                {selectedVariant.stock_qty} units
              </p>
            </div>
          )}

          {/* Adjustment type */}
          <div>
            <label className={labelClass}>
              Adjustment Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTypeOpen(!isTypeOpen)}
                className={`${inputClass} flex items-center justify-between text-left ${!selectedType ? "text-gray-400" : "text-gray-900"}`}
              >
                <span>
                  {selectedType ? selectedType.label : "Select type..."}
                </span>
                <ChevronDown size={14} className="text-gray-400 shrink-0" />
              </button>
              {isTypeOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                  {ADJUSTMENT_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${t.value === form.adjustment_type ? "text-red-600 font-medium bg-red-50" : "text-gray-700"}`}
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          adjustment_type:
                            t.value as AdjustmentForm["adjustment_type"],
                        }));
                        setIsTypeOpen(false);
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.adjustment_type && (
              <p className={errorClass}>{errors.adjustment_type}</p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className={labelClass}>
              Quantity <span className="text-red-500">*</span>
              {form.adjustment_type === "set" && (
                <span className="text-gray-400 font-normal ml-1">
                  — enter the exact new stock level
                </span>
              )}
              {form.adjustment_type === "deduct" && (
                <span className="text-gray-400 font-normal ml-1">
                  — enter how many to remove
                </span>
              )}
            </label>
            <input
              type="number"
              min="0"
              value={form.quantity}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, quantity: e.target.value }))
              }
              placeholder="0"
              className={inputClass}
            />
            {errors.quantity && <p className={errorClass}>{errors.quantity}</p>}
          </div>

          {/* Adjusted by */}
          <div>
            <label className={labelClass}>Adjusted By</label>
            <input
              type="text"
              value={form.adjusted_by}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, adjusted_by: e.target.value }))
              }
              placeholder="e.g. admin"
              className={inputClass}
            />
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>
              Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.notes}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Reason for adjustment..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
            {errors.notes && <p className={errorClass}>{errors.notes}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 shrink-0 bg-white">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Adjustment"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdjustStockDrawer;
