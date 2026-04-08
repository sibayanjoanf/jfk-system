import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Inquiry } from "../types";

export function useInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact")
        .select(
          "id, first_name, last_name, email, phone, message, status, created_at",
        )
        .order("created_at", { ascending: false });

      if (!isMounted) return;
      if (error) console.error("Error fetching contacts:", error);
      else if (data) setInquiries(data as Inquiry[]);
      setLoading(false);
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateStatus = async (id: string, newStatus: Inquiry["status"]) => {
    const { error } = await supabase
      .from("contact")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Failed to update status:", error);
      return false;
    }
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)),
    );
    return true;
  };

  const deleteInquiries = async (ids: string[]) => {
    const { error } = await supabase.from("contact").delete().in("id", ids);
    if (error) {
      console.error("Error deleting records:", error);
      return false;
    }
    setInquiries((prev) => prev.filter((i) => !ids.includes(i.id)));
    return true;
  };

  return { inquiries, setInquiries, loading, updateStatus, deleteInquiries };
}
