"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Plus,
  Trash2,
  ChevronDown,
  Loader2,
  X,
  Upload,
  Package,
  ChevronUp,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import HeaderUser from "@/components/admin/HeaderUser";
import HeaderNotifications from "@/components/admin/HeaderNotif";
import Image from "next/image";
import { PostgrestError } from "@supabase/supabase-js";

interface DbSubCategory {
  id: string;
  name: string;
  categories: { name: string } | null;
}

interface DbVariant {
  id: string;
  sku: string;
  price: number;
  stock_qty: number;
  image_url: string | null;
  attribute_value: string | null;
  attribute_name: string | null;
  dimension: string | null;
  keywords: string | null;
}

interface DbProduct {
  id: string;
  name: string;
  description: string | null;
  sub_categories: DbSubCategory | null;
  product_variants: DbVariant[] | null;
}

export interface ProductRow {
  id: string;
  product_id: string;
  name: string;
  description: string | null;
  type: string;
  sku: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  price: number;
  category: string;
  sub_category_id: string;
  stock: number;
  image_url: string;
  attribute_name: string | null;
  attribute_value: string | null;
  dimension: string | null;
  keywords: string | null;
}

interface VariantForm {
  _key: string;
  sku: string;
  attribute_name: string;
  attribute_value: string;
  price: string;
  stock_qty: string;
  dimension: string;
  keywords: string;
  image_url: string;
  image_file: File | null;
  image_preview: string;
}

interface CategoryOption {
  id: string;
  name: string;
}

interface SubCategoryOption {
  id: string;
  name: string;
  category_id: string;
}

type SortField = "name" | "sku" | "price" | "stock" | null;
type SortDir = "asc" | "desc";

const emptyVariant = (): VariantForm => ({
  _key: Date.now().toString() + Math.random(),
  sku: "",
  attribute_name: "",
  attribute_value: "",
  price: "",
  stock_qty: "",
  dimension: "",
  keywords: "",
  image_url: "",
  image_file: null,
  image_preview: "",
});

interface EditableVariant {
  id: string;
  sku: string;
  attribute_name: string;
  attribute_value: string;
  price: string;
  stock_qty: string;
  dimension: string;
  keywords: string;
  image_url: string;
  image_file: File | null;
  image_preview: string;
}

interface EditDrawerProps {
  product: ProductRow | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  categories: CategoryOption[];
}

