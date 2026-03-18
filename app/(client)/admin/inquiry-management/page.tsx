"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Search,
  Trash2,
  ChevronDown,
  X,
  MessageSquare,
  Loader2,
} from "lucide-react";
import "react-day-picker/dist/style.css";
import { supabase } from "@/lib/supabase";
import HeaderUser from "@/components/admin/HeaderUser";
import HeaderNotifications from "@/components/admin/HeaderNotif";

interface Inquiry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  status: "New" | "Reviewed" | "Resolved";
  created_at: string;
}

const formatDate = (iso: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateFull = (iso: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const InquiryManagement: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeInquiry, setActiveInquiry] = useState<Inquiry | null>(null);
  const [replyText, setReplyText] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact")
        .select(
          "id, first_name, last_name, email, phone, message, status, created_at",
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching contacts:", error);
      } else if (data) {
        setInquiries(data as Inquiry[]);
      }
      setLoading(false);
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  const someSelected = selectedIds.length > 0;

  const toggleAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(filteredInquiries.map((i) => i.id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const updateStatus = async (id: string, newStatus: Inquiry["status"]) => {
    const { error } = await supabase
      .from("contact")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Failed to update status:", error);
      return false;
    }

    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)),
    );
    return true;
  };

  const confirmDelete = async () => {
    setDeleting(true);

    const { error } = await supabase
      .from("contact")
      .delete()
      .in("id", selectedIds);

    if (error) {
      console.error("Error deleting records:", error);
      setDeleting(false);
      setConfirmOpen(false);
      return;
    }

    if (activeInquiry && selectedIds.includes(activeInquiry.id)) {
      closeDrawer();
    }

    setInquiries((prev) => prev.filter((i) => !selectedIds.includes(i.id)));
    setSelectedIds([]);
    setDeleting(false);
    setConfirmOpen(false);
  };

  const openDrawer = async (inquiry: Inquiry) => {
    setReplyText("");

    if (inquiry.status === "New") {
      const ok = await updateStatus(inquiry.id, "Reviewed");
      setActiveInquiry(ok ? { ...inquiry, status: "Reviewed" } : inquiry);
    } else {
      setActiveInquiry(inquiry);
    }

    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setActiveInquiry(null), 300);
  };

  const [sending, setSending] = useState(false);

  const handleSendReply = async () => {
    if (!activeInquiry || !replyText.trim()) return;
    setSending(true);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-admin-reply`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          inquiryId: activeInquiry.id,
          firstName: activeInquiry.first_name,
          email: activeInquiry.email,
          message: activeInquiry.message,
          reply: replyText,
          createdAt: activeInquiry.created_at,
        }),
      }
    );

    setSending(false);

    if (!response.ok) {
      console.error('Failed to send reply');
      return;
    }

    // update status locally so UI reflects immediately without refetch
    setInquiries((prev) =>
      prev.map((i) => i.id === activeInquiry.id ? { ...i, status: 'Resolved' } : i)
    );
    setActiveInquiry({ ...activeInquiry, status: 'Resolved' });
    setReplyText('');
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "New":
        return "text-[#20B2DF]";
      case "Reviewed":
        return "text-[#FF8E29]";
      case "Resolved":
        return "text-[#27D095]";
      default:
        return "text-gray-500";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "New":
        return "bg-[#20B2DF]";
      case "Reviewed":
        return "bg-[#FF8E29]";
      case "Resolved":
        return "bg-[#27D095]";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "New":
        return "bg-[#20B2DF]/10";
      case "Reviewed":
        return "bg-[#FF8E29]/10";
      case "Resolved":
        return "bg-[#27D095]/10";
      default:
        return "bg-gray-100";
    }
  };

  const initials = (first: string, last: string) =>
    `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

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

      {/* Main Card */}
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
                onClick={() => setConfirmOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors animate-in fade-in duration-150"
              >
                <Trash2 size={13} />
                Delete ({selectedIds.length})
              </button>
            )}

            <div className="relative" ref={calendarRef}>
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
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
                onClick={() => setIsFilterOpen(!isFilterOpen)}
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
                  {["All", "New", "Reviewed", "Resolved"].map((s) => (
                    <button
                      key={s}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${s === filterStatus ? "text-red-600 font-medium" : "text-gray-600"}`}
                      onClick={() => {
                        setFilterStatus(s);
                        setIsFilterOpen(false);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
              <Loader2 className="animate-spin" size={20} />
              <p className="text-sm">Loading inquiries...</p>
            </div>
          ) : filteredInquiries.length === 0 ? (
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
                      onChange={toggleAll}
                      className="w-3.5 h-3.5 rounded border-gray-300 accent-red-600 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold text-left">
                    Customer
                  </th>
                  <th className="py-3 px-4 font-semibold text-center">Phone</th>
                  <th className="py-3 px-4 font-semibold text-center">Date</th>
                  <th className="py-3 pr-5 font-semibold text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredInquiries.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    onClick={() => openDrawer(inquiry)}
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
                        onChange={() => toggleOne(inquiry.id)}
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
                          <p className="text-xs text-gray-400">
                            {inquiry.email}
                          </p>
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

      {/* Delete Confirm Modal */}
      {confirmOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-50 backdrop-blur-sm flex items-center justify-center"
          onClick={() => !deleting && setConfirmOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Delete {selectedIds.length}{" "}
              {selectedIds.length === 1 ? "inquiry" : "inquiries"}?
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              This action is permanent and cannot be undone. The selected{" "}
              {selectedIds.length === 1 ? "record" : "records"} will be removed
              from the database.
            </p>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 size={12} className="animate-spin" /> Deleting...
                  </>
                ) : (
                  "Yes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {activeInquiry && (
          <>
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Inquiry Details
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDateFull(activeInquiry.created_at)}
                </p>
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Sender Info */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Sender Information
                </h3>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
                    {initials(
                      activeInquiry.first_name,
                      activeInquiry.last_name,
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {activeInquiry.first_name} {activeInquiry.last_name}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium mt-0.5 ${getStatusTextColor(activeInquiry.status)} ${getStatusBg(activeInquiry.status)}`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${getStatusDot(activeInquiry.status)}`}
                      />
                      {activeInquiry.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-[10px] tracking-wider text-gray-400 font-medium mb-1">
                      First Name
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {activeInquiry.first_name}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-[10px] tracking-wider text-gray-400 font-medium mb-1">
                      Last Name
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {activeInquiry.last_name}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[10px] tracking-wider text-gray-400 font-medium mb-1">
                    Email
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {activeInquiry.email}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[10px] tracking-wider text-gray-400 font-medium mb-1">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {activeInquiry.phone}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[10px] tracking-wider text-gray-400 font-medium mb-1">
                    Date Submitted
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {formatDateFull(activeInquiry.created_at)}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Message
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {activeInquiry.message}
                  </p>
                </div>
              </div>

              {/* Reply */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Reply
                </h3>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply to the customer here..."
                  rows={5}
                  disabled={activeInquiry.status === "Resolved"}
                  className="w-full px-3.5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {activeInquiry.status === "Resolved" && (
                  <p className="text-xs text-[#27D095] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#27D095] inline-block" />
                    This inquiry has been resolved.
                  </p>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 shrink-0 bg-white">
              <button
                onClick={closeDrawer}
                className="flex-1 px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={handleSendReply}
                disabled={!replyText.trim() || activeInquiry.status === 'Resolved' || sending}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Sending...
                  </>
                ) : (
                  'Send Reply'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InquiryManagement;
