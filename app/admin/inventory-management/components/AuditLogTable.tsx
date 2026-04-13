"use client";


import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ArrowUpCircle,
  ArrowDownCircle,
  RotateCcw,
  Loader2,
  ChevronUp,
  Download,
} from "lucide-react";
import { MovementRow } from "../types";
import Pagination from "./Pagination";
import CalendarPicker, { DateFilter } from "@/components/admin/CalendarPicker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


interface AuditLogTableProps {
  rows: MovementRow[];
  loading: boolean;
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


const exportToCSV = (data: MovementRow[]) => {
  const headers = [
    "Movement,Product,SKU,Qty Change,Before,After,Reference,Date",
  ];


  const rows = data.map((entry) => {
    return [
      entry.movement_type,
      `"${entry.product_name}"`,
      entry.sku,
      entry.quantity_change,
      entry.quantity_before,
      entry.quantity_after,
      entry.reference_type || "N/A",
      new Date(entry.created_at).toLocaleString("en-PH"),
    ].join(",");
  });


  const csvContent = headers.concat(rows).join("\n");
  const blob = new Blob(["\ufeff" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);


  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `audit_log_${new Date().toISOString().split("T")[0]}.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


const AuditLogTable: React.FC<AuditLogTableProps> = ({
  rows,
  loading,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  sortConfig,
  onSort,
}) => {
  const [search, setSearch] = useState("");
  const [movFilter, setMovFilter] = useState("All");
  const [movFilterOpen, setMovFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter | null>(null);
  const movFilterRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        movFilterRef.current &&
        !movFilterRef.current.contains(e.target as Node)
      ) {
        setMovFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  const filtered = useMemo(
    () =>
      rows.filter((h) => {
        const q = search.toLowerCase();
        const matchesSearch =
          h.product_name.toLowerCase().includes(q) ||
          h.sku.toLowerCase().includes(q);
        const matchesMovement =
          movFilter === "All" ||
          h.movement_type.toLowerCase() === movFilter.toLowerCase();
        const matchesDate =
          !dateFilter ||
          (() => {
            const d = new Date(h.created_at ?? "");
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
        return matchesSearch && matchesMovement && matchesDate;
      }),
    [rows, search, movFilter, dateFilter, sortConfig],
  );


  const formatReference = (ref: string | null) => {
    if (!ref) return "—";
    switch (ref) {
      case "InboundBatch":
        return "Inbound";
      case "StockAdjustment":
        return "Adjustment";
      default:
        return ref;
    }
  };


  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );


  const getMovementStyles = (movement: string) => {
    switch (movement.toLowerCase()) {
      case "inbound":
        return "text-green-600 bg-green-50";
      case "adjustment":
        return "text-blue-600 bg-blue-50";
      case "consumed":
        return "text-orange-500 bg-orange-50";
      case "returned":
        return "text-purple-600 bg-purple-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };


  const getMovementIcon = (movement: string) => {
    switch (movement.toLowerCase()) {
      case "inbound":
        return <ArrowUpCircle size={13} className="text-green-500" />;
      case "adjustment":
        return <RotateCcw size={13} className="text-blue-500" />;
      case "consumed":
        return <ArrowDownCircle size={13} className="text-orange-500" />;
      case "returned":
        return <ArrowUpCircle size={13} className="text-purple-500" />;
      default:
        return null;
    }
  };


  const filterBtnClass = (active: boolean) =>
    `flex items-center gap-2 px-3 py-2 text-xs border rounded-lg font-medium transition-colors ${active ? "bg-red-600 text-white border-red-600" : "border-red-200 text-red-600 hover:bg-red-50"}`;


  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Audit Log</h2>
          <p className="text-xs text-gray-400 mt-1">
            Complete history of all stock movements — inbound, adjustments,
            consumption, and returns.
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
          <div className="relative" ref={movFilterRef}>
            <button
              onClick={() => setMovFilterOpen(!movFilterOpen)}
              className={filterBtnClass(movFilterOpen)}
            >
              {movFilter} <ChevronDown size={13} />
            </button>
            {movFilterOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                {["All", "Inbound", "Adjustment", "Consumed", "Returned"].map(
                  (f) => (
                    <button
                      key={f}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${f === movFilter ? "text-red-600 font-medium" : "text-gray-600"}`}
                      onClick={() => {
                        setMovFilter(f);
                        setMovFilterOpen(false);
                        onPageChange(1);
                      }}
                    >
                      {f}
                    </button>
                  ),
                )}
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


          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => exportToCSV(filtered)}
                    className="cursor-pointer flex items-center gap-1.5 px-2 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Download size={14} className="text-red-600" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  sideOffset={5}
                  className="text-[10px] py-1 px-2 bg-red-600"
                >
                  <p>Export to CSV</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>


      <div className="overflow-x-auto rounded-xl border border-gray-100">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
            <Loader2 className="animate-spin" size={20} />
            <p className="text-sm">Loading audit log...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="py-3 pl-5 font-semibold">Movement</th>
                <th
                  className="py-3 px-4 font-semibold cursor-pointer select-none hover:text-gray-600 transition-colors"
                  onClick={() => onSort("product_name")}
                >
                  <span className="inline-flex items-center gap-1">
                    Product
                    <SortArrows field="product_name" current={sortConfig} />
                  </span>
                </th>
                <th
                  className="py-3 px-4 font-semibold text-center cursor-pointer select-none hover:text-gray-600 transition-colors"
                  onClick={() => onSort("quantity_change")}
                >
                  <span className="inline-flex items-center gap-1 justify-center">
                    Qty Change
                    <SortArrows field="quantity_change" current={sortConfig} />
                  </span>
                </th>
                <th className="py-3 px-4 font-semibold text-center">Before</th>
                <th className="py-3 px-4 font-semibold text-center">After</th>
                <th className="py-3 px-4 font-semibold">Reference</th>
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
                    No history found.
                  </td>
                </tr>
              ) : (
                paginated.map((entry) => (
                  <tr
                    key={entry.id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="py-3.5 pl-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getMovementStyles(entry.movement_type)}`}
                      >
                        {getMovementIcon(entry.movement_type)}
                        {entry.movement_type.charAt(0).toUpperCase() +
                          entry.movement_type.slice(1)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-sm font-medium text-gray-900">
                        {entry.product_name}
                      </p>
                      <p className="text-xs text-gray-400">{entry.sku}</p>
                    </td>
                    <td
                      className={`py-3.5 px-4 text-sm font-semibold text-center ${
                        entry.movement_type === "adjustment" &&
                        entry.quantity_change === entry.quantity_after
                          ? "text-blue-600"
                          : entry.quantity_change > 0
                            ? "text-green-600"
                            : "text-red-600"
                      }`}
                    >
                      {entry.movement_type === "adjustment" &&
                      entry.quantity_before !== entry.quantity_after &&
                      entry.quantity_change === entry.quantity_after
                        ? `=${entry.quantity_change}`
                        : entry.quantity_change > 0
                          ? `+${entry.quantity_change}`
                          : entry.quantity_change}
                    </td>
                    <td className="py-3.5 px-4 text-sm text-gray-500 text-center">
                      {entry.quantity_before}
                    </td>
                    <td className="py-3.5 px-4 text-sm font-semibold text-gray-900 text-center">
                      {entry.quantity_after}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-gray-500">
                      {formatReference(entry.reference_type) ?? "—"}
                    </td>
                    <td className="py-3.5 pr-5 text-xs text-gray-500 text-center whitespace-nowrap">
                      <p>
                        {new Date(entry.created_at).toLocaleDateString(
                          "en-PH",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(entry.created_at).toLocaleTimeString(
                          "en-PH",
                          {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          },
                        )}
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


export default AuditLogTable;
