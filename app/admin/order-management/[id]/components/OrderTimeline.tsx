"use client";

import React, { useEffect, useState } from "react";
import { Order, OrderStatus } from "../../types";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Props {
  order: Order;
}

interface StatusHistoryEntry {
  status: string;
  changed_at: string;
  changed_by: string;
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

const OrderTimeline: React.FC<Props> = ({ order }) => {
  const [history, setHistory] = useState<StatusHistoryEntry[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data } = await supabase
        .from("order_status_history")
        .select("status, changed_at, changed_by")
        .eq("order_id", order.id)
        .order("changed_at", { ascending: true });
      if (data) setHistory(data);
    };
    fetchHistory();
  }, [order.id]);

  const getHistoryForStatus = (status: string) => {
    if (status === "Pending") {
      return {
        status: "Pending",
        changed_at: order.created_at,
        changed_by: "system",
      };
    }
    return history.find((h) => h.status === status);
  };

  const currentIndex = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === "Cancelled";
  const isRefunded = order.status === "Refunded";
  const cancelledEntry = getHistoryForStatus("Cancelled");
  const refundedEntry = getHistoryForStatus("Refunded");

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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-6">
        Order Timeline
      </h3>

      <div className="relative">
        {/* Vertical line */}
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
                      className={isCurrent ? "text-red-600" : "text-green-500"}
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

                {/* Label + description on left, date/time on right */}
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
                        <Clock size={11} className="text-red-500" />
                        <span className="text-xs text-red-500 font-medium">
                          Current status
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Date + time on the right */}
                  {dt ? (
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-xs text-gray-600">{dt.date}</p>
                      <p className="text-xs text-gray-400">{dt.time}</p>
                    </div>
                  ) : (
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-xs text-gray-200">—</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Cancelled or Refunded step */}
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
                      : "This order was refunded and stock has been restored."}
                  </p>
                </div>

                {(cancelledEntry || refundedEntry) &&
                  (() => {
                    const dt = formatDateTime(
                      (cancelledEntry || refundedEntry)!.changed_at,
                    );
                    return (
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-xs text-gray-500">{dt.date}</p>
                        <p className="text-xs text-gray-300">{dt.time}</p>
                      </div>
                    );
                  })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTimeline;
