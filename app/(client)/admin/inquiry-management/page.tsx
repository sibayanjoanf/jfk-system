"use client";

import React, { useState, useRef } from "react";
import { Search } from "lucide-react";
import HeaderUser from "@/components/admin/HeaderUser";
import HeaderNotifications from "@/components/admin/HeaderNotif";

import { useInquiries } from "./hooks/useInquiries";
import { Inquiry } from "./types";

import InquiryTable from "./components/InquiryTable";
import InquiryDrawer from "./components/InquiryDrawer";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

const InquiryManagement: React.FC = () => {
  const { inquiries, loading, updateStatus, deleteInquiries } = useInquiries();

  const [filterStatus, setFilterStatus] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeInquiry, setActiveInquiry] = useState<Inquiry | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);

  const filteredInquiries = inquiries.filter((i) => {
    const matchesStatus = filterStatus === "All" || i.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      i.first_name.toLowerCase().includes(q) ||
      i.last_name.toLowerCase().includes(q) ||
      i.email.toLowerCase().includes(q) ||
      i.phone.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

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

  const handleConfirmDelete = async () => {
    setDeleting(true);
    const ok = await deleteInquiries(selectedIds);
    if (ok) {
      if (activeInquiry && selectedIds.includes(activeInquiry.id))
        closeDrawer();
      setSelectedIds([]);
    }
    setDeleting(false);
    setConfirmOpen(false);
  };

  const handleSendReply = (text: string) => {
    // TODO: implement email send + mark as Resolved
    console.log("Reply:", text);
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

      {/* Table */}
      <InquiryTable
        inquiries={filteredInquiries}
        loading={loading}
        searchQuery={searchQuery}
        filterStatus={filterStatus}
        selectedIds={selectedIds}
        isFilterOpen={isFilterOpen}
        isCalendarOpen={isCalendarOpen}
        calendarRef={calendarRef}
        onSearchChange={setSearchQuery}
        onFilterChange={(v) => {
          setFilterStatus(v);
          setIsFilterOpen(false);
        }}
        onFilterOpenToggle={() => setIsFilterOpen(!isFilterOpen)}
        onCalendarToggle={() => setIsCalendarOpen(!isCalendarOpen)}
        onRowClick={openDrawer}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        onDeleteClick={() => setConfirmOpen(true)}
        allSelected={allSelected}
        someSelected={selectedIds.length > 0}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={confirmOpen}
        count={selectedIds.length}
        deleting={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => !deleting && setConfirmOpen(false)}
      />

      {/* Drawer */}
      <InquiryDrawer
        open={drawerOpen}
        inquiry={activeInquiry}
        onClose={closeDrawer}
        onSendReply={handleSendReply}
      />
    </div>
  );
};

export default InquiryManagement;
