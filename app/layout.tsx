import { Poppins, WindSong } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import MainWrapper from "./components/MainWrapper";

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
  return (
    <html lang="en">
      <body className={`${poppins.className} ${windsong.variable}`}>
        <Providers>
          <MainWrapper>{children}</MainWrapper>
        </Providers>
      </body>
    </html>
  );
}
