import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MovementRow } from "../types";

interface RawStockMovement {
  id: string;
  movement_type: "inbound" | "adjustment" | "consumed" | "returned";
  quantity_change: number;
  quantity_before: number;
  quantity_after: number;
  reference_type: string | null;
  performed_by: string | null;
  created_at: string;
  product_variants: {
    sku: string;
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
        .from("StockMovement")
        .select(`
          id, movement_type, quantity_change,
          quantity_before, quantity_after,
          reference_type, performed_by, created_at,
          product_variants (
            sku,
            products ( name )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!data) return;

      const flattened: MovementRow[] = (data as unknown as RawStockMovement[]).map((m) => ({
        id:              m.id,
        sku:             m.product_variants?.sku ?? "—",
        product_name:    m.product_variants?.products?.name ?? "—",
        movement_type:   m.movement_type,
        quantity_change: m.quantity_change,
        quantity_before: m.quantity_before,
        quantity_after:  m.quantity_after,
        reference_type:  m.reference_type,
        performed_by:    m.performed_by,
        created_at:      m.created_at,
      }));

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