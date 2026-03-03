'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, SlidersVertical, Search, Bell, CircleUserRound } from 'lucide-react';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  orderId: string;
  product: string;
  date: string;
  status: 'Pending' | 'Paid' | 'Processing' | 'Completed' | 'Refunded';
  revenue: number;
}

const OrderManagement: React.FC = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const orders: Order[] = [
    { id: '1', customerName: 'Aliyah Segovia', customerEmail: 'asegovia@gmail.com', orderId: 'EL-00552', product: 'Product', date: '28 Sep, 2025', status: 'Pending', revenue: 3500 },
    { id: '2', customerName: 'Maverick Verdida', customerEmail: 'mverdida@gmail.com', orderId: 'EL-00551', product: 'Product', date: '28 Sep, 2025', status: 'Paid', revenue: 20000 },
    { id: '3', customerName: 'Russell Palcoto', customerEmail: 'rpalcoto@gmail.com', orderId: 'EL-00550', product: 'Product', date: '28 Sep, 2025', status: 'Processing', revenue: 500 },
    { id: '4', customerName: 'Rose Pajarito', customerEmail: 'rpajarito@gmail.com', orderId: 'EL-00549', product: 'Product', date: '28 Sep, 2025', status: 'Pending', revenue: 3070 },
    { id: '5', customerName: 'Venelyn Cordova', customerEmail: 'vcordova@gmail.com', orderId: 'EL-00548', product: 'Product', date: '28 Sep, 2025', status: 'Refunded', revenue: 23500 },
    { id: '6', customerName: 'Joan Sibayan', customerEmail: 'jsibayan@gmail.com', orderId: 'EL-00547', product: 'Product', date: '28 Sep, 2025', status: 'Paid', revenue: 7000 },
    { id: '7', customerName: 'Lindsay Mahusay', customerEmail: 'lmahusay@gmail.com', orderId: 'EL-00546', product: 'Product', date: '28 Sep, 2025', status: 'Completed', revenue: 10030 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'text-[#B427D0]';
      case 'Pending': return 'text-[#FF8E29]';
      case 'Completed': return 'text-[#27D095]';
      case 'Processing': return 'text-[#20B2DF]';
      case 'Refunded': return 'text-[#DF2025]';
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
            <h1 className="text-xl font-semibold text-[#0f172a]">Order List</h1>
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

      {/* Order Management Card */}
      <div className="bg-white rounded-3xl border border-[#E1E1E1] shadow-sm p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-xl font-semibold text-[#050F24]">Order Management</h2>
            <p className="text-[#6F757E] font-normal text-sm mt-1">
            All the orders placed by different customers are listed below with their respective Order IDs.<br />
            Click on a particular order to view its full details.
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
                <div className="absolute right-0 mt-2 w-45 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                  {['All', 'Pending', 'Processing', 'Paid', 'Completed', 'Refunded'].map((status) => (
                    <button 
                      key={status}
                      className="w-full text-left px-6 py-3 text-sm hover:bg-gray-50 text-[#6F757E] hover:text-[#DF2025]"
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
        {/* Order Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#050F24] font-semibold border-b border-gray-100">
                <th className="pb-4 pl-8 font-semibold text-left w-[19%]">Customer</th>
                <th className="pb-4 px-4 font-semibold text-center w-[19%]">Order ID</th>
                <th className="pb-4 px-4 font-semibold text-center w-[19%]">Product</th>
                <th className="pb-4 px-4 font-semibold text-center w-[13%]">Date</th>
                <th className="pb-4 px-4 font-semibold text-center w-[25%]">Status</th>
                <th className="pb-4 pr-8 font-semibold text-center w-[5%]">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} 
                onClick={() => router.push(`/orders/${order.orderId}`)}
                className="group hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="py-4 pl-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden shrink-0" />
                    <div>
                      <p className="font-normal text-[#050F24]">{order.customerName}</p>
                      <p className="text-xs font-normal text-gray-400">{order.customerEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#6F757E] font-normal text-center">{order.orderId}</td>
                  <td className="py-4 px-4 text-[#6F757E] font-normal text-center">{order.product}</td>
                  <td className="py-4 px-4 text-[#6F757E] font-normal text-center">{order.date}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`flex items-center justify-center gap-2 w-fit mx-auto px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {/* Yung bilog sa status */}
                      <div className={`w-2 h-2 rounded-full ${
                        order.status === 'Paid' ? 'bg-[#B427D0]' : 
                        order.status === 'Pending' ? 'bg-[#FF8E29]' :
                        order.status === 'Completed' ? 'bg-[#27D095]' :
                        order.status === 'Processing' ? 'bg-[#20B2DF]' :
                        order.status === 'Refunded' ? 'bg-[#DF2025]' : 'bg-text-gray-500'
                      }`} />
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 pr-8 text-[#6F757E] font-normal text-center">₱{order.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-auto pt-6 px-6 gap-4 border-t border-gray-100">
          <span className="text-xs font-normal text-[#6F757E]">
            Showing 7 of 7 orders
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

export default OrderManagement;