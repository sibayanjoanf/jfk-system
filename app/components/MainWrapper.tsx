"use client";

import { usePathname } from "next/navigation";

export default function MainWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminLogin = pathname === "/admin";
  const isAdminAuth = [
    "/admin",
    "/admin/forgot-password",
    "/admin/reset-password",
    "/admin/register",
  ].includes(pathname);
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <main
      className={isAdminAuth ? "pt-0" : isAdmin ? "pt-20 lg:pt-8" : "pt-[90px]"}
    >
      {children}
    </main>
  );
}
