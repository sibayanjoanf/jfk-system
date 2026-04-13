"use client";

import { useState, useRef, useEffect } from "react";
import {
  CircleUserRound,
  User,
  Settings,
  LogOut,
  Laptop,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const HeaderUser: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("Error logging out:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-all ${isOpen ? "bg-red-600 text-white" : "text-gray-900 hover:bg-gray-200"}`}
            >
              <CircleUserRound size={18} strokeWidth={1.75} />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            sideOffset={5}
            className="text-[10px] py-1 px-2 bg-red-600 text-white border-none"
          >
            <p>User Menu</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">Maverick Kim</p>
            <p className="text-xs text-gray-400 truncate">
              jesusforeverking2009@gmail.com
            </p>
          </div>

          <Link href="/admin/manage-profile">
            <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              <User size={15} className="text-gray-400" />
              Profile
            </button>
          </Link>

          <Link href="/admin/system-settings">
            <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              <Settings size={15} className="text-gray-400" />
              Settings
            </button>
          </Link>

          <Link href="/">
            <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              <Laptop size={15} className="text-gray-400" />
              Visit Site
            </button>
          </Link>

          <div className="border-t border-gray-100">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm rounded-b-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {isLoggingOut ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <LogOut size={15} />
              )}
              {isLoggingOut ? "Logging out..." : "Log out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderUser;
