"use client";

import { useRouter } from "next/navigation";
import {
  Bell,
  Package,
  ShoppingCart,
  MessageSquare,
  AlertTriangle,
  XCircle,
  X,
  CheckCheck,
} from "lucide-react";

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

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function NotifIcon({ type }: { type: NotificationType }) {
  const base = "w-8 h-8 rounded-full flex items-center justify-center shrink-0";
  if (type === "new_order")
    return (
      <div className={`${base} bg-blue-50`}>
        <ShoppingCart size={14} className="text-blue-500" />
      </div>
    );
  if (type === "order_status")
    return (
      <div className={`${base} bg-purple-50`}>
        <ShoppingCart size={14} className="text-purple-500" />
      </div>
    );
  if (type === "new_inquiry")
    return (
      <div className={`${base} bg-green-50`}>
        <MessageSquare size={14} className="text-green-500" />
      </div>
    );
  if (type === "low_stock")
    return (
      <div className={`${base} bg-amber-50`}>
        <AlertTriangle size={14} className="text-amber-500" />
      </div>
    );
  if (type === "out_of_stock")
    return (
      <div className={`${base} bg-red-50`}>
        <XCircle size={14} className="text-red-500" />
      </div>
    );
  return (
    <div className={`${base} bg-gray-50`}>
      <Package size={14} className="text-gray-500" />
    </div>
  );
}

function getRoute(type: NotificationType): string {
  switch (type) {
    case "new_order":
    case "order_status":
      return "/admin/order-management";
    case "new_inquiry":
      return "/admin/inquiry-management";
    case "low_stock":
    case "out_of_stock":
      return "/admin/inventory-management";
    default:
      return "/admin";
  }
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const router = useRouter();
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleNotifClick = (notif: Notification) => {
    onMarkAsRead(notif.id);
    onClose();
    router.push(getRoute(notif.type));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">
              All Notifications
            </p>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-semibold rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-600 transition-colors"
              >
                <CheckCheck size={12} />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
              <Bell size={24} strokeWidth={1.5} />
              <p className="text-xs">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotifClick(notif)}
                className={`flex items-start gap-3 px-5 py-4 hover:bg-gray-100 cursor-pointer transition-colors ${
                  !notif.is_read ? "bg-red-50/40" : ""
                }`}
              >
                <NotifIcon type={notif.type} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-gray-900 leading-snug">
                      {notif.title}
                    </p>
                    {!notif.is_read && (
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                    {notif.message}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {timeAgo(notif.created_at)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 shrink-0">
          <p className="text-[11px] text-gray-400 text-center">
            {notifications.length} total notification
            {notifications.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </>
  );
};

export default NotificationsDrawer;
