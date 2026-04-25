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

  const restoreInquiries = async (ids: string[], performedBy = "system"): Promise<boolean> => {
    const toRestore = inquiries.filter((i) => ids.includes(i.id));

    const { error } = await supabase
      .from("contact")
      .update({ is_archived: false })
      .in("id", ids);

    if (error) {
      console.error("Error restoring records:", error);
      return false;
    }

    if (toRestore.length > 0) {
      await supabase.from("inquiry_status_history").insert(
        toRestore.map((i) => ({
          inquiry_id: i.id,
          inquiry_email: i.email,
          from_status: i.status,
          status: i.status,
          changed_by: performedBy,
          action: "restored",
        }))
      );
    }

    setInquiries((prev) => prev.filter((i) => !ids.includes(i.id)));
    return true;
  };

  return { inquiries, loading, restoreInquiries };
}