"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import QRCode from "qrcode";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// 1. Separate the logic into a internal component
function QRGeneratorContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") ?? "UNKNOWN";

  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (orderId) {
      QRCode.toDataURL(orderId, {
        width: 400,
        margin: 2,
        color: { dark: "#111111", light: "#ffffff" },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("QR Generation Error:", err));
    }
  }, [orderId]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `order-${orderId}-qr.png`;
    link.click();
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-grow relative flex items-center py-20 lg:py-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/JFK_homePage_bg.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-white/30" />
        </div>

        <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="flex flex-col items-start text-left gap-6">
              <h1 className="font-medium text-2xl md:text-3xl text-gray-900 leading-tight">
                Your personalized
                <span className="text-red-600 italic font-bold block md:inline">
                  {" "}
                  Order Tracking QR Code{" "}
                </span>
                is now ready!
              </h1>

              <p className="text-base text-gray-700 leading-relaxed max-w-lg">
                This code is your fastest way to check your order status. Simply
                scan it directly from your device photo gallery whenever you
                visit our
                <span className="italic font-medium"> Track Order </span> page,
                skipping the need to manually enter your order ID.
              </p>

              <p className="text-sm italic text-gray-500 border-l-2 border-red-600 pl-4">
                Keep this QR code handy; it is the quickest route to updates on
                your order!
              </p>
            </div>

            <div className="flex flex-col items-center lg:items-end w-full">
              <div className="w-full max-w-xs flex flex-col gap-6">
                <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 flex flex-col items-center">
                  {qrDataUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrDataUrl}
                      alt="Order QR Code"
                      width={300}
                      height={300}
                      className="object-fit"
                    />
                  ) : (
                    <div className="w-[300px] h-[300px] flex items-center justify-center text-gray-400 text-sm">
                      Generating QR...
                    </div>
                  )}

                  <div className="text-center border-t border-gray-100 pt-6 w-full">
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-1 font-semibold">
                      Order ID
                    </p>
                    <p className="text-xl font-mono font-bold text-gray-900 tracking-wider">
                      {orderId}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  disabled={!qrDataUrl}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all shadow-lg cursor-pointer flex justify-center"
                >
                  Download QR Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// 2. The main Page component that wraps the content in Suspense
export default function OrderQRPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-pulse text-gray-400 font-medium">
            Loading QR Page...
          </div>
        </div>
      }
    >
      <QRGeneratorContent />
    </Suspense>
  );
}
