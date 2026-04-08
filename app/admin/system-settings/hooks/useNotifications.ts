import { useState } from "react";
import { NotificationSettings } from "../types";

export const useNotifications = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    inquiriesPush: true,
    inquiriesEmail: false,
    reportPush: true,
    reportEmail: false,
    remindersPush: true,
    remindersEmail: false,
  });

  const toggleSetting = (key: keyof NotificationSettings) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return { settings, toggleSetting };
};