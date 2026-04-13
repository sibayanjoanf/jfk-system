"use client";

import { useState, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, Mail, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Image from "next/image";

const formatName = (value: string) => {
  return value
    .replace(/[^a-zA-Z\s-']/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/(^|[\s-])([a-z])/g, (_, sep, char) => sep + char.toUpperCase());
};

const isValidEmailFormat = (val: string) => {
  if (!val) return true;
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

export default function RegisterPage() {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ),
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [confirmed, setConfirmed] = useState(false);

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    const nameEdgeRegex = /^[a-zA-Z](.*[a-zA-Z])?$/;

    if (!firstName.trim()) {
      newErrors.firstName = "Please enter first name";
    } else if (!nameEdgeRegex.test(firstName.trim())) {
      newErrors.firstName = "First name must start and end with a letter";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Please enter last name";
    } else if (!nameEdgeRegex.test(lastName.trim())) {
      newErrors.lastName = "Last name must start and end with a letter";
    }

    if (!email.trim() || !isValidEmailFormat(email)) {
      newErrors.email = "Please enter valid email address";
    }

    if (!password) {
      newErrors.password = "Please enter valid password";
    } else {
      if (password.length < 8) newErrors.password = "Password must be at least 8 characters long";
      else if (!/[A-Z]/.test(password)) newErrors.password = "Include at least one uppercase letter";
      else if (!/[a-z]/.test(password)) newErrors.password = "Include at least one lowercase letter";
      else if (!/[0-9]/.test(password)) newErrors.password = "Include at least one number";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
    }, 500);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setTimeout(() => {
      setConfirmed(true);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-between bg-transparent p-4">
      <div className="flex justify-center w-full">
        <Image
          src="https://zdahzxsipjtwxbraslvb.supabase.co/storage/v1/object/public/JFK%20Assets/logo/jfk_logo.png"
          alt="JFK Logo"
          width={45}
          height={45}
          className="opacity-90 mb-10"
        />
      </div>

      <div className="w-[250px] md:w-[400px] overflow-x-hidden">
        {/* Register Form */}
        {!otpSent && !confirmed && (
          <>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Create Account
              </h2>
              <p className="text-sm text-gray-500 mt-2 mb-10">
                Register to access the JFK admin portal
              </p>
            </div>
            
            <form onSubmit={handleRegister} noValidate>
              <div className="flex gap-4 mb-4">
                <div className="space-y-1.5 flex-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                    First Name
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Maria"
                      maxLength={50}
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(formatName(e.target.value));
                        if (e.target.value.trim() && errors.firstName) {
                          setErrors((prev) => ({ ...prev, firstName: "" }));
                        }
                      }}
                      className={`h-12 border-gray-200 bg-gray-50 rounded-lg w-full text-sm ${errors.firstName ? 'border-red-400' : ''}`}
                      required
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-xs text-red-500 ml-1">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Dela Cruz"
                      maxLength={50}
                      value={lastName}
                      onChange={(e) => {
                        setLastName(formatName(e.target.value));
                        if (e.target.value.trim() && errors.lastName) {
                          setErrors((prev) => ({ ...prev, lastName: "" }));
                        }
                      }}
                      className={`h-12 border-gray-200 bg-gray-50 rounded-lg w-full text-sm ${errors.lastName ? 'border-red-400' : ''}`}
                      required
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-xs text-red-500 ml-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 mb-4">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                  Email
                </label>
                <div className="relative">
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
                    className={`pl-12 h-12 border-gray-200 bg-gray-50 rounded-lg w-full text-sm ${errors.email ? 'border-red-400' : ''}`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 ml-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1.5 mb-4">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    maxLength={32}
                    value={password}
                    onChange={(e) => {
                      const noSpaceVal = e.target.value.replace(/\s/g, "");
                      setPassword(noSpaceVal);
                      if (noSpaceVal.trim() && errors.password) {
                        setErrors((prev) => ({ ...prev, password: "" }));
                      }
                    }}
                    className={`pl-12 pr-12 h-12 border-gray-200 bg-gray-50 rounded-lg w-full text-sm ${errors.password ? 'border-red-400' : ''}`}
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
                {errors.password && (
                  <p className="text-xs text-red-500 ml-1">{errors.password}</p>
                )}
                <p className="text-[11px] text-gray-400 italic ml-1">
                  Format: Minimum of 8 characters, including at least one uppercase letter, one lowercase letter, and one number.
                </p>
              </div>

              <div className="space-y-1.5 mb-4">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      const noSpaceVal = e.target.value.replace(/\s/g, "");
                      setConfirmPassword(noSpaceVal);
                      if (noSpaceVal.trim() && errors.confirmPassword) {
                        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                      }
                    }}
                    className={`pl-12 pr-12 h-12 border-gray-200 bg-gray-50 rounded-lg w-full text-sm ${errors.confirmPassword ? 'border-red-400' : ''}`}
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
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 ml-1">{errors.confirmPassword}</p>
                )}
              </div>

              {errors.global && (
                <div className="bg-red-50 text-red-600 px-4 py-3 mb-4 rounded-lg text-xs font-medium text-center">
                  {errors.global}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer mt-4 w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition-all"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </>
        )}

        {/* OTP */}
        {otpSent && !confirmed && (
          <>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Verify your email
              </h2>
              <p className="text-sm text-gray-500 mt-2 mb-2">
                We sent a 6-digit code to
              </p>
              <p className="text-sm font-semibold text-gray-800 mb-10">
                {email}
              </p>
            </div>
            <form onSubmit={handleVerifyOtp} noValidate>
              <div className="flex justify-center gap-2 mb-6">
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
                    className="w-8 md:w-10 h-12 text-center text-lg font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                  />
                ))}
              </div>
              {errors.otp && (
                <div className="bg-red-50 text-red-600 px-4 py-3 mb-3 rounded-xl text-xs font-medium text-center">
                  {errors.otp}
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
                  setOtpSent(false);
                  setOtp(["", "", "", "", "", ""]);
                  setErrors({});
                }}
                className="mt-4 w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Wrong details? Go back
              </button>
            </form>
          </>
        )}

        {/* Confirmation */}
        {confirmed && (
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="h-14 w-14 text-red-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Account Created!
            </h2>
            <p className="text-sm text-gray-500">
              Welcome,{" "}
              <span className="font-semibold text-gray-900">
                {firstName} {lastName}
              </span>
              ! Your account has been successfully created.
            </p>
            <Button
              type="button"
              onClick={() => router.push("/admin")}
              className="mt-4 w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition-all"
            >
              Go to Login
            </Button>
          </div>
        )}
      </div>

      <div className="mt-10">
        {!confirmed && (
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="font-semibold text-red-600 hover:text-red-700 transition-colors cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full"
            >
              Sign in here
            </button>
          </p>
        )}
        <p className="text-center text-[11px] text-gray-400 mt-2 tracking-tight">
          &copy; {new Date().getFullYear()} JFK Tile and Stone Builders
        </p>
      </div>
    </div>
  );
}