"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Shield, CheckCheck } from "lucide-react";
import {
  UserProfile,
  UserRole,
  UserPermissions,
  DEFAULT_PERMISSIONS,
  ROLE_LABELS,
} from "../userTypes";
import ConfirmModal from "../../components/ConfirmModal";

interface UserDrawerProps {
  user: UserProfile | null;
  isOpen: boolean;
  isSuperAdmin: boolean;
  onClose: () => void;
  onApprove: (
    id: string,
    role: UserRole,
    permissions: UserPermissions,
  ) => Promise<{ error: string | null }>;
  onUpdate: (
    id: string,
    updates: Partial<UserProfile>,
  ) => Promise<{ error: string | null }>;
  onArchive: (id: string) => Promise<{ error: string | null }>;
}

const ROLES: UserRole[] = [
  "super_admin",
  "admin",
  "manager",
  "inventory_staff",
  "staff",
];

const MODULE_LABELS: { key: string; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "orders", label: "Orders" },
  { key: "products", label: "Products" },
  { key: "inventory", label: "Inventory" },
  { key: "sales_report", label: "Sales Report" },
  { key: "inquiries", label: "Inquiries" },
  { key: "user_management", label: "User Management" },
  { key: "system_settings", label: "System Settings" },
];

const ORDER_SUB: { key: keyof UserPermissions["orders"]; label: string }[] = [
  { key: "view", label: "View" },
  { key: "create", label: "Create" },
  { key: "change_status", label: "Change Status" },
  { key: "cancel", label: "Cancel" },
  { key: "refund", label: "Refund" },
  { key: "archive", label: "Archive" },
];

const INQUIRY_SUB: {
  key: keyof UserPermissions["inquiries"];
  label: string;
}[] = [
  { key: "view", label: "View" },
  { key: "reply", label: "Reply" },
  { key: "archive", label: "Archive" },
];

function resolveInitialPermissions(user: UserProfile): UserPermissions {
  if (Object.keys(user.permissions ?? {}).length > 0) return user.permissions;
  if (user.role) return DEFAULT_PERMISSIONS[user.role];
  return DEFAULT_PERMISSIONS.staff;
}

const UserDrawerInner: React.FC<
  Omit<UserDrawerProps, "user"> & { user: UserProfile }
