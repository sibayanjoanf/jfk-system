"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import HeaderUser from "@/components/admin/HeaderUser";
import HeaderNotifications from "@/components/admin/HeaderNotif";
import { useInquiries } from "./hooks/useInquiries";
import { Inquiry } from "./types";
import InquiryTable from "./components/InquiryTable";
import InquiryDrawer from "./components/InquiryDrawer";
import ConfirmModal from "@/app/admin/components/ConfirmModal";
import { DateFilter } from "@/components/admin/CalendarPicker";
import Link from "next/link";
import { Inbox, Archive } from "lucide-react";
import { useCurrentUser } from "@/app/admin/order-management/hooks/useCurrentUser";

const InquiryManagement: React.FC = () => {
  const { inquiries, loading, updateStatus, archiveInquiries } = useInquiries();
  const { currentUser, loading: userLoading } = useCurrentUser();
  const canArchive =
    !userLoading && currentUser?.permissions?.orders.archive === true;
  const [filterStatus, setFilterStatus] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilter | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeInquiry, setActiveInquiry] = useState<Inquiry | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [sending, setSending] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    dir: "asc" | "desc";
  }>({
    field: "first_name",
    dir: "asc",
  });

  const handleSort = (field: string) => {
    setSortConfig((prev) => ({
      field,
      dir: prev.field === field && prev.dir === "asc" ? "desc" : "asc",
    }));
  };

  const sortedInquiries = useMemo(() => {
    return [...inquiries].sort((a, b) => {
      const dir = sortConfig.dir === "asc" ? 1 : -1;
      return a.first_name.localeCompare(b.first_name) * dir;
    });
  }, [inquiries, sortConfig]);

  const filteredInquiries = sortedInquiries.filter((i) => {
    const matchesStatus = filterStatus === "All" || i.status === filterStatus;
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
    return matchesStatus && matchesSearch && matchesDate;
  });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node))
        setIsFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const allSelected =
    filteredInquiries.length > 0 &&
    filteredInquiries.every((i) => selectedIds.includes(i.id));

  const toggleAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(filteredInquiries.map((i) => i.id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const openDrawer = async (inquiry: Inquiry) => {
    if (inquiry.status === "New") {
      const ok = await updateStatus(inquiry.id, "Viewed");
      setActiveInquiry(ok ? { ...inquiry, status: "Viewed" } : inquiry);
    } else {
      setActiveInquiry(inquiry);
    }
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setActiveInquiry(null), 300);
  };

  // Archive instead of delete
  const handleConfirmArchive = async () => {
    setArchiving(true);
    const ok = await archiveInquiries(selectedIds);
    if (ok) {
      if (activeInquiry && selectedIds.includes(activeInquiry.id))
        closeDrawer();
      setSelectedIds([]);
    }
    setArchiving(false);
    setConfirmOpen(false);
  };

  const handleSendReply = async (text: string) => {
    if (!activeInquiry || !text.trim()) return;
    setSending(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-admin-reply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          inquiryId: activeInquiry.id,
          firstName: activeInquiry.first_name,
          email: activeInquiry.email,
          message: activeInquiry.message,
          reply: text,
          createdAt: activeInquiry.created_at,
        }),
      },
    );

    setSending(false);

    if (!response.ok) {
      console.error("Failed to send reply");
      return;
    }

    setActiveInquiry({ ...activeInquiry, status: "Resolved" });
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
            <h1 className="text-lg font-semibold text-gray-900">Inquiries</h1>
          </div>
          <div className="relative flex-1 max-w-sm group">
            <span className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 pointer-events-none group-focus-within:text-red-600 transition-colors">
              <Search size={15} strokeWidth={2} />
            </span>
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              maxLength={50}
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
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors bg-red-600 text-white shadow-sm"
        >
          <Inbox size={13} />
          Active
        </Link>
        {canArchive && (
          <Link
            href="/admin/inquiry-management/archived"
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors text-gray-500 hover:bg-gray-100"
          >
            <Archive size={13} />
            Archived
          </Link>
        )}
      </div>

      {/* Table */}
      <InquiryTable
        inquiries={filteredInquiries}
        loading={loading}
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        selectedIds={selectedIds}
        isFilterOpen={isFilterOpen}
        filterRef={filterRef}
        dateFilter={dateFilter}
        onSearchChange={setSearchQuery}
        onFilterChange={(v) => {
          setFilterStatus(v);
          setIsFilterOpen(false);
        }}
        onFilterOpenToggle={() => setIsFilterOpen(!isFilterOpen)}
        onDateFilterChange={setDateFilter}
        onRowClick={openDrawer}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        onDeleteClick={() => setConfirmOpen(true)}
        allSelected={allSelected}
        someSelected={selectedIds.length > 0}
        sortConfig={sortConfig}
        onSort={handleSort}
        canArchive={canArchive}
      />

      {/* Archive Confirm Modal */}
      <ConfirmModal
        open={confirmOpen}
        title={`Archive ${selectedIds.length} ${selectedIds.length === 1 ? "inquiry" : "inquiries"}?`}
        description="Archived inquiries will be hidden from the list and can be restored later."
        confirmLabel="Yes, archive"
        loading={archiving}
        variant="archive"
        onConfirm={handleConfirmArchive}
        onCancel={() => !archiving && setConfirmOpen(false)}
      />

      {/* Drawer */}
      <InquiryDrawer
        open={drawerOpen}
        inquiry={activeInquiry}
        sending={sending}
        onClose={closeDrawer}
        onSendReply={handleSendReply}
      />
    </div>
  );
};

export default InquiryManagement;
