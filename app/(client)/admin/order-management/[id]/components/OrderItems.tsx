"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Order } from "../../types";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  order: Order;
}

const OrderItems: React.FC<Props> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleItems = isExpanded ? order.items : order.items.slice(0, 3);
  const hasMore = order.items.length > 3;

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

        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp size={14} />
              </>
            ) : (
              <>
                Show All <ChevronDown size={14} />
              </>
            )}
          </button>
        )}
      </div>

      <div className="divide-y divide-gray-50">
        {visibleItems.map((item) => (
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

        {!isExpanded && hasMore && (
          <div className="px-6 py-2 bg-gray-50/50 text-center">
            <p className="text-[10px] text-gray-400">
              + {order.items.length - 3} more items hidden
            </p>
          </div>
        )}
      </div>

      {/* Total Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Total
        </span>
        <span className="text-lg font-semibold text-gray-900">
          <span className="text-md font-medium">₱</span>
          {order.total_amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </span>
      </div>
    </div>
  );
};

export default OrderItems;
