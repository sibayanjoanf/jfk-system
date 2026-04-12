"use client";

import jsQR from "jsqr";
import { useRef, useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QrCode, Upload, Loader2 } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { supabase } from "@/lib/supabase";
import { Order } from "@/app/admin/order-management/types";
import TrackOrderView from "./components/TrackOrderView";
import { QRScannerModal } from "./components/QRScanner";

export default function TrackOrderPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const [showScanner, setShowScanner] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Mobi|Android|iPhone/i.test(navigator.userAgent));
  }, []);

  const handleScanResult = (scannedId: string) => {
    setOrderId(scannedId);
    handleTrackById(scannedId);
  };

  const handleUploadClick = () => fileInputRef.current?.click();
  const handleScanClick = () => cameraInputRef.current?.click();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setError("");
    setLoading(true);

    const imageBitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(imageBitmap, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    setLoading(false);

    if (!code) {
      setError("No QR code found in the image. Please try again.");
      return;
    }

    const scannedId = code.data.trim().toUpperCase();
    setOrderId(scannedId);
    await handleTrackById(scannedId);
  };

  const handleTrackById = async (id: string) => {
    setLoading(true);
    setError("");
    setOrder(null);

    const { data, error: fetchError } = await supabase
      .from("inquiries")
      .select("*")
      .eq("order_number", id)
      .single();

    setLoading(false);

    if (fetchError || !data) {
      setError("Order not found. Check your QR or Order ID.");
      return;
    }

    setOrder({
      id: data.id,
      order_number: data.order_number,
      status: data.status,
      order_type: data.order_type,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      delivery_preference: data.delivery_preference,
      payment_preference: data.payment_preference,
      message: data.message,
      items: data.items ?? [],
      total_amount: data.total_amount,
      created_at: data.created_at,
    });
  };

  const handleTrack = () => {
    if (!orderId.trim()) {
      setError("Please enter your Order ID.");
      return;
    }
    handleTrackById(orderId.trim().toUpperCase());
  };

  return (
    <div className="flex min-h-screen min-w-20 flex-col">
      <Navbar />

      <Reveal>
        <section className="py-15 text-sm">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Page Description */}
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-semibold mb-6">
                  Track Order Status
                </h1>
                <p className="text-gray-700 mb-4">
                  To track your order, please enter your Order ID.
                  Alternatively, you can scan or upload your QR code. This was
                  given to you on your receipt or in the order confirmation
                  email.
                </p>
              </div>

              {/* Tracking Methods */}
              <div className="flex flex-col justify-between gap-7">
                <div className="flex-col sm:flex sm:flex-row justify-center lg:justify-between gap-5 space-y-5 sm:space-y-0">
                  {/* Scan QR */}
                  {/* Only show on mobile */}
                  {isMobile && (
                    <div
                      onClick={() => setShowScanner(true)}
                      className="group p-12 rounded-lg border border-dashed border-red-600 
                                cursor-pointer transition-all duration-300
                                hover:bg-red-600 hover:text-white hover:scale-105"
                    >
                      <QrCode
                        className="mx-auto mb-4 text-red-600 transition-colors duration-300 group-hover:text-white"
                        size={48}
                      />
                      <p className="text-sm font-semibold text-center">
                        <span className="text-red-600 transition-colors duration-300 group-hover:text-white">
                          Scan{" "}
                        </span>
                        your QR code here
                        <br />
                        <span className="group-hover:text-white text-xs text-gray-400 font-normal">
                          Live camera scanner
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Modal */}
                  {showScanner && (
                    <QRScannerModal
                      onScan={handleScanResult}
                      onClose={() => setShowScanner(false)}
                    />
                  )}

                  {/* Upload QR */}
                  <div
                    onClick={handleUploadClick}
                    className="group p-12 rounded-lg border border-dashed border-red-600 
                              cursor-pointer transition-all duration-300
                              hover:bg-red-600 hover:text-white hover:scale-105"
                  >
                    <Upload
                      className="mx-auto mb-4 text-red-600 transition-colors duration-300 group-hover:text-white"
                      size={48}
                    />
                    <p className="text-sm font-semibold text-center">
                      <span className="text-red-600 transition-colors duration-300 group-hover:text-white">
                        Upload{" "}
                      </span>
                      your QR code here
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
                      Image selected:{" "}
                      <span className="font-medium">{selectedFileName}</span>
                    </p>
                  </div>
                )}

                {/* OR Divider */}
                <div className="relative mt-4 mb-4 flex items-center justify-center">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <span className="relative z-10 bg-[#f8f8f8] px-4 text-xs font-medium text-gray-400 uppercase">
                    OR
                  </span>
                </div>

                <div>
                  <FieldGroup>
                    <Field className="mb-4">
                      <Input
                        id="order-id"
                        className="text-sm"
                        placeholder="Enter your Order ID (e.g. ORD-20260331-001)"
                        value={orderId}
                        onChange={(e) => {
                          setOrderId(e.target.value);
                          setError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                      />
                    </Field>
                  </FieldGroup>

                  {error && (
                    <p className="text-xs text-red-500 mb-3">{error}</p>
                  )}

                  <Button
                    onClick={handleTrack}
                    disabled={loading}
                    className="w-full h-10 mt-2 bg-red-600 hover:bg-red-700"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" />{" "}
                        Searching...
                      </span>
                    ) : (
                      "Track Order Status"
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Order Result */}
            {order && (
              <div className="mt-16 border-t border-gray-100 pt-12">
                <TrackOrderView order={order} />
              </div>
            )}
          </div>
        </section>
      </Reveal>

      <Footer />
    </div>
  );
}
