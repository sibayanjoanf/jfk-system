export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Paid"
  | "Completed"
  | "Cancelled"
  | "Refunded";

export type OrderType = "online" | "walk-in";

export interface OrderItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  order_type: OrderType;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string;
  delivery_preference: string;
  payment_preference: string;
  message: string | null;
  items: OrderItem[];
  refunded_items: OrderItem[];
  total_amount: number;
  created_at: string;
}

export interface OrderRow {
  id: string;
  order_number: string;
  status: OrderStatus;
  order_type: OrderType;
  customer_name: string;
  email: string | null;
  phone: string;
  item_count: number;
  total_amount: number;
  created_at: string;
}

export interface CreateOrderForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  delivery_preference: string;
  payment_preference: string;
  message: string;
  order_type: OrderType;
  items: OrderItem[];
}

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Processing",
  "Paid",
  "Completed",
  "Cancelled",
  "Refunded",
];

export const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending:    "text-orange-500",
  Processing: "text-blue-400",
  Paid:       "text-purple-500",
  Completed:  "text-green-600",
  Cancelled:  "text-gray-500",
  Refunded:   "text-red-600",
};

export const STATUS_DOT_COLORS: Record<OrderStatus, string> = {
  Pending:    "bg-orange-500",
  Processing: "bg-blue-400",
  Paid:       "bg-purple-500",
  Completed:  "bg-green-600",
  Cancelled:  "bg-gray-400",
  Refunded:   "bg-red-600",
};

export const STATUS_BG_COLORS: Record<OrderStatus, string> = {
  Pending:    "bg-orange-500/10",
  Processing: "bg-blue-400/10",
  Paid:       "bg-purple-500/10",
  Completed:  "bg-green-600/10",
  Cancelled:  "bg-gray-100",
  Refunded:   "bg-red-600/10",
};

export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  Pending:    ["Processing", "Cancelled"],
  Processing: ["Paid", "Cancelled"],
  Paid:       ["Completed", "Cancelled"],
  Completed:  ["Refunded"],
  Cancelled:  [],
  Refunded:   [],
};