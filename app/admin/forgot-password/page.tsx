"use client";

import { useState, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ),
  );

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 500);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      setVerified(true);
      setLoading(false);
    }, 500);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-between bg-transparent p-4">
      <div className="flex justify-center w-full">
        <Image
          src="https://zdahzxsipjtwxbraslvb.supabase.co/storage/v1/object/public/JFK%20Assets/logo/jfk_logo.png"
          alt="JFK Logo"
          width={45}
          height={45}
          className="opacity-90"
        />
      </div>

      <div className="w-[250px] md:w-[400px] overflow-x-hidden">
        {/* Email */}
        {!sent && (
          <>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Forgot Password
              </h2>
              <p className="text-sm text-gray-500 mt-2 mb-10">
                Enter your email and we&apos;ll send you a 6-digit code
              </p>
            </div>
            <form onSubmit={handleSendOtp}>
              <div className="space-y-1.5 mb-5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                  Email
                </label>
                <div className="mt-1 mb-2 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    type="email"
                    placeholder="admin@jfkbuilders.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 border-gray-200 bg-gray-50 rounded-lg w-full text-sm"
                    required
                  />
                </div>
              </div>
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 mb-3 rounded-xl text-xs font-medium text-center">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer mt-2 w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition-all"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Send Code"
                )}
              </Button>
            </form>
          </>
        )}

        {/* OTP (digits) */}
        {sent && !verified && (
          <>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Check your email
              </h2>
              <p className="text-sm text-gray-500 mt-2 mb-2">
                We sent a 6-digit code to
              </p>
              <p className="text-sm font-semibold text-gray-800 mb-10">
                {email}
              </p>
            </div>
            <form onSubmit={handleVerifyOtp}>
              <div className="flex justify-between gap-2 mb-6 w-full">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className="w-10 h-12 text-center text-xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                  />
                ))}
              </div>
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 mb-3 rounded-xl text-xs font-medium text-center">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                disabled={loading || otp.some((d) => d === "")}
                className="cursor-pointer w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition-all"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Verify Code"
                )}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setOtp(["", "", "", "", "", ""]);
                }}
                className="mt-4 w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Wrong email? Go back
              </button>
            </form>
          </>
        )}

        {/* New Password */}
        {verified && (
          <>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                New Password
              </h2>
              <p className="text-sm text-gray-500 mt-2 mb-10">
                Set a new password for your account
              </p>
            </div>
            <form onSubmit={handleUpdatePassword}>
              <div className="space-y-1.5 mb-3">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                  New Password
                </label>
                <div className="mt-1 mb-2 relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-12 pr-12 h-12 border-gray-200 bg-gray-50 rounded-lg w-full text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5 mb-5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                  Confirm Password
                </label>
                <div className="mt-1 mb-2 relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-12 pr-12 h-12 border-gray-200 bg-gray-50 rounded-lg w-full text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 mb-1 rounded-lg text-xs font-medium text-center">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer mt-2 w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition-all"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </>
        )}
      </div>

      <div className="mt-10">
        <p className="text-center text-sm text-gray-500">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="font-semibold text-red-600 hover:text-red-700 transition-colors"
          >
            Back to login
          </button>
        </p>
        <p className="text-center text-[11px] text-gray-400 mt-2 tracking-tight">
          &copy; {new Date().getFullYear()} JFK Tile and Stone Builders
        </p>
      </div>
    </div>
  );
}
