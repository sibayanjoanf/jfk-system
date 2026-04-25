import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface InquiryActivityRow {
  id: string;
  inquiry_id: string;
  inquiry_email: string | null;
  from_status: string | null;
  status: string;
  changed_by: string;
  action: string;
  changed_at: string;
}

export function useInquiryActivityLog() {
  const [rows, setRows] = useState<InquiryActivityRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivityLog = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("inquiry_status_history")
        .select("*")
        .order("changed_at", { ascending: false });

      if (error) throw error;
      setRows(data ?? []);
    } catch (err) {
      console.error("Error fetching inquiry activity log:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLog();
  }, []);

  return { rows, loading, fetchActivityLog };
}