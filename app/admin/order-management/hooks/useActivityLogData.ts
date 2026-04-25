import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface ActivityLogRow {
  id: string;
  order_id: string;
  order_number: string;
  action: string;
  from_status: string | null;
  status: string;
  changed_by: string;
  changed_at: string;
}

export function useActivityLogData() {
  const [rows, setRows] = useState<ActivityLogRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivityLog = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("order_status_history")
        .select("*")
        .order("changed_at", { ascending: false });

      if (error) throw error;
      setRows(data ?? []);
    } catch (err) {
      console.error("Error fetching activity log:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityLog();
  }, []);

  return { rows, loading, fetchActivityLog };
}