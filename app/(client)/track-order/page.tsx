"use client";

import { useRef, useState } from "react";
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QrCode, Upload } from 'lucide-react';

export default function ContactPage() {

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleScanClick = () => {
    cameraInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

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
                <div
                  onClick={handleScanClick}
                  className="group p-12 rounded-lg border border-dashed border-red-600 
                             cursor-pointer transition-all duration-300
                             hover:bg-red-600 hover:text-white hover:scale-105"
                >
                  <QrCode className="mx-auto mb-4 text-red-600 transition-colors duration-300 group-hover:text-white" size={48} />
                  <p className="text-sm font-semibold text-center">
                    <span className="text-red-600 transition-colors duration-300 group-hover:text-white">Scan </span>your QR code here
                    <br />
                    <span className="group-hover:text-white text-xs text-gray-400 font-normal">
                      Supports JPG, JPEG, PNG
                    </span>
                  </p>
                </div>

                {/* Upload QR */}
                <div
                  onClick={handleUploadClick}
                  className="group p-12 rounded-lg border border-dashed border-red-600 
                             cursor-pointer transition-all duration-300
                             hover:bg-red-600 hover:text-white hover:scale-105"
                >
                  <Upload className="mx-auto mb-4 text-red-600 transition-colors duration-300 group-hover:text-white" size={48} />
                  <p className="text-sm font-semibold text-center">
                    <span className="text-red-600 transition-colors duration-300 group-hover:text-white">Upload </span>your QR code here
                    <br />
                    <span className="group-hover:text-white text-xs text-gray-400 font-normal">
                      Supports JPG, JPEG, PNG
                    </span>
                  </p>
                </div>

              </div>

              {/* Hidden Inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                onChange={handleFileChange}
              />

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />

              {selectedFileName && (
                <div className="mt-4 p-4 rounded-md bg-gray-100 border border-gray-200 text-sm text-gray-700">
                  <p>
                    Image selected: <span className="font-medium">{selectedFileName}</span>
                  </p>
                </div>
              )}

              {/* OR Divider */}
              <div className="relative mt-4 mb-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <span className="relative z-10 bg-[#f8f8f8] px-4 text-xs font-medium text-gray-400 uppercase">
                  OR
                </span>
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

                <Button className="w-full h-10 mt-4 bg-red-600 hover:bg-red-700">
                  Track Order Status
                </Button>
              </div>

            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}