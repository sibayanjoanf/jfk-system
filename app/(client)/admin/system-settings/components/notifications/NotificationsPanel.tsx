import React from "react";
import { useNotifications } from "../../hooks/useNotifications";
import NotificationRow from "../shared/NotificationRow";

const NotificationsPanel: React.FC = () => {
  const { settings, toggleSetting } = useNotifications();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-1">
        Notification Settings
      </h2>
      <p className="text-xs text-gray-400 mb-8 leading-relaxed">
        Important updates about orders or account may still be sent to you, even
        with notifications disabled.
      </p>
      <div className="space-y-8 border-t border-gray-100 pt-8">
        <NotificationRow
          title="Inquiries"
          desc="Notifications for customer inquiries submitted through your website."
          push={settings.inquiriesPush}
          email={settings.inquiriesEmail}
          onTogglePush={() => toggleSetting("inquiriesPush")}
          onToggleEmail={() => toggleSetting("inquiriesEmail")}
        />
        <NotificationRow
          title="Reports"
          desc="Notifications for when stocks are updated."
          push={settings.reportPush}
          email={settings.reportEmail}
          onTogglePush={() => toggleSetting("reportPush")}
          onToggleEmail={() => toggleSetting("reportEmail")}
        />
        <NotificationRow
          title="Reminders"
          desc="Notifications about pending orders and recent activity in your system."
          push={settings.remindersPush}
          email={settings.remindersEmail}
          onTogglePush={() => toggleSetting("remindersPush")}
          onToggleEmail={() => toggleSetting("remindersEmail")}
        />
      </div>
    </div>
  );
};

export default NotificationsPanel;
