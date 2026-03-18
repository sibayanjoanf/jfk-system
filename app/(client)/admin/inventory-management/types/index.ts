export interface DbInboundBatch {
  id: string;
  batch_code: string;
  variant_id: string;
  supplier: string | null;
  received_by: string | null;
  quantity: number;
  created_at: string;
}

export interface DbStockAdjustment {
  id: string;
  adjustment_code: string;
  variant_id: string;
  adjustment_type: "add" | "deduct" | "set";
  quantity: number;
  adjusted_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface DbStockMovement {
  id: string;
  variant_id: string;
  movement_type: "inbound" | "adjustment" | "consumed" | "returned";
  quantity_change: number;
  quantity_before: number;
  quantity_after: number;
  reference_type: string | null;
  reference_id: string | null;
  performed_by: string | null;
  created_at: string;
}

export interface StockRow {
  id: string;
  sku: string;
  product_name: string;
  category: string;
  sub_category: string;
  stock_qty: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  last_movement_type: "inbound" | "adjustment" | "consumed" | "returned" | null;
  last_movement_at: string | null;
  image_url: string;
}

export interface InboundRow {
  id: string;
  batch_code: string;
  sku: string;
  product_name: string;
  quantity: number;
  supplier: string | null;
  received_by: string | null;
  created_at: string;
}

export interface AdjustmentRow {
  id: string;
  adjustment_code: string;
  sku: string;
  product_name: string;
  adjustment_type: "add" | "deduct" | "set";
  quantity: number;
  adjusted_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface MovementRow {
  id: string;
  sku: string;
  product_name: string;
  movement_type: "inbound" | "adjustment" | "consumed" | "returned";
  quantity_change: number;
  quantity_before: number;
  quantity_after: number;
  reference_type: string | null;
  performed_by: string | null;
  created_at: string;
}

export interface InboundForm {
  variant_id: string;
  quantity: string;
  supplier: string;
  received_by: string;
}

export interface AdjustmentForm {
  variant_id: string;
  adjustment_type: "add" | "deduct" | "set" | "";
  quantity: string;
  notes: string;
  adjusted_by: string;
}

export type TabType = "overview" | "inbound" | "adjustments" | "audit";

export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export const emptyInboundForm = (): InboundForm => ({
  variant_id: "",
  quantity: "",
  supplier: "",
  received_by: "",
});

export const emptyAdjustmentForm = (): AdjustmentForm => ({
  variant_id: "",
  adjustment_type: "",
  quantity: "",
  notes: "",
  adjusted_by: "",
});