"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NotificationsDrawer from "@/components/admin/NotificationsDrawer";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type NotificationType =
  | "new_order"
  | "order_status"
  | "new_inquiry"
  | "low_stock"
  | "out_of_stock";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const HeaderNotifications: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setNotifications(data);
      });

    const channel = supabase
      .channel(`realtime:notifications-${Date.now()}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        },
      )
      .subscribe();

    const interval = setInterval(() => {
      supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50)
        .then(({ data }) => {
          if (data) setNotifications(data);
        });
    }, 1000);

    return () => {
      channel.unsubscribe();
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (!unreadIds.length) return;
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className={`relative p-2 rounded-lg transition-all ${
                isDrawerOpen
                  ? "bg-red-600 text-white"
                  : "text-gray-900 hover:bg-gray-200"
              }`}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute bottom-4 left-4 w-4 h-4 bg-red-600 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            sideOffset={5}
            className="text-[10px] py-1 px-2 bg-red-600"
          >
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <NotificationsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        notifications={notifications}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
      />
    </>
  );
};

export default HeaderNotifications;
