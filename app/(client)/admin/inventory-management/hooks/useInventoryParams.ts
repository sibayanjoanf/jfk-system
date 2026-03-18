import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { TabType } from "../types";

export function useInventoryParams() {
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
      if (params.get("page") === "1")        params.delete("page");
      if (params.get("size") === "10")       params.delete("size");
      if (params.get("tab") === "overview")  params.delete("tab");
      if (params.get("status") === "All")    params.delete("status");
      if (params.get("category") === "All")  params.delete("category");
      if (params.get("type") === "All")      params.delete("type");

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  const activeTab     = (searchParams.get("tab") as TabType) ?? "overview";
  const currentPage   = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize      = Number(searchParams.get("size") ?? "10");
  const searchQuery   = searchParams.get("q") ?? "";
  const statusFilter  = searchParams.get("status") ?? "All";
  const categoryFilter = searchParams.get("category") ?? "All";
  const typeFilter    = searchParams.get("type") ?? "All";

  const setActiveTab      = (v: TabType) => updateParams({ tab: v, page: "1" });
  const setCurrentPage    = (v: number)  => updateParams({ page: String(v) });
  const setPageSize       = (v: number)  => updateParams({ size: String(v), page: "1" });
  const setSearchQuery    = (v: string)  => updateParams({ q: v || null, page: "1" });
  const setStatusFilter   = (v: string)  => updateParams({ status: v, page: "1" });
  const setCategoryFilter = (v: string)  => updateParams({ category: v, page: "1" });
  const setTypeFilter     = (v: string)  => updateParams({ type: v, page: "1" });

  return {
    activeTab,
    currentPage,
    pageSize,
    searchQuery,
    statusFilter,
    categoryFilter,
    typeFilter,
    setActiveTab,
    setCurrentPage,
    setPageSize,
    setSearchQuery,
    setStatusFilter,
    setCategoryFilter,
    setTypeFilter,
  };
}