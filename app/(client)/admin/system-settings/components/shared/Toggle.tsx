import React from "react";

interface ToggleProps {
  label?: string;
  enabled: boolean;
  onClick: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ label, enabled, onClick }) => (
  <div
    className="flex items-center gap-3 cursor-pointer group"
    onClick={onClick}
  >
    <div
      className={`w-9 h-5 flex items-center rounded-full px-0.5 transition-colors duration-200 ${
        enabled ? "bg-red-600" : "bg-gray-200"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${
          enabled ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </div>
    {label && (
      <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors font-medium">
        {label}
      </span>
    )}
  </div>
);

export default Toggle;
