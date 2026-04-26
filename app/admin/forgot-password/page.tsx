"use client";

import { useState, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import Image from "next/image";

const isValidEmailFormat = (val: string) => {
  if (!val) return false;
  if (val.length > 100) return false;
  if (!/^[a-zA-Z0-9]/.test(val)) return false;
  if (/\.\./.test(val)) return false;

  const parts = val.split("@");
  if (parts.length !== 2) return false;

  const beforeAt = parts[0];
  const afterAt = parts[1];

  if (!beforeAt || !afterAt) return false;

  if (!/^[a-zA-Z0-9_.+-]+$/.test(beforeAt)) return false;
  if (beforeAt.endsWith(".")) return false;
  if (!/^[a-zA-Z0-9.-]+$/.test(afterAt)) return false;
  if (afterAt.startsWith(".") || afterAt.endsWith(".")) return false;

  return true;
};

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

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // Step 1 — send OTP to email via Supabase Auth
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !isValidEmailFormat(email)) {
      setErrors({ email: "Please enter valid email address" });
      return;
    }

    setErrors({});

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // only works for existing admin accounts
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  };

  // Step 2 — verify the 6-digit code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp.join(""),
      type: "recovery",
    });

    setLoading(false);

    if (error) {
      setError("Invalid or expired code. Please try again.");
      return;
    }

    setVerified(true);
  };

  // Step 3 — update the password (session exists after verifyOtp)
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

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-between bg-transparent p-4">
      <div className="flex justify-center w-full">
        <div className="relative w-[45px] h-[45px]">
          <Image
            src="https://zdahzxsipjtwxbraslvb.supabase.co/storage/v1/object/public/JFK%20Assets/logo/jfk_logo.png"
            alt="JFK Logo"
            fill
            sizes="45px"
            className="opacity-90 object-contain"
          />
        </div>
      </div>

      <div className="w-[250px] md:w-[400px] overflow-x-hidden">
        {/* Step 1 — Email */}
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
            <form onSubmit={handleSendOtp} noValidate>
              <div className="space-y-1.5 mb-5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                  Email
                </label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    type="email"
                    placeholder="admin@jfkbuilders.com"
                    maxLength={100}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (e.target.value.trim() && errors.email) {
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }
                    }}
                    className={`pl-12 h-12 border-gray-200 bg-gray-50 rounded-lg w-full text-sm ${errors.email ? "border-red-400" : ""}`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 ml-1">
                    {errors.email}
                  </p>
                )}
              </div>
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 mb-3 rounded-xl text-xs font-medium text-center">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer mt-2 w-full h-12 text-white font-bold rounded-lg shadow-lg transition-all"
                style={{ backgroundColor: "#e7000b" }}
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

        {/* Step 2 — OTP */}
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
            <form onSubmit={handleVerifyOtp} noValidate>
              <div className="flex justify-center gap-2 mb-6 w-full">
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
                    className="w-8 md:w-10 h-12 text-center text-xl font-bold text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 transition-all"
                    style={{
                      borderColor: digit ? "#e7000b" : undefined,
                    }}
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
                className="cursor-pointer w-full h-12 text-white font-bold rounded-lg shadow-lg transition-all"
                style={{ backgroundColor: "#e7000b" }}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Verify Code"
                )}
              </Button>

              {/* Resend option */}
              <button
                type="button"
                onClick={
                  handleSendOtp as unknown as React.MouseEventHandler<HTMLButtonElement>
                }
                className="mt-3 w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer hover:underline"
              >
                Didn&apos;t receive a code? Resend
              </button>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setOtp(["", "", "", "", "", ""]);
                  setError("");
                }}
                className="mt-2 w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer hover:underline"
              >
                Wrong email? Go back
              </button>
            </form>
          </>
        )}

        {/* Step 3 — New Password */}
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
            <form onSubmit={handleUpdatePassword} noValidate>
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
                className="cursor-pointer mt-2 w-full h-12 text-white font-bold rounded-lg shadow-lg transition-all"
                style={{ backgroundColor: "#e7000b" }}
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
          Remember your password?
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/admin");
            }}
            className="ml-1 font-semibold hover:opacity-80 transition-colors cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full"
            style={{ color: "#e7000b" }}
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
