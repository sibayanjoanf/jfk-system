import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { InboundRow } from "../types";

interface RawInboundBatch {
  id: string;
  batch_code: string;
  quantity: number;
  supplier: string | null;
  received_by: string | null;
  created_at: string;
  product_variants: {
    sku: string;
    products: { name: string } | null;
  } | null;
}

export function useInboundData() {
  const [rows, setRows] = useState<InboundRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInboundData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("InboundBatch")
        .select(`
          id, batch_code, quantity, supplier, received_by, created_at,
          product_variants (
            sku,
            products ( name )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!data) return;

      const flattened: InboundRow[] = (data as unknown as RawInboundBatch[]).map((b) => ({
        id:           b.id,
        batch_code:   b.batch_code,
        sku:          b.product_variants?.sku ?? "—",
        product_name: b.product_variants?.products?.name ?? "—",
        quantity:     b.quantity,
        supplier:     b.supplier,
        received_by:  b.received_by,
        created_at:   b.created_at,
      }));

      setRows(flattened);
    } catch (err) {
      console.error("Error fetching inbound data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInboundData();
  }, []);

  return { rows, loading, fetchInboundData };
}