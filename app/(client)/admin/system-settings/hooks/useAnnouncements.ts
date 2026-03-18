import { useCallback, useEffect, useState } from "react";
import { Announcement } from "../types";
import { supabase } from "@/lib/supabase";

export const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = useCallback(async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("id, text, active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch announcements:", error.message);
      setLoading(false);
      return;
    }

    setAnnouncements(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const addAnnouncement = async (text: string) => {
    if (!text.trim()) return;
    const { error } = await supabase
      .from("announcements")
      .insert({ text, active: true });
    if (error) { console.error(error.message); return; }
    await fetchAnnouncements();
  };

  const deleteAnnouncement = async (id: string) => {
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);
    if (error) { console.error(error.message); return; }
    await fetchAnnouncements();
  };

  const toggleAnnouncement = async (id: string, active: boolean) => {
    const { error } = await supabase
      .from("announcements")
      .update({ active: !active })
      .eq("id", id);
    if (error) { console.error(error.message); return; }
    await fetchAnnouncements();
  };

  return {
    announcements,
    loading,
    addAnnouncement,
    deleteAnnouncement,
    toggleAnnouncement,
  };
};