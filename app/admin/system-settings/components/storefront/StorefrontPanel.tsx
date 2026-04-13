import React, { useState } from "react";
import { Megaphone, Images, HelpCircle } from "lucide-react";
import { StorefrontTab } from "../../types";
import AnnouncementsTab from "./AnnouncementsTab";
import ShowcaseTab from "./ShowcaseTab";
import FaqTab from "./FaqTab";


const storefrontTabs = [
  {
    key: "announcements" as StorefrontTab,
    label: "Announcements",
    icon: Megaphone,
  },
  { key: "showcase" as StorefrontTab, label: "Showcase", icon: Images },
  { key: "faq" as StorefrontTab, label: "FAQ", icon: HelpCircle },
];


const StorefrontPanel: React.FC = () => {
  const [activeStorefrontTab, setActiveStorefrontTab] =
    useState<StorefrontTab>("announcements");


  return (
    <div className="space-y-6">
      {/* Sub-tab switcher */}
      <div className="flex gap-2 bg-white rounded-xl border border-gray-100 shadow-sm p-1.5 overflow-x-auto scrollbar-none">
        {storefrontTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveStorefrontTab(tab.key)}
              className={`flex items-center gap-2 flex-1 justify-center px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                activeStorefrontTab === tab.key
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Icon size={13} />
              {tab.label}
            </button>
          );
        })}
      </div>


      {activeStorefrontTab === "announcements" && <AnnouncementsTab />}
      {activeStorefrontTab === "showcase" && <ShowcaseTab />}
      {activeStorefrontTab === "faq" && <FaqTab />}
    </div>
  );
};


export default StorefrontPanel;