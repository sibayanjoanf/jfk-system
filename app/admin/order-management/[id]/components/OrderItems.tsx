"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Order, OrderItem } from "../../types";
import { ChevronDown, ChevronUp, RotateCcw, Loader2 } from "lucide-react";
import { useOrderMutations } from "../../hooks/useOrderMutations";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface Props {
  order: Order;
  canRefund?: boolean;
  onRefunded?: (refundedItems: OrderItem[], newStatus?: string) => void;
}

const OrderItems: React.FC<Props> = ({
  order,
  canRefund: canRefundProp,
  onRefunded,
}) => {
  const { currentUser } = useCurrentUser();
  const permissions = currentUser?.permissions;
  const { refundItems, updateStatus } = useOrderMutations();
  const [isExpanded, setIsExpanded] = useState(false);
  const [refundMode, setRefundMode] = useState(false);
  const [selectedRefunds, setSelectedRefunds] = useState<
    Record<string, number>
  >({});
  const [refunding, setRefunding] = useState(false);
  const [refundError, setRefundError] = useState<string | null>(null);

  const visibleItems = isExpanded ? order.items : order.items.slice(0, 3);
  const hasMore = order.items.length > 3;

  const alreadyRefunded = order.refunded_items ?? [];
  const refundedMap = Object.fromEntries(
    alreadyRefunded.map((i) => [i.sku, i.quantity]),
  );

  const canRefund = order.status === "Completed" && canRefundProp === true;

  const getRefundableQty = (item: OrderItem) => {
    const alreadyQty = refundedMap[item.sku] ?? 0;
    return item.quantity - alreadyQty;
  };

  const handleToggleItem = (item: OrderItem) => {
    setSelectedRefunds((prev) => {
      if (prev[item.sku] !== undefined) {
        const updated = { ...prev };
        delete updated[item.sku];
        return updated;
      }
      return { ...prev, [item.sku]: 1 };
    });
  };

  const handleQtyChange = (sku: string, qty: number, max: number) => {
    setSelectedRefunds((prev) => ({
      ...prev,
      [sku]: Math.min(Math.max(1, qty), max),
    }));
  };

  const handleConfirmRefund = async () => {
    if (Object.keys(selectedRefunds).length === 0) return;

    setRefunding(true);
    setRefundError(null);

    const newRefundedItems: OrderItem[] = Object.entries(selectedRefunds).map(
      ([sku, quantity]) => {
        const item = order.items.find((i) => i.sku === sku)!;
        return { ...item, quantity };
      },
    );

    // Merge with existing refunded items
    const merged = [...alreadyRefunded];
    for (const newItem of newRefundedItems) {
      const existing = merged.find((i) => i.sku === newItem.sku);
      if (existing) {
        existing.quantity += newItem.quantity;
      } else {
        merged.push(newItem);
      }
    }

    const { error } = await refundItems(order.id, merged);
    if (error) {
      setRefundError(error);
      setRefunding(false);
      return;
    }

    const allRefunded = order.items.every((item) => {
      const totalRefunded = merged
        .filter((r) => r.sku === item.sku)
        .reduce((sum, r) => sum + r.quantity, 0);
      return totalRefunded >= item.quantity;
    });

    if (allRefunded) {
      await updateStatus(order.id, "Refunded");
      onRefunded?.(merged, "Refunded");
    } else {
      onRefunded?.(merged);
    }

    setSelectedRefunds({});
    setRefundMode(false);
    setRefunding(false);
  };

  const refundTotal = Object.entries(selectedRefunds).reduce(
    (sum, [sku, qty]) => {
      const item = order.items.find((i) => i.sku === sku);
      return sum + (item ? item.price * qty : 0);
    },
    0,
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Order Items</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canRefund && !refundMode && (
            <button
              onClick={() => setRefundMode(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              <RotateCcw size={12} />
              Refund Items
            </button>
          )}
          {refundMode && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setRefundMode(false);
                  setSelectedRefunds({});
                  setRefundError(null);
                }}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
          {hasMore && !refundMode && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              {isExpanded ? (
                <>
                  <span>Show Less</span> <ChevronUp size={14} />
                </>
              ) : (
                <>
                  <span>Show All</span> <ChevronDown size={14} />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Refund mode banner */}
      {refundMode && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-100">
          <p className="text-xs text-red-600 font-medium">
            Select items and quantities to refund. This cannot be undone.
          </p>
        </div>
      )}

      <div className="divide-y divide-gray-50">
        {(refundMode ? order.items : visibleItems).map((item) => {
          const refundableQty = getRefundableQty(item);
          const alreadyQty = refundedMap[item.sku] ?? 0;
          const isSelected = selectedRefunds[item.sku] !== undefined;
          const isFullyRefunded = refundableQty <= 0;

          return (
            <div
              key={item.sku}
              className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                refundMode && isSelected ? "bg-red-50/50" : ""
              } ${refundMode && isFullyRefunded ? "opacity-40" : ""}`}
            >
              {refundMode && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  disabled={isFullyRefunded}
                  onChange={() => handleToggleItem(item)}
                  className="w-3.5 h-3.5 rounded border-gray-300 accent-red-600 cursor-pointer shrink-0"
                />
              )}
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
                  <div className="w-full h-full bg-gray-200" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  {item.sku}
                </p>
                {alreadyQty > 0 && (
                  <p className="text-[10px] text-red-500 mt-0.5">
                    {alreadyQty} already refunded
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                {refundMode && isSelected ? (
                  <div className="flex items-center border rounded-md h-7">
                    <button
                      onClick={() =>
                        handleQtyChange(
                          item.sku,
                          (selectedRefunds[item.sku] ?? 1) - 1,
                          refundableQty,
                        )
                      }
                      disabled={(selectedRefunds[item.sku] ?? 1) <= 1}
                      className="px-2 border-r hover:bg-gray-100 disabled:opacity-30 transition-colors h-full text-xs"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-xs font-semibold">
                      {selectedRefunds[item.sku]}
                    </span>
                    <button
                      onClick={() =>
                        handleQtyChange(
                          item.sku,
                          (selectedRefunds[item.sku] ?? 1) + 1,
                          refundableQty,
                        )
                      }
                      disabled={
                        (selectedRefunds[item.sku] ?? 1) >= refundableQty
                      }
                      className="px-2 border-l hover:bg-gray-100 disabled:opacity-30 transition-colors h-full text-xs"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-gray-800">
                      <span className="font-medium">₱</span>
                      {(item.price * item.quantity).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      ₱{item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {!isExpanded && hasMore && !refundMode && (
          <div className="px-6 py-2 bg-gray-50/50 text-center">
            <p className="text-[10px] text-gray-400">
              + {order.items.length - 3} more items hidden
            </p>
          </div>
        )}
      </div>

      {/* Refund confirmation footer */}
      {refundMode && (
        <div className="px-6 py-4 bg-red-50 border-t border-red-100 flex items-center justify-between gap-4">
          <div>
            {Object.keys(selectedRefunds).length > 0 ? (
              <p className="text-xs text-red-600 font-medium">
                Refunding ₱
                {refundTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}{" "}
                across {Object.keys(selectedRefunds).length} item
                {Object.keys(selectedRefunds).length !== 1 ? "s" : ""}
              </p>
            ) : (
              <p className="text-xs text-gray-400">No items selected</p>
            )}
            {refundError && (
              <p className="text-xs text-red-500 mt-1">{refundError}</p>
            )}
          </div>
          <button
            onClick={handleConfirmRefund}
            disabled={Object.keys(selectedRefunds).length === 0 || refunding}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {refunding ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <RotateCcw size={12} />
            )}
            Confirm Refund
          </button>
        </div>
      )}

      {/* Already refunded summary */}
      {alreadyRefunded.length > 0 && !refundMode && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">
            Refunded Items
          </p>
          {alreadyRefunded.map((item) => (
            <div
              key={item.sku}
              className="flex justify-between text-xs text-gray-500 py-0.5"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span className="text-red-500">
                −₱
                {(item.price * item.quantity).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Total Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {(order.refunded_items ?? []).length > 0
            ? "Total (after refunds)"
            : "Total"}
        </span>
        <span className="text-lg font-semibold text-gray-900">
          <span className="text-md font-medium">₱</span>
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
  );
};

export default OrderItems;
