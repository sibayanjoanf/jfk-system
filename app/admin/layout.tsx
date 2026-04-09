"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import { Session } from "@supabase/supabase-js";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const pathname = usePathname();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      setSession(currentSession);
    };
    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const authOnlyPages = [
    "/admin",
    "/admin/forgot-password",
    "/admin/reset-password",
    "/admin/register",
  ];
  const isAuthPage = authOnlyPages.includes(pathname);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {session && !isAuthPage && <Sidebar />}

      <main
        className={`${!isAuthPage ? "lg:ml-20" : ""} flex-1 p-8 -mt-[25px] overflow-y-auto`}
      >
        {children}
      </main>
    </div>
  );
}
