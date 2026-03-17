"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";

const HeaderNotifications: React.FC = () => {
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
        <Bell size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">Notifications</p>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              {
                title: "New inquiry received",
                time: "2 min ago",
                unread: true,
              },
              {
                title: "Order #1023 updated",
                time: "1 hour ago",
                unread: true,
              },
              {
                title: "Low stock alert: EL-00550",
                time: "3 hours ago",
                unread: false,
              },
            ].map((notif, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${notif.unread ? "bg-red-50/40" : ""}`}
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.unread ? "bg-red-500" : "bg-gray-200"}`}
                />
                <div>
                  <p className="text-xs font-medium text-gray-900">
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{notif.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-gray-100">
            <button className="text-xs text-red-600 hover:underline font-medium">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderNotifications;
