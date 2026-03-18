"use client";

import React from "react";
import {
  Search,
  Trash2,
  ChevronDown,
  Calendar,
  MessageSquare,
  Loader2,
} from "lucide-react";
import {
  Inquiry,
  formatDate,
  getStatusTextColor,
  getStatusDot,
  getStatusBg,
  initials,
} from "../types";

interface InquiryTableProps {
  inquiries: Inquiry[];
  loading: boolean;
  searchQuery: string;
  filterStatus: string;
  selectedIds: string[];
  isFilterOpen: boolean;
  isCalendarOpen: boolean;
  calendarRef: React.RefObject<HTMLDivElement | null>;
  onSearchChange: (v: string) => void;
  onFilterChange: (v: string) => void;
  onFilterOpenToggle: () => void;
  onCalendarToggle: () => void;
  onRowClick: (inquiry: Inquiry) => void;
  onToggleAll: () => void;
  onToggleOne: (id: string) => void;
  onDeleteClick: () => void;
  allSelected: boolean;
  someSelected: boolean;
}

const InquiryTable: React.FC<InquiryTableProps> = ({
  inquiries,
  loading,
  searchQuery,
  filterStatus,
  selectedIds,
  isFilterOpen,
  isCalendarOpen,
  calendarRef,
  onSearchChange,
  onFilterChange,
  onFilterOpenToggle,
  onCalendarToggle,
  onRowClick,
  onToggleAll,
  onToggleOne,
  onDeleteClick,
  allSelected,
  someSelected,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Messages</h2>
          <p className="text-gray-400 text-xs mt-1 leading-relaxed">
            All inquiries submitted by customers are listed below.
            <br />
            Click on a particular inquiry to view its full details.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {someSelected && (
            <button
              onClick={onDeleteClick}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors animate-in fade-in duration-150"
            >
              <Trash2 size={13} />
              Delete ({selectedIds.length})
            </button>
          )}

          <div className="relative" ref={calendarRef}>
            <button
              onClick={onCalendarToggle}
              className={`flex items-center gap-2 p-2 border rounded-lg transition-colors ${
                isCalendarOpen
                  ? "bg-red-600 text-white border-red-600"
                  : "border-red-200 text-red-600 hover:bg-red-50"
              }`}
            >
              <Calendar size={16} />
            </button>
          </div>

          <div className="relative">
            <button
              onClick={onFilterOpenToggle}
              className={`flex items-center gap-2 px-4 py-2 text-xs border rounded-lg font-medium transition-colors ${
                isFilterOpen
                  ? "bg-red-600 text-white border-red-600"
                  : "border-red-200 text-red-600 hover:bg-red-50"
              }`}
            >
              <span>{filterStatus}</span>
              <ChevronDown size={14} />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                {["All", "New", "Viewed", "Resolved"].map((s) => (
                  <button
                    key={s}
                    className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${s === filterStatus ? "text-red-600 font-medium" : "text-gray-600"}`}
                    onClick={() => onFilterChange(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
            <Loader2 className="animate-spin" size={20} />
            <p className="text-sm">Loading inquiries...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-gray-400">
            <MessageSquare size={24} strokeWidth={1.5} />
            <p className="text-sm">No inquiries found.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="py-3 pl-5 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={onToggleAll}
                    className="w-3.5 h-3.5 rounded border-gray-300 accent-red-600 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 font-semibold text-left">Customer</th>
                <th className="py-3 px-4 font-semibold text-center">Phone</th>
                <th className="py-3 px-4 font-semibold text-center">Date</th>
                <th className="py-3 pr-5 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inquiries.map((inquiry) => (
                <tr
                  key={inquiry.id}
                  onClick={() => onRowClick(inquiry)}
                  className={`hover:bg-gray-100 transition-colors cursor-pointer ${
                    selectedIds.includes(inquiry.id) ? "bg-red-50/80" : ""
                  }`}
                >
                  <td
                    className="py-3.5 pl-5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(inquiry.id)}
                      onChange={() => onToggleOne(inquiry.id)}
                      className="w-3.5 h-3.5 rounded border-gray-300 accent-red-600 cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-gray-100 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold text-gray-500">
                        {initials(inquiry.first_name, inquiry.last_name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {inquiry.first_name} {inquiry.last_name}
                        </p>
                        <p className="text-xs text-gray-400">{inquiry.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-gray-500 text-center">
                    {inquiry.phone}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gray-500 text-center whitespace-nowrap">
                    {formatDate(inquiry.created_at)}
                  </td>
                  <td className="py-3.5 pr-5 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusTextColor(inquiry.status)} ${getStatusBg(inquiry.status)}`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${getStatusDot(inquiry.status)}`}
                      />
                      {inquiry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InquiryTable;
