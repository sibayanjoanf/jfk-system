import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MovementRow } from "../types";

interface RawStockAdjustment {
  id: string;
  adjustment_code: string;
  adjustment_type: "add" | "deduct" | "set";
  quantity: number;
  quantity_before: number | null;
  quantity_after: number | null;
  adjusted_by: string | null;
  notes: string | null;
  created_at: string;
  product_variants: {
    sku: string;
    stock_qty: number;
    products: { name: string } | null;
  } | null;
}

export function useMovementData() {
  const [rows, setRows] = useState<MovementRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMovementData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("StockAdjustment")
        .select(`
          id, adjustment_code, adjustment_type,
          quantity, quantity_before, quantity_after,
          adjusted_by, notes, created_at,
          product_variants (
            sku, stock_qty,
            products ( name )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!data) return;

      const flattened: MovementRow[] = (data as unknown as RawStockAdjustment[]).map((m) => {
        const qty = m.quantity;
        const notes = m.notes ?? "";

        let movement_type: MovementRow["movement_type"];
        if (notes.startsWith("Inbound Received")) {
          movement_type = "inbound";
        } else if (m.adjustment_type === "deduct" && notes.startsWith("Order completed")) {
          movement_type = "consumed";
        } else if (m.adjustment_type === "add" && notes.startsWith("Order refunded")) {
          movement_type = "returned";
        } else {
          movement_type = "adjustment";
        }

        let quantity_change: number;
        if (m.adjustment_type === "set") {
          quantity_change = m.quantity_after ?? qty; 
        } else if (m.adjustment_type === "deduct") {
          quantity_change = -qty;
        } else {
          quantity_change = qty;
        }

        return {
          id:              m.id,
          sku:             m.product_variants?.sku ?? "—",
          product_name:    m.product_variants?.products?.name ?? "—",
          movement_type,
          quantity_change,
          quantity_before: m.quantity_before ?? 0,
          quantity_after:  m.quantity_after ?? 0,
          reference_type:  m.notes ?? null,
          performed_by:    m.adjusted_by,
          created_at:      m.created_at,
        };
      });

      setRows(flattened);
    } catch (err) {
      console.error("Error fetching movement data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovementData();
  }, []);

  return { rows, loading, fetchMovementData };
}