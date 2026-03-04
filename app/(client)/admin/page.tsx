'use client';

import MetricCard from '@/components/admin/dashboard/MetricCard';
import RevenueChart from '@/components/admin/dashboard/RevenueChart';
import OrderStatusChart from '@/components/admin/dashboard/OrderStatusChart';
import ProductTable from '@/components/admin/dashboard/ProductTable';
import CustomerList from '@/components/admin/dashboard/CustomerList';
import BranchSalesChart from '@/components/admin/dashboard/BranchSalesChart';
import { ShoppingCart, Clock, AlertTriangle, TrendingUp, Search } from 'lucide-react';
import HeaderUser from '@/components/admin/HeaderUser';
import HeaderNotifications from '@/components/admin/HeaderNotif';

interface RevenueItem { name: string; facebook: number; website: number; }
interface StatusItem { name: string; value: number; color: string; }
interface ProductItem { name: string; type: string; orders: number; price: number; category: string; refunds: string; }
interface CustomerItem { name: string; location: string; }
interface BranchItem { name: string; value: number; color: string; }

const Dashboard: React.FC = () => {
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
      <div className="flex justify-between items-center mb-8 w-full gap-4">
        <div className="flex items-center gap-6 flex-1">
          <div className="shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Overview</p>
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          </div>

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

        {/* Desktop here */}
        <div className="hidden lg:flex items-center gap-1">
          <HeaderNotifications />
          <HeaderUser />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total Orders" value="57" color="bg-[#4BD278]" icon={ShoppingCart} showView={true} viewPath="admin/order-management" />
        <MetricCard title="Pending Orders" value="8" color="bg-[#20B2DF]" icon={Clock} showView={true} viewPath="admin/order-management" />
        <MetricCard title="Low Stock" value="25" color="bg-[#FF8E29]" icon={AlertTriangle} showView={true} viewPath="admin/inventory-management" />
        <MetricCard title="Revenue" value="35k" color="bg-[#DF2025]" icon={TrendingUp} showView={true} viewPath="admin/sales-report" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2"><RevenueChart data={revenueData} /></div>
        <div className="xl:col-span-1"><OrderStatusChart data={statusData} /></div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-4">
        <div className="xl:col-span-2"><ProductTable products={productData} /></div>
        <div className="xl:col-span-1 space-y-6">
          <CustomerList customers={customerData} />
          <BranchSalesChart data={branchData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;