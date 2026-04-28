"use client";

import React, { useRef, useState } from "react";
import { Loader2, Shield } from "lucide-react";

interface OTPModalProps {
  open: boolean;
  email: string;
  otpError: string;
  verifying: boolean;
  onComplete: (token: string) => void;
  onResend: () => void;
  onCancel: () => void;
}

const OTPModal: React.FC<OTPModalProps> = ({
  open,
  email,
  otpError,
  verifying,
  onComplete,
  onResend,
  onCancel,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  if (!open) return null;

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // ✅ auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // ✅ auto-submit when all 6 filled
    if (value && index === 5) {
      const filled = [...newOtp];
      if (filled.every((d) => d !== "")) {
        onComplete(filled.join(""));
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();

    // ✅ auto-submit on paste too if all 6 filled
    if (pasted.length === 6) {
      onComplete(pasted);
    }
  };

  const handleCancel = () => {
    setOtp(["", "", "", "", "", ""]);
    onCancel();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm flex items-center justify-center"
      onClick={() => !verifying && handleCancel()}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center mb-3">
            <Shield size={16} className="text-red-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">Verify it&apos;s you</h3>
          <p className="text-xs text-gray-500 mt-1">We sent a 6-digit code to</p>
          <p className="text-xs font-semibold text-gray-800 mt-0.5">{email}</p>
        </div>

        {/* OTP inputs */}
        <div className="flex justify-center gap-2 mb-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-10 h-11 text-center text-lg font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 transition-all"
              style={{ borderColor: digit ? "#e7000b" : undefined }}
            />
          ))}
        </div>

        {otpError && (
          <p className="text-xs text-red-500 text-center mb-2">{otpError}</p>
        )}

        {/* Buttons */}
        <div className="flex gap-2 mt-5">
          <button
            onClick={handleCancel}
            disabled={verifying}
            className="cursor-pointer flex-1 px-4 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onComplete(otp.join(""))}
            disabled={verifying || otp.some((d) => d === "")}
            className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium text-white rounded-lg transition-colors disabled:opacity-60 bg-red-600 hover:bg-red-700"
          >
            {verifying
              ? <><Loader2 size={12} className="animate-spin" /> Please wait...</>
              : "Confirm"
            }
          </button>
        </div>

        {/* Resend */}
        <button
          type="button"
          onClick={onResend}
          disabled={verifying}
          className="mt-3 w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer hover:underline disabled:opacity-50"
        >
          Didn&apos;t receive a code? Resend
        </button>
      </div>
    </div>
  );
};

export default OTPModal;