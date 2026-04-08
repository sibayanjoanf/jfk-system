"use client";

import { Poppins, WindSong } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import { usePathname } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const windsong = WindSong({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-windsong",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminLogin = pathname === "/admin";

  return (
    <html lang="en">
      <body className={`${poppins.className} ${windsong.variable}`}>
        <Providers>
          <main className={`${isAdminLogin ? "pt-0" : "pt-[90px]"}`}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
