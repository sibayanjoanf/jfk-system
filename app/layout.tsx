import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { WindSong } from 'next/font/google';
import './globals.css';
import Providers from './provider'; 
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

const windsong = WindSong({ 
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-windsong',
});

export const metadata: Metadata = {
  title: 'JFK Tile & Stone Builders',
  description: 'Order Inquiry and Inventory Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${windsong.variable}`}>
        <Providers> 
          <main className="pt-[90px]">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}