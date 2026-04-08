"use client";

import { usePathname } from "next/navigation";

export default function MainWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminLogin = pathname === "/admin";
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <main
      className={
        isAdminLogin ? "pt-0" : isAdmin ? "pt-20 lg:pt-8" : "pt-[90px]"
      }
    >
      {children}
    </main>
  );
}
