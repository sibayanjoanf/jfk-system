"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, Plus, Trash2, ChevronDown } from "lucide-react";
import HeaderUser from "@/components/admin/HeaderUser";
import HeaderNotifications from "@/components/admin/HeaderNotif";

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Clerk";
  contact: string;
  status: "Active" | "Inactive";
  lastLogin: string;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Active":
      return "text-[#4BD278]";
    case "Inactive":
      return "text-[#DF2025]";
    default:
      return "text-gray-500";
  }
};

const getDotColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-[#4BD278]";
    case "Inactive":
      return "bg-[#DF2025]";
    default:
      return "bg-gray-400";
  }
};

const UserManagement: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Mock Data matching the User Management design
  const users: UserAccount[] = [
    {
      id: "1",
      name: "Aliyah Segovia",
      email: "asegovia@gmail.com",
      role: "Admin",
      contact: "09123456789",
      status: "Active",
      lastLogin: "10 Oct, 2025",
    },
    {
      id: "2",
      name: "Maverick Verdida",
      email: "mverdida@gmail.com",
      role: "Manager",
      contact: "09123456789",
      status: "Inactive",
      lastLogin: "10 Oct, 2025",
    },
    {
      id: "3",
      name: "Russell Palcoto",
      email: "rpalcoto@gmail.com",
      role: "Clerk",
      contact: "09123456789",
      status: "Active",
      lastLogin: "10 Oct, 2025",
    },
    {
      id: "4",
      name: "Rose Pajarito",
      email: "rpajarito@gmail.com",
      role: "Admin",
      contact: "09123456789",
      status: "Inactive",
      lastLogin: "10 Oct, 2025",
    },
    {
      id: "5",
      name: "Venelyn Cordova",
      email: "vcordova@gmail.com",
      role: "Clerk",
      contact: "09123456789",
      status: "Active",
      lastLogin: "10 Oct, 2025",
    },
    {
      id: "6",
      name: "Joan Sibayan",
      email: "jsibayan@gmail.com",
      role: "Admin",
      contact: "09123456789",
      status: "Active",
      lastLogin: "10 Oct, 2025",
    },
    {
      id: "7",
      name: "Lindsay Mahusay",
      email: "lmahusay@gmail.com",
      role: "Clerk",
      contact: "09123456789",
      status: "Active",
      lastLogin: "10 Oct, 2025",
    },
  ];

  const filteredUsers = users.filter((u) => {
    const matchesStatus = statusFilter === "All" || u.status === statusFilter;
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesStatus && matchesRole;
  });

  const allSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((u) => selectedIds.includes(u.id));
  const someSelected = selectedIds.length > 0;

  const toggleAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(filteredUsers.map((u) => u.id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const deleteSelected = () => {
    // wire to your delete logic here
    setSelectedIds([]);
  };

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full gap-4">
        <div className="flex items-center gap-6 flex-1">
          {/* Gap between title and search bar */}
          <div className="shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
              Management
            </p>
            <h1 className="text-lg font-semibold text-gray-900">Users</h1>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-sm group">
            <span className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 pointer-events-none group-focus-within:text-red-600 transition-colors">
              <Search size={15} strokeWidth={2} />
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pr-9 pl-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1">
          <HeaderNotifications />
          <HeaderUser />
        </div>
      </div>

      {/* User Management Card */}
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
            {someSelected && (
              <button
                onClick={deleteSelected}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors animate-in fade-in duration-150"
              >
                <Trash2 size={13} />
                Delete ({selectedIds.length})
              </button>
            )}

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsStatusOpen(!isStatusOpen);
                  setIsRoleOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 text-xs border rounded-lg font-medium transition-colors ${
                  isStatusOpen
                    ? "bg-red-600 text-white border-red-600"
                    : "border-red-200 text-red-600 hover:bg-red-50"
                }`}
              >
                <span>{statusFilter}</span>
                <ChevronDown size={14} />
              </button>

              {isStatusOpen && (
                <div className="absolute left-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                  {["All", "Active", "Inactive"].map((status) => (
                    <button
                      key={status}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${status === statusFilter ? "text-red-600 font-medium" : "text-gray-600"}`}
                      onClick={() => {
                        setStatusFilter(status);
                        setIsStatusOpen(false);
                      }}
                    >
                      {status}
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
                className={`flex items-center gap-2 px-4 py-2 text-xs border rounded-lg font-medium transition-colors ${
                  isRoleOpen
                    ? "bg-red-600 text-white border-red-600"
                    : "border-red-200 text-red-600 hover:bg-red-50"
                }`}
              >
                <span>{roleFilter}</span>
                <ChevronDown size={14} />
              </button>

              {isRoleOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                  {["All", "Admin", "Manager", "Clerk"].map((role) => (
                    <button
                      key={role}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${role === roleFilter ? "text-red-600 font-medium" : "text-gray-600"}`}
                      onClick={() => {
                        setRoleFilter(role);
                        setIsRoleOpen(false);
                      }}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add New User Button */}
            <button className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors">
              <Plus size={12} />
              Add User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
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
                <th className="py-3 px-4 font-semibold text-center">Contact</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 pr-5 font-semibold text-center">
                  Last Login
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((userAccount) => (
                <tr
                  key={userAccount.id}
                  className={`hover:bg-gray-100 transition-colors cursor-pointer ${selectedIds.includes(userAccount.id) ? "bg-red-50/80" : ""}`}
                >
                  <td
                    className="py-3.5 pl-5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(userAccount.id)}
                      onChange={() => toggleOne(userAccount.id)}
                      className="w-3.5 h-3.5 rounded border-gray-300 accent-red-600 cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {userAccount.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {userAccount.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-gray-500 text-center">
                    {userAccount.role}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-gray-500 text-center">
                    {userAccount.contact}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(userAccount.status)}`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${getDotColor(userAccount.status)}`}
                      />
                      {userAccount.status}
                    </span>
                  </td>
                  <td className="py-3.5 pr-5 text-sm text-gray-500 text-center whitespace-nowrap">
                    {userAccount.lastLogin}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 gap-4 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            Showing {filteredUsers.length} of {users.length} users
            {someSelected && (
              <span className="ml-2 text-red-500">
                · {selectedIds.length} selected
              </span>
            )}
          </span>
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1.5 text-xs text-gray-400 hover:text-red-600 transition-colors">
              Prev
            </button>
            <button className="w-7 h-7 rounded-lg bg-red-600 text-white text-xs font-semibold shadow-sm">
              1
            </button>
            <button className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 text-xs hover:bg-gray-200 transition-colors">
              2
            </button>
            <button className="px-3 py-1.5 text-xs text-red-600 hover:underline transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
