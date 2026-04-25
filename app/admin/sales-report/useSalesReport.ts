"use client";

import { useState, useEffect, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export type TimeFilter = "Daily" | "Weekly" | "Monthly" | "Yearly";

export interface StatPoint {
  name: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  name: string;
  sku: string;
  quantity: number;
  revenue: number;
  refunds: number;
}

export interface OrderStatusCount {
  status: string;
  count: number;
}

export interface SalesReportData {
  totalRevenue: number;
  totalOrders: number;
  cancelledRate: number;
  refundedRate: number;
  completedOrders: number;
  statPoints: StatPoint[];
  topProducts: TopProduct[];
  orderStatusCounts: OrderStatusCount[];
}

interface OrderItem {
  sku?: string;
  name: string;
  price?: number;
  quantity?: number;
}

interface Order {
  id: string;
  status: string;
  total_amount: number | string;
  created_at: string;
  items?: OrderItem[];
  refunded_items?: OrderItem[];
  order_type?: string;
  order_number?: string;
}

function getDateRange(filter: TimeFilter): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now);
  const start = new Date(now);

  if (filter === "Daily") {
    start.setDate(now.getDate() - 30);
  } else if (filter === "Weekly") {
    start.setDate(now.getDate() - 7 * 12);
  } else if (filter === "Monthly") {
    start.setMonth(now.getMonth() - 11);
    start.setDate(1);
  } else {
    start.setFullYear(now.getFullYear() - 4);
    start.setMonth(0);
    start.setDate(1);
  }

  return { start, end };
}

function groupByPeriod(orders: Order[], filter: TimeFilter): StatPoint[] {
  const map = new Map<string, { revenue: number; orders: number }>();

  orders.forEach((order) => {
    const date = new Date(order.created_at);
    let key = "";

    if (filter === "Daily") {
      key = date.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
    } else if (filter === "Weekly") {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
    } else if (filter === "Monthly") {
      key = date.toLocaleDateString("en-PH", { month: "short", year: "2-digit" });
    } else {
      key = date.getFullYear().toString();
    }

    const existing = map.get(key) || { revenue: 0, orders: 0 };
    const refundedAmount = (order.refunded_items ?? [])
      .reduce((r, item) => r + (item.price || 0) * (item.quantity || 0), 0);
    map.set(key, {
      revenue: existing.revenue + (order.status === "Completed" ? Number(order.total_amount) - refundedAmount : 0),
      orders: existing.orders + 1,
    });
  });

  return Array.from(map.entries()).map(([name, val]) => ({
    name,
    revenue: val.revenue,
    orders: val.orders,
  }));
}

function deriveReportData(allOrders: Order[], timeFilter: TimeFilter): SalesReportData {
  const { start } = getDateRange(timeFilter);
  const filtered = allOrders.filter((o) => new Date(o.created_at) >= start);

  const completed = allOrders.filter((o) => o.status === "Completed");
  const totalRevenue = completed.reduce((sum, o) => {
    const refundedAmount = (o.refunded_items ?? [])
      .reduce((r, item) => r + (item.price || 0) * (item.quantity || 0), 0);
    return sum + Number(o.total_amount) - refundedAmount;
  }, 0);
  const totalOrders = allOrders.length;
  const cancelledCount = allOrders.filter((o) => o.status === "Cancelled").length;
  const refundedCount = allOrders.filter((o) => o.status === "Refunded").length;

  const statusCounts = ["Pending", "Processing", "Paid", "Completed", "Cancelled", "Refunded"].map(
    (status) => ({
      status,
      count: allOrders.filter((o) => o.status === status).length,
    }),
  );

  // Exact same logic as useDashboard
  const productMap = new Map<string, TopProduct>();
  allOrders
    .filter((o) => o.status === "Completed" || o.status === "Refunded")
    .forEach((order) => {
      if (!order.items || !Array.isArray(order.items)) return;
      
      const refundedQtyMap = new Map<string, number>();
      (order.refunded_items ?? []).forEach((item) => {
        const key = item.sku || item.name;
        refundedQtyMap.set(key, (refundedQtyMap.get(key) ?? 0) + (item.quantity || 0));
      });

      order.items.forEach((item) => {
        const key = item.sku || item.name;
        const existing = productMap.get(key) || {
          name: item.name,
          sku: item.sku || "-",
          quantity: 0,
          revenue: 0,
          refunds: 0,
        };

        const refundedQty = refundedQtyMap.get(key) ?? 0;

        productMap.set(key, {
          ...existing,
          quantity: existing.quantity + (item.quantity || 0),
          revenue:
            existing.revenue +
            (order.status === "Completed"
              ? (item.price || 0) * ((item.quantity || 0) - refundedQty)
              : 0),
          refunds: existing.refunds + refundedQty,
        });
      });
    });

  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  return {
    totalRevenue,
    totalOrders,
    completedOrders: completed.length,
    cancelledRate: totalOrders ? (cancelledCount / totalOrders) * 100 : 0,
    refundedRate: totalOrders ? (refundedCount / totalOrders) * 100 : 0,
    statPoints: groupByPeriod(filtered, timeFilter),
    topProducts,
    orderStatusCounts: statusCounts,
  };
}

export function useSalesReport(timeFilter: TimeFilter) {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const { data: orders } = await supabase
        .from("inquiries")
        .select("id, status, total_amount, created_at, items, order_type, order_number, refunded_items")
        .order("created_at", { ascending: true });

      if (orders) setAllOrders(orders as Order[]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const data = useMemo<SalesReportData | null>(() => {
    if (!allOrders.length) return null;
    return deriveReportData(allOrders, timeFilter);
  }, [allOrders, timeFilter]);

  return { data, loading, allOrders };
}