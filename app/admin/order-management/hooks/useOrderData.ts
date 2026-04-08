"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { OrderRow } from "../types";

export function useOrderData() {
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("inquiries")
        .select("id, order_number, status, order_type, first_name, last_name, email, phone, items, total_amount, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!data) return;

      const flattened: OrderRow[] = data.map((o) => ({
        id:            o.id,
        order_number:  o.order_number,
        status:        o.status,
        order_type:    o.order_type,
        customer_name: `${o.first_name} ${o.last_name}`,
        email:         o.email,
        phone:         o.phone,
        item_count:    Array.isArray(o.items) ? o.items.length : 0,
        total_amount:  o.total_amount,
        created_at:    o.created_at,
      }));

      setRows(flattened);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { rows, loading, fetchOrders };
}