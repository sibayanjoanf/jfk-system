"use client";

import React, { useState, useRef, useEffect } from "react";
import PhoneInput, {
  Country,
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import en from "react-phone-number-input/locale/en.json";
import "react-phone-number-input/style.css";

interface CountryOption {
  value: Country;
  label: string;
  calling: string;
}

const countryOptions: CountryOption[] = getCountries().map((country) => ({
  value: country,
  label: en[country],
  calling: `+${getCountryCallingCode(country)}`,
}));

interface CustomCountrySelectProps {
  value: Country;
  onChange: (country: Country) => void;
  [key: string]: unknown;
}

const CustomCountrySelect = ({ value, onChange }: CustomCountrySelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const Flag = flags[value];

  const filtered = countryOptions.filter((c) =>
    c.label.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex items-center">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setSearch("");
        }}
        className="flex items-center gap-1.5 pr-3 border-r border-gray-200 mr-1 cursor-pointer"
      >
        <div className="w-5 h-3.5 overflow-hidden rounded-[3px] shrink-0 shadow-sm ring-1 ring-black/10">
          {Flag && <Flag title={value} />}
        </div>
        <svg
          className="w-3 h-3 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full -left-3 mt-6 w-65 bg-white border border-gray-100 rounded-2xl shadow-xl z-[9999] overflow-hidden">
          {/* Search */}
          <div className="p-2">
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
              <svg
                className="w-3.5 h-3.5 text-gray-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search country..."
                className="bg-transparent text-xs text-gray-700 outline-none w-full placeholder-gray-400"
              />
            </div>
          </div>

          {/* Options */}
          <div className="overflow-y-auto max-h-52 px-2 pb-2">
            {filtered.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                No results
              </p>
            ) : (
              filtered.map((c) => {
                const CFlag = flags[c.value];
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => {
                      onChange(c.value);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left hover:bg-gray-100 transition-colors ${
                      value === c.value ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="w-5 h-3.5 overflow-hidden rounded-[3px] shrink-0 shadow-sm ring-1 ring-black/10">
                      {CFlag && <CFlag title={c.label} />}
                    </div>
                    <span className="text-sm text-gray-700 flex-1 truncate">
                      {c.label}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface ContactInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  className?: string;
}

export const ContactInput: React.FC<ContactInputProps> = ({
  value,
  onChange,
  error,
  label = "Contact Number",
  className = "",
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
        className={`flex items-center px-3 bg-gray-50/50 border rounded-md h-10.25 shadow-xs transition-all focus-within:bg-white focus-within:ring-1 ${
          error
            ? "border-red-400 focus-within:ring-red-400"
            : "border-gray-200 focus-within:ring-red-500 focus-within:border-red-500"
        } ${className}`}
      >
        <PhoneInput
          international
          defaultCountry="PH"
          value={formattedValue}
          onChange={(val) => onChange(val ?? "")}
          countrySelectComponent={CustomCountrySelect}
          flags={flags}
          labels={en}
          className="flex-1 flex items-center"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      <style jsx global>{`
        .PhoneInput {
          display: flex;
          align-items: center;
          width: 100%;
        }
        .PhoneInputCountry {
          display: flex;
          align-items: center;
        }
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
