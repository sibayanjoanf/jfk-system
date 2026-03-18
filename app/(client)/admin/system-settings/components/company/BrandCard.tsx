import React from "react";
import { Pencil } from "lucide-react";
import { CompanyForm } from "../../types";

interface BrandCardProps {
  companyForm: CompanyForm;
  onNameChange: (name: string) => void;
}

const BrandCard: React.FC<BrandCardProps> = ({ companyForm, onNameChange }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <h2 className="text-base font-semibold text-gray-900 mb-1">Brand</h2>
    <p className="text-xs text-gray-400 mb-6">
      Update your company logo and display name.
    </p>
    <div className="flex items-center gap-5">
      <div className="relative shrink-0">
        <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-100 bg-gray-50">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-full h-full object-cover"
          />
        </div>
        <button className="absolute -top-1 -left-1 bg-gray-900 text-white p-1.5 rounded-full border-2 border-white hover:bg-red-600 transition-colors">
          <Pencil size={10} />
        </button>
      </div>
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          Company Name
        </label>
        <input
          type="text"
          value={companyForm.name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
        />
      </div>
    </div>
  </div>
);

export default BrandCard;
