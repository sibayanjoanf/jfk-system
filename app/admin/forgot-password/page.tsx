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
  const [sent, setSent] = useState(false);

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
      setError("Something went wrong. Please try again.");
      setLoading(false);
    } else {
      setSent(true);
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

      <div className="w-[250px] md:w-[400px] overflow-x-hidden">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Forgot Password
          </h2>
          <p className="text-sm text-gray-500 mt-2 mb-10">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="h-12 w-12 text-red-600" />
            <p className="text-sm text-gray-600">
              Reset link sent! Check your inbox at{" "}
              <span className="font-semibold text-gray-900">{email}</span>.
            </p>
            <Button
              onClick={() => router.push("/admin")}
              className="mt-4 w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition-all"
            >
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleReset}>
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
                "Send Reset Link"
              )}
            </Button>
          </form>
        )}
      </div>

      <div className="mt-10">
        <p className="text-center text-sm text-gray-500">
          Remember your password?{" "}
          <button
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
