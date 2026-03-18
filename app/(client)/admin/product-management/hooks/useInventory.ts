import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { DbProduct, ProductRow } from "../types";
import { PostgrestError } from "@supabase/supabase-js";

export function useInventory() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const { data, error } = (await supabase.from("products").select(`
        id, name, description,
        sub_categories ( id, name, categories (name) ),
        product_variants (*)
      `)) as { data: DbProduct[] | null; error: PostgrestError | null };

      if (error) throw error;
      if (!data) return;

      const flattened: ProductRow[] = data.flatMap((p) =>
        (p.product_variants || []).map((v) => {
          let status: ProductRow["status"] = "In Stock";
          if (v.stock_qty <= 0) status = "Out of Stock";
          else if (v.stock_qty <= 10) status = "Low Stock";
          return {
            id: v.id,
            product_id: p.id,
            name: p.name,
            description: p.description ?? null,
            type: v.attribute_value || "Standard",
            sku: v.sku,
            status,
            price: v.price,
            category: p.sub_categories?.categories?.name || "General",
            sub_category: p.sub_categories?.name || "General",
            sub_category_id: p.sub_categories?.id || "",
            stock: v.stock_qty,
            image_url: v.image_url || "/placeholder.png",
            attribute_name: v.attribute_name ?? null,
            attribute_value: v.attribute_value ?? null,
            dimension: v.dimension ?? null,
            keywords: v.keywords ?? null,
          };
        }),
      );
      setProducts(flattened);
    } catch (err) {
      console.error("Error loading inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return { products, setProducts, loading, fetchInventory };
}