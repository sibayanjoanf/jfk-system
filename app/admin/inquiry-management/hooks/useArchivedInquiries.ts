import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Inquiry } from "../types";

async function logActivity({
  inquiryIds,
  action,
}: {
  inquiryIds: string[];
  action: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const logs = inquiryIds.map((id) => ({
    inquiry_id: id,
    action,
    performed_by: user.id,
    performed_by_name: profile?.full_name ?? user.email,
  }));

  await supabase.from("inquiry_activity_log").insert(logs);
}

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

    await logActivity({ inquiryIds: ids, action: "restored" });

    setInquiries((prev) => prev.filter((i) => !ids.includes(i.id)));
    return true;
  };

  return { inquiries, loading, restoreInquiries };
}