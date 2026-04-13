export type UserRole = "super_admin" | "admin" | "manager" | "inventory_staff" | "staff";
export type UserStatus = "pending" | "active" | "inactive" | "archived";

export interface OrderPermissions {
  view: boolean;
  create: boolean;
  change_status: boolean;
  cancel: boolean;
  refund: boolean;
  archive: boolean;
}

export interface InquiryPermissions {
  view: boolean;
  reply: boolean;
  archive: boolean;
}

export interface UserPermissions {
  dashboard: boolean;
  orders: OrderPermissions;
  products: boolean;
  inventory: boolean;
  sales_report: boolean;
  inquiries: InquiryPermissions;
  user_management: boolean;
  system_settings: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  contact: string | null;
  role: UserRole | null;
  status: UserStatus;
  permissions: UserPermissions;
  created_at: string;
  updated_at: string;
}

export const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  super_admin: {
    dashboard: true,
    orders: { view: true, create: true, change_status: true, cancel: true, refund: true, archive: true },
    products: true,
    inventory: true,
    sales_report: true,
    inquiries: { view: true, reply: true, archive: true },
    user_management: true,
    system_settings: true,
  },
  admin: {
    dashboard: true,
    orders: { view: true, create: true, change_status: true, cancel: true, refund: true, archive: true },
    products: true,
    inventory: true,
    sales_report: true,
    inquiries: { view: true, reply: true, archive: true },
    user_management: false,
    system_settings: true,
  },
  manager: {
    dashboard: true,
    orders: { view: true, create: true, change_status: true, cancel: true, refund: true, archive: false },
    products: false,
    inventory: false,
    sales_report: true,
    inquiries: { view: true, reply: true, archive: true },
    user_management: false,
    system_settings: true,
  },
  inventory_staff: {
    dashboard: true,
    orders: { view: false, create: false, change_status: false, cancel: false, refund: false, archive: false },
    products: true,
    inventory: true,
    sales_report: false,
    inquiries: { view: false, reply: false, archive: false },
    user_management: false,
    system_settings: false,
  },
  staff: {
    dashboard: true,
    orders: { view: true, create: true, change_status: true, cancel: false, refund: false, archive: false },
    products: false,
    inventory: false,
    sales_report: false,
    inquiries: { view: true, reply: true, archive: false },
    user_management: false,
    system_settings: false,
  },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  manager: "Manager",
  inventory_staff: "Inventory Staff",
  staff: "Staff",
};

export const STATUS_LABELS: Record<UserStatus, string> = {
  pending: "Pending",
  active: "Active",
  inactive: "Inactive",
  archived: "Archived",
};