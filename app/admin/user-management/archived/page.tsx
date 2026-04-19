"use client";

import React, { useState, useMemo } from "react";
import { Search, ArchiveRestore, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { Users2, Archive } from "lucide-react";
import HeaderUser from "@/components/admin/HeaderUser";
import HeaderNotifications from "@/components/admin/HeaderNotif";
import ConfirmModal from "@/app/admin/components/ConfirmModal";
import { useArchivedUsers } from "../useArchivedUsers";
import { UserProfile, ROLE_LABELS, STATUS_LABELS } from "../userTypes";
import UserDrawer from "../components/userDrawer";
import { useUserManagement } from "../useUserManagement";

const ITEMS_PER_PAGE = 10;

const ArchivedUsers: React.FC = () => {
  const { users, loading, restoreUsers } = useArchivedUsers();
  const { approveUser, updateUser, archiveUser, currentUser } =
    useUserManagement();
  const isSuperAdmin = currentUser?.role === "super_admin";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [restoreModalOpen, setRestoreModalOpen] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        !q ||
        (u.full_name ?? "").toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.contact ?? "").toLowerCase().includes(q),
    );
  }, [users, searchQuery]);

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

  const handleRestore = async () => {
    setRestoring(true);
    const ok = await restoreUsers(selectedIds);
    if (ok) setSelectedIds([]);
    setRestoring(false);
    setRestoreModalOpen(false);
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
              maxLength={50}
              className="w-full pr-9 pl-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
            />
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-1">
          <HeaderNotifications />
          <HeaderUser />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-gray-100 shadow-sm p-1.5 mb-6 overflow-x-auto">
        <Link
          href="/admin/user-management"
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors text-gray-500 hover:bg-gray-100"
        >
          <Users2 size={13} />
          Active
        </Link>
        <Link
          href="/admin/user-management/archived"
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors bg-red-600 text-white shadow-sm"
        >
          <Archive size={13} />
          Archived
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Archived Users
            </h2>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
              Users that have been archived are listed below.
              <br />
              Select rows and click Restore to move them back to active.
            </p>
          </div>
          {someSelected && isSuperAdmin && (
            <button
              onClick={() => setRestoreModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors animate-in fade-in duration-150 shrink-0"
            >
              <ArchiveRestore size={13} />
              Restore ({selectedIds.length})
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
              <Loader2 className="animate-spin" size={20} />
              <p className="text-sm">Loading archived users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-2 text-gray-400">
              <Users size={24} strokeWidth={1.5} />
              <p className="text-sm">No archived users found.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  <th className="py-3 pl-5 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="w-3.5 h-3.5 rounded border-gray-300 accent-red-600 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold text-left">Staff</th>
                  <th className="py-3 px-4 font-semibold text-center">Role</th>
                  <th className="py-3 px-4 font-semibold text-center">
                    Contact
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
                    onClick={() => {
                      setActiveUser(u);
                      setDrawerOpen(true);
                    }}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedIds.includes(u.id) ? "bg-green-50/80" : ""}`}
                  >
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
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 gap-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
              {someSelected && (
                <span className="ml-2 text-green-500">
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs text-red-600 hover:underline transition-colors disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Restore Modal */}
      <ConfirmModal
        open={restoreModalOpen}
        title={`Restore ${selectedIds.length} user${selectedIds.length > 1 ? "s" : ""}?`}
        description="Restored users will be set to inactive and can be reactivated manually."
        confirmLabel="Yes, restore"
        loading={restoring}
        variant="restore"
        onConfirm={handleRestore}
        onCancel={() => setRestoreModalOpen(false)}
      />

      {/* Drawer */}
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
    </div>
  );
};

export default ArchivedUsers;
