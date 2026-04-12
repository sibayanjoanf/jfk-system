"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface QRScannerModalProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export function QRScannerModal({ onScan, onClose }: QRScannerModalProps) {
  const scannerRef = useRef<any>(null);
  const hasScanned = useRef(false);

  useEffect(() => {
    const scannerId = "qr-scanner-region";

    // ✅ Dynamic import — only loads in browser, never on the server
    import("html5-qrcode").then(({ Html5Qrcode }) => {
      const scanner = new Html5Qrcode(scannerId);
      scannerRef.current = scanner;

      scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => {
          if (hasScanned.current) return;
          hasScanned.current = true;

          scanner.stop().then(() => {
            onScan(decodedText.trim().toUpperCase());
            onClose();
          });
        },
        () => {}
      );
    });

    return () => {
      scannerRef.current?.stop().catch(() => {});
    };
  }, [onClose, onScan]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative bg-white rounded-2xl overflow-hidden w-[340px] shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-800">Scan QR Code</p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          <div id="qr-scanner-region" className="w-full rounded-lg overflow-hidden" />
          <p className="text-xs text-center text-gray-400 mt-4">
            Point your camera at the QR code
          </p>
        </div>
      </div>
    </div>
  );
}