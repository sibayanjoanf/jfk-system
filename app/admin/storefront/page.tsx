"use client";

import { HelpCircle, Images, Megaphone } from "lucide-react";
import { StorefrontTab } from "./types";
import { useState } from "react";
import AnnouncementsTabs from "./components/AnnouncementsTab";
import HeaderNotifications from "@/components/admin/HeaderNotif";
import HeaderUser from "@/components/admin/HeaderUser";
import ShowcaseTab from "./components/ShowcaseTab";
import FaqTab from "./components/FaqTab";

const storefrontTabs = [
  {
    key: "announcements" as StorefrontTab,
    label: "Announcements",
    icon: Megaphone,
  },
  {
    key: "showcase" as StorefrontTab,
    label: "Showcase",
    icon: Images,
  },
  {
    key: "faq" as StorefrontTab,
    label: "FAQ",
    icon: HelpCircle,
  },
];

const StorefrontPanel: React.FC = () => {
  const [activeStorefrontTab, setActiveStorefrontTab] =
    useState<StorefrontTab>("announcements");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8 w-full gap-4">
        <div className="shrink-0">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
            Manage
          </p>
          <h1 className="text-lg font-semibold text-gray-900">Storefront</h1>
        </div>
        <div className="hidden lg:flex items-center gap-1">
          <HeaderNotifications />
          <HeaderUser />
        </div>
      </div>

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

      {activeStorefrontTab === "announcements" && <AnnouncementsTabs />}
      {activeStorefrontTab === "showcase" && <ShowcaseTab />}
      {activeStorefrontTab === "faq" && <FaqTab />}
    </div>
  );
};

export default StorefrontPanel;
