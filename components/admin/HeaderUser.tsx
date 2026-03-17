"use client";

import { useState, useRef, useEffect } from "react";
import { CircleUserRound, User, Settings, LogOut, Laptop } from "lucide-react";
import Link from "next/link";

const HeaderUser: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-all ${isOpen ? "bg-red-600 text-white" : "text-gray-900 hover:bg-gray-200"}`}
      >
        <CircleUserRound size={18} strokeWidth={1.75} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-auto bg-white border border-gray-100 rounded-xl shadow-2xl py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
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
          <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            <Settings size={15} className="text-gray-400" />
            Settings
          </button>
          <Link href="/">
            <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              <Laptop size={15} className="text-gray-400" />
              Visit Site
            </button>
          </Link>
          <div className="border-t border-gray-100 mt-1">
            <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
              <LogOut size={15} />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderUser;
