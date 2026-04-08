"use client";

import React, { useEffect, useState } from "react";
import { Order, OrderStatus } from "@/app/admin/order-management/types";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Circle, Clock, Package, Printer } from "lucide-react";
import Image from "next/image";
import InvoiceDownload from "@/app/admin/order-management/[id]/components/InvoiceDownload";

interface Props {
  order: Order;
}

interface StatusHistoryEntry {
  status: string;
  changed_at: string;
}

const TIMELINE_STEPS: {
  status: OrderStatus;
  label: string;
  description: string;
}[] = [
  {
    status: "Pending",
    label: "Pending",
    description: "Order received and awaiting confirmation",
  },
  {
    status: "Processing",
    label: "Processing",
    description: "Order confirmed and being prepared",
  },
  { status: "Paid", label: "Paid", description: "Payment received" },
  {
    status: "Completed",
    label: "Completed",
    description: "Order fulfilled and completed",
  },
];

const STATUS_ORDER: OrderStatus[] = [
  "Pending",
  "Processing",
  "Paid",
  "Completed",
];

const STATUS_STYLES: Record<string, { badge: string; dot: string }> = {
  Pending: { badge: "text-orange-500 bg-orange-50", dot: "bg-orange-500" },
  Processing: { badge: "text-blue-500 bg-blue-50", dot: "bg-blue-500" },
  Paid: { badge: "text-purple-600 bg-purple-50", dot: "bg-purple-600" },
  Completed: { badge: "text-green-600 bg-green-50", dot: "bg-green-600" },
  Cancelled: { badge: "text-gray-500 bg-gray-100", dot: "bg-gray-500" },
  Refunded: { badge: "text-red-600 bg-red-50", dot: "bg-red-600" },
};

