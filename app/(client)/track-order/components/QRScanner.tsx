"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { Html5Qrcode } from "html5-qrcode";

interface QRScannerModalProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export function QRScannerModal({ onScan, onClose }: QRScannerModalProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isStoppingRef = useRef(false);
  const hasScanned = useRef(false);
  const scannerId = "qr-scanner-region";

  useEffect(() => {
    let isMounted = true;

    import("html5-qrcode").then(({ Html5Qrcode }) => {
      if (!isMounted) return;

      const scanner = new Html5Qrcode(scannerId);
      scannerRef.current = scanner;

      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
          (decodedText: string) => {
            if (hasScanned.current || isStoppingRef.current) return;
            hasScanned.current = true;
            isStoppingRef.current = true;

            scanner
              .stop()
              .catch((err) => console.warn("Stop failed during scan:", err))
              .finally(() => {
                onScan(decodedText.trim().toUpperCase());
                onClose();
              });
          },
          () => {},
        )
        .catch((err) => {
          console.error("QR Scanner failed to start:", err);
        });
    });

    return () => {
      isMounted = false;
      if (scannerRef.current && !isStoppingRef.current) {
        isStoppingRef.current = true;

        const currentScanner = scannerRef.current;
        if (currentScanner.isScanning) {
          currentScanner.stop().catch(() => {});
        }
      }
    };
  }, [onClose, onScan]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl overflow-hidden w-[340px] shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800">Scan QR Code</p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-5">
          <div
            id={scannerId}
            className="w-full aspect-square rounded-lg overflow-hidden bg-black border border-gray-100"
          />
          <p className="text-xs text-center text-gray-400 mt-4 font-medium uppercase tracking-wider">
            Point camera at the QR code
          </p>
        </div>
      </div>
    </div>
  );
}
