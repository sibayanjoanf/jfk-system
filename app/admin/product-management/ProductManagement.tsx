"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  Archive,
  ChevronDown,
  ChevronUp,
  Loader2,
  Package,
  Inbox,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import HeaderUser from "@/components/admin/HeaderUser";
import HeaderNotifications from "@/components/admin/HeaderNotif";
import { useInventory } from "./hooks/useInventory";
import { useProductParams } from "./hooks/useProductParams";
import {
  ProductRow,
  SortField,
  CategoryOption,
  SubCategoryOption,
} from "./types";
import Pagination from "./components/Pagination";
import AddProductDrawer from "./components/AddProdDrawer";
import EditProductDrawer from "./components/EditProdDrawer";
import ConfirmModal from "@/app/admin/components/ConfirmModal";

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

const ProductManagement: React.FC = () => {
  const { products, setProducts, loading, fetchInventory } = useInventory();
  const {
    searchQuery,
    categoryFilter,
    statusFilter,
    subCategoryFilter,
    currentPage,
    pageSize,
    sortConfig,
    setSearchQuery,
    setCategoryFilterAndReset,
    setStatusFilter,
    setSubCategoryFilter,
    setCurrentPage,
    setPageSize,
    setSortConfig,
  } = useProductParams();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<
    "status" | "category" | "subCategory" | null
  >(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [allSubCategories, setAllSubCategories] = useState<SubCategoryOption[]>(
    [],
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [addDrawerOpen, setAddDrawerOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductRow | null>(null);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    supabase
      .from("categories")
      .select("id, name")
      .order("name")
      .then(({ data }) => {
        if (data) setCategories(data);
      });
    supabase
      .from("sub_categories")
      .select("id, name, category_id")
      .order("name")
      .then(({ data }) => {
        if (data) setAllSubCategories(data);
      });
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setOpenDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const visibleSubCategories = useMemo(() => {
    if (categoryFilter === "All") return allSubCategories;
    const cat = categories.find((c) => c.name === categoryFilter);
    if (!cat) return allSubCategories;
    return allSubCategories.filter((s) => s.category_id === cat.id);
  }, [allSubCategories, categories, categoryFilter]);

  const filteredProducts = useMemo(() => {
    const result = products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || p.category === categoryFilter;
      const matchesSubCategory =
        subCategoryFilter === "All" || p.sub_category === subCategoryFilter;
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      return (
        matchesSearch && matchesCategory && matchesSubCategory && matchesStatus
      );
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
  }, [
    products,
    searchQuery,
    categoryFilter,
    subCategoryFilter,
    statusFilter,
    sortConfig,
  ]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const toggleAll = () => {
    if (
      paginatedProducts.length > 0 &&
      paginatedProducts.every((p) => selectedIds.includes(p.id))
    )
      setSelectedIds([]);
    else setSelectedIds(paginatedProducts.map((p) => p.id));
  };

  const toggleOne = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const toggleSort = (field: SortField) => {
    setSortConfig((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" },
    );
  };

  // Archive instead of delete
  const confirmArchive = async () => {
    setArchiving(true);

    // Archive selected variants
    const { error: variantError } = await supabase
      .from("product_variants")
      .update({ is_archived: true })
      .in("id", selectedIds);

    if (variantError) {
      console.error("Variant archive error:", variantError);
      setArchiving(false);
      setConfirmOpen(false);
      return;
    }

    // Check if any parent products now have zero active variants → archive them too
    const productIds = [
      ...new Set(
        products
          .filter((p) => selectedIds.includes(p.id))
          .map((p) => p.product_id),
      ),
    ];

    for (const productId of productIds) {
      const { count } = await supabase
        .from("product_variants")
        .select("id", { count: "exact", head: true })
        .eq("product_id", productId)
        .eq("is_archived", false);

      if (count === 0) {
        await supabase
          .from("products")
          .update({ is_archived: true })
          .eq("id", productId);
      }
    }

    setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setSelectedIds([]);
    setArchiving(false);
    setConfirmOpen(false);

    const remaining = filteredProducts.length - selectedIds.length;
    const newTotalPages = Math.ceil(remaining / pageSize);
    if (currentPage > newTotalPages && newTotalPages > 0)
      setCurrentPage(newTotalPages);
  };

  return (
    <div className="p-0">
      {/* Page Header */}
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
              placeholder="Search by name, SKU..."
              value={searchQuery}
              maxLength={50}
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

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-gray-100 shadow-sm p-1.5 mb-6 overflow-x-auto">
        <Link
          href="/admin/product-management"
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors bg-red-600 text-white shadow-sm"
        >
          <Inbox size={13} />
          Active
        </Link>
        <Link
          href="/admin/product-management/archived"
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors text-gray-500 hover:bg-gray-100"
        >
          <Archive size={13} />
          Archived
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Product Management
            </h2>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
              Total {products.length} product variants found. Click a row to
              view and edit full details.
            </p>
          </div>
          <div
            ref={dropdownRef}
            className="flex flex-wrap gap-2 items-center shrink-0"
          >
            {selectedIds.length > 0 && (
              <button
                onClick={() => setConfirmOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-600 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors animate-in fade-in duration-150"
              >
                <Archive size={13} />
                Archive ({selectedIds.length})
              </button>
            )}

            {/* Status filter */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "status" ? null : "status")
                }
                className={`flex items-center gap-2 px-4 py-2 text-xs border rounded-lg font-medium transition-colors ${openDropdown === "status" ? "bg-red-600 text-white border-red-600" : "border-red-200 text-red-600 hover:bg-red-50"}`}
              >
                <span>{statusFilter === "All" ? "Status" : statusFilter}</span>
                <ChevronDown size={14} />
              </button>
              {openDropdown === "status" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-150 absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                  {["All", "In Stock", "Low Stock", "Out of Stock"].map((s) => (
                    <button
                      key={s}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${s === statusFilter ? "text-red-600 font-semibold" : "text-gray-600"}`}
                      onClick={() => {
                        setStatusFilter(s);
                        setOpenDropdown(null);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category filter */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "category" ? null : "category",
                  )
                }
                className={`flex items-center gap-2 px-4 py-2 text-xs border rounded-lg font-medium transition-colors ${openDropdown === "category" ? "bg-red-600 text-white border-red-600" : "border-red-200 text-red-600 hover:bg-red-50"}`}
              >
                <span>
                  {categoryFilter === "All" ? "Category" : categoryFilter}
                </span>
                <ChevronDown size={14} />
              </button>
              {openDropdown === "category" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-150 absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                  {["All", ...categories.map((c) => c.name)].map((cat) => (
                    <button
                      key={cat}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${cat === categoryFilter ? "text-red-600 font-semibold" : "text-gray-600"}`}
                      onClick={() => {
                        setCategoryFilterAndReset(cat);
                        setOpenDropdown(null);
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sub-category filter */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "subCategory" ? null : "subCategory",
                  )
                }
                className={`flex items-center gap-2 px-4 py-2 text-xs border rounded-lg font-medium transition-colors ${openDropdown === "subCategory" ? "bg-red-600 text-white border-red-600" : "border-red-200 text-red-600 hover:bg-red-50"}`}
              >
                <span>
                  {subCategoryFilter === "All"
                    ? "Sub-category"
                    : subCategoryFilter}
                </span>
                <ChevronDown size={14} />
              </button>
              {openDropdown === "subCategory" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-150 absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto">
                  <button
                    className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${subCategoryFilter === "All" ? "text-red-600 font-semibold" : "text-gray-600"}`}
                    onClick={() => {
                      setSubCategoryFilter("All");
                      setOpenDropdown(null);
                    }}
                  >
                    All
                  </button>
                  {visibleSubCategories.map((s) => (
                    <button
                      key={s.id}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${s.name === subCategoryFilter ? "text-red-600 font-semibold" : "text-gray-600"}`}
                      onClick={() => {
                        setSubCategoryFilter(s.name);
                        setOpenDropdown(null);
                      }}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setAddDrawerOpen(true)}
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
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-2 text-gray-400">
              <Package size={24} strokeWidth={1.5} />
              <p className="text-sm">No products found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  <th className="py-3 pl-5 w-10">
                    <input
                      type="checkbox"
                      checked={
                        paginatedProducts.length > 0 &&
                        paginatedProducts.every((p) =>
                          selectedIds.includes(p.id),
                        )
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
                      { label: "Sub-category", field: null, align: "center" },
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
                {paginatedProducts.map((product) => (
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
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 leading-none">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {product.category}
                          </p>
                        </div>
                      </div>
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
                      {product.sub_category}
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

        {/* Pagination */}
        {!loading && filteredProducts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={filteredProducts.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>

      {/* Archive Confirm Modal */}
      <ConfirmModal
        open={confirmOpen}
        title={`Archive ${selectedIds.length} ${selectedIds.length === 1 ? "variant" : "variants"}?`}
        description="Archived variants will be hidden from the product list. If all variants of a product are archived, the product will be archived too. You can restore them later."
        confirmLabel="Yes, archive"
        loading={archiving}
        variant="archive"
        onConfirm={confirmArchive}
        onCancel={() => setConfirmOpen(false)}
      />

      <AddProductDrawer
        open={addDrawerOpen}
        categories={categories}
        onClose={() => setAddDrawerOpen(false)}
        onSaved={fetchInventory}
      />
      <EditProductDrawer
        product={editProduct}
        open={editDrawerOpen}
        categories={categories}
        onClose={() => setEditDrawerOpen(false)}
        onSaved={fetchInventory}
      />
    </div>
  );
};

export default ProductManagement;
