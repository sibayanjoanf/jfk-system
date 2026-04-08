import React from "react";
import {
  OrderStatus,
  STATUS_COLORS,
  STATUS_DOT_COLORS,
  STATUS_BG_COLORS,
} from "../types";

interface StatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "md" }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      } ${STATUS_COLORS[status]} ${STATUS_BG_COLORS[status]}`}
    >
      <div
        className={`rounded-full shrink-0 ${
          size === "sm" ? "w-1 h-1" : "w-1.5 h-1.5"
        } ${STATUS_DOT_COLORS[status]}`}
      />
      {status}
    </span>
  );
};

export default StatusBadge;
