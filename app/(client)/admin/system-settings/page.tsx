'use client';

import React, { useState } from 'react';
import { Bell, CircleUserRound, Pencil } from 'lucide-react';

interface NotificationRowProps {
  title: string;
  desc: string;
  push: boolean;
  email: boolean;
  onTogglePush: () => void;
  onToggleEmail: () => void;
}

const SystemSetting: React.FC = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    inquiriesPush: true,
    inquiriesEmail: false,
    reportPush: true,
    reportEmail: false,
    remindersPush: true,
    remindersEmail: false,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full">
        <div className="flex items-center flex-1">
          <div className="w-full shrink-0">
            <h1 className="text-xl font-semibold text-[#0f172a]">System Setting</h1>
          </div>
          <div className="flex-1 max-w-xl"></div>
        </div>

        <div className="flex items-center gap-2 ml-8">
          <button 
            onClick={() => setActiveButton(activeButton === 'bell' ? null : 'bell')}
            className={`p-1.5 rounded-full transition-all overflow-hidden ${
              activeButton === 'bell' 
                ? 'bg-[#DF2025] text-white' 
                : 'text-[#050F24] hover:bg-gray-200'
            }`}
          >
            <Bell size={24} />
          </button>

          <button 
            onClick={() => setActiveButton(activeButton === 'user' ? null : 'user')}
            className={`p-1.5 rounded-full transition-all overflow-hidden ${
              activeButton === 'user' 
                ? 'bg-[#DF2025] text-white' 
                : 'text-[#050F24] hover:bg-gray-200'
            }`}
          >
            <CircleUserRound size={27} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 flex flex-col lg:flex-row gap-16">
        
        {/* Left Column: Notifications */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-1">Notification Setting</h2>
          <p className="text-sm text-gray-400 mb-10 leading-relaxed max-w-md">
            Important updates about orders or account may still be sent to you, even with notifications disabled.
          </p>

          <div className="space-y-12">
            <NotificationRow 
              title="Inquiries" 
              desc="These are notifications for customer inquiries submitted through your website."
              push={settings.inquiriesPush}
              email={settings.inquiriesEmail}
              onTogglePush={() => toggleSetting('inquiriesPush')}
              onToggleEmail={() => toggleSetting('inquiriesEmail')}
            />
            <NotificationRow 
              title="Report" 
              desc="These are notifications for when new inventory reports are generated or stock updates are available."
              push={settings.reportPush}
              email={settings.reportEmail}
              onTogglePush={() => toggleSetting('reportPush')}
              onToggleEmail={() => toggleSetting('reportEmail')}
            />
            <NotificationRow 
              title="Reminders" 
              desc="Stay updated with notifications about pending orders and recent activity in your system."
              push={settings.remindersPush}
              email={settings.remindersEmail}
              onTogglePush={() => toggleSetting('remindersPush')}
              onToggleEmail={() => toggleSetting('remindersEmail')}
            />
          </div>
        </div>

        {/* Right Column: Company Info */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-1">Company Information</h2>
          <p className="text-sm text-gray-400 mb-8 leading-relaxed">
            Update your company details below, including logo, business name, and other essential information.
          </p>

          {/* Profile Section */}
          <div className="border border-gray-200 rounded-2xl p-6 flex items-center gap-5 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-100">
                <img 
                  src="/logo.png" 
                  alt="Company Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute -top-1 -left-1 bg-[#050F24] text-white p-1.5 rounded-full border-2 border-white hover:bg-[#DF2025]">
                <Pencil size={10} />
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-[#0F172A]">JFK Tile and Stone Builders</h3>
              <p className="text-xs text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="border border-gray-200 rounded-2xl p-8 bg-gray-50/30">
            <h3 className="text-base font-semibold text-[#0F172A] mb-6">Basic Information</h3>
            <div className="space-y-5">
              <InputField label="Name" placeholder="Business Name" />
              <InputField label="Address" placeholder="Business Address" />
              <InputField label="Contact" placeholder="Business Contact" />
            </div>
            <div className="mt-8 flex justify-end">
              <button className="bg-[#DF2025] hover:bg-red-700 text-white px-12 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm active:scale-95">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const NotificationRow = ({ title, desc, push, email, onTogglePush, onToggleEmail }: NotificationRowProps) => (
  <div className="flex justify-between items-start">
    <div className="max-w-[280px]">
      <h4 className="font-semibold text-[#0F172A] mb-1">{title}</h4>
      <p className="text-xs text-gray-400 leading-normal">{desc}</p>
    </div>
    <div className="flex flex-col gap-3 min-w-[100px]">
      <Toggle label="Push" enabled={push} onClick={onTogglePush} />
      <Toggle label="Email" enabled={email} onClick={onToggleEmail} />
    </div>
  </div>
);

const Toggle = ({ label, enabled, onClick }: { label: string, enabled: boolean, onClick: () => void }) => (
  <div className="flex items-center gap-3 cursor-pointer group" onClick={onClick}>
    <div className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors duration-200 ${enabled ? 'bg-[#DF2025]' : 'bg-gray-300'}`}>
      <div className={`bg-white w-3 h-3 rounded-full shadow-sm transform transition-transform duration-200 ${enabled ? 'translate-x-4' : 'translate-x-0'}`} />
    </div>
    <span className="text-sm text-gray-400 group-hover:text-gray-600 transition-colors font-medium">
      {label}
    </span>
  </div>
);

const InputField = ({ label, placeholder }: { label: string, placeholder: string }) => (
  <div className="space-y-2">
    <label className="text-xs font-medium text-gray-400 ml-1">{label}</label>
    <input 
      type="text" 
      placeholder={placeholder}
      className="w-full bg-[#F3F4F6] border border-transparent rounded-full py-3 px-6 text-sm text-[#0F172A] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#DF2025] transition-all"
    />
  </div>
);

export default SystemSetting;