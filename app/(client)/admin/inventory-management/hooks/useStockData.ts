import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { StockRow } from "../types";

interface RawStockVariant {
  id: string;
  sku: string;
  stock_qty: number;
  reserved_qty: number;
  available_qty: number;
  image_url: string;
  products: {
    name: string;
    sub_categories: {
      name: string;
      categories: { name: string } | null;
    } | null;
  } | null;
  StockMovement: {
    movement_type: "inbound" | "adjustment" | "consumed" | "returned";
    created_at: string;
  }[];
}

export function useStockData() {
  const [rows, setRows] = useState<StockRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStockData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("product_variants_available")
        .select(`
          id, sku, stock_qty, reserved_qty, available_qty, image_url,
          products (
            name,
            sub_categories (
              name,
              categories ( name )
            )
          ),
          StockMovement (
            movement_type,
            created_at
          )
        `)
        .order("created_at", {
          foreignTable: "StockMovement",
          ascending: false,
        })
        .limit(1, { foreignTable: "StockMovement" });

      if (error) throw error;
      if (!data) return;

      const flattened: StockRow[] = (data as unknown as RawStockVariant[]).map((v) => {
        let status: StockRow["status"] = "In Stock";
        if (v.available_qty <= 0)       status = "Out of Stock";
        else if (v.available_qty <= 10) status = "Low Stock";

        const lastMovement = v.StockMovement?.[0] ?? null;

        return {
          id:                 v.id,
          sku:                v.sku,
          product_name:       v.products?.name ?? "—",
          category:           v.products?.sub_categories?.categories?.name ?? "—",
          sub_category:       v.products?.sub_categories?.name ?? "—",
          stock_qty:          v.stock_qty,
          reserved_qty:       v.reserved_qty,
          available_qty:      v.available_qty,
          status,
          last_movement_type: lastMovement?.movement_type ?? null,
          last_movement_at:   lastMovement?.created_at ?? null,
          image_url:          v.image_url || "/placeholder.png",
        };
      });

      setRows(flattened);
    } catch (err) {
      console.error("Error fetching stock data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  return { rows, loading, fetchStockData };
}