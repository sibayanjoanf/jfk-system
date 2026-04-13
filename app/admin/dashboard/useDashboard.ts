"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface OrderItem {
  sku?: string;
  name: string;
  price?: number;
  quantity?: number;
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export interface DashboardData {
  totalOrders: number;
  pendingOrders: number;
  lowStockCount: number;
  totalRevenue: number;
  revenueByMonth: { name: string; website: number; }[];
  orderStatusCounts: { name: string; value: number; color: string }[];
  topProducts: {
    name: string;
    type: string;
    orders: number;
    price: number;
    category: string;
    refunds: string;
  }[];
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "#F59E0B",
  Processing: "#3B82F6",
  Paid: "#8B5CF6",
  Completed: "#22C55E",
  Cancelled: "#EF4444",
  Refunded: "#EC4899",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      // all orders
      const { data: orders } = await supabase
        .from("inquiries")
        .select("id, status, total_amount, created_at, items, order_type, refunded_items");

      // low stock
      const { count: lowStockCount } = await supabase
        .from("product_variants")
        .select("id", { count: "exact", head: true })
        .lte("stock_qty", 5)
        .gt("stock_qty", 0);

      if (!orders) {
        setLoading(false);
        return;
      }

      // Metrics
      const totalOrders = orders.length;
      const pendingOrders = orders.filter((o) => o.status === "Pending").length;
      const completedOrders = orders.filter((o) => o.status === "Completed");
      const totalRevenue = completedOrders.reduce((sum, o) => {
        const refundedAmount = (o.refunded_items ?? [])
          .reduce((r: number, item: OrderItem) => r + (item.price || 0) * (item.quantity || 0), 0);
        return sum + Number(o.total_amount) - refundedAmount;
      }, 0);

      // Revenue by mont
      const currentYear = new Date().getFullYear();
      const revenueByMonth = MONTHS.map((name, i) => {
        const monthOrders = completedOrders.filter((o) => {
          const d = new Date(o.created_at);
          return d.getFullYear() === currentYear && d.getMonth() === i;
        });
        const revenue = monthOrders.reduce((sum, o) => {
          const refundedAmount = (o.refunded_items ?? [])
            .reduce((r: number, item: OrderItem) => r + (item.price || 0) * (item.quantity || 0), 0);
          return sum + Number(o.total_amount) - refundedAmount;
        }, 0);
        return { name, website: revenue };
      });

      // Order status count
      const statusList = ["Pending", "Processing", "Paid", "Completed", "Cancelled", "Refunded"];
      const orderStatusCounts = statusList
        .map((status) => ({
          name: status,
          value: totalOrders
            ? Math.round((orders.filter((o) => o.status === status).length / totalOrders) * 100)
            : 0,
          color: STATUS_COLORS[status],
        }))
        .filter((s) => s.value > 0);

      // Top selling produ
      const productMap = new Map<string, { name: string; sku: string; quantity: number; price: number; refunds: number }>();
      orders
        .filter((o) => o.status === "Completed" || o.status === "Refunded")
        .forEach((order) => {
            if (!order.items || !Array.isArray(order.items)) return;
            order.items.forEach((item: OrderItem) => {
            const key = item.sku || item.name;
            const existing = productMap.get(key) || {
              name: item.name,
              sku: item.sku || "-",
              quantity: 0,
              price: item.price || 0,
              refunds: 0,
            };
            productMap.set(key, {
              ...existing,
              quantity: existing.quantity + (item.quantity || 0),
              refunds: existing.refunds + (order.status === "Refunded" ? 1 : 0),
            });
          });
        });

      const topProducts = Array.from(productMap.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 6)
        .map((p) => ({
          name: p.name,
          type: p.sku,
          orders: p.quantity,
          price: p.price,
          category: "-",
          refunds: p.refunds > 0 ? `> ${p.refunds}` : "< 1",
        }));

      setData({
        totalOrders,
        pendingOrders,
        lowStockCount: lowStockCount ?? 0,
        totalRevenue,
        revenueByMonth,
        orderStatusCounts,
        topProducts,
      });

      setLoading(false);
    };

    fetchAll();
  }, []);

  return { data, loading };
}