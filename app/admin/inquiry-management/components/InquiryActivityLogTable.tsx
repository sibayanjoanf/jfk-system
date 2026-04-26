"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Archive,
  ArchiveRestore,
  Loader2,
} from "lucide-react";
import { InquiryActivityRow } from "../hooks/useInquiryActivityLog";
import CalendarPicker, { DateFilter } from "@/components/admin/CalendarPicker";
import Pagination from "@/app/admin/inventory-management/components/Pagination";

interface Props {
  rows: InquiryActivityRow[];
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

const getActionStyles = (action: string) => {
  switch (action) {
    case "status_change":
      return "text-blue-600 bg-blue-50";
    case "archived":
      return "text-amber-600 bg-amber-50";
    case "restored":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-500 bg-gray-50";
  }
};

const getActionIcon = (action: string) => {
  switch (action) {
    case "status_change":
      return <RotateCcw size={11} />;
    case "archived":
      return <Archive size={11} />;
    case "restored":
      return <ArchiveRestore size={11} />;
    default:
      return null;
  }
};

const getActionLabel = (action: string) => {
  switch (action) {
    case "status_change":
      return "Resolved";
    case "archived":
      return "Archived";
    case "restored":
      return "Restored";
    default:
      return action;
  }
};

const InquiryActivityLogTable: React.FC<Props> = ({
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
  const [actionFilter, setActionFilter] = useState("All");
  const [actionFilterOpen, setActionFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter | null>(null);

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        const q = search.toLowerCase();
        const matchesSearch =
          r.inquiry_email?.toLowerCase().includes(q) ||
          r.changed_by?.toLowerCase().includes(q);
        const matchesAction =
          actionFilter === "All" || r.action === actionFilter;
        const matchesDate =
          !dateFilter ||
          (() => {
            const d = new Date(r.changed_at);
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
        return matchesSearch && matchesAction && matchesDate;
      }),
    [rows, search, actionFilter, dateFilter],
  );

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Activity Log
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Complete history of resolved inquiries, archiving, and restores.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap sm:justify-end">
          <div className="relative group flex-1 sm:flex-none">
            <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none group-focus-within:text-red-600 transition-colors">
              <Search size={13} />
            </span>
            <input
              type="text"
              placeholder="Search email or user..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                onPageChange(1);
              }}
              className="pr-8 pl-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all w-full sm:w-52"
            />
          </div>
          <div className="relative">
            <button
              onClick={() => setActionFilterOpen(!actionFilterOpen)}
              className={`flex items-center gap-2 px-3 py-2 text-xs border rounded-lg font-medium transition-colors ${actionFilterOpen ? "bg-red-600 text-white border-red-600" : "border-red-200 text-red-600 hover:bg-red-50"}`}
            >
              {actionFilter === "All" ? "All" : getActionLabel(actionFilter)}
              <ChevronDown size={13} />
            </button>
            {actionFilterOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                {["All", "status_change", "archived", "restored"].map((f) => (
                  <button
                    key={f}
                    className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${f === actionFilter ? "text-red-600 font-medium" : "text-gray-600"}`}
                    onClick={() => {
                      setActionFilter(f);
                      setActionFilterOpen(false);
                      onPageChange(1);
                    }}
                  >
                    {f === "All" ? "All" : getActionLabel(f)}
                  </button>
                ))}
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
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-400">
            <Loader2 className="animate-spin" size={20} />
            <p className="text-sm">Loading activity log...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th
                  className="py-3 pl-5 font-semibold cursor-pointer select-none hover:text-gray-600"
                  onClick={() => onSort("inquiry_email")}
                >
                  <span className="inline-flex items-center gap-1">
                    Email{" "}
                    <SortArrows field="inquiry_email" current={sortConfig} />
                  </span>
                </th>
                <th className="py-3 px-4 font-semibold">Action</th>
                <th className="py-3 px-4 font-semibold">From</th>
                <th className="py-3 px-4 font-semibold">To</th>
                <th
                  className="py-3 px-4 font-semibold cursor-pointer select-none hover:text-gray-600"
                  onClick={() => onSort("changed_by")}
                >
                  <span className="inline-flex items-center gap-1">
                    Performed By{" "}
                    <SortArrows field="changed_by" current={sortConfig} />
                  </span>
                </th>
                <th
                  className="py-3 pr-5 font-semibold text-center cursor-pointer select-none hover:text-gray-600"
                  onClick={() => onSort("changed_at")}
                >
                  <span className="inline-flex items-center gap-1 justify-center">
                    Date <SortArrows field="changed_at" current={sortConfig} />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-xs text-gray-400"
                  >
                    No activity found.
                  </td>
                </tr>
              ) : (
                paginated.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    <td className="py-3.5 pl-5 text-sm text-gray-700">
                      {row.inquiry_email ?? "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getActionStyles(row.action)}`}
                      >
                        {getActionIcon(row.action)}
                        {getActionLabel(row.action)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      {row.from_status ?? "—"}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-gray-700">
                      {row.action === "archived"
                        ? "Archived"
                        : row.action === "restored"
                          ? "Active"
                          : row.status}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      {row.changed_by}
                    </td>
                    <td className="py-3.5 pr-5 text-xs text-gray-500 text-center whitespace-nowrap">
                      <p>
                        {new Date(row.changed_at).toLocaleDateString("en-PH", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(row.changed_at).toLocaleTimeString("en-PH", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
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

export default InquiryActivityLogTable;
