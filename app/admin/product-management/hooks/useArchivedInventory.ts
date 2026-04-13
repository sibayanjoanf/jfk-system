import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { DbProduct, ProductRow } from "../types";
import { PostgrestError } from "@supabase/supabase-js";

export function useArchivedInventory() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArchivedInventory = async () => {
    setLoading(true);
    try {
      const { data, error } = (await supabase
        .from("products")
        .select(`
          id, name, description,
          sub_categories ( id, name, categories (name) ),
          product_variants (*)
        `)
        .eq("is_archived", true)) as {
        data: DbProduct[] | null;
        error: PostgrestError | null;
      };

      if (error) throw error;
      if (!data) return;

      const { data: activeWithArchivedVariants, error: err2 } = (await supabase
        .from("products")
        .select(`
          id, name, description,
          sub_categories ( id, name, categories (name) ),
          product_variants!inner (*)
        `)
        .eq("is_archived", false)
        .eq("product_variants.is_archived", true)) as {
        data: DbProduct[] | null;
        error: PostgrestError | null;
      };

      if (err2) throw err2;

      const allData = [...(data || []), ...(activeWithArchivedVariants || [])];

      const flattened: ProductRow[] = allData.flatMap((p) =>
        (p.product_variants || [])
          .filter((v) => v.is_archived)
          .map((v) => {
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
      console.error("Error loading archived inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  const restoreVariants = async (ids: string[]): Promise<boolean> => {
    const { error } = await supabase
      .from("product_variants")
      .update({ is_archived: false })
      .in("id", ids);

    if (error) {
      console.error("Error restoring variants:", error);
      return false;
    }

    const productIds = [
      ...new Set(
        products
          .filter((p) => ids.includes(p.id))
          .map((p) => p.product_id),
      ),
    ];

    await supabase
      .from("products")
      .update({ is_archived: false })
      .in("id", productIds);

    setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
    return true;
  };

  useEffect(() => {
    fetchArchivedInventory();
  }, []);

  return { products, loading, restoreVariants, fetchArchivedInventory };
}