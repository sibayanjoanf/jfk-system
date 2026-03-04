'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Search, Trash2, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import 'react-day-picker/dist/style.css';
import HeaderUser from '@/components/admin/HeaderUser';
import HeaderNotifications from '@/components/admin/HeaderNotif';

export interface Inquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  contact: string;
  status: 'All' | 'New' | 'In Progress' | 'Resolved';
}

const InquiryManagement: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock data tailored for the Inquiries page
  const inquiries: Inquiry[] = [
    { id: '1', customerName: 'Aliyah Segovia', customerEmail: 'asegovia@gmail.com', date: '10 Oct, 2025', contact: '09123456789', status: 'New' },
    { id: '2', customerName: 'Maverick Verdida', customerEmail: 'mverdida@gmail.com', date: '10 Oct, 2025', contact: '09123456789', status: 'In Progress' },
    { id: '3', customerName: 'Russell Palcoto', customerEmail: 'rpalcoto@gmail.com', date: '10 Oct, 2025', contact: '09123456789', status: 'New' },
    { id: '4', customerName: 'Rose Pajarito', customerEmail: 'rpajarito@gmail.com', date: '10 Oct, 2025', contact: '09123456789', status: 'New' },
    { id: '5', customerName: 'Venelyn Cordova', customerEmail: 'vcordova@gmail.com', date: '10 Oct, 2025', contact: '09123456789', status: 'In Progress' },
    { id: '6', customerName: 'Joan Sibayan', customerEmail: 'jsibayan@gmail.com', date: '10 Oct, 2025', contact: '09123456789', status: 'In Progress' },
    { id: '7', customerName: 'Lindsay Mahusay', customerEmail: 'lmahusay@gmail.com', date: '10 Oct, 2025', contact: '09123456789', status: 'Resolved' },
  ];

  const filteredInquiries = filterStatus === 'All' ? inquiries : inquiries.filter(i => i.status === filterStatus);
  const allSelected = filteredInquiries.length > 0 && filteredInquiries.every(i => selectedIds.includes(i.id));
  const someSelected = selectedIds.length > 0;

  const toggleAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(filteredInquiries.map(i => i.id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const deleteSelected = () => {
    setSelectedIds([]);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'New': return 'text-[#20B2DF]';
      case 'In Progress': return 'text-[#FF8E29]';
      case 'Resolved': return 'text-[#27D095]';
      default: return 'text-gray-500';
    }
  };

  const getDotColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-[#20B2DF]';
      case 'In Progress': return 'bg-[#FF8E29]';
      case 'Resolved': return 'bg-[#27D095]';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full gap-4">
        <div className="flex items-center gap-6 flex-1">

          {/* Gap between title and search bar */}
          <div className="shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Management</p>
            <h1 className="text-lg font-semibold text-gray-900">Inquiries</h1>
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

      {/* 2. Messages Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Messages</h2>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
              All inquiries submitted by customers are listed below.<br />
              Click on a particular inquiry to view its full details.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {someSelected && (
              <button
                onClick={deleteSelected}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors animate-in fade-in duration-150"
              >
                <Trash2 size={13} />
                Delete ({selectedIds.length})
              </button>
            )}

            {/* Calendar */}
            <div className="relative" ref={calendarRef}>
              <button
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className={`flex items-center gap-2 p-2 border rounded-lg transition-colors ${
                  isCalendarOpen ? 'bg-red-600 text-white border-red-600' : 'border-red-200 text-red-600 hover:bg-red-50'
                }`}
              >
                <Calendar size={16} />
              </button>
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 text-xs border rounded-lg font-medium transition-colors ${
                  isFilterOpen ? 'bg-red-600 text-white border-red-600' : 'border-red-200 text-red-600 hover:bg-red-50'
                }`}
              >
                <span>{filterStatus}</span>
                <ChevronDown size={14} />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                  {['All', 'New', 'In Progress', 'Resolved'].map((status) => (
                    <button
                      key={status}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${status === filterStatus ? 'text-red-600 font-medium' : 'text-gray-600'}`}
                      onClick={() => { setFilterStatus(status); setIsFilterOpen(false); }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Inquiries Table */}
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
                <th className="py-3 px-4 font-semibold text-left">Customer</th>
                <th className="py-3 px-4 font-semibold text-center">Date</th>
                <th className="py-3 px-4 font-semibold text-center">Contact</th>
                <th className="py-3 pr-5 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInquiries.map((inquiry) => (
                <tr
                  key={inquiry.id}
                  onClick={() => router.push(`/components/admin/inquirymanage/ViewInquiry`)}
                  className={`hover:bg-gray-100 transition-colors cursor-pointer ${selectedIds.includes(inquiry.id) ? 'bg-red-50/80' : ''}`}
                >
                  <td className="py-3.5 pl-5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(inquiry.id)}
                      onChange={() => toggleOne(inquiry.id)}
                      className="w-3.5 h-3.5 rounded border-gray-300 accent-red-600 cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{inquiry.customerName}</p>
                        <p className="text-xs text-gray-400">{inquiry.customerEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-gray-500 text-center whitespace-nowrap">{inquiry.date}</td>
                  <td className="py-3.5 px-4 text-sm text-gray-500 text-center">{inquiry.contact}</td>
                  <td className="py-3.5 pr-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(inquiry.status)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${getDotColor(inquiry.status)}`} />
                      {inquiry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. Pagination Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 gap-4 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            Showing {filteredInquiries.length} of {inquiries.length} inquiries
            {someSelected && <span className="ml-2 text-red-500">· {selectedIds.length} selected</span>}
          </span>
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1.5 text-xs text-gray-400 hover:text-red-600 transition-colors">Prev</button>
            <button className="w-7 h-7 rounded-lg bg-red-600 text-white text-xs font-semibold shadow-sm">1</button>
            <button className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 text-xs hover:bg-gray-200 transition-colors">2</button>
            <button className="px-3 py-1.5 text-xs text-red-600 hover:underline transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryManagement;