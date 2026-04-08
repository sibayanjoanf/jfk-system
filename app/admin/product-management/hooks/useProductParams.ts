import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SortField, SortDir } from "../types";

export function useProductParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      if (params.get("page") === "1") params.delete("page");
      if (params.get("size") === "10") params.delete("size");
      if (params.get("category") === "All") params.delete("category");
      if (params.get("subCategory") === "All") params.delete("subCategory");
      if (params.get("status") === "All") params.delete("status");
      if (!params.get("sortField")) params.delete("sortDir");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const searchQuery    = searchParams.get("q") ?? "";
  const categoryFilter = searchParams.get("category") ?? "All";
  const statusFilter      = searchParams.get("status") ?? "All";
  const subCategoryFilter = searchParams.get("subCategory") ?? "All";
  const currentPage    = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize       = Number(searchParams.get("size") ?? "10");
  const sortField      = (searchParams.get("sortField") as SortField) ?? null;
  const sortDir        = (searchParams.get("sortDir") as SortDir) ?? "asc";
  const sortConfig     = { field: sortField, dir: sortDir };

  const setSearchQuery    = (v: string) => updateParams({ q: v || null, page: "1" });
  const setCategoryFilter = (v: string) => updateParams({ category: v, page: "1" });
  const setCategoryFilterAndReset = (v: string) => updateParams({ category: v, subCategory: "All", page: "1" });
  const setStatusFilter      = (v: string) => updateParams({ status: v, page: "1" });
  const setSubCategoryFilter = (v: string) => updateParams({ subCategory: v, page: "1" });
  const setCurrentPage    = (v: number) => updateParams({ page: String(v) });
  const setPageSize       = (v: number) => updateParams({ size: String(v), page: "1" });
  const setSortConfig = (
    updater: (prev: { field: SortField; dir: SortDir }) => { field: SortField; dir: SortDir },
  ) => {
    const next = updater(sortConfig);
    updateParams({ sortField: next.field ?? null, sortDir: next.dir, page: "1" });
  };

  return {
    searchQuery,
    categoryFilter,
    statusFilter,
    subCategoryFilter,
    currentPage,
    pageSize,
    sortConfig,
    setSearchQuery,
    setCategoryFilter,
    setCategoryFilterAndReset,
    setStatusFilter,
    setSubCategoryFilter,
    setCurrentPage,
    setPageSize,
    setSortConfig,
  };
}