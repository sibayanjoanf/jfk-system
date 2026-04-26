"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import {
  Inquiry,
  formatDateFull,
  getStatusTextColor,
  getStatusDot,
  getStatusBg,
  initials,
} from "../types";

interface InquiryDrawerProps {
  open: boolean;
  inquiry: Inquiry | null;
  sending: boolean;
  onClose: () => void;
  onSendReply: (text: string) => void;
  canReply?: boolean;
}

const InquiryDrawer: React.FC<InquiryDrawerProps> = ({
  open,
  inquiry,
  sending,
  onClose,
  onSendReply,
  canReply = false,
}) => {
  const [replyText, setReplyText] = useState("");

  const handleSend = () => {
    onSendReply(replyText);
    setReplyText("");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-60 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {inquiry && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Inquiry Details
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDateFull(inquiry.created_at)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Sender Info */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Sender Information
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
                    {initials(inquiry.first_name, inquiry.last_name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {inquiry.first_name} {inquiry.last_name}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium mt-0.5 ${getStatusTextColor(inquiry.status)} ${getStatusBg(inquiry.status)}`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${getStatusDot(inquiry.status)}`}
                      />
                      {inquiry.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-[10px] tracking-wider text-gray-400 font-medium mb-1">
                      First Name
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {inquiry.first_name}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-[10px] tracking-wider text-gray-400 font-medium mb-1">
                      Last Name
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {inquiry.last_name}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[10px] tracking-wider text-gray-400 font-medium mb-1">
                    Email
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {inquiry.email}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[10px] tracking-wider text-gray-400 font-medium mb-1">
                    Phone
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {inquiry.phone}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-[10px] tracking-wider text-gray-400 font-medium mb-1">
                    Date Submitted
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {formatDateFull(inquiry.created_at)}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Message
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 max-h-48 overflow-y-auto">
                  <p className="text-sm text-gray-700 leading-relaxed break-words whitespace-pre-wrap">
                    {inquiry.message}
                  </p>
                </div>
              </div>

              {/* Reply */}
              {canReply && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Reply
                  </h3>
                  <textarea
                    value={replyText}
                    onChange={(e) => {
                      const text = e.target.value;
                      const nonWhitespaceCount = text.replace(/\s/g, "").length;
                      if (nonWhitespaceCount <= 500) {
                        setReplyText(text);
                      }
                    }}
                    placeholder="Write your reply to the customer here..."
                    rows={5}
                    disabled={inquiry.status === "Resolved" || sending}
                    className="w-full px-3.5 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {inquiry.status === "Resolved" && (
                    <p className="text-xs text-green-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block" />
                      This inquiry has been resolved.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3 shrink-0 bg-white">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
              {canReply && (
                <button
                  onClick={handleSend}
                  disabled={
                    !replyText.trim() ||
                    inquiry.status === "Resolved" ||
                    sending
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Sending...
                    </>
                  ) : (
                    "Send Reply"
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default InquiryDrawer;
