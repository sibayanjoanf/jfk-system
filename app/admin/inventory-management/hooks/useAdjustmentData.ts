import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { AdjustmentRow } from "../types";

interface RawStockAdjustment {
  id: string;
  adjustment_code: string;
  adjustment_type: "add" | "deduct" | "set";
  quantity: number;
  adjusted_by: string | null;
  notes: string | null;
  created_at: string;
  product_variants: {
    sku: string;
    products: { name: string } | null;
  } | null;
}

export function useAdjustmentData() {
  const [rows, setRows] = useState<AdjustmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdjustmentData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("StockAdjustment")
        .select(`
          id, adjustment_code, adjustment_type,
          quantity, adjusted_by, notes, created_at,
          product_variants (
            sku,
            products ( name )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!data) return;

      const flattened: AdjustmentRow[] = (data as unknown as RawStockAdjustment[]).map((a) => ({
        id:              a.id,
        adjustment_code: a.adjustment_code,
        sku:             a.product_variants?.sku ?? "—",
        product_name:    a.product_variants?.products?.name ?? "—",
        adjustment_type: a.adjustment_type,
        quantity:        a.quantity,
        adjusted_by:     a.adjusted_by,
        notes:           a.notes,
        created_at:      a.created_at,
      }));

      setRows(flattened);
    } catch (err) {
      console.error("Error fetching adjustment data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdjustmentData();
  }, []);

  return { rows, loading, fetchAdjustmentData };
}