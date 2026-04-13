"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ROLE_LABELS } from "./userTypes";
import type { UserProfile, UserRole, UserStatus, UserPermissions } from "./userTypes";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export function useUserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .neq("status", "archived")
      .order("created_at", { ascending: false });

    if (!error && data) setUsers(data as UserProfile[]);
    setLoading(false);
  };

  const fetchCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (data) setCurrentUser(data as UserProfile);
  };

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  const approveUser = async (
    id: string,
    role: UserRole,
    permissions: UserPermissions,
  ): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ role, status: "active", permissions, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      const user = users.find((u) => u.id === id);
      if (user) {
        await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-approval-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              email: user.email,
              full_name: user.full_name,
              role: ROLE_LABELS[role],
            }),
          },
        ).catch(() => {});
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, role, status: "active", permissions } : u,
        ),
      );
      return { error: null };
    } catch (err) {
      const e = err as { message: string };
      return { error: e.message };
    }
  };

  const updateUser = async (
    id: string,
    updates: Partial<UserProfile>,
  ): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...updates } : u)),
      );
      return { error: null };
    } catch (err) {
      const e = err as { message: string };
      return { error: e.message };
    }
  };

  const archiveUser = async (id: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ status: "archived", updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      setUsers((prev) => prev.filter((u) => u.id !== id));
      return { error: null };
    } catch (err) {
      const e = err as { message: string };
      return { error: e.message };
    }
  };

  return {
    users,
    loading,
    currentUser,
    fetchUsers,
    approveUser,
    updateUser,
    archiveUser,
  };
}