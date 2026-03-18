import React from "react";
import { CompanyForm } from "../../types";

interface BasicInfoCardProps {
  companyForm: CompanyForm;
  onFieldChange: (key: keyof CompanyForm, value: string) => void;
  onSave: () => void;
}

const fields = [
  {
    label: "Address",
    key: "address" as keyof CompanyForm,
    placeholder: "Business address",
  },
  {
    label: "Contact Number",
    key: "contact" as keyof CompanyForm,
    placeholder: "Mobile number",
  },
  {
    label: "Email Address",
    key: "email" as keyof CompanyForm,
    placeholder: "Business email",
  },
];

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({
  companyForm,
  onFieldChange,
  onSave,
}) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <h2 className="text-base font-semibold text-gray-900 mb-1">
      Basic Information
    </h2>
    <p className="text-xs text-gray-400 mb-6">
      Contact details shown to customers.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fields.map(({ label, key, placeholder }) => (
        <div key={key}>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            {label}
          </label>
          <input
            type="text"
            value={companyForm[key]}
            onChange={(e) => onFieldChange(key, e.target.value)}
            placeholder={placeholder}
            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all"
          />
        </div>
      ))}
    </div>
    <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
      <button
        onClick={onSave}
        className="px-5 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
      >
        Save Changes
      </button>
    </div>
  </div>
);

export default BasicInfoCard;
