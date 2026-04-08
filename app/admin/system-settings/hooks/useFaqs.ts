import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FAQ, FaqCategory } from "../types";


export const useFaqs = () => {
  const [faqCategories, setFaqCategories] = useState<FaqCategory[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const [catRes, faqRes] = await Promise.all([
      supabase.from("faq_categories").select("id, name").order("name"),
      supabase.from("faq").select("id, question, answer, category_id").order("question"),
    ]);

    if (catRes.error) console.error("Failed to fetch faq categories:", catRes.error.message);
    if (faqRes.error) console.error("Failed to fetch faqs:", faqRes.error.message);

    setFaqCategories(catRes.data ?? []);
    setFaqs((faqRes.data ?? []).map((f) => ({ ...f, open: false })));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // FAQ Categories 
  const addFaqCategory = async (name: string) => {
    if (!name.trim()) return;
    const { error } = await supabase.from("faq_categories").insert({ name });
    if (error) { console.error(error.message); return; }
    await fetchAll();
  };

  const deleteFaqCategory = async (id: string) => {
    const { error } = await supabase.from("faq_categories").delete().eq("id", id);
    if (error) { console.error(error.message); return; }
    await fetchAll();
  };

  const updateFaqCategory = async (id: string, name: string) => {
    if (!name.trim()) return;
    const { error } = await supabase.from("faq_categories").update({ name }).eq("id", id);
    if (error) { console.error(error.message); return; }
    await fetchAll();
  };

  // FAQ (questions)
  const addFaq = async (category_id: string, question: string, answer: string) => {
    if (!question.trim()) return;
    const { error } = await supabase.from("faq").insert({ category_id, question, answer });
    if (error) { console.error(error.message); return; }
    await fetchAll();
  };

  const deleteFaq = async (id: string) => {
    const { error } = await supabase.from("faq").delete().eq("id", id);
    if (error) { console.error(error.message); return; }
    await fetchAll();
  };

  const updateFaq = async (id: string, question: string, answer: string) => {
    if (!question.trim()) return;
    const { error } = await supabase.from("faq").update({ question, answer }).eq("id", id);
    if (error) { console.error(error.message); return; }
    await fetchAll();
  };

  const toggleFaq = (id: string) =>
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, open: !f.open } : f)));

  return {
    faqCategories,
    faqs,
    loading,
    addFaqCategory,
    deleteFaqCategory,
    updateFaqCategory,
    addFaq,
    deleteFaq,
    updateFaq,
    toggleFaq,
  };
};