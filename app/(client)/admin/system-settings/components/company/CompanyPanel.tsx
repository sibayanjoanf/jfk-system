import React from "react";
import { useCompany } from "../../hooks/useCompany";
import { useBranches } from "../../hooks/useBranches";
import BrandCard from "./BrandCard";
import BasicInfoCard from "./BasicInfoCard";
import BranchesCard from "./BranchesCard";

const CompanyPanel: React.FC = () => {
  const { companyForm, updateField, saveChanges } = useCompany();
  const {
    branches,
    newBranch,
    setNewBranch,
    showAddBranch,
    setShowAddBranch,
    addBranch,
    deleteBranch,
  } = useBranches();

  return (
    <div className="space-y-6">
      <BrandCard
        companyForm={companyForm}
        onNameChange={(name) => updateField("name", name)}
      />
      <BasicInfoCard
        companyForm={companyForm}
        onFieldChange={updateField}
        onSave={saveChanges}
      />
      <BranchesCard
        branches={branches}
        newBranch={newBranch}
        showAddBranch={showAddBranch}
        onNewBranchChange={(key, value) =>
          setNewBranch((prev) => ({ ...prev, [key]: value }))
        }
        onShowAdd={() => setShowAddBranch(!showAddBranch)}
        onAdd={addBranch}
        onCancel={() => setShowAddBranch(false)}
        onDelete={deleteBranch}
      />
    </div>
  );
};

export default CompanyPanel;
