"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
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
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      },
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
    } else {
      setSubmitted(true);
      setLoading(false);
    }
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

      <div className="w-[290px] md:w-[400px] overflow-x-hidden">
        <button
          onClick={() => router.push("/admin")}
          className="flex items-center text-xs text-gray-500 hover:text-red-600 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3 w-3 mr-1" /> Back to Login
        </button>

        {submitted ? (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Check your email
            </h2>
            <p className="text-sm text-gray-500 mt-2 mb-8">
              We&apos;ve sent a password reset link to{" "}
              <span className="font-semibold text-gray-700">{email}</span>.
            </p>
            <Button
              onClick={() => router.push("/admin")}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg"
            >
              Return to Login
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Reset Password
              </h2>
              <p className="text-sm text-gray-500 mt-2 mb-10">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p>
            </div>

            <form onSubmit={handleReset}>
              <div className="space-y-1.5 mb-6">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                  Registered Email
                </label>
                <div className="mt-1 relative">
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
                <div className="bg-red-50 text-red-600 px-4 py-3 mb-4 rounded-xl text-xs font-medium text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition-all"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </>
        )}
      </div>

      <div className="mt-10 text-center">
        <p className="text-xs text-gray-400 uppercase tracking-tight">
          &copy; {new Date().getFullYear()} JFK Tile and Stone Builders
        </p>
      </div>
    </div>
  );
}
