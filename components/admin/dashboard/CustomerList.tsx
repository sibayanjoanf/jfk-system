import React from "react";
import { Mail } from "lucide-react";

interface Customer {
  name: string;
  location: string;
  avatar?: string; // if may image ng customer
}

interface CustomerListProps {
  customers: Customer[];
}

const CustomerList: React.FC<CustomerListProps> = ({ customers }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-80 flex flex-col">
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-semibold text-[#050F24]">New Customers</h3>
      <button className="text-gray-500 hover:text-gray-700 transition-colors">
        •••
      </button>
    </div>

    <div className="space-y-5 flex-1">
      {customers.map((c, i) => (
        <div
          key={i}
          className="flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              <span className="text-lg">👤</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-normal text-[#050F24] group-hover:text-[#DF2025] transition-colors truncate">
                {c.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{c.location}</p>
            </div>
          </div>

          <button
            className="p-2 bg-[#F5F5F5] text-[#DF2025] rounded-lg group-hover:bg-[#DF2025] group-hover:text-white transition-all flex-shrink-0"
            aria-label={`Email ${c.name}`}
          >
            <Mail size={15} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default CustomerList;
