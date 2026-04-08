"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface InvoiceConfig {
  id?: string;
  company_name: string;
  company_address: string;
  company_phone: string;
  company_email: string;
  company_logo: string;
  footer_note: string;
}

const DEFAULT_CONFIG: InvoiceConfig = {
  company_name: "Your Company",
  company_address: "123 Main St, City",
  company_phone: "+63 XXX XXX XXXX",
  company_email: "info@company.com",
  company_logo: "",
  footer_note: "Thank you for your purchase!",
};

const inputClass =
  "w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 focus:bg-white transition-all";
const labelClass = "block text-xs font-medium text-gray-600 mb-1.5";

const InvoiceTemplate: React.FC = () => {
  const [config, setConfig] = useState<InvoiceConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase
        .from("invoice_config")
        .select("*")
        .single();
      if (data) setConfig(data);
      setLoading(false);
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    if (config.id) {
      await supabase.from("invoice_config").update(config).eq("id", config.id);
    } else {
      const { data } = await supabase
        .from("invoice_config")
        .insert(config)
        .select()
        .single();
      if (data) setConfig(data);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        <Loader2 className="animate-spin" size={20} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Invoice Template
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Customize what appears on customer invoices.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Save size={13} />
            )}
            {saved ? "Saved!" : "Save"}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Company Name</label>
            <input
              type="text"
              value={config.company_name}
              onChange={(e) =>
                setConfig({ ...config, company_name: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <input
              type="text"
              value={config.company_address}
              onChange={(e) =>
                setConfig({ ...config, company_address: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input
              type="text"
              value={config.company_phone}
              onChange={(e) =>
                setConfig({ ...config, company_phone: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={config.company_email}
              onChange={(e) =>
                setConfig({ ...config, company_email: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Footer Note</label>
            <input
              type="text"
              value={config.footer_note}
              onChange={(e) =>
                setConfig({ ...config, footer_note: e.target.value })
              }
              className={inputClass}
              placeholder="Thank you for your purchase!"
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-6">
          Live Preview
        </h2>
        <div className="bg-gray-50 rounded-xl p-6">
          <div
            className="bg-white shadow-sm"
            style={{
              padding: "40px",
              fontFamily: "'Times New Roman', Times, serif",
            }}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
              <div>
                {config.company_logo && (
                  <img
                    src={config.company_logo}
                    alt="Logo"
                    className="h-10 mb-3 object-contain"
                  />
                )}
                <p className="text-xl font-bold tracking-tight text-gray-900">
                  {config.company_name || "—"}
                </p>
                <div className="mt-2 space-y-0.5">
                  <p className="text-xs text-gray-500">
                    {config.company_address || "—"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {config.company_phone || "—"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {config.company_email || "—"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black tracking-tight text-gray-900">
                  INVOICE
                </p>
                <div className="mt-2 space-y-0.5">
                  <p className="text-sm font-mono font-semibold text-gray-700">
                    ORD-20260331-001
                  </p>
                  <p className="text-xs text-gray-500">March 31, 2026</p>
                </div>
              </div>
            </div>

            {/* Dividers */}
            <div className="border-t-2 border-gray-900 mb-1" />
            <div className="border-t border-gray-200 mb-8" />

            {/* Issued To + Order Info */}
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
                  Issued To
                </p>
                <p className="text-sm font-bold text-gray-900">
                  Juan Dela Cruz
                </p>
                <p className="text-xs text-gray-500 mt-1">juan@email.com</p>
                <p className="text-xs text-gray-500 mt-0.5">09XX XXX XXXX</p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">
                  Order Info
                </p>
                <div className="space-y-1.5">
                  {[
                    { label: "Delivery", value: "Pickup" },
                    { label: "Payment", value: "Cash" },
                    { label: "Type", value: "Walk-in" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-xs text-gray-400">{label}</span>
                      <span className="text-xs font-medium text-gray-700 capitalize">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="border-b border-gray-900">
                  <th className="text-left text-xs font-bold tracking-widest uppercase text-gray-400 pb-3">
                    Description
                  </th>
                  <th className="text-center text-xs font-bold tracking-widest uppercase text-gray-400 pb-3">
                    Qty
                  </th>
                  <th className="text-right text-xs font-bold tracking-widest uppercase text-gray-400 pb-3">
                    Unit Price
                  </th>
                  <th className="text-right text-xs font-bold tracking-widest uppercase text-gray-400 pb-3">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4">
                    <p className="text-sm font-semibold text-gray-900">
                      Sample Product
                    </p>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                      SKU-001
                    </p>
                  </td>
                  <td className="py-4 text-sm text-gray-600 text-center">2</td>
                  <td className="py-4 text-sm text-gray-600 text-right">
                    ₱745.00
                  </td>
                  <td className="py-4 text-sm font-semibold text-gray-900 text-right">
                    ₱1,490.00
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Subtotal</span>
                  <span>₱1,490.00</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Tax</span>
                  <span>—</span>
                </div>
                <div className="border-t-2 border-gray-900 pt-2 flex justify-between items-center">
                  <span className="text-sm font-bold tracking-wide uppercase text-gray-900">
                    Total
                  </span>
                  <span className="text-xl font-black text-gray-900">
                    ₱1,490.00
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between items-end">
              <p className="text-xs text-gray-400 italic">
                {config.footer_note || "—"}
              </p>
              <p className="text-xs text-gray-300 font-mono">
                ORD-20260331-001
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
