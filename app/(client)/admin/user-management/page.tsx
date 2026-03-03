'use client';

import React, { useState } from 'react';
import { Search, Bell, CircleUserRound, SlidersVertical } from 'lucide-react';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Clerk';
  contact: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-[#4BD278]';
      case 'Inactive': return 'text-[#DF2025]';
      default: return 'text-gray-500';
    }
  };

const UserManagement: React.FC = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  // Mock Data matching the User Management design
  const users: UserAccount[] = [
    { id: '1', name: 'Aliyah Segovia', email: 'asegovia@gmail.com', role: 'Admin', contact: '09123456789', status: 'Active', lastLogin: '10 Oct, 2025' },
    { id: '2', name: 'Maverick Verdida', email: 'mverdida@gmail.com', role: 'Manager', contact: '09123456789', status: 'Inactive', lastLogin: '10 Oct, 2025' },
    { id: '3', name: 'Russell Palcoto', email: 'rpalcoto@gmail.com', role: 'Clerk', contact: '09123456789', status: 'Active', lastLogin: '10 Oct, 2025' },
    { id: '4', name: 'Rose Pajarito', email: 'rpajarito@gmail.com', role: 'Admin', contact: '09123456789', status: 'Inactive', lastLogin: '10 Oct, 2025' },
    { id: '5', name: 'Venelyn Cordova', email: 'vcordova@gmail.com', role: 'Clerk', contact: '09123456789', status: 'Active', lastLogin: '10 Oct, 2025' },
    { id: '6', name: 'Joan Sibayan', email: 'jsibayan@gmail.com', role: 'Admin', contact: '09123456789', status: 'Active', lastLogin: '10 Oct, 2025' },
    { id: '7', name: 'Lindsay Mahusay', email: 'lmahusay@gmail.com', role: 'Clerk', contact: '09123456789', status: 'Active', lastLogin: '10 Oct, 2025' },
  ];

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full">
        <div className="flex items-center flex-1">
          
          {/* Gap between title and search bar */}
          <div className="w-35 shrink-0">
            <h1 className="text-xl font-semibold text-[#0f172a]">Users</h1>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl group">
            <span className="absolute inset-y-0 right-4 flex items-center text-[#6F757E] pointer-events-none group-focus-within:text-[#DF2025] transition-colors overflow-hidden">
              <Search size={18} strokeWidth={2.5} />
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pr-10 pl-4 py-2 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#DF2025] transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-8">
          {/* Bell Button */}
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

          {/* User Button */}
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

      {/* 2. User Management Card */}
      <div className="bg-white rounded-3xl border border-[#E1E1E1] shadow-sm p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-xl font-semibold text-[#050F24]">User Management</h2>
            <p className="text-[#6F757E] font-normal text-sm mt-1">
            All registered users are listed below with their respective roles and account statuses.<br />
            Click on a specific user to view or edit their details, manage access permissions, or update account information.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 items-end">
            {/* Status Filter */}
            <div className="relative">
              <label className="block text-xs font-medium text-[#DF2025] mb-2">Status</label>
              <button 
                onClick={() => { setIsStatusOpen(!isStatusOpen); setIsRoleOpen(false); }}
                className={`flex items-center justify-between w-45 px-6 py-2 border-2 border-[#DF2025] rounded-full font-normal hover:bg-[#DF2025] hover:text-white transition-colors overflow-hidden
                ${  
                  isStatusOpen ? 'bg-[#DF2025] text-white' : 'text-[#DF2025]'
                }`}
              >
                <span>{statusFilter}</span>
                <SlidersVertical size={20} />
              </button>

              {isStatusOpen && (
                <div className="absolute left-0 mt-2 w-45 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                  {['All', 'Active', 'Inactive'].map((status) => (
                    <button 
                      key={status}
                      className={`w-full text-left px-6 py-3 text-sm hover:bg-gray-50 ${status === statusFilter ? 'text-[#DF2025]' : 'text-[#6F757E]'}`}
                      onClick={() => { setStatusFilter(status); setIsStatusOpen(false); }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role Filter */}
            <div className="relative">
              <label className="block text-xs font-medium text-[#DF2025] mb-2">Role</label>
              <button 
                onClick={() => { setIsRoleOpen(!isRoleOpen); setIsStatusOpen(false); }}
                className={`flex items-center justify-between w-45 px-6 py-2 border-2 border-[#DF2025] rounded-full font-normal hover:bg-[#DF2025] hover:text-white transition-colors overflow-hidden
              ${
                  isRoleOpen ? 'bg-[#DF2025] text-white' : 'text-[#DF2025]'
                }`}
              >
                <span>{roleFilter}</span>
                    <SlidersVertical size={20} />
                </button>
              {isRoleOpen && (
                <div className="absolute right-0 mt-2 w-45 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                  {['All', 'Admin', 'Manager', 'Clerk'].map((role) => (
                    <button 
                      key={role}
                      className={`w-full text-left px-6 py-3 text-sm hover:bg-gray-50 ${role === roleFilter ? 'text-[#DF2025]' : 'text-[#6F757E]'}`}
                      onClick={() => { setRoleFilter(role); setIsRoleOpen(false); }}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add New User Button */}
            <button className= "flex items-center justify-center gap-3 bg-[#DF2025] w-45 h-11 text-white px-6 py-3 rounded-full font-normal hover:bg-[#b3191d] transition-colors">
            Add new user
            </button>
          </div>
        </div>

        <div className="mt-8 border border-gray-200 rounded-[32px] pb-8 pt-8 pl-0 pr-0 shadow-sm bg-white">
        {/* 3. Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#050F24] font-semibold border-b border-gray-100">
                <th className="pb-4 pl-8 font-semibold text-left w-[21%]">Staff</th>
                <th className="pb-4 px-4 font-semibold text-center w-[21%]">Role</th>
                <th className="pb-4 px-4 font-semibold text-center w-[21%]">Contact</th>
                <th className="pb-4 px-4 font-semibold text-center w-[21%]">Status</th>
                <th className="pb-4 pr-8 font-semibold text-center w-[15%]">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((userAccount) => (
                <tr key={userAccount.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="py-4 pl-8 flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden shrink-0" />
                    <div>
                      <p className="font-normal text-[#050F24]">{userAccount.name}</p>
                      <p className="text-xs font-normal text-gray-400">{userAccount.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-normal text-center text-[#6F757E]">{userAccount.role}</td>
                  <td className="py-4 px-4 font-normal text-center text-[#6F757E]">{userAccount.contact}</td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center">
                      <span className={`flex items-center gap-2 font-medium ${getStatusColor(userAccount.status)}`}>
                        <div className={`w-2 h-2 rounded-full ${
                          userAccount.status === 'Active' ? 'bg-[#4BD278]' : 
                          userAccount.status === 'Inactive' ? 'bg-[#DF2025]' : 'bg-gray-400'
                        }`} />
                        {userAccount.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 pr-8 font-normal text-center text-[#6F757E]">{userAccount.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 4. Pagination Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-auto pt-6 px-6 gap-4 border-t border-gray-100">
          <span className="text-xs font-normal text-[#6F757E]">
            Showing 7 of 7 users
          </span>
          <div className="flex items-center gap-2">
            <button className="px-2 text-[#6F757E] text-xs font-normal hover:text-[#DF2025] hover:underline">Prev</button>
            <button className="w-8 h-8 rounded-full bg-[#DF2025] text-white text-xs font-bold shadow-md shadow-red-100">1</button>
            <button className="w-8 h-8 rounded-full bg-gray-100 text-[#6F757E] text-xs hover:bg-gray-200 transition-colors overflow-hidden">2</button>
            <button className="px-2 text-[#DF2025] text-xs font-normal hover:underline">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default UserManagement;