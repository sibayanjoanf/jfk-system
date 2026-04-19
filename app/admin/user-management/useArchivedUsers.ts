"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { UserProfile } from "./userTypes";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export function useArchivedUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("status", "archived")
        .order("created_at", { ascending: false });

      if (!isMounted) return;
      if (!error && data) setUsers(data as UserProfile[]);
      setLoading(false);
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const restoreUser = async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from("user_profiles")
      .update({ status: "inactive", updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return false;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    return true;
  };

  const restoreUsers = async (ids: string[]): Promise<boolean> => {
    const { error } = await supabase
      .from("user_profiles")
      .update({ status: "inactive", updated_at: new Date().toISOString() })
      .in("id", ids);

    if (error) return false;
    setUsers((prev) => prev.filter((u) => !ids.includes(u.id)));
    return true;
  };

  return { users, loading, restoreUser, restoreUsers };
}