import React from "react";
import Toggle from "./Toggle";

interface NotificationRowProps {
  title: string;
  desc: string;
  push: boolean;
  email: boolean;
  onTogglePush: () => void;
  onToggleEmail: () => void;
}

const NotificationRow: React.FC<NotificationRowProps> = ({
  title,
  desc,
  push,
  email,
  onTogglePush,
  onToggleEmail,
}) => (
  <div className="flex justify-between items-start gap-4 pb-8 border-b border-gray-100 last:border-0 last:pb-0">
    <div className="max-w-sm">
      <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
    </div>
    <div className="flex flex-col gap-3 shrink-0">
      <Toggle label="Push" enabled={push} onClick={onTogglePush} />
      <Toggle label="Email" enabled={email} onClick={onToggleEmail} />
    </div>
  </div>
);

export default NotificationRow;