const EditDrawer: React.FC<EditDrawerProps> = ({
  product,
  open,
  onClose,
  onSaved,
  categories,
}) => {
  const [saving, setSaving] = useState(false);
  const [loadingVariants, setLoadingVariants] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [subCategories, setSubCategories] = useState<SubCategoryOption[]>([]);

  const [existingVariants, setExistingVariants] = useState<EditableVariant[]>(
    [],
  );

  const [newVariants, setNewVariants] = useState<VariantForm[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!product) return;

    setName(product.name);
    setDescription(product.description || "");
    setNewVariants([]);
    setErrors({});

    const loadAllVariants = async () => {
      setLoadingVariants(true);
      const { data } = await supabase
        .from("product_variants")
        .select(
          "id, sku, attribute_name, attribute_value, price, stock_qty, dimension, keywords, image_url",
        )
        .eq("product_id", product.product_id)
        .order("sku");

      if (data) {
        setExistingVariants(
          data.map((v) => ({
            id: v.id,
            sku: v.sku,
            attribute_name: v.attribute_name ?? "",
            attribute_value: v.attribute_value ?? "",
            price: String(v.price),
            stock_qty: String(v.stock_qty),
            dimension: v.dimension ?? "",
            keywords: v.keywords ?? "",
            image_url: v.image_url ?? "",
            image_file: null,
            image_preview: v.image_url ?? "",
          })),
        );
      }
      setLoadingVariants(false);
    };
    loadAllVariants();

    // Fetch category + subcategory
    const loadCategory = async () => {
      const { data: sub } = await supabase
        .from("sub_categories")
        .select("id, name, category_id")
        .eq("id", product.sub_category_id)
        .single();
      if (!sub) return;
      const { data: subs } = await supabase
        .from("sub_categories")
        .select("id, name, category_id")
        .eq("category_id", sub.category_id)
        .order("name");
      setSubCategories(subs ?? []);
      setSelectedCategoryId(sub.category_id);
      setSelectedSubCategoryId(sub.id);
    };
    loadCategory();
  }, [product]);

  const handleCategoryChange = async (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId("");
    if (!categoryId) {
      setSubCategories([]);
      return;
    }
    const { data } = await supabase
      .from("sub_categories")
      .select("id, name, category_id")
      .eq("category_id", categoryId)
      .order("name");
    setSubCategories(data ?? []);
  };

  const updateExisting = (
    id: string,
    field: keyof EditableVariant,
    value: string | File | null,
  ) => {
    setExistingVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    );
  };

  const handleExistingImage = (id: string, file: File) => {
    const preview = URL.createObjectURL(file);
    setExistingVariants((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, image_file: file, image_preview: preview } : v,
      ),
    );
  };

  const addNewVariant = () =>
    setNewVariants((prev) => [...prev, emptyVariant()]);

  const removeNewVariant = (key: string) =>
    setNewVariants((prev) => prev.filter((v) => v._key !== key));

  const updateNewVariant = (
    key: string,
    field: keyof VariantForm,
    value: string | File | null,
  ) => {
    setNewVariants((prev) =>
      prev.map((v) => (v._key === key ? { ...v, [field]: value } : v)),
    );
  };

  const handleNewVariantImage = (key: string, file: File) => {
    const preview = URL.createObjectURL(file);
    setNewVariants((prev) =>
      prev.map((v) =>
        v._key === key ? { ...v, image_file: file, image_preview: preview } : v,
      ),
    );
  };

  // Validation
  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Product name is required.";
    if (!selectedSubCategoryId) e.subCategory = "Sub-category is required.";
    existingVariants.forEach((v, i) => {
      if (!v.sku.trim()) e[`ex_sku_${i}`] = "SKU is required.";
      if (!v.price || isNaN(Number(v.price)))
        e[`ex_price_${i}`] = "Valid price required.";
      if (!v.stock_qty || isNaN(Number(v.stock_qty)))
        e[`ex_stock_${i}`] = "Valid stock qty required.";
    });
    newVariants.forEach((v, i) => {
      if (!v.sku.trim()) e[`new_sku_${i}`] = "SKU is required.";
      if (!v.price || isNaN(Number(v.price)))
        e[`new_price_${i}`] = "Valid price required.";
      if (!v.stock_qty || isNaN(Number(v.stock_qty)))
        e[`new_stock_${i}`] = "Valid stock qty required.";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Save
  const handleSave = async () => {
    if (!product || !validate()) return;
    setSaving(true);

    try {
      // Update product row
      const { error: productError } = await supabase
        .from("products")
        .update({
          name: name.trim(),
          description: description.trim() || null,
          sub_category_id: selectedSubCategoryId,
        })
        .eq("id", product.product_id);
      if (productError)
        throw new Error(`Product update failed: ${productError.message}`);

      // Update existing variants
      for (const v of existingVariants) {
        let image_url: string | null = v.image_url || null;
        if (v.image_file) {
          const ext = v.image_file.name.split(".").pop();
          const path = `products/${product.product_id}/${v.sku.toUpperCase().trim()}.${ext}`;
          const formData = new FormData();
          formData.append("file", v.image_file);
          formData.append("path", path);
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.error || "Image upload failed");
          image_url = result.url;
        }
        const { error: vErr } = await supabase
          .from("product_variants")
          .update({
            sku: v.sku.toUpperCase().trim(),
            attribute_name: v.attribute_name.trim() || null,
            attribute_value: v.attribute_value.trim() || null,
            price: Number(v.price),
            stock_qty: Number(v.stock_qty),
            dimension: v.dimension.trim() || null,
            keywords: v.keywords.trim() || null,
            image_url,
          })
          .eq("id", v.id);
        if (vErr) throw new Error(`Variant update failed: ${vErr.message}`);
      }

      // Insert new variants
      for (const v of newVariants) {
        let image_url: string | null = null;
        if (v.image_file) {
          const ext = v.image_file.name.split(".").pop();
          const path = `products/${product.product_id}/${v.sku.toUpperCase().trim()}.${ext}`;
          const formData = new FormData();
          formData.append("file", v.image_file);
          formData.append("path", path);
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.error || "Image upload failed");
          image_url = result.url;
        }
        const { error: newVarError } = await supabase
          .from("product_variants")
          .insert({
            product_id: product.product_id,
            sku: v.sku.toUpperCase().trim(),
            attribute_name: v.attribute_name.trim() || null,
            attribute_value: v.attribute_value.trim() || null,
            price: Number(v.price),
            stock_qty: Number(v.stock_qty),
            dimension: v.dimension.trim() || null,
            keywords: v.keywords.trim() || null,
            image_url,
          });
        if (newVarError)
          throw new Error(`New variant insert failed: ${newVarError.message}`);
      }

      onSaved();
      onClose();
    } catch (err) {
      const error = err as Error;
      console.error("Save error:", error);
      alert(`Error saving: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all";
  const labelClass = "block text-xs font-medium text-gray-700 mb-1.5";
  const errorClass = "text-xs text-red-500 mt-1";

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-xl bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {product && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="text-md font-semibold text-gray-900">
                  Edit Product
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">{product.name}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Product Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Product Info
                </h3>

                <div>
                  <label className={labelClass}>
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`${inputClass} bg-gray-50`}
                  />
                  {errors.name && <p className={errorClass}>{errors.name}</p>}
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className={`${inputClass} bg-gray-50 resize-none`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCategoryId}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className={`${inputClass} bg-gray-50 text-gray-700 appearance-none pr-8`}
                      >
                        <option value="">Select category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>
                      Sub-Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedSubCategoryId}
                        onChange={(e) =>
                          setSelectedSubCategoryId(e.target.value)
                        }
                        disabled={!selectedCategoryId}
                        className={`${inputClass} bg-gray-50 text-gray-700 appearance-none pr-8 disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <option value="">Select sub-category</option>
                        {subCategories.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                    {errors.subCategory && (
                      <p className={errorClass}>{errors.subCategory}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* All Existing Variants */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Variants
                </h3>

                {loadingVariants ? (
                  <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-xs">Loading variants...</span>
                  </div>
                ) : (
                  existingVariants.map((v, i) => (
                    <div
                      key={v.id}
                      className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3"
                    >
                      <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                        <Package size={13} className="text-red-600" />
                        Variant {i + 1}
                        {v.sku && (
                          <span className="text-gray-400 font-normal ml-1">
                            · {v.sku}
                          </span>
                        )}
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="flex flex-col items-center justify-center w-full h-full min-h-[116px] border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-red-300 hover:bg-red-50/20 transition-colors overflow-hidden relative group">
                            {v.image_preview ? (
                              <>
                                <img
                                  src={v.image_preview}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <p className="text-white text-xs font-medium">
                                    Change Image
                                  </p>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center gap-1.5 text-gray-400">
                                <Upload size={18} />
                                <p className="text-xs">Click to upload</p>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                e.target.files?.[0] &&
                                handleExistingImage(v.id, e.target.files[0])
                              }
                            />
                          </label>
                        </div>
                        <div className="flex flex-col gap-3">
                          <div>
                            <label className={labelClass}>
                              SKU <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={v.sku}
                              onChange={(e) =>
                                updateExisting(v.id, "sku", e.target.value)
                              }
                              className={inputClass}
                            />
                            {errors[`ex_sku_${i}`] && (
                              <p className={errorClass}>
                                {errors[`ex_sku_${i}`]}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className={labelClass}>Dimension</label>
                            <input
                              type="text"
                              value={v.dimension}
                              onChange={(e) =>
                                updateExisting(
                                  v.id,
                                  "dimension",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. 60x60cm"
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>Attribute Name</label>
                          <input
                            type="text"
                            value={v.attribute_name}
                            onChange={(e) =>
                              updateExisting(
                                v.id,
                                "attribute_name",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. Design, Color"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Attribute Value</label>
                          <input
                            type="text"
                            value={v.attribute_value}
                            onChange={(e) =>
                              updateExisting(
                                v.id,
                                "attribute_value",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. Black, White"
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>
                            Price (₱) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={v.price}
                            onChange={(e) =>
                              updateExisting(v.id, "price", e.target.value)
                            }
                            min="0"
                            className={inputClass}
                          />
                          {errors[`ex_price_${i}`] && (
                            <p className={errorClass}>
                              {errors[`ex_price_${i}`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={labelClass}>
                            Stock Qty <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={v.stock_qty}
                            onChange={(e) =>
                              updateExisting(v.id, "stock_qty", e.target.value)
                            }
                            min="0"
                            className={inputClass}
                          />
                          {errors[`ex_stock_${i}`] && (
                            <p className={errorClass}>
                              {errors[`ex_stock_${i}`]}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Keywords</label>
                        <input
                          type="text"
                          value={v.keywords}
                          onChange={(e) =>
                            updateExisting(v.id, "keywords", e.target.value)
                          }
                          placeholder="e.g. kitchen,fixtures,white"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* New Variants to Add */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Add More Variants
                  </h3>
                  <button
                    onClick={addNewVariant}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    <Plus size={13} />
                    Add Variant
                  </button>
                </div>

                {newVariants.map((v, i) => (
                  <div
                    key={v._key}
                    className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                        <Package size={13} className="text-red-600" />
                        New Variant {i + 1}
                      </p>
                      <button
                        onClick={() => removeNewVariant(v._key)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={13} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="flex flex-col items-center justify-center w-full h-full min-h-[116px] border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-red-300 hover:bg-red-50/20 transition-colors overflow-hidden relative group">
                          {v.image_preview ? (
                            <>
                              <img
                                src={v.image_preview}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <p className="text-white text-xs font-medium">
                                  Change Image
                                </p>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center gap-1.5 text-gray-400">
                              <Upload size={18} />
                              <p className="text-xs">Click to upload image</p>
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              e.target.files?.[0] &&
                              handleNewVariantImage(v._key, e.target.files[0])
                            }
                          />
                        </label>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div>
                          <label className={labelClass}>
                            SKU <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={v.sku}
                            onChange={(e) =>
                              updateNewVariant(v._key, "sku", e.target.value)
                            }
                            placeholder="e.g. GV AP11"
                            className={inputClass}
                          />
                          {errors[`new_sku_${i}`] && (
                            <p className={errorClass}>
                              {errors[`new_sku_${i}`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={labelClass}>Dimension</label>
                          <input
                            type="text"
                            value={v.dimension}
                            onChange={(e) =>
                              updateNewVariant(
                                v._key,
                                "dimension",
                                e.target.value,
                              )
                            }
                            placeholder="e.g. 60x60cm"
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Attribute Name</label>
                        <input
                          type="text"
                          value={v.attribute_name}
                          onChange={(e) =>
                            updateNewVariant(
                              v._key,
                              "attribute_name",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. Design, Color"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Attribute Value</label>
                        <input
                          type="text"
                          value={v.attribute_value}
                          onChange={(e) =>
                            updateNewVariant(
                              v._key,
                              "attribute_value",
                              e.target.value,
                            )
                          }
                          placeholder="e.g. Black, White"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>
                          Price (₱) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) =>
                            updateNewVariant(v._key, "price", e.target.value)
                          }
                          placeholder="0.00"
                          min="0"
                          className={inputClass}
                        />
                        {errors[`new_price_${i}`] && (
                          <p className={errorClass}>
                            {errors[`new_price_${i}`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className={labelClass}>
                          Stock Qty <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={v.stock_qty}
                          onChange={(e) =>
                            updateNewVariant(
                              v._key,
                              "stock_qty",
                              e.target.value,
                            )
                          }
                          placeholder="0"
                          min="0"
                          className={inputClass}
                        />
                        {errors[`new_stock_${i}`] && (
                          <p className={errorClass}>
                            {errors[`new_stock_${i}`]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Keywords</label>
                      <input
                        type="text"
                        value={v.keywords}
                        onChange={(e) =>
                          updateNewVariant(v._key, "keywords", e.target.value)
                        }
                        placeholder="e.g. kitchen,fixtures,white"
                        className={inputClass}
                      />
                    </div>
                  </div>
                ))}
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
                  <>Save Changes</>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

// Main Component
const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    dir: SortDir;
  }>({
    field: null,
    dir: "asc",
  });
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Add drawer
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [variants, setVariants] = useState<VariantForm[]>([emptyVariant()]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryOption[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Edit drawer
  const [editProduct, setEditProduct] = useState<ProductRow | null>(null);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  // Delete confirm
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategoryId) {
      setSubCategories([]);
      setSelectedSubCategoryId("");
      return;
    }
    const fetchSubs = async () => {
      const { data } = await supabase
        .from("sub_categories")
        .select("id, name, category_id")
        .eq("category_id", selectedCategoryId)
        .order("name");
      if (data) setSubCategories(data);
      setSelectedSubCategoryId("");
    };
    fetchSubs();
  }, [selectedCategoryId]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data, error } = (await supabase.from("products").select(`
        id, name, description,
        sub_categories ( id, name, categories (name) ),
        product_variants (*)
      `)) as { data: DbProduct[] | null; error: PostgrestError | null };

      if (error) throw error;
      if (!data) return;

      const flattened: ProductRow[] = data.flatMap((p) =>
        (p.product_variants || []).map((v) => {
          let status: ProductRow["status"] = "In Stock";
          if (v.stock_qty <= 0) status = "Out of Stock";
          else if (v.stock_qty <= 10) status = "Low Stock";
          return {
            id: v.id,
            product_id: p.id,
            name: p.name,
            description: p.description ?? null,
            type: v.attribute_value || "Standard",
            sku: v.sku,
            status,
            price: v.price,
            category: p.sub_categories?.categories?.name || "General",
            sub_category_id: p.sub_categories?.id || "",
            stock: v.stock_qty,
            image_url: v.image_url || "/placeholder.png",
            attribute_name: v.attribute_name ?? null,
            attribute_value: v.attribute_value ?? null,
            dimension: v.dimension ?? null,
            keywords: v.keywords ?? null,
          };
        }),
      );
      setProducts(flattened);
    } catch (err) {
      console.error("Error loading inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const confirmDelete = async () => {
    setDeleting(true);

    const productIds = [
      ...new Set(
        products
          .filter((p) => selectedIds.includes(p.id))
          .map((p) => p.product_id),
      ),
    ];

    const { error: variantError } = await supabase
      .from("product_variants")
      .delete()
      .in("id", selectedIds);

    if (variantError) {
      console.error("Variant delete error:", variantError);
      setDeleting(false);
      setConfirmOpen(false);
      return;
    }

    if (productIds.length > 0) {
      const { error: productError } = await supabase
        .from("products")
        .delete()
        .in("id", productIds);

      if (productError) {
        console.error("Product delete error:", productError);
      }
    }

    setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]);
    setDeleting(false);
    setConfirmOpen(false);
  };

  const filteredProducts = useMemo(() => {
    const result = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || p.category === categoryFilter;
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
    if (sortConfig.field) {
      result.sort((a, b) => {
        const dir = sortConfig.dir === "asc" ? 1 : -1;
        switch (sortConfig.field) {
          case "name":
            return a.name.localeCompare(b.name) * dir;
          case "sku":
            return a.sku.localeCompare(b.sku) * dir;
          case "price":
            return (a.price - b.price) * dir;
          case "stock":
            return (a.stock - b.stock) * dir;
          default:
            return 0;
        }
      });
    }
    return result;
  }, [products, searchQuery, categoryFilter, statusFilter, sortConfig]);

  const toggleAll = () => {
    if (selectedIds.length === filteredProducts.length) setSelectedIds([]);
    else setSelectedIds(filteredProducts.map((p) => p.id));
  };
  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "In Stock":
        return "text-white bg-green-500";
      case "Low Stock":
        return "text-white bg-orange-400";
      case "Out of Stock":
        return "text-white bg-red-600";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const toggleSort = (field: SortField) => {
    setSortConfig((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" },
    );
  };

  const openAddDrawer = () => {
    setProductName("");
    setProductDescription("");
    setSelectedCategoryId("");
    setSelectedSubCategoryId("");
    setVariants([emptyVariant()]);
    setFormErrors({});
    setAddDrawerOpen(true);
  };

  const updateVariant = (
    key: string,
    field: keyof VariantForm,
    value: string | File | null,
  ) => {
    setVariants((prev) =>
      prev.map((v) => (v._key === key ? { ...v, [field]: value } : v)),
    );
  };

  const handleVariantImage = (key: string, file: File) => {
    const preview = URL.createObjectURL(file);
    setVariants((prev) =>
      prev.map((v) =>
        v._key === key ? { ...v, image_file: file, image_preview: preview } : v,
      ),
    );
  };

  const addVariant = () => setVariants((prev) => [...prev, emptyVariant()]);
  const removeVariant = (key: string) => {
    if (variants.length === 1) return;
    setVariants((prev) => prev.filter((v) => v._key !== key));
  };

  const validateAdd = () => {
    const errors: Record<string, string> = {};
    if (!productName.trim()) errors.name = "Product name is required.";
    if (!selectedSubCategoryId)
      errors.subCategory = "Please select a sub-category.";
    variants.forEach((v, i) => {
      if (!v.sku.trim()) errors[`sku_${i}`] = "SKU is required.";
      if (!v.price || isNaN(Number(v.price)))
        errors[`price_${i}`] = "Valid price is required.";
      if (!v.stock_qty || isNaN(Number(v.stock_qty)))
        errors[`stock_${i}`] = "Valid stock qty is required.";
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveNew = async () => {
    if (!validateAdd()) return;
    setSaving(true);
    try {
      const { data: productData, error: productError } = await supabase
        .from("products")
        .insert({
          name: productName.trim(),
          description: productDescription.trim() || null,
          sub_category_id: selectedSubCategoryId,
        })
        .select("id")
        .single();
      if (productError) throw productError;

      const productId = productData.id;

      for (const v of variants) {
        let image_url: string | null = null;
        if (v.image_file) {
          const ext = v.image_file.name.split(".").pop();
          const path = `products/${productId}/${v.sku.toUpperCase().trim()}.${ext}`;
          const formData = new FormData();
          formData.append("file", v.image_file);
          formData.append("path", path);
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const result = await res.json();
          if (!res.ok) throw new Error(result.error || "Image upload failed");
          image_url = result.url;
        }
        const { error: variantError } = await supabase
          .from("product_variants")
          .insert({
            product_id: productId,
            sku: v.sku.toUpperCase().trim(),
            attribute_name: v.attribute_name.trim() || null,
            attribute_value: v.attribute_value.trim() || null,
            price: Number(v.price),
            stock_qty: Number(v.stock_qty),
            dimension: v.dimension.toLowerCase().trim() || null,
            keywords: v.keywords.trim() || null,
            image_url,
          });
        if (variantError) throw variantError;
      }
      await fetchInventory();
      setAddDrawerOpen(false);
    } catch (err) {
      const error = err as Error;
      alert(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all";
  const labelClass = "block text-xs font-medium text-gray-700 mb-1.5";
  const errorClass = "text-xs text-red-500 mt-1";

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full gap-4">
        <div className="flex items-center gap-6 flex-1">
          <div className="shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
              Management
            </p>
            <h1 className="text-lg font-semibold text-gray-900">
              Product List
            </h1>
          </div>
          <div className="relative flex-1 max-w-sm group">
            <span className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 pointer-events-none group-focus-within:text-red-600 transition-colors">
              <Search size={15} strokeWidth={2} />
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
            />
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-1">
          <HeaderNotifications />
          <HeaderUser />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Product Management
            </h2>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
              Total {products.length} product variants found in database.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center shrink-0">
            {selectedIds.length > 0 && (
              <button
                onClick={() => setConfirmOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors animate-in fade-in duration-150"
              >
                <Trash2 size={13} />
                Delete ({selectedIds.length})
              </button>
            )}

            {/* Status */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsStatusOpen(!isStatusOpen);
                  setIsCategoryOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 text-xs border rounded-lg font-medium transition-colors ${isStatusOpen ? "bg-red-600 text-white border-red-600" : "border-red-200 text-red-600 hover:bg-red-50"}`}
              >
                <span>{statusFilter === "All" ? "Status" : statusFilter}</span>
                <ChevronDown size={14} />
              </button>
              {isStatusOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                  {["All", "In Stock", "Low Stock", "Out of Stock"].map((s) => (
                    <button
                      key={s}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${s === statusFilter ? "text-red-600 font-bold" : "text-gray-600"}`}
                      onClick={() => {
                        setStatusFilter(s);
                        setIsStatusOpen(false);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsStatusOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 text-xs border rounded-lg font-medium transition-colors ${isCategoryOpen ? "bg-red-600 text-white border-red-600" : "border-red-200 text-red-600 hover:bg-red-50"}`}
              >
                <span>
                  {categoryFilter === "All" ? "Category" : categoryFilter}
                </span>
                <ChevronDown size={14} />
              </button>
              {isCategoryOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                  {["All", "Tiles", "Stones", "Fixtures"].map((cat) => (
                    <button
                      key={cat}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${cat === categoryFilter ? "text-red-600 font-bold" : "text-gray-600"}`}
                      onClick={() => {
                        setCategoryFilter(cat);
                        setIsCategoryOpen(false);
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={openAddDrawer}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors"
            >
              <Plus size={14} />
              Add Product
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
              <Loader2 className="animate-spin" />
              <p className="text-sm">Fetching products...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  <th className="py-3 pl-5 w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length === filteredProducts.length &&
                        filteredProducts.length > 0
                      }
                      onChange={toggleAll}
                      className="w-3.5 h-3.5 rounded border-gray-300 accent-red-600 cursor-pointer"
                    />
                  </th>
                  {(
                    [
                      { label: "Product", field: "name", align: "left" },
                      { label: "SKU", field: "sku", align: "center" },
                      { label: "Status", field: null, align: "center" },
                      { label: "Price", field: "price", align: "center" },
                      { label: "Category", field: null, align: "center" },
                      { label: "Stock", field: "stock", align: "center" },
                    ] as { label: string; field: SortField; align: string }[]
                  ).map(({ label, field, align }) => (
                    <th
                      key={label}
                      onClick={() => field && toggleSort(field)}
                      className={`py-3 px-4 font-semibold text-${align} ${field ? "cursor-pointer select-none hover:text-gray-600 transition-colors" : ""}`}
                    >
                      <span className="inline-flex items-center gap-1 justify-center">
                        {label}
                        {field && (
                          <span className="flex flex-col -space-y-1">
                            <ChevronUp
                              size={12}
                              strokeWidth={2}
                              className={
                                sortConfig.field === field &&
                                sortConfig.dir === "asc"
                                  ? "text-gray-400"
                                  : "text-gray-300"
                              }
                            />
                            <ChevronDown
                              size={12}
                              strokeWidth={2}
                              className={
                                sortConfig.field === field &&
                                sortConfig.dir === "desc"
                                  ? "text-gray-400"
                                  : "text-gray-300"
                              }
                            />
                          </span>
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => {
                      setEditProduct(product);
                      setEditDrawerOpen(true);
                    }}
                    className={`hover:bg-gray-100 transition-colors cursor-pointer ${selectedIds.includes(product.id) ? "bg-red-50/80" : ""}`}
                  >
                    <td
                      className="py-3.5 pl-5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => toggleOne(product.id)}
                        className="w-3.5 h-3.5 rounded border-gray-300 accent-red-600 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <div className="relative w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-900 leading-none">
                        {product.name}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-gray-500 text-center">
                      {product.sku}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${getStatusStyles(product.status)}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-sm text-gray-900 font-medium text-center">
                      ₱{" "}
                      {product.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500 text-center">
                      {product.category}
                    </td>
                    <td className="py-3.5 pr-6 text-sm font-medium text-gray-700 text-center">
                      {product.stock}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Delete Modal ── */}
      {confirmOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm flex items-center justify-center"
          onClick={() => !deleting && setConfirmOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <Trash2 size={18} className="text-red-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Delete {selectedIds.length}{" "}
              {selectedIds.length === 1 ? "variant" : "variants"}?
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              This is permanent and cannot be undone. The selected{" "}
              {selectedIds.length === 1 ? "variant" : "variants"} will be
              removed from the database.
            </p>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 size={12} className="animate-spin" /> Deleting...
                  </>
                ) : (
                  "Yes, delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD Drawer ── */}
      {addDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={() => setAddDrawerOpen(false)}
        />
      )}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full max-w-xl bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${addDrawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Add New Product
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Fill in the details below to add a product.
            </p>
          </div>
          <button
            onClick={() => setAddDrawerOpen(false)}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Product Info
            </h3>
            <div>
              <label className={labelClass}>
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Marble Flooring Tile"
                className={inputClass}
              />
              {formErrors.name && (
                <p className={errorClass}>{formErrors.name}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Optional product description..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className={`${inputClass} text-gray-700`}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  Sub-Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedSubCategoryId}
                  onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                  disabled={!selectedCategoryId}
                  className={`${inputClass} text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <option value="">Select sub-category</option>
                  {subCategories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {formErrors.subCategory && (
                  <p className={errorClass}>{formErrors.subCategory}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Variants
              </h3>
              <button
                onClick={addVariant}
                className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                <Plus size={13} />
                Add Variant
              </button>
            </div>
            {variants.map((v, i) => (
              <div
                key={v._key}
                className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <Package size={13} className="text-red-600" />
                    Variant {i + 1}
                  </p>
                  {variants.length > 1 && (
                    <button
                      onClick={() => removeVariant(v._key)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="flex flex-col items-center justify-center w-full h-full min-h-[116px] border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-red-300 hover:bg-red-50/20 transition-colors overflow-hidden relative group">
                      {v.image_preview ? (
                        <>
                          <img
                            src={v.image_preview}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <p className="text-white text-xs font-medium">
                              Change Image
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 text-gray-400">
                          <Upload size={18} />
                          <p className="text-xs">Click to upload image</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files?.[0] &&
                          handleVariantImage(v._key, e.target.files[0])
                        }
                      />
                    </label>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className={labelClass}>
                        SKU <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) =>
                          updateVariant(v._key, "sku", e.target.value)
                        }
                        placeholder="e.g. GV AP11"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                      />
                      {formErrors[`sku_${i}`] && (
                        <p className={errorClass}>{formErrors[`sku_${i}`]}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass}>Dimension</label>
                      <input
                        type="text"
                        value={v.dimension}
                        onChange={(e) =>
                          updateVariant(v._key, "dimension", e.target.value)
                        }
                        placeholder="e.g. 60x60cm"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Attribute Name</label>
                    <input
                      type="text"
                      value={v.attribute_name}
                      onChange={(e) =>
                        updateVariant(v._key, "attribute_name", e.target.value)
                      }
                      placeholder="e.g. Design, Color"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Attribute Value</label>
                    <input
                      type="text"
                      value={v.attribute_value}
                      onChange={(e) =>
                        updateVariant(v._key, "attribute_value", e.target.value)
                      }
                      placeholder="e.g. Black, White"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>
                      Price (₱) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) =>
                        updateVariant(v._key, "price", e.target.value)
                      }
                      placeholder="0.00"
                      min="0"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                    />
                    {formErrors[`price_${i}`] && (
                      <p className={errorClass}>{formErrors[`price_${i}`]}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>
                      Stock Qty <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={v.stock_qty}
                      onChange={(e) =>
                        updateVariant(v._key, "stock_qty", e.target.value)
                      }
                      placeholder="0"
                      min="0"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                    />
                    {formErrors[`stock_${i}`] && (
                      <p className={errorClass}>{formErrors[`stock_${i}`]}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Keywords</label>
                  <input
                    type="text"
                    value={v.keywords}
                    onChange={(e) =>
                      updateVariant(v._key, "keywords", e.target.value)
                    }
                    placeholder="e.g. kitchen,fixtures,white (comma separated)"
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0 bg-white">
          <button
            onClick={() => setAddDrawerOpen(false)}
            className="flex-1 px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveNew}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Product"
            )}
          </button>
        </div>
      </div>

      {/* ── EDIT Drawer ── */}
      <EditDrawer
        product={editProduct}
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        onSaved={fetchInventory}
        categories={categories}
      />
    </div>
  );
};

export default ProductManagement;
