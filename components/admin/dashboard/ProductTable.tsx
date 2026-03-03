import React from 'react';

interface Product {
  name: string;
  type: string;
  orders: string | number;
  price: string | number;
  category: string;
  refunds: string;
}

interface ProductTableProps {
  products: Product[];
}

const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  return (
    <div className="bg-white rounded-[32px] pt-6 pb-6 pl-0 pr-0 border border-gray-100 shadow-sm min-h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold pb-5 mb-6 px-6 text-[#050F24] border-b border-gray-200">
        Top Selling Product
      </h3>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-[600px] w-full align-middle">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[#050F24] text-sm tracking-wider">
                <th className="pb-4 font-semibold text-left pl-8 w-[30%]">Product</th>
                <th className="pb-4 font-semibold text-center w-[15%]">Orders</th>
                <th className="pb-4 font-semibold text-center w-[15%]">Price</th>
                <th className="pb-4 font-semibold text-center w-[20%]">Category</th>
                <th className="pb-4 font-semibold text-center w-[12%] pr-5">Refunds</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 flex items-center gap-3 pl-8">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                       𖣯
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[#050F24] truncate">{p.name}</p>
                      <p className="text-xs text-[#6F757E]">{p.type}</p>
                    </div>
                  </td>
                  <td className="text-center text-sm font-normal text-[#6F757E]">{p.orders}</td>
                  <td className="text-center text-sm font-normal text-[#6F757E]">₱{p.price}</td>
                  <td className="text-center text-sm text-[#6F757E]">{p.category}</td>
                  <td className="text-center text-sm font-normal text-[#6F757E] pr-6">{p.refunds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-auto pt-6 px-6 gap-4 border-t border-gray-100">
        <span className="text-xs font-normal text-[#6F757E]">
          Showing {products.length} of {products.length} products
        </span>
        <div className="flex items-center gap-2">
          <button className="px-2 text-[#6F757E] text-xs font-normal hover:text-[#DF2025]">Prev</button>
          <button className="w-8 h-8 rounded-full bg-[#DF2025] text-white text-xs font-bold shadow-md shadow-red-100">1</button>
          <button className="w-8 h-8 rounded-full bg-gray-100 text-[#6F757E] text-xs hover:bg-gray-200 transition-colors overflow-hidden">2</button>
          <button className="px-2 text-[#DF2025] text-xs font-normal hover:underline">Next</button>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;