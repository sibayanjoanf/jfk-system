import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { CompanyForm } from "../types";

export const useCompany = () => {
  const [companyForm, setCompanyForm] = useState<CompanyForm>({
    companyName: "",
    companyLogo: "",
    branchName: "",
    address: "",
    phone: "",
    telephone: "",
    companyEmail: "",
  });
  const [rowId, setRowId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      const { data, error } = await supabase
        .from("info_branch")
        .select("*")
        .single();

      if (!error && data) {
        setRowId(data.id);
        setCompanyForm({
          companyName: data.company_name ?? "",
          companyLogo: data.company_logo ?? "",
          branchName: data.name ?? "",
          address: data.address ?? "",
          phone: data.phone ?? "",
          telephone: data.telephone ?? "",
          companyEmail: data.company_email ?? "",
        });
      }
      setLoading(false);
    };

    fetchCompany();
  }, []);

  const updateField = (key: keyof CompanyForm, value: string) =>
    setCompanyForm((prev) => ({ ...prev, [key]: value }));

  const uploadLogo = async (file: File): Promise<boolean> => {
  setUploading(true);
  try {
    const ext = file.name.split(".").pop();
    const path = `company/logo.${ext}`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);

    const res = await fetch("/api/upload", { 
      method: "POST",
      body: formData,
    });

    if (!res.ok) return false;

    const { url } = await res.json();

    setCompanyForm((prev) => ({ ...prev, companyLogo: url }));

    await supabase
      .from("info_branch")
      .update({ company_logo: url })
      .eq("id", rowId);

    return true;
  } catch {
    return false;
  } finally {
    setUploading(false);
  }
};

  const saveChanges = async (): Promise<boolean> => {
    if (!rowId) {
      console.error("No row ID found, cannot save.");
      return false;
    }

    setSaving(true);

    const { error } = await supabase
      .from("info_branch")
      .update({
        company_name: companyForm.companyName,
        name: companyForm.branchName,
        address: companyForm.address,
        phone: companyForm.phone,
        telephone: companyForm.telephone,
        company_email: companyForm.companyEmail,
      })
      .eq("id", rowId);

    setSaving(false);

    if (error) {
      console.error("Failed to save:", error.message);
      return false;
    }
    return true;
  };

  return {
    companyForm,
    updateField,
    saveChanges,
    uploadLogo,
    loading,
    saving,
    uploading,
  };
};