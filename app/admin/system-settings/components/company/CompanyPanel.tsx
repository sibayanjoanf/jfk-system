import React, { useState } from "react";
import { useCompany } from "../../hooks/useCompany";
import BrandCard from "./BrandCard";
import BasicInfoCard from "./BasicInfoCard";

const CompanyPanel: React.FC = () => {
  const {
    companyForm,
    updateField,
    saveChanges,
    uploadLogo,
    saving,
    uploading,
  } = useCompany();
  const [errorOpen, setErrorOpen] = useState(false);

  const handleSave = async () => {
    const success = await saveChanges();
    if (!success) setErrorOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <BrandCard
          companyForm={companyForm}
          onNameChange={(name) => updateField("companyName", name)}
          onLogoUpload={uploadLogo}
          uploading={uploading}
        />
        <BasicInfoCard
          companyForm={companyForm}
          onFieldChange={updateField}
          onSave={handleSave}
          saving={saving}
        />
      </div>

      {/* Error Modal */}
      {errorOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setErrorOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Failed to save
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Something went wrong while saving your changes. Please try again.
            </p>
            <div className="flex justify-end mt-5">
              <button
                onClick={() => setErrorOpen(false)}
                className="w-full px-4 py-2 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyPanel;
