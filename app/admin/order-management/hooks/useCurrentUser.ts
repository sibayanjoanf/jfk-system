import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { UserPermissions, UserRole } from "@/app/admin/user-management/userTypes";

export interface CurrentUser {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  permissions: UserPermissions;
  status: string;
}

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) setCurrentUser(data as CurrentUser);
      setLoading(false);
    };
    fetch();
  }, []);

  return { currentUser, loading };
}