"use client";

import React, { useState, useMemo } from "react";
import { Inbox, Archive, Activity } from "lucide-react";
import Link from "next/link";
import HeaderUser from "@/components/admin/HeaderUser";
import HeaderNotifications from "@/components/admin/HeaderNotif";
import { useInquiryActivityLog } from "../hooks/useInquiryActivityLog";
import InquiryActivityLogTable from "../components/InquiryActivityLogTable";
import { useCurrentUser } from "@/app/admin/order-management/hooks/useCurrentUser";

const InquiryActivityLogPage: React.FC = () => {
  const { rows, loading } = useInquiryActivityLog();
  const { currentUser } = useCurrentUser();
  const permissions = currentUser?.permissions;
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    dir: "asc" | "desc";
  }>({
    field: "changed_at",
    dir: "desc",
  });

  const handleSort = (field: string) => {
    setSortConfig((prev) => ({
      field,
      dir: prev.field === field && prev.dir === "asc" ? "desc" : "asc",
    }));
  };

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const dir = sortConfig.dir === "asc" ? 1 : -1;
      const field = sortConfig.field as keyof typeof a;
      const valA = a[field];
      const valB = b[field];
      if (typeof valA === "number" && typeof valB === "number")
        return (valA - valB) * dir;
      return (
        String(valA || "")
          .toLowerCase()
          .localeCompare(String(valB || "").toLowerCase()) * dir
      );
    });
  }, [rows, sortConfig]);

  return (
    <div className="p-0">
      <div className="flex justify-between items-center mb-8 w-full gap-4">
        <div className="shrink-0">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
            Management
          </p>
          <h1 className="text-lg font-semibold text-gray-900">Inquiries</h1>
        </div>
        <div className="hidden lg:flex items-center gap-1">
          <HeaderNotifications />
          <HeaderUser />
        </div>
      </div>

      <div className="flex gap-1 bg-white rounded-xl border border-gray-100 shadow-sm p-1.5 mb-6 overflow-x-auto">
        <Link
          href="/admin/inquiry-management"
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors text-gray-500 hover:bg-gray-100"
        >
          <Inbox size={13} />
          Active
        </Link>
        {permissions?.inquiries.archive && (
          <Link
            href="/admin/inquiry-management/archived"
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors text-gray-500 hover:bg-gray-100"
          >
            <Archive size={13} />
            Archived
          </Link>
        )}
        <Link
          href="/admin/inquiry-management/activity-log"
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors bg-red-600 text-white shadow-sm"
        >
          <Activity size={13} />
          Activity Log
        </Link>
      </div>

      <InquiryActivityLogTable
        rows={sortedRows}
        loading={loading}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
    </div>
  );
};

export default InquiryActivityLogPage;
