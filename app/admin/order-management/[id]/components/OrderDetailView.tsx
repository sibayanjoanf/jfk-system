"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  ChevronDown,
  Loader2,
  Pencil,
  Check,
  X,
} from "lucide-react";
import {
  Order,
  OrderStatus,
  ALLOWED_TRANSITIONS,
  STATUS_COLORS,
  STATUS_BG_COLORS,
} from "../../types";
import { useOrderMutations } from "../../hooks/useOrderMutations";
import StatusBadge from "../../components/StatusBadge";
import OrderItems from "./OrderItems";
import OrderTimeline from "./OrderTimeline";
import InvoiceDownload from "./InvoiceDownload";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  initialOrder: Order;
}

const inputClass =
  "w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all";

const formatName = (name: string) => {
  return name
    .replace(/\s{2,}/g, ' ') 
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

const validateEmailFormat = (val: string) => {
  if (!val) return true; 
  if (val.length > 100) return false;
  
  if (!/^[a-zA-Z0-9]/.test(val)) return false;
  if (/\.\./.test(val)) return false;

  const parts = val.split("@");
  if (parts.length !== 2) return false; 

  const beforeAt = parts[0];
  const afterAt = parts[1];

  if (!beforeAt || !afterAt) return false;

  if (!/^[a-zA-Z0-9_.+-]+$/.test(beforeAt)) return false;
  if (beforeAt.endsWith(".")) return false;

  if (!/^[a-zA-Z0-9.-]+$/.test(afterAt)) return false;
  if (afterAt.startsWith(".") || afterAt.endsWith(".")) return false;

  return true;
};

const OrderDetailView: React.FC<Props> = ({ initialOrder }) => {
  const router = useRouter();
  const { updateStatus, updateOrder } = useOrderMutations();

  const [order, setOrder] = useState<Order>(initialOrder);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...initialOrder });
  const [saving, setSaving] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  const allowedTransitions = ALLOWED_TRANSITIONS[order.status];

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setStatusLoading(true);
    setStatusError(null);
    const { error } = await updateStatus(order.id, newStatus);
    if (error) {
      setStatusError(error);
    } else {
      setOrder((prev) => ({ ...prev, status: newStatus }));
    }
    setStatusLoading(false);
    setStatusOpen(false);
  };

  const handleSaveEdit = async () => {
    const errors: Record<string, string> = {};
    
    const allowedNameChars = /^[a-zA-Z\-' ]*$/;

    if (!editForm.first_name.trim()) {
      errors.first_name = "First name is required";
    } else if (!allowedNameChars.test(editForm.first_name)) {
      errors.first_name = "Only letters, hyphens, and single quotes allowed";
    }

    if (!editForm.last_name.trim()) {
      errors.last_name = "Last name is required";
    } else if (!allowedNameChars.test(editForm.last_name)) {
      errors.last_name = "Only letters, hyphens, and single quotes allowed";
    }

    if (!editForm.phone.trim()) errors.phone = "Required";

    if (editForm.email && !validateEmailFormat(editForm.email)) {
      errors.email = "Invalid email format";
    }

    setEditErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    const { error } = await updateOrder(order.id, editForm);
    if (error) {
      alert(`Error: ${error}`);
    } else {
      setOrder(editForm);
      setEditing(false);
      setEditErrors({});
    }
    setSaving(false);
  };

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
              Order Details
            </p>
            <h1 className="text-lg font-semibold text-gray-900">
              {order.order_number}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Print/Download Invoice */}
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowInvoice(true)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Printer size={14} />
                  Invoice
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                sideOffset={5}
                className="text-[10px] py-1 px-2 bg-red-600"
              >
                <p>Print/Save Invoice</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Status changer */}
          {allowedTransitions.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setStatusOpen(!statusOpen)}
                disabled={statusLoading}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border transition-colors disabled:opacity-50 ${STATUS_COLORS[order.status]} ${STATUS_BG_COLORS[order.status]} border-current`}
              >
                {statusLoading ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <StatusBadge status={order.status} size="sm" />
                )}
                Change Status <ChevronDown size={13} />
              </button>
              {statusOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  {allowedTransitions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className="w-full text-left px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                      <StatusBadge status={s} size="sm" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {statusError && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600">
          {statusError}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Order Items + Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <OrderItems
            order={order}
            onRefunded={(refundedItems, newStatus) =>
              setOrder((prev) => ({
                ...prev,
                refunded_items: refundedItems,
                ...(newStatus ? { status: newStatus as OrderStatus } : {}),
              }))
            }
          />
          <OrderTimeline order={order} key={order.status} />
        </div>

        {/* Right — Customer Info + Order Info */}
        <div className="space-y-6">
          {/* Customer Info Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Customer Info
              </h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Pencil size={12} /> Edit
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Check size={12} />
                    )}
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setEditForm({ ...order });
                      setEditErrors({});
                    }}
                    className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <X size={12} /> Cancel
                  </button>
                </div>
              )}
            </div>

            {editing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={50}
                      value={editForm.first_name}
                      onChange={(e) => {
                        setEditForm({
                          ...editForm,
                          first_name: formatName(e.target.value),
                        });
                        setEditErrors({ ...editErrors, first_name: "" });
                      }}
                      className={`${inputClass} ${editErrors.first_name ? "border-red-400" : ""}`}
                    />
                    {editErrors.first_name && (
                      <p className="text-xs text-red-500 mt-1">
                        {editErrors.first_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={50}
                      value={editForm.last_name}
                      onChange={(e) => {
                        setEditForm({ ...editForm, last_name: formatName(e.target.value) });
                        setEditErrors({ ...editErrors, last_name: "" });
                      }}
                      className={`${inputClass} ${editErrors.last_name ? "border-red-400" : ""}`}
                    />
                    {editErrors.last_name && (
                      <p className="text-xs text-red-500 mt-1">
                        {editErrors.last_name}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Phone <span className="text-red-500">*</span> 
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => {
                      setEditForm({ ...editForm, phone: e.target.value });
                      setEditErrors({ ...editErrors, phone: "" });
                    }}
                    className={`${inputClass} ${editErrors.phone ? "border-red-400" : ""}`}
                  />
                  {editErrors.phone && (
                    <p className="text-xs text-red-500 mt-1">
                      {editErrors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Email 
                  </label>
                  <input
                    type="email"
                    maxLength={100}
                    value={editForm.email ?? ""}
                    onChange={(e) => {
                      setEditForm({ ...editForm, email: e.target.value });
                      setEditErrors({ ...editErrors, email: "" });
                    }}
                    className={`${inputClass} ${editErrors.email ? "border-red-400" : ""}`}
                  />
                  {editErrors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {editErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Notes
                  </label>
                  <input
                    type="text"
                    maxLength={250}
                    value={editForm.message ?? ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, message: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-red-600">
                      {order.first_name[0]}
                      {order.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {order.first_name} {order.last_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.email ?? "No email"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 pt-1">
                  {[
                    { label: "Phone", value: order.phone },
                    { label: "Delivery", value: order.delivery_preference },
                    { label: "Payment", value: order.payment_preference },
                    {
                      label: "Type",
                      value:
                        order.order_type === "walk-in" ? "Walk-in" : "Online",
                    },
                    ...(order.message
                      ? [{ label: "Notes", value: order.message }]
                      : []),
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex justify-between items-start gap-2"
                    >
                      <span className="text-xs text-gray-400 shrink-0">
                        {label}
                      </span>
                      <span className="text-xs text-gray-700 text-right capitalize">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Order Summary
            </h3>
            <div className="space-y-2">
              {[
                { label: "Order Number", value: order.order_number },
                {
                  label: "Status",
                  value: <StatusBadge status={order.status} />,
                },
                {
                  label: "Date",
                  value: new Date(order.created_at).toLocaleDateString(
                    "en-PH",
                    { month: "long", day: "numeric", year: "numeric" },
                  ),
                },
                {
                  label: "Time",
                  value: new Date(order.created_at).toLocaleTimeString(
                    "en-PH",
                    { hour: "numeric", minute: "2-digit", hour12: true },
                  ),
                },
                {
                  label: "Items",
                  value: `${order.items.length} item${order.items.length !== 1 ? "s" : ""}`,
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-center gap-2"
                >
                  <span className="text-xs text-gray-400">{label}</span>
                  <span className="text-xs text-gray-700">{value}</span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-100 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Original Total</span>
                  <span className="text-xs text-gray-700">
                    ₱
                    {order.total_amount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                {(order.refunded_items ?? []).length > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Refunded</span>
                    <span className="text-xs text-red-500">
                      −₱
                      {(order.refunded_items ?? [])
                        .reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0,
                        )
                        .toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1 border-t border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {(order.refunded_items ?? []).length > 0
                      ? "Net Total"
                      : "Total"}
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    <span className="text-sm font-medium">₱</span>
                    {(
                      order.total_amount -
                      (order.refunded_items ?? []).reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0,
                      )
                    ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoice && (
        <InvoiceDownload order={order} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
};

export default OrderDetailView;