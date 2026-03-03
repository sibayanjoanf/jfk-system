'use client';

import React, { useState } from 'react';
import { Bell, CircleUserRound, Printer, Download, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SalesReport: React.FC = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
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
      <div className="flex justify-between items-center mb-8 w-full">
        <div className="flex items-center flex-1">
          <div className="w-35 shrink-0">
            <h1 className="text-xl font-semibold text-[#0f172a]">Sales Report</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-8">
          <button 
            onClick={() => setActiveButton(activeButton === 'bell' ? null : 'bell')}
            className={`p-1.5 rounded-full transition-all ${activeButton === 'bell' ? 'bg-[#DF2025] text-white' : 'text-[#050F24] hover:bg-gray-200'}`}
          >
            <Bell size={24} />
          </button>
          <button 
            onClick={() => setActiveButton(activeButton === 'user' ? null : 'user')}
            className={`p-1.5 rounded-full transition-all ${activeButton === 'user' ? 'bg-[#DF2025] text-white' : 'text-[#050F24] hover:bg-gray-200'}`}
          >
            <CircleUserRound size={27} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Statistics Bar Chart Card */}
        <div className="col-span-12 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-semibold text-[#0F172A]">Statistics</h2>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  onClick={() => setIsTimeOpen(!isTimeOpen)}
                  className="flex items-center justify-between gap-2 px-2 py-1.5 text-[#DF2025] rounded-full font-medium min-w-[100px] text-sm transition-all outline-none"
                >
                  {timeFilter} 
                  <ChevronDown 
                    size={16} 
                    className={`transition-transform duration-200 ${isTimeOpen ? "rotate-180" : ""}`} 
                  />
                </button>
                
                {isTimeOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                    {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((item) => (
                      <button
                        key={item}
                        className={`w-full text-left px-6 py-3 text-sm hover:bg-gray-50 transition-colors ${
                          item === timeFilter ? 'text-[#DF2025] font-semibold' : 'text-[#6F757E]'
                        }`}
                        onClick={() => { 
                          setTimeFilter(item); 
                          setIsTimeOpen(false); 
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Printer size={20} className="text-gray-400 cursor-pointer hover:text-[#DF2025] transition-colors" />
                <Download size={20} className="text-gray-400 cursor-pointer hover:text-[#DF2025] transition-colors" />
              </div>
            </div>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" fill="#DF2025" radius={[4, 4, 0, 0]} barSize={8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Products Table */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-gray-200 overflow-auto shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-[#0F172A]">Top Selling Product</h2>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="text-gray-400 font-medium border-y border-gray-50">
              <tr>
                <th className="py-4 px-6">Product</th>
                <th className="py-4">Orders</th>
                <th className="py-4">Price</th>
                <th className="py-4">Category</th>
                <th className="py-4">Refunds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                        <img src="/product-icon.png" alt="prod" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium text-[#0F172A]">{item.name}</div>
                        <div className="text-xs text-gray-400">{item.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-gray-500">{item.orders}</td>
                  <td className="text-gray-500">₱{item.price}</td>
                  <td className="text-gray-500">{item.category}</td>
                  <td className="text-gray-500">
                    {item.refunds > 15 ? `> ${item.refunds}` : `< ${item.refunds}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div className="flex justify-between items-center px-6 py-6 border-t border-gray-50 text-xs text-gray-400">
            <span>Showing 5 of 5 products</span>
            <div className="flex items-center gap-4">
              <button className="hover:text-[#DF2025]">Prev</button>
              <span className="w-7 h-7 flex items-center justify-center rounded-full bg-[#DF2025] text-white">1</span>
              <span className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-400">2</span>
              <button className="text-[#DF2025] font-medium">Next</button>
            </div>
          </div>
        </div>

        {/* Sales by Category Donut Chart */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold text-[#0F172A] mb-4">Sales by Category</h2>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} innerRadius={65} outerRadius={85} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-4">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm py-2 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-500">{item.name}</span>
                </div>
                <span className="font-semibold text-[#0F172A]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;