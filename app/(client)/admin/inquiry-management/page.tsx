'use client';

import React, { useState } from 'react';
import { Calendar, Search, Bell, CircleUserRound, SlidersVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import ViewInquiry from '@/components/admin/inquirymanage/ViewInquiry';

export interface Inquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  contact: string;
  status: 'All' | 'New' | 'In Progress' | 'Resolved';
}

const InquiryManagement: React.FC = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'text-[#20B2DF]';
      case 'In Progress': return 'text-[#FF8E29]';
      case 'Resolved': return 'text-[#27D095]';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full">
        <div className="flex items-center flex-1">
          
          {/* Gap between title and search bar */}
          <div className="w-35 shrink-0">
            <h1 className="text-xl font-semibold text-[#0f172a]">Inquiries</h1>
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

      {/* 2. Messages Header Card */}
      <div className="bg-white rounded-3xl border border-[#E1E1E1] shadow-sm p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-xl font-semibold text-[#050F24]">Messages</h2>
            <p className="text-[#6F757E] font-normal text-sm mt-1">
            All the inquiries submitted by customers are listed below. <br />
            Click on a particular inquiry to view its full details.
            </p>
          </div>
          
          {/* Calendar */}
          <div className="flex gap-3 relative">
            <button className="p-2 border-2 border-[#DF2025] text-[#DF2025] rounded-full hover:bg-[#DF2025] hover:text-white transition-colors overflow-hidden">
              <Calendar size={20} />
            </button>
          
            {/* Filter */}
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center justify-between w-45 px-6 py-2 border-2 border-[#DF2025] rounded-full font-normal hover:bg-[#DF2025] hover:text-white transition-colors overflow-hidden 
                  ${
                  isFilterOpen 
                    ? 'bg-[#DF2025] text-white' 
                    : 'text-[#DF2025]'
                }`}
              >
                <span>{filterStatus}</span>
                <SlidersVertical size={20} />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                  {['All', 'New', 'In Progress', 'Resolved'].map((status) => (
                    <button 
                      key={status}
                      className={`w-full text-left px-6 py-3 text-sm hover:bg-gray-50 ${status === filterStatus ? 'text-[#DF2025]' : 'text-[#6F757E]'}`}
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

        <div className="mt-8 border border-gray-200 rounded-[32px] pb-8 pt-8 pl-0 pr-0 shadow-sm bg-white">
        {/* 3. Inquiries Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#050F24] font-semibold border-b border-gray-100">
                <th className="pb-4 pl-8 font-semibold text-left w-[25%]">Customer</th>
                <th className="pb-4 px-4 font-semibold text-center w-[25%]">Date</th>
                <th className="pb-4 px-4 font-semibold text-center w-[35%]">Contact</th>
                <th className="pb-4 pr-8 font-semibold text-center w-[15%]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} 
                onClick={() => router.push(`/components/admin/inquirymanage/ViewInquiry`)}
                className="group hover:bg-gray-50 transition-colors">
                  <td className="py-4 pl-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden shrink-0" />
                    <div>
                      <p className="font-normal text-[#050F24]">{inquiry.customerName}</p>
                      <p className="text-xs font-normal text-[#6F757E]">{inquiry.customerEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-normal text-center text-[#6F757E]">{inquiry.date}</td>
                  <td className="py-4 px-4 font-normal text-center text-[#6F757E]">{inquiry.contact}</td>
                  <td className="py-4 pr-8">
                    <div className="flex justify-center">
                      <span className={`flex items-center gap-2 font-medium ${getStatusColor(inquiry.status)}`}>
                        <div className={`w-2 h-2 rounded-full ${
                          inquiry.status === 'New' ? 'bg-[#20B2DF]' : 
                          inquiry.status === 'In Progress' ? 'bg-[#FF8E29]' :
                          inquiry.status === 'Resolved' ? 'bg-[#27D095]' : 'bg-gray-400'
                        }`} />
                        {inquiry.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* 4. Pagination Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-auto pt-6 px-6 gap-4 border-t border-gray-100">
          <span className="text-xs font-normal text-[#6F757E]">
            Showing 7 of 7 inquiries
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

export default InquiryManagement;