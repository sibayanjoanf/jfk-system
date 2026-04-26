import React from "react";
import { ChevronDown, LayoutGrid, Building2 } from "lucide-react";
import { MainTab } from "../types";

interface SettingsSidebarProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
}

const tabs = [
  { key: "categories" as MainTab, label: "Categories", icon: LayoutGrid },
  { key: "company" as MainTab, label: "Company", icon: Building2 },
];

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeTab,
  onTabChange,
}) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    {tabs.map((tab) => {
      const Icon = tab.icon;
      const isActive = activeTab === tab.key;
      return (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex items-center justify-between w-full px-4 py-3.5 text-sm font-medium transition-all border-b border-gray-50 last:border-0 ${
            isActive
              ? "bg-red-50 text-red-600"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Icon size={15} />
            {tab.label}
          </div>
          <ChevronDown
            size={14}
            className={`text-gray-300 transition-transform ${
              isActive ? "-rotate-90" : ""
            }`}
          />
        </button>
      );
    })}
  </div>
);

export default SettingsSidebar;
