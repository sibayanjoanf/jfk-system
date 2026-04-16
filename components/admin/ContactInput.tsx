"use client";

import React from "react";
import PhoneInput, {
  Country,
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import Select, {
  components,
  SingleValueProps,
  OptionProps,
} from "react-select";
import en from "react-phone-number-input/locale/en.json";
import "react-phone-number-input/style.css";

interface CountryOption {
  value: Country;
  label: string;
}

const countryOptions: CountryOption[] = getCountries().map((country) => ({
  value: country,
  label: `${en[country]} +${getCountryCallingCode(country)}`,
}));

interface CustomCountrySelectProps {
  value: Country;
  onChange: (country: Country) => void;
}

const CustomCountrySelect = ({ value, onChange }: CustomCountrySelectProps) => {
  const selected = countryOptions.find((o) => o.value === value);

  return (
    <Select<CountryOption>
      value={selected}
      onChange={(opt) => opt && onChange(opt.value)}
      options={countryOptions}
      menuPortalTarget={typeof document !== "undefined" ? document.body : null}
      closeMenuOnScroll={(e) => e.target === document}
      blurInputOnSelect={true}
      menuShouldBlockScroll={false}
      styles={{
        control: () => ({
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          background: "transparent",
          border: "none",
          borderRight: "1px solid #e5e7eb",
          boxShadow: "none",
          minHeight: "unset",
          gap: "4px",
          paddingRight: "10px",
        }),
        valueContainer: (base) => ({ ...base, padding: 0 }),
        singleValue: (base) => ({
          ...base,
          margin: 0,
          display: "flex",
          alignItems: "center",
        }),
        dropdownIndicator: (base) => ({
          ...base,
          padding: "0 2px",
          color: "#ef4444",
          "&:hover": { color: "#dc2626" },
        }),
        indicatorSeparator: () => ({ display: "none" }),
        menu: (base) => ({
          ...base,
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)",
          border: "1px solid #f1f5f9",
          width: "220px",
          zIndex: 9999,
          padding: "4px",
        }),
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        option: (base, state) => ({
          ...base,
          fontSize: "0.75rem",
          padding: "7px 10px",
          borderRadius: "8px",
          marginBottom: "1px",
          backgroundColor: state.isSelected
            ? "#ef4444"
            : state.isFocused
              ? "#fef2f2"
              : "transparent",
          color: state.isSelected ? "white" : "#111827",
          cursor: "pointer",
          "&:active": { backgroundColor: "#dc2626", color: "white" },
        }),
        input: (base) => ({ ...base, display: "none" }),
      }}
      components={{
        SingleValue: ({ data }: SingleValueProps<CountryOption>) => {
          const Flag = flags[data.value];
          return (
            <div className="flex items-center gap-2">
              <div className="w-5 h-3.5 overflow-hidden rounded-[3px] shrink-0 shadow-sm ring-1 ring-black/10">
                {Flag && <Flag title={data.label} />}
              </div>
            </div>
          );
        },
        Option: ({ data, ...props }: OptionProps<CountryOption>) => {
          const Flag = flags[data.value];
          return (
            <components.Option data={data} {...props}>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-3.5 overflow-hidden rounded-[3px] shrink-0 shadow-sm ring-1 ring-black/10">
                  {Flag && <Flag title={data.label} />}
                </div>
                <span className="text-gray-700">{en[data.value]}</span>
                <span className="ml-auto text-gray-300 text-[11px] tabular-nums">
                  +{getCountryCallingCode(data.value)}
                </span>
              </div>
            </components.Option>
          );
        },
      }}
    />
  );
};

interface ContactInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
}

export const ContactInput: React.FC<ContactInputProps> = ({
  value,
  onChange,
  error,
  label = "Contact Number",
}) => {
  const formattedValue = value && !value.startsWith("+") ? `+${value}` : value;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div
        className={`flex items-center px-3 bg-gray-50/50 border rounded-md h-12 shadow-sm transition-all focus-within:bg-white focus-within:ring-1 ${
          error
            ? "border-red-400 focus-within:ring-red-400"
            : "border-gray-200 focus-within:ring-red-500 focus-within:border-red-500"
        }`}
      >
        <PhoneInput
          international
          defaultCountry="PH"
          value={formattedValue}
          onChange={(val) => onChange(val ?? "")}
          countrySelectComponent={CustomCountrySelect}
          className="flex-1 flex items-center"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      <style jsx global>{`
        .PhoneInput input {
          border: none !important;
          background: transparent !important;
          font-size: 0.875rem !important;
          color: #111827 !important;
          outline: none !important;
          width: 100%;
          padding: 0 8px !important;
        }

        .PhoneInput input::placeholder {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};
