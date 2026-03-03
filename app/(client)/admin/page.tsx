'use client';

import React, { useState } from 'react';
import MetricCard from '@/components/admin/dashboard/MetricCard';
import RevenueChart from '@/components/admin/dashboard/RevenueChart';
import OrderStatusChart from '@/components/admin/dashboard/OrderStatusChart';
import ProductTable from '@/components/admin/dashboard/ProductTable';
import CustomerList from '@/components/admin/dashboard/CustomerList';
import BranchSalesChart from '@/components/admin/dashboard/BranchSalesChart';
import { ShoppingCart, Clock, AlertTriangle, TrendingUp, Search, Bell, CircleUserRound } from 'lucide-react';

interface RevenueItem { name: string; facebook: number; website: number; }
interface StatusItem { name: string; value: number; color: string; }
interface ProductItem { name: string; type: string; orders: number; price: number; category: string; refunds: string; }
interface CustomerItem { name: string; location: string; }
interface BranchItem { name: string; value: number; color: string; }

const Dashboard: React.FC = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null);

// --- Mock Data ---
const revenueData: RevenueItem[] = [
  { name: 'Jan', facebook: 40, website: 100 }, { name: 'Feb', facebook: 50, website: 90 },
  { name: 'Mar', facebook: 120, website: 110 }, { name: 'Apr', facebook: 150, website: 130 },
  { name: 'May', facebook: 210, website: 180 }, { name: 'Jun', facebook: 180, website: 140 },
  { name: 'Jul', facebook: 160, website: 150 }, { name: 'Aug', facebook: 200, website: 230 },
];

const statusData: StatusItem[] = [
  { name: 'Pending', value: 43, color: '#FF8E29' }, { name: 'Processing', value: 27, color: '#20B2DF' },
  { name: 'Paid', value: 16, color: '#4BD278' }, { name: 'Completed', value: 33, color: '#DF2025' },
];

const productData: ProductItem[] = [
  { name: "Product Name", type: "Product Type", orders: 8000, price: 130, category: "Category", refunds: "> 13" },
  { name: "Product Name", type: "Product Type", orders: 3000, price: 45, category: "Category", refunds: "> 18" },
  { name: "Product Name", type: "Product Type", orders: 6000, price: 80, category: "Category", refunds: "< 11" },
  { name: "Product Name", type: "Product Type", orders: 4000, price: 500, category: "Category", refunds: "> 18" },
  { name: "Product Name", type: "Product Type", orders: 2000, price: 15, category: "Category", refunds: "< 10" },
  { name: "Product Name", type: "Product Type", orders: 1000, price: 20, category: "Category", refunds: "< 20" },
];

const customerData: CustomerItem[] = [
  { name: "Rose Pajarito", location: "Barit" }, { name: "Russell Palcoto", location: "Bulangon" },
  { name: "Aliyah Segovia", location: "Barit" }, { name: "Mingyu Kim", location: "Rizal" },
];

const branchData: BranchItem[] = [
  { name: 'Barit', value: 40, color: '#FF8E29' }, { name: 'Rizal', value: 30, color: '#4BD278' },
  { name: 'Bulangon', value: 30, color: '#DF2025' },
];

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full">
        <div className="flex items-center flex-1">
          
          {/* Gap between title and search bar */}
          <div className="w-35 shrink-0">
            <h1 className="text-xl font-semibold text-[#0f172a]">Dashboard</h1>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl group">
            <span className="absolute inset-y-0 right-4 flex items-center text-[#6F757E] pointer-events-none group-focus-within:text-[#DF2025] transition-colors overflow-hidden">
              <Search size={18} strokeWidth={2.5}/>
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

      {/* Grid Layouts */}
      <div className="flex flex-wrap gap-6 mb-8">
        <MetricCard title="Total Orders" value="57" color="bg-[#4BD278]" icon={ShoppingCart} showView={true} viewPath="admin/order-management" />
        <MetricCard title="Pending Orders" value="8" color="bg-[#20B2DF]" icon={Clock} showView={true} viewPath="admin/order-management"/>
        <MetricCard title="Low Stock" value="25" color="bg-[#FF8E29]" icon={AlertTriangle} showView={true} viewPath="admin/inventory-management"/>
        <MetricCard title="Revenue" value="35k" color="bg-[#DF2025]" icon={TrendingUp} showView={true} viewPath="admin/sales-report"/>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        <div className="xl:col-span-2"><RevenueChart data={revenueData} /></div>
        <div className="xl:col-span-1"><OrderStatusChart data={statusData} /></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-3">
        <div className="xl:col-span-2"><ProductTable products={productData} /></div>
        <div className="xl:col-span-1 space-y-8">
          <CustomerList customers={customerData} />
          <BranchSalesChart data={branchData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;