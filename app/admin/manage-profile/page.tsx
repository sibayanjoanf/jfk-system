"use client";

import React, { useState } from "react";
import {
  CircleUserRound,
  Camera,
  Trash2,
  LogOut,
  Shield,
  Eye,
  EyeOff,
  ChevronRight,
} from "lucide-react";
import HeaderNotifications from "@/components/admin/HeaderNotif";
import HeaderUser from "@/components/admin/HeaderUser";

const formatName = (value: string) => {
  return value
    .replace(/[^a-zA-Z\s-']/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/(^|[\s-])([a-z])/g, (_, sep, char) => sep + char.toUpperCase());
};

const isValidEmailFormat = (val: string) => {
  if (!val) return false;
  if (val.length > 100) return false;
  
  if (!/^[a-zA-Z0-9]/.test(val)) return false;
  
  if (/\.\./.test(val)) return false;

  const parts = val.split("@");
  if (parts.length !== 2) return false;

  const beforeAt = parts[0];
  const afterAt = parts[1];

  if (!beforeAt || !afterAt) return false;

  if (!/^[a-zA-Z0-9_.+-]+$/.test(beforeAt)) return false;
  if (beforeAt.endsWith(".")) return false;
  
  if (!/^[a-zA-Z0-9.-]+$/.test(afterAt)) return false;
  if (afterAt.startsWith(".") || afterAt.endsWith(".")) return false;

  return true;
};

const isNameEdgeValid = (val: string) => /^[a-zA-Z](.*[a-zA-Z])?$/.test(val.trim());

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "danger">(
    "profile",
  );
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const [profileForm, setProfileForm] = useState({
    firstName: "Maverick",
    lastName: "Kim",
    email: "jesusforeverking2009@gmail.com",
    contact: "09123456789",
    role: "Admin",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [emailForm, setEmailForm] = useState({
    newEmail: "",
    confirmEmail: "",
    password: "",
  });

  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [emailErrors, setEmailErrors] = useState<Record<string, string>>({});

  const tabs = [
    { key: "profile", label: "Profile", icon: CircleUserRound },
    { key: "security", label: "Security", icon: Shield },
    { key: "danger", label: "Danger Zone", icon: Trash2 },
  ] as const;

  const getPasswordStrength = (password: string) => {
    if (!password) return { label: "", color: "", width: "0%" };
    if (password.length < 6)
      return { label: "Weak", color: "bg-red-500", width: "25%" };
    if (password.length < 8)
      return { label: "Fair", color: "bg-orange-400", width: "50%" };
    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
      return { label: "Good", color: "bg-yellow-400", width: "75%" };
    return { label: "Strong", color: "bg-green-500", width: "100%" };
  };

  const strength = getPasswordStrength(passwordForm.newPassword);

  const handleSaveProfile = () => {
    const errs: Record<string, string> = {};
    if (!profileForm.firstName.trim()) errs.firstName = "Please enter first name";
    else if (!isNameEdgeValid(profileForm.firstName)) errs.firstName = "First name must start and end with a letter";

    if (!profileForm.lastName.trim()) errs.lastName = "Please enter last name";
    else if (!isNameEdgeValid(profileForm.lastName)) errs.lastName = "Last name must start and end with a letter";

    setProfileErrors(errs);
    if (Object.keys(errs).length === 0) {
      console.log("Profile Saved!", profileForm);
    }
  };

  const handleSavePassword = () => {
    const errs: Record<string, string> = {};
    
    if (!passwordForm.currentPassword) errs.currentPassword = "Please enter valid password";
    
    if (!passwordForm.newPassword) {
      errs.newPassword = "Please enter valid password";
    } else {
      if (passwordForm.newPassword.length < 8) errs.newPassword = "Password must be at least 8 characters long";
      else if (!/[A-Z]/.test(passwordForm.newPassword)) errs.newPassword = "Include at least one uppercase letter";
      else if (!/[a-z]/.test(passwordForm.newPassword)) errs.newPassword = "Include at least one lowercase letter";
      else if (!/[0-9]/.test(passwordForm.newPassword)) errs.newPassword = "Include at least one number";
      else if (passwordForm.newPassword === passwordForm.currentPassword) errs.newPassword = "New password cannot be the same as current password";
    }

    if (!passwordForm.confirmPassword) {
      errs.confirmPassword = "Please confirm your password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errs.confirmPassword = "New passwords do not match";
    }

    setPasswordErrors(errs);
    if (Object.keys(errs).length === 0) {
      console.log("Password Updated!", passwordForm);
    }
  };

  const handleSaveEmail = () => {
    const errs: Record<string, string> = {};

    if (!emailForm.newEmail.trim() || !isValidEmailFormat(emailForm.newEmail)) {
      errs.newEmail = "Please enter valid email address";
    } else if (emailForm.newEmail === profileForm.email) {
      errs.newEmail = "New email cannot be the same as current email";
    }

    if (!emailForm.confirmEmail.trim() || !isValidEmailFormat(emailForm.confirmEmail)) {
      errs.confirmEmail = "Please enter valid email address";
    } else if (emailForm.newEmail !== emailForm.confirmEmail) {
      errs.confirmEmail = "New emails do not match";
    }

    if (!emailForm.password) {
      errs.password = "Please enter valid password";
    }

    setEmailErrors(errs);
    if (Object.keys(errs).length === 0) {
      console.log("Email Updated!", emailForm);
    }
  };

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full gap-4">
        <div className="flex items-center gap-6 flex-1">
          <div className="shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
              Account
            </p>
            <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-1">
          <HeaderNotifications />
          <HeaderUser />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Avatar Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-gray-100/50">
                  <CircleUserRound
                    size={40}
                    className="text-gray-400"
                    strokeWidth={1}
                  />
                </div>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {profileForm.firstName} {profileForm.lastName}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{profileForm.email}</p>
            <span className="mt-2 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
              {profileForm.role}
            </span>
          </div>

          {/* Nav Tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center justify-between w-full px-4 py-3.5 text-sm font-medium transition-all border-b border-gray-50 last:border-0 ${
                    isActive
                      ? tab.key === "danger"
                        ? "bg-red-50 text-red-600"
                        : "bg-red-50 text-red-600"
                      : tab.key === "danger"
                        ? "text-red-500 hover:bg-red-50"
                        : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={15} />
                    {tab.label}
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </button>
              );
            })}

            <button className="flex items-center gap-2.5 w-full px-4 py-3.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all border-t border-gray-100">
              <LogOut size={15} />
              Log out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-base font-semibold text-gray-900">
                  Personal Information
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Update your personal details and contact information.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    type="text"
                    maxLength={50}
                    value={profileForm.firstName}
                    onChange={(e) => {
                      setProfileForm({
                        ...profileForm,
                        firstName: formatName(e.target.value),
                      });
                      if (e.target.value.trim() && profileErrors.firstName) {
                        setProfileErrors(prev => ({ ...prev, firstName: "" }));
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-1 focus:bg-white transition-all ${profileErrors.firstName ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-red-500 focus:border-red-500"}`}
                  />
                  {profileErrors.firstName && <p className="text-xs text-red-500 mt-1">{profileErrors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    maxLength={50}
                    value={profileForm.lastName}
                    onChange={(e) => {
                      setProfileForm({
                        ...profileForm,
                        lastName: formatName(e.target.value),
                      });
                      if (e.target.value.trim() && profileErrors.lastName) {
                        setProfileErrors(prev => ({ ...prev, lastName: "" }));
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-1 focus:bg-white transition-all ${profileErrors.lastName ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-red-500 focus:border-red-500"}`}
                  />
                  {profileErrors.lastName && <p className="text-xs text-red-500 mt-1">{profileErrors.lastName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    disabled
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={profileForm.contact}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        contact: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Role
                  </label>
                  <input
                    type="text"
                    value={profileForm.role}
                    disabled
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
                <button onClick={handleSaveProfile} className="px-5 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Change Password */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      Change Password
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Use a strong password you don&apos;t use elsewhere.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        maxLength={32}
                        value={passwordForm.currentPassword}
                        onChange={(e) => {
                          const noSpace = e.target.value.replace(/\s/g, "");
                          setPasswordForm({ ...passwordForm, currentPassword: noSpace });
                          if (noSpace && passwordErrors.currentPassword) setPasswordErrors(prev => ({ ...prev, currentPassword: "" }));
                        }}
                        placeholder="Enter current password"
                        className={`w-full px-3.5 py-2.5 pr-10 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-1 focus:bg-white transition-all ${passwordErrors.currentPassword ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-red-500 focus:border-red-500"}`}
                      />
                      <button
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && <p className="text-xs text-red-500 mt-1">{passwordErrors.currentPassword}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        maxLength={32}
                        value={passwordForm.newPassword}
                        onChange={(e) => {
                          const noSpace = e.target.value.replace(/\s/g, "");
                          setPasswordForm({ ...passwordForm, newPassword: noSpace });
                          if (noSpace && passwordErrors.newPassword) setPasswordErrors(prev => ({ ...prev, newPassword: "" }));
                        }}
                        placeholder="Enter new password"
                        className={`w-full px-3.5 py-2.5 pr-10 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-1 focus:bg-white transition-all ${passwordErrors.newPassword ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-red-500 focus:border-red-500"}`}
                      />
                      <button
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </button>
                    </div>
                    {passwordErrors.newPassword && <p className="text-xs text-red-500 mt-1">{passwordErrors.newPassword}</p>}
                    <p className="text-[11px] text-gray-400 italic mt-1">
                      Format: Minimum of 8 characters, including at least one uppercase letter, one lowercase letter, and one number.
                    </p>
                    
                    {passwordForm.newPassword && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-400">
                            Password strength
                          </span>
                          <span
                            className={`text-xs font-medium ${
                              strength.label === "Strong"
                                ? "text-green-500"
                                : strength.label === "Good"
                                  ? "text-yellow-500"
                                  : strength.label === "Fair"
                                    ? "text-orange-400"
                                    : "text-red-500"
                            }`}
                          >
                            {strength.label}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                            style={{ width: strength.width }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        maxLength={32}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => {
                          const noSpace = e.target.value.replace(/\s/g, "");
                          setPasswordForm({ ...passwordForm, confirmPassword: noSpace });
                          if (noSpace && passwordErrors.confirmPassword) setPasswordErrors(prev => ({ ...prev, confirmPassword: "" }));
                        }}
                        placeholder="Confirm new password"
                        className={`w-full px-3.5 py-2.5 pr-10 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-1 focus:bg-white transition-all ${passwordErrors.confirmPassword ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-red-500 focus:border-red-500"}`}
                      />
                      <button
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{passwordErrors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
                  <button onClick={handleSavePassword} className="px-5 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                    Update Password
                  </button>
                </div>
              </div>

              {/* Change Email */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      Change Email
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Update the email address associated with your account.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Current Email
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      disabled
                      className="w-full px-3.5 py-2.5 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      New Email
                    </label>
                    <input
                      type="email"
                      maxLength={100}
                      value={emailForm.newEmail}
                      onChange={(e) => {
                        const noSpace = e.target.value.replace(/\s/g, "");
                        setEmailForm({ ...emailForm, newEmail: noSpace });
                        if (noSpace && emailErrors.newEmail) setEmailErrors(prev => ({ ...prev, newEmail: "" }));
                      }}
                      placeholder="Enter new email address"
                      className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-1 focus:bg-white transition-all ${emailErrors.newEmail ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-red-500 focus:border-red-500"}`}
                    />
                    {emailErrors.newEmail && <p className="text-xs text-red-500 mt-1">{emailErrors.newEmail}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Confirm New Email
                    </label>
                    <input
                      type="email"
                      maxLength={100}
                      value={emailForm.confirmEmail}
                      onChange={(e) => {
                        const noSpace = e.target.value.replace(/\s/g, "");
                        setEmailForm({ ...emailForm, confirmEmail: noSpace });
                        if (noSpace && emailErrors.confirmEmail) setEmailErrors(prev => ({ ...prev, confirmEmail: "" }));
                      }}
                      placeholder="Confirm new email address"
                      className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-1 focus:bg-white transition-all ${emailErrors.confirmEmail ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-red-500 focus:border-red-500"}`}
                    />
                    {emailErrors.confirmEmail && <p className="text-xs text-red-500 mt-1">{emailErrors.confirmEmail}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      maxLength={32}
                      value={emailForm.password}
                      onChange={(e) => {
                        const noSpace = e.target.value.replace(/\s/g, "");
                        setEmailForm({ ...emailForm, password: noSpace });
                        if (noSpace && emailErrors.password) setEmailErrors(prev => ({ ...prev, password: "" }));
                      }}
                      placeholder="Enter your password to confirm"
                      className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-1 focus:bg-white transition-all ${emailErrors.password ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-red-500 focus:border-red-500"}`}
                    />
                    {emailErrors.password && <p className="text-xs text-red-500 mt-1">{emailErrors.password}</p>}
                  </div>
                </div>

                <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
                  <button onClick={handleSaveEmail} className="px-5 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                    Update Email
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Danger Zone Tab */}
          {activeTab === "danger" && (
            <div className="space-y-6">
              {/* Delete Account */}
              <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Trash2 size={15} className="text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">
                      Delete Account
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                      Permanently delete your account and all associated data.
                      This action is irreversible and cannot be undone. All your
                      data will be permanently removed from our servers.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-red-50 rounded-lg border border-red-100 mb-5">
                  <p className="text-xs text-red-600 font-medium">
                    ⚠ Warning: This will permanently delete all your data,
                    orders, and account information.
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Type <span className="font-bold text-red-600">DELETE</span>{" "}
                    to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    placeholder="Type DELETE to confirm"
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
                  />
                </div>

                <button
                  disabled={deleteConfirm !== "DELETE"}
                  className={`flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    deleteConfirm === "DELETE"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Trash2 size={14} />
                  Delete My Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;