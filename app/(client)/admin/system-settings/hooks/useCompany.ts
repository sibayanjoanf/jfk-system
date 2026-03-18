import { useState } from "react";
import { CompanyForm } from "../types";

export const useCompany = () => {
  const [companyForm, setCompanyForm] = useState<CompanyForm>({
    name: "JFK Tile and Stone Builders",
    address: "",
    contact: "",
    email: "",
  });

  const updateField = (key: keyof CompanyForm, value: string) =>
    setCompanyForm((prev) => ({ ...prev, [key]: value }));

  const saveChanges = () => {
    // TODO: wire up to backend
    console.log("Saving company info:", companyForm);
  };

  return { companyForm, setCompanyForm, updateField, saveChanges };
};