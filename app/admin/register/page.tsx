"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, Mail, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function RegisterPage() {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ),
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      setSuccess(true);
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

        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 mt-2 mb-10">
            Register as an administrator for JFK Builders
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 text-green-700 p-6 rounded-xl text-center">
            <p className="font-semibold">Registration Successful!</p>
            <p className="text-sm mt-2">
              Please check your email to verify your account before logging in.
            </p>
            <Button
              onClick={() => router.push("/admin")}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
            >
              Go to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="space-y-1.5 mb-5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                Admin Email
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  type="email"
                  placeholder="name@jfkbuilders.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 border-gray-200 bg-gray-50 rounded-lg w-full text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                Set Password
              </label>
              <div className="mt-1 mb-5 relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 border-gray-200 bg-gray-50 rounded-lg w-full text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
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
              className="cursor-pointer mt-2 w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition-all"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Register Account"
              )}
            </Button>
          </form>
        )}
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/admin")}
            className="font-semibold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
