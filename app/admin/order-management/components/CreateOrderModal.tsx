"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Plus, Trash2, Search, Loader2, ChevronDown } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { CreateOrderForm, OrderItem } from "../types";
import { useOrderMutations } from "../hooks/useOrderMutations";

interface VariantOption {
  id: string;
  sku: string;
  name: string;
  image_url: string | null;
  price: number;
  available_qty: number;
}

interface CreateOrderModalProps {
  onClose: () => void;
  onSaved: () => void;
}

const inputClass =
  "w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all";
const labelClass = "block text-xs font-medium text-gray-600 mb-1.5";

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  onClose,
  onSaved,
}) => {
  const { createOrder } = useOrderMutations();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [variantSearch, setVariantSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<CreateOrderForm>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    delivery_preference: "pickup",
    payment_preference: "cash",
    message: "",
    order_type: "walk-in",
    items: [],
  });

  useEffect(() => {
    const fetchVariants = async () => {
      const { data } = await supabase
        .from("product_variants_available")
        .select(
          `
          id, sku, price, available_qty, image_url,
          products ( name )
        `,
        )
        .gt("available_qty", 0)
        .order("sku");

      if (data) {
        setVariantOptions(
          (
            data as unknown as {
              id: string;
              sku: string;
              price: number;
              available_qty: number;
              image_url: string | null;
              products: { name: string } | null;
            }[]
          ).map((v) => ({
            id: v.id,
            sku: v.sku,
            name: v.products?.name ?? "—",
            image_url: v.image_url,
            price: v.price,
            available_qty: v.available_qty,
          })),
        );
      }
    };
    fetchVariants();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredVariants = variantOptions.filter(
    (v) =>
      v.sku.toLowerCase().includes(variantSearch.toLowerCase()) ||
      v.name.toLowerCase().includes(variantSearch.toLowerCase()),
  );

  const handleAddItem = (v: VariantOption) => {
    const existing = form.items.find((i) => i.sku === v.sku);
    if (existing) {
      setForm((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i.sku === v.sku
            ? { ...i, quantity: Math.min(i.quantity + 1, v.available_qty) }
            : i,
        ),
      }));
    } else {
      const newItem: OrderItem = {
        sku: v.sku,
        name: v.name,
        price: v.price,
        quantity: 1,
        image: v.image_url ?? undefined,
      };
      setForm((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    }
    setDropdownOpen(false);
    setVariantSearch("");
  };

  const handleRemoveItem = (sku: string) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.sku !== sku),
    }));
  };

  const handleQtyChange = (sku: string, qty: number) => {
    const variant = variantOptions.find((v) => v.sku === sku);
    const max = variant?.available_qty ?? 999;
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.sku === sku ? { ...i, quantity: Math.min(Math.max(1, qty), max) } : i,
      ),
    }));
  };

  const total = form.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.first_name.trim()) e.first_name = "Required";
    if (!form.last_name.trim()) e.last_name = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (form.items.length === 0) e.items = "Add at least one item";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const { error } = await createOrder(form);
    if (error) {
      alert(`Error: ${error}`);
      setSaving(false);
      return;
    }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Create Walk-in Order
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Manually create an order for walk-in customers.
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
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Customer Info */}
          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
              Customer Info
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(e) =>
                    setForm({ ...form, first_name: e.target.value })
                  }
                  className={`${inputClass} ${errors.first_name ? "border-red-400" : ""}`}
                  placeholder="Juan"
                />
                {errors.first_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.first_name}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={(e) =>
                    setForm({ ...form, last_name: e.target.value })
                  }
                  className={`${inputClass} ${errors.last_name ? "border-red-400" : ""}`}
                  placeholder="Dela Cruz"
                />
                {errors.last_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.last_name}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={`${inputClass} ${errors.phone ? "border-red-400" : ""}`}
                  placeholder="09XX XXX XXXX"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                  placeholder="optional"
                />
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
              Order Details
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Delivery Preference</label>
                <div className="relative">
                  <select
                    value={form.delivery_preference}
                    onChange={(e) =>
                      setForm({ ...form, delivery_preference: e.target.value })
                    }
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Delivery</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Payment Preference</label>
                <div className="relative">
                  <select
                    value={form.payment_preference}
                    onChange={(e) =>
                      setForm({ ...form, payment_preference: e.target.value })
                    }
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="cash">Cash</option>
                    <option value="gcash">GCash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="card">Card</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Notes</label>
                <input
                  type="text"
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Any special instructions..."
                />
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
              Items <span className="text-red-500">*</span>
            </p>
            {errors.items && (
              <p className="text-xs text-red-500 mb-2">{errors.items}</p>
            )}

            {/* Product picker */}
            <div className="relative mb-3" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-lg hover:border-red-300 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all text-left"
              >
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <Plus size={14} /> Add a product...
                </span>
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
                  <div className="max-h-56 overflow-y-auto">
                    {filteredVariants.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-6">
                        No products found.
                      </p>
                    ) : (
                      filteredVariants.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => handleAddItem(v)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
                        >
                          <div className="relative w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            {v.image_url ? (
                              <Image
                                src={v.image_url}
                                alt={v.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 rounded-lg" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {v.name}
                            </p>
                            <p className="text-xs text-gray-400 font-mono">
                              {v.sku}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-sm font-semibold text-gray-800">
                              ₱{v.price.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400">
                              {v.available_qty} avail.
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Items list */}
            {form.items.length > 0 && (
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                {form.items.map((item, idx) => (
                  <div
                    key={item.sku}
                    className={`flex items-center gap-3 px-4 py-3 ${idx !== form.items.length - 1 ? "border-b border-gray-50" : ""}`}
                  >
                    <div className="relative w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 rounded-lg" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">
                        {item.sku} · ₱{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shrink-0">
                      <button
                        onClick={() =>
                          handleQtyChange(item.sku, item.quantity - 1)
                        }
                        className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-100 transition-colors text-sm"
                      >
                        −
                      </button>
                      <span className="px-3 py-1.5 text-sm font-semibold text-gray-800 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQtyChange(item.sku, item.quantity + 1)
                        }
                        className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-100 transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 w-20 text-right shrink-0">
                      <span className="font-medium text-sm">₱</span>
                      {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.sku)}
                      className="p-1.5 text-gray-300 hover:bg-red-100 rounded-full hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {/* Total */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Total
                  </p>
                  <p className="text-base font-semibold text-gray-900">
                    <span className="font-medium text-sm">₱</span>
                    {total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving...
              </>
            ) : (
              "Create Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderModal;
