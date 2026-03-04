'use client';

import React, { useState } from 'react';
import { Search, Plus, Trash2, ChevronDown } from 'lucide-react';
import HeaderUser from '@/components/admin/HeaderUser';
import HeaderNotifications from '@/components/admin/HeaderNotif';

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
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Mock Data matching the Product List design
  const products: Product[] = [
    { id: '1', name: 'Product Name', type: 'Product Type', suk: 'EL-00552', status: 'Out of Stock', price: 130, category: 'Tiles', stock: 0 },
    { id: '2', name: 'Product Name', type: 'Product Type', suk: 'EL-00551', status: 'In Stock', price: 45, category: 'Fixtures', stock: 504 },
    { id: '3', name: 'Product Name', type: 'Product Type', suk: 'EL-00550', status: 'Low Stock', price: 80, category: 'Stones', stock: 12 },
    { id: '4', name: 'Product Name', type: 'Product Type', suk: 'EL-00549', status: 'In Stock', price: 500, category: 'Fixtures', stock: 59 },
    { id: '5', name: 'Product Name', type: 'Product Type', suk: 'EL-00548', status: 'Low Stock', price: 15, category: 'Stones', stock: 4 },
    { id: '6', name: 'Product Name', type: 'Product Type', suk: 'EL-00547', status: 'In Stock', price: 500, category: 'Tiles', stock: 173 },
    { id: '7', name: 'Product Name', type: 'Product Type', suk: 'EL-00553', status: 'Out of Stock', price: 420, category: 'Tiles', stock: 0 },
  ];

  const filteredProducts = products.filter(p => {
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesCategory && matchesStatus;
  });

  const allSelected = filteredProducts.length > 0 && filteredProducts.every(p => selectedIds.includes(p.id));
  const someSelected = selectedIds.length > 0;

  // Checkbox that ticks all other checkboxes
  const toggleAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(filteredProducts.map(p => p.id));
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Option to delete them all
  const deleteSelected = () => {
    // wire to your delete logic here
    setSelectedIds([]);
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'In Stock': return 'text-white bg-green-500';
      case 'Low Stock': return 'text-white bg-orange-400';
      case 'Out of Stock': return 'text-white bg-red-600';
      default: return 'text-gray-500 bg-gray-50';
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
            <h1 className="text-lg font-semibold text-gray-900">Product List</h1>
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

      {/* 3. Product Management Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Product Management</h2>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
              All products available in the system are listed below with their respective SUKs.<br />
              Click on a specific product to view or edit its complete details.
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

            {/* Category Filter */}
            <div className="relative">
              <button
                onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsStatusOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2 text-xs border rounded-lg font-medium transition-colors ${
                  isCategoryOpen ? 'bg-red-600 text-white border-red-600' : 'border-red-200 text-red-600 hover:bg-red-50'
                }`}
              >
                <span>{categoryFilter}</span>
                <ChevronDown size={14} />
              </button>

              {isCategoryOpen && (
                <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                  {['All', 'Tiles', 'Stones', 'Fixtures'].map((cat) => (
                    <button
                      key={cat}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${cat === categoryFilter ? 'text-red-600 font-medium' : 'text-gray-600'}`}
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
              <button
                onClick={() => { setIsStatusOpen(!isStatusOpen); setIsCategoryOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2 text-xs border rounded-lg font-medium transition-colors ${
                  isStatusOpen ? 'bg-red-600 text-white border-red-600' : 'border-red-200 text-red-600 hover:bg-red-50'
                }`}
              >
                <span>{statusFilter}</span>
                <ChevronDown size={14} />
              </button>

              {isStatusOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                  {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map((status) => (
                    <button
                      key={status}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-100 transition-colors ${status === statusFilter ? 'text-red-600 font-medium' : 'text-gray-600'}`}
                      onClick={() => { setStatusFilter(status); setIsStatusOpen(false); }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add product button */}
            <button className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors">
              <Plus size={14} />
              Add Product
            </button>
          </div>
        </div>

        {/* 4. Products Table */}
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
                <th className="py-3 px-4 font-semibold text-left">Product</th>
                <th className="py-3 px-4 font-semibold text-center">SKU</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-center">Price</th>
                <th className="py-3 px-4 font-semibold text-center">Category</th>
                <th className="py-3 pr-6 font-semibold text-center">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className={`hover:bg-gray-100 transition-colors cursor-pointer ${selectedIds.includes(product.id) ? 'bg-red-50/80' : ''}`}
                >
                  <td className="py-3.5 pl-5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggleOne(product.id)}
                      className="w-3.5 h-3.5 rounded border-gray-300 accent-red-600 cursor-pointer"
                    />
                  </td>
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg overflow-hidden shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.type}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-gray-500 text-center">{product.suk}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(product.status)}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-gray-700 font-medium text-center">₱{product.price.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-sm text-gray-500 text-center">{product.category}</td>
                  <td className="py-3.5 pr-6 text-sm text-gray-500 text-center">{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 gap-4 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            Showing {filteredProducts.length} of {products.length} products
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

export default ProductManagement;