const TrackOrderView: React.FC<Props> = ({ order }) => {
  const [history, setHistory] = useState<StatusHistoryEntry[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const statusStyle = STATUS_STYLES[order.status] || STATUS_STYLES.Pending;

  useEffect(() => {
    const fetchHistory = async () => {
      const { data } = await supabase
        .from("order_status_history")
        .select("status, changed_at")
        .eq("order_id", order.id)
        .order("changed_at", { ascending: true });
      if (data) setHistory(data);
    };
    fetchHistory();
  }, [order.id]);

  const getHistoryForStatus = (status: string) =>
    history.find((h) => h.status === status);

  const currentIndex = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === "Cancelled";
  const isRefunded = order.status === "Refunded";

  const formatDateTime = (dateStr: string) => ({
    date: new Date(dateStr).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: new Date(dateStr).toLocaleTimeString("en-PH", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  });

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
            Order Tracking
          </p>
          <h2 className="text-2xl font-bold text-gray-900">
            {order.order_number}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString("en-PH", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3 self-start flex-col">
          <button
            onClick={() => setShowInvoice(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
          >
            <Printer size={13} />
            Invoice
          </button>
        </div>
        {showInvoice && (
          <InvoiceDownload
            order={order}
            onClose={() => setShowInvoice(false)}
          />
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Order Info
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "Name",
                  value: `${order.first_name} ${order.last_name}`,
                },
                { label: "Phone", value: order.phone },
                ...(order.email
                  ? [{ label: "Email", value: order.email }]
                  : []),
                { label: "Delivery", value: order.delivery_preference },
                { label: "Payment", value: order.payment_preference },
                ...(order.message
                  ? [{ label: "Notes", value: order.message }]
                  : []),
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-gray-800">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-6">
              Order Timeline
            </h3>
            <div className="relative">
              <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-100" />
              <div className="space-y-6">
                {TIMELINE_STEPS.map((step, idx) => {
                  const isDone = currentIndex >= idx;
                  const isCurrent =
                    currentIndex === idx && !isCancelled && !isRefunded;
                  const entry = getHistoryForStatus(step.status);
                  const dt = entry ? formatDateTime(entry.changed_at) : null;

                  return (
                    <div
                      key={step.status}
                      className="flex items-start gap-4 relative"
                    >
                      <div className="shrink-0 z-10">
                        {isDone ? (
                          <CheckCircle2
                            size={30}
                            className={
                              order.status === "Completed"
                                ? "text-green-500"
                                : isCurrent
                                  ? "text-red-600"
                                  : "text-green-500"
                            }
                            strokeWidth={1.5}
                          />
                        ) : (
                          <Circle
                            size={30}
                            className="text-gray-200"
                            strokeWidth={1.5}
                          />
                        )}
                      </div>
                      <div className="flex-1 flex items-start justify-between pt-1">
                        <div>
                          <p
                            className={`text-sm font-medium ${isDone ? "text-gray-900" : "text-gray-300"}`}
                          >
                            {step.label}
                          </p>
                          <p
                            className={`text-xs mt-0.5 ${isDone ? "text-gray-400" : "text-gray-200"}`}
                          >
                            {step.description}
                          </p>
                          {isCurrent && (
                            <div className="flex items-center gap-1 mt-1">
                              <Clock size={11} className="text-red-600" />
                              <span className="text-xs text-red-600 font-medium">
                                Current status
                              </span>
                            </div>
                          )}
                        </div>
                        {dt ? (
                          <div className="text-right shrink-0 ml-4">
                            <p className="text-xs text-gray-500">{dt.date}</p>
                            <p className="text-xs text-gray-300">{dt.time}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-200 ml-4">—</p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {(isCancelled || isRefunded) && (
                  <div className="flex items-start gap-4 relative">
                    <div className="shrink-0 z-10">
                      <div
                        className={`w-[30px] h-[30px] rounded-full border-2 flex items-center justify-center ${isCancelled ? "border-gray-300 bg-gray-50" : "border-red-300 bg-red-50"}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${isCancelled ? "bg-gray-400" : "bg-red-500"}`}
                        />
                      </div>
                    </div>
                    <div className="flex-1 flex items-start justify-between pt-1">
                      <div>
                        <p
                          className={`text-sm font-medium ${isCancelled ? "text-gray-500" : "text-red-600"}`}
                        >
                          Order {order.status}
                        </p>
                        <p
                          className={`text-xs mt-0.5 ${isCancelled ? "text-gray-400" : "text-red-400"}`}
                        >
                          {isCancelled
                            ? "This order was cancelled."
                            : "This order was refunded."}
                        </p>
                      </div>
                      {getHistoryForStatus(order.status) && (
                        <div className="text-right shrink-0 ml-4">
                          <p className="text-xs text-gray-500">
                            {
                              formatDateTime(
                                getHistoryForStatus(order.status)!.changed_at,
                              ).date
                            }
                          </p>
                          <p className="text-xs text-gray-300">
                            {
                              formatDateTime(
                                getHistoryForStatus(order.status)!.changed_at,
                              ).time
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Order Items
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </p>
            </div>
            {order.items.length > 3 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-xs font-medium text-red-600 hover:underline transition-colors"
              >
                {showAll ? "Show Less" : `Show All`}
              </button>
            )}
          </div>
          <div className="divide-y divide-gray-50">
            {(showAll ? order.items : order.items.slice(0, 3)).map((item) => (
              <div key={item.sku} className="flex items-center gap-4 px-6 py-4">
                <div className="relative w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={18} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    {item.sku}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-gray-800">
                    <span className="font-medium">₱</span>
                    {(item.price * item.quantity).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    ₱{item.price.toLocaleString()} × {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {order.items.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full px-6 py-3 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200/70 transition-colors border-t border-gray-50 text-center"
            >
              {showAll ? "Show less" : `Show all ${order.items.length} items`}
            </button>
          )}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Total
            </span>
            <span className="text-lg font-semibold text-gray-900">
              <span className="font-medium text-md">₱</span>
              {order.total_amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderView;
