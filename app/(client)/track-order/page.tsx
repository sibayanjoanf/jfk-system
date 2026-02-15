"use client";

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { QrCode, Upload } from 'lucide-react';

export default function ContactPage() {

  return (
    <div className="flex min-h-screen min-w-20 flex-col">
      <Navbar />

      <section className="py-15 text-sm">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            
            {/* Page Description */}
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-semibold mb-6">
                Track Order Status
              </h1>
              <p className="text-gray-700 mb-4">
                To track your order, please enter your Order ID and email address. Alternatively, you can simply scan or upload your QR code. 
                This was given to you on your receipt or in the order confirmation email.
              </p>
            </div>

            {/* Tracking Methods */}
            <div className="flex flex-col justify-between gap-7">
              <div className="flex-col sm:flex sm:flex-row justify-center lg:justify-between gap-5 space-y-5 sm:space-y-0">
                {/* Scan QR */}
                <div className="p-12 bg-transparent rounded-lg border border-dashed border-red-600">
                  <QrCode className="mx-auto mb-4 text-red-600" size={48} />
                  <p className="text-sm font-semibold text-gray-900 text-center">
                    <span className="text-red-600">Scan </span>your QR code here
                    <br />
                    <span className="text-xs text-gray-400 font-normal">Supports JPG, JPEG, PNG</span>
                  </p>
                </div>

                {/* Upload QR */}
                <div className="p-12 bg-transparent rounded-lg border border-dashed border-red-600">
                  <Upload className="mx-auto mb-4 text-red-600" size={48} />
                  <p className="text-sm font-semibold text-gray-900 text-center">
                    <span className="text-red-600">Upload </span>your QR code here
                    <br />
                    <span className="text-xs text-gray-400 font-normal">Supports JPG, JPEG, PNG</span>
                  </p>
                </div>
              </div>

              <div className="relative mt-4 mb-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <span className="relative z-10 bg-[#f8f8f8] px-4 text-xs font-medium text-gray-400 uppercase">OR</span>
              </div>

              <div>
                <FieldGroup>
                  <Field>
                    <Input className="text-sm" placeholder="Enter your Order ID" />
                  </Field>

                  <Field className="mb-4">
                    <Input className="text-sm" placeholder="Enter your email address" />
                  </Field>
                </FieldGroup>
                <Button className="w-full h-10 mt-4 bg-red-600 hover:bg-red-700">Track Order Status</Button>
              </div>

              
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}