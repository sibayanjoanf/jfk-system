"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import HeaderUser from "@/components/admin/HeaderUser";
import HeaderNotifications from "@/components/admin/HeaderNotif";
import { useArchivedInquiries } from "../hooks/useArchivedInquiries";
import { Inquiry } from "../types";
import ArchivedInquiryTable from "./components/ArchivedInquiryTable";
import InquiryDrawer from "../components/InquiryDrawer";
import ConfirmModal from "@/app/admin/components/ConfirmModal";
import { DateFilter } from "@/components/admin/CalendarPicker";
import Link from "next/link";
import { Inbox, Archive } from "lucide-react";

const ArchivedInquiryManagement: React.FC = () => {
  const { inquiries, loading, restoreInquiries } = useArchivedInquiries();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeInquiry, setActiveInquiry] = useState<Inquiry | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const [sortConfig, setSortConfig] = useState<{
    field: string;
    dir: "asc" | "desc";
  }>({
    field: "first_name",
    dir: "asc",
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node))
        setIsFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSort = (field: string) => {
    setSortConfig((prev) => ({
      field,
      dir: prev.field === field && prev.dir === "asc" ? "desc" : "asc",
    }));
  };

  const filtered = useMemo(() => {
    return [...inquiries]
      .sort((a, b) => {
        const dir = sortConfig.dir === "asc" ? 1 : -1;
        return a.first_name.localeCompare(b.first_name) * dir;
      })
      .filter((i) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !q ||
          i.first_name.toLowerCase().includes(q) ||
          i.last_name.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          i.phone.toLowerCase().includes(q);
        const matchesDate =
          !dateFilter ||
          (() => {
            const d = new Date(i.created_at ?? "");
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
        return matchesSearch && matchesDate;
      });
  }, [inquiries, sortConfig, searchQuery, dateFilter]);

  const allSelected =
    filtered.length > 0 && filtered.every((i) => selectedIds.includes(i.id));

  const toggleAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(filtered.map((i) => i.id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const openDrawer = (inquiry: Inquiry) => {
    setActiveInquiry(inquiry);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setActiveInquiry(null), 300);
  };

  const handleConfirmRestore = async () => {
    setRestoring(true);
    const ok = await restoreInquiries(selectedIds);
    if (ok) {
      if (activeInquiry && selectedIds.includes(activeInquiry.id))
        closeDrawer();
      setSelectedIds([]);
    }
    setRestoring(false);
    setConfirmOpen(false);
  };

  return (
    <div className="p-0">
      <div className="flex justify-between items-center mb-8 w-full gap-4">
        <div className="flex items-center gap-6 flex-1">
          <div className="shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
              Management
            </p>
            <h1 className="text-lg font-semibold text-gray-900">
              Archived Inquiries
            </h1>
          </div>
          <div className="relative flex-1 max-w-sm group">
            <span className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 pointer-events-none group-focus-within:text-red-600 transition-colors">
              <Search size={15} strokeWidth={2} />
            </span>
            <input
              type="text"
              placeholder="Search by name, email, phone..."
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

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-gray-100 shadow-sm p-1.5 mb-6 overflow-x-auto">
        <Link
          href="/admin/inquiry-management"
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors text-gray-500 hover:bg-gray-100"
        >
          <Inbox size={13} />
          Active
        </Link>
        <Link
          href="/admin/inquiry-management/archived"
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors bg-red-600 text-white shadow-sm"
        >
          <Archive size={13} />
          Archived
        </Link>
      </div>

      <ArchivedInquiryTable
        inquiries={filtered}
        loading={loading}
        searchQuery={searchQuery}
        selectedIds={selectedIds}
        isFilterOpen={isFilterOpen}
        filterRef={filterRef}
        dateFilter={dateFilter}
        onSearchChange={setSearchQuery}
        onFilterOpenToggle={() => setIsFilterOpen(!isFilterOpen)}
        onDateFilterChange={setDateFilter}
        onRowClick={openDrawer}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        onRestoreClick={() => setConfirmOpen(true)}
        allSelected={allSelected}
        someSelected={selectedIds.length > 0}
        sortConfig={sortConfig}
        onSort={handleSort}
      />

      <ConfirmModal
        open={confirmOpen}
        title={`Restore ${selectedIds.length} ${selectedIds.length === 1 ? "inquiry" : "inquiries"}?`}
        description="These inquiries will be moved back to the active list."
        confirmLabel="Yes, restore"
        loading={restoring}
        variant="restore"
        onConfirm={handleConfirmRestore}
        onCancel={() => !restoring && setConfirmOpen(false)}
      />

      <InquiryDrawer
        open={drawerOpen}
        inquiry={activeInquiry}
        sending={false}
        onClose={closeDrawer}
        onSendReply={async () => {}}
      />
    </div>
  );
};

export default ArchivedInquiryManagement;
