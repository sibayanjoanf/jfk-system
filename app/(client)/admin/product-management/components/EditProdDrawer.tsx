"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, Loader2, ChevronDown, Package } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  ProductRow,
  EditableVariant,
  VariantForm,
  CategoryOption,
  SubCategoryOption,
  emptyVariant,
} from "../types";
import VariantFields from "./VariantFields";
import { Upload } from "lucide-react";

const inputClass =
  "w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all";
const labelClass = "block text-xs font-medium text-gray-700 mb-1.5";
const errorClass = "text-xs text-red-500 mt-1";

interface EditProductDrawerProps {
  product: ProductRow | null;
  open: boolean;
  categories: CategoryOption[];
  onClose: () => void;
  onSaved: () => void;
}

const EditProductDrawer: React.FC<EditProductDrawerProps> = ({
  product,
  open,
  categories,
  onClose,
  onSaved,
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

    const loadVariants = async () => {
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

    loadVariants();
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
  ) =>
    setExistingVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    );

  const handleExistingImage = (id: string, file: File) => {
    const preview = URL.createObjectURL(file);
    setExistingVariants((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, image_file: file, image_preview: preview } : v,
      ),
    );
  };

  const updateNewVariant = (
    key: string,
    field: keyof VariantForm,
    value: string | File | null,
  ) =>
    setNewVariants((prev) =>
      prev.map((v) => (v._key === key ? { ...v, [field]: value } : v)),
    );

  const handleNewVariantImage = (key: string, file: File) => {
    const preview = URL.createObjectURL(file);
    setNewVariants((prev) =>
      prev.map((v) =>
        v._key === key ? { ...v, image_file: file, image_preview: preview } : v,
      ),
    );
  };

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

  const handleSave = async () => {
    if (!product || !validate()) return;
    setSaving(true);
    try {
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

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-xl bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
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

              {/* Existing Variants */}
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
                          <label className={labelClass}>Stock Qty</label>
                          <input
                            type="number"
                            value={v.stock_qty}
                            readOnly
                            className={`${inputClass} bg-gray-100 cursor-not-allowed`}
                          />
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

              {/* New Variants */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Add More Variants
                  </h3>
                  <button
                    onClick={() =>
                      setNewVariants((p) => [...p, emptyVariant()])
                    }
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    <Plus size={13} />
                    Add Variant
                  </button>
                </div>
                {newVariants.map((v, i) => (
                  <VariantFields
                    key={v._key}
                    variant={v}
                    index={i}
                    label="New Variant"
                    errors={errors}
                    errorPrefix="new"
                    onUpdate={updateNewVariant}
                    onImageChange={handleNewVariantImage}
                    onRemove={(key) =>
                      setNewVariants((p) => p.filter((v) => v._key !== key))
                    }
                  />
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

export default EditProductDrawer;
