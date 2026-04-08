"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, Mail } from "lucide-react";
import Image from "next/image";

export default function AdminLoginPage() {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ),
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.push("/admin/dashboard");
      } else {
        setCheckingAuth(false);
      }
    };
    checkUser();
  }, [router, supabase]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Unauthorized access. Please check your credentials.");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-transparent px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4">
            <Image
              src="https://zdahzxsipjtwxbraslvb.supabase.co/storage/v1/object/public/JFK%20Assets/logo/jfk_logo.png"
              alt="JFK Logo"
              width={50}
              height={50}
              style={{ height: "auto", width: "auto" }}
              className="mx-auto mb-4"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Admin Portal
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to manage JFK Tile and Stone Builders
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
              Email
            </label>
            <div className="relative">
              <Input
                type="email"
                placeholder="admin@jfkbuilders.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-12 h-14 border-gray-100 bg-gray-50 rounded-xl"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
              Password
            </label>
            <div className="relative">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-12 h-14 border-gray-100 bg-gray-50 rounded-xl"
                required
              />
            </div>
          </div>
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-xs font-medium text-center">
              {error}
            </div>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Access Dashboard"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
