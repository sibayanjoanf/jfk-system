"use client";

import React, { useEffect, useState, useRef } from "react";
import { Order } from "../../types";
import { supabase } from "@/lib/supabase";

interface InvoiceConfig {
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

interface Props {
  order: Order;
  onClose: () => void;
}

const InvoiceDownload: React.FC<Props> = ({ order, onClose }) => {
  const [config, setConfig] = useState<InvoiceConfig>(DEFAULT_CONFIG);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data } = await supabase
        .from("invoice_config")
        .select("*")
        .single();
      if (data) setConfig(data);
    };
    fetchConfig();
  }, []);

  const handlePrint = (currentConfig: InvoiceConfig) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const subtotal = order.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    );

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice - ${order.order_number}</title>
        <meta charset="utf-8" />
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            color: #111;
            background: #fff;
            -webkit-print-color-adjust: exact;
          }
          .invoice {
            max-width: 680px;
            margin: 0 auto;
            padding: 48px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
          }
          .company-name {
            font-size: 18px;
            font-weight: 800;
            letter-spacing: -0.5px;
            color: #333;
          }
          .company-details {
            margin-top: 8px;
            font-size: 11px;
            color: #666;
            line-height: 1.8;
          }
          .invoice-title {
            font-size: 36px;
            font-weight: 900;
            letter-spacing: -1px;
            color: #333;
            text-align: right;
          }
          .invoice-meta {
            margin-top: 8px;
            font-size: 11px;
            color: #666;
            text-align: right;
            line-height: 1.8;
          }
          .invoice-number {
            font-family: monospace;
            font-size: 12px;
            font-weight: 700;
            color: #333;
          }
          .status-badge {
            display: inline-block;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
            padding: 3px 10px;
            border: 1.5px solid #111;
            border-radius: 100px;
            margin-top: 6px;
          }
          .divider-thick {
            border: none;
            border-top: 1px solid #111;
            margin-bottom: 2px;
          }
          .divider-thin {
            border: none;
            border-top: 1px solid #e0e0e0;
            margin-bottom: 35px;
          }
          .two-col {
            display: flex;
            justify-content: space-between;
            gap: 40px;
            margin-bottom: 0px;
          }
          .col { flex: 1; }
          .section-label {
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #aaa;
            margin-bottom: 10px;
          }
          .bill-name {
            font-size: 13px;
            font-weight: 700;
            color: #111;
          }
          .bill-detail {
            font-size: 11px;
            color: #666;
            margin-top: 3px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            margin-bottom: 5px;
          }
          .info-label { color: #666; }
          .info-value { font-weight: 600; color: #333; text-transform: capitalize; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          thead tr {
            border-bottom: 1px solid #111;
          }
          th {
            font-size: 9px;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #aaa;
            padding: 0 0 10px 0;
            text-align: left;
          }
          th.center { text-align: center; }
          th.right { text-align: right; }
          td {
            font-size: 12px;
            color: #333;
            padding: 14px 0;
            border-bottom: 1px solid #f0f0f0;
            vertical-align: top;
          }
          td.center { text-align: center; }
          td.right { text-align: right; }
          .item-name {
            font-size: 13px;
            font-weight: 700;
            color: #111;
          }
          .item-sku {
            font-size: 10px;
            color: #aaa;
            font-family: monospace;
            margin-top: 3px;
          }
          .totals-wrap {
            display: flex;
            justify-content: flex-end;
            margin-top: 8px;
          }
          .totals {
            width: 240px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #888;
            padding: 4px 0;
          }
          .total-final-wrap {
            border-top: 1px solid #111;
            margin-top: 8px;
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .total-label {
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #111;
          }
          .total-amount {
            font-size: 20px;
            font-weight: 900;
            color: #111;
          }
          .footer {
            margin-top: 48px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .footer-note {
            font-size: 11px;
            color: #aaa;
            font-style: italic;
          }
          .footer-ref {
            font-size: 10px;
            color: #ddd;
            font-family: monospace;
          }
          @page {
            margin: 48px;
          }
          @media print {
            body { margin: 0; }
            .invoice { padding: 48px; }
            thead tr th {
              padding-top: 50px;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice">

          <!-- Header -->
          <div class="header">
            <div>
              ${currentConfig.company_logo ? `<img src="${currentConfig.company_logo}" style="height:36px;margin-bottom:10px;object-fit:contain;" />` : ""}
              <div class="company-name">${currentConfig.company_name}</div>
              <div class="company-details">
                ${currentConfig.company_address}<br/>
                ${currentConfig.company_phone}<br/>
                ${currentConfig.company_email}
              </div>
            </div>
            <div style="text-align:right;">
              <div class="invoice-title">INVOICE</div>
              <div class="invoice-meta">
                <span class="invoice-number">${order.order_number}</span><br/>
                ${new Date(order.created_at).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}<br/>
              </div>
            </div>
          </div>

          <!-- Dividers -->
          <hr class="divider-thick" />
          <hr class="divider-thin" />

          <!-- Bill To + Order Info -->
          <div class="two-col">
            <div class="col">
              <div class="section-label">Issued To</div>
              <div class="bill-name">${order.first_name} ${order.last_name}</div>
              ${order.email ? `<div class="bill-detail">${order.email}</div>` : ""}
              <div class="bill-detail">${order.phone}</div>
            </div>
            <div class="col">
              <div class="section-label">Order Info</div>
              <div class="info-row"><span class="info-label">Delivery</span><span class="info-value">${order.delivery_preference}</span></div>
              <div class="info-row"><span class="info-label">Payment</span><span class="info-value">${order.payment_preference}</span></div>
              <div class="info-row"><span class="info-label">Type</span><span class="info-value">${order.order_type === "walk-in" ? "Walk-in" : "Online"}</span></div>
            </div>
          </div>

          <!-- Items Table -->
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th class="center">Qty</th>
                <th class="right">Unit Price</th>
                <th class="right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>
                    <div class="item-name">${item.name}</div>
                    <div class="item-sku">${item.sku}</div>
                  </td>
                  <td class="center">${item.quantity}</td>
                  <td class="right">₱${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td class="right">₱${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>

          <!-- Totals -->
          <div class="totals-wrap">
            <div class="totals">
              <div class="total-row"><span>Subtotal</span><span>₱${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
              <div class="total-row"><span>Tax</span><span>—</span></div>
              <div class="total-final-wrap">
                <span class="total-label">Total</span>
                <span class="total-amount">₱${order.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <span class="footer-note">${currentConfig.footer_note}</span>
            <span class="footer-ref">${order.order_number}</span>
          </div>

        </div>
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  useEffect(() => {
    const fetchAndPrint = async () => {
      const { data, error } = await supabase
        .from("invoice_config")
        .select("*")
        .single();

      if (error) console.error("Invoicing Error:", error.message);

      const activeConfig = data || DEFAULT_CONFIG;
      handlePrint(activeConfig);
      onClose();
    };

    fetchAndPrint();
  }, []);

  return null;
};

export default InvoiceDownload;
