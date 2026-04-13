import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Inquiry } from "../types";

export function useArchivedInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact")
        .select("id, first_name, last_name, email, phone, message, status, created_at")
        .eq("is_archived", true)
        .order("created_at", { ascending: false });

      if (!isMounted) return;
      if (error) console.error("Error fetching archived contacts:", error);
      else if (data) setInquiries(data as Inquiry[]);
      setLoading(false);
    };

    load();
    return () => { isMounted = false; };
  }, []);

  const restoreInquiries = async (ids: string[]): Promise<boolean> => {
    const { error } = await supabase
      .from("contact")
      .update({ is_archived: false })
      .in("id", ids);

    if (error) {
      console.error("Error restoring records:", error);
      return false;
    }
    setInquiries((prev) => prev.filter((i) => !ids.includes(i.id)));
    return true;
  };

  return { inquiries, loading, restoreInquiries };
}