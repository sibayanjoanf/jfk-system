import { useCallback, useEffect, useState } from "react";
import { Category } from "../types";
import { supabase } from "@/lib/supabase";

type RawCategory = {
  id: string;
  name: string;
  image_url: string;
  sub_categories: {
    id: string;
    category_id: string;
    name: string;
    image_url: string;
  }[];
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("categories")
      .select(`
        id,
        name,
        image_url,
        sub_categories ( id, category_id, name, image_url )
      `)
      .order("name");

    if (error) {
      console.error("Failed to fetch categories:", error.message);
      setLoading(false);
      return;
    }

    setCategories((prev) => {
      const expandedIds = new Set(
        prev.filter((c) => c.expanded).map((c) => c.id)
      );

      return (data ?? []).map((cat: RawCategory) => ({
        ...cat,
        subCategories: cat.sub_categories ?? [],
        expanded: expandedIds.has(cat.id),
      }));
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addCategory = async (name: string, image_url: string) => {
    if (!name.trim()) return;
    const { error } = await supabase
      .from("categories")
      .insert({ name, image_url });
    if (error) { console.error(error.message); return; }
    await fetchCategories();
  };

  const deleteCategory = async (id: string) => {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  await fetchCategories();
};

  const saveCategoryName = async (id: string, name: string) => {
    if (!name.trim()) return;
    const { error } = await supabase
      .from("categories")
      .update({ name })
      .eq("id", id);
    if (error) { console.error(error.message); return; }
    await fetchCategories();
  };

  const updateCategoryImage = async (id: string, image_url: string) => {
    const { error } = await supabase
      .from("categories")
      .update({ image_url })
      .eq("id", id);
    if (error) { console.error(error.message); return; }
    await fetchCategories();
  };

  const addSubCategory = async (category_id: string, name: string, image_url: string) => {
    if (!name.trim()) return;
    const { error } = await supabase
      .from("sub_categories")
      .insert({ category_id, name, image_url });
    if (error) { console.error(error.message); return; }
    await fetchCategories();
  };

  const deleteSubCategory = async (id: string) => {
  const { count, error: countError } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("sub_category_id", id);

  if (countError) throw new Error(countError.message);

  if (count && count > 0) {
    throw new Error("has_products");
  }

  const { error } = await supabase
    .from("sub_categories")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  await fetchCategories();
};

  const saveSubCategoryName = async (id: string, name: string) => {
    if (!name.trim()) return;
    const { error } = await supabase
      .from("sub_categories")
      .update({ name })
      .eq("id", id);
    if (error) { console.error(error.message); return; }
    await fetchCategories();
  };

  const updateSubCategoryImage = async (id: string, image_url: string) => {
    const { error } = await supabase
      .from("sub_categories")
      .update({ image_url })
      .eq("id", id);
    if (error) { console.error(error.message); return; }
    await fetchCategories();
  };

  const toggleCategoryExpand = (id: string) =>
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, expanded: !c.expanded } : c))
    );

  return {
    categories,
    loading,
    toggleCategoryExpand,
    addCategory,
    deleteCategory,
    saveCategoryName,
    updateCategoryImage,
    addSubCategory,
    deleteSubCategory,
    saveSubCategoryName,
    updateSubCategoryImage,
  };
};