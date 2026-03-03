'use client';

import React, { useState } from 'react';
import { Search, Bell, CircleUserRound, SlidersVertical } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  type: string;
  suk: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  price: number;
  category: string;
  stock: number;
}

const ProductManagement: React.FC = () => {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  // Mock Data matching the Product List design
  const products: Product[] = [
    { id: '1', name: 'Product Name', type: 'Product Type', suk: 'EL-00552', status: 'Out of Stock', price: 130, category: 'Category', stock: 0 },
    { id: '2', name: 'Product Name', type: 'Product Type', suk: 'EL-00551', status: 'In Stock', price: 45, category: 'Category', stock: 504 },
    { id: '3', name: 'Product Name', type: 'Product Type', suk: 'EL-00550', status: 'Low Stock', price: 80, category: 'Category', stock: 12 },
    { id: '4', name: 'Product Name', type: 'Product Type', suk: 'EL-00549', status: 'In Stock', price: 500, category: 'Category', stock: 59 },
    { id: '5', name: 'Product Name', type: 'Product Type', suk: 'EL-00548', status: 'Low Stock', price: 15, category: 'Category', stock: 4 },
    { id: '6', name: 'Product Name', type: 'Product Type', suk: 'EL-00547', status: 'In Stock', price: 500, category: 'Category', stock: 173 },
    { id: '7', name: 'Product Name', type: 'Product Type', suk: 'EL-00553', status: 'Out of Stock', price: 420, category: 'Category', stock: 0 },
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'In Stock': return 'text-white bg-[#4BD278]';
      case 'Low Stock': return 'text-white bg-[#FF8E29]';
      case 'Out of Stock': return 'text-white bg-[#DF2025]';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 w-full">
        <div className="flex items-center flex-1">
          
          {/* Gap between title and search bar */}
          <div className="w-35 shrink-0">
            <h1 className="text-xl font-semibold text-[#0f172a]">Product List</h1>
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

      {/* 3. Product Management Card */}
      <div className="bg-white rounded-3xl border border-[#E1E1E1] shadow-sm p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-xl font-semibold text-[#050F24]">Product Management</h2>
            <p className="text-[#6F757E] font-normal text-sm mt-1">
              All the products available in the system are listed below with their respective SUKs.<br />
              Click on a specific product to view or edit its complete details.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3 items-end">
            {/* Category Filter */}
            <div className="relative">
              <label className="block text-xs font-medium text-[#DF2025] mb-2">Category</label>
              <button 
                onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsStatusOpen(false); }}
                className={`flex items-center justify-between w-45 px-6 py-2 border-2 border-[#DF2025] rounded-full font-normal hover:bg-[#DF2025] hover:text-white transition-colors overflow-hidden
                  ${  
                  isCategoryOpen ? 'bg-[#DF2025] text-white' : 'text-[#DF2025]'
                }`}
              >
                <span>{categoryFilter}</span>
                <SlidersVertical size={20} />
              </button>

              {isCategoryOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                  {['All', 'Tiles', 'Stones', 'Fixtures'].map((cat) => (
                    <button 
                      key={cat}
                      className={`w-full text-left px-6 py-3 text-sm hover:bg-gray-50 ${cat === categoryFilter ? 'text-[#DF2025]' : 'text-[#6F757E]'}`}
                      onClick={() => { setCategoryFilter(cat); setIsCategoryOpen(false); }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Stock Status Filter */}
            <div className="relative">
              <label className="block text-xs font-medium text-[#DF2025] mb-2">Stock Status</label>
              <button 
                onClick={() => { setIsStatusOpen(!isStatusOpen); setIsCategoryOpen(false); }}
                className={`flex items-center justify-between w-45 px-6 py-2 border-2 border-[#DF2025] rounded-full font-normal hover:bg-[#DF2025] hover:text-white transition-colors overflow-hidden
                  ${
                  isStatusOpen ? 'bg-[#DF2025] text-white' : 'text-[#DF2025]'
                }`}
              >
                <span>{statusFilter}</span>
                <SlidersVertical size={20} />
              </button>
              {isStatusOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                  {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map((status) => (
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
            {/* Add product button */}
            <button className= "flex items-center justify-center gap-3 bg-[#DF2025] w-45 h-11 text-white px-6 py-3 rounded-full font-normal hover:bg-[#b3191d] transition-colors">
            Add new product
            </button>
          </div>
        </div>

        <div className="mt-8 border border-gray-200 rounded-[32px] pb-8 pt-8 pl-0 pr-0 shadow-sm bg-white">
        {/* 4. Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[#050F24] font-semibold border-b border-gray-100">
                <th className="pb-4 pl-8 font-semibold text-left w-[19%]">Product</th>
                <th className="pb-4 px-4 font-semibold text-center w-[19%]">SUK</th>
                <th className="pb-4 px-4 font-semibold text-center w-[19%]">Status</th>
                <th className="pb-4 px-4 font-semibold text-center w-[13%]">Price</th>
                <th className="pb-4 px-4 font-semibold text-center w-[25%]">Category</th>
                <th className="pb-4 pr-8 font-semibold text-center w-[5%]">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="py-4 pl-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden shrink-0" />
                    <div>
                      <p className="font-normal text-[#050F24]">{product.name}</p>
                      <p className="text-xs font-normal text-gray-400">{product.type}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#6F757E] text-center">{product.suk}</td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-4 py-1.5 rounded-xl justify-center text-xs font-medium ${getStatusStyles(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[#6F757E] font-normal text-center">₱{product.price}</td>
                  <td className="py-4 px-4 text-[#6F757E] text-center">{product.category}</td>
                  <td className="py-4 pr-8 text-[#6F757E] text-center">{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-auto pt-6 px-6 gap-4 border-t border-gray-100">
          <span className="text-xs font-normal text-[#6F757E]">
            Showing 7 of 7 products
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

export default ProductManagement;