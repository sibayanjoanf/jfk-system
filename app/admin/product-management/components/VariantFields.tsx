import React from "react";
import { Upload, Package, X } from "lucide-react";
import { VariantForm } from "../types";

const capitalizeFirstChar = (str: string) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const inputClass =
  "w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all";
const labelClass = "block text-xs font-medium text-gray-700 mb-1.5";
const errorClass = "text-xs text-red-500 mt-1";

interface VariantFieldsProps {
  variant: VariantForm;
  index: number;
  label?: string;
  errors: Record<string, string>;
  errorPrefix: string;
  onUpdate: (
    key: string,
    field: keyof VariantForm,
    value: string | File | null,
  ) => void;
  onImageChange: (key: string, file: File) => void;
  onRemove?: (key: string) => void;
  clearError?: (errorKey: string) => void;
}

const VariantFields: React.FC<VariantFieldsProps> = ({
  variant: v,
  index: i,
  label = "Variant",
  errors,
  errorPrefix,
  onUpdate,
  onImageChange,
  onRemove,
  clearError,
}) => (
  <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
    <div className="flex items-center justify-between mb-1">
      <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
        <Package size={13} className="text-red-600" />
        {label} {i + 1}
        {v.sku && (
          <span className="text-gray-400 font-normal ml-1">· {v.sku}</span>
        )}
      </p>
      {onRemove && (
        <button
          onClick={() => onRemove(v._key)}
          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <X size={13} />
        </button>
      )}
    </div>

    <div className="grid grid-cols-2 gap-3">
      {/* Image upload */}
      <label className="flex flex-col items-center justify-center w-full h-full min-h-[116px] border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-red-300 hover:bg-red-50/20 transition-colors overflow-hidden relative group">
        {v.image_preview ? (
          <>
            <img
              src={v.image_preview}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <p className="text-white text-xs font-medium">Change Image</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-gray-400">
            <Upload size={18} />
            <p className="text-xs">Click to upload</p>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            e.target.files?.[0] && onImageChange(v._key, e.target.files[0])
          }
        />
      </label>

      <div className="flex flex-col gap-3">
        <div>
          <label className={labelClass}>
            SKU <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={v.sku}
            maxLength={20}
            onChange={(e) => {
              const sanitizedValue = e.target.value
                .replace(/[^a-zA-Z0-9 ]/g, "")
                .replace(/ {2,}/g, " ")
                .toUpperCase();
              onUpdate(v._key, "sku", sanitizedValue);
              if (sanitizedValue.trim() && clearError) {
                clearError(`${errorPrefix}_sku_${i}`);
              }
            }}
            placeholder="e.g. GV AP11"
            className={`${inputClass} ${errors[`${errorPrefix}_sku_${i}`] ? "!border-red-400" : ""}`}
          />
          {errors[`${errorPrefix}_sku_${i}`] && (
            <p className={errorClass}>{errors[`${errorPrefix}_sku_${i}`]}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Dimension</label>
          <input
            type="text"
            value={v.dimension}
            maxLength={20}
            onChange={(e) => onUpdate(v._key, "dimension", e.target.value)}
            placeholder="e.g. 60x60cm"
            className={inputClass}
          />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={labelClass}>Attribute Name</label>
        <input
          type="text"
          value={v.attribute_name}
          maxLength={30}
          onChange={(e) =>
            onUpdate(v._key, "attribute_name", capitalizeFirstChar(e.target.value))
          }
          placeholder="e.g. Design, Color"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Attribute Value</label>
        <input
          type="text"
          value={v.attribute_value}
          maxLength={30}
          onChange={(e) =>
            onUpdate(v._key, "attribute_value", capitalizeFirstChar(e.target.value))
          }
          placeholder="e.g. Black, White"
          className={inputClass}
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className={labelClass}>
          Price (₱) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={12}
          value={v.price}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*(\.?\d{0,2})$/.test(val)) {
              onUpdate(v._key, "price", e.target.value);
              if (e.target.value.trim() && clearError) {
                clearError(`${errorPrefix}_price_${i}`);
              }
            }
          }}
          min="0"
          placeholder="0.00"
          className={`${inputClass} ${errors[`${errorPrefix}_price_${i}`] ? "!border-red-400" : ""}`}
        />
        {errors[`${errorPrefix}_price_${i}`] && (
          <p className={errorClass}>{errors[`${errorPrefix}_price_${i}`]}</p>
        )}
      </div>
      <div>
        <label className={labelClass}>Stock Qty</label>
        <input
          type="number"
          value={v.stock_qty}
          readOnly
          className={`${inputClass} bg-gray-50 text-gray-400 cursor-not-allowed`}
        />
        <p className="text-[10px] text-gray-400 mt-1">
          Manage stock via Inventory.
        </p>
      </div>
    </div>

    <div>
      <label className={labelClass}>Keywords</label>
      <input
        type="text"
        value={v.keywords}
        maxLength={200}
        onChange={(e) => onUpdate(v._key, "keywords", e.target.value)}
        placeholder="e.g. kitchen,fixtures,white"
        className={inputClass}
      />
    </div>
  </div>
);

export default VariantFields;