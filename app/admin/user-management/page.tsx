"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Search, ChevronDown, Archive } from "lucide-react";
import HeaderUser from "@/components/admin/HeaderUser";
import HeaderNotifications from "@/components/admin/HeaderNotif";
import { useUserManagement } from "./useUserManagement";
import UserDrawer from "./components/userDrawer";
import ConfirmModal from "@/app/admin/components/ConfirmModal";
import {
  UserProfile,
  UserRole,
  UserStatus,
  ROLE_LABELS,
  STATUS_LABELS,
} from "./userTypes";

const getStatusStyles = (status: UserStatus) => {
  switch (status) {
    case "active":
      return "text-green-600";
    case "pending":
      return "text-amber-500";
    case "inactive":
      return "text-gray-400";
    case "archived":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

const getDotColor = (status: UserStatus) => {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "pending":
      return "bg-amber-400";
    case "inactive":
      return "bg-gray-400";
    case "archived":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
};

const ITEMS_PER_PAGE = 10;

const UserManagement: React.FC = () => {
  const {
    users,
    loading,
    currentUser,
    fetchUsers,
    approveUser,
    updateUser,
    archiveUser,
  } = useUserManagement();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const isSuperAdmin = currentUser?.role === "super_admin";

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesStatus =
        statusFilter === "All" || u.status === statusFilter.toLowerCase();
      const matchesRole = roleFilter === "All" || u.role === roleFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        (u.full_name ?? "").toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.contact ?? "").toLowerCase().includes(q);
      return matchesStatus && matchesRole && matchesSearch;
    });
  }, [users, statusFilter, roleFilter, searchQuery]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginated = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const allSelected =
    paginated.length > 0 && paginated.every((u) => selectedIds.includes(u.id));
  const someSelected = selectedIds.length > 0;

  const toggleAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(paginated.map((u) => u.id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleRowClick = (user: UserProfile) => {
    setActiveUser(user);
    setDrawerOpen(true);
  };

  const handleBulkArchive = async () => {
    setArchiving(true);
    for (const id of selectedIds) {
      await archiveUser(id);
    }
    setSelectedIds([]);
    setArchiving(false);
    setArchiveModalOpen(false);
  };

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full gap-4">
        <div className="flex items-center gap-6 flex-1">
          <div className="shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
              Management
            </p>
            <h1 className="text-lg font-semibold text-gray-900">Users</h1>
          </div>
          <div className="relative flex-1 max-w-sm group">
            <span className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 pointer-events-none group-focus-within:text-red-600 transition-colors">
              <Search size={15} strokeWidth={2} />
            </span>
            <input
              type="text"
              placeholder="Search by name, email, contact..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pr-9 pl-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
            />
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-1">
          <HeaderNotifications />
          <HeaderUser />
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              User Management
            </h2>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
              All registered users are listed below with their respective roles
              and account statuses.
              <br />
              Click on a specific user to view or edit their details.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 items-center shrink-0">
            {someSelected && isSuperAdmin && (
              <button
                onClick={() => setArchiveModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-600 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors animate-in fade-in duration-150"
              >
                <Archive size={13} />
                Archive ({selectedIds.length})
              </button>
            )}

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsStatusOpen(!isStatusOpen);
                  setIsRoleOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 text-xs border rounded-lg font-medium transition-colors ${isStatusOpen ? "bg-red-600 text-white border-red-600" : "border-red-200 text-red-600 hover:bg-red-50"}`}
              >
                <span>{statusFilter === "All" ? "Status" : statusFilter}</span>
                <ChevronDown size={14} />
              </button>
              {isStatusOpen && (
                <div className="absolute left-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                  {["All", "Active", "Pending", "Inactive"].map((s) => (
                    <button
                      key={s}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${s === statusFilter ? "text-red-600 font-medium" : "text-gray-600"}`}
                      onClick={() => {
                        setStatusFilter(s);
                        setIsStatusOpen(false);
                        setCurrentPage(1);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsRoleOpen(!isRoleOpen);
                  setIsStatusOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 text-xs border rounded-lg font-medium transition-colors ${isRoleOpen ? "bg-red-600 text-white border-red-600" : "border-red-200 text-red-600 hover:bg-red-50"}`}
              >
                <span>
                  {roleFilter === "All"
                    ? "Role"
                    : ROLE_LABELS[roleFilter as UserRole]}
                </span>
                <ChevronDown size={14} />
              </button>
              {isRoleOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                  <button
                    className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${roleFilter === "All" ? "text-red-600 font-medium" : "text-gray-600"}`}
                    onClick={() => {
                      setRoleFilter("All");
                      setIsRoleOpen(false);
                      setCurrentPage(1);
                    }}
                  >
                    All
                  </button>
                  {(
                    [
                      "super_admin",
                      "admin",
                      "manager",
                      "inventory_staff",
                      "staff",
                    ] as UserRole[]
                  ).map((role) => (
                    <button
                      key={role}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${roleFilter === role ? "text-red-600 font-medium" : "text-gray-600"}`}
                      onClick={() => {
                        setRoleFilter(role);
                        setIsRoleOpen(false);
                        setCurrentPage(1);
                      }}
                    >
                      {ROLE_LABELS[role]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100 min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm gap-2">
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              No users found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  {isSuperAdmin && (
                    <th className="py-3 pl-5 w-10">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        className="w-3.5 h-3.5 rounded border-gray-300 accent-red-600 cursor-pointer"
                      />
                    </th>
                  )}
                  <th className="py-3 px-4 font-semibold text-left">Staff</th>
                  <th className="py-3 px-4 font-semibold text-center">Role</th>
                  <th className="py-3 px-4 font-semibold text-center">
                    Contact
                  </th>
                  <th className="py-3 px-4 font-semibold text-center">
                    Status
                  </th>
                  <th className="py-3 pr-5 font-semibold text-center">
                    Registered
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => handleRowClick(u)}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedIds.includes(u.id) ? "bg-red-50/80" : ""}`}
                  >
                    {isSuperAdmin && (
                      <td
                        className="py-3.5 pl-5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(u.id)}
                          onChange={() => toggleOne(u.id)}
                          className="w-3.5 h-3.5 rounded border-gray-300 accent-red-600 cursor-pointer"
                        />
                      </td>
                    )}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-red-100 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold text-red-600">
                          {(u.full_name ?? u.email)?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {u.full_name ?? "—"}
                          </p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500 text-center">
                      {u.role ? (
                        ROLE_LABELS[u.role]
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500 text-center">
                      {u.contact ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(u.status)}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${getDotColor(u.status)}`}
                        />
                        {STATUS_LABELS[u.status]}
                      </span>
                    </td>
                    <td className="py-3.5 pr-5 text-xs text-gray-500 text-center whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString("en-PH", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 gap-4 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            Showing{" "}
            {filteredUsers.length === 0
              ? 0
              : (currentPage - 1) * ITEMS_PER_PAGE + 1}
            –{Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
            {someSelected && (
              <span className="ml-2 text-amber-500">
                · {selectedIds.length} selected
              </span>
            )}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs text-gray-400 hover:text-red-600 transition-colors disabled:opacity-40"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${p === currentPage ? "bg-red-600 text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs text-red-600 hover:underline transition-colors disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* User Drawer */}
      <UserDrawer
        user={activeUser}
        isOpen={drawerOpen}
        isSuperAdmin={isSuperAdmin}
        onClose={() => {
          setDrawerOpen(false);
          setTimeout(() => setActiveUser(null), 300);
        }}
        onApprove={approveUser}
        onUpdate={updateUser}
        onArchive={archiveUser}
      />

      {/* Archive Confirm Modal */}
      <ConfirmModal
        open={archiveModalOpen}
        title={`Archive ${selectedIds.length} user${selectedIds.length > 1 ? "s" : ""}?`}
        description="Archived users will be blocked from logging in and hidden from this list. You can restore them later."
        confirmLabel="Yes, archive"
        loading={archiving}
        variant="archive"
        onConfirm={handleBulkArchive}
        onCancel={() => setArchiveModalOpen(false)}
      />
    </div>
  );
};

export default UserManagement;
