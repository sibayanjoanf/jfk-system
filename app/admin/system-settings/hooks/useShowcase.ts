import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";
import { ShowcaseImage } from "../types";


export const useShowcase = () => {
  const [showCaseImages, setShowcaseImages] = useState<ShowcaseImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShowcase = useCallback(async () => {
    const { data, error } = await supabase
      .from("showcase")
      .select("id, product_name, image_url")
      .order("product_name");

    if (error) {
      console.error("Failed to fetch showcase:", error.message);
      setLoading(false);
      return;
    }

    setShowcaseImages(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchShowcase();
  }, [fetchShowcase]);

  const addShowcase = async (product_name: string, image_url: string) => {
    if (!product_name.trim()) return;
    const { error } = await supabase
      .from("showcase")
      .insert({ product_name, image_url });
    if (error) {console.error(error.message); return;}
    await fetchShowcase();
  }

  const deleteShowcase = async(id: string) => {
    const { error } = await supabase  
      .from("showcase")
      .delete()
      .eq("id", id);
    if (error) {console.error(error.message); return;}
    await fetchShowcase();
  }

  const updateShowcaseImage = async (id: string, image_url: string) => {
    const { error } = await supabase
      .from("showcase")
      .update({ image_url })
      .eq("id", id);
    if (error) {console.error(error.message); return;}
    await fetchShowcase();
  };

  const updateShowcaseName = async (id: string, product_name: string) => {
    const { error } = await supabase
      .from("showcase")
      .update({ product_name })
      .eq("id", id);
    if (error) {console.error(error.message); return;}
    await fetchShowcase();
  };

  return {
    showCaseImages,
    loading,
    fetchShowcase,
    addShowcase,
    deleteShowcase,
    updateShowcaseImage,
    updateShowcaseName,
  };
};