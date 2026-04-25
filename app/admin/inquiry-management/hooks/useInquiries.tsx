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
        .eq("is_archived", false)
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

  const updateStatus = async (
    id: string,
    newStatus: Inquiry["status"],
    performedBy = "system",
  ) => {
    const current = inquiries.find((i) => i.id === id);

    const { error } = await supabase
      .from("contact")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Failed to update status:", error);
      return false;
    }

    // Only log when status becomes Resolved
    if (newStatus === "Resolved" && current) {
      await supabase.from("inquiry_status_history").insert({
        inquiry_id: id,
        inquiry_email: current.email,
        from_status: current.status,
        status: newStatus,
        changed_by: performedBy,
        action: "status_change",
      });
    }

    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)),
    );
    return true;
  };

  const archiveInquiries = async (ids: string[], performedBy = "system") => {
    const toArchive = inquiries.filter((i) => ids.includes(i.id));

    const { error } = await supabase
      .from("contact")
      .update({ is_archived: true })
      .in("id", ids);

    if (error) {
      console.error("Error archiving records:", error);
      return false;
    }

    if (toArchive.length > 0) {
      await supabase.from("inquiry_status_history").insert(
        toArchive.map((i) => ({
          inquiry_id: i.id,
          inquiry_email: i.email,
          from_status: i.status,
          status: i.status,
          changed_by: performedBy,
          action: "archived",
        })),
      );
    }

    setInquiries((prev) => prev.filter((i) => !ids.includes(i.id)));
    return true;
  };

  const restoreInquiries = async (ids: string[], performedBy = "system") => {
    const { data: contacts } = await supabase
      .from("contact")
      .select("id, email, status")
      .in("id", ids);

    const { error } = await supabase
      .from("contact")
      .update({ is_archived: false })
      .in("id", ids);

    if (error) {
      console.error("Error restoring records:", error);
      return false;
    }

    if (contacts && contacts.length > 0) {
      await supabase.from("inquiry_status_history").insert(
        contacts.map((i) => ({
          inquiry_id: i.id,
          inquiry_email: i.email,
          from_status: i.status,
          status: i.status,
          changed_by: performedBy,
          action: "restored",
        })),
      );
    }

    return true;
  };

  return {
    inquiries,
    setInquiries,
    loading,
    updateStatus,
    archiveInquiries,
    restoreInquiries,
  };
}
