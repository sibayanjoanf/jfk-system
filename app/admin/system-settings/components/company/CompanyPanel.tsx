import React, { useState } from "react";
import { useCompany } from "../../hooks/useCompany";
import BrandCard from "./BrandCard";
import BasicInfoCard from "./BasicInfoCard";
import ConfirmModal from "../../../components/ConfirmModal";

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

  const handleLogoUpload = async (file: File) => {
    const success = await uploadLogo(file);
    if (!success) setErrorOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <BrandCard
          companyForm={companyForm}
          onNameChange={(name) => updateField("companyName", name)}
          onLogoUpload={handleLogoUpload}
          uploading={uploading}
        />
        <BasicInfoCard
          companyForm={companyForm}
          onFieldChange={updateField}
          onSave={handleSave}
          saving={saving}
        />
      </div>

      <ConfirmModal
        open={errorOpen}
        title="Failed to save"
        description="Something went wrong while saving your changes. Please try again."
        confirmLabel="Okay"
        cancelLabel="Close"
        variant="danger"
        onConfirm={() => setErrorOpen(false)}
        onCancel={() => setErrorOpen(false)}
      />
    </>
  );
};

export default CompanyPanel;
