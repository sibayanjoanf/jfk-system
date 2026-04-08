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
                    value={profileForm.firstName}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profileForm.lastName}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
                  />
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
                <button className="px-5 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
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
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          })
                        }
                        placeholder="Enter current password"
                        className="w-full px-3.5 py-2.5 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
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
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="Enter new password"
                        className="w-full px-3.5 py-2.5 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
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
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Confirm new password"
                        className={`w-full px-3.5 py-2.5 pr-10 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-1 focus:bg-white transition-all ${
                          passwordForm.confirmPassword &&
                          passwordForm.newPassword !==
                            passwordForm.confirmPassword
                            ? "border-red-300 focus:ring-red-400 focus:border-red-400"
                            : "border-gray-200 focus:ring-red-500 focus:border-red-500"
                        }`}
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
                    {passwordForm.confirmPassword &&
                      passwordForm.newPassword !==
                        passwordForm.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">
                          Passwords do not match.
                        </p>
                      )}
                  </div>
                </div>

                <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
                  <button className="px-5 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
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
                      value={emailForm.newEmail}
                      onChange={(e) =>
                        setEmailForm({ ...emailForm, newEmail: e.target.value })
                      }
                      placeholder="Enter new email address"
                      className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Confirm New Email
                    </label>
                    <input
                      type="email"
                      value={emailForm.confirmEmail}
                      onChange={(e) =>
                        setEmailForm({
                          ...emailForm,
                          confirmEmail: e.target.value,
                        })
                      }
                      placeholder="Confirm new email address"
                      className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-1 focus:bg-white transition-all ${
                        emailForm.confirmEmail &&
                        emailForm.newEmail !== emailForm.confirmEmail
                          ? "border-red-300 focus:ring-red-400 focus:border-red-400"
                          : "border-gray-200 focus:ring-red-500 focus:border-red-500"
                      }`}
                    />
                    {emailForm.confirmEmail &&
                      emailForm.newEmail !== emailForm.confirmEmail && (
                        <p className="text-xs text-red-500 mt-1">
                          Emails do not match.
                        </p>
                      )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={emailForm.password}
                      onChange={(e) =>
                        setEmailForm({ ...emailForm, password: e.target.value })
                      }
                      placeholder="Enter your password to confirm"
                      className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
                  <button className="px-5 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
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
