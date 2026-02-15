"use client";

import Image from 'next/image';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Link from 'next/link';

export default function ConfirmationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-grow relative flex items-center py-20 lg:py-35">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/JFK_homePage_bg.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          /> 
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-12">
          <div className="max-w-xl flex flex-col items-start text-left gap-6 p-8">
            <div className="space-y-6">
              <h1 className="font-semibold text-3xl md:text-4xl text-gray-900">
                Thank you for your inquiry!
              </h1>
              <p className="text-gray-700 font-medium">
                Your Order ID: <span>267676GHERT105467</span>
              </p>
            </div>

            <p className="text-base text-gray-700 leading-relaxed">
              We&apos;ve sent a confirmation to your email address. Our team will reach out within 24 hours to confirm 
              availability, pricing, and delivery details.
            </p>

            <div className="pt-2">
              <Link href="/order-qr">
                <button className="text-red-600 hover:text-red-700 font-semibold underline underline-offset-4 transition-colors cursor-pointer">
                  Click here to view your QR code
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}