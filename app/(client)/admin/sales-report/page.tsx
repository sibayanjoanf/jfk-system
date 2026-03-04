'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Printer, Download, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import HeaderUser from '@/components/admin/HeaderUser';
import HeaderNotifications from '@/components/admin/HeaderNotif';

const SalesReport: React.FC = () => {
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState('Monthly');

  const statsData = [
    { name: 'Jan', value: 3000 }, { name: 'Feb', value: 2000 },
    { name: 'Mar', value: 4500 }, { name: 'Apr', value: 2800 },
    { name: 'May', value: 3200 }, { name: 'Jun', value: 2100 },
    { name: 'Jul', value: 1800 }, { name: 'Aug', value: 4800 },
    { name: 'Sep', value: 3100 }, { name: 'Oct', value: 3900 },
    { name: 'Nov', value: 2600 }, { name: 'Dec', value: 5000 },
  ];

  const pieData = [
    { name: 'Tiles', value: 44, color: '#F97316' },
    { name: 'Stones', value: 32, color: '#0EA5E9' },
    { name: 'Fixtures', value: 24, color: '#22C55E' },
  ];

  const products = [
    { id: 1, name: "Product Name", type: "Product Type", orders: 8000, price: 130, category: "Category", refunds: 13 },
    { id: 2, name: "Product Name", type: "Product Type", orders: 3000, price: 45, category: "Category", refunds: 18 },
    { id: 3, name: "Product Name", type: "Product Type", orders: 6000, price: 80, category: "Category", refunds: 11 },
    { id: 4, name: "Product Name", type: "Product Type", orders: 4000, price: 500, category: "Category", refunds: 18 },
    { id: 5, name: "Product Name", type: "Product Type", orders: 2000, price: 15, category: "Category", refunds: 10 },
  ];

  return (
    <div className="p-0 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full gap-4">
        <div className="flex items-center gap-6 flex-1">
          <div className="shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Reports</p>
            <h1 className="text-lg font-semibold text-gray-900">Sales Report</h1>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1">
          <HeaderNotifications />
          <HeaderUser />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">

        {/* Statistics Bar Chart Card */}
        <div className="col-span-12 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-semibold text-gray-900">Statistics</h2>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setIsTimeOpen(!isTimeOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded-lg font-medium transition-colors ${
                    isTimeOpen ? 'bg-red-600 text-white border-red-600' : 'border-red-200 text-red-600 hover:bg-red-50'
                  }`}
                >
                  {timeFilter}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isTimeOpen ? 'rotate-180' : ''}`} />
                </button>

                {isTimeOpen && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                    {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((item) => (
                      <button
                        key={item}
                        className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${
                          item === timeFilter ? 'text-red-600 font-medium' : 'text-gray-600'
                        }`}
                        onClick={() => { setTimeFilter(item); setIsTimeOpen(false); }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                  <Printer size={16} />
                </button>
                <button className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                  <Download size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip
                  cursor={{ fill: '#F8FAFC' }}
                  contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Bar dataKey="value" fill="#DF2025" radius={[4, 4, 0, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products Table */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 pt-6 pb-4">
            <h2 className="text-base font-semibold text-gray-900">Top Selling Products</h2>
            <p className="text-xs text-gray-400 mt-1">Best performing products by order volume</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-400 border-y border-gray-100">
                  <th className="py-3 pl-6 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold text-center">Orders</th>
                  <th className="py-3 px-4 font-semibold text-center">Price</th>
                  <th className="py-3 px-4 font-semibold text-center">Category</th>
                  <th className="py-3 pr-6 font-semibold text-center">Refunds</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100 transition-colors cursor-pointer">
                    <td className="py-3.5 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                          <img src="/product-icon.png" alt="prod" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sm text-gray-500 text-center">{item.orders.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-sm text-gray-700 font-medium text-center">₱{item.price}</td>
                    <td className="py-3.5 px-4 text-sm text-gray-500 text-center">{item.category}</td>
                    <td className="py-3.5 pr-6 text-sm text-gray-500 text-center">
                      {item.refunds > 15 ? `> ${item.refunds}` : `< ${item.refunds}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-100 gap-4">
            <span className="text-xs text-gray-400">Showing 5 of 5 products</span>
            <div className="flex items-center gap-1.5">
              <button className="px-3 py-1.5 text-xs text-gray-400 hover:text-red-600 transition-colors">Prev</button>
              <button className="w-7 h-7 rounded-lg bg-red-600 text-white text-xs font-semibold shadow-sm">1</button>
              <button className="w-7 h-7 rounded-lg bg-gray-100 text-gray-500 text-xs hover:bg-gray-200 transition-colors">2</button>
              <button className="px-3 py-1.5 text-xs text-red-600 hover:underline transition-colors">Next</button>
            </div>
          </div>
        </div>

        {/* Sales by Category Donut Chart */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col">
          <h2 className="text-base font-semibold text-gray-900 mb-2">Sales by Category</h2>
          <p className="text-xs text-gray-400 mb-4">Revenue distribution across categories</p>

          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 space-y-1">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between py-2.5 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-500">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SalesReport;