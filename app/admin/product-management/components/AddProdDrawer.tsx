"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, X, Loader2, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  VariantForm,
  CategoryOption,
  SubCategoryOption,
  emptyVariant,
} from "../types";
import VariantFields from "./VariantFields";
import ConfirmModal from "../../components/ConfirmModal";

const inputClass =
  "w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all";
const labelClass = "block text-xs font-medium text-gray-700 mb-1.5";
const errorClass = "text-xs text-red-500 mt-1";

interface AddProductDrawerProps {
  open: boolean;
  categories: CategoryOption[];
  onClose: () => void;
  onSaved: () => void;
}

const AddProductDrawer: React.FC<AddProductDrawerProps> = ({
  open,
  categories,
  onClose,
  onSaved,
}) => {
  const [saving, setSaving] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
  const [subCategories, setSubCategories] = useState<SubCategoryOption[]>([]);
  const [variants, setVariants] = useState<VariantForm[]>([emptyVariant()]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Internal drawer visibility — separate from `open` so we can hide/show
  // the drawer independently when the warning modal is displayed
  const [drawerVisible, setDrawerVisible] = useState(true);

  // Warning modal state
  const [warningModal, setWarningModal] = useState<{
    open: boolean;
    title: string;
    description: string;
  }>({ open: false, title: "", description: "" });

  // Close drawer first, then show warning; on warning close, reopen drawer
  const showWarning = (title: string, description: string) => {
    setDrawerVisible(false);
    setTimeout(() => {
      setWarningModal({ open: true, title, description });
    }, 300); // wait for drawer slide-out transition
  };

  const closeWarning = () => {
    setWarningModal((prev) => ({ ...prev, open: false }));
    setDrawerVisible(true);
  };

  useEffect(() => {
    if (variants.length > 0 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [variants.length]);

  useEffect(() => {
    if (!open) return;
    setProductName("");
    setProductDescription("");
    setSelectedCategoryId("");
    setSelectedSubCategoryId("");
    setVariants([emptyVariant()]);
    setFormErrors({});
    setWarningModal({ open: false, title: "", description: "" });
    setDrawerVisible(true);
  }, [open]);

  useEffect(() => {
    if (!selectedCategoryId) {
      setSubCategories([]);
      setSelectedSubCategoryId("");
      return;
    }
    const fetch = async () => {
      const { data } = await supabase
        .from("sub_categories")
        .select("id, name, category_id")
        .eq("category_id", selectedCategoryId)
        .order("name");
      if (data) setSubCategories(data);
      setSelectedSubCategoryId("");
    };
    fetch();
  }, [selectedCategoryId]);

  const updateVariant = (
    key: string,
    field: keyof VariantForm,
    value: string | File | null,
  ) =>
    setVariants((prev) =>
      prev.map((v) => (v._key === key ? { ...v, [field]: value } : v)),
    );

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

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!productName.trim()) errors.name = "Product name is required";
    if (!selectedSubCategoryId)
      errors.subCategory = "Please select a sub-category.";
    variants.forEach((v, i) => {
      if (!v.sku.trim()) errors[`v_sku_${i}`] = "SKU is required";
      if (!v.price || isNaN(Number(v.price)))
        errors[`v_price_${i}`] = "Valid price is required";
      if (!v.stock_qty || isNaN(Number(v.stock_qty)))
        errors[`v_stock_${i}`] = "Valid stock qty is required";
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Returns true if no duplicates found, false if a duplicate was detected
  const checkDuplicates = async (): Promise<boolean> => {
    const skus = variants
      .map((v) => v.sku.toUpperCase().trim())
      .filter(Boolean);

    // 1. Duplicate SKUs within the form itself
    const skuSet = new Set<string>();
    for (const sku of skus) {
      if (skuSet.has(sku)) {
        showWarning(
          "Duplicate SKU in Form",
          `You've entered "${sku}" more than once. Each variant must have a unique SKU.`,
        );
        return false;
      }
      skuSet.add(sku);
    }

    const { data: existingProducts } = await supabase
      .from("products")
      .select("id")
      .ilike("name", productName.trim())
      .limit(1);

    if (existingProducts && existingProducts.length > 0) {
      showWarning(
        "Duplicate Product Name",
        `A product named "${productName.trim()}" already exists. Please use a different name.`,
      );
      return false;
    }

    if (skus.length > 0) {
      const { data: existingVariants } = await supabase
        .from("product_variants")
        .select("sku")
        .in("sku", skus);

      if (existingVariants && existingVariants.length > 0) {
        const dupes = existingVariants.map((v) => v.sku).join(", ");
        showWarning(
          "Duplicate SKU",
          `The following SKU${existingVariants.length > 1 ? "s are" : " is"} already in use: ${dupes}. Please use a unique SKU.`,
        );
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const noDuplicates = await checkDuplicates();
      if (!noDuplicates) {
        setSaving(false);
        return;
      }

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
      onSaved();
      onClose();
    } catch (err) {
      const error = err as Error;
      showWarning("Something went wrong", error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ConfirmModal
        open={warningModal.open}
        title={warningModal.title}
        description={warningModal.description}
        confirmLabel="Okay"
        cancelLabel="Close"
        variant="danger"
        onConfirm={closeWarning}
        onCancel={closeWarning}
      />

      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-xl bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open && drawerVisible ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
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
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-6"
        >
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
                value={productName}
                maxLength={100}
                onChange={(e) => {
                  setProductName(e.target.value);
                  if (e.target.value.trim()) {
                    setFormErrors((prev) => ({ ...prev, name: "" }));
                  }
                }}
                placeholder="e.g. Marble Flooring Tile"
                className={`${inputClass} ${formErrors.name ? "!border-red-400" : ""}`}
              />
              {formErrors.name && (
                <p className={errorClass}>{formErrors.name}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={productDescription}
                maxLength={500}
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
                <div className="relative">
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className={`${inputClass} text-gray-700 appearance-none pr-8`}
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
                    onChange={(e) => {
                      setSelectedSubCategoryId(e.target.value);
                      if (e.target.value.trim()) {
                        setFormErrors((prev) => ({ ...prev, subCategory: "" }));
                      }
                    }}
                    disabled={!selectedCategoryId}
                    className={`${inputClass} text-gray-700 disabled:opacity-50 appearance-none pr-8 disabled:cursor-not-allowed ${formErrors.subCategory ? "!border-red-400" : ""}`}
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
                {formErrors.subCategory && (
                  <p className={errorClass}>{formErrors.subCategory}</p>
                )}
              </div>
            </div>
          </div>

          {/* Variants */}
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
              <VariantFields
                key={v._key}
                variant={v}
                index={i}
                errors={formErrors}
                errorPrefix="v"
                onUpdate={updateVariant}
                onImageChange={handleVariantImage}
                onRemove={variants.length > 1 ? removeVariant : undefined}
                clearError={(key) =>
                  setFormErrors((prev) => ({ ...prev, [key]: "" }))
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
              "Save Product"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddProductDrawer;
