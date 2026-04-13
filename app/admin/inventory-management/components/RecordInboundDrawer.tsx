"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { InboundForm, emptyInboundForm } from "../types";

interface VariantOption {
  id: string;
  sku: string;
  product_name: string;
}

interface RecordInboundDrawerProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const inputClass =
  "w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all";
const labelClass = "block text-xs font-medium text-gray-700 mb-1.5";
const errorClass = "text-xs text-red-500 mt-1";

const RecordInboundDrawer: React.FC<RecordInboundDrawerProps> = ({
  open,
  onClose,
  onSaved,
}) => {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<InboundForm>(emptyInboundForm());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [variants, setVariants] = useState<VariantOption[]>([]);
  const [variantSearch, setVariantSearch] = useState("");
  const [isVariantOpen, setIsVariantOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(emptyInboundForm());
    setErrors({});
    setVariantSearch("");
  }, [open]);

  useEffect(() => {
    const fetchVariants = async () => {
      const { data } = await supabase
        .from("product_variants")
        .select(`id, sku, products ( name )`)
        .order("sku");
      if (data) {
        setVariants(
          (
            data as unknown as {
              id: string;
              sku: string;
              products: { name: string } | null;
            }[]
          ).map((v) => ({
            id: v.id,
            sku: v.sku,
            product_name: v.products?.name ?? "—",
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

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.variant_id) e.variant_id = "Please select a product";
    if (!form.quantity || Number(form.quantity) <= 0)
      e.quantity = "Please input a valid quantity greater than 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const { error } = await supabase.rpc("record_inbound", {
        p_variant_id: form.variant_id,
        p_quantity: Number(form.quantity),
        p_supplier: form.supplier || null,
        p_received_by: form.received_by || null,
      });
      if (error) throw error;
      onSaved();
      onClose();
    } catch (err) {
      const error = err as Error;
      console.error("Error recording inbound:", error);
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
              Record Inbound
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Log a new stock delivery.
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

          {/* Quantity */}
          <div>
            <label className={labelClass}>
              Quantity Received <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, quantity: e.target.value }))
              }
              placeholder="0"
              className={inputClass}
            />
            {errors.quantity && <p className={errorClass}>{errors.quantity}</p>}
          </div>

          {/* Supplier */}
          <div>
            <label className={labelClass}>Supplier</label>
            <input
              type="text"
              value={form.supplier}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, supplier: e.target.value }))
              }
              placeholder="e.g. ABC Supplies Co."
              className={inputClass}
            />
          </div>

          {/* Received by */}
          <div>
            <label className={labelClass}>Received By</label>
            <input
              type="text"
              value={form.received_by}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, received_by: e.target.value }))
              }
              placeholder="e.g. admin"
              className={inputClass}
            />
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
              "Save"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default RecordInboundDrawer;