> = ({
  user,
  isOpen,
  isSuperAdmin,
  onClose,
  onApprove,
  onUpdate,
  onArchive,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(user.role);
  const [permissions, setPermissions] = useState<UserPermissions>(
    resolveInitialPermissions(user),
  );
  const [saving, setSaving] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    setConfirmModal({
      open: true,
      title: "Change Role",
      description: `Are you sure you want to change the role to ${ROLE_LABELS[role]}?`,
      confirmLabel: "Change Role",
      variant: "restore",
      onConfirm: () => {
        setSelectedRole(role);
        setPermissions(DEFAULT_PERMISSIONS[role]);
        closeConfirm();
      },
    });
  };

  const toggleSimplePermission = (key: keyof UserPermissions) => {
    if (typeof permissions[key] === "boolean") {
      setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const toggleOrderPermission = (key: keyof UserPermissions["orders"]) => {
    setPermissions((prev) => ({
      ...prev,
      orders: { ...prev.orders, [key]: !prev.orders[key] },
    }));
  };

  const toggleInquiryPermission = (key: keyof UserPermissions["inquiries"]) => {
    setPermissions((prev) => ({
      ...prev,
      inquiries: { ...prev.inquiries, [key]: !prev.inquiries[key] },
    }));
  };

  const handleSave = () => {
    setConfirmModal({
      open: true,
      title: isPending ? "Approve User" : "Save Changes",
      description: isPending
        ? "Are you sure you want to approve this user?"
        : "Are you sure you want to save these changes?",
      confirmLabel: isPending ? "Approve" : "Save",
      variant: "restore",
      onConfirm: async () => {
        if (!selectedRole) return;
        setSaving(true);
        setError(null);
        closeConfirm();
        const result = isPending
          ? await onApprove(user.id, selectedRole, permissions)
          : await onUpdate(user.id, { role: selectedRole, permissions });
        setSaving(false);
        if (result.error) setError(result.error);
        else {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        }
      },
    });
  };

  const handleStatusToggle = () => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    setConfirmModal({
      open: true,
      title: newStatus === "inactive" ? "Set Inactive" : "Set Active",
      description:
        newStatus === "inactive"
          ? "This will block the user from logging in."
          : "This will allow the user to log in again.",
      confirmLabel: newStatus === "inactive" ? "Set Inactive" : "Set Active",
      variant: newStatus === "inactive" ? "danger" : "restore",
      onConfirm: async () => {
        setSaving(true);
        closeConfirm();
        const result = await onUpdate(user.id, { status: newStatus });
        setSaving(false);
        if (result.error) setError(result.error);
      },
    });
  };

  const handleArchive = () => {
    setConfirmModal({
      open: true,
      title: "Archive User",
      description:
        "This will archive the user. They will no longer have access.",
      confirmLabel: "Archive",
      variant: "archive",
      onConfirm: async () => {
        setArchiving(true);
        closeConfirm();
        await onArchive(user.id);
        setArchiving(false);
        onClose();
      },
    });
  };

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    variant: "archive" | "restore" | "danger";
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    confirmLabel: "Confirm",
    variant: "restore",
    onConfirm: () => {},
  });

  const closeConfirm = () =>
    setConfirmModal((prev) => ({ ...prev, open: false }));

  const isPending = user.status === "pending";
  const isReadOnly = !isSuperAdmin;

  return (
    <>
      {/* Body */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
        {/* User Info */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-red-600">
              {(user.full_name ?? user.email)?.[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {user.full_name ?? "—"}
            </p>
            <p className="text-xs text-gray-400">{user.email}</p>
            {user.contact && (
              <p className="text-xs text-gray-400">{user.contact}</p>
            )}
            <p className="text-[11px] text-gray-400/60 mt-0.5">
              Registered{" "}
              {new Date(user.created_at).toLocaleDateString("en-PH", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Role Assignment */}
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-2">
            {isPending ? "Assign Role" : "Role"}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((role) => (
              <button
                key={role}
                disabled={isReadOnly}
                onClick={() => handleRoleChange(role)}
                className={`px-3 py-2 text-xs rounded-lg border font-medium transition-colors text-left ${
                  selectedRole === role
                    ? "bg-red-600 text-white border-red-600"
                    : "border-gray-200 text-gray-600 hover:bg-gray-100"
                } ${isReadOnly ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {ROLE_LABELS[role]}
              </button>
            ))}
          </div>
        </div>

        {/* Permissions */}
        {selectedRole && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-700">Permissions</p>
              {!isReadOnly && (
                <button
                  onClick={() =>
                    selectedRole &&
                    setPermissions(DEFAULT_PERMISSIONS[selectedRole])
                  }
                  className="text-[11px] text-red-600 hover:underline"
                >
                  Reset to defaults
                </button>
              )}
            </div>

            <div className="space-y-2">
              {MODULE_LABELS.map(({ key, label }) => {
                if (key === "orders") {
                  return (
                    <div
                      key={key}
                      className="rounded-xl border border-gray-100 overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50">
                        <span className="text-xs font-medium text-gray-700">
                          {label}
                        </span>
                      </div>
                      <div className="px-3 py-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
                        {ORDER_SUB.map(({ key: subKey, label: subLabel }) => (
                          <label
                            key={subKey}
                            className={`flex items-center gap-2 ${isReadOnly ? "cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            <input
                              type="checkbox"
                              checked={permissions.orders[subKey]}
                              disabled={isReadOnly}
                              onChange={() => toggleOrderPermission(subKey)}
                              className="w-3.5 h-3.5 accent-red-600"
                            />
                            <span className="text-xs text-gray-600">
                              {subLabel}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (key === "inquiries") {
                  return (
                    <div
                      key={key}
                      className="rounded-xl border border-gray-100 overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-3 py-2.5 bg-gray-50">
                        <span className="text-xs font-medium text-gray-700">
                          {label}
                        </span>
                      </div>
                      <div className="px-3 py-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
                        {INQUIRY_SUB.map(({ key: subKey, label: subLabel }) => (
                          <label
                            key={subKey}
                            className={`flex items-center gap-2 ${isReadOnly ? "cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            <input
                              type="checkbox"
                              checked={permissions.inquiries[subKey]}
                              disabled={isReadOnly}
                              onChange={() => toggleInquiryPermission(subKey)}
                              className="w-3.5 h-3.5 accent-red-600"
                            />
                            <span className="text-xs text-gray-600">
                              {subLabel}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <label
                    key={key}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-100 ${isReadOnly ? "cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"} transition-colors`}
                  >
                    <span className="text-xs font-medium text-gray-700">
                      {label}
                    </span>
                    <input
                      type="checkbox"
                      checked={
                        permissions[key as keyof UserPermissions] as boolean
                      }
                      disabled={isReadOnly}
                      onChange={() =>
                        toggleSimplePermission(key as keyof UserPermissions)
                      }
                      className="w-3.5 h-3.5 accent-red-600"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Status Toggle */}
        {!isPending && user.status !== "archived" && isSuperAdmin && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-700">
                  Account Status
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {user.status === "active"
                    ? "User can log in and access the system."
                    : "User is blocked from logging in."}
                </p>
              </div>
              <button
                onClick={handleStatusToggle}
                disabled={saving}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  user.status === "active"
                    ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    : "bg-green-600/10 text-green-600 hover:bg-green-600/20"
                }`}
              >
                {user.status === "active" ? "Set Inactive" : "Set Active"}
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        {success && (
          <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
            <CheckCheck size={13} />
            {isPending
              ? "User approved successfully!"
              : "Changes saved successfully!"}
          </div>
        )}
      </div>

      {/* Footer */}
      {isSuperAdmin && user.status !== "archived" && (
        <div className="px-5 py-4 border-t border-gray-100 shrink-0 space-y-2">
          <button
            onClick={handleSave}
            disabled={saving || !selectedRole}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : null}
            {isPending ? "Approve & Activate" : "Save Changes"}
          </button>

          {!isPending && (
            <button
              onClick={handleArchive}
              disabled={archiving}
              className="w-full px-4 py-2.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {archiving ? "Archiving..." : "Archive User"}
            </button>
          )}

          <ConfirmModal
            open={confirmModal.open}
            title={confirmModal.title}
            description={confirmModal.description}
            confirmLabel={confirmModal.confirmLabel}
            variant={confirmModal.variant}
            loading={saving || archiving}
            onConfirm={confirmModal.onConfirm}
            onCancel={closeConfirm}
          />
        </div>
      )}
    </>
  );
};

const UserDrawer: React.FC<UserDrawerProps> = ({
  user,
  isOpen,
  onClose,
  ...rest
}) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/30 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">
              {user?.status === "pending" ? "Approve User" : "User Details"}
            </p>
            {user?.status && (
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  user.status === "active"
                    ? "bg-green-100 text-green-600"
                    : user.status === "pending"
                      ? "bg-amber-100 text-amber-600"
                      : user.status === "inactive"
                        ? "bg-gray-100 text-gray-500"
                        : "bg-red-100 text-red-600"
                }`}
              >
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={16} />
          </button>
        </div>

        {/* Remount inner content whenever the selected user changes */}
        {user && (
          <UserDrawerInner
            key={user.id}
            user={user}
            isOpen={isOpen}
            onClose={onClose}
            {...rest}
          />
        )}
      </div>
    </>
  );
};

export default UserDrawer;
