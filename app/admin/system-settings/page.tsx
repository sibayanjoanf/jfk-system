"use client";

import React, { useState } from "react";
import HeaderUser from "@/components/admin/HeaderUser";
import HeaderNotifications from "@/components/admin/HeaderNotif";

import { MainTab } from "./types";
import SettingsSidebar from "./components/SettingSidebar";
import CategoriesPanel from "./components/categories/CategoriesPanel";
import NotificationsPanel from "./components/notifications/NotificationsPanel";
import CompanyPanel from "./components/company/CompanyPanel";

const SystemSetting: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTab>("categories");

  return (
    <div className="p-0">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8 w-full gap-4">
        <div className="shrink-0">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
            Admin
          </p>
          <h1 className="text-lg font-semibold text-gray-900">
            System Settings
          </h1>
        </div>
        <div className="hidden lg:flex items-center gap-1">
          <HeaderNotifications />
          <HeaderUser />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar */}
        <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === "categories" && <CategoriesPanel />}
          {activeTab === "notifications" && <NotificationsPanel />}
          {activeTab === "company" && <CompanyPanel />}
        </div>
      </div>
    </div>
  );
};

export default SystemSetting;
