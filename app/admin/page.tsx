"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react";
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

export default function AdminLoginPage() {
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
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [error, setError] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("status")
          .eq("id", user.id)
          .single();

        if (profile?.status === "active") {
          router.push("/admin/dashboard");
        } else {
          await supabase.auth.signOut();
          setCheckingAuth(false);
        }
      } else {
        setCheckingAuth(false);
      }
    };
    checkUser();
  }, [router, supabase]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!email.trim() || !isValidEmailFormat(email)) {
      newErrors.email = "Please enter valid email address";
    }

    if (!password) {
      newErrors.password = "Please enter valid password";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setError("");

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      setError("Unauthorized access. Please check your credentials.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("status, role")
      .eq("id", authData.user.id)
      .single();

    console.log("auth user id:", authData.user.id);
    console.log("profile:", profile);
    console.log("profile error:", profileError);

    if (!profile) {
      await supabase.auth.signOut();
      setError("Account not found. Please contact your administrator.");
      setLoading(false);
      return;
    }

    if (profile.status === "pending") {
      await supabase.auth.signOut();
      setError(
        "Your account is pending approval. Please wait for an administrator to approve your account.",
      );
      setLoading(false);
      return;
    }

    if (profile.status === "inactive") {
      await supabase.auth.signOut();
      setError(
        "Your account has been deactivated. Please contact your administrator.",
      );
      setLoading(false);
      return;
    }

    if (profile.status === "archived") {
      await supabase.auth.signOut();
      setError(
        "Your account no longer exists. Please contact your administrator.",
      );
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

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
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Staff Portal
          </h2>
          <p className="text-sm text-gray-500 mt-2 mb-10">
            Sign in to manage JFK Tile and Stone Builders
          </p>
        </div>
        <form onSubmit={handleLogin} noValidate>
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
              <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                className="text-[11px] font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full"
                onClick={() => router.push("/admin/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>
            <div className="mt-1 relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                maxLength={32}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value && errors.password) {
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }
                }}
                className={`pl-12 pr-12 h-12 border-gray-200 bg-gray-50 rounded-lg w-full text-sm ${errors.password ? "border-red-400" : ""}`}
                required
              />
              {/* Eye Toggle Button */}
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
              <p className="text-xs text-red-500 mt-1 ml-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Main Auth Error (Untouched) */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 mt-5 mb-1 rounded-xl text-xs font-medium text-center">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="cursor-pointer mt-5 w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition-all"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Access Dashboard"
            )}
          </Button>
        </form>
      </div>

      <div className="mt-10">
        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/admin/register")}
            className="font-semibold text-red-600 hover:text-red-700 transition-colors cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full"
          >
            Register here
          </button>
        </p>
        <p className="text-center text-[11px] text-gray-400 mt-2 tracking-tight">
          &copy; {new Date().getFullYear()} JFK Tile and Stone Builders
        </p>
      </div>
    </div>
  );
}
