import React, { useRef } from "react";
import { Pencil, Loader2 } from "lucide-react";
import { CompanyForm } from "../../types";

interface BrandCardProps {
  companyForm: CompanyForm;
  onLogoUpload: (file: File) => Promise<boolean>;
  uploading: boolean;
}

const BrandCard: React.FC<BrandCardProps> = ({
  companyForm,
  onLogoUpload,
  uploading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onLogoUpload(file);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-900 mb-1">Brand</h2>
      <p className="text-xs text-gray-400 mb-6">Update your company logo.</p>
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
            {uploading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 size={20} className="animate-spin text-gray-400" />
              </div>
            ) : (
              <img
                src={companyForm.companyLogo || "/logo.png"}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute -top-1 -left-1 bg-gray-900 text-white p-1.5 rounded-full border-2 border-white hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            <Pencil size={10} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Company Name</p>
          <p className="text-sm font-medium text-gray-900">
            {companyForm.companyName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrandCard;
