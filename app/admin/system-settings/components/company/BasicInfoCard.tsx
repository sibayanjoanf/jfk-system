import React, { useState } from "react";
import { CompanyForm } from "../../types";
import { ContactInput } from "@/components/admin/ContactInput";

interface BasicInfoCardProps {
  companyForm: CompanyForm;
  onFieldChange: (key: keyof CompanyForm, value: string) => void;
  onSave: () => void;
  saving: boolean;
}

const fields = [
  {
    label: "Branch Name",
    key: "branchName" as keyof CompanyForm,
    placeholder: "Branch name",
  },
  {
    label: "Address",
    key: "address" as keyof CompanyForm,
    placeholder: "Business address",
  },
  {
    label: "Phone",
    key: "phone" as keyof CompanyForm,
    placeholder: "Mobile number",
  },
  {
    label: "Telephone",
    key: "telephone" as keyof CompanyForm,
    placeholder: "Telephone number",
  },
  {
    label: "Email Address",
    key: "companyEmail" as keyof CompanyForm,
    placeholder: "Business email",
  },
];

const capitalizeFirst = (val: string) => {
  if (!val) return val;
  return val.charAt(0).toUpperCase() + val.slice(1);
};

const validateEmailFormat = (val: string) => {
  if (val.length > 100) return false;
  if (!/^[a-zA-Z0-9]/.test(val)) return false;
  if (/\.\./.test(val)) return false;

  const parts = val.split("@");
  if (parts.length !== 2) return false;

  const beforeAt = parts[0];
  const afterAt = parts[1];

  if (!beforeAt || !afterAt) return false;
  if (!/^[a-zA-Z0-9_.+-]+$/.test(beforeAt)) return false;
  if (beforeAt.endsWith(".")) return false;
  if (!/^[a-zA-Z0-9.-]+$/.test(afterAt)) return false;
  if (afterAt.startsWith(".") || afterAt.endsWith(".")) return false;

  return true;
};

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({
  companyForm,
  onFieldChange,
  onSave,
  saving,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSaveClick = () => {
    const newErrors: Record<string, string> = {};
    let hasError = false;

    if (
      !companyForm.branchName ||
      String(companyForm.branchName).trim() === ""
    ) {
      newErrors.branchName = "Branch name is required";
      hasError = true;
    }
    if (!companyForm.address || String(companyForm.address).trim() === "") {
      newErrors.address = "Company address is required";
      hasError = true;
    }
    if (!companyForm.phone || String(companyForm.phone).trim() === "") {
      newErrors.phone = "Phone number is required";
      hasError = true;
    }
    if (!companyForm.telephone || String(companyForm.telephone).trim() === "") {
      newErrors.telephone = "Telephone number is required";
      hasError = true;
    }

    const email = companyForm.companyEmail
      ? String(companyForm.companyEmail).trim()
      : "";
    if (!email) {
      newErrors.companyEmail = "This cannot be empty";
      hasError = true;
    } else if (!validateEmailFormat(email)) {
      newErrors.companyEmail = "Invalid email format";
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      onSave();
    }
  };

  const handleChange = (key: keyof CompanyForm, value: string) => {
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }

    if (key === "branchName") {
      if (value.length <= 30) {
        onFieldChange(key, capitalizeFirst(value));
      }
    } else if (key === "address") {
      if (value.length <= 100) {
        onFieldChange(key, capitalizeFirst(value));
      }
    } else if (key === "telephone") {
      const digits = value.replace(/\D/g, "");
      if (digits.length <= 7) {
        onFieldChange(key, digits);
      }
    } else if (key === "companyEmail") {
      if (value.length <= 100) {
        onFieldChange(key, value);
      }
    } else {
      onFieldChange(key, value);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-1">
        Basic Information
      </h2>
      <p className="text-xs text-gray-400 mb-6">
        Contact details shown to customers.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ label, key, placeholder }) => {
          if (key === "phone") {
            return (
              <div key={key}>
                <ContactInput
                  label={label}
                  value={String(companyForm[key] || "")}
                  error={errors[key]}
                  onChange={(value) => handleChange(key, value)}
                />
              </div>
            );
          }

          return (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                {label}
              </label>
              <input
                type="text"
                value={companyForm[key] || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={placeholder}
                className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all ${
                  errors[key] ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors[key] && (
                <p className="text-xs text-red-500 mt-1">{errors[key]}</p>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
        <button
          onClick={handleSaveClick}
          disabled={saving}
          className="px-5 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default BasicInfoCard;